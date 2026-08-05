from contextlib import asynccontextmanager
from datetime import timedelta
from typing import Any
from uuid import uuid4

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from .db import SessionLocal, engine
from .models import Base, Trip, TripRevision, User
from .planner import TripPlannerAgent, DESTINATION_SUGGESTIONS
from .schemas import (
    ChatRequest,
    ChatResponse,
    ReplanRequest,
    RevisionResponse,
    TripListItem,
    TripRequest,
    TripResponse,
    UserCreate,
    ForgotPasswordRequest,
    LoginRequest,
    TokenResponse,
)
from .auth import hash_password, verify_password, create_access_token, decode_access_token


planner = TripPlannerAgent()


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


_ensure_owner_column()

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
        {"name": "Paris, France", "region": "Europe"},
        {"name": "Tokyo, Japan", "region": "Asia"},
        {"name": "Lisbon, Portugal", "region": "Europe"},
        {"name": "Cape Town, South Africa", "region": "Africa"},
    ]
    query = q.lower().strip()
    results = [item for item in catalogue if query in item["name"].lower()]
    return {"results": results or catalogue}


@app.get("/weather")
def weather(city: str = "") -> dict[str, Any]:
    return {
        "city": city,
        "forecast": [
            {"day": "Today", "condition": "Partly cloudy", "high_c": 24, "low_c": 17},
            {"day": "Tomorrow", "condition": "Light rain", "high_c": 22, "low_c": 16},
        ],
        "source": "mock",
    }


@app.get("/maps/nearby")
def nearby(lat: float, lng: float) -> dict[str, Any]:
    return {
        "center": {"lat": lat, "lng": lng},
        "places": [
            {"name": "City Museum", "category": "museum", "distance_km": 0.8},
            {"name": "Old Town Market", "category": "market", "distance_km": 1.2},
            {"name": "Riverside Cafe", "category": "restaurant", "distance_km": 0.4},
        ],
        "source": "mock",
    }


@app.get("/places/search")
def search_places(q: str = "") -> dict[str, Any]:
    key = q.strip().lower()
    results = []
    # DESTINATION_SUGGESTIONS keys are like 'Paris', map to lowercase
    for k, items in DESTINATION_SUGGESTIONS.items():
        if k.lower().startswith(key) or key == '':
            for name in items:
                results.append({"name": name, "category": "poi"})
    return {"query": q, "results": results, "source": "planner-catalog"}


@app.get("/faq/search")
def faq_search(q: str = "") -> dict[str, list[dict[str, str]]]:
    faqs = [
        {"question": "How do I get around cheaply?", "answer": "Use transit passes, walking routes, and clustered activities."},
        {"question": "What should I pack?", "answer": "Pack for weather, walking comfort, and the dress code of your destinations."},
    ]
    return {"results": faqs}


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
        return ChatResponse(**result)


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
