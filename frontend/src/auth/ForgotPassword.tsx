import React, { useState } from 'react';
import AuthLayout from './AuthLayout.tsx';

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
        <AuthLayout eyebrow="Reset access" title="Find your way back" description="Enter your email and we’ll start the reset process for your Journey account.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">Email<input className="auth-input" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                {status && <div className="auth-status">{status}</div>}
                <div className="pt-2">
                    <button className="auth-button w-full" type="submit">Request reset</button>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                <a href="/login" className="font-bold text-[#ef775b]">← Back to sign in</a>
            </p>
        </AuthLayout>
    );
}
