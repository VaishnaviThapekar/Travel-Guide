import React, { createContext, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'auth_token';

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    const login = (t: string) => setToken(t);
    const logout = () => setToken(null);

    return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export function authHeader() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export default AuthContext;
