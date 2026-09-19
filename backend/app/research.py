import json
import os
import urllib.parse
import urllib.request
from datetime import date
from typing import Any

from .travel_api import build_weather_response, search_places


def _fetch_json(url: str, params: dict[str, Any] | None = None, timeout: int = 12) -> Any:
    query = urllib.parse.urlencode(params or {})
    request_url = f"{url}?{query}" if query else url
    request = urllib.request.Request(request_url, headers={"User-Agent": "AI-Travel-Guide/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception:
        return {}


def _geocode(destination: str) -> tuple[float, float] | None:
    payload = _fetch_json(
        "https://geocoding-api.open-meteo.com/v1/search",
        {"name": destination, "count": 1, "language": "en", "format": "json"},
    )
    result = (payload.get("results") or [None])[0]
    if not result or result.get("latitude") is None or result.get("longitude") is None:
        return None
    return float(result["latitude"]), float(result["longitude"])


def _nearby_live_places(lat: float, lng: float) -> list[dict[str, Any]]:
    query = (
        "[out:json][timeout:20];"
        "(nwr[\"tourism\"](around:5000,{lat},{lng});"
        "nwr[\"amenity\"=\"restaurant\"](around:5000,{lat},{lng}););"
        "out center tags 30;"
    ).format(lat=lat, lng=lng)
    payload = _fetch_json("https://overpass-api.de/api/interpreter", {"data": query}, timeout=20)
    results: list[dict[str, Any]] = []
    for item in (payload.get("elements") or [])[:20]:
        tags = item.get("tags") or {}
        name = tags.get("name")
        if not name:
            continue
        category = tags.get("tourism") or tags.get("amenity") or "place"
        results.append(
            {
                "name": name,
                "category": category,
                "opening_hours": tags.get("opening_hours"),
                "website": tags.get("website"),
                "source": "openstreetmap-overpass",
            }
        )
    return results


def _optional_provider_status() -> dict[str, dict[str, Any]]:
    return {
        "flights": {
            "available": bool(os.getenv("AMADEUS_CLIENT_ID") and os.getenv("AMADEUS_CLIENT_SECRET")),
            "provider": "Amadeus" if os.getenv("AMADEUS_CLIENT_ID") else None,
            "message": "Configure Amadeus credentials for live flight availability and fares." if not os.getenv("AMADEUS_CLIENT_ID") else "Provider configured; flight search adapter is ready.",
        },
        "trains": {
            "available": bool(os.getenv("INDIAN_RAIL_API_KEY")),
            "provider": "Indian Rail API" if os.getenv("INDIAN_RAIL_API_KEY") else None,
            "message": "Configure an Indian Rail API key for live train availability." if not os.getenv("INDIAN_RAIL_API_KEY") else "Provider configured; train search adapter is ready.",
        },
        "hotels": {
            "available": bool(os.getenv("HOTEL_API_KEY")),
            "provider": "Configured hotel provider" if os.getenv("HOTEL_API_KEY") else None,
            "message": "Configure a hotel provider key for live rates and availability." if not os.getenv("HOTEL_API_KEY") else "Provider configured; hotel search adapter is ready.",
        },
        "events": {
            "available": bool(os.getenv("TICKETMASTER_API_KEY")),
            "provider": "Ticketmaster" if os.getenv("TICKETMASTER_API_KEY") else None,
            "message": "Configure a Ticketmaster key for current events." if not os.getenv("TICKETMASTER_API_KEY") else "Provider configured; event search adapter is ready.",
        },
        "advisories": {
            "available": False,
            "provider": "Government advisory feed",
            "message": "Advisories require a configured government travel-advisory feed before they are shown as current.",
        },
    }


def build_research_report(destination: str, start_date: date | None = None, end_date: date | None = None) -> dict[str, Any]:
    city = destination.strip() or "Jaipur"
    coordinates = _geocode(city)
    weather = build_weather_response(city)
    places = _nearby_live_places(*coordinates) if coordinates else []
    place_search = search_places(city)
    sources = ["open-meteo", weather.get("source", "fallback")]
    if places:
        sources.append("openstreetmap-overpass")
    if place_search.get("source"):
        sources.append(str(place_search["source"]))

    return {
        "destination": city,
        "date_range": {
            "start": start_date.isoformat() if start_date else None,
            "end": end_date.isoformat() if end_date else None,
        },
        "updated_at": date.today().isoformat(),
        "weather": weather,
        "attractions_and_restaurants": places,
        "geocoded_places": place_search.get("results", []),
        "providers": _optional_provider_status(),
        "source_notes": sorted(set(sources)),
        "limitations": [
            "Flight, train, hotel, event, and advisory results are never fabricated when a live provider is not configured.",
            "Opening hours are shown only when mapped by OpenStreetMap contributors.",
        ],
    }
