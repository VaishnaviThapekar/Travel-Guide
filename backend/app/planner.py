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

    def chat_reply(self, message: str, trip_context: dict[str, Any] | None = None) -> dict[str, Any]:
        context_line = ''
        if trip_context:
            destination = trip_context.get('destination', 'your destination')
            style = trip_context.get('style', 'balanced')
            budget = trip_context.get('budget', 'the selected')
            context_line = f"For {destination} ({style}, budget {budget}), "

        reply = (
            f"{context_line}here is a practical next step: {message.strip()}. "
            'I suggest keeping activities clustered by area, reserving one flexible time block each day, '
            'and watching spend against the daily budget target.'
        )

        return {
            'reply': reply,
            'sources': [
                'Trip planner context',
                'Weather and FAQ endpoints',
                'Rule-based assistant placeholder',
            ],
            'stream_tokens': reply.split(' '),
        }
