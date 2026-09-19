import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import useReveal from './hooks/useReveal.tsx';
import { Link, useLocation } from 'react-router-dom';
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

type PlaceApiResponse = {
    query: string;
    results: Array<{
        name: string;
        category: string;
        lat?: number;
        lng?: number;
    }>;
    source: string;
};

type MapApiResponse = {
    center: { lat: number; lng: number };
    places: Array<{
        name: string;
        category: string;
        distance_km: number;
        lat?: number;
        lng?: number;
    }>;
    source: string;
};

type TravelProfile = {
    budget_range: string;
    interests: string[];
    food_preferences: string[];
    travel_style: string;
    preferred_transport: string[];
};

type TravelRecommendations = {
    destination: string;
    currency: string;
    hotels: Array<{ name: string; area: string; nightly_inr: number; rating: number }>;
    transport: Array<{ mode: string; note: string; estimated_inr: number }>;
    restaurants: Array<{ name: string; cuisine: string; price_band: string; area: string }>;
    route_tip: string;
    notifications: Array<{ type: string; message: string }>;
};

type DestinationRecommendation = {
    name: string;
    region: string;
    best_for: string[];
    season: string;
};

type ChecklistItem = {
    id: string;
    label: string;
    category: string;
    checked: boolean;
};

type ComparisonOption = {
    destination: string;
    estimated_cost: number;
    budget_fit: boolean;
    travel_time: string;
    activities: string;
    weather: string;
    food: string;
    relaxation: string;
};

type GroupPlan = {
    consensus: string;
    plan: string[];
    constraints_applied: string;
    budget_strategy: string;
};

type RouteStop = {
    name: string;
    category: string;
    distance_km: number;
    travel_time_min: number;
    mode: string;
};

type JournalEntry = {
    id: string;
    kind: string;
    text: string;
    amount_inr: number | null;
    place: string | null;
    file_path: string | null;
    created_at: string;
};

type ResearchReport = {
    updated_at: string;
    weather: WeatherApiResponse;
    attractions_and_restaurants: Array<{ name: string; category: string; opening_hours?: string; website?: string; source: string }>;
    providers: Record<string, { available: boolean; provider: string | null; message: string }>;
    source_notes: string[];
    limitations: string[];
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
    trip_update?: TripApiResponse;
};

type UploadMeta = {
    file_name: string;
    file_path: string;
    content_type: string;
    size: number;
};

