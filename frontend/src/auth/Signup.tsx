import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import AuthLayout from './AuthLayout.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${apiBaseUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error('Signup failed');
            const data = await res.json();
            login(data.access_token);
            navigate('/planner');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        }
    }

    return (
        <AuthLayout eyebrow="Create your account" title="Start planning beautifully" description="Save your India trips, remember your preferences, and let the assistant adapt every day to you.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">Email<input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label className="auth-label">Password<input className="auth-input" placeholder="At least 8 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /></label>
                {error && <div className="auth-error">{error}</div>}
                <div className="pt-2">
                    <button className="auth-button w-full" type="submit">Create account</button>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                Already have an account? <a href="/login" className="font-bold text-[#ef775b]">Sign in</a>
            </p>
        </AuthLayout>
    );
}
