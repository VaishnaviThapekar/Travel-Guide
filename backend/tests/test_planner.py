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


def test_goa_three_day_budget_and_indoor_replan_changes_every_day():
    agent = TripPlannerAgent()
    request = TripRequest(
        destination='Goa',
        start_date=date(2026, 11, 10),
        end_date=date(2026, 11, 12),
        budget=9000,
        style='slow',
        interests=['food', 'culture'],
        food_preferences=['vegetarian'],
        preferred_transport=['bus', 'walking'],
        mobility_needs=['avoid steep stairs'],
    )

    original = agent.generate(request)
    assert len(original['itinerary']) == 3
    assert [day['date'] for day in original['itinerary']] == ['2026-11-10', '2026-11-11', '2026-11-12']
    assert all('09:00-12:00' in day['morning'] for day in original['itinerary'])
    assert all('vegetarian' in day['evening'] for day in original['itinerary'])
    assert all('bus, walking' in day['afternoon'] for day in original['itinerary'])

    revised = agent.modify_existing_plan(
        'Reduce the trip budget to 6000 and remove outdoor activities',
        'Goa',
        'slow',
        9000,
        original['itinerary'],
    )
    assert revised['changed'] is True
    assert len(revised['itinerary']) == 3
    assert revised['budget'] == 6000
    assert revised['budget_breakdown']['daily_budget'] == 2000
    assert revised['validation']['estimated_total'] == 6000
    assert all('Outdoor activities removed' in day['notes'] for day in revised['itinerary'])
    assert revised['itinerary'] != original['itinerary']


def test_generate_handles_one_day_leap_day_and_year_boundary():
    agent = TripPlannerAgent()
    for start_date, end_date, expected_dates in [
        (date(2026, 2, 28), date(2026, 2, 28), ['2026-02-28']),
        (date(2028, 2, 28), date(2028, 2, 29), ['2028-02-28', '2028-02-29']),
        (date(2026, 12, 31), date(2027, 1, 1), ['2026-12-31', '2027-01-01']),
    ]:
        plan = agent.generate(TripRequest(destination='Goa', start_date=start_date, end_date=end_date, budget=1000))
        assert [day['date'] for day in plan['itinerary']] == expected_dates


def test_generate_rejects_reversed_dates():
    try:
        TripRequest(destination='Goa', start_date=date(2026, 7, 12), end_date=date(2026, 7, 10), budget=1000)
    except ValueError:
        return
    raise AssertionError('Expected reversed trip dates to be rejected')
