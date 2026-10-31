from datetime import date
from io import BytesIO
import os
import sys
from uuid import uuid4

# Ensure backend package is importable when running tests from workspace root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient

from app.main import app
from app.planner import TripPlannerAgent
from app.travel_api import build_weather_response, nearby_places, search_places


client = TestClient(app)


def _auth_headers() -> dict[str, str]:
    response = client.post(
        "/auth/signup",
        json={"email": f"{uuid4().hex}@example.com", "password": "correct-horse-battery"},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


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

    response = client.post("/trips", json=payload, headers=_auth_headers())
    assert response.status_code == 200
    data = response.json()
    assert data.get('destination') == 'Lisbon'
    assert 'itinerary' in data and len(data['itinerary']) == 3


def test_weather_response_has_live_forecast_shape():
    payload = build_weather_response("Lisbon")
    assert payload['city'] == 'Lisbon'
    assert len(payload['forecast']) >= 3
    assert payload['source'] in {'open-meteo', 'fallback'}
    assert payload['status'] in {'live_forecast', 'unavailable'}
    assert 'observed_at' in payload


def test_map_integrations_reject_invalid_or_empty_searches():
    assert search_places('')['status'] == 'empty_query'
    invalid = nearby_places(120, 400)
    assert invalid['status'] == 'invalid_coordinates'
    assert invalid['places'] == []


def test_chat_reply_uses_trip_context_for_richer_response():
    planner = TripPlannerAgent()
    result = planner.chat_reply('Where should we eat in Lisbon?', {'destination': 'Lisbon', 'style': 'Balanced', 'budget': 1200})
    assert 'Lisbon' in result['reply']
    assert 'eat' in result['reply'].lower()
    assert len(result['sources']) >= 2


def test_trip_access_is_limited_to_the_owner():
    owner_headers = _auth_headers()
    other_headers = _auth_headers()
    payload = {
        "destination": "Jaipur",
        "start_date": "2026-07-10",
        "end_date": "2026-07-12",
        "budget": 1200,
        "style": "Balanced",
    }

    created = client.post("/trips", json=payload, headers=owner_headers)
    assert created.status_code == 200
    trip_id = created.json()["trip_id"]

    assert client.get(f"/trips/{trip_id}").status_code == 401
    assert client.get(f"/trips/{trip_id}", headers=other_headers).status_code == 403
    assert client.patch(
        f"/trips/{trip_id}/replan",
        json={"budget": 500},
        headers=other_headers,
    ).status_code == 403
    assert client.get("/trips", headers=other_headers).json() == []
    assert client.get("/trips", headers=owner_headers).json()[0]["trip_id"] == trip_id


def test_upload_requires_safe_type_and_size_limit():
    headers = _auth_headers()
    blocked = client.post(
        "/uploads",
        files={"file": ("payload.exe", BytesIO(b"not allowed"), "application/octet-stream")},
        headers=headers,
    )
    assert blocked.status_code == 415

    accepted = client.post(
        "/uploads",
        files={"file": ("notes.txt", BytesIO(b"packing list"), "text/plain")},
        headers=headers,
    )
    assert accepted.status_code == 200
    file_path = accepted.json()["file_path"]
    assert file_path.endswith(".upload")
    if os.path.exists(file_path):
        os.remove(file_path)


def test_goa_replan_preserves_original_revision_and_recalculates_budget():
    headers = _auth_headers()
    payload = {
        "destination": "Goa",
        "start_date": "2026-11-10",
        "end_date": "2026-11-12",
        "budget": 9000,
        "style": "slow",
        "interests": ["food", "culture"],
        "food_preferences": ["vegetarian"],
    }
    created = client.post("/trips", json=payload, headers=headers)
    assert created.status_code == 200
    trip_id = created.json()["trip_id"]
    original = created.json()

    revised = client.patch(
        f"/trips/{trip_id}/replan",
        json={"budget": 6000, "note": "Reduced budget for the Goa trip"},
        headers=headers,
    )
    assert revised.status_code == 200
    revised_data = revised.json()
    assert revised_data["version"] == 2
    assert len(revised_data["itinerary"]) == 3
    assert revised_data["budget"] == 6000
    assert revised_data["budget_breakdown"]["estimated_total"] <= 6000

    revisions = client.get(f"/trips/{trip_id}/revisions", headers=headers)
    assert revisions.status_code == 200
    assert [item["version"] for item in revisions.json()] == [2, 1]
    assert revisions.json()[-1]["payload"]["request"]["budget"] == original["budget"]


def test_duplicate_trip_submission_returns_existing_trip():
    headers = _auth_headers()
    payload = {
        "destination": "Goa",
        "start_date": "2026-12-01",
        "end_date": "2026-12-03",
        "budget": 5000,
        "style": "balanced",
    }
    first = client.post("/trips", json=payload, headers=headers)
    second = client.post("/trips", json=payload, headers=headers)
    assert first.status_code == second.status_code == 200
    assert first.json()["trip_id"] == second.json()["trip_id"]


def test_stale_replan_is_rejected_and_trip_can_be_deleted():
    headers = _auth_headers()
    created = client.post(
        "/trips",
        json={"destination": "Jaipur", "start_date": "2026-12-01", "end_date": "2026-12-01", "budget": 1000},
        headers=headers,
    )
    trip_id = created.json()["trip_id"]
    assert client.patch(
        f"/trips/{trip_id}/replan",
        json={"budget": 900, "expected_version": 99},
        headers=headers,
    ).status_code == 409
    assert client.delete(f"/trips/{trip_id}", headers=headers).status_code == 204
    assert client.get(f"/trips/{trip_id}", headers=headers).status_code == 404


def test_profile_persists_after_reauth():
    email = f"{uuid4().hex}@example.com"
    password = "correct-horse-battery"
    signup = client.post("/auth/signup", json={"email": email, "password": password})
    headers = {"Authorization": f"Bearer {signup.json()['access_token']}"}
    profile = {
        "budget_range": "budget",
        "interests": ["food", "heritage"],
        "food_preferences": ["vegetarian"],
        "travel_style": "slow",
        "preferred_transport": ["train"],
    }
    assert client.patch("/profile", json={"profile": profile}, headers=headers).status_code == 200
    login = client.post("/auth/login", json={"email": email, "password": password})
    reauth_headers = {"Authorization": f"Bearer {login.json()['access_token']}"}
    assert client.get("/profile", headers=reauth_headers).json()["profile"] == profile


def test_compare_destinations_endpoint():
    payload = {
        "first_destination": "Goa",
        "second_destination": "Kerala",
        "budget": 30000,
        "duration_days": 5,
    }
    response = client.post("/destinations/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "options" in data
    assert len(data["options"]) == 2
    assert data["options"][0]["destination"] == "Goa"
    assert data["options"][1]["destination"] == "Kerala"


def test_eco_recommendations_endpoint():
    response = client.get("/travel/eco?destination=Jaipur")
    assert response.status_code == 200
    data = response.json()
    assert data["destination"] == "Jaipur"
    assert data["mode"] == "eco-friendly"
    assert len(data["priorities"]) >= 3


def test_group_plan_endpoint():
    payload = {
        "destination": "Goa",
        "budget": 50000,
        "duration_days": 4,
        "travelers": [
            {"name": "Alice", "preference": "relaxing"},
            {"name": "Bob", "preference": "adventure"},
        ],
    }
    response = client.post("/destinations/group-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["destination"] == "Goa"
    assert "Alice" in data["constraints_applied"]
    assert "Bob" in data["constraints_applied"]


def test_add_trip_expense_handles_currency_and_categories():
    headers = _auth_headers()
    created = client.post(
        "/trips",
        json={"destination": "Jaipur", "start_date": "2026-10-10", "end_date": "2026-10-12", "budget": 10000},
        headers=headers,
    )
    trip_id = created.json()["trip_id"]

    expense_resp = client.post(
        f"/trips/{trip_id}/expenses",
        json={"message": "dinner on day 2 ₹850"},
        headers=headers,
    )
    assert expense_resp.status_code == 200
    res_data = expense_resp.json()
    assert res_data["category"] == "Food"
    assert res_data["entry"]["amount_inr"] == 850.0

    journal_resp = client.get(f"/trips/{trip_id}/journal", headers=headers)
    assert journal_resp.status_code == 200
    assert len(journal_resp.json()["entries"]) == 1
    assert journal_resp.json()["entries"][0]["amount_inr"] == 850.0
