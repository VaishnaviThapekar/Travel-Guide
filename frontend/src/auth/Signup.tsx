import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';
import AuthLayout from './AuthLayout.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

export default function Signup() {
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
            const res = await fetch(`${apiBaseUrl}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(typeof body.detail === 'string' ? body.detail : 'Signup failed');
            }
            const data = await res.json();
            login(data.access_token);
            navigate('/planner');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout eyebrow="Create your account" title="Start planning beautifully" description="Save your India trips, remember your preferences, and let the assistant adapt every day to you.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">Email<input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                <label className="auth-label">Password<input className="auth-input" placeholder="At least 8 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /></label>
                {error && <div className="auth-error">{error}</div>}
                <div className="pt-2">
                    <button className="auth-button w-full disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                Already have an account? <Link to="/login" className="font-bold text-[#ef775b]">Sign in</Link>
            </p>
        </AuthLayout>
    );
}
