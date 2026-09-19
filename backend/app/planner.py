import json
import os
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
            'budget_breakdown': {
                'lodging': round(request.budget * 0.4, 2),
                'food': round(request.budget * 0.25, 2),
                'activities': round(request.budget * 0.2, 2),
                'transport': round(request.budget * 0.15, 2),
                'daily_budget': daily_budget,
            },
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
