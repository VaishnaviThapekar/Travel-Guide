import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error('Invalid credentials');
            const data = await res.json();
            login(data.access_token);
            navigate('/planner');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,#020817,#111827_35%,#0f172a)] px-4 py-10 text-slate-100">
            <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-black text-slate-950">A</div>
                    <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Welcome back</p>
                    <h2 className="mt-3 text-3xl font-bold text-white">Sign in</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <button className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]" type="submit">Sign in</button>
                        <a className="text-sm text-slate-300 transition hover:text-white" href="/forgot">Forgot?</a>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-300">
                    Need an account? <a href="/signup" className="font-semibold text-cyan-300">Create one</a>
                </p>
            </div>
        </div>
    );
}
