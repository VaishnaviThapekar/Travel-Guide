<!-- markdownlint-disable MD022 MD032 -->

# AI Travel Guide for Tourists: MVP Spec

## 1. Product Vision
Build an AI travel assistant that helps tourists plan a trip, adjust plans to their preferences, and guide them during the journey through chat and optional voice input.

The first version should feel like a smart travel concierge, not just a Q&A bot.

## 2. MVP Goal
Deliver a working hybrid MVP that uses real travel context where it matters most and mock data where integrations would slow development.

Primary goal:
- Turn a destination, budget, dates, and preferences into a practical day-by-day itinerary.

Secondary goals:
- Explain recommendations clearly.
- Keep plans editable.
- Save trips for later reuse.
- Make the experience location-aware with maps and weather.

## 3. Target Users
- Solo tourists planning a short trip
- Couples or friends planning a city break
- First-time visitors who need structured guidance

## 4. MVP Scope

### In Scope
- User sign-in and trip storage
- Chat-based travel planning assistant
- Destination search
- Preference collection
- Day-by-day itinerary generation
- Budget estimation
- Weather-aware recommendations
- Map-based location support
- Saved trips and plan revision
- Basic FAQ knowledge base for travel advice

### Out of Scope for MVP
- Full flight booking automation
- Real-time hotel booking checkout
- Expense tracking with receipts
- Group collaboration
- Offline mode
- Landmark recognition from photos
- Deep voice assistant workflow

## 5. Core User Flow
1. User signs in.
2. User enters destination, dates, budget, travel style, and interests.
3. AI asks follow-up questions if needed.
4. System generates a trip plan with daily activities, estimated costs, travel times, and weather notes.
5. User edits preferences or requests changes like "make it cheaper" or "add more museums."
6. System revises the plan and saves versions.
7. User opens the trip later and uses the map, weather, and recommendations during the trip.

## 6. Feature List

### 6.1 Trip Planner Agent
Responsibilities:
- Collect trip inputs
- Ask clarifying questions
- Generate itinerary by day
- Balance time, distance, budget, and interests
- Re-plan when preferences change

Inputs:
- Destination
- Start and end dates
- Budget range
- Interests
- Pace of travel
- Food preferences
- Mobility needs

Outputs:
- Trip summary
- Daily itinerary
- Cost estimate
- Travel assumptions
- Recommendation rationale

### 6.2 Budget Agent
Responsibilities:
- Estimate total trip cost
- Split costs by category such as food, transport, stays, and activities
- Suggest cheaper alternatives

### 6.3 Hotel Agent
Responsibilities:
- Recommend stay areas and hotel styles
- Compare mock or sampled options by price, rating, and location

MVP approach:
- Use mock hotel data or a limited provider integration.

### 6.4 Restaurant Agent
Responsibilities:
- Suggest food options based on cuisine, dietary needs, and location
- Recommend breakfast, lunch, and dinner ideas

### 6.5 Weather Agent
Responsibilities:
- Show forecast-aware suggestions
- Recommend indoor or outdoor alternatives
- Warn about likely rain, heat, or cold

### 6.6 Map Agent
Responsibilities:
- Display points of interest
- Estimate travel time between activities
- Help cluster activities geographically

### 6.7 Emergency Agent
Responsibilities:
- Surface local emergency numbers and safety tips
- Provide a quick action panel for urgent help

MVP approach:
- Static or curated data only.

### 6.8 Translation Helper
Responsibilities:
- Provide useful phrases and simple translation assistance
- Support common traveler interactions

## 7. AI Behavior Requirements
- The assistant must explain why it chose an activity or route.
- The assistant must respect user preferences and budget constraints.
- The assistant must revise plans without losing the original version.
- The assistant must avoid hallucinating real availability when using mock APIs.
- The assistant must clearly label mock, estimated, and real-time data.

## 8. Suggested Technical Stack

### Frontend
- React
- Tailwind CSS
- Google Maps SDK

### Backend
- FastAPI
- Python agent layer
- PostgreSQL

### AI Layer
- LLM for reasoning and itinerary generation
- RAG for travel guides, city FAQs, and policy-aware recommendations
- Agent framework such as OpenAI Agents SDK or LangChain

### Data Sources
- Google Maps API
- Weather API
- Currency exchange API
- Mock flight and hotel data for MVP

## 9. Data Model Draft

### Users
- id
- name
- email
- locale
- travel preferences

### Trips
- id
- user_id
- destination
- start_date
- end_date
- budget
- style
- status

### Itinerary Days
- id
- trip_id
- day_number
- title
- summary
- total_estimated_cost

### Activities
- id
- itinerary_day_id
- name
- category
- coordinates
- estimated_duration
- estimated_cost
- notes

### Recommendations
- id
- trip_id
- type
- payload
- source
- confidence

## 10. API Draft
- `POST /auth/login`
- `POST /trips`
- `GET /trips/:id`
- `PATCH /trips/:id/preferences`
- `POST /trips/:id/replan`
- `GET /trips/:id/itinerary`
- `GET /destinations/search?q=`
- `GET /weather?city=`
- `GET /maps/nearby?lat=&lng=`
- `GET /faq/search?q=`

## 11. MVP Architecture
- React UI collects trip preferences and displays itinerary results.
- FastAPI handles authentication, trip storage, and orchestration.
- AI planner generates itinerary drafts.
- RAG service retrieves relevant travel guidance from curated documents.
- Weather and map services enrich the plan.
- PostgreSQL stores users, trips, itineraries, and revisions.

## 12. Success Metrics
- User can create a trip in under 3 minutes.
- AI produces a complete itinerary with no missing days.
- Revision requests produce a new valid plan.
- Saved trips can be reopened and edited.
- Users can see budget, weather, and map context in one place.

## 13. Phase 2 Ideas
- Voice-first assistant
- Live booking integrations
- Group trip planning
- Expense tracking
- Offline mode
- Photo-based landmark recognition
- Real-time disruption alerts

## 14. Open Questions
- Which cities or regions should be supported first?
- Should the MVP be desktop-first or mobile-first?
- Which real API should be connected first after the mock-based MVP?
- Do you want the assistant to optimize for budget, time, or experience by default?

## 15. Recommended Next Step
Build the MVP in this order:
1. React trip-planning UI
2. FastAPI backend and trip persistence
3. Itinerary-generation agent
4. Maps and weather enrichment
5. Mock hotel and flight providers
6. RAG knowledge base for travel FAQs

<!-- markdownlint-enable MD022 MD032 -->
