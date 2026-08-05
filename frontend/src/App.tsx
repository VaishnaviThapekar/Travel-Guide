import { useEffect, useMemo, useState, type ReactNode } from 'react';
import useReveal from './hooks/useReveal';
import { Link } from 'react-router-dom';
import { useAuth, authHeader } from './auth/AuthContext.tsx';

type ItineraryDay = {
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
    cost: number;
};

type TripApiResponse = {
    trip_id: string;
    destination: string;
    summary: string;
    budget: number;
    style: string;
    start_date: string;
    end_date: string;
    interests: string[];
    food_preferences: string[];
    budget_breakdown: Record<string, number>;
    itinerary: Array<{
        day: number;
        date: string;
        title: string;
        morning: string;
        afternoon: string;
        evening: string;
        cost: number;
    }>;
    data_source_notes: string[];
    version: number;
    updated_at: string;
};

type TripListItem = {
    trip_id: string;
    destination: string;
    summary: string;
    budget: number;
    style: string;
    version: number;
    updated_at: string;
};

type WeatherApiResponse = {
    city: string;
    forecast: Array<{
        day: string;
        condition: string;
        high_c: number;
        low_c: number;
    }>;
    source: string;
};

type FaqApiResponse = {
    results: Array<{
        question: string;
        answer: string;
    }>;
};

type RevisionApiResponse = {
    version: number;
    note: string;
    created_at: string;
    payload: Record<string, unknown>;
};

type ChatApiResponse = {
    reply: string;
    sources: string[];
    stream_tokens: string[];
};

