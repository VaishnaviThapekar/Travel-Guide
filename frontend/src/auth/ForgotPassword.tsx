import React, { useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null);
        try {
            const res = await fetch(`${apiBaseUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error('Request failed');
            const data = await res.json();
            setStatus('If that email exists, a reset token was generated (dev mode).');
            console.log('reset token (dev):', data.reset_token);
        } catch (err) {
            setStatus('Unable to request password reset');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,#020817,#111827_35%,#0f172a)] px-4 py-10 text-slate-100">
            <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-black text-slate-950">A</div>
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Reset access</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">Forgot password</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {status && <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">{status}</div>}
                    <div className="pt-2">
                        <button className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]" type="submit">Request reset</button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-300">
                    <a href="/login" className="font-semibold text-cyan-300">Back to sign in</a>
                </p>
            </div>
        </div>
    );
}
