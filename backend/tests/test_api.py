from datetime import date
import os
import sys

# Ensure backend package is importable when running tests from workspace root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient

from app.main import app


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
