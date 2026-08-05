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
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">Forgot password</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {status && <div className="text-sm text-slate-700">{status}</div>}
                <div className="flex justify-end">
                    <button className="rounded bg-ink px-4 py-2 text-white" type="submit">Request reset</button>
                </div>
            </form>
        </div>
    );
}
