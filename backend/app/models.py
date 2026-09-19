from datetime import date, datetime
from typing import Any

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Trip(Base):
    __tablename__ = 'trips'

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    budget: Mapped[float] = mapped_column(Float, nullable=False)
    style: Mapped[str] = mapped_column(String(80), nullable=False)
    interests_json: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    food_preferences_json: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    budget_breakdown_json: Mapped[dict[str, float]] = mapped_column(JSON, nullable=False, default=dict)
    itinerary_json: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)
    checklist_json: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)
    journal_json: Mapped[list[dict[str, Any]]] = mapped_column(JSON, nullable=False, default=list)
    data_source_notes_json: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner_id: Mapped[str | None] = mapped_column(String(36), ForeignKey('users.id'), nullable=True, index=True)
    revisions: Mapped[list['TripRevision']] = relationship(back_populates='trip', cascade='all, delete-orphan', order_by='TripRevision.version')


class TripRevision(Base):
    __tablename__ = 'trip_revisions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[str] = mapped_column(ForeignKey('trips.id', ondelete='CASCADE'), nullable=False, index=True)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
    payload_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    trip: Mapped[Trip] = relationship(back_populates='revisions')


class User(Base):
    __tablename__ = 'users'

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    profile_json: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    trips: Mapped[list[Trip]] = relationship(backref='owner', primaryjoin="User.id==Trip.owner_id")
