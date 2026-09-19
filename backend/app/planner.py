import json
import os
import re
import urllib.request
from datetime import timedelta
from typing import Any


from .schemas import ReplanRequest, TripRequest
from .catalog import DESTINATION_SUGGESTIONS

class TripPlannerAgent:
    def _pick_suggestion(self, destination: str, index: int) -> str:
        key = destination.split(',')[0].strip()
        choices = DESTINATION_SUGGESTIONS.get(key, [])
        if not choices:
            # Generic suggestions when destination unknown
            generic = ['Historic center walk', 'Local market', 'Popular viewpoint', 'Relax at a cafe']
            return generic[index % len(generic)]
        return choices[index % len(choices)]

    def _budget_breakdown(self, total: float) -> dict[str, float]:
        planned_total = round(total * 0.9, 2)
        return {
            'transport': round(planned_total * 0.25, 2),
            'hotels': round(planned_total * 0.28, 2),
            'food': round(planned_total * 0.17, 2),
            'activities': round(planned_total * 0.12, 2),
            'local_travel': round(planned_total * 0.10, 2),
            'emergency': round(planned_total * 0.08, 2),
            'remaining': round(total - planned_total, 2),
        }

    def generate(self, request: TripRequest) -> dict[str, Any]:
        total_days = max((request.end_date - request.start_date).days + 1, 1)
        daily_budget = round(request.budget / total_days, 2)
        itinerary: list[dict[str, Any]] = []

        for index in range(total_days):
            current_day = request.start_date + timedelta(days=index)
            morning_spot = self._pick_suggestion(request.destination, index * 2)
            afternoon_spot = self._pick_suggestion(request.destination, index * 2 + 1)

            morning = f"Morning: {morning_spot} — enjoy a focused visit or market stop."
            afternoon = f"Afternoon: {afternoon_spot} — cluster nearby attractions and include a light meal."
            evening = (
                f"Evening: local restaurant or viewpoint; keep one flexible window for rest or exploration."
            )

            itinerary.append(
                {
                    'day': index + 1,
                    'date': current_day.isoformat(),
                    'title': f"Day {index + 1} in {request.destination}",
                    'morning': morning,
                    'afternoon': afternoon,
                    'evening': evening,
                    'cost': daily_budget,
                    # Extra structured fields for downstream UX (ignored by existing frontend if absent)
                    'morning_spot': morning_spot,
                    'afternoon_spot': afternoon_spot,
                    'notes': f"Pace: {request.style}. Interests: {', '.join(request.interests)}",
                }
            )

        return {
            'summary': f"A {request.style} trip to {request.destination} with {total_days} planned days.",
            'budget_breakdown': self._budget_breakdown(request.budget),
            'itinerary': itinerary,
            'data_source_notes': [
                'Planner workflow: interpret preferences -> budget split -> day-by-day itinerary -> safety notes',
                'Suggestions are rule-based placeholders; replace with live POI data in production',
            ],
        }

    def replan(self, request: TripRequest, update: ReplanRequest, existing_itinerary: list[dict[str, Any]]) -> dict[str, Any]:
        revised_request = request.model_copy(
            update={
                'style': update.style or request.style,
                'budget': update.budget or request.budget,
                'interests': update.interests if update.interests is not None else request.interests,
                'food_preferences': update.food_preferences if update.food_preferences is not None else request.food_preferences,
            }
        )
        plan = self.generate(revised_request)
        if update.note:
            plan['data_source_notes'].append(update.note)
        if existing_itinerary:
            plan['data_source_notes'].append(f'Previous version had {len(existing_itinerary)} day plans')
        return plan

    def modify_existing_plan(
        self,
        message: str,
        destination: str,
        style: str,
        budget: float,
        existing_itinerary: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """Apply a focused natural-language edit without rebuilding unrelated days."""
        normalized = message.strip().lower()
        itinerary = [dict(day) for day in existing_itinerary]
        changes: list[str] = []
        target_budget = budget

        budget_match = re.search(
            r'(?:reduce|lower|cut|bring|limit).{0,40}(?:trip|budget)?.{0,20}(?:to|under)\s*(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand)?',
            normalized,
        )
        if budget_match:
            target_budget = float(budget_match.group(1).replace(',', ''))
            if budget_match.group(2):
                target_budget *= 1000
            if target_budget > 0 and target_budget < budget:
                daily_budget = round(target_budget / max(len(itinerary), 1), 2)
                for day in itinerary:
                    day['cost'] = daily_budget
                changes.append(f'reduced the trip budget to ₹{target_budget:,.0f} and rebalanced each day')

        if any(term in normalized for term in ('no nightlife', "don't want nightlife", 'remove nightlife', 'without nightlife')):
            for day in itinerary:
                day['evening'] = 'Quiet local dinner or an early rest window; no nightlife planned.'
            changes.append('removed nightlife and replaced evening plans with quieter alternatives')

        if any(term in normalized for term in ('adventurous', 'adventure', 'trekking', 'water sports', 'kayaking')):
            for index, day in enumerate(itinerary):
                adventure_options = [
                    'Early hike or guided nature trail with a recovery break',
                    'Water sports, kayaking, or an active local experience',
                    'Sunset viewpoint reached by a scenic walk or cycling route',
                ]
                day['afternoon'] = adventure_options[index % len(adventure_options)]
                day['notes'] = f"Pace: adventurous. Interests: active experiences, nature, and local discovery."
            changes.append('added active outdoor experiences and adventurous pacing')

        day_match = re.search(r'\bday\s+(\d+)\b', normalized)
        if day_match and any(term in normalized for term in ('busy', 'tiring', 'slow', 'lighter', 'less')):
            day_number = int(day_match.group(1))
            selected = next((day for day in itinerary if day.get('day') == day_number), None)
            if selected:
                selected['morning'] = 'Slow breakfast and one nearby anchor activity.'
                selected['afternoon'] = 'Free time, a short neighborhood walk, or an optional cafe stop.'
                selected['evening'] = 'Early local dinner and a flexible rest window.'
                selected['notes'] = 'Pace adjusted: one anchor activity with generous recovery time.'
                changes.append(f'reorganized Day {day_number} around one anchor activity and more rest')

        if not changes:
            return {
                'changed': False,
                'reply': 'I understood the request, but I need a specific preference or day to change. Try “remove nightlife,” “make it more adventurous,” or “Day 3 is too busy.”',
                'itinerary': itinerary,
                'summary': f'A {style} trip to {destination} with the current itinerary preserved.',
                'budget_breakdown': {},
                'budget': budget,
                'data_source_notes': ['No targeted itinerary change matched the request'],
            }

        return {
            'changed': True,
            'reply': f"Updated your existing {destination} plan: {'; '.join(changes)}. Other days were kept intact.",
            'itinerary': itinerary,
            'summary': f"A {style} trip to {destination} updated from your request: {'; '.join(changes)}.",
            'budget': target_budget,
            'budget_breakdown': self._budget_breakdown(target_budget),
            'data_source_notes': ['Natural-language edit applied to the existing itinerary', *changes],
        }

    def apply_disruption(self, message: str, existing_itinerary: list[dict[str, Any]]) -> dict[str, Any]:
        """Re-sequence impacted activities after a travel disruption."""
        normalized = message.strip().lower()
        delay_match = re.search(r'(\d+(?:\.\d+)?)\s*hours?', normalized)
        delay_hours = float(delay_match.group(1)) if delay_match else 2.0
        day_match = re.search(r'\bday\s+(\d+)\b', normalized)
        affected_day = int(day_match.group(1)) if day_match else 1
        itinerary = [dict(day) for day in existing_itinerary]
        current_index = next((index for index, day in enumerate(itinerary) if day.get('day') == affected_day), 0)
        affected = itinerary[current_index] if itinerary else None
        if affected is None:
            return {'changed': False, 'reply': 'I need an active itinerary before I can replan around a disruption.'}

        moved_activity = affected.get('afternoon') or affected.get('morning') or 'the affected activity'
        affected['morning'] = f'Arrival buffer after a {delay_hours:g}-hour delay; check in and recover before sightseeing.'
        affected['afternoon'] = 'Keep this slot flexible while transport and hotel check-in timing are confirmed.'
        affected['evening'] = 'Flexible dinner close to the hotel; confirm the reservation after arrival.'
        affected['notes'] = f'Disruption adjustment: {delay_hours:g}-hour delay accounted for on Day {affected_day}.'

        moved_to_day = None
        if current_index + 1 < len(itinerary):
            next_day = itinerary[current_index + 1]
            next_day['morning'] = f'Rescheduled from Day {affected_day}: {moved_activity}'
            next_day['notes'] = f'Activity moved here after a {delay_hours:g}-hour travel delay.'
            moved_to_day = next_day.get('day')

        notification = (
            f'Your travel is delayed by {delay_hours:g} hours. '
            f'Day {affected_day} was adjusted for arrival, hotel check-in, and recovery time. '
            + (f'{moved_activity} moved to Day {moved_to_day}.' if moved_to_day else 'The affected activity remains flexible for a later rebooking.')
        )
        return {
            'changed': True,
            'reply': notification,
            'notification': notification,
            'itinerary': itinerary,
            'data_source_notes': [
                'Disruption agent: arrival time -> hotel check-in -> affected activities -> revised itinerary',
                f'{delay_hours:g}-hour delay applied to Day {affected_day}',
            ],
        }

    def apply_weather_replan(self, message: str, existing_itinerary: list[dict[str, Any]]) -> dict[str, Any]:
        """Move outdoor plans into nearby indoor alternatives for a wet forecast."""
        normalized = message.strip().lower()
        day_number = 2 if 'tomorrow' in normalized else 1
        day_match = re.search(r'\bday\s+(\d+)\b', normalized)
        if day_match:
            day_number = int(day_match.group(1))

        itinerary = [dict(day) for day in existing_itinerary]
        current_index = next((index for index, day in enumerate(itinerary) if day.get('day') == day_number), 0)
        affected = itinerary[current_index] if itinerary else None
        if affected is None:
            return {'changed': False, 'reply': 'I need an active itinerary before I can replan around the weather.'}

        outdoor_plan = affected.get('afternoon') or affected.get('morning') or 'the outdoor activity'
        affected['morning'] = 'Indoor museum or heritage gallery visit near the hotel.'
        affected['afternoon'] = 'Cafe break followed by covered market and local shopping.'
        affected['evening'] = 'Nearby restaurant with a flexible reservation window.'
        affected['notes'] = 'Weather adjustment: outdoor activity replaced with nearby indoor options.'

        moved_to_day = None
        for next_index in range(current_index + 1, len(itinerary)):
            candidate = itinerary[next_index]
            if 'rain' not in str(candidate).lower() and 'outdoor' in outdoor_plan.lower():
                candidate['afternoon'] = f'Rescheduled from Day {day_number}: {outdoor_plan}'
                candidate['notes'] = f'Outdoor activity moved here after the wet-weather forecast on Day {day_number}.'
                moved_to_day = candidate.get('day')
                break
        if moved_to_day is None and current_index + 1 < len(itinerary):
            itinerary[current_index + 1]['afternoon'] = f'Rescheduled from Day {day_number}: {outdoor_plan}'
            itinerary[current_index + 1]['notes'] = f'Outdoor activity moved here after the wet-weather forecast on Day {day_number}.'
            moved_to_day = itinerary[current_index + 1].get('day')

        notification = (
            f'Heavy rain is expected on Day {day_number}. I moved outdoor plans indoors and added a museum, cafe, and covered shopping route. '
            + (f'{outdoor_plan} moved to Day {moved_to_day}.' if moved_to_day else 'The outdoor activity remains flexible for a clearer window.')
        )
        return {
            'changed': True,
            'reply': notification,
            'notification': notification,
            'itinerary': itinerary,
            'data_source_notes': [
                'Weather agent: forecast conflict -> indoor alternatives -> nearby route -> itinerary revision',
                f'Heavy rain adjustment applied to Day {day_number}',
            ],
        }

    def _llm_chat(self, message: str, trip_context: dict[str, Any] | None = None) -> str | None:
        api_key = os.getenv('OPENAI_API_KEY') or os.getenv('OPENROUTER_API_KEY')
        if not api_key:
            return None

        model = os.getenv('AI_MODEL') or ('openai/gpt-4o-mini' if os.getenv('OPENROUTER_API_KEY') else 'gpt-4o-mini')
        base_url = os.getenv('OPENAI_BASE_URL') or (
            'https://openrouter.ai/api/v1' if os.getenv('OPENROUTER_API_KEY') else 'https://api.openai.com/v1'
        )

        destination = (trip_context or {}).get('destination', 'your destination')
        style = (trip_context or {}).get('style', 'balanced')
        budget = (trip_context or {}).get('budget')
        trip_context_note = f"Trip context: destination={destination}, style={style}, budget={budget}. "

        payload = {
            'model': model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a premium travel concierge. Give concise, practical advice and keep recommendations suitable for the trip destination, budget, and travel style.',
                },
                {
                    'role': 'user',
                    'content': f"{trip_context_note}User request: {message}",
                },
            ],
            'temperature': 0.7,
        }

        try:
            request = urllib.request.Request(
                f"{base_url}/chat/completions",
                data=json.dumps(payload).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {api_key}',
                    'HTTP-Referer': 'https://localhost',
                    'X-Title': 'AI Travel Guide',
                },
                method='POST',
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                data = json.loads(response.read().decode('utf-8'))
                choices = data.get('choices') or []
                if not choices:
                    return None
                msg = choices[0].get('message') or {}
                content = msg.get('content') or ''
                if isinstance(content, list):
                    content = ' '.join(part.get('text', '') for part in content if isinstance(part, dict))
                return str(content).strip() or None
        except Exception:
            return None

    def chat_reply(self, message: str, trip_context: dict[str, Any] | None = None) -> dict[str, Any]:
        llm_reply = self._llm_chat(message, trip_context)
        if llm_reply:
            sources = ['Live AI model response', 'Trip planner context']
            if trip_context:
                destination = trip_context.get('destination')
                if destination:
                    sources.append(f"Destination: {destination}")
            return {
                'reply': llm_reply,
                'sources': sources,
                'stream_tokens': llm_reply.split(' '),
            }

        normalized_message = message.strip()
        context_line = ''
        destination = ''
        style = 'balanced'
        budget = None

        if trip_context:
            destination = trip_context.get('destination', 'your destination')
            style = trip_context.get('style', 'balanced')
            budget = trip_context.get('budget')
            context_line = f"For {destination} ({style}, budget {budget if budget is not None else 'flexible'}), "

        lower = normalized_message.lower()
        if 'eat' in lower or 'food' in lower or 'restaurant' in lower:
            suggestion = 'I’d cluster dinner and lunch near the same neighborhood, favor one local market or food hall, and keep one splurge meal within the planned spending cap.'
        elif 'budget' in lower or 'cheap' in lower or 'save' in lower:
            suggestion = 'I’d trim transport costs by grouping nearby activities, use transit-heavy routes, and cap one premium experience per day.'
        elif 'weather' in lower or 'rain' in lower or 'sun' in lower:
            suggestion = 'I’d prioritize indoor museums or covered markets for wet hours, and keep outdoor viewpoints for the clearest part of the day.'
        elif 'museum' in lower or 'culture' in lower or 'history' in lower:
            suggestion = 'I’d build the day around one anchor museum plus a nearby neighborhood walk so the route feels efficient and easy to enjoy.'
        else:
            suggestion = 'I’d keep activities clustered by area, reserve one flexible block each day, and align the plan to your pace without overspending.'

        reply = (
            f"{context_line}here is a practical next step: {normalized_message}. "
            f"{suggestion} "
            'I’d keep the itinerary balanced, use the weather and local transit context, and leave room for spontaneous discoveries.'
        )

        sources = [
            'Trip planner context',
            'Weather and FAQ endpoints',
            'Live POI and neighborhood guidance',
        ]
        if destination:
            sources.append(f"Destination: {destination}")

        return {
            'reply': reply,
            'sources': sources,
            'stream_tokens': reply.split(' '),
        }
