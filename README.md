<!-- markdownlint-disable MD022 MD032 -->

# AI Travel Guide for Tourists

A polished travel-planning app that helps users generate, save, and refine trip itineraries with AI assistance, budget logic, weather context, and trip ownership support.

## Included features
- FastAPI backend with SQLite default storage and PostgreSQL-ready configuration
- JWT-based signup, login, forgot-password, and protected trip access
- React + TypeScript + Vite frontend with responsive travel dashboard UI
- AI trip planning and re-planning flow with saved trip history
- Revision tracking and ownership-aware trip access
- File upload support for itinerary documents and travel notes
- Live OpenStreetMap search/embed, weather and POI cards, FAQ panel, and browser speech assistant

## Project structure
- `backend/` - FastAPI app, DB models, planner logic, auth, and upload endpoints
- `frontend/` - Vite React app for the travel dashboard and auth flows
- `AI-Travel-Guide-MVP.md` - product and feature specification

## Run locally
Backend:
1. Open a terminal in the repo root.
2. Activate the venv: `.\.venv\Scripts\Activate.ps1`
3. Install dependencies: `python -m pip install -r backend\requirements.txt`
4. Start the API: `cd backend` then `uvicorn app.main:app --reload --port 8000`

Optional PostgreSQL:
- Set `DATABASE_URL` before starting the backend, for example:
  `postgresql+psycopg://user:password@localhost:5432/ai_travel_guide`

Frontend:
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Features currently available
- Generate and save trip plans
- View itinerary day-by-day with budget totals
- Replan current trip with updated style / preferences
- Review revision history
- Chat with the assistant about route and budget changes
- Upload travel documents or reference files
- Search destinations directly in the embedded OpenStreetMap view
- Use browser speech recognition to send spoken prompts to the assistant

## Optional production enhancements
1. Set `OPENAI_API_KEY` or `OPENROUTER_API_KEY` for richer LLM-backed replies.
2. Add a managed geocoding/routing provider for higher-volume map usage.
3. Add image galleries, turn-by-turn route optimization, and server-side speech services.

<!-- markdownlint-enable MD022 MD032 -->