type ChatMessage = {
    role: 'user' | 'assistant';
    text: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const featuredDestinations = ['Paris', 'Tokyo', 'Lisbon', 'Cape Town'];

const DESTINATION_IMAGES: Record<string, string> = {
    Paris: new URL('./assets/paris.svg', import.meta.url).href,
    Tokyo: new URL('./assets/tokyo.svg', import.meta.url).href,
    Lisbon: new URL('./assets/lisbon.svg', import.meta.url).href,
    'Cape Town': new URL('./assets/capetown.svg', import.meta.url).href,
};

function buildItinerary(destination: string, budget: number, startDate: string, endDate: string): ItineraryDay[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.max(Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1, 1);
    const dailyBudget = Math.max(Math.round(budget / totalDays), 1);

    return Array.from({ length: totalDays }, (_, index) => ({
        day: index + 1,
        title: `${destination} - Day ${index + 1}`,
        morning: index % 2 === 0 ? 'Local breakfast and a scenic walking route' : 'Museum visit and coffee stop',
        afternoon: index % 2 === 0 ? 'Landmark cluster with transit-aware routing' : 'Market, park, or neighborhood exploration',
        evening: index % 2 === 0 ? 'Dinner near the hotel with a budget check' : 'Sunset viewpoint and flexible free time',
        cost: dailyBudget,
    }));
}

export default function App() {
    useReveal();

    const [destination, setDestination] = useState('Lisbon');
    const [startDate, setStartDate] = useState('2026-07-10');
    const [endDate, setEndDate] = useState('2026-07-13');
    const [budget, setBudget] = useState(1200);
    const [style, setStyle] = useState('Balanced');
    const [interests, setInterests] = useState('Food, history, viewpoints');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tripSummary, setTripSummary] = useState('Press Generate plan to create the first itinerary draft. The assistant will explain why each stop was selected and how the budget is distributed.');
    const [budgetBreakdown, setBudgetBreakdown] = useState<Record<string, number>>({});
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
    const [faqResults, setFaqResults] = useState<FaqApiResponse['results']>([]);
    const [sourceNotes, setSourceNotes] = useState<string[]>(['Mock AI draft']);
    const [tripId, setTripId] = useState('');
    const [savedTrips, setSavedTrips] = useState<TripListItem[]>([]);
    const [revisionHistory, setRevisionHistory] = useState<RevisionApiResponse[]>([]);
    const [displayDestination, setDisplayDestination] = useState(destination);
    const [displayStyle, setDisplayStyle] = useState(style);
    const [displayBudget, setDisplayBudget] = useState(budget);
    const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryDay[]>(buildItinerary(destination, budget, startDate, endDate));
    const [chatInput, setChatInput] = useState('Can you optimize day 2 for food + local culture?');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'assistant', text: 'I can help refine your itinerary. Ask me for budget, route, food, or pacing adjustments.' },
    ]);
    const [chatStreaming, setChatStreaming] = useState(false);
    const [chatError, setChatError] = useState('');

    const authH = authHeader() as Record<string, string>;

    const fallbackItinerary = useMemo(() => buildItinerary(destination, budget, startDate, endDate), [destination, budget, startDate, endDate]);
    const itinerary = generatedItinerary.length > 0 ? generatedItinerary : fallbackItinerary;
    const totalCost = itinerary.reduce((sum, day) => sum + day.cost, 0);
    const forecast = weather?.forecast ?? [
        { day: 'Today', condition: 'Partly cloudy', high_c: 24, low_c: 17 },
        { day: 'Tomorrow', condition: 'Light rain', high_c: 22, low_c: 16 },
    ];

    useEffect(() => {
        void refreshSavedTrips();
    }, []);

    const displayKey = (displayDestination || destination).split(',')[0].trim();
    const destinationImage = DESTINATION_IMAGES[displayKey] ?? DESTINATION_IMAGES['Lisbon'];

    async function generatePlan() {
        setLoading(true);
        setError('');

        const payload = {
            destination,
            start_date: startDate,
            end_date: endDate,
            budget,
            style,
            interests: interests
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            food_preferences: [],
        };

        try {
            const tripResponse = await fetch(`${apiBaseUrl}/trips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authH },
                body: JSON.stringify(payload),
            });

            if (!tripResponse.ok) {
                throw new Error('Trip generation failed');
            }

            const tripData = (await tripResponse.json()) as TripApiResponse;
            setTripId(tripData.trip_id);
            setTripSummary(tripData.summary);
            setBudgetBreakdown(tripData.budget_breakdown);
            setSourceNotes(tripData.data_source_notes.length > 0 ? tripData.data_source_notes : ['Trip API response']);
            setDisplayDestination(tripData.destination);
            setDisplayStyle(tripData.style);
            setDisplayBudget(tripData.budget);
            setDestination(tripData.destination);
            setStartDate(tripData.start_date);
            setEndDate(tripData.end_date);
            setBudget(tripData.budget);
            setStyle(tripData.style);
            setInterests(tripData.interests.join(', '));
            setGeneratedItinerary(
                tripData.itinerary.map((day, index) => ({
                    day: day.day,
                    title: day.title,
                    morning: day.morning,
                    afternoon: day.afternoon,
                    evening: day.evening,
                    cost: day.cost ?? Math.max(Math.round(tripData.budget / tripData.itinerary.length), 1),
                })),
            );

            const [weatherResponse, faqResponse] = await Promise.all([
                fetch(`${apiBaseUrl}/weather?city=${encodeURIComponent(tripData.destination)}`),
                fetch(`${apiBaseUrl}/faq/search?q=${encodeURIComponent(tripData.destination)}`),
            ]);

            if (weatherResponse.ok) {
                setWeather((await weatherResponse.json()) as WeatherApiResponse);
            }

            if (faqResponse.ok) {
                const faqData = (await faqResponse.json()) as FaqApiResponse;
                setFaqResults(faqData.results);
            }

            await refreshSavedTrips(tripData.trip_id);
            await refreshRevisions(tripData.trip_id);

            setSubmitted(true);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Unable to generate trip plan');
            setSubmitted(true);
            setDisplayDestination(destination);
            setDisplayStyle(style);
            setDisplayBudget(budget);
            setGeneratedItinerary(fallbackItinerary);
            setTripSummary(`A ${style.toLowerCase()} trip to ${destination} is ready. The plan favors walkable routes, affordable meals, and grouped attractions so the budget stays under control.`);
            setBudgetBreakdown({
                lodging: roundBudgetPortion(budget, 0.4),
                food: roundBudgetPortion(budget, 0.25),
                activities: roundBudgetPortion(budget, 0.2),
                transport: roundBudgetPortion(budget, 0.15),
            });
            setSourceNotes(['Mock fallback data']);
            setWeather(null);
            setFaqResults([]);
        } finally {
            setLoading(false);
        }
    }

    async function refreshSavedTrips(preferredTripId?: string) {
        const response = await fetch(`${apiBaseUrl}/trips`, { headers: { ...authH } });
        if (!response.ok) {
            return;
        }
        const items = (await response.json()) as TripListItem[];
        setSavedTrips(items);
        if (preferredTripId) {
            setTripId(preferredTripId);
        }
    }

    async function refreshRevisions(activeTripId: string) {
        const response = await fetch(`${apiBaseUrl}/trips/${activeTripId}/revisions`, { headers: { ...authH } });
        if (!response.ok) {
            setRevisionHistory([]);
            return;
        }
        setRevisionHistory((await response.json()) as RevisionApiResponse[]);
    }

    async function loadTrip(tripIdToLoad: string) {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiBaseUrl}/trips/${tripIdToLoad}`, { headers: { ...authH } });
            if (!response.ok) {
                throw new Error('Saved trip not found');
            }
            const tripData = (await response.json()) as TripApiResponse;
            setTripId(tripData.trip_id);
            setTripSummary(tripData.summary);
            setBudgetBreakdown(tripData.budget_breakdown);
            setSourceNotes(tripData.data_source_notes);
            setDisplayDestination(tripData.destination);
            setDisplayStyle(tripData.style);
            setDisplayBudget(tripData.budget);
            setDestination(tripData.destination);
            setStartDate(tripData.start_date);
            setEndDate(tripData.end_date);
            setBudget(tripData.budget);
            setStyle(tripData.style);
            setInterests(tripData.interests.join(', '));
            setGeneratedItinerary(
                tripData.itinerary.map((day) => ({
                    day: day.day,
                    title: day.title,
                    morning: day.morning,
                    afternoon: day.afternoon,
                    evening: day.evening,
                    cost: day.cost,
                })),
            );
            setSubmitted(true);
            await refreshRevisions(tripData.trip_id);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Unable to load trip');
        } finally {
            setLoading(false);
        }
    }

    async function replanTrip() {
        if (!tripId) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiBaseUrl}/trips/${tripId}/replan`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', ...authH },
                body: JSON.stringify({
                    style,
                    budget,
                    interests: interests.split(',').map((item) => item.trim()).filter(Boolean),
                    food_preferences: [],
                    note: 'User requested a refreshed plan from current preferences',
                }),
            });

            if (!response.ok) {
                throw new Error('Unable to replan trip');
            }

            const tripData = (await response.json()) as TripApiResponse;
            setTripSummary(tripData.summary);
            setBudgetBreakdown(tripData.budget_breakdown);
            setSourceNotes(tripData.data_source_notes);
            setDisplayDestination(tripData.destination);
            setDisplayStyle(tripData.style);
            setDisplayBudget(tripData.budget);
            setDestination(tripData.destination);
            setStartDate(tripData.start_date);
            setEndDate(tripData.end_date);
            setBudget(tripData.budget);
            setStyle(tripData.style);
            setInterests(tripData.interests.join(', '));
            setGeneratedItinerary(
                tripData.itinerary.map((day) => ({
                    day: day.day,
                    title: day.title,
                    morning: day.morning,
                    afternoon: day.afternoon,
                    evening: day.evening,
                    cost: day.cost,
                })),
            );
            setSubmitted(true);
            await refreshSavedTrips(tripData.trip_id);
            await refreshRevisions(tripData.trip_id);
        } catch (replanError) {
            setError(replanError instanceof Error ? replanError.message : 'Unable to replan trip');
        } finally {
            setLoading(false);
        }
    }

    async function askAssistant() {
        const text = chatInput.trim();
        if (!text || chatStreaming) {
            return;
        }

        setChatError('');
        setChatStreaming(true);
        setChatMessages((prev) => [...prev, { role: 'user', text }]);
        setChatInput('');

        try {
            const response = await fetch(`${apiBaseUrl}/assistant/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authH },
                body: JSON.stringify({ message: text, trip_id: tripId || null }),
            });

            if (!response.ok) {
                throw new Error('Assistant request failed');
            }

            const data = (await response.json()) as ChatApiResponse;
            const tokens = data.stream_tokens?.length ? data.stream_tokens : data.reply.split(' ');

            setChatMessages((prev) => [...prev, { role: 'assistant', text: '' }]);
            let partial = '';
            for (const token of tokens) {
                partial = partial ? `${partial} ${token}` : token;
                setChatMessages((prev) => {
                    const next = [...prev];
                    const idx = next.length - 1;
                    if (idx >= 0 && next[idx].role === 'assistant') {
                        next[idx] = { ...next[idx], text: partial };
                    }
                    return next;
                });
                await delay(22);
            }
        } catch (assistantError) {
            setChatError(assistantError instanceof Error ? assistantError.message : 'Assistant unavailable');
        } finally {
            setChatStreaming(false);
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <header className="site-header travel-hero mb-6 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-coral">AI Travel Guide</p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-5xl hero-title">Plan the trip. Adapt on the road.</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">A concierge-style travel agent that builds itineraries, checks the budget, and keeps weather and map context in view.</p>
                    </div>
                    <div className="hidden md:block">
                        <img src={destinationImage} alt="Travel hero" className="w-44 rounded-lg shadow-md object-cover h-28" />
                    </div>
                    <div className="flex items-center gap-4">
                        <AuthControls />
                        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                            <Badge label="Maps" value="Live-ready" />
                            <Badge label="Weather" value="Contextual" />
                            <Badge label="Budget" value="Tracked" />
                            <Badge label="Trips" value="Saved" />
                        </div>
                    </div>
                </header>

                <main className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-glow backdrop-blur">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-ink">Trip Planner</h2>
                                <p className="mt-1 text-sm text-slate-600">Collect the essentials and let the agent assemble the first draft.</p>
                            </div>
                            <button
                                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                                onClick={() => void generatePlan()}
                                type="button"
                                aria-label="Generate trip plan"
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate plan'}
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                                onClick={() => void refreshSavedTrips(tripId || undefined)}
                                type="button"
                                aria-label="Refresh saved trips"
                            >
                                Refresh saved trips
                            </button>
                            <button
                                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                                onClick={() => void replanTrip()}
                                type="button"
                                aria-label="Replan current trip"
                                disabled={!tripId || loading}
                            >
                                Replan current trip
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Field label="Destination" value={destination} onChange={setDestination} placeholder="Paris" list="destinations" />
                            <Field label="Travel style" value={style} onChange={setStyle} placeholder="Balanced" />
                            <Field label="Start date" type="date" value={startDate} onChange={setStartDate} />
                            <Field label="End date" type="date" value={endDate} onChange={setEndDate} />
                            <Field label="Budget (USD)" type="number" value={String(budget)} onChange={(value) => setBudget(Number(value || 0))} />
                            <Field label="Interests" value={interests} onChange={setInterests} placeholder="Food, museums, beaches" />
                        </div>

                        <datalist id="destinations">
                            {featuredDestinations.map((item) => (
                                <option key={item} value={item} />
                            ))}
                        </datalist>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <InfoCard title="Budget snapshot" value={`$${displayBudget.toLocaleString()}`} description="Suggested total budget" accent="bg-sand" />
                            <InfoCard title="Trip length" value={`${itinerary.length} days`} description="AI adjusts the plan around dates" accent="bg-skywash" />
                            <InfoCard title="Style" value={displayStyle} description="Used to balance pace and activities" accent="bg-rose-100" />
                        </div>

                        <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Agent response</p>
                                    <h3 className="mt-1 text-xl font-semibold">Your assistant suggests a smart, paced itinerary</h3>
                                </div>
                                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{tripId ? 'API-backed draft' : 'Mock AI draft'}</span>
                            </div>
                            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{submitted ? tripSummary : 'Press Generate plan to create the first itinerary draft. The assistant will explain why each stop was selected and how the budget is distributed.'}</p>
                            {error ? <p className="mt-3 rounded-2xl bg-rose-500/15 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
                        </div>
                    </section>

                    <section className="grid gap-6">
                        <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-glow backdrop-blur">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-ink">Day-by-day itinerary</h2>
                                    <p className="mt-1 text-sm text-slate-600">Each day stays within the budget envelope and keeps activities nearby.</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">${totalCost.toLocaleString()} estimated</span>
                            </div>
                            <div className="mt-5 grid gap-4" role="list" aria-label="Day-by-day itinerary">
                                {itinerary.map((day, idx) => (
                                    <article key={day.day} role="listitem" className="itinerary-card flex gap-3 items-start" style={{ ['--i' as any]: idx }}>
                                        <img src={destinationImage} alt={displayKey} className="w-28 h-20 rounded-md object-cover flex-shrink-0" />
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Day {day.day}</p>
                                                <h3 className="mt-1 text-lg font-bold text-ink">{day.title}</h3>
                                            </div>
                                            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">${day.cost}</span>
                                        </div>
                                        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                                            <MiniBlock label="Morning" text={day.morning} />
                                            <MiniBlock label="Afternoon" text={day.afternoon} />
                                            <MiniBlock label="Evening" text={day.evening} />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Panel title="Weather" subtitle="Forecast-aware planning">
                                <div className="grid gap-3 text-sm text-slate-700">
                                    {forecast.map((day) => (
                                        <p key={day.day} className="rounded-2xl bg-slate-50 px-3 py-2">
                                            {day.day}: {day.condition}, {day.high_c}°C / {day.low_c}°C
                                        </p>
                                    ))}
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Source: {weather?.source ?? 'mock'}</p>
                                </div>
                            </Panel>
                            <Panel title="Map" subtitle="Nearby clustering">
                                <p className="text-sm text-slate-700">The route clusters the museum, market, and dinner spot within the same transit zone.</p>
                            </Panel>
                            <Panel title="Budget agent" subtitle="Estimated categories">
                                <div className="grid gap-2 text-sm text-slate-700">
                                    {Object.keys(budgetBreakdown).length > 0 ? (
                                        Object.entries(budgetBreakdown).map(([key, value]) => (
                                            <p key={key} className="rounded-2xl bg-slate-50 px-3 py-2 capitalize">
                                                {key}: ${value.toLocaleString()}
                                            </p>
                                        ))
                                    ) : (
                                        <p>Lodging 40%, food 25%, activities 20%, transport 15%.</p>
                                    )}
                                </div>
                            </Panel>
                            <Panel title="Emergency" subtitle="Quick access">
                                <p className="text-sm text-slate-700">Surface emergency numbers, embassy notes, and safety reminders for the destination.</p>
                            </Panel>
                        </div>

                        <Panel title="Travel FAQ" subtitle="RAG-ready knowledge base">
                            <div className="grid gap-3 text-sm text-slate-700">
                                {faqResults.length > 0 ? (
                                    faqResults.map((item) => (
                                        <div key={item.question} className="rounded-2xl bg-slate-50 px-3 py-3">
                                            <p className="font-semibold text-ink">{item.question}</p>
                                            <p className="mt-1">{item.answer}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>FAQ answers will appear here after plan generation.</p>
                                )}
                            </div>
                        </Panel>

                        <Panel title="AI Assistant Chat" subtitle="Streaming placeholder">
                            <div className="space-y-3">
                                <div
                                    className="max-h-56 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3"
                                    role="log"
                                    aria-live="polite"
                                    aria-atomic="false"
                                    tabIndex={0}
                                >
                                    {chatMessages.map((message, idx) => (
                                        <div
                                            key={`${message.role}-${idx}`}
                                            role="article"
                                            aria-label={message.role}
                                            className={`rounded-2xl px-3 py-2 text-sm ${message.role === 'assistant' ? 'bg-white text-slate-800' : 'bg-ink text-white'}`}
                                        >
                                            <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">{message.role}</p>
                                            <p className="mt-1 leading-6">{message.text || (chatStreaming && idx === chatMessages.length - 1 ? '...' : '')}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        aria-label="Chat input"
                                        value={chatInput}
                                        onChange={(event) => setChatInput(event.target.value)}
                                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-ink"
                                        placeholder="Ask for route tweaks, budget trimming, food spots..."
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                void askAssistant();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Send chat message"
                                        onClick={() => void askAssistant()}
                                        disabled={chatStreaming}
                                        className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                    >
                                        {chatStreaming ? 'Streaming...' : 'Send'}
                                    </button>
                                </div>

                                {chatError ? <p className="text-sm text-rose-600">{chatError}</p> : null}
                            </div>
                        </Panel>

                        <Panel title="Data source notes" subtitle="Mock versus real data">
                            <ul className="grid gap-2 text-sm text-slate-700">
                                {sourceNotes.map((note) => (
                                    <li key={note} className="rounded-2xl bg-slate-50 px-3 py-2">{note}</li>
                                ))}
                            </ul>
                        </Panel>

                        <Panel title="Saved trips" subtitle="Persistent trip history">
                            <div className="grid gap-3 text-sm text-slate-700">
                                {savedTrips.length > 0 ? (
                                    savedTrips.map((trip) => (
                                        <button
                                            key={trip.trip_id}
                                            type="button"
                                            aria-label={`Load trip ${trip.destination}`}
                                            onClick={() => void loadTrip(trip.trip_id)}
                                            className={`rounded-2xl border px-3 py-3 text-left transition ${trip.trip_id === tripId ? 'border-ink bg-ink/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-semibold text-ink">{trip.destination}</p>
                                                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">v{trip.version}</span>
                                            </div>
                                            <p className="mt-1">{trip.summary}</p>
                                            <p className="mt-2 text-xs text-slate-500">${trip.budget.toLocaleString()} • {trip.style} • updated {new Date(trip.updated_at).toLocaleString()}</p>
                                        </button>
                                    ))
                                ) : (
                                    <p>No saved trips yet. Generate one to store it here.</p>
                                )}
                            </div>
                        </Panel>

                        <Panel title="Revision history" subtitle="Versioned changes">
                            <div className="grid gap-3 text-sm text-slate-700">
                                {revisionHistory.length > 0 ? (
                                    revisionHistory.map((revision) => (
                                        <div key={`${revision.version}-${revision.created_at}`} className="rounded-2xl bg-slate-50 px-3 py-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="font-semibold text-ink">Version {revision.version}</p>
                                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{new Date(revision.created_at).toLocaleString()}</p>
                                            </div>
                                            <p className="mt-1">{revision.note}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No revisions loaded yet.</p>
                                )}
                            </div>
                        </Panel>
                    </section>
                </main>
            </div>
        </div>
    );
}

function roundBudgetPortion(total: number, ratio: number) {
    return Math.round(total * ratio);
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function Badge({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center travel-badge">
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</div>
            <div className="mt-1 text-sm font-bold text-ink">{value}</div>
        </div>
    );
}

function AuthControls() {
    const { token, logout } = useAuth();
    if (token) {
        return (
            <div className="flex items-center gap-3">
                <Link to="/" className="text-sm font-medium text-slate-700">Dashboard</Link>
                <button className="rounded bg-slate-100 px-3 py-1 text-sm" onClick={() => logout()}>Sign out</button>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-700">Sign in</Link>
            <Link to="/signup" className="rounded bg-ink px-3 py-1 text-sm text-white">Get started</Link>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    list,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    list?: string;
}) {
    return (
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {label}
            <input
                aria-label={label}
                className="form-input rounded-2xl bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400"
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                list={list}
            />
        </label>
    );
}

function InfoCard({ title, value, description, accent }: { title: string; value: string; description: string; accent: string }) {
    return (
        <div className={`rounded-3xl ${accent} p-4`}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-black text-ink">{value}</p>
            <p className="mt-1 text-sm text-slate-700">{description}</p>
        </div>
    );
}

function MiniBlock({ label, text }: { label: string; text: string }) {
    return (
        <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
            <p className="mt-2 leading-6 text-slate-700">{text}</p>
        </div>
    );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
    return (
        <div className="panel shadow-glow backdrop-blur" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">{subtitle}</p>
            <h3 className="mt-2 text-xl font-bold text-ink">{title}</h3>
            <div className="mt-3">{children}</div>
        </div>
    );
}
