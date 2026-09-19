import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-shell min-h-screen bg-[#050b16] text-slate-100">
            <div className="absolute inset-0 overflow-hidden">
                <div className="orb orb-one absolute -left-20 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="orb orb-two absolute right-10 top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="orb orb-three absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
                <header className="floating-panel flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-lg font-bold text-white">A</div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">AI Travel</p>
                            <p className="text-sm font-semibold text-white">Guide</p>
                        </div>
                    </div>

                    <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
                        <a href="#features" className="transition hover:text-white">Features</a>
                        <a href="#why" className="transition hover:text-white">Why us</a>
                        <a href="#travel-flow" className="transition hover:text-white">Travel flow</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link to="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/5">Sign in</Link>
                        <Link to="/signup" className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">Get started</Link>
                    </div>
                </header>

                <main className="mt-16 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="reveal-up">
                        <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                            Smart travel planning
                        </span>
                        <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Plan a trip that feels made for you.
                        </h1>
                        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                            Generate itineraries, adjust budgets, discover local gems, and keep every trip organized with an AI travel assistant built for modern explorers.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Link to="/planner" className="motion-button rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition hover:-translate-y-0.5">
                                Explore planner
                            </Link>
                            <Link to="/signup" className="motion-button rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                                Create account
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2">4.9/5 traveler rating</div>
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Saved trips</div>
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2">AI itinerary guidance</div>
                        </div>
                    </div>

                    <div className="floating-panel reveal-up rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                        <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Upcoming trip</p>
                                    <h2 className="mt-2 text-2xl font-bold text-white">Lisbon</h2>
                                </div>
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">Balanced</span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Budget</p>
                                    <p className="mt-2 text-xl font-bold text-white">$1,200</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Days</p>
                                    <p className="mt-2 text-xl font-bold text-white">4</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Style</p>
                                    <p className="mt-2 text-xl font-bold text-white">Food</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {[
                                    { day: 'Day 1', title: 'Old town & sunset views' },
                                    { day: 'Day 2', title: 'Market + local food walk' },
                                    { day: 'Day 3', title: 'Art district & scenic tram' },
                                ].map((item) => (
                                    <div key={item.day} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.day}</p>
                                            <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                                        </div>
                                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <section id="features" className="mt-20 grid gap-5 md:grid-cols-3">
                    {[
                        { title: 'AI itinerary builder', text: 'Turn your trip goal into a structured day plan grounded in budget, pace, and personal interests.' },
                        { title: 'Budget-aware planning', text: 'Track estimated costs by category and adjust the itinerary when priorities change.' },
                        { title: 'Smart companion', text: 'Ask for route changes, restaurant ideas, or local highlights as you plan on the go.' },
                    ].map((feature, index) => (
                        <div key={feature.title} className={`floating-panel reveal-up rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-lg`} style={{ animationDelay: `${index * 120}ms` }}>
                            <div className="mb-4 h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500" />
                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-300">{feature.text}</p>
                        </div>
                    ))}
                </section>

                <section id="travel-flow" className="mt-20 rounded-[32px] border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 reveal-up">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Why travelers choose it</p>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Less planning friction. More time exploring.</h3>
                            <p className="mt-3 max-w-lg text-slate-300">From destination discovery to budget balancing, the app keeps inspiration and logistics in one place so your trip feels organized without feeling rigid.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fast</p>
                                <p className="mt-2 text-2xl font-bold text-white">2 min</p>
                                <p className="mt-1 text-sm text-slate-300">Average plan setup</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Flexible</p>
                                <p className="mt-2 text-2xl font-bold text-white">Live</p>
                                <p className="mt-1 text-sm text-slate-300">Replans on demand</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
