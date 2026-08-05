<!-- markdownlint-disable MD022 MD032 -->

# AI Travel Guide for Tourists

A starter monorepo for an AI travel assistant that plans trips, estimates budgets, and enriches itineraries with maps and weather context.

## What is included
- FastAPI backend with persistent trip storage and revision history
- React + TypeScript + Tailwind frontend
- Planner service boundary with a rule-based default workflow
- Saved trip API surface for later expansion

## Structure
- `backend/` - FastAPI app and mock planner logic
- `frontend/` - React UI for trip planning
- `AI-Travel-Guide-MVP.md` - product specification

## Run locally
Backend:
1. `cd backend`
2. `python -m venv .venv`
3. `.venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn app.main:app --reload --port 8000`

To use PostgreSQL, set `DATABASE_URL` before starting the backend, for example:
`postgresql+psycopg://user:password@localhost:5432/ai_travel_guide`

Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Next steps
1. Connect a real LLM provider for itinerary reasoning.
2. Replace mock maps/weather/FAQ data with real providers.
3. Add user authentication and per-user trip ownership.

<!-- markdownlint-enable MD022 MD032 -->
