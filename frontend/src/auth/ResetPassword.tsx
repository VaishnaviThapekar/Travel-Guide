import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.tsx';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api');

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token') || '';
    const [token, setToken] = useState(tokenFromUrl);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;
        setError('');
        setStatus(null);

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${apiBaseUrl}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token.trim(), password }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(typeof body.detail === 'string' ? body.detail : 'Invalid or expired reset token');
            }
            setStatus('Password has been reset successfully! Redirecting to sign in...');
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password reset failed');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout eyebrow="Choose a new password" title="Reset your password" description="Enter your reset token and pick a new secure password for your Journey account.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="auth-label">
                    Reset Token
                    <input
                        className="auth-input text-xs"
                        placeholder="Paste reset token here"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                </label>
                <label className="auth-label">
                    New Password
                    <input
                        className="auth-input"
                        placeholder="At least 8 characters"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                <label className="auth-label">
                    Confirm Password
                    <input
                        className="auth-input"
                        placeholder="Re-enter new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                {error && <div className="auth-error">{error}</div>}
                {status && <div className="auth-status">{status}</div>}
                <div className="pt-2">
                    <button
                        className="auth-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Resetting password...' : 'Update password'}
                    </button>
                </div>
            </form>
            <p className="mt-8 text-sm text-[#69727c]">
                Remember your password? <Link to="/login" className="font-bold text-[#ef775b]">Sign in</Link>
            </p>
        </AuthLayout>
    );
}
