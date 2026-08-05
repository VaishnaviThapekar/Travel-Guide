from datetime import date
import os
import sys

# Ensure backend package is importable when running tests from workspace root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.planner import TripPlannerAgent
from app.schemas import TripRequest


def test_generate_basic_itinerary():
    agent = TripPlannerAgent()
    req = TripRequest(
        destination="Lisbon",
        start_date=date(2026, 7, 10),
        end_date=date(2026, 7, 12),
        budget=600,
        style="Balanced",
        interests=["food", "history"],
    )

    plan = agent.generate(req)
    assert isinstance(plan, dict)
    assert 'itinerary' in plan
    assert len(plan['itinerary']) == 3
    first = plan['itinerary'][0]
    assert 'morning' in first and 'afternoon' in first and 'evening' in first
    assert 'budget_breakdown' in plan and 'daily_budget' in plan['budget_breakdown']
