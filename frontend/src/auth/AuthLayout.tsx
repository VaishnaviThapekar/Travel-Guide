import { Link } from 'react-router-dom';

export default function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
    return (
        <div className="auth-page min-h-screen px-4 py-5 text-[#17202b] sm:px-8 sm:py-8">
            <header className="mx-auto flex max-w-7xl items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <span className="brand-mark">✦</span>
                    <span className="text-lg font-black tracking-tight">journey<span className="text-[#ef775b]">.</span></span>
                </Link>
                <Link to="/planner" className="text-sm font-bold text-[#59616b] transition hover:text-[#ef775b]">Explore as guest →</Link>
            </header>
            <main className="auth-card mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-[32px] bg-white sm:mt-12 lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="auth-art relative hidden min-h-[590px] overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="relative z-10"><p className="text-xs font-black uppercase tracking-[0.26em] text-white/75">India, your way</p><h2 className="mt-5 max-w-xs text-4xl font-black leading-tight">Collect moments, not bookings.</h2><p className="mt-4 max-w-xs text-sm leading-6 text-white/80">Your AI travel companion remembers the details so you can stay present for the journey.</p></div>
                    <div className="relative z-10 flex items-end justify-between"><div><p className="text-5xl font-black">28°</p><p className="mt-1 text-sm text-white/75">Jaipur · perfect for a new adventure</p></div><span className="text-5xl">☼</span></div>
                </aside>
                <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
                    <div className="max-w-md"><p className="text-xs font-black uppercase tracking-[0.26em] text-[#ef775b]">{eyebrow}</p><h1 className="mt-3 text-4xl font-black tracking-tight">{title}</h1><p className="mt-3 text-sm leading-6 text-[#69727c]">{description}</p>{children}</div>
                </section>
            </main>
        </div>
    );
}
