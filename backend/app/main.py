import base64
import json
import os
import re
import urllib.request
from contextlib import asynccontextmanager
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from .db import SessionLocal, engine
from .models import Base, Trip, TripRevision, User
from .planner import TripPlannerAgent
from .catalog import DESTINATION_SUGGESTIONS
from .travel_api import build_route, build_weather_response, nearby_places, search_places
from .research import build_research_report
from .schemas import (
    ChatRequest,
    ChatResponse,
    ChecklistItem,
    ChecklistUpdate,
    CompareRequest,
    ExpenseRequest,
    GroupPlannerRequest,
    JournalEntry,
    JournalUpdate,
    DisruptionRequest,
    ReplanRequest,
    RevisionResponse,
    TripListItem,
    TripRequest,
    TripResponse,
    UploadMetaResponse,
    UserCreate,
    ForgotPasswordRequest,
    LoginRequest,
    TokenResponse,
    DiscoveryRequest,
    ProfileResponse,
    ProfileUpdate,
    TravelProfile,
)
from .auth import hash_password, verify_password, create_access_token, decode_access_token


planner = TripPlannerAgent()
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="AI Travel Guide API", version="0.2.0", lifespan=lifespan)
Base.metadata.create_all(bind=engine)


def _ensure_owner_column():
    # For existing SQLite DBs, add owner_id column if missing (simple migration for dev)
    try:
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                res = conn.execute("PRAGMA table_info('trips')")
                cols = [row[1] for row in res.fetchall()]
                if 'owner_id' not in cols:
                    conn.execute("ALTER TABLE trips ADD COLUMN owner_id VARCHAR(36)")
    except Exception:
        pass


def _ensure_profile_column():
    try:
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                res = conn.execute("PRAGMA table_info('users')")
                cols = [row[1] for row in res.fetchall()]
                if 'profile_json' not in cols:
                    conn.execute("ALTER TABLE users ADD COLUMN profile_json JSON NOT NULL DEFAULT '{}' ")
    except Exception:
        pass


def _ensure_checklist_column():
    try:
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                res = conn.execute("PRAGMA table_info('trips')")
                cols = [row[1] for row in res.fetchall()]
                if 'checklist_json' not in cols:
                    conn.execute("ALTER TABLE trips ADD COLUMN checklist_json JSON NOT NULL DEFAULT '[]'")
    except Exception:
        pass


def _ensure_journal_column():
    try:
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                res = conn.execute("PRAGMA table_info('trips')")
                cols = [row[1] for row in res.fetchall()]
                if 'journal_json' not in cols:
                    conn.execute("ALTER TABLE trips ADD COLUMN journal_json JSON NOT NULL DEFAULT '[]'")
    except Exception:
        pass


_ensure_owner_column()
_ensure_profile_column()
_ensure_checklist_column()
_ensure_journal_column()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _serialize_trip_context(trip: Trip | None) -> dict[str, Any] | None:
    if trip is None:
        return None
    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "style": trip.style,
        "budget": trip.budget,
        "summary": trip.summary,
    }


def _get_current_user_from_auth_header(authorization: str | None = Header(None)) -> User | None:
    if not authorization:
        return None
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
    except Exception:
        return None
    user_id = decode_access_token(token)
    if not user_id:
        return None
    with SessionLocal() as session:
        return session.get(User, user_id)


@app.get("/health")
def health() -> dict[str, str]:
    with SessionLocal() as session:
        trip_count = session.query(Trip).count()
    return {"status": "ok", "trips": str(trip_count)}


@app.get("/destinations/search")
def search_destinations(q: str = "") -> dict[str, list[dict[str, str]]]:
    catalogue = [
        {"name": "Jaipur, Rajasthan", "region": "North India"},
        {"name": "Delhi, Delhi", "region": "North India"},
        {"name": "Mumbai, Maharashtra", "region": "West India"},
        {"name": "Goa, Goa", "region": "West India"},
        {"name": "Kochi, Kerala", "region": "South India"},
        {"name": "Varanasi, Uttar Pradesh", "region": "North India"},
        {"name": "Udaipur, Rajasthan", "region": "West India"},
    ]
    query = q.lower().strip()
    results = [item for item in catalogue if query in item["name"].lower()]
    return {"results": results or catalogue}


