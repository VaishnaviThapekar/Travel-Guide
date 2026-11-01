import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const localImageFallback = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

const destinations = [
    { name: 'Switzerland', detail: 'Matterhorn & Alpine Glaciers', days: '6 days', price: 'CHF 1,850', rating: '4.9', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=85' },
    { name: 'Tokyo, Japan', detail: 'Neon Skylines & Historic Shrines', days: '5 days', price: '¥145,000', rating: '4.9', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85' },
    { name: 'Paris, France', detail: 'Art, Cafes & Romantic Boulevards', days: '4 days', price: '€850', rating: '4.8', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85' },
    { name: 'Rome, Italy', detail: 'Colosseum & Renaissance Splendor', days: '5 days', price: '€790', rating: '4.9', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85' },
    { name: 'New York, USA', detail: 'Broadway, The Met & Central Park', days: '4 days', price: '$980', rating: '4.7', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=85' },
    { name: 'Bali, Indonesia', detail: 'Ubud Rice Terraces & Surf Beaches', days: '6 days', price: 'Rp 8.5M', rating: '4.8', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85' },
    { name: 'Santorini, Greece', detail: 'Caldera Sunsets & Blue Domes', days: '4 days', price: '€920', rating: '4.9', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85' },
    { name: 'Dubai, UAE', detail: 'Burj Khalifa & Desert Luxury', days: '4 days', price: 'AED 3,200', rating: '4.8', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85' },
    { name: 'Jaipur, India', detail: 'Palaces, Bazaars & Heritage Forts', days: '4 days', price: '₹24,000', rating: '4.8', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85' },
    { name: 'Sydney, Australia', detail: 'Opera House & Coastal Walks', days: '5 days', price: 'A$1,250', rating: '4.8', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=85' },
    { name: 'Cairo, Egypt', detail: 'Giza Pyramids & Ancient Nile', days: '5 days', price: 'E£ 22,000', rating: '4.7', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=85' },
    { name: 'Amsterdam, Netherlands', detail: 'Canal Rings, Art & Tulip Trails', days: '4 days', price: '€760', rating: '4.8', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=85' },
];

const categories = [
    { label: 'Alpine & Peaks', icon: '🏔️', color: 'mint', search: 'Switzerland' },
    { label: 'Beaches & Reefs', icon: '🌊', color: 'sea', search: 'Bali' },
    { label: 'Ancient Heritage', icon: '🏛️', color: 'gold', search: 'Rome' },
    { label: 'Skylines & Cities', icon: '🏙️', color: 'lavender', search: 'Tokyo' },
    { label: 'Food & Culinary', icon: '🍜', color: 'peach', search: 'Paris' },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => destinations.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.detail.toLowerCase().includes(query.toLowerCase())), [query]);

    function explore(destination: string) {
        navigate(`/planner?destination=${encodeURIComponent(destination.split(',')[0].trim())}`);
    }

    return (
        <div className="discover-page min-h-screen text-[#17202b]">
            <header className="discover-header mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <span className="brand-mark text-2xl font-black text-coral">✦</span>
                    <span className="text-xl font-black tracking-tight text-ink">journey<span className="text-coral">.ai</span></span>
                </Link>
                <nav className="hidden items-center gap-8 text-sm font-semibold text-[#59616b] md:flex">
                    <a href="#destinations" className="hover:text-ink transition">Destinations</a>
                    <a href="#categories" className="hover:text-ink transition">Experiences</a>
                    <a href="#how-it-works" className="hover:text-ink transition">AI Concierge</a>
                </nav>
                <div className="flex items-center gap-3">
                    <Link to="/login" className="hidden px-3.5 py-2 text-sm font-semibold text-[#59616b] hover:text-ink transition sm:block">Sign in</Link>
                    <Link to="/planner" className="rounded-full bg-[#17202b] px-4.5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800">Launch Planner</Link>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                <section className="discover-hero relative overflow-hidden rounded-[34px] px-6 pb-8 pt-12 sm:px-12 sm:pb-12 sm:pt-16 lg:px-20">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1 text-xs font-black uppercase tracking-[0.25em] text-[#e65f4a] shadow-sm backdrop-blur-sm mb-4">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Autonomous AI Travel Concierge
                        </div>
                        <h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-[#17202b] sm:text-7xl">
                            Where do you want to explore<span className="text-[#ef775b]">?</span>
                        </h1>
                        <p className="mt-5 max-w-lg text-base leading-7 text-[#59616b] sm:text-lg">
                            Instant day-by-day itineraries, live foreign exchange, authentic local etiquette, weather radar, and high-definition scenery for any country worldwide.
                        </p>
                        <form
                            className="mt-8 flex max-w-xl items-center rounded-full bg-white p-2 shadow-[0_16px_40px_rgba(55,70,80,0.14)] border border-slate-100"
                            onSubmit={(event) => {
                                event.preventDefault();
                                explore(query || 'Switzerland');
                            }}
                        >
                            <span className="px-3 text-xl text-[#7e8790]" aria-hidden="true">⌕</span>
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium outline-none placeholder:text-[#9aa1a8] sm:text-base"
                                placeholder="Enter any country or city (e.g. Switzerland, Tokyo, Paris, Goa...)"
                                aria-label="Search destination"
                            />
                            <button type="submit" className="rounded-full bg-[#ef775b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#dd6249] shadow-sm">
                                Plan Trip
                            </button>
                        </form>
                    </div>
                    <div className="hero-sun absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#f7c978]/50" />
                    <div className="hero-line absolute -bottom-20 right-8 h-80 w-80 rounded-full border-[28px] border-white/55 sm:right-24" />
                    <div className="hero-stamp absolute bottom-8 right-10 hidden rotate-[-10deg] rounded-full border-2 border-[#ef775b]/60 px-5 py-3 text-center text-[#e65f4a] sm:block bg-white/40 backdrop-blur-sm shadow-sm">
                        <span className="block text-2xl">✈</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.22em]">50+ Countries</span>
                    </div>
                </section>

                <section id="destinations" className="mt-14">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ef775b]">The World, Waiting For You</p>
                            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Featured Global Destinations</h2>
                        </div>
                        <Link to="/planner" className="hidden text-sm font-bold text-[#ef775b] hover:underline sm:block">
                            Open Trip Studio →
                        </Link>
                    </div>
                    <div className="destination-rail flex snap-x gap-5 overflow-x-auto pb-4">
                        {(filtered.length > 0 ? filtered : destinations).map((item) => (
                            <button
                                type="button"
                                key={item.name}
                                onClick={() => explore(item.name)}
                                className="destination-card group w-[255px] shrink-0 snap-start text-left sm:w-[285px] transition hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden rounded-[24px] shadow-sm group-hover:shadow-md transition">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(event) => {
                                            event.currentTarget.onerror = null;
                                            event.currentTarget.src = localImageFallback;
                                        }}
                                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow-sm">★ {item.rating}</span>
                                </div>
                                <div className="px-1 pt-3">
                                    <h3 className="text-xl font-black text-ink">{item.name}</h3>
                                    <p className="mt-1 text-sm text-[#69727c]">{item.detail}</p>
                                    <p className="mt-2 text-sm font-bold text-[#ef775b]">
                                        {item.days} <span className="font-normal text-[#69727c]">est.</span> {item.price}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section id="categories" className="mt-14">
                    <div className="mb-5">
                        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ef775b]">Find Your Flow</p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Explore by Travel Theme</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-3">
                        {categories.map((category) => (
                            <button
                                type="button"
                                onClick={() => explore(category.search)}
                                key={category.label}
                                className={`category-tile ${category.color} flex min-w-[140px] flex-col items-center rounded-[22px] px-4 py-5 text-center transition hover:-translate-y-1 border border-black/5 cursor-pointer`}
                            >
                                <span className="category-icon text-4xl">{category.icon}</span>
                                <span className="mt-3 text-sm font-bold text-ink">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="journey-band mt-16 grid gap-8 rounded-[30px] px-6 py-8 sm:px-10 md:grid-cols-[1fr_auto] md:items-center bg-slate-900 text-white shadow-xl">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-coral mb-2">
                            <span>🤖</span> Multi-Agent Intelligent Travel Mesh
                        </div>
                        <h2 className="mt-1 max-w-xl text-3xl font-black tracking-tight sm:text-4xl text-white">
                            Autonomous Planning. Zero Stress.
                        </h2>
                        <p className="mt-3 max-w-xl leading-7 text-slate-300">
                            Route Strategist maps daily clusters. Weather Sentinel adapts outdoor activities. Budget Auditor tracks expenses across currencies. Safety Guardian delivers verified local emergency contacts.
                        </p>
                    </div>
                    <Link to="/planner" className="w-fit rounded-full bg-coral px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-coral-dark">
                        Open Studio Now →
                    </Link>
                </section>
            </main>
        </div>
    );
}
