import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import AuthLayout from './AuthLayout.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(typeof body.detail === 'string' ? body.detail : 'Invalid credentials');
            }
            const data = await res.json();
            login(data.access_token);
            navigate('/planner');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout eyebrow="Welcome back" title="Sign in to Journey" description="Pick up where you left off. Your trips, preferences, and travel journal are waiting.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">Email<input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label className="auth-label">Password<input className="auth-input" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                {error && <div className="auth-error">{error}</div>}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button className="auth-button disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
                    <Link className="text-sm font-semibold text-[#ef775b]" to="/forgot">Forgot password?</Link>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                New to Journey? <Link to="/signup" className="font-bold text-[#ef775b]">Create an account</Link>
            </p>
        </AuthLayout>
    );
}
