from datetime import date, datetime

from pydantic import BaseModel, Field


class TripRequest(BaseModel):
    destination: str = Field(min_length=2)
    start_date: date
    end_date: date
    budget: float = Field(gt=0)
    style: str = Field(default='balanced')
    interests: list[str] = Field(default_factory=list)
    food_preferences: list[str] = Field(default_factory=list)


class UserCreate(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    trip_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = Field(default_factory=list)
    stream_tokens: list[str] = Field(default_factory=list)


class ReplanRequest(BaseModel):
    style: str | None = None
    budget: float | None = Field(default=None, gt=0)
    interests: list[str] | None = None
    food_preferences: list[str] | None = None
    note: str = 'Preference update'


class ItineraryDaySchema(BaseModel):
    day: int
    date: str
    title: str
    morning: str
    afternoon: str
    evening: str
    cost: float


class TripResponse(BaseModel):
    trip_id: str
    destination: str
    summary: str
    budget: float
    style: str
    start_date: date
    end_date: date
    interests: list[str]
    food_preferences: list[str]
    budget_breakdown: dict[str, float]
    itinerary: list[ItineraryDaySchema]
    data_source_notes: list[str]
    version: int
    updated_at: datetime


class TripListItem(BaseModel):
    trip_id: str
    destination: str
    summary: str
    budget: float
    style: str
    version: int
    updated_at: datetime


class RevisionResponse(BaseModel):
    version: int
    note: str
    created_at: datetime
    payload: dict
