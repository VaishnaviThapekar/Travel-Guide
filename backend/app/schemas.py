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


class TravelProfile(BaseModel):
    budget_range: str = 'mid-range'
    interests: list[str] = Field(default_factory=list)
    food_preferences: list[str] = Field(default_factory=list)
    travel_style: str = 'balanced'
    preferred_transport: list[str] = Field(default_factory=lambda: ['train', 'metro'])


class ProfileResponse(BaseModel):
    email: str
    profile: TravelProfile


class ProfileUpdate(BaseModel):
    profile: TravelProfile


class DiscoveryRequest(BaseModel):
    budget: float = Field(gt=0)
    duration_days: int = Field(default=4, ge=1, le=60)
    interests: list[str] = Field(default_factory=list)
    month: int | None = Field(default=None, ge=1, le=12)


class GroupPlannerRequest(BaseModel):
    destination: str = Field(min_length=2)
    budget: float = Field(gt=0)
    duration_days: int = Field(ge=1, le=60)
    travelers: list[dict[str, str]] = Field(min_length=1)


class ExpenseRequest(BaseModel):
    message: str = Field(min_length=2)


class CompareRequest(BaseModel):
    first_destination: str = Field(min_length=2)
    second_destination: str = Field(min_length=2)
    budget: float = Field(gt=0)
    duration_days: int = Field(ge=1, le=60)


class UploadMetaResponse(BaseModel):
    file_name: str
    file_path: str
    content_type: str
    size: int


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    trip_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = Field(default_factory=list)
    stream_tokens: list[str] = Field(default_factory=list)
    trip_update: dict | None = None


class ReplanRequest(BaseModel):
    style: str | None = None
    budget: float | None = Field(default=None, gt=0)
    interests: list[str] | None = None
    food_preferences: list[str] | None = None
    note: str = 'Preference update'


class DisruptionRequest(BaseModel):
    message: str = Field(min_length=3)


class ChecklistItem(BaseModel):
    id: str
    label: str
    category: str
    checked: bool = False


class ChecklistUpdate(BaseModel):
    items: list[ChecklistItem]


class JournalEntry(BaseModel):
    id: str
    kind: str
    text: str
    category: str | None = None
    amount_inr: float | None = None
    place: str | None = None
    file_path: str | None = None
    created_at: datetime


class JournalUpdate(BaseModel):
    entry: JournalEntry


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
