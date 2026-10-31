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
    resolved_location?: { name: string; country?: string; latitude: number; longitude: number } | null;
    timezone?: string | null;
    observed_at?: string;
    status?: string;
    forecast: Array<{
        date?: string | null;
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
    status?: string;
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
    status?: string;
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
    generated_at?: string;
    status?: string;
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

const featuredDestinations = ['Jaipur', 'Delhi', 'Mumbai', 'Goa', 'Kerala', 'Kochi', 'Varanasi', 'Udaipur', 'Himachal Pradesh', 'Mysuru'];

const travelMoods = [
    { label: 'Relaxed', icon: '🌊', color: 'sea' },
    { label: 'Adventurous', icon: '🏔️', color: 'mint' },
    { label: 'Romantic', icon: '❤️', color: 'rose' },
    { label: 'Backpacker', icon: '🎒', color: 'gold' },
    { label: 'Foodie', icon: '🍜', color: 'peach' },
    { label: 'Culture', icon: '🏛️', color: 'lavender' },
    { label: 'Luxury', icon: '✨', color: 'sand' },
    { label: 'Nature', icon: '🌿', color: 'mint' },
    { label: 'Party', icon: '🎉', color: 'rose' },
];

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

type ActiveTab = 'planner' | 'intel' | 'chat' | 'discover' | 'journal' | 'trips';

const AGENT_TABS: Array<{ id: ActiveTab; label: string; icon: string; tag: string }> = [
    { id: 'planner', label: 'Trip Studio', icon: '✨', tag: 'Core Itinerary' },
    { id: 'intel', label: 'Live Intel & Map', icon: '🗺️', tag: 'Realtime Radar' },
    { id: 'chat', label: 'AI Concierge', icon: '🤖', tag: 'Assistant & Vision' },
    { id: 'discover', label: 'Discover & Compare', icon: '🧭', tag: 'Matrix & Toolkit' },
    { id: 'journal', label: 'Journal & Budget', icon: '📓', tag: 'Finances & Diary' },
    { id: 'trips', label: 'Saved Trips & Profile', icon: '🗂️', tag: 'Vault & Revisions' },
];

export default function App() {
    useReveal();

    const [activeTab, setActiveTab] = useState<ActiveTab>('planner');

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
    const [ecoTips, setEcoTips] = useState<{ destination: string; mode: string; priorities: string[]; hotel_preference: string } | null>(null);
    const [travelMood, setTravelMood] = useState('Foodie');
    const [tripPrompt, setTripPrompt] = useState('I have ₹30,000, 5 days, and want food, nature, and a little adventure.');
    const [buildRequested, setBuildRequested] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tripSummary, setTripSummary] = useState('Press Generate plan to create the first itinerary draft. The assistant will explain why each stop was selected and how the budget is distributed.');
    const [budgetBreakdown, setBudgetBreakdown] = useState<Record<string, number>>({});
    const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
    const [poiResults, setPoiResults] = useState<Array<{ name: string; category: string }>>([]);
    const [mapPlaces, setMapPlaces] = useState<Array<{ name: string; category: string; distance_km: number }>>([]);
    const [mapStatus, setMapStatus] = useState('');
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
    const [uploadStatus, setUploadStatus] = useState('');
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
    const [playingDayAudio, setPlayingDayAudio] = useState<number | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [fxAmount, setFxAmount] = useState('100');
    const [fxCurrency, setFxCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AUD'>('USD');
    const [newChecklistLabel, setNewChecklistLabel] = useState('');
    const [newChecklistCategory, setNewChecklistCategory] = useState('Packing');
    const [istTime, setIstTime] = useState(() => {
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return '12:00 PM';
        }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            try {
                setIstTime(new Date().toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }));
            } catch {}
        }, 30000);
        return () => clearInterval(timer);
    }, []);

    const FX_RATES: Record<string, number> = { USD: 86.8, EUR: 92.5, GBP: 110.2, AUD: 56.2 };
    const convertedInr = Math.round(Number(fxAmount || 0) * (FX_RATES[fxCurrency] ?? 86.8));

    const QUICK_CHAT_PROMPTS = [
        'Find 3 top dinner spots for Day 1',
        'What should I pack for this weather?',
        'Any eco-friendly transit tips?',
        'Recommend a quiet sunset viewpoint',
    ];

    function speakText(text: string, dayNum?: number) {
        if (!('speechSynthesis' in window)) {
            alert('Speech audio is not supported in this browser.');
            return;
        }
        if (playingDayAudio !== null) {
            window.speechSynthesis.cancel();
            if (playingDayAudio === (dayNum ?? 0)) {
                setPlayingDayAudio(null);
                return;
            }
        }
        const cleanText = text.replace(/[*#_~`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setPlayingDayAudio(null);
        utterance.onerror = () => setPlayingDayAudio(null);
        setPlayingDayAudio(dayNum ?? 0);
        window.speechSynthesis.speak(utterance);
    }

    function swapDayActivity(dayNumber: number, mode: 'chill' | 'rainy') {
        setGeneratedItinerary((prev) => {
            const base = prev.length > 0 ? prev : fallbackItinerary;
            return base.map((d) => {
                if (d.day !== dayNumber) return d;
                if (mode === 'chill') {
                    return {
                        ...d,
                        title: `${displayKey} - Day ${d.day} (Relaxed Pacing)`,
                        morning: 'Leisurely brunch at a garden cafe, followed by a quiet heritage walk and local artisan galleries',
                        afternoon: 'Low-key exploration of botanical gardens or traditional tea tasting with plenty of rest time',
                        evening: 'Sunset rooftop dining near hotel with a calm, unhurried atmosphere',
                    };
                } else {
                    return {
                        ...d,
                        title: `${displayKey} - Day ${d.day} (Rainy Day Contingency)`,
                        morning: 'Indoor palace museum and royal textile galleries (covered architectural pavilions)',
                        afternoon: 'Covered historic bazaar walk, traditional sweet shop tasting, and handicraft emporium',
                        evening: 'Indoor classical cultural performance and heritage courtyard dining',
                    };
                }
            });
        });
    }

    function addCustomChecklistItem() {
        if (!newChecklistLabel.trim()) return;
        const newItem: ChecklistItem = {
            id: `custom_${Date.now()}`,
            label: newChecklistLabel.trim(),
            category: newChecklistCategory,
            checked: false,
        };
        setChecklist((prev) => [...prev, newItem]);
        setNewChecklistLabel('');
    }

    function getShareableText() {
        return [
            `✈️ AI TRAVEL GUIDE: ${displayKey.toUpperCase()} (${itinerary.length} DAYS)`,
            `📅 Dates: ${startDate} to ${endDate} | Style: ${displayStyle} | Vibe: ${travelMood}`,
            `💰 Total Estimated Budget: ₹${totalCost.toLocaleString('en-IN')} (≈ ₹${dailyCost.toLocaleString('en-IN')}/day)`,
            `\n--- DAY-BY-DAY ITINERARY ---`,
            ...itinerary.map(
                (d) =>
                    `\n📍 Day ${d.day}: ${d.title} [₹${d.cost.toLocaleString('en-IN')}]\n` +
                    `   • 09:00 Morning: ${d.morning}\n` +
                    `   • 13:00 Afternoon: ${d.afternoon}\n` +
                    `   • 18:30 Evening: ${d.evening}`
            ),
            `\n--- ESSENTIAL TRAVEL CONTACTS (INDIA) ---`,
            `🚨 All-in-One Emergency: 112`,
            `🧳 Incredible India Tourist Helpline: 1363 (24x7)`,
            `🚑 Medical Ambulance: 108 | 👮 Police: 100`,
            `\nGenerated by AI Travel Agent Studio`,
        ].join('\n');
    }

    function copyTripPlan() {
        void navigator.clipboard.writeText(getShareableText());
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2200);
    }

    function downloadOfflineGuide() {
        const text = getShareableText();
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${displayKey.replace(/\s+/g, '_')}_Travel_Guide.md`;
        a.click();
        URL.revokeObjectURL(url);
    }
    const recognitionRef = useRef<{ stop: () => void } | null>(null);

    const { token } = useAuth();
    const authH = useMemo<Record<string, string>>(() => (token ? { Authorization: 'Bearer ' + token } : ({} as Record<string, string>)), [token]);

    const fallbackItinerary = useMemo(() => buildItinerary(destination, budget, startDate, endDate), [destination, budget, startDate, endDate]);
    const itinerary = generatedItinerary.length > 0 ? generatedItinerary : fallbackItinerary;
    const totalCost = itinerary.reduce((sum, day) => sum + day.cost, 0);
    const forecast = weather?.forecast ?? [
        { day: 'Today', condition: 'Partly cloudy', high_c: 24, low_c: 17 },
        { day: 'Tomorrow', condition: 'Light rain', high_c: 22, low_c: 16 },
    ];
    const dailyCost = Math.round(totalCost / Math.max(itinerary.length, 1));
    const placesToday = Math.min(6, Math.max(3, itinerary.length + 2));
    const activeHeroImage = scenicImageForDay(destination, 0);

    function buildTripFromPrompt() {
        const amount = tripPrompt.match(/₹\s*([\d,]+)/i)?.[1]?.replace(/,/g, '');
        const days = tripPrompt.match(/(\d+)\s*days?/i)?.[1];
        const knownDestination = ['Goa', 'Kerala', 'Jaipur', 'Mumbai', 'Delhi', 'Udaipur', 'Mysuru', 'Rishikesh', 'Darjeeling'].find((item) => tripPrompt.toLowerCase().includes(item.toLowerCase()));
        if (amount) {
            setBudget(Number(amount));
        }
        if (days) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + Number(days) - 1);
            setEndDate(end.toISOString().slice(0, 10));
        }
        if (knownDestination) {
            setDestination(knownDestination);
            setMapSearch(knownDestination);
            void refreshMapForDestination(knownDestination);
            void refreshRoute(knownDestination);
        }
        setInterests(`${travelMood}, ${tripPrompt}`);
        setBuildRequested(true);
    }

    useEffect(() => {
        if (token) {
            void refreshSavedTrips();
            void refreshProfile();
        } else {
            setSavedTrips([]);
        }
        void refreshTravelRecommendations(destination, budget);
        void refreshResearch(destination, startDate, endDate);
        void refreshMapForDestination(destination);
        void refreshRoute(destination);
    }, [token]);

    useEffect(() => {
        if (buildRequested) {
            setBuildRequested(false);
            void generatePlan();
        }
    }, [buildRequested]);

    useEffect(() => {
        if (ecoMode) {
            void refreshEcoRecommendations(destination);
        }
    }, [ecoMode, destination]);

    const displayKey = (destination || displayDestination).split(',')[0].trim();
    const destinationImage = DESTINATION_IMAGES[displayKey] ?? DESTINATION_IMAGES['Jaipur'];

    async function generatePlan() {
        if (loading) return;
        if (!token) {
            const draft = buildItinerary(destination, budget, startDate, endDate);
            setGeneratedItinerary(draft);
            setSubmitted(true);
            setDisplayDestination(destination);
            setDisplayStyle(style);
            setDisplayBudget(budget);
            setTripSummary(`A ${style} preview draft for ${destination}. Sign in or create an account to save this trip to your profile.`);
            setError('Sign in or create an account to save trips, track expenses, and use AI features.');
            return;
        }
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
                        setMapStatus(nearbyData.status === 'no_results' ? 'No nearby mapped places found for this location.' : 'Map pins matched to the selected location.');
                    }
                    await refreshMapForDestination(tripData.destination);
                    await refreshRoute(tripData.destination);
                } else {
                    setMapPlaces([]);
                    setMapStatus('No mapped coordinates were returned for this search.');
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
        setMapPlaces([]);
        setMapStatus('Searching map data...');
        try {
            const response = await fetch(`${apiBaseUrl}/places/search?q=${encodeURIComponent(dest)}`);
            if (!response.ok) {
                setMapStatus('Map search failed. Try the destination name again.');
                return;
            }
            const data = (await response.json()) as PlaceApiResponse;
            const firstMatch = data.results?.[0];
            if (!firstMatch || typeof firstMatch.lat !== 'number' || typeof firstMatch.lng !== 'number') {
                setMapStatus('No mapped result with usable coordinates was found.');
                return;
            }
            const minLng = firstMatch.lng - 0.04;
            const maxLng = firstMatch.lng + 0.04;
            const minLat = firstMatch.lat - 0.03;
            const maxLat = firstMatch.lat + 0.03;
            setMapEmbedUrl(
                `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${firstMatch.lat}%2C${firstMatch.lng}`,
            );
            setMapStatus(data.status === 'estimated_without_coordinates' ? 'Showing estimated place names without map pins.' : 'Map centered on the selected result.');
        } catch {
            setMapPlaces([]);
            setMapStatus('Map services are unavailable right now.');
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
            setMapPlaces([]);
            setMapStatus('Enter a destination or place to search.');
            return;
        }
        await refreshMapForDestination(trimmed);
        setDestination(trimmed);
    }

    async function refreshSavedTrips(preferredTripId?: string) {
        if (!token) {
            setSavedTrips([]);
            return;
        }
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

    async function deleteTrip(tripIdToDelete: string, e?: React.MouseEvent) {
        if (e) e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this trip?')) {
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/trips/${tripIdToDelete}`, {
                method: 'DELETE',
                headers: { ...authH },
            });
            if (response.ok) {
                if (tripId === tripIdToDelete) {
                    setTripId('');
                }
                await refreshSavedTrips();
            } else {
                setError('Unable to delete trip');
            }
        } catch {
            setError('Network error while deleting trip');
        }
    }

    async function refreshEcoRecommendations(dest: string) {
        try {
            const response = await fetch(`${apiBaseUrl}/travel/eco?destination=${encodeURIComponent(dest)}`);
            if (response.ok) {
                setEcoTips((await response.json()) as { destination: string; mode: string; priorities: string[]; hotel_preference: string });
            }
        } catch {
            // non-blocking
        }
    }

    async function refreshProfile() {
        if (!token) {
            return;
        }
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
        if (!token) return;
        const response = await fetch(`${apiBaseUrl}/trips/${activeTripId}/checklist`, { headers: { ...authH } });
        if (response.ok) {
            setChecklist((await response.json()) as ChecklistItem[]);
        }
    }

    async function refreshJournal(activeTripId: string) {
        if (!token) return;
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

    async function refreshWeatherAndFaq(dest: string) {
        const [weatherResponse, faqResponse, placesResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/weather?city=${encodeURIComponent(dest)}`),
            fetch(`${apiBaseUrl}/faq/search?q=${encodeURIComponent(dest)}`),
            fetch(`${apiBaseUrl}/places/search?q=${encodeURIComponent(dest)}`),
        ]);
        if (weatherResponse.ok) setWeather((await weatherResponse.json()) as WeatherApiResponse);
        if (faqResponse.ok) setFaqResults(((await faqResponse.json()) as FaqApiResponse).results);
        if (placesResponse.ok) setPoiResults((((await placesResponse.json()) as PlaceApiResponse).results ?? []).slice(0, 6).map((place) => ({ name: place.name, category: place.category })));
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
                setComparison(data.options || []);
            } else {
                setError('Comparison failed. Check destinations and budget.');
            }
        } catch {
            setError('Network error while comparing destinations');
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
            if (travelers.length === 0) {
                setError('Add at least one traveler with name and preference (e.g. Rahul: culture).');
                return;
            }
            const response = await fetch(`${apiBaseUrl}/destinations/group-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination, budget, duration_days: itinerary.length, travelers }),
            });
            if (response.ok) {
                setGroupPlan((await response.json()) as GroupPlan);
            } else {
                setError('Unable to create group plan.');
            }
        } catch {
            setError('Network error while creating group plan');
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
        if (!token) return;
        const response = await fetch(`${apiBaseUrl}/trips/${activeTripId}/revisions`, { headers: { ...authH } });
        if (!response.ok) {
            setRevisionHistory([]);
            return;
        }
        setRevisionHistory((await response.json()) as RevisionApiResponse[]);
    }

    async function loadTrip(tripIdToLoad: string) {
        if (loading) return;
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
            setChecklist([]);
            setJournalEntries([]);
            setJournalDiary('');
            setResearchReport(null);
            setWeather(null);
            setFaqResults([]);
            setTravelRecommendations(null);
            setPoiResults([]);
            setMapPlaces([]);
            setRouteStops([]);
            setMapStatus('Loading selected trip location...');
            await Promise.all([
                refreshChecklist(tripData.trip_id),
                refreshJournal(tripData.trip_id),
                refreshResearch(tripData.destination, tripData.start_date, tripData.end_date),
                refreshWeatherAndFaq(tripData.destination),
                refreshTravelRecommendations(tripData.destination, tripData.budget),
                refreshMapForDestination(tripData.destination),
                refreshRoute(tripData.destination),
            ]);
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
        setUploadStatus('Uploading...');
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
            setUploadStatus(`${uploaded.file_name} uploaded successfully.`);
            if (tripId) {
                await refreshJournal(tripId);
            }
        } catch (uploadError) {
            setUploadError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
            setUploadStatus('');
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
                <header className="site-header travel-hero cinematic-hero mb-6 flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/70 p-5 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.8), rgba(15,23,42,.25)), url(${activeHeroImage})` }}>
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.42em] text-coral">{displayKey} · {travelMood} mode</p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl hero-title md:text-6xl">Where do you want to escape to?</h1>
                        <p className="mt-3 max-w-xl text-sm text-slate-100/90 sm:text-base">A concierge-style travel agent that builds itineraries, tracks your budget, and keeps weather and route context in view.</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                className="btn-cta rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
                                onClick={() => void generatePlan()}
                            >
                                ✨ Build My Trip
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

                {/* Agent Telemetry & Live Travel Status Strip */}
                <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-md">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        {/* Active Multi-Agent Mesh */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 font-bold text-emerald-800">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                AI Agent Mesh Active
                            </span>
                            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700 font-medium">
                                🧭 Route Strategist
                            </span>
                            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700 font-medium">
                                🌦️ Weather Sentinel
                            </span>
                            <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700 font-medium">
                                💰 Budget Auditor
                            </span>
                            <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700 font-medium">
                                🛡️ Safety Guardian
                            </span>
                        </div>

                        {/* Live Destination Telemetry & Actions */}
                        <div className="flex items-center gap-2.5 ml-auto">
                            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 font-semibold text-slate-700">
                                <span>🕒</span>
                                <span>{istTime} IST</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCurrencyModal(true)}
                                className="flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                title="Open Currency Converter"
                            >
                                <span>💱</span>
                                <span>FX: $1 ≈ ₹86.8</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1 font-bold text-white shadow-sm transition hover:bg-slate-800"
                                title="Export or Share Offline Guide"
                            >
                                <span>📥</span>
                                <span>Offline Guide</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Badge label="Maps" value="Live-ready" />
                    <Badge label="Weather" value="Contextual" />
                    <Badge label="Budget" value="Tracked" />
                    <Badge label="Trips" value="Saved" />
                </div>

                {/* Agent Mode Switcher HUD */}
                <div className="sticky top-3 z-30 mb-6 rounded-[26px] border border-white/80 bg-white/85 p-2 shadow-lg shadow-slate-900/5 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none px-1 py-1">
                        <div className="flex items-center gap-1.5 min-w-max" role="tablist" aria-label="AI Agent Modes">
                            {AGENT_TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group relative flex items-center gap-2.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-slate-950 text-white shadow-md shadow-slate-950/20'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className="text-base">{tab.icon}</span>
                                        <div className="text-left">
                                            <span className="block leading-tight">{tab.label}</span>
                                            <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                                                {tab.tag}
                                            </span>
                                        </div>
                                        {tab.id === 'planner' && itinerary.length > 0 && (
                                            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                {itinerary.length}d
                                            </span>
                                        )}
                                        {tab.id === 'trips' && savedTrips.length > 0 && (
                                            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                                                {savedTrips.length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200 pr-2 min-w-max">
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Region</p>
                                <p className="text-xs font-extrabold text-ink">{displayKey}</p>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget</p>
                                <p className="text-xs font-extrabold text-emerald-600">₹{displayBudget.toLocaleString('en-IN')}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => void generatePlan()}
                                disabled={loading}
                                className="ml-1 flex items-center gap-1.5 rounded-xl bg-[#ef775b] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Thinking...' : '⚡ Quick Plan'}
                            </button>
                        </div>
                    </div>
                </div>

                <main className="min-h-[600px] mb-8">
                    {/* TAB 1: TRIP STUDIO */}
                    {activeTab === 'planner' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: Planner Form + Agent Intelligence */}
                            <div className="grid gap-6">
                                <section className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-glow backdrop-blur">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Agent Itinerary Engine</p>
                                            <h2 className="mt-1 text-2xl font-bold text-ink">Trip Planner Studio</h2>
                                            <p className="mt-1 text-sm text-slate-600">Collect the essentials and let the agent assemble the first draft.</p>
                                        </div>
                                        <button
                                            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 shadow-sm"
                                            onClick={() => void generatePlan()}
                                            type="button"
                                            aria-label="Generate trip plan"
                                            disabled={loading}
                                        >
                                            {loading ? 'Generating...' : '✨ Generate plan'}
                                        </button>
                                    </div>

                                    <div className="action-row mt-4 flex flex-wrap gap-2.5">
                                        <button
                                            className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
                                            onClick={() => void refreshSavedTrips(tripId || undefined)}
                                            type="button"
                                            aria-label="Refresh saved trips"
                                        >
                                            🔄 Refresh saved trips
                                        </button>
                                        <button
                                            className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => void replanTrip()}
                                            type="button"
                                            aria-label="Replan current trip"
                                            disabled={!tripId || loading}
                                        >
                                            ⚡ Replan current trip
                                        </button>
                                    </div>

                                    <div className="mt-5 rounded-[24px] bg-[#fff4e9] border border-[#f3d4c3]/70 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef775b]">AI Prompt Builder</p>
                                                <p className="mt-1 text-sm font-semibold text-ink">Describe the trip in your own words.</p>
                                            </div>
                                            <button type="button" onClick={buildTripFromPrompt} className="rounded-full bg-[#ef775b] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-95">
                                                ✨ Build My Trip
                                            </button>
                                        </div>
                                        <textarea
                                            value={tripPrompt}
                                            onChange={(event) => setTripPrompt(event.target.value)}
                                            className="mt-3 min-h-20 w-full rounded-2xl border border-[#f3d4c3] bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#ef775b]/30"
                                            placeholder="I have ₹25,000, 4 days, travelling with friends..."
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ef775b]">Travel vibe</p>
                                                <p className="mt-1 text-sm text-slate-600">Choose a feeling and let the itinerary follow it.</p>
                                            </div>
                                            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">{travelMood}</span>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                            {travelMoods.map((mood) => (
                                                <button
                                                    type="button"
                                                    key={mood.label}
                                                    onClick={() => { setTravelMood(mood.label); setStyle(mood.label); }}
                                                    className={`mood-chip ${mood.label === travelMood ? 'mood-chip-active' : ''}`}
                                                >
                                                    <span>{mood.icon}</span>{mood.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <Field label="India destination" value={destination} onChange={setDestination} placeholder="Jaipur" list="destinations" />
                                        <Field label="Travel style" value={style} onChange={setStyle} placeholder="Balanced" />
                                        <Field label="Start date" type="date" value={startDate} onChange={setStartDate} />
                                        <Field label="End date" type="date" value={endDate} onChange={setEndDate} />
                                        <Field label="Budget (INR)" type="number" value={String(budget)} onChange={(value) => setBudget(Number(value || 0))} />
                                        <Field label="Interests" value={interests} onChange={setInterests} placeholder="Food, museums, beaches" />
                                    </div>

                                    <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 transition hover:bg-emerald-50">
                                        <input type="checkbox" checked={ecoMode} onChange={(event) => setEcoMode(event.target.checked)} className="h-4 w-4 accent-emerald-600 rounded" />
                                        <span><strong>Eco-friendly trip</strong><br /><span className="text-xs">Prioritize trains, public transport, walking, local businesses, and lower-carbon stays.</span></span>
                                    </label>
                                    {ecoMode && ecoTips && (
                                        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950">
                                            <p className="font-bold uppercase tracking-wider text-emerald-800">Eco Priorities for {ecoTips.destination}</p>
                                            <ul className="mt-2 list-disc pl-4 space-y-1">
                                                {ecoTips.priorities.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                            <p className="mt-2 font-medium text-emerald-800">🌿 Stays: {ecoTips.hotel_preference}</p>
                                        </div>
                                    )}

                                    <datalist id="destinations">
                                        {featuredDestinations.map((item) => (
                                            <option key={item} value={item} />
                                        ))}
                                    </datalist>

                                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                        <InfoCard title="Budget snapshot" value={`₹${displayBudget.toLocaleString('en-IN')}`} description="Suggested total budget" accent="bg-sand" />
                                        <InfoCard title="Trip length" value={`${itinerary.length} days`} description="AI adjusts plan around dates" accent="bg-skywash" />
                                        <InfoCard title="Style" value={displayStyle} description="Balances pace & activities" accent="bg-rose-100" />
                                    </div>

                                    <div className="mt-6 rounded-[28px] bg-slate-950 p-5 text-white shadow-xl">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">Agent response</p>
                                                <h3 className="mt-1 text-lg font-bold">Your assistant suggests a smart, paced itinerary</h3>
                                            </div>
                                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 w-fit">
                                                {tripId ? '● API-backed draft' : '○ Mock AI draft'}
                                            </span>
                                        </div>
                                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                                            {submitted ? tripSummary : 'Press Generate plan to create the first itinerary draft. The assistant will explain why each stop was selected and how the budget is distributed.'}
                                        </p>
                                        {error ? <p className="mt-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: AI Trip Pulse + Day-by-Day Itinerary + Checklist */}
                            <div className="grid gap-6">
                                <div className="trip-pulse rounded-[28px] p-5 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/65">AI Trip Pulse</p>
                                            <h2 className="mt-1 text-xl font-black">{displayKey} today</h2>
                                        </div>
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{travelMood}</span>
                                    </div>
                                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <PulseStat icon="☀️" value={`${forecast[0]?.high_c ?? 28}°C`} label="Weather" />
                                        <PulseStat icon="🚶" value="Moderate" label="Walking" />
                                        <PulseStat icon="💰" value={`₹${dailyCost.toLocaleString('en-IN')}`} label="Per day" />
                                        <PulseStat icon="📍" value={`${placesToday} places`} label="Today" />
                                    </div>
                                    <p className="mt-4 rounded-2xl bg-white/10 px-3.5 py-2.5 text-xs text-white/85">
                                        ⏱️ 2.5 hrs free · Keep one flexible window for a cafe, shopping, or a spontaneous local stop.
                                    </p>
                                </div>

                                <div className="rounded-[32px] border border-slate-200/70 bg-white/85 p-6 shadow-glow backdrop-blur">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Curated Flow</p>
                                            <h2 className="mt-1 text-2xl font-bold text-ink">Day-by-day itinerary</h2>
                                            <p className="mt-1 text-xs text-slate-600">Each day stays within the budget envelope and keeps activities nearby.</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-800 whitespace-nowrap">
                                            ₹{totalCost.toLocaleString('en-IN')} total
                                        </span>
                                    </div>
                                    <div className="mt-5 grid gap-4" role="list" aria-label="Day-by-day itinerary">
                                        {itinerary.map((day, idx) => (
                                            <article
                                                key={day.day}
                                                role="listitem"
                                                className="itinerary-card rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm transition hover:shadow-md"
                                                style={{ ['--i' as any]: idx }}
                                            >
                                                <div className="flex items-start gap-3.5">
                                                    <img
                                                        src={scenicImageForDay(destination, idx)}
                                                        alt={`${displayKey} scenic view for day ${day.day}`}
                                                        className="h-20 w-24 rounded-2xl object-cover flex-shrink-0 shadow-sm"
                                                        onError={(event) => {
                                                            event.currentTarget.onerror = null;
                                                            event.currentTarget.src = DAY_FALLBACK_IMAGES[idx % DAY_FALLBACK_IMAGES.length];
                                                        }}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Day {day.day}</p>
                                                            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">₹{day.cost.toLocaleString('en-IN')}</span>
                                                        </div>
                                                        <h3 className="mt-1 text-base font-bold text-ink truncate">{day.title}</h3>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                                            <button
                                                                type="button"
                                                                onClick={() => speakText(`Day ${day.day}. Morning: ${day.morning}. Afternoon: ${day.afternoon}. Evening: ${day.evening}.`, day.day)}
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold transition ${
                                                                    playingDayAudio === day.day
                                                                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                                                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                                }`}
                                                            >
                                                                <span>{playingDayAudio === day.day ? '⏹️ Stop Audio' : '🎧 Audio Guide'}</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => swapDayActivity(day.day, 'chill')}
                                                                className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600 transition hover:bg-slate-200"
                                                                title="Switch to a relaxed garden/cafe pace"
                                                            >
                                                                🌿 Relaxed Pace
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => swapDayActivity(day.day, 'rainy')}
                                                                className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600 transition hover:bg-slate-200"
                                                                title="Switch to indoor museums and covered bazaars"
                                                            >
                                                                🌧️ Rainy Backup
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 rounded-xl bg-slate-50/80 border border-slate-200/60 px-3 py-1.5 text-[11px] text-slate-600 flex items-center gap-1.5">
                                                    <span className="text-amber-500 font-bold">💡 Agent Tip:</span>
                                                    <span>Optimal start time 09:00 AM avoids midday transit peaks · Budget allocation: ₹{day.cost.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-slate-100 timeline-list text-sm text-slate-700">
                                                    <TimelineItem time="09:00" icon="✈️" label="Arrival / morning" text={day.morning} />
                                                    <TimelineItem time="13:00" icon="🍜" label="Lunch / afternoon" text={day.afternoon} />
                                                    <TimelineItem time="18:30" icon="🌅" label="Sunset / evening" text={day.evening} last />
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </div>

                                <Panel title="Pre-trip checklist" subtitle={`${checklist.filter((item) => item.checked).length} of ${checklist.length} ready`} icon="📋">
                                    {/* Add custom checklist item */}
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        <input
                                            value={newChecklistLabel}
                                            onChange={(e) => setNewChecklistLabel(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomChecklistItem(); } }}
                                            placeholder="Add custom item, e.g. Camera battery, Sunscreen..."
                                            className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-400"
                                        />
                                        <select
                                            value={newChecklistCategory}
                                            onChange={(e) => setNewChecklistCategory(e.target.value)}
                                            className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none"
                                        >
                                            <option value="Packing">Packing</option>
                                            <option value="Documents">Documents</option>
                                            <option value="Safety">Safety</option>
                                            <option value="Electronics">Electronics</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={addCustomChecklistItem}
                                            disabled={!newChecklistLabel.trim()}
                                            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    {checklist.length > 0 ? (
                                        <div className="grid gap-2">
                                            {checklist.map((item) => (
                                                <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm transition ${item.checked ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800' : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100'}`}>
                                                    <input type="checkbox" checked={item.checked} onChange={() => void toggleChecklistItem(item.id)} className="h-4 w-4 accent-emerald-600 rounded" />
                                                    <span className={item.checked ? 'line-through opacity-70 flex-1' : 'flex-1'}>{item.label}</span>
                                                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{item.category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600">Generate or load a trip to prepare your personalized packing & travel checklist.</p>
                                    )}
                                </Panel>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: LIVE INTEL & MAP */}
                    {activeTab === 'intel' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: Map + Day 1 Route */}
                            <div className="grid gap-6">
                                <Panel title="Destination Radar Map" subtitle="Nearby clustering & spatial context" icon="🗺️">
                                    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50 p-3">
                                        <div className="mb-3 flex gap-2">
                                            <input
                                                aria-label="Search map area"
                                                value={mapSearch}
                                                onChange={(event) => setMapSearch(event.target.value)}
                                                placeholder="Search map area, e.g. Jaipur, Goa..."
                                                className="flex-1 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-ink"
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
                                                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
                                            >
                                                Search
                                            </button>
                                        </div>
                                        <iframe
                                            title="Destination map"
                                            src={mapEmbedUrl}
                                            className="h-64 w-full rounded-[20px] border border-slate-200 shadow-inner"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                        {mapStatus ? <p className="mt-2 text-xs text-slate-500 font-medium">{mapStatus}</p> : null}
                                        <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-3">
                                            {mapPlaces.map((place) => (
                                                <div key={place.name} className="rounded-2xl border border-slate-200/60 bg-white/90 p-2.5 shadow-sm">
                                                    <p className="font-semibold text-slate-800 truncate">{place.name}</p>
                                                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">{place.category} • {place.distance_km} km</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Panel>

                                <Panel title="Day 1 Interactive Route" subtitle="Approximate local travel between stops" icon="📍">
                                    {routeStops.length > 0 ? (
                                        <div className="grid gap-2.5">
                                            {routeStops.map((stop, index) => (
                                                <div key={`${stop.name}-${index}`} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white shadow-sm">{index + 1}</div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate font-bold text-ink">{stop.name}</p>
                                                        <p className="mt-0.5 text-xs capitalize text-slate-500">{stop.category} · {stop.mode}</p>
                                                    </div>
                                                    {index > 0 ? (
                                                        <span className="whitespace-nowrap rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">{stop.travel_time_min} min</span>
                                                    ) : (
                                                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold">Start point</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600">Generate a plan to calculate approximate stop-to-stop transit times and local route legs.</p>
                                    )}
                                </Panel>
                            </div>

                            {/* Right Column: Weather Radar + POI + Realtime Research */}
                            <div className="grid gap-6">
                                <Panel
                                    title="Weather Radar"
                                    subtitle="Forecast-aware itinerary pacing"
                                    icon="🌤️"
                                    action={
                                        <button
                                            type="button"
                                            onClick={() => void replanForWeather()}
                                            disabled={!tripId}
                                            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40"
                                        >
                                            Replan for weather
                                        </button>
                                    }
                                >
                                    <div className="grid gap-3 text-sm text-slate-700">
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {forecast.map((day) => (
                                                <div key={day.day} className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3.5 py-3">
                                                    <div>
                                                        <p className="font-bold text-ink">{day.day}</p>
                                                        <p className="text-xs text-slate-500">{day.condition}</p>
                                                    </div>
                                                    <span className="text-base font-extrabold text-slate-800">{day.high_c}° <span className="text-xs font-normal text-slate-500">/ {day.low_c}°</span></span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {weather?.status === 'live_forecast' ? 'Verified forecast' : 'Fallback estimate'} · Source: {weather?.source ?? 'Open-Meteo'}
                                            {weather?.timezone ? ` · ${weather.timezone}` : ''}
                                            {weather?.observed_at ? ` · updated ${new Date(weather.observed_at).toLocaleString()}` : ''}
                                        </p>
                                    </div>
                                </Panel>

                                <Panel title="POI Highlights" subtitle="Live curated destinations" icon="🏛️">
                                    <div className="grid gap-2.5 text-sm text-slate-700 sm:grid-cols-2">
                                        {(poiResults.length > 0 ? poiResults : [
                                            { name: 'City Palace & Heritage Walk', category: 'landmark' },
                                            { name: 'Hawa Mahal Viewpoint Cafe', category: 'viewpoint' },
                                            { name: 'Local Artisan Bazaar', category: 'market' },
                                            { name: 'Traditional Thali Tasting', category: 'food' },
                                        ]).map((place) => (
                                            <div key={place.name} className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3">
                                                <p className="font-bold text-ink truncate">{place.name}</p>
                                                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500">{place.category}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Panel>

                                <Panel
                                    title="Real-Time Research Engine"
                                    subtitle={researchReport ? `${researchReport.status === 'complete' ? 'Live connected' : 'Partial sync'} · Updated ${researchReport.updated_at}` : 'Checking live travel sources'}
                                    icon="📡"
                                >
                                    {researchReport ? (
                                        <div className="grid gap-4 text-sm text-slate-700">
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {Object.entries(researchReport.providers).map(([key, provider]) => (
                                                    <div key={key} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="font-bold text-ink capitalize text-sm">{key}</p>
                                                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${provider.available ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                                                {provider.available ? '● Live' : '○ Needs key'}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-600 leading-5">{provider.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live places and hours</p>
                                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                                    {researchReport.attractions_and_restaurants.slice(0, 6).map((place) => (
                                                        <div key={`${place.name}-${place.category}`} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200/80 shadow-sm">
                                                            <p className="font-bold text-ink">{place.name}</p>
                                                            <p className="mt-1 text-xs capitalize text-slate-500">{place.category} · {place.opening_hours ?? 'Hours not mapped'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500">Sources: {researchReport.source_notes.join(', ')}{researchReport.generated_at ? ` · generated ${new Date(researchReport.generated_at).toLocaleString()}` : ''}</p>
                                            {researchReport.limitations?.[0] && <p className="text-xs text-slate-500">{researchReport.limitations[0]}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600">Live weather, places, opening hours, and provider telemetry are syncing...</p>
                                    )}
                                </Panel>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: AI CONCIERGE */}
                    {activeTab === 'chat' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: AI Chat + Voice Assistant */}
                            <div className="grid gap-6">
                                <Panel title="AI Travel Concierge" subtitle="Voice + text assistant with real-time stream" icon="🤖">
                                    <div className="space-y-3">
                                        <div
                                            className="h-80 space-y-2.5 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 scrollbar-thin"
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
                                                    className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] ${
                                                        message.role === 'assistant'
                                                            ? 'mr-auto bg-white text-slate-800 shadow-sm border border-slate-200/60'
                                                            : 'ml-auto bg-ink text-white'
                                                    }`}
                                                >
                                                    <p className="text-[10px] uppercase tracking-[0.18em] opacity-70 font-bold">{message.role}</p>
                                                    <p className="mt-1 leading-6">{message.text || (chatStreaming && idx === chatMessages.length - 1 ? '...' : '')}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Quick Prompt Pills */}
                                        <div className="flex flex-wrap gap-1.5 pb-1">
                                            {QUICK_CHAT_PROMPTS.map((prompt) => (
                                                <button
                                                    key={prompt}
                                                    type="button"
                                                    onClick={() => { setChatInput(prompt); void askAssistant(prompt); }}
                                                    className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                                                >
                                                    ✨ {prompt}
                                                </button>
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
                                                className={`rounded-2xl border px-3.5 py-2 text-sm font-semibold transition ${voiceActive ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                {voiceActive ? '🎙️ Active' : '🎙️ Mic'}
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Send chat message"
                                                onClick={() => void askAssistant()}
                                                disabled={chatStreaming}
                                                className="rounded-2xl bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                            >
                                                {chatStreaming ? 'Streaming...' : 'Send'}
                                            </button>
                                        </div>

                                        {chatError ? <p className="text-sm text-rose-600 font-medium">{chatError}</p> : null}
                                    </div>
                                </Panel>

                                <Panel title="Voice Assistant Mode" subtitle="Hands-free spoken travel notes" icon="🎙️">
                                    <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-rose-50/70 via-white to-sky-50/70 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Travel mode</p>
                                                <p className="mt-1 text-base font-bold text-ink">{voiceActive ? 'Listening for quick notes' : 'Ready for voice capture'}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={toggleVoiceInput}
                                                className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm transition ${voiceActive ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                            >
                                                {voiceActive ? 'Stop Voice' : 'Start Voice'}
                                            </button>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-700">
                                            {voiceActive
                                                ? 'The assistant is ready to capture quick spoken reminders such as "find a quiet cafe nearby" or "add one museum stop."'
                                                : 'Use browser speech recognition to capture spoken requests and send them directly to the travel agent.'}
                                        </p>
                                    </div>
                                </Panel>
                            </div>

                            {/* Right Column: Visual Travel Agent + Travel Files */}
                            <div className="grid gap-6">
                                <Panel title="Visual Travel Agent" subtitle="Compare hotel screenshots or identify monuments" icon="👁️">
                                    <div className="grid gap-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(event) => setVisionFiles(Array.from(event.target.files ?? []))}
                                            className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-700"
                                        />
                                        <textarea
                                            value={visionPrompt}
                                            onChange={(event) => setVisionPrompt(event.target.value)}
                                            className="min-h-20 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-ink"
                                            placeholder="Ask about uploaded photos..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void analyzeVision()}
                                            disabled={visionLoading || visionFiles.length === 0}
                                            className="w-fit rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                        >
                                            {visionLoading ? 'Analyzing images...' : 'Analyze images'}
                                        </button>
                                        {visionResult ? (
                                            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-6 text-slate-700">{visionResult}</p>
                                        ) : (
                                            <p className="text-xs text-slate-500">Upload hotel screenshots, ticket confirmations, or landmark photos for multimodal reasoning.</p>
                                        )}
                                    </div>
                                </Panel>

                                <Panel title="Travel Documents & Files" subtitle="Upload itinerary docs, tickets, & bookings" icon="📁">
                                    <div className="space-y-3">
                                        <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                            <input type="file" className="hidden" onChange={(event) => void uploadFile(event)} />
                                            {uploading ? 'Uploading document...' : '📄 Click or drop a file to upload'}
                                        </label>
                                        {uploadError ? <p className="text-sm text-rose-600">{uploadError}</p> : uploadStatus ? <p className="text-sm text-emerald-700">{uploadStatus}</p> : null}
                                        <div className="space-y-2">
                                            {uploadFiles.length > 0 ? (
                                                uploadFiles.map((file) => (
                                                    <div key={`${file.file_name}-${file.file_path}`} className="rounded-2xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
                                                        <p className="font-bold text-ink">{file.file_name}</p>
                                                        <p className="text-xs text-slate-500">{file.content_type} • {file.size} bytes</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-600">No documents uploaded yet. Upload flight tickets or hotel vouchers to keep them handy.</p>
                                            )}
                                        </div>
                                    </div>
                                </Panel>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: DISCOVER & COMPARE */}
                    {activeTab === 'discover' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: Discover India + Group Planner */}
                            <div className="grid gap-6">
                                <Panel title="Discover India" subtitle="Match a destination to your trip profile" icon="🧭">
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => void discoverIndia()}
                                            disabled={discovering}
                                            className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {discovering ? 'Finding matches...' : '🔍 Find my next India trip'}
                                        </button>
                                        {destinationRecommendations.length > 0 ? (
                                            <div className="grid gap-2.5 sm:grid-cols-2">
                                                {destinationRecommendations.map((item) => (
                                                    <button
                                                        key={item.name}
                                                        type="button"
                                                        onClick={() => { setDestination(item.name); setMapSearch(item.name); }}
                                                        className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-left transition hover:border-slate-300 hover:bg-white"
                                                    >
                                                        <p className="font-bold text-ink">{item.name}</p>
                                                        <p className="mt-1 text-xs text-slate-500">{item.region} · {item.best_for.join(' · ')}</p>
                                                        <p className="mt-1 text-xs font-medium text-coral">Best season: {item.season}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-600">Click to discover curated Indian destinations matching your profile interests and season.</p>
                                        )}
                                    </div>
                                </Panel>

                                <Panel title="Group Travel Planner" subtitle="Balance everyone's budget and preferences" icon="👥">
                                    <div className="grid gap-3">
                                        <textarea
                                            value={groupMembers}
                                            onChange={(event) => setGroupMembers(event.target.value)}
                                            className="min-h-24 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-ink"
                                            placeholder="Vaishnavi: vegetarian
Friend 1: adventure
Friend 2: museums"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void createGroupPlan()}
                                            disabled={grouping}
                                            className="w-fit rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {grouping ? 'Balancing preferences...' : 'Build group plan'}
                                        </button>
                                        {groupPlan ? (
                                            <div className="grid gap-2.5 text-sm text-slate-700">
                                                <p className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 font-bold text-ink">{groupPlan.consensus}</p>
                                                <ul className="grid gap-2">
                                                    {groupPlan.plan.map((step) => (
                                                        <li key={step} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs">{step}</li>
                                                    ))}
                                                </ul>
                                                <p className="text-xs text-slate-500 font-medium">Strategy: {groupPlan.budget_strategy}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-600">Format: One traveler per line: "Name: preference".</p>
                                        )}
                                    </div>
                                </Panel>
                            </div>

                            {/* Right Column: Compare Trips + Toolkit */}
                            <div className="grid gap-6">
                                <Panel title="Compare India Trips" subtitle="Side-by-side evaluation for same budget and days" icon="⚖️">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="First destination" value={compareFirst} onChange={setCompareFirst} placeholder="Goa" />
                                        <Field label="Second destination" value={compareSecond} onChange={setCompareSecond} placeholder="Kerala" />
                                        <Field label="Budget (INR)" type="number" value={String(compareBudget)} onChange={(value) => setCompareBudget(Number(value || 0))} />
                                        <Field label="Days" type="number" value={String(compareDays)} onChange={(value) => setCompareDays(Number(value || 1))} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void compareDestinations()}
                                        disabled={comparing}
                                        className="mt-3 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        {comparing ? 'Comparing...' : 'Compare plans'}
                                    </button>
                                    {comparison.length > 0 ? (
                                        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                                            <table className="w-full text-left text-sm text-slate-700">
                                                <thead className="bg-slate-950 text-white">
                                                    <tr>
                                                        <th className="px-3 py-3 font-semibold text-xs">Metric</th>
                                                        {comparison.map((option) => <th key={option.destination} className="px-3 py-3 font-semibold text-xs">{option.destination}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        ['Cost', (option: ComparisonOption) => `₹${option.estimated_cost.toLocaleString('en-IN')}`],
                                                        ['Travel time', (option: ComparisonOption) => option.travel_time],
                                                        ['Activities', (option: ComparisonOption) => option.activities],
                                                        ['Weather', (option: ComparisonOption) => option.weather],
                                                        ['Food', (option: ComparisonOption) => option.food],
                                                        ['Relaxation', (option: ComparisonOption) => option.relaxation],
                                                    ].map(([label, getValue]) => (
                                                        <tr key={String(label)} className="border-t border-slate-200">
                                                            <th className="bg-slate-50 px-3 py-2.5 text-xs font-bold text-ink">{String(label)}</th>
                                                            {comparison.map((option) => (
                                                                <td key={option.destination} className="px-3 py-2.5 text-xs align-top">
                                                                    {(getValue as (item: ComparisonOption) => string)(option)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    <tr className="border-t border-slate-200">
                                                        <th className="bg-slate-50 px-3 py-2.5 text-xs font-bold text-ink">Choose</th>
                                                        {comparison.map((option) => (
                                                            <td key={option.destination} className="px-3 py-2.5 align-top">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setDestination(option.destination); setBudget(compareBudget); setMapSearch(option.destination); }}
                                                                    className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                                                                >
                                                                    Select {option.destination}
                                                                </button>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-slate-600">Compare Goa vs Kerala, or test any two Indian destinations.</p>
                                    )}
                                </Panel>

                                <Panel title="India Travel Toolkit" subtitle="Curated hotels, transport, restaurants & route advice" icon="🧰">
                                    {/* Practical Travel Protocol & Etiquette */}
                                    <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs text-slate-700">
                                        <p className="font-bold text-ink uppercase tracking-wider text-[11px] mb-2">🇮🇳 Travel Essentials & Etiquette for {displayKey}</p>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <div className="rounded-xl bg-white p-2.5 border border-slate-200/60">
                                                <p className="font-bold text-slate-800">👗 Temple & Heritage Dress</p>
                                                <p className="mt-0.5 text-slate-600">Cover shoulders and knees at religious sites. Footwear must be removed at shrine entrances.</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-2.5 border border-slate-200/60">
                                                <p className="font-bold text-slate-800">🚕 Local Commute Tip</p>
                                                <p className="mt-0.5 text-slate-600">Use pre-paid taxi booths or Uber/Ola for fixed transparent fares. Metro QR tickets are fastest.</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-2.5 border border-slate-200/60">
                                                <p className="font-bold text-slate-800">💧 Water & Dining</p>
                                                <p className="mt-0.5 text-slate-600">Stick to sealed bottled or purified water. Eat street food that is freshly prepared hot in busy stalls.</p>
                                            </div>
                                            <div className="rounded-xl bg-white p-2.5 border border-slate-200/60">
                                                <p className="font-bold text-slate-800">🔌 SIM & Electricity</p>
                                                <p className="mt-0.5 text-slate-600">230V, Type C/D/M plugs. Airtel or Jio eSIMs are readily activated at major airports.</p>
                                            </div>
                                        </div>
                                    </div>
                                    {travelRecommendations ? (
                                        <div className="grid gap-4 text-sm text-slate-700">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hotels</p>
                                                    <div className="mt-2 grid gap-2">
                                                        {travelRecommendations.hotels.map((hotel) => (
                                                            <div key={hotel.name} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5">
                                                                <p className="font-bold text-ink">{hotel.name}</p>
                                                                <p className="mt-0.5 text-xs text-slate-500">{hotel.area} · {hotel.rating}★ · ₹{hotel.nightly_inr.toLocaleString('en-IN')}/night</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Transport</p>
                                                    <div className="mt-2 grid gap-2">
                                                        {travelRecommendations.transport.map((option) => (
                                                            <div key={option.mode} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5">
                                                                <p className="font-bold text-ink">{option.mode}</p>
                                                                <p className="mt-0.5 text-xs text-slate-500">{option.note} · ₹{option.estimated_inr.toLocaleString('en-IN')} est.</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Restaurants</p>
                                                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                                    {travelRecommendations.restaurants.map((restaurant) => (
                                                        <div key={restaurant.name} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-2.5">
                                                            <p className="font-bold text-ink">{restaurant.name}</p>
                                                            <p className="mt-0.5 text-xs text-slate-500">{restaurant.cuisine} · {restaurant.price_band} · {restaurant.area}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="rounded-2xl bg-amber-50 border border-amber-200/70 p-3 text-xs text-amber-900 font-medium">Route tip: {travelRecommendations.route_tip}</p>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Smart notifications</p>
                                                <div className="mt-2 grid gap-2">
                                                    {travelRecommendations.notifications.map((notification) => (
                                                        <p key={notification.type} className="rounded-2xl bg-slate-50 border border-slate-200/60 p-2.5 text-xs">{notification.message}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600">Travel toolkit data will appear once recommendations are loaded.</p>
                                    )}
                                </Panel>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: JOURNAL & BUDGET */}
                    {activeTab === 'journal' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: AI Travel Journal + Expense Logger */}
                            <div className="grid gap-6">
                                <Panel title="AI Travel Journal" subtitle="Notes, expenses, places, and memories" icon="📓">
                                    <div className="grid gap-3">
                                        {journalDiary ? (
                                            <p className="rounded-2xl bg-amber-50/80 border border-amber-200/80 px-3.5 py-3 text-sm text-amber-950 font-medium">
                                                {journalDiary}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-slate-600">Add your first memory and the diary will grow with your trip.</p>
                                        )}
                                        <textarea
                                            value={journalNote}
                                            onChange={(event) => setJournalNote(event.target.value)}
                                            placeholder="Write a note about today, e.g. 'Dinner at Peacock Rooftop'..."
                                            className="min-h-20 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Field label="Place visited" value={journalPlace} onChange={setJournalPlace} placeholder="Amber Fort" />
                                            <Field label="Expense (INR)" type="number" value={journalExpense} onChange={setJournalExpense} placeholder="450" />
                                        </div>
                                        <div className="flex flex-wrap gap-2.5 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => void addJournalEntry()}
                                                disabled={!tripId || !journalNote.trim()}
                                                className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                📝 Add to journal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void addCategorizedExpense()}
                                                disabled={!tripId || !journalNote.trim() || !journalExpense}
                                                className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                💳 Categorize expense
                                            </button>
                                        </div>
                                        {journalEntries.length > 0 ? (
                                            <div className="mt-2 grid gap-2 text-sm text-slate-700">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent entries</p>
                                                {journalEntries.slice(-6).reverse().map((entry) => (
                                                    <div key={entry.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-3.5 py-2.5">
                                                        <div>
                                                            <span className="font-bold capitalize text-ink">{entry.kind}</span>: {entry.text}
                                                            {entry.place ? <span className="text-xs text-slate-500"> · 📍 {entry.place}</span> : null}
                                                        </div>
                                                        {entry.amount_inr ? <span className="font-bold text-emerald-700 whitespace-nowrap">₹{entry.amount_inr.toLocaleString('en-IN')}</span> : null}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </Panel>
                            </div>

                            {/* Right Column: Budget Breakdown + FAQ + India Emergency Directory */}
                            <div className="grid gap-6">
                                <Panel title="Budget Agent" subtitle="Estimated categories" icon="💰">
                                    <div className="grid gap-3 text-sm text-slate-700">
                                        {Object.keys(budgetBreakdown).length > 0 ? (
                                            <>
                                                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                                    <span className="font-semibold text-ink">Trip budget</span>
                                                    <span className="font-bold text-ink">₹{displayBudget.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="grid gap-2">
                                                    {Object.entries(budgetBreakdown).filter(([key]) => key !== 'remaining').map(([key, value]) => (
                                                        <p key={key} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3.5 py-2.5 capitalize border border-slate-200/60">
                                                            <span>{key.replace('_', ' ')}</span>
                                                            <span className="font-semibold">₹{value.toLocaleString('en-IN')}</span>
                                                        </p>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between border-t border-slate-200 pt-3 font-semibold text-emerald-700">
                                                    <span>Remaining buffer</span>
                                                    <span>₹{(budgetBreakdown.remaining ?? 0).toLocaleString('en-IN')}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p>Generate a plan to split your INR budget across transport, hotels, food, activities, local travel, emergency funds, and remaining cash.</p>
                                        )}
                                    </div>
                                </Panel>

                                <Panel title="Emergency & Safety Hub" subtitle="Official India hotlines & safety protocol" icon="🛡️">
                                    <div className="grid gap-3 text-sm text-slate-700">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">National Emergency</p>
                                                <p className="mt-1 text-xl font-black text-rose-900">112</p>
                                                <p className="text-[10px] text-rose-600">Police, Fire, Medical</p>
                                            </div>
                                            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Tourist Helpline</p>
                                                <p className="mt-1 text-xl font-black text-sky-900">1363</p>
                                                <p className="text-[10px] text-sky-600">24x7 Multi-lingual</p>
                                            </div>
                                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-center">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Medical / Ambulance</p>
                                                <p className="mt-1 text-xl font-black text-emerald-900">108</p>
                                                <p className="text-[10px] text-emerald-600">Free Ambulance</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold text-slate-500">Police</p>
                                                <p className="text-base font-bold text-slate-800">100</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold text-slate-500">Women Helpline</p>
                                                <p className="text-base font-bold text-slate-800">1091</p>
                                            </div>
                                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-center">
                                                <p className="text-[10px] font-bold text-slate-500">Fire</p>
                                                <p className="text-base font-bold text-slate-800">101</p>
                                            </div>
                                        </div>
                                        <div className="mt-1 rounded-2xl bg-amber-50/90 border border-amber-200/80 p-3 text-xs text-amber-950">
                                            <p className="font-bold flex items-center gap-1.5 text-amber-900">
                                                <span>📍</span> Traveler Safety Reminder for {displayKey}
                                            </p>
                                            <p className="mt-1 leading-5 text-amber-900/90">
                                                Keep digital copies of photo IDs and hotel vouchers stored in the Travel Files section. Tap water should be filtered or bottled. Registered pre-paid auto/taxi booths are recommended at major railway stations and airports.
                                            </p>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel title="Travel FAQ" subtitle="RAG-ready knowledge base" icon="💡">
                                    <div className="grid gap-2.5 text-sm text-slate-700">
                                        {faqResults.length > 0 ? (
                                            faqResults.map((item) => (
                                                <div key={item.question} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
                                                    <p className="font-bold text-ink">{item.question}</p>
                                                    <p className="mt-1 text-slate-600 leading-relaxed text-xs">{item.answer}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-600">FAQ intelligence will appear here after plan generation.</p>
                                        )}
                                    </div>
                                </Panel>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: SAVED TRIPS & PROFILE */}
                    {activeTab === 'trips' && (
                        <div className="grid gap-6 lg:grid-cols-2 items-start" data-reveal>
                            {/* Left Column: Saved Trips + Revision History */}
                            <div className="grid gap-6">
                                <Panel
                                    title="Saved Trips Vault"
                                    subtitle="Persistent trip history"
                                    icon="🗂️"
                                    action={
                                        <button
                                            type="button"
                                            onClick={() => void refreshSavedTrips()}
                                            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                                        >
                                            Refresh trips
                                        </button>
                                    }
                                >
                                    <div className="grid gap-3 text-sm text-slate-700">
                                        {savedTrips.length > 0 ? (
                                            savedTrips.map((trip) => (
                                                <div
                                                    key={trip.trip_id}
                                                    className={`group rounded-2xl border p-3.5 text-left transition ${trip.trip_id === tripId ? 'border-ink bg-ink/5 shadow-sm' : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'}`}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <button
                                                            type="button"
                                                            aria-label={`Load trip ${trip.destination}`}
                                                            onClick={() => void loadTrip(trip.trip_id)}
                                                            className="flex-1 text-left font-bold text-ink hover:underline text-base"
                                                        >
                                                            {trip.destination}
                                                        </button>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-400">v{trip.version}</span>
                                                            <button
                                                                type="button"
                                                                aria-label={`Delete trip ${trip.destination}`}
                                                                onClick={(e) => void deleteTrip(trip.trip_id, e)}
                                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                                                                title="Delete saved trip"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-label={`Load trip ${trip.destination}`}
                                                        onClick={() => void loadTrip(trip.trip_id)}
                                                        className="mt-1 w-full text-left"
                                                    >
                                                        <p className="text-sm text-slate-700">{trip.summary}</p>
                                                        <p className="mt-2 text-xs text-slate-500 font-medium">₹{trip.budget.toLocaleString('en-IN')} • {trip.style} • updated {new Date(trip.updated_at).toLocaleString()}</p>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-600">No saved trips yet. Generate a trip and it will be stored in your cloud vault.</p>
                                        )}
                                    </div>
                                </Panel>

                                <Panel title="Revision History" subtitle="Versioned changes & rollbacks" icon="📜">
                                    <div className="grid gap-2.5 text-sm text-slate-700">
                                        {revisionHistory.length > 0 ? (
                                            revisionHistory.map((revision) => (
                                                <div key={`${revision.version}-${revision.created_at}`} className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="font-bold text-ink">Version {revision.version}</p>
                                                        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-400">{new Date(revision.created_at).toLocaleString()}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-600">{revision.note}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-600">No revisions loaded yet for the active trip.</p>
                                        )}
                                    </div>
                                </Panel>
                            </div>

                            {/* Right Column: Personal Travel Profile + Data Sources */}
                            <div className="grid gap-6">
                                <Panel title="Personal Travel Profile" subtitle="Preferences the assistant remembers" icon="👤">
                                    <div className="grid gap-3 text-sm text-slate-700">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <Field label="Budget range" value={profile.budget_range} onChange={(value) => setProfile((current) => ({ ...current, budget_range: value }))} placeholder="mid-range" />
                                            <Field label="Travel style" value={profile.travel_style} onChange={(value) => setProfile((current) => ({ ...current, travel_style: value }))} placeholder="balanced" />
                                        </div>
                                        <Field label="Interests" value={profile.interests.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, interests: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="food, heritage, nature" />
                                        <Field label="Food preferences" value={profile.food_preferences.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, food_preferences: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="vegetarian-friendly, spicy" />
                                        <Field label="Preferred transport" value={profile.preferred_transport.join(', ')} onChange={(value) => setProfile((current) => ({ ...current, preferred_transport: value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="train, metro, walking" />
                                        <div className="flex items-center justify-between gap-3 pt-2">
                                            <p className="text-xs text-slate-500">Sign in to sync this profile across sessions.</p>
                                            <button type="button" onClick={() => void saveProfile()} className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                                                Save profile
                                            </button>
                                        </div>
                                        {profileStatus ? <p className="text-xs text-emerald-700 font-semibold">{profileStatus}</p> : null}
                                    </div>
                                </Panel>

                                <Panel title="Data Source Notes & Provenance" subtitle="Engine telemetry & connected feeds" icon="⚙️">
                                    <ul className="grid gap-2 text-sm text-slate-700">
                                        {sourceNotes.map((note) => (
                                            <li key={note} className="rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs">{note}</li>
                                        ))}
                                    </ul>
                                </Panel>
                            </div>
                        </div>
                    )}
                </main>

                {/* MODAL 1: SHARE & OFFLINE GUIDE */}
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-2xl rounded-[32px] border border-white/60 bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Portable Briefing</p>
                                    <h3 className="text-xl font-bold text-ink">Export & Share Travel Guide</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowShareModal(false)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-slate-500 mb-2">Save this offline summary to your notes app or forward to travel companions:</p>
                                <textarea
                                    readOnly
                                    value={getShareableText()}
                                    className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 font-mono text-xs text-slate-800 outline-none"
                                />
                            </div>
                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                <div className="text-xs text-slate-500">
                                    {copiedShare ? <span className="font-bold text-emerald-600">✓ Copied to clipboard!</span> : 'Includes emergency contacts & full itinerary.'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={copyTripPlan}
                                        className="rounded-2xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        📋 Copy Plan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={downloadOfflineGuide}
                                        className="rounded-2xl bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                                    >
                                        📥 Download .md File
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: LIVE CURRENCY CONVERTER */}
                {showCurrencyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">Forex Calculator</p>
                                    <h3 className="text-xl font-bold text-ink">Currency Converter</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowCurrencyModal(false)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="mt-5 space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-slate-500">Amount</label>
                                        <input
                                            type="number"
                                            value={fxAmount}
                                            onChange={(e) => setFxAmount(e.target.value)}
                                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-ink outline-none focus:border-ink"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs font-semibold text-slate-500">Currency</label>
                                        <select
                                            value={fxCurrency}
                                            onChange={(e) => setFxCurrency(e.target.value as any)}
                                            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-ink outline-none"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="AUD">AUD ($)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center">
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Estimated Indian Rupees</p>
                                    <p className="mt-1 text-3xl font-black text-emerald-950">₹{convertedInr.toLocaleString('en-IN')}</p>
                                    <p className="mt-1 text-[11px] text-emerald-700">Rate: 1 {fxCurrency} ≈ ₹{FX_RATES[fxCurrency]} INR</p>
                                </div>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowCurrencyModal(false)}
                                    className="rounded-2xl bg-ink px-5 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

function PulseStat({ icon, value, label }: { icon: string; value: string; label: string }) {
    return <div className="rounded-2xl bg-white/10 px-3 py-3"><p className="text-lg">{icon}</p><p className="mt-1 text-sm font-black">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/60">{label}</p></div>;
}

function TimelineItem({ time, icon, label, text, last = false }: { time: string; icon: string; label: string; text: string; last?: boolean }) {
    return <div className={`timeline-item ${last ? 'timeline-item-last' : ''}`}><div className="timeline-time">{time}</div><div className="timeline-node">{icon}</div><div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[0.15em] text-coral">{label}</p><p className="mt-1 leading-6">{text}</p></div></div>;
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

function Panel({
    title,
    subtitle,
    children,
    icon,
    action,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
    icon?: string;
    action?: ReactNode;
}) {
    return (
        <div className="panel shadow-glow backdrop-blur rounded-[28px] border border-slate-200/70 bg-white/90 p-5 sm:p-6 transition hover:border-slate-300" data-reveal>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">{subtitle}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink flex items-center gap-2">
                        {icon && <span className="text-lg">{icon}</span>}
                        {title}
                    </h3>
                </div>
                {action && <div>{action}</div>}
            </div>
            <div>{children}</div>
        </div>
    );
}