@app.get("/weather")
def weather(city: str = "") -> dict[str, Any]:
    return build_weather_response(city)


@app.get("/maps/nearby")
def nearby(lat: float, lng: float) -> dict[str, Any]:
    return nearby_places(lat, lng)


@app.get("/maps/route")
def route(stops: str = "Hotel,Fort,Museum,Lunch,Beach,Dinner") -> dict[str, Any]:
    return build_route([item.strip() for item in stops.split(',') if item.strip()])


@app.get("/places/search")
def places_search(q: str = "") -> dict[str, Any]:
    return search_places(q)


@app.get("/faq/search")
def faq_search(q: str = "") -> dict[str, list[dict[str, str]]]:
    faqs = [
        {"question": "How should I get around India?", "answer": "Use metro systems in larger cities, app-based taxis for point-to-point trips, and book trains early for intercity travel."},
        {"question": "What should I pack for India?", "answer": "Pack breathable layers, comfortable walking shoes, sun protection, and modest clothing for temples and heritage sites."},
        {"question": "What is the best way to pay?", "answer": "Keep a small amount of Indian rupees for local vendors and transport, while using UPI or cards where they are accepted."},
        {"question": "How should I plan around the weather?", "answer": "India varies by region and season, so check the destination forecast and leave flexibility for monsoon showers or extreme heat."},
    ]
    return {"results": faqs}


@app.get("/research")
def research(destination: str = "Jaipur", start_date: str | None = None, end_date: str | None = None) -> dict[str, Any]:
    try:
        parsed_start = date.fromisoformat(start_date) if start_date else None
        parsed_end = date.fromisoformat(end_date) if end_date else None
    except ValueError as error:
        raise HTTPException(status_code=400, detail="Dates must use YYYY-MM-DD format") from error
    return build_research_report(destination, parsed_start, parsed_end)


def _trip_to_response(trip: Trip) -> TripResponse:
    return TripResponse(
        trip_id=trip.id,
        destination=trip.destination,
        summary=trip.summary,
        budget=trip.budget,
        style=trip.style,
        start_date=trip.start_date,
        end_date=trip.end_date,
        interests=trip.interests_json or [],
        food_preferences=trip.food_preferences_json or [],
        budget_breakdown=trip.budget_breakdown_json or {},
        itinerary=trip.itinerary_json or [],
        data_source_notes=trip.data_source_notes_json or [],
        version=trip.revisions[-1].version if trip.revisions else 1,
        updated_at=trip.updated_at,
    )


def _build_pre_trip_checklist(destination: str) -> list[dict[str, Any]]:
    return [
        {"id": "passport", "label": "Passport or government ID", "category": "Documents", "checked": False},
        {"id": "visa", "label": f"Check visa requirements for {destination}", "category": "Documents", "checked": False},
        {"id": "tickets", "label": "Flight or train tickets", "category": "Bookings", "checked": False},
        {"id": "hotel", "label": "Hotel confirmation", "category": "Bookings", "checked": False},
        {"id": "insurance", "label": "Travel insurance", "category": "Safety", "checked": False},
        {"id": "medicines", "label": "Medicines and prescriptions", "category": "Health", "checked": False},
        {"id": "clothing", "label": "Comfortable, destination-appropriate clothing", "category": "Packing", "checked": False},
        {"id": "chargers", "label": "Chargers, adapters, and power bank", "category": "Packing", "checked": False},
        {"id": "weather", "label": "Weather-specific items: rain layer, sun protection, or warm layer", "category": "Packing", "checked": False},
    ]


