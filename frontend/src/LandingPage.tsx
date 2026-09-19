import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const localImageFallback = new URL('./assets/india.svg', import.meta.url).href;

const destinations = [
    { name: 'Jaipur, India', detail: 'Heritage & color', days: '4 days', price: '₹28,000', rating: '4.9', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85' },
    { name: 'Goa, India', detail: 'Coast & slow days', days: '5 days', price: '₹30,000', rating: '4.8', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85' },
    { name: 'Kerala, India', detail: 'Backwaters & spice', days: '5 days', price: '₹34,000', rating: '4.9', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85' },
    { name: 'Varanasi, India', detail: 'Spirit & story', days: '3 days', price: '₹19,000', rating: '4.7', image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=85' },
];

const categories = [
    { label: 'Beaches', icon: '☼', color: 'sea' },
    { label: 'Mountains', icon: '⌁', color: 'mint' },
    { label: 'Culture', icon: '⌂', color: 'gold' },
    { label: 'Wellness', icon: '✦', color: 'lavender' },
    { label: 'Food trails', icon: '◉', color: 'peach' },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => destinations.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.detail.toLowerCase().includes(query.toLowerCase())), [query]);

    function explore(destination: string) {
        navigate(`/planner?destination=${encodeURIComponent(destination.split(',')[0])}`);
    }

    return (
        <div className="discover-page min-h-screen text-[#17202b]">
            <header className="discover-header mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
                <Link to="/" className="flex items-center gap-3"><span className="brand-mark">✦</span><span className="text-lg font-black tracking-tight">journey<span className="text-[#ef775b]">.</span></span></Link>
                <nav className="hidden items-center gap-8 text-sm font-semibold text-[#59616b] md:flex"><a href="#destinations">Destinations</a><a href="#categories">Explore</a><a href="#how-it-works">How it works</a></nav>
                <div className="flex items-center gap-2"><Link to="/login" className="hidden px-3 py-2 text-sm font-semibold text-[#59616b] sm:block">Sign in</Link><Link to="/signup" className="rounded-full bg-[#17202b] px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Get started</Link></div>
            </header>

            <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
                <section className="discover-hero relative overflow-hidden rounded-[34px] px-6 pb-8 pt-12 sm:px-12 sm:pb-12 sm:pt-16 lg:px-20">
                    <div className="relative z-10 max-w-2xl"><p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#e65f4a]">The smarter way to wander</p><h1 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-[#17202b] sm:text-7xl">Your next great adventure starts here<span className="text-[#ef775b]">.</span></h1><p className="mt-5 max-w-lg text-base leading-7 text-[#59616b] sm:text-lg">Tell us where you want to go. We&apos;ll help you make every moment count.</p>
                        <form className="mt-8 flex max-w-xl items-center rounded-full bg-white p-2 shadow-[0_16px_40px_rgba(55,70,80,0.14)]" onSubmit={(event) => { event.preventDefault(); explore(query || 'Jaipur'); }}><span className="px-3 text-xl text-[#7e8790]" aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium outline-none placeholder:text-[#9aa1a8] sm:text-base" placeholder="Where do you want to go? (e.g. Goa, Kerala...)" aria-label="Search destination" /><button type="submit" className="rounded-full bg-[#ef775b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#dd6249]">Plan trip</button></form>
                    </div><div className="hero-sun absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#f7c978]/50" /><div className="hero-line absolute -bottom-20 right-8 h-80 w-80 rounded-full border-[28px] border-white/55 sm:right-24" /><div className="hero-stamp absolute bottom-8 right-10 hidden rotate-[-10deg] rounded-full border-2 border-[#ef775b]/60 px-5 py-3 text-center text-[#e65f4a] sm:block"><span className="block text-2xl">✈</span><span className="text-[9px] font-black uppercase tracking-[0.22em]">go explore</span></div>
                </section>

                <section id="destinations" className="mt-12"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.26em] text-[#ef775b]">Curated for you</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Featured destinations</h2></div><Link to="/planner" className="hidden text-sm font-bold text-[#ef775b] sm:block">View all destinations →</Link></div><div className="destination-rail flex snap-x gap-5 overflow-x-auto pb-4">{(filtered.length > 0 ? filtered : destinations).map((item) => <button type="button" key={item.name} onClick={() => explore(item.name)} className="destination-card group w-[255px] shrink-0 snap-start text-left sm:w-[285px]"><div className="relative overflow-hidden rounded-[24px]"><img src={item.image} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = localImageFallback; }} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">★ {item.rating}</span></div><div className="px-1 pt-3"><h3 className="text-xl font-black">{item.name}</h3><p className="mt-1 text-sm text-[#69727c]">{item.detail}</p><p className="mt-2 text-sm font-bold text-[#ef775b]">{item.days} <span className="font-normal text-[#69727c]">from</span> {item.price}</p></div></button>)}</div></section>

                <section id="categories" className="mt-12"><div className="mb-5"><p className="text-xs font-black uppercase tracking-[0.26em] text-[#ef775b]">Find your feeling</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Explore by experience</h2></div><div className="flex gap-4 overflow-x-auto pb-3">{categories.map((category) => <Link to={`/planner?interest=${encodeURIComponent(category.label)}`} key={category.label} className={`category-tile ${category.color} flex min-w-[125px] flex-col items-center rounded-[22px] px-4 py-5 text-center transition hover:-translate-y-1`}><span className="category-icon text-4xl">{category.icon}</span><span className="mt-3 text-sm font-bold">{category.label}</span></Link>)}</div></section>

                <section id="how-it-works" className="journey-band mt-16 grid gap-8 rounded-[30px] px-6 py-8 sm:px-10 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-[#ef775b]">Your personal travel companion</p><h2 className="mt-2 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">Less planning. More living.</h2><p className="mt-3 max-w-xl leading-7 text-[#59616b]">From your first idea to the last dinner, Journey adapts to your budget, your mood, and the unexpected moments in between.</p></div><Link to="/planner" className="w-fit rounded-full bg-[#17202b] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">Start exploring →</Link></section>
            </main>
        </div>
    );
}
