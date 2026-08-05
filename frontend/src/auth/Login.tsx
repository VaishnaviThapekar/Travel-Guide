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
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    }

    return (
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">Sign in</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div className="flex justify-between">
                    <button className="rounded bg-ink px-4 py-2 text-white" type="submit">Sign in</button>
                    <a className="text-sm text-slate-600" href="/forgot">Forgot?</a>
                </div>
            </form>
        </div>
    );
}