type ChatMessage = {
    role: 'user' | 'assistant';
    text: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const featuredDestinations = ['Jaipur', 'Delhi', 'Mumbai', 'Goa', 'Kochi', 'Varanasi'];

const DESTINATION_IMAGES: Record<string, string> = {
    Jaipur: new URL('./assets/india.svg', import.meta.url).href,
    Delhi: new URL('./assets/india.svg', import.meta.url).href,
    Mumbai: new URL('./assets/india.svg', import.meta.url).href,
    Goa: new URL('./assets/india.svg', import.meta.url).href,
    Kochi: new URL('./assets/india.svg', import.meta.url).href,
    Varanasi: new URL('./assets/india.svg', import.meta.url).href,
    Paris: new URL('./assets/paris.svg', import.meta.url).href,
    Tokyo: new URL('./assets/tokyo.svg', import.meta.url).href,
    Lisbon: new URL('./assets/lisbon.svg', import.meta.url).href,
    'Cape Town': new URL('./assets/capetown.svg', import.meta.url).href,
};

const DESTINATION_GALLERIES: Record<string, string[]> = {
    Jaipur: [
        'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=900&q=85',
    ],
    Goa: [
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
    ],
    Kerala: [
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1596178060810-72c7d4b8f9f4?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=900&q=85',
    ],
    Mumbai: [
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=85',
    ],
    Delhi: [
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85',
    ],
};

const SCENIC_FALLBACK = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85';

const DAY_FALLBACK_IMAGES = [
    SCENIC_FALLBACK,
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=85',
];

function scenicImageForDay(destination: string, dayIndex: number) {
    const key = destination.split(',')[0].trim();
    const gallery = DESTINATION_GALLERIES[key];
    if (gallery) {
        return gallery[dayIndex % gallery.length];
    }
    return DAY_FALLBACK_IMAGES[dayIndex % DAY_FALLBACK_IMAGES.length];
}

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

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialDestination = searchParams.get('destination')?.trim() || 'Jaipur';
    const initialInterest = searchParams.get('interest')?.trim() || 'Food, history, viewpoints';
    const [destination, setDestination] = useState(initialDestination);
    const [startDate, setStartDate] = useState('2026-10-10');
    const [endDate, setEndDate] = useState('2026-10-13');
    const [budget, setBudget] = useState(100000);
    const [style, setStyle] = useState('Balanced');
    const [interests, setInterests] = useState(initialInterest);
    const [ecoMode, setEcoMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tripSummary, setTripSummary] = useState('Press Generate plan to create the first itinerary draft. The assistant will explain why each stop was selected and how the budget is distributed.');
    const [budgetBreakdown, setBudgetBreakdown] = useState<Record<string, number>>({});
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
    const [poiResults, setPoiResults] = useState<Array<{ name: string; category: string }>>([]);
    const [mapPlaces, setMapPlaces] = useState<Array<{ name: string; category: string; distance_km: number }>>([]);
    const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
    const [travelRecommendations, setTravelRecommendations] = useState<TravelRecommendations | null>(null);
    const [destinationRecommendations, setDestinationRecommendations] = useState<DestinationRecommendation[]>([]);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [journalDiary, setJournalDiary] = useState('');
    const [journalNote, setJournalNote] = useState('');
    const [journalPlace, setJournalPlace] = useState('');
    const [journalExpense, setJournalExpense] = useState('');
    const [discovering, setDiscovering] = useState(false);
    const [compareFirst, setCompareFirst] = useState('Goa');
    const [compareSecond, setCompareSecond] = useState('Kerala');
    const [compareBudget, setCompareBudget] = useState(30000);
    const [compareDays, setCompareDays] = useState(5);
    const [comparison, setComparison] = useState<ComparisonOption[]>([]);
    const [comparing, setComparing] = useState(false);
    const [groupMembers, setGroupMembers] = useState('Vaishnavi: vegetarian\nFriend 1: adventure\nFriend 2: museums');
    const [groupPlan, setGroupPlan] = useState<GroupPlan | null>(null);
    const [grouping, setGrouping] = useState(false);
    const [researchReport, setResearchReport] = useState<ResearchReport | null>(null);
    const [mapSearch, setMapSearch] = useState(initialDestination);
    const [mapEmbedUrl, setMapEmbedUrl] = useState(
        'https://www.openstreetmap.org/export/embed.html?bbox=75.70%2C26.85%2C75.88%2C26.98&layer=mapnik&marker=26.9124%2C75.7873',
    );
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
    const [uploadFiles, setUploadFiles] = useState<UploadMeta[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [visionFiles, setVisionFiles] = useState<File[]>([]);
    const [visionPrompt, setVisionPrompt] = useState('Which hotel or monument option fits my itinerary best?');
    const [visionResult, setVisionResult] = useState('');
    const [visionLoading, setVisionLoading] = useState(false);
    const [voiceActive, setVoiceActive] = useState(false);
    const [profile, setProfile] = useState<TravelProfile>({
        budget_range: 'mid-range',
        interests: ['food', 'heritage'],
        food_preferences: ['vegetarian-friendly'],
        travel_style: 'balanced',
        preferred_transport: ['train', 'metro'],
    });
    const [profileStatus, setProfileStatus] = useState('');
    const recognitionRef = useRef<{ stop: () => void } | null>(null);

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
        void refreshProfile();
        void refreshTravelRecommendations(destination, budget);
        void refreshResearch(destination, startDate, endDate);
        void refreshMapForDestination(destination);
        void refreshRoute(destination);
    }, []);

    const displayKey = (destination || displayDestination).split(',')[0].trim();
    const destinationImage = DESTINATION_IMAGES[displayKey] ?? DESTINATION_IMAGES['Jaipur'];

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

        if (ecoMode) {
            payload.interests.push('eco-friendly public transport and local businesses');
        }

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

            const [weatherResponse, faqResponse, placesResponse] = await Promise.all([
                fetch(`${apiBaseUrl}/weather?city=${encodeURIComponent(tripData.destination)}`),
                fetch(`${apiBaseUrl}/faq/search?q=${encodeURIComponent(tripData.destination)}`),
                fetch(`${apiBaseUrl}/places/search?q=${encodeURIComponent(tripData.destination)}`),
            ]);

            if (weatherResponse.ok) {
                setWeather((await weatherResponse.json()) as WeatherApiResponse);
            }

            if (faqResponse.ok) {
                const faqData = (await faqResponse.json()) as FaqApiResponse;
                setFaqResults(faqData.results);
            }

            if (placesResponse.ok) {
                const placesData = (await placesResponse.json()) as PlaceApiResponse;
                const placeList = (placesData.results ?? []).slice(0, 6).map((place) => ({
                    name: place.name,
                    category: place.category,
                }));
                setPoiResults(placeList);

                const center = placesData.results?.[0];
                if (center && typeof center.lat === 'number' && typeof center.lng === 'number') {
                    const nearbyResponse = await fetch(`${apiBaseUrl}/maps/nearby?lat=${center.lat}&lng=${center.lng}`);
                    if (nearbyResponse.ok) {
                        const nearbyData = (await nearbyResponse.json()) as MapApiResponse;
                        setMapPlaces((nearbyData.places ?? []).slice(0, 3).map((place) => ({
                            name: place.name,
                            category: place.category,
                            distance_km: place.distance_km,
                        })));
                    }
                    await refreshMapForDestination(tripData.destination);
                    await refreshRoute(tripData.destination);
                }
            }

            await refreshTravelRecommendations(tripData.destination, tripData.budget);
            await refreshResearch(tripData.destination, tripData.start_date, tripData.end_date);
            await refreshChecklist(tripData.trip_id);
            await refreshJournal(tripData.trip_id);

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
            setPoiResults([]);
            setMapPlaces([]);
            setFaqResults([]);
        } finally {
            setLoading(false);
        }
    }

    async function refreshMapForDestination(dest: string) {
        setMapSearch(dest);
        try {
            const response = await fetch(`${apiBaseUrl}/places/search?q=${encodeURIComponent(dest)}`);
            if (!response.ok) {
                return;
            }
            const data = (await response.json()) as PlaceApiResponse;
            const firstMatch = data.results?.[0];
            if (!firstMatch || typeof firstMatch.lat !== 'number' || typeof firstMatch.lng !== 'number') {
                return;
            }
            const minLng = firstMatch.lng - 0.04;
            const maxLng = firstMatch.lng + 0.04;
            const minLat = firstMatch.lat - 0.03;
            const maxLat = firstMatch.lat + 0.03;
            setMapEmbedUrl(
                `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${firstMatch.lat}%2C${firstMatch.lng}`,
            );
        } catch {
            setMapEmbedUrl(
                'https://www.openstreetmap.org/export/embed.html?bbox=-9.2209%2C38.6900%2C-9.0400%2C38.7700&layer=mapnik&marker=38.7223%2C-9.1393',
            );
        }
    }

    async function refreshRoute(dest: string) {
        const stops = `${dest},${dest} Fort,${dest} Museum,${dest} Lunch,${dest} Beach,${dest} Dinner`;
        const response = await fetch(`${apiBaseUrl}/maps/route?stops=${encodeURIComponent(stops)}`);
        if (response.ok) {
            const data = (await response.json()) as { stops: RouteStop[] };
            setRouteStops(data.stops);
        }
    }

    async function handleMapSearch() {
        const trimmed = mapSearch.trim();
        if (!trimmed) {
            return;
        }
        await refreshMapForDestination(trimmed);
        setDestination(trimmed);
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

    async function refreshProfile() {
        const response = await fetch(`${apiBaseUrl}/profile`, { headers: { ...authH } });
        if (!response.ok) {
            return;
        }
        const data = (await response.json()) as { profile: TravelProfile };
        setProfile(data.profile);
    }

    async function saveProfile() {
        setProfileStatus('Saving profile...');
        const response = await fetch(`${apiBaseUrl}/profile`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authH },
            body: JSON.stringify({ profile }),
        });
        setProfileStatus(response.ok ? 'Profile saved' : 'Sign in to save your profile');
    }

    async function refreshTravelRecommendations(dest: string, budgetAmount: number) {
        const response = await fetch(`${apiBaseUrl}/travel/recommendations?destination=${encodeURIComponent(dest)}&budget=${budgetAmount}`);
        if (response.ok) {
            setTravelRecommendations((await response.json()) as TravelRecommendations);
        }
    }

    async function refreshChecklist(activeTripId: string) {
        const response = await fetch(`${apiBaseUrl}/trips/${activeTripId}/checklist`, { headers: { ...authH } });
        if (response.ok) {
            setChecklist((await response.json()) as ChecklistItem[]);
        }
    }

    async function refreshJournal(activeTripId: string) {
        const response = await fetch(`${apiBaseUrl}/trips/${activeTripId}/journal`, { headers: { ...authH } });
        if (response.ok) {
            const data = (await response.json()) as { entries: JournalEntry[]; diary: string };
            setJournalEntries(data.entries);
            setJournalDiary(data.diary);
        }
    }

    async function addJournalEntry() {
        if (!tripId || !journalNote.trim()) {
            return;
        }
        const entry: JournalEntry = {
            id: `journal_${Date.now()}`,
            kind: journalExpense ? 'expense' : 'note',
            text: journalNote.trim(),
            amount_inr: journalExpense ? Number(journalExpense) : null,
            place: journalPlace.trim() || null,
            file_path: null,
            created_at: new Date().toISOString(),
        };
        const response = await fetch(`${apiBaseUrl}/trips/${tripId}/journal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authH },
            body: JSON.stringify({ entry }),
        });
        if (response.ok) {
            setJournalNote('');
            setJournalPlace('');
            setJournalExpense('');
            await refreshJournal(tripId);
        }
    }

    async function toggleChecklistItem(itemId: string) {
        if (!tripId) {
            return;
        }
        const nextItems = checklist.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item);
        setChecklist(nextItems);
        const response = await fetch(`${apiBaseUrl}/trips/${tripId}/checklist`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...authH },
            body: JSON.stringify({ items: nextItems }),
        });
        if (!response.ok) {
            setChecklist(checklist);
        }
    }

    async function refreshResearch(dest: string, start: string, end: string) {
        const response = await fetch(`${apiBaseUrl}/research?destination=${encodeURIComponent(dest)}&start_date=${start}&end_date=${end}`);
        if (response.ok) {
            setResearchReport((await response.json()) as ResearchReport);
        }
    }

    async function replanForWeather() {
        if (!tripId) {
            setChatError('Generate or load a trip before checking for weather conflicts.');
            return;
        }
        const response = await fetch(`${apiBaseUrl}/trips/${tripId}/weather-replan`, {
            method: 'POST',
            headers: { ...authH },
        });
        if (!response.ok) {
            setChatError('Unable to replan around the current forecast.');
            return;
        }
        const data = (await response.json()) as { trip: TripApiResponse; notification: string };
        const updatedTrip = data.trip;
        setTripSummary(updatedTrip.summary);
        setSourceNotes(updatedTrip.data_source_notes);
        setGeneratedItinerary(updatedTrip.itinerary.map((day) => ({
            day: day.day,
            title: day.title,
            morning: day.morning,
            afternoon: day.afternoon,
            evening: day.evening,
            cost: day.cost,
        })));
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.notification }]);
        await refreshRevisions(updatedTrip.trip_id);
    }

    async function discoverIndia() {
        setDiscovering(true);
        try {
            const response = await fetch(`${apiBaseUrl}/destinations/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    budget,
                    duration_days: Math.max(itinerary.length, 1),
                    interests: profile.interests,
                    month: Number(startDate.slice(5, 7)),
                }),
            });
            if (response.ok) {
                const data = (await response.json()) as { results: DestinationRecommendation[] };
                setDestinationRecommendations(data.results);
            }
        } finally {
            setDiscovering(false);
        }
    }

    async function compareDestinations() {
        setComparing(true);
        try {
            const response = await fetch(`${apiBaseUrl}/destinations/compare`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_destination: compareFirst,
                    second_destination: compareSecond,
                    budget: compareBudget,
                    duration_days: compareDays,
                }),
            });
            if (response.ok) {
                const data = (await response.json()) as { options: ComparisonOption[] };
                setComparison(data.options);
            }
        } finally {
            setComparing(false);
        }
    }

    async function createGroupPlan() {
        setGrouping(true);
        try {
            const travelers = groupMembers.split('\n').map((line) => {
                const [name, preference] = line.split(':');
                return { name: name.trim(), preference: (preference || 'flexible').trim() };
            }).filter((traveler) => traveler.name);
            const response = await fetch(`${apiBaseUrl}/destinations/group-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, budget, duration_days: itinerary.length, travelers }),
            });
            if (response.ok) {
                setGroupPlan((await response.json()) as GroupPlan);
            }
        } finally {
            setGrouping(false);
        }
    }

    async function addCategorizedExpense() {
        if (!tripId || !journalNote.trim() || !journalExpense) {
            return;
        }
        const response = await fetch(`${apiBaseUrl}/trips/${tripId}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authH },
            body: JSON.stringify({ message: `₹${journalExpense} ${journalNote}` }),
        });
        if (response.ok) {
            setJournalNote('');
            setJournalExpense('');
            await refreshJournal(tripId);
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

    async function askAssistant(providedText?: string) {
        const text = (providedText ?? chatInput).trim();
        if (!text || chatStreaming) {
            return;
        }

        setChatError('');
        setChatStreaming(true);
        setChatMessages((prev) => [...prev, { role: 'user', text }]);
        if (!providedText) {
            setChatInput('');
        }

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

            if (data.trip_update) {
                const updatedTrip = data.trip_update;
                setTripId(updatedTrip.trip_id);
                setTripSummary(updatedTrip.summary);
                setBudgetBreakdown(updatedTrip.budget_breakdown);
                setSourceNotes(updatedTrip.data_source_notes);
                setDisplayDestination(updatedTrip.destination);
                setDisplayStyle(updatedTrip.style);
                setDisplayBudget(updatedTrip.budget);
                setGeneratedItinerary(updatedTrip.itinerary.map((day) => ({
                    day: day.day,
                    title: day.title,
                    morning: day.morning,
                    afternoon: day.afternoon,
                    evening: day.evening,
                    cost: day.cost,
                })));
                setSubmitted(true);
                await refreshRevisions(updatedTrip.trip_id);
            }

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

    async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setUploading(true);
        setUploadError('');
        const formData = new FormData();
        formData.append('file', file);
        if (tripId) {
            formData.append('trip_id', tripId);
        }

        try {
            const response = await fetch(`${apiBaseUrl}/uploads`, {
                method: 'POST',
                headers: { ...authH },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const uploaded = (await response.json()) as UploadMeta;
            setUploadFiles((prev) => [uploaded, ...prev]);
            if (tripId) {
                await refreshJournal(tripId);
            }
        } catch (uploadError) {
            setUploadError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    async function analyzeVision() {
        if (visionFiles.length === 0) {
            return;
        }
        setVisionLoading(true);
        const formData = new FormData();
        visionFiles.forEach((file) => formData.append('files', file));
        formData.append('prompt', visionPrompt);
        try {
            const response = await fetch(`${apiBaseUrl}/assistant/vision`, { method: 'POST', body: formData });
            const data = (await response.json()) as { analysis?: string };
            setVisionResult(data.analysis ?? 'No visual analysis returned.');
        } finally {
            setVisionLoading(false);
        }
    }

    function toggleVoiceInput() {
        const recognitionCtor = (window as typeof window & {
            SpeechRecognition?: new () => {
                lang: string;
                continuous: boolean;
                interimResults: boolean;
                onstart: (() => void) | null;
                onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
                onend: (() => void) | null;
                onerror: ((event: { error: string }) => void) | null;
                start: () => void;
                stop: () => void;
            };
            webkitSpeechRecognition?: new () => {
                lang: string;
                continuous: boolean;
                interimResults: boolean;
                onstart: (() => void) | null;
                onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
                onend: (() => void) | null;
                onerror: ((event: { error: string }) => void) | null;
                start: () => void;
                stop: () => void;
            };
        }).SpeechRecognition || (window as typeof window & { webkitSpeechRecognition?: new () => { lang: string; continuous: boolean; interimResults: boolean; onstart: (() => void) | null; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null; onend: (() => void) | null; onerror: ((event: { error: string }) => void) | null; start: () => void; stop: () => void; } }).webkitSpeechRecognition;

        if (!recognitionCtor) {
            setChatError('Voice input is not supported in this browser. Try typing your prompt instead.');
            return;
        }

        if (voiceActive) {
            recognitionRef.current?.stop();
            return;
        }

        let latestTranscript = '';
        const recognition = new recognitionCtor();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setVoiceActive(true);
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => Array.from(result).map((entry) => entry.transcript).join(' '))
                .join(' ')
                .trim();

            if (!transcript) {
                return;
            }

            latestTranscript = transcript;
            setChatInput(transcript);
        };
        recognition.onend = () => {
            setVoiceActive(false);
            recognitionRef.current = null;
            const spokenText = latestTranscript.trim();
            if (spokenText) {
                setChatInput(spokenText);
                void askAssistant(spokenText);
            }
        };
        recognition.onerror = (event) => {
            setChatError(`Voice input failed: ${event.error}`);
            setVoiceActive(false);
            recognitionRef.current = null;
        };

        recognition.start();
        setChatMessages((prev) => [
            ...prev,
            {
                role: 'assistant',
                text: 'Voice mode is on. Speak naturally and I will turn your request into an assistant prompt.',
            },
        ]);
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_28%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
                <header className="site-header travel-hero mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 p-5 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-coral">AI India Travel Guide</p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl hero-title md:text-6xl">Plan the trip. Adapt on the road.</h1>
                        <p className="mt-3 max-w-xl text-sm text-slate-100/90 sm:text-base">A concierge-style travel agent that builds itineraries, tracks your budget, and keeps weather and route context in view.</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                className="btn-cta rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
                                onClick={() => void generatePlan()}
                            >
                                Generate plan
                            </button>
                            <Link to="/login" className="rounded-full border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
                                View dashboard
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="hidden rounded-[24px] border border-white/30 bg-white/10 p-2 shadow-lg shadow-slate-900/10 backdrop-blur-sm md:block">
                            <img src={destinationImage} alt="Travel hero" className="h-28 w-44 rounded-[18px] object-cover shadow-md" />
                        </div>
                        <div className="flex items-center gap-4">
                            <AuthControls />
                        </div>
                    </div>
                </header>

                <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Badge label="Maps" value="Live-ready" />
                    <Badge label="Weather" value="Contextual" />
                    <Badge label="Budget" value="Tracked" />
                    <Badge label="Trips" value="Saved" />
                </div>

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

                        <div className="action-row mt-4 flex flex-wrap gap-3">
                            <button
                                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                                onClick={() => void refreshSavedTrips(tripId || undefined)}
                                type="button"
                                aria-label="Refresh saved trips"
                            >
                                Refresh saved trips
                            </button>
                            <button
                                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={() => void replanTrip()}
                                type="button"
                                aria-label="Replan current trip"
                                disabled={!tripId || loading}
                            >
                                Replan current trip
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Field label="India destination" value={destination} onChange={setDestination} placeholder="Jaipur" list="destinations" />
                            <Field label="Travel style" value={style} onChange={setStyle} placeholder="Balanced" />
                            <Field label="Start date" type="date" value={startDate} onChange={setStartDate} />
                            <Field label="End date" type="date" value={endDate} onChange={setEndDate} />
                            <Field label="Budget (INR)" type="number" value={String(budget)} onChange={(value) => setBudget(Number(value || 0))} />
                            <Field label="Interests" value={interests} onChange={setInterests} placeholder="Food, museums, beaches" />
                        </div>
                        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                            <input type="checkbox" checked={ecoMode} onChange={(event) => setEcoMode(event.target.checked)} className="h-4 w-4 accent-emerald-600" />
                            <span><strong>Eco-friendly trip</strong><br /><span className="text-xs">Prioritize trains, public transport, walking, local businesses, and lower-carbon stays.</span></span>
                        </label>

                        <datalist id="destinations">
                            {featuredDestinations.map((item) => (
                                <option key={item} value={item} />
                            ))}
                        </datalist>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <InfoCard title="Budget snapshot" value={`₹${displayBudget.toLocaleString('en-IN')}`} description="Suggested total budget" accent="bg-sand" />
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
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">₹{totalCost.toLocaleString('en-IN')} estimated</span>
                            </div>
                            <div className="mt-5 grid gap-4" role="list" aria-label="Day-by-day itinerary">
                                {itinerary.map((day, idx) => (
                                    <article key={day.day} role="listitem" className="itinerary-card flex gap-3 items-start" style={{ ['--i' as any]: idx }}>
                                        <img
                                            src={scenicImageForDay(destination, idx)}
                                            alt={`${displayKey} scenic view for day ${day.day}`}
                                            className="w-28 h-20 rounded-md object-cover flex-shrink-0"
                                            onError={(event) => {
                                                event.currentTarget.onerror = null;
                                                event.currentTarget.src = DAY_FALLBACK_IMAGES[idx % DAY_FALLBACK_IMAGES.length];
                                            }}
                                        />
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Day {day.day}</p>
                                                <h3 className="mt-1 text-lg font-bold text-ink">{day.title}</h3>
                                            </div>
                                            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">₹{day.cost.toLocaleString('en-IN')}</span>
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
                                <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50 p-2">
                                    <div className="mb-3 flex gap-2">
                                        <input
                                            aria-label="Search map area"
                                            value={mapSearch}
                                            onChange={(event) => setMapSearch(event.target.value)}
                                            placeholder="Search map area"
                                            className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault();
                                                    void handleMapSearch();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void handleMapSearch()}
                                            className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <iframe
                                        title="Destination map"
                                        src={mapEmbedUrl}
                                        className="h-48 w-full rounded-[18px] border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                    <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-3">
                                        {(mapPlaces.length > 0 ? mapPlaces : [
                                            { name: 'Museum', category: 'museum', distance_km: 0.8 },
                                            { name: 'Market', category: 'market', distance_km: 1.2 },
                                            { name: 'Dinner', category: 'restaurant', distance_km: 0.4 },
                                        ]).map((place) => (
                                            <div key={place.name} className="rounded-2xl bg-white/80 px-2 py-2">
                                                <p className="font-semibold text-slate-800">{place.name}</p>
                                                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">{place.category} • {place.distance_km} km</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Panel>
                            <Panel title="Day 1 interactive route" subtitle="Approximate local travel between stops">
                                {routeStops.length > 0 ? (
                                    <div className="grid gap-2">
                                        {routeStops.map((stop, index) => (
                                            <div key={`${stop.name}-${index}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{index + 1}</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold text-ink">{stop.name}</p>
                                                    <p className="mt-1 text-xs capitalize">{stop.category} · {stop.mode}</p>
                                                </div>
                                                {index > 0 ? <span className="whitespace-nowrap text-xs font-semibold text-slate-500">{stop.travel_time_min} min</span> : <span className="text-xs text-slate-400">Start</span>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-600">Generate a plan to calculate approximate stop-to-stop travel times.</p>
                                )}
                            </Panel>
                            <Panel title="Budget agent" subtitle="Estimated categories">
                                <div className="grid gap-3 text-sm text-slate-700">
                                    {Object.keys(budgetBreakdown).length > 0 ? (
                                        <>
                                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                                <span className="font-semibold text-ink">Trip budget</span>
                                                <span className="font-bold text-ink">₹{displayBudget.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="grid gap-2">
                                                {Object.entries(budgetBreakdown).filter(([key]) => key !== 'remaining').map(([key, value]) => (
                                                    <p key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 capitalize">
                                                        <span>{key.replace('_', ' ')}</span>
                                                        <span className="font-semibold">₹{value.toLocaleString('en-IN')}</span>
                                                    </p>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-semibold text-emerald-700">
                                                <span>Remaining</span>
                                                <span>₹{(budgetBreakdown.remaining ?? 0).toLocaleString('en-IN')}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Generate a plan to split your INR budget across transport, hotels, food, activities, local travel, emergency funds, and remaining cash.</p>
                                    )}
                                </div>
                            </Panel>
                            <Panel title="Emergency" subtitle="Quick access">
                                <p className="text-sm text-slate-700">Surface emergency numbers, embassy notes, and safety reminders for the destination.</p>
                            </Panel>
                            <Panel title="Pre-trip checklist" subtitle={`${checklist.filter((item) => item.checked).length} of ${checklist.length} ready`}>
                                {checklist.length > 0 ? (
                                    <div className="grid gap-2">
                                        {checklist.map((item) => (
                                            <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${item.checked ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                                                <input type="checkbox" checked={item.checked} onChange={() => void toggleChecklistItem(item.id)} className="h-4 w-4 accent-emerald-600" />
                                                <span className={item.checked ? 'line-through opacity-70' : ''}>{item.label}</span>
                                                <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-slate-400">{item.category}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-600">Generate or load a trip to prepare your checklist.</p>
                                )}
                            </Panel>
                        </div>

                        <Panel title="AI travel journal" subtitle="Notes, expenses, places, and photo memories">
                            <div className="grid gap-3">
                                {journalDiary ? <p className="rounded-2xl bg-amber-50 px-3 py-3 text-sm text-amber-900">{journalDiary}</p> : <p className="text-sm text-slate-600">Add your first memory and the diary will grow with your trip.</p>}
                                <textarea value={journalNote} onChange={(event) => setJournalNote(event.target.value)} placeholder="Write a note about today..." className="min-h-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none" />
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field label="Place visited" value={journalPlace} onChange={setJournalPlace} placeholder="Amber Fort" />
                                    <Field label="Expense (INR)" type="number" value={journalExpense} onChange={setJournalExpense} placeholder="450" />
                                </div>
                                <button type="button" onClick={() => void addJournalEntry()} disabled={!tripId || !journalNote.trim()} className="w-fit rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Add to journal</button>
                                {journalEntries.length > 0 ? (
                                    <div className="grid gap-2 text-sm text-slate-700">
                                        {journalEntries.slice(-5).reverse().map((entry) => <p key={entry.id} className="rounded-2xl bg-slate-50 px-3 py-2"><span className="font-semibold capitalize">{entry.kind}</span>: {entry.text}{entry.place ? ` · ${entry.place}` : ''}{entry.amount_inr ? ` · ₹${entry.amount_inr.toLocaleString('en-IN')}` : ''}</p>)}
                                    </div>
                                ) : null}
                            </div>
                        </Panel>

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

                        <Panel title="POI highlights" subtitle="Live destinations">
                            <div className="grid gap-3 text-sm text-slate-700">
                                {(poiResults.length > 0 ? poiResults : [
                                    { name: 'Eiffel Tower viewpoint', category: 'landmark' },
                                    { name: 'Le Marais walk', category: 'neighborhood' },
                                    { name: 'Cafe and market stop', category: 'food' },
                                ]).map((place) => (
                                    <div key={place.name} className="rounded-2xl bg-slate-50 px-3 py-3">
                                        <p className="font-semibold text-ink">{place.name}</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{place.category}</p>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Discover India" subtitle="Match a destination to your trip profile">
                            <div className="space-y-3">
                                <button type="button" onClick={() => void discoverIndia()} disabled={discovering} className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                                    {discovering ? 'Finding matches...' : 'Find my next India trip'}
                                </button>
                                {destinationRecommendations.length > 0 ? (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {destinationRecommendations.map((item) => (
                                            <button key={item.name} type="button" onClick={() => { setDestination(item.name); setMapSearch(item.name); }} className="rounded-2xl bg-slate-50 px-3 py-3 text-left transition hover:bg-slate-100">
                                                <p className="font-semibold text-ink">{item.name}</p>
                                                <p className="mt-1 text-xs text-slate-500">{item.region} · {item.best_for.join(' · ')}</p>
                                                <p className="mt-1 text-xs text-slate-600">Best season: {item.season}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-600">Use your profile interests and trip length to discover an India destination.</p>
                                )}
                            </div>
                        </Panel>
                        <Panel title="Compare India trips" subtitle="Choose the better fit for the same budget and time">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <Field label="First destination" value={compareFirst} onChange={setCompareFirst} placeholder="Goa" />
                                <Field label="Second destination" value={compareSecond} onChange={setCompareSecond} placeholder="Kerala" />
                                <Field label="Budget (INR)" type="number" value={String(compareBudget)} onChange={(value) => setCompareBudget(Number(value || 0))} />
                                <Field label="Days" type="number" value={String(compareDays)} onChange={(value) => setCompareDays(Number(value || 1))} />
                            </div>
                            <button type="button" onClick={() => void compareDestinations()} disabled={comparing} className="mt-3 rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                                {comparing ? 'Comparing...' : 'Compare plans'}
                            </button>
                            {comparison.length > 0 ? (
                                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                                    <table className="min-w-[720px] w-full text-left text-sm text-slate-700">
                                        <thead className="bg-slate-950 text-white">
                                            <tr>
                                                <th className="px-3 py-3 font-semibold">Compare</th>
                                                {comparison.map((option) => <th key={option.destination} className="px-3 py-3 font-semibold">{option.destination}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                ['Estimated cost', (option: ComparisonOption) => `₹${option.estimated_cost.toLocaleString('en-IN')}`],
                                                ['Travel time', (option: ComparisonOption) => option.travel_time],
                                                ['Activities', (option: ComparisonOption) => option.activities],
                                                ['Weather', (option: ComparisonOption) => option.weather],
                                                ['Food', (option: ComparisonOption) => option.food],
                                                ['Relaxation', (option: ComparisonOption) => option.relaxation],
                                            ].map(([label, getValue]) => (
                                                <tr key={String(label)} className="border-t border-slate-200">
                                                    <th className="bg-slate-50 px-3 py-3 font-semibold text-ink">{String(label)}</th>
                                                    {comparison.map((option) => <td key={option.destination} className="px-3 py-3 align-top">{(getValue as (item: ComparisonOption) => string)(option)}</td>)}
                                                </tr>
                                            ))}
                                            <tr className="border-t border-slate-200">
                                                <th className="bg-slate-50 px-3 py-3 font-semibold text-ink">Choose</th>
                                                {comparison.map((option) => (
                                                    <td key={option.destination} className="px-3 py-3 align-top">
                                                        <button type="button" onClick={() => { setDestination(option.destination); setBudget(compareBudget); setMapSearch(option.destination); }} className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white">Explore {option.destination}</button>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-slate-600">Compare Goa and Kerala, or enter any two Indian destinations.</p>
                            )}
                        </Panel>

                        <Panel title="Group travel planner" subtitle="Balance everyone’s budget and preferences">
                            <div className="grid gap-3">
                                <textarea value={groupMembers} onChange={(event) => setGroupMembers(event.target.value)} className="min-h-24 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none" />
                                <button type="button" onClick={() => void createGroupPlan()} disabled={grouping} className="w-fit rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                                    {grouping ? 'Balancing preferences...' : 'Build group plan'}
                                </button>
                                {groupPlan ? <div className="grid gap-2 text-sm text-slate-700"><p className="rounded-2xl bg-slate-50 px-3 py-3 font-semibold text-ink">{groupPlan.consensus}</p><ul className="grid gap-2">{groupPlan.plan.map((step) => <li key={step} className="rounded-2xl bg-slate-50 px-3 py-2">{step}</li>)}</ul><p className="text-xs">{groupPlan.budget_strategy}</p></div> : <p className="text-sm text-slate-600">One traveler per line: Name: preference.</p>}
                            </div>
                        </Panel>

                        <Panel title="India travel toolkit" subtitle="Hotels, transport, food, and route context">
                            {travelRecommendations ? (
                                <div className="grid gap-4 text-sm text-slate-700">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hotels</p>
                                            <div className="mt-2 grid gap-2">
                                                {travelRecommendations.hotels.map((hotel) => (
                                                    <div key={hotel.name} className="rounded-2xl bg-slate-50 px-3 py-3">
                                                        <p className="font-semibold text-ink">{hotel.name}</p>
                                                        <p className="mt-1 text-xs">{hotel.area} · {hotel.rating}★ · ₹{hotel.nightly_inr.toLocaleString('en-IN')}/night</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Transport</p>
                                            <div className="mt-2 grid gap-2">
                                                {travelRecommendations.transport.map((option) => (
                                                    <div key={option.mode} className="rounded-2xl bg-slate-50 px-3 py-3">
                                                        <p className="font-semibold text-ink">{option.mode}</p>
                                                        <p className="mt-1 text-xs">{option.note} · ₹{option.estimated_inr.toLocaleString('en-IN')} est.</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Restaurants</p>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            {travelRecommendations.restaurants.map((restaurant) => (
                                                <div key={restaurant.name} className="rounded-2xl bg-slate-50 px-3 py-3">
                                                    <p className="font-semibold text-ink">{restaurant.name}</p>
                                                    <p className="mt-1 text-xs">{restaurant.cuisine} · {restaurant.price_band} · {restaurant.area}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="rounded-2xl bg-amber-50 px-3 py-3 text-xs text-amber-900">Route tip: {travelRecommendations.route_tip}</p>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Smart notifications</p>
                                        <div className="mt-2 grid gap-2">
                                            {travelRecommendations.notifications.map((notification) => (
                                                <p key={notification.type} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs">{notification.message}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600">Recommendations will appear after the India travel data loads.</p>
                            )}
                        </Panel>

                        <Panel title="Real-time research" subtitle={researchReport ? `Updated ${researchReport.updated_at}` : 'Checking live travel sources'}>
                            {researchReport ? (
                                <div className="grid gap-4 text-sm text-slate-700">
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {Object.entries(researchReport.providers).map(([key, provider]) => (
                                            <div key={key} className="rounded-2xl bg-slate-50 px-3 py-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button type="button" onClick={() => void addJournalEntry()} disabled={!tripId || !journalNote.trim()} className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Add to journal</button>
                                                        <button type="button" onClick={() => void addCategorizedExpense()} disabled={!tripId || !journalNote.trim() || !journalExpense} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Categorize expense</button>
                                                    </div>
                                                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${provider.available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {provider.available ? 'Live' : 'Needs key'}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs">{provider.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live places and hours</p>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            {researchReport.attractions_and_restaurants.slice(0, 6).map((place) => (
                                                <div key={`${place.name}-${place.category}`} className="rounded-2xl bg-white px-3 py-3 ring-1 ring-slate-200">
                                                    <p className="font-semibold text-ink">{place.name}</p>
                                                    <p className="mt-1 text-xs capitalize">{place.category} · {place.opening_hours ?? 'Hours not mapped'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">Sources: {researchReport.source_notes.join(', ')}</p>
                                    <p className="text-xs text-slate-500">{researchReport.limitations[0]}</p>
                                    <button type="button" onClick={() => void replanForWeather()} disabled={!tripId} className="w-fit rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                                        Replan around live weather
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600">Live weather, places, opening hours, and provider status are loading.</p>
                            )}
                        </Panel>

                        <Panel title="Personal travel profile" subtitle="Preferences the assistant remembers">
                            <div className="grid gap-3 text-sm text-slate-700">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field label="Budget range" value={profile.budget_range} onChange={(value) => setProfile((current) => ({ ...current, budget_range: value }))} placeholder="mid-range" />
                                    <Field label="Travel style" value={profile.travel_style} onChange={(value) => setProfile((current) => ({ ...current, travel_style: value }))} placeholder="balanced" />
                                </div>
                                <Field label="Interests" value={profile.interests.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, interests: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="food, heritage, nature" />
                                <Field label="Food preferences" value={profile.food_preferences.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, food_preferences: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="vegetarian-friendly, spicy" />
                                <Field label="Preferred transport" value={profile.preferred_transport.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, preferred_transport: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="train, metro, walking" />
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs text-slate-500">Sign in to persist this profile across trips.</p>
                                    <button type="button" onClick={() => void saveProfile()} className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white">Save profile</button>
                                </div>
                                {profileStatus ? <p className="text-xs text-slate-500">{profileStatus}</p> : null}
                            </div>
                        </Panel>

                        <Panel title="AI Assistant Chat" subtitle="Voice + text assistant">
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
                                        aria-label={voiceActive ? 'Turn off voice input' : 'Turn on voice input'}
                                        onClick={toggleVoiceInput}
                                        className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${voiceActive ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                    >
                                        {voiceActive ? 'Mic on' : 'Mic'}
                                    </button>
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

                        <Panel title="Travel files" subtitle="Upload itinerary docs">
                            <div className="space-y-3">
                                <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">
                                    <input type="file" className="hidden" onChange={(event) => void uploadFile(event)} />
                                    {uploading ? 'Uploading...' : 'Choose a file to upload'}
                                </label>
                                {uploadError ? <p className="text-sm text-rose-600">{uploadError}</p> : null}
                                <div className="space-y-2">
                                    {uploadFiles.length > 0 ? (
                                        uploadFiles.map((file) => (
                                            <div key={`${file.file_name}-${file.file_path}`} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                                <p className="font-semibold text-ink">{file.file_name}</p>
                                                <p>{file.content_type} • {file.size} bytes</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-600">No files uploaded yet.</p>
                                    )}
                                </div>
                            </div>
                        </Panel>

                        <Panel title="Visual travel agent" subtitle="Compare hotel screenshots or identify monuments">
                            <div className="grid gap-3">
                                <input type="file" accept="image/*" multiple onChange={(event) => setVisionFiles(Array.from(event.target.files ?? []))} className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700" />
                                <textarea value={visionPrompt} onChange={(event) => setVisionPrompt(event.target.value)} className="min-h-20 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none" />
                                <button type="button" onClick={() => void analyzeVision()} disabled={visionLoading || visionFiles.length === 0} className="w-fit rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{visionLoading ? 'Analyzing images...' : 'Analyze images'}</button>
                                {visionResult ? <p className="rounded-2xl bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">{visionResult}</p> : <p className="text-xs text-slate-500">Configure a vision-capable OpenAI or OpenRouter model for live analysis.</p>}
                            </div>
                        </Panel>

                        <Panel title="Voice assistant" subtitle="Hands-free notes">
                            <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-rose-50 via-white to-sky-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Travel mode</p>
                                        <p className="mt-1 text-base font-bold text-ink">{voiceActive ? 'Listening for quick notes' : 'Ready for voice capture'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleVoiceInput}
                                        className={`rounded-full px-3 py-2 text-sm font-semibold ${voiceActive ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'}`}
                                    >
                                        {voiceActive ? 'Stop' : 'Start'}
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-slate-700">
                                    {voiceActive
                                        ? 'The assistant is ready to capture quick spoken reminders such as “find a quiet cafe nearby” or “add one museum stop.”'
                                        : 'Use browser speech recognition to capture a request and send it straight to the travel assistant.'}
                                </p>
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
                                            <p className="mt-2 text-xs text-slate-500">₹{trip.budget.toLocaleString('en-IN')} • {trip.style} • updated {new Date(trip.updated_at).toLocaleString()}</p>
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
