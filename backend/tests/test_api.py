from datetime import date
import os
import sys

# Ensure backend package is importable when running tests from workspace root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient

from app.main import app
from app.planner import TripPlannerAgent
from app.travel_api import build_weather_response


client = TestClient(app)


def test_create_trip_endpoint():
    payload = {
        "destination": "Lisbon",
        "start_date": "2026-07-10",
        "end_date": "2026-07-12",
        "budget": 600,
        "style": "Balanced",
        "interests": ["food", "history"],
        "food_preferences": [],
    }

    response = client.post("/trips", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data.get('destination') == 'Lisbon'
    assert 'itinerary' in data and len(data['itinerary']) == 3


def test_weather_response_has_live_forecast_shape():
    payload = build_weather_response("Lisbon")
    assert payload['city'] == 'Lisbon'
    assert len(payload['forecast']) >= 3
    assert payload['source'] in {'open-meteo', 'fallback'}


def test_chat_reply_uses_trip_context_for_richer_response():
    planner = TripPlannerAgent()
    result = planner.chat_reply('Where should we eat in Lisbon?', {'destination': 'Lisbon', 'style': 'Balanced', 'budget': 1200})
    assert 'Lisbon' in result['reply']
    assert 'eat' in result['reply'].lower()
    assert len(result['sources']) >= 2