def _trip_to_list_item(trip: Trip) -> TripListItem:
    return TripListItem(
        trip_id=trip.id,
        destination=trip.destination,
        summary=trip.summary,
        budget=trip.budget,
        style=trip.style,
        version=trip.revisions[-1].version if trip.revisions else 1,
        updated_at=trip.updated_at,
    )


@app.get("/trips", response_model=list[TripListItem])
def list_trips(current_user: User | None = Depends(_get_current_user_from_auth_header)) -> list[TripListItem]:
    with SessionLocal() as session:
        if current_user:
            trips = session.scalars(select(Trip).where(Trip.owner_id == current_user.id).order_by(Trip.updated_at.desc())).all()
        else:
            trips = session.scalars(select(Trip).order_by(Trip.updated_at.desc())).all()
        return [_trip_to_list_item(trip) for trip in trips]


@app.post("/auth/signup", response_model=TokenResponse)
def signup(payload: UserCreate):
    with SessionLocal() as session:
        existing = session.scalars(select(User).where(User.email == payload.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user_id = f"user_{uuid4().hex[:10]}"
        user = User(id=user_id, email=payload.email, hashed_password=hash_password(payload.password))
        session.add(user)
        session.commit()
        access_token = create_access_token(user_id, expires_delta=timedelta(days=7))
        return TokenResponse(access_token=access_token)


@app.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    with SessionLocal() as session:
        user = session.scalars(select(User).where(User.email == payload.email)).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        access_token = create_access_token(user.id, expires_delta=timedelta(days=7))
        return TokenResponse(access_token=access_token)


@app.post("/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest):
    # MVP: mock password reset by returning a one-time token (in real app email this)
    with SessionLocal() as session:
        user = session.scalars(select(User).where(User.email == payload.email)).first()
        if not user:
            # Don't reveal whether email exists
            return {"status": "ok"}
        reset_token = create_access_token(user.id, expires_delta=timedelta(minutes=30))
        # In real app, send `reset_token` via email. For MVP return token in response for developer usage.
        return {"status": "ok", "reset_token": reset_token}


def _require_user(current_user: User | None) -> User:
    if current_user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return current_user


@app.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User | None = Depends(_get_current_user_from_auth_header)) -> ProfileResponse:
    user = _require_user(current_user)
    return ProfileResponse(email=user.email, profile=TravelProfile(**(user.profile_json or {})))


@app.patch("/profile", response_model=ProfileResponse)
def update_profile(payload: ProfileUpdate, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> ProfileResponse:
    user = _require_user(current_user)
    with SessionLocal() as session:
        persisted_user = session.get(User, user.id)
        if persisted_user is None:
            raise HTTPException(status_code=401, detail="Authentication required")
        persisted_user.profile_json = payload.profile.model_dump()
        session.commit()
        return ProfileResponse(email=persisted_user.email, profile=payload.profile)


@app.post("/destinations/recommend")
def recommend_destinations(payload: DiscoveryRequest) -> dict[str, Any]:
    interests = {item.lower() for item in payload.interests}
    candidates = [
        {"name": "Jaipur", "region": "Rajasthan", "best_for": ["history", "food", "culture"], "season": "October to March"},
        {"name": "Kerala", "region": "South India", "best_for": ["nature", "food", "relaxation"], "season": "November to February"},
        {"name": "Goa", "region": "West India", "best_for": ["beaches", "food", "nightlife"], "season": "November to February"},
        {"name": "Himachal Pradesh", "region": "North India", "best_for": ["mountains", "nature", "adventure"], "season": "March to June"},
        {"name": "Varanasi", "region": "Uttar Pradesh", "best_for": ["history", "culture", "spirituality"], "season": "October to March"},
        {"name": "Mumbai", "region": "Maharashtra", "best_for": ["food", "culture", "city"], "season": "October to February"},
    ]
    ranked = sorted(
        candidates,
        key=lambda item: len(interests.intersection(item["best_for"])),
        reverse=True,
    )
    return {
        "currency": "INR",
        "duration_days": payload.duration_days,
        "results": ranked[:4],
        "reason": "Ranked for your interests, trip length, and India travel season.",
    }


@app.post("/destinations/compare")
def compare_destinations(payload: CompareRequest) -> dict[str, Any]:
    profiles = {
        "goa": {
            "travel_time": "2h flight / 10h train from Mumbai",
            "activities": "Beaches, water sports, heritage lanes",
            "weather": "Warm coast; check monsoon dates",
            "food": "Seafood, Goan-Portuguese, beach cafes",
            "relaxation": "High: easy beach and slow-travel days",
            "cost_factor": 0.86,
        },
        "kerala": {
            "travel_time": "3h flight / 12h train from Mumbai",
            "activities": "Backwaters, tea hills, wildlife, Ayurveda",
            "weather": "Tropical; greener and wetter in monsoon",
            "food": "Kerala sadya, seafood, spices, vegetarian options",
            "relaxation": "Very high: houseboats, wellness, nature",
            "cost_factor": 0.94,
        },
    }


@app.post("/destinations/group-plan")
def group_plan(payload: GroupPlannerRequest) -> dict[str, Any]:
    preferences = [f"{traveler.get('name', 'Traveler')}: {traveler.get('preference', 'flexible')}" for traveler in payload.travelers]
    preference_text = ' · '.join(preferences)
    return {
        "destination": payload.destination,
        "budget": payload.budget,
        "duration_days": payload.duration_days,
        "travelers": payload.travelers,
        "consensus": "Use a balanced base plan with one shared anchor activity each day and optional preference tracks.",
        "plan": [
            "Morning: shared low-cost or public-transport activity",
            "Afternoon: split into preference tracks, then regroup for a meal",
            "Evening: accessible local restaurant with vegetarian options",
        ],
        "constraints_applied": preference_text,
        "budget_strategy": "Reserve 15% for group changes, accessibility needs, and optional activities.",
    }


@app.get("/travel/eco")
def eco_recommendations(destination: str = "Jaipur") -> dict[str, Any]:
    city = destination.split(',')[0].strip() or "Jaipur"
    return {
        "destination": city,
        "mode": "eco-friendly",
        "priorities": [
            "Metro, train, walking, and shared local transport first",
            "Neighborhood businesses and locally owned stays",
            "Fewer long transfers by clustering nearby attractions",
            "Lower-carbon activities such as heritage walks, cycling, and nature trails",
        ],
        "hotel_preference": "Look for verified sustainability practices, refill stations, and efficient transit access.",
    }
    options: list[dict[str, Any]] = []
    for destination in (payload.first_destination, payload.second_destination):
        key = destination.strip().lower()
        profile = profiles.get(key, {
            "travel_time": "Varies by origin and transport",
            "activities": "Local landmarks, food, and neighborhood experiences",
            "weather": "Check the live destination forecast",
            "food": "Regional specialties and local markets",
            "relaxation": "Flexible: tune the itinerary to your pace",
            "cost_factor": 0.9,
        })
        estimated_cost = round(payload.budget * profile["cost_factor"])
        options.append({
            "destination": destination.strip().title(),
            "estimated_cost": estimated_cost,
            "budget_fit": estimated_cost <= payload.budget,
            "travel_time": profile["travel_time"],
            "activities": profile["activities"],
            "weather": profile["weather"],
            "food": profile["food"],
            "relaxation": profile["relaxation"],
        })
    return {
        "currency": "INR",
        "budget": payload.budget,
        "duration_days": payload.duration_days,
        "options": options,
        "note": "Costs are planning estimates; confirm live transport, hotel, and event prices before booking.",
    }


@app.get("/travel/recommendations")
def travel_recommendations(destination: str = "Jaipur", budget: float = 100000) -> dict[str, Any]:
    city = destination.split(',')[0].strip() or "Jaipur"
    return {
        "destination": city,
        "currency": "INR",
        "hotels": [
            {"name": f"{city} Heritage Stay", "area": "Central heritage district", "nightly_inr": round(budget * 0.012), "rating": 4.5},
            {"name": f"{city} Smart Budget Hotel", "area": "Transit-connected neighborhood", "nightly_inr": round(budget * 0.007), "rating": 4.1},
        ],
        "transport": [
            {"mode": "Train", "note": "Best for intercity India routes", "estimated_inr": round(budget * 0.08)},
            {"mode": "Metro and auto", "note": "Best for city days and short hops", "estimated_inr": round(budget * 0.05)},
        ],
        "restaurants": [
            {"name": f"Local {city} thali house", "cuisine": "Regional Indian", "price_band": "₹₹", "area": "Near the heritage route"},
            {"name": "Vegetarian street-food trail", "cuisine": "Local specialties", "price_band": "₹", "area": "Market district"},
        ],
        "route_tip": "Group attractions by neighborhood and keep the hottest part of the day for indoor or shaded stops.",
        "notifications": [
            {"type": "departure", "message": "Add your train or flight details to receive departure reminders."},
            {"type": "check-in", "message": "Hotel check-in and reservation reminders will appear here."},
        ],
    }


@app.post("/assistant/chat", response_model=ChatResponse)
def assistant_chat(payload: ChatRequest, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> ChatResponse:
    with SessionLocal() as session:
        trip: Trip | None = None
        if payload.trip_id:
            trip = session.get(Trip, payload.trip_id)
            if trip is None:
                raise HTTPException(status_code=404, detail="Trip not found")
            if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
                raise HTTPException(status_code=403, detail="Forbidden")

        result = planner.chat_reply(payload.message, _serialize_trip_context(trip))
        if trip is not None:
            if any(term in payload.message.lower() for term in ('rain', 'storm', 'showers', 'weather')):
                modification = planner.apply_weather_replan(payload.message, trip.itinerary_json or [])
            elif any(term in payload.message.lower() for term in ('delay', 'delayed', 'cancelled', 'canceled', 'disruption')):
                modification = planner.apply_disruption(payload.message, trip.itinerary_json or [])
            else:
                modification = planner.modify_existing_plan(
                    payload.message,
                    trip.destination,
                    trip.style,
                    trip.budget,
                    trip.itinerary_json or [],
                )
            if modification['changed']:
                trip.itinerary_json = modification['itinerary']
                trip.summary = modification.get('summary', trip.summary)
                if 'budget' in modification:
                    trip.budget = modification['budget']
                    trip.budget_breakdown_json = modification['budget_breakdown']
                trip.data_source_notes_json = [*(trip.data_source_notes_json or []), *modification['data_source_notes']]
                next_version = max((revision.version for revision in trip.revisions), default=0) + 1
                session.add(
                    TripRevision(
                        trip_id=trip.id,
                        version=next_version,
                        note=f"Assistant update: {payload.message}",
                        payload_json=modification,
                    )
                )
                session.commit()
                session.refresh(trip)
                result['reply'] = modification['reply']
                result['trip_update'] = _trip_to_response(trip).model_dump(mode='json')
                result['sources'].append('Existing itinerary updated and saved as a new revision')
        return ChatResponse(**result)


@app.post("/assistant/vision")
async def vision_assistant(files: list[UploadFile] = File(...), prompt: str = "Which option fits my itinerary best?") -> dict[str, Any]:
    images: list[dict[str, Any]] = []
    for file in files[:5]:
        content = await file.read()
        if not (file.content_type or '').startswith('image/'):
            continue
        images.append({
            'name': file.filename or 'travel-image',
            'media': f"data:{file.content_type};base64,{base64.b64encode(content).decode('ascii')}",
        })
    api_key = os.getenv('OPENAI_API_KEY') or os.getenv('OPENROUTER_API_KEY')
    if not images:
        raise HTTPException(status_code=400, detail='Upload at least one image')
    if not api_key:
        return {
            'provider': 'unconfigured',
            'analysis': 'Image analysis is ready, but no vision model key is configured. Add OPENAI_API_KEY or OPENROUTER_API_KEY to compare hotels or identify monuments.',
            'files': [image['name'] for image in images],
        }

    model = os.getenv('AI_VISION_MODEL') or ('openai/gpt-4o-mini' if os.getenv('OPENROUTER_API_KEY') else 'gpt-4o-mini')
    base_url = os.getenv('OPENAI_BASE_URL') or ('https://openrouter.ai/api/v1' if os.getenv('OPENROUTER_API_KEY') else 'https://api.openai.com/v1')
    content: list[dict[str, Any]] = [{'type': 'text', 'text': prompt}]
    content.extend({'type': 'image_url', 'image_url': {'url': image['media']}} for image in images)
    request = urllib.request.Request(
        f'{base_url}/chat/completions',
        data=json.dumps({'model': model, 'messages': [{'role': 'user', 'content': content}], 'temperature': 0.2}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = json.loads(response.read().decode('utf-8'))
        analysis = ((data.get('choices') or [{}])[0].get('message') or {}).get('content', 'No visual analysis returned.')
        return {'provider': model, 'analysis': str(analysis), 'files': [image['name'] for image in images]}
    except Exception:
        return {'provider': 'unavailable', 'analysis': 'The vision provider could not be reached. Your images were received; try again when the model service is available.', 'files': [image['name'] for image in images]}


@app.post("/trips/{trip_id}/disrupt")
def disrupt_trip(trip_id: str, payload: DisruptionRequest, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> dict[str, Any]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")

        modification = planner.apply_disruption(payload.message, trip.itinerary_json or [])
        if not modification['changed']:
            return {'trip': _trip_to_response(trip), 'notification': modification['reply'], 'impact': []}

        trip.itinerary_json = modification['itinerary']
        trip.data_source_notes_json = [*(trip.data_source_notes_json or []), *modification['data_source_notes']]
        next_version = max((revision.version for revision in trip.revisions), default=0) + 1
        session.add(
            TripRevision(
                trip_id=trip.id,
                version=next_version,
                note=f"Disruption update: {payload.message}",
                payload_json=modification,
            )
        )
        session.commit()
        session.refresh(trip)
        return {
            'trip': _trip_to_response(trip),
            'notification': modification['notification'],
            'impact': modification['data_source_notes'],
        }


@app.post("/trips/{trip_id}/weather-replan")
def weather_replan_trip(trip_id: str, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> dict[str, Any]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")

        weather_data = build_weather_response(trip.destination)
        forecast = weather_data.get('forecast') or []
        wet_forecast = next(
            (item for item in forecast if any(term in str(item.get('condition', '')).lower() for term in ('rain', 'storm', 'showers'))),
            None,
        )
        if wet_forecast is None:
            return {'trip': _trip_to_response(trip), 'notification': 'No heavy rain conflict was found in the current forecast.', 'impact': []}

        modification = planner.apply_weather_replan(
            f"{wet_forecast.get('day', 'Tomorrow')}: {wet_forecast.get('condition', 'Heavy rain')}",
            trip.itinerary_json or [],
        )
        trip.itinerary_json = modification['itinerary']
        trip.data_source_notes_json = [*(trip.data_source_notes_json or []), *modification['data_source_notes']]
        next_version = max((revision.version for revision in trip.revisions), default=0) + 1
        session.add(TripRevision(trip_id=trip.id, version=next_version, note='Weather-aware itinerary replan', payload_json=modification))
        session.commit()
        session.refresh(trip)
        return {
            'trip': _trip_to_response(trip),
            'notification': modification['notification'],
            'impact': modification['data_source_notes'],
            'weather': wet_forecast,
        }


@app.post("/uploads", response_model=UploadMetaResponse)
async def upload_file(
    file: UploadFile = File(...),
    trip_id: str | None = None,
    current_user: User | None = Depends(_get_current_user_from_auth_header),
) -> UploadMetaResponse:
    if trip_id:
        with SessionLocal() as session:
            trip = session.get(Trip, trip_id)
            if trip is None:
                raise HTTPException(status_code=404, detail="Trip not found")
            if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
                raise HTTPException(status_code=403, detail="Forbidden")

    safe_name = os.path.basename(file.filename or "upload.bin")
    unique_name = f"{uuid4().hex}_{safe_name}"
    file_path = UPLOAD_DIR / unique_name
    with file_path.open("wb") as destination:
        while True:
            chunk = await file.read(1024 * 64)
            if not chunk:
                break
            destination.write(chunk)

    if trip_id and (file.content_type or '').startswith('image/'):
        with SessionLocal() as session:
            trip = session.get(Trip, trip_id)
            if trip is not None:
                entries = list(trip.journal_json or [])
                entries.append({
                    'id': f"journal_{uuid4().hex[:10]}",
                    'kind': 'photo',
                    'text': safe_name,
                    'amount_inr': None,
                    'place': None,
                    'file_path': str(file_path),
                    'created_at': datetime.utcnow().isoformat(),
                })
                trip.journal_json = entries
                session.commit()

    return UploadMetaResponse(
        file_name=safe_name,
        file_path=str(file_path),
        content_type=file.content_type or "application/octet-stream",
        size=file_path.stat().st_size,
    )


@app.get("/trips/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: str, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> TripResponse:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        return _trip_to_response(trip)


@app.get("/trips/{trip_id}/revisions", response_model=list[RevisionResponse])
def list_trip_revisions(trip_id: str, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> list[RevisionResponse]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        revisions = session.scalars(
            select(TripRevision).where(TripRevision.trip_id == trip_id).order_by(TripRevision.version.desc())
        ).all()
        return [
            RevisionResponse(version=item.version, note=item.note, created_at=item.created_at, payload=item.payload_json)
            for item in revisions
        ]


@app.get("/trips/{trip_id}/checklist", response_model=list[ChecklistItem])
def get_trip_checklist(trip_id: str, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> list[ChecklistItem]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        if not trip.checklist_json:
            trip.checklist_json = _build_pre_trip_checklist(trip.destination)
            session.commit()
        return [ChecklistItem(**item) for item in trip.checklist_json]


@app.patch("/trips/{trip_id}/checklist", response_model=list[ChecklistItem])
def update_trip_checklist(trip_id: str, payload: ChecklistUpdate, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> list[ChecklistItem]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        trip.checklist_json = [item.model_dump() for item in payload.items]
        session.commit()
        return payload.items


def _journal_diary(entries: list[dict[str, Any]]) -> str:
    notes = [entry['text'] for entry in entries if entry.get('kind') == 'note' and entry.get('text')]
    places = [entry['place'] for entry in entries if entry.get('place')]
    expenses = [entry for entry in entries if entry.get('amount_inr') is not None]
    total_expenses = sum(float(entry['amount_inr']) for entry in expenses)
    parts = ['Your India travel diary is taking shape.']
    if places:
        parts.append(f"You visited {', '.join(dict.fromkeys(places))}.")
    if notes:
        parts.append(f"Notes captured: {' '.join(notes[:3])}")
    if expenses:
        parts.append(f"Logged expenses total ₹{total_expenses:,.0f}.")
    if any(entry.get('kind') == 'photo' for entry in entries):
        parts.append('Your photo memories are attached to this trip.')
    return ' '.join(parts)


@app.get("/trips/{trip_id}/journal")
def get_trip_journal(trip_id: str, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> dict[str, Any]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        entries = [JournalEntry(**entry) for entry in (trip.journal_json or [])]
        return {'entries': entries, 'diary': _journal_diary([entry.model_dump() for entry in entries])}


@app.post("/trips/{trip_id}/journal")
def add_trip_journal_entry(trip_id: str, payload: JournalUpdate, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> dict[str, Any]:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")
        entries = [*(trip.journal_json or []), payload.entry.model_dump(mode='json')]
        trip.journal_json = entries
        session.commit()
        return {'entry': payload.entry, 'diary': _journal_diary(entries)}


@app.post("/trips/{trip_id}/expenses")
def add_trip_expense(trip_id: str, payload: ExpenseRequest, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> dict[str, Any]:
    amount_match = re.search(r'(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)', payload.message.lower())
    if not amount_match:
        raise HTTPException(status_code=400, detail="Include an amount, for example '₹850 dinner'")
    amount = float(amount_match.group(1).replace(',', ''))
    normalized = payload.message.lower()
    category = 'Food' if any(word in normalized for word in ('food', 'dinner', 'lunch', 'breakfast', 'restaurant', 'chai')) else 'Activities' if any(word in normalized for word in ('museum', 'ticket', 'fort', 'activity')) else 'Local travel' if any(word in normalized for word in ('auto', 'taxi', 'metro', 'train', 'bus')) else 'Other'
    entry = JournalEntry(
        id=f"journal_{uuid4().hex[:10]}",
        kind='expense',
        text=payload.message,
        category=category,
        amount_inr=amount,
        place=None,
        file_path=None,
        created_at=datetime.utcnow(),
    )
    result = add_trip_journal_entry(trip_id, JournalUpdate(entry=entry), current_user)
    result['category'] = category
    return result


@app.post("/trips", response_model=TripResponse)
def create_trip(payload: TripRequest, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> TripResponse:
    plan = planner.generate(payload)
    trip_id = f"trip_{uuid4().hex[:10]}"
    with SessionLocal() as session:
        trip = Trip(
            id=trip_id,
            destination=payload.destination,
            start_date=payload.start_date,
            end_date=payload.end_date,
            budget=payload.budget,
            style=payload.style,
            interests_json=payload.interests,
            food_preferences_json=payload.food_preferences,
            summary=plan["summary"],
            budget_breakdown_json=plan["budget_breakdown"],
            itinerary_json=plan["itinerary"],
            data_source_notes_json=plan["data_source_notes"],
            checklist_json=_build_pre_trip_checklist(payload.destination),
            owner_id=current_user.id if current_user else None,
        )
        session.add(trip)
        session.add(
            TripRevision(
                trip_id=trip_id,
                version=1,
                note="Initial itinerary generated by planner workflow",
                payload_json={"request": payload.model_dump(mode="json"), **plan},
            )
        )
        session.commit()
        session.refresh(trip)
        return _trip_to_response(trip)


@app.patch("/trips/{trip_id}/replan", response_model=TripResponse)
def replan_trip(trip_id: str, update: ReplanRequest, current_user: User | None = Depends(_get_current_user_from_auth_header)) -> TripResponse:
    with SessionLocal() as session:
        trip = session.get(Trip, trip_id)
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Only owner may modify a trip that is owned
        if trip.owner_id and (current_user is None or trip.owner_id != current_user.id):
            raise HTTPException(status_code=403, detail="Forbidden")

        current_request = TripRequest(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            budget=trip.budget,
            style=trip.style,
            interests=trip.interests_json or [],
            food_preferences=trip.food_preferences_json or [],
        )
        plan = planner.replan(current_request, update, trip.itinerary_json or [])

        trip.style = update.style or trip.style
        trip.budget = update.budget or trip.budget
        if update.interests is not None:
            trip.interests_json = update.interests
        if update.food_preferences is not None:
            trip.food_preferences_json = update.food_preferences
        trip.summary = plan["summary"]
        trip.budget_breakdown_json = plan["budget_breakdown"]
        trip.itinerary_json = plan["itinerary"]
        trip.data_source_notes_json = plan["data_source_notes"]

        next_version = len(trip.revisions) + 1
        session.add(
            TripRevision(
                trip_id=trip.id,
                version=next_version,
                note=update.note,
                payload_json={"request": current_request.model_dump(mode="json"), "update": update.model_dump(mode="json"), **plan},
            )
        )
        session.commit()
        session.refresh(trip)
        return _trip_to_response(trip)
