# Journey AI — Autonomous Global Travel Guide & Multi-Agent Concierge

An intelligent, full-stack travel-planning application that dynamically generates, visualizes, and optimizes custom trip itineraries for **any country or city worldwide**. Powered by an autonomous multi-agent mesh, high-resolution scenery galleries, live currency conversions, verified safety hotlines, and real-time open intel.

---

## Highlights & Capabilities

### 1. Global Country Intelligence Engine
- **Universal Destination Resolution**: Dynamically resolves 50+ countries and 200+ world cities (Switzerland, Japan, France, Italy, USA, UK, Germany, Spain, UAE, Thailand, Australia, Singapore, Canada, Egypt, Greece, Turkey, Netherlands, Portugal, Austria, New Zealand, Indonesia, South Korea, Maldives, Norway, Iceland, Morocco, Brazil, Mexico, South Africa, India, and more).
- **Country-Specific Hotlines**: Live **Emergency & Safety Hub** displaying official numbers for National Emergency, Police, Ambulance, Fire, and Tourist Assistance based on the active country.
- **Cultural Etiquette & Transit Advisory**: Tailored regional guidance covering local dress codes, dining & tipping norms, public transit passes (SBB, Shinkansen, TGV, Metro, Nol), tap water safety, and electrical plug standards.
- **Real Forex & Currency Converter**: Instant conversion between local destination currencies (CHF, JPY, EUR, USD, GBP, AED, THB, SGD, AUD, CAD, IDR, KRW, NOK, ISK, etc.) and INR.

### 2. Intelligent Scenery & Photography Engine
- **Curated High-Resolution Visuals**: Authentic Unsplash photography mapped per destination for hero banners, destination thumbnails, and day-by-day itinerary stops.
- **Thematic Procedural Fallback**: Unlisted or off-the-beaten-path destinations procedurally load high-quality landscape collections (Alpine lakes, tropical coasts, European historic quarters, desert canyons) ensuring zero broken visuals.

### 3. Multi-Agent Architecture
- **🧭 Route Strategist**: Optimizes daily landmark sequences to minimize commute fatigue and cluster nearby attractions.
- **🌦️ Weather Sentinel**: Integrates real-time weather forecasts via Open-Meteo and can trigger rainy-day activity replanning.
- **💰 Budget Auditor**: Tracks trip expenses across transport, lodging, dining, activities, local travel, and emergency reserves.
- **🛡️ Safety Guardian**: Verifies emergency hotlines and safety advisories for peace of mind.

### 4. Interactive Trip Studio & Toolkit
- **Day-by-Day Itinerary Cards**: Morning, afternoon, and evening recommendations with transit tips and estimated costs.
- **Audio Tour Guide (TTS)**: One-click synthetic voice narration for each day's plan.
- **Activity Swap**: Instant alternative recommendations for any day plan.
- **Offline Guide Export**: Clean, printable HTML/PDF export for travelers without mobile data.
- **Interactive OpenStreetMap Embed**: Radius-based search for cafes, museums, monuments, and hospitals.
- **Multimodal Vision Concierge**: Upload photos of hotels, tickets, or landmarks for AI recognition and itinerary fit.
- **Packing Checklist & Travel Journal**: Checkable packing essentials and a photo-supported travel diary.

---

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLite (PostgreSQL-ready with SQLAlchemy/Psycopg), JWT Auth (`python-jose`, `passlib`).
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, React Router v6 (v7 future-flag compliant).
- **External Services**: Open-Meteo (Weather), OpenStreetMap / Overpass (Nearby Places & Geocoding).

---

## Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py            # 32 FastAPI REST API endpoints
│   │   ├── countries.py       # Global country intelligence registry & alias resolver
│   │   ├── catalog.py         # Destination suggestions and attraction database
│   │   ├── planner.py         # Autonomous multi-agent itinerary planner
│   │   ├── research.py        # Open-Meteo weather and Overpass map adapters
│   │   ├── models.py          # SQLAlchemy database models (Users, Trips, Revisions)
│   │   └── schemas.py         # Pydantic validation schemas
│   ├── tests/
│   │   ├── test_planner.py    # Unit tests for planner logic
│   │   └── test_api.py        # Integration tests for all REST endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main Trip Studio & multi-tab travel dashboard
│   │   ├── LandingPage.tsx    # High-impact global discovery showcase
│   │   ├── utils/
│   │   │   └── globalTravelAtlas.ts # Curated photography engine & country metadata
│   │   ├── auth/              # JWT auth views (Login, Signup, Forgot, Reset)
│   │   └── index.css          # Design system, glassmorphism, animations
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher & npm

### 1. Run the Backend API
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend health check: `http://127.0.0.1:8000/health`
* Interactive OpenAPI Swagger docs: `http://127.0.0.1:8000/docs`

### 2. Run the Frontend Dev Server
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
* Open in browser: `http://localhost:5173`

---

## Running Tests

Run the backend test suite:
```bash
# Run planner unit tests
python -m pytest backend/tests/test_planner.py -v

# Run full API endpoint test suite
python -m pytest backend/tests/test_api.py -v
```

Verify frontend TypeScript compilation:
```bash
cd frontend
npm run build
```

---

## License
MIT License. Built for travelers worldwide.
