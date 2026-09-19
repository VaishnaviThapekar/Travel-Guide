import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import AuthLayout from './AuthLayout.tsx';

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
        <AuthLayout eyebrow="Welcome back" title="Sign in to Journey" description="Pick up where you left off. Your trips, preferences, and travel journal are waiting.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">Email<input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label className="auth-label">Password<input className="auth-input" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                {error && <div className="auth-error">{error}</div>}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button className="auth-button" type="submit">Sign in</button>
                    <a className="text-sm font-semibold text-[#ef775b]" href="/forgot">Forgot password?</a>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                New to Journey? <a href="/signup" className="font-bold text-[#ef775b]">Create an account</a>
            </p>
        </AuthLayout>
    );
}
