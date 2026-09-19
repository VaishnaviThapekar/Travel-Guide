import json
import math
import urllib.parse
import urllib.request
from typing import Any

from .catalog import DESTINATION_SUGGESTIONS


def _fetch_json(url: str, params: dict[str, Any] | None = None, timeout: int = 12) -> Any:
    query = urllib.parse.urlencode(params or {})
    request_url = f"{url}?{query}" if query else url
    req = urllib.request.Request(
        request_url,
        headers={"User-Agent": "AI-Travel-Guide/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception:
        return {}


def _weather_condition(code: int | str | None) -> str:
    mapping = {
        0: "Clear sky",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Cloudy",
        45: "Foggy",
        48: "Dense fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Showers",
        81: "Heavy showers",
        82: "Violent showers",
    }
    code_value = int(code) if str(code).isdigit() else None
    return mapping.get(code_value, "Variable conditions")


def _fallback_weather(city: str) -> dict[str, Any]:
    return {
        "city": city or "Destination",
        "forecast": [
            {"day": "Today", "condition": "Partly cloudy", "high_c": 24, "low_c": 17},
            {"day": "Tomorrow", "condition": "Light rain", "high_c": 22, "low_c": 16},
            {"day": "Day 3", "condition": "Mild and sunny", "high_c": 26, "low_c": 18},
        ],
        "source": "fallback",
    }


def build_weather_response(city: str) -> dict[str, Any]:
    city_name = (city or "").strip()
    if not city_name:
        return _fallback_weather(city_name or "Destination")

    geocode = _fetch_json(
        "https://geocoding-api.open-meteo.com/v1/search",
        {
            "name": city_name,
            "count": 1,
            "language": "en",
            "format": "json",
        },
        timeout=10,
    )

    results = geocode.get("results") or []
    if not results:
        return _fallback_weather(city_name)

    place = results[0]
    lat = place.get("latitude")
    lon = place.get("longitude")
    if lat is None or lon is None:
        return _fallback_weather(city_name)

    weather = _fetch_json(
        "https://api.open-meteo.com/v1/forecast",
        {
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min,weather_code",
            "timezone": "auto",
            "forecast_days": 3,
        },
        timeout=10,
    )

    daily = weather.get("daily") or {}
    days = daily.get("time") or []
    highs = daily.get("temperature_2m_max") or []
    lows = daily.get("temperature_2m_min") or []
    codes = daily.get("weather_code") or []

    forecast: list[dict[str, Any]] = []
    labels = ["Today", "Tomorrow", "Day 3"]
    for index, day in enumerate(days[:3]):
        forecast.append(
            {
                "day": labels[index] if index < len(labels) else f"Day {index + 1}",
                "condition": _weather_condition(codes[index] if index < len(codes) else None),
                "high_c": int(round(float(highs[index]))) if index < len(highs) else 24,
                "low_c": int(round(float(lows[index]))) if index < len(lows) else 17,
            }
        )

    if forecast:
        return {
            "city": city_name,
            "forecast": forecast,
            "source": "open-meteo",
        }
    return _fallback_weather(city_name)


def _distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    lat1_r = math.radians(lat1)
    lat2_r = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * radius * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return c


def nearby_places(lat: float, lng: float) -> dict[str, Any]:
    overpass_query = (
        "[out:json][timeout:25];"
        "(node[\"amenity\"](around:2000,{lat},{lng});"
        "node[\"tourism\"](around:2000,{lat},{lng});"
        "node[\"shop\"](around:2000,{lat},{lng}););"
        "out center 8;"
    ).format(lat=lat, lng=lng)

    payload = _fetch_json(
        "https://overpass-api.de/api/interpreter",
        {"data": overpass_query},
        timeout=12,
    )

    elements = payload.get("elements") or []
    places: list[dict[str, Any]] = []
    for item in elements[:8]:
        tags = item.get("tags") or {}
        name = tags.get("name") or tags.get("amenity") or tags.get("tourism") or tags.get("shop") or "Nearby spot"
        lat_value = item.get("lat")
        lon_value = item.get("lon")
        if lat_value is None or lon_value is None:
            lat_value = item.get("center", {}).get("lat")
            lon_value = item.get("center", {}).get("lon")
        if lat_value is None or lon_value is None:
            continue
        category = tags.get("amenity") or tags.get("tourism") or tags.get("shop") or "landmark"
        places.append(
            {
                "name": name,
                "category": category,
                "distance_km": round(_distance_km(float(lat), float(lng), float(lat_value), float(lon_value)), 1),
                "lat": float(lat_value),
                "lng": float(lon_value),
            }
        )

    if places:
        return {"center": {"lat": lat, "lng": lng}, "places": places, "source": "overpass"}

    return {
        "center": {"lat": lat, "lng": lng},
        "places": [
            {"name": "City Museum", "category": "museum", "distance_km": 0.8, "lat": lat, "lng": lng},
            {"name": "Old Town Market", "category": "market", "distance_km": 1.2, "lat": lat, "lng": lng},
            {"name": "Riverside Cafe", "category": "restaurant", "distance_km": 0.4, "lat": lat, "lng": lng},
        ],
        "source": "fallback",
    }


def search_places(query: str = "") -> dict[str, Any]:
    q = (query or "").strip()
    if not q:
        return {"query": q, "results": [], "source": "fallback"}

    nominatim = _fetch_json(
        "https://nominatim.openstreetmap.org/search",
        {
            "q": q,
            "format": "jsonv2",
            "limit": 5,
            "addressdetails": 1,
        },
        timeout=12,
    )

    results: list[dict[str, Any]] = []
    for item in nominatim[:5]:
        display_name = item.get("display_name") or item.get("name") or q
        category = item.get("type") or "poi"
        results.append(
            {
                "name": display_name.split(",")[0].strip(),
                "category": category,
                "lat": float(item.get("lat", 0.0)),
                "lng": float(item.get("lon", 0.0)),
            }
        )

    if results:
        return {"query": q, "results": results, "source": "nominatim"}

    for key, items in DESTINATION_SUGGESTIONS.items():
        if q.lower() in key.lower() or key.lower().startswith(q.lower()):
            return {
                "query": q,
                "results": [{"name": name, "category": "poi"} for name in items[:5]],
                "source": "fallback",
            }

    return {"query": q, "results": [], "source": "fallback"}


def build_route(stops: list[str]) -> dict[str, Any]:
    route: list[dict[str, Any]] = []
    previous: dict[str, Any] | None = None
    for stop in stops[:8]:
        result = search_places(stop)
        place = (result.get("results") or [None])[0]
        if not place:
            continue
        distance = 0.0
        if previous and place.get("lat") is not None and previous.get("lat") is not None:
            distance = round(_distance_km(float(previous["lat"]), float(previous["lng"]), float(place["lat"]), float(place["lng"])), 1)
        route.append(
            {
                "name": place.get("name") or stop,
                "category": place.get("category") or "stop",
                "lat": place.get("lat"),
                "lng": place.get("lng"),
                "distance_km": distance,
                "travel_time_min": max(5, round(distance / 22 * 60)) if distance else 10,
                "mode": "walk or local transport",
                "source": result.get("source", "fallback"),
            }
        )
        previous = place
    return {"stops": route, "source": "nominatim-sequenced-route" if route else "fallback"}
