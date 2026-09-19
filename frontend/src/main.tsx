import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import LandingPage from './LandingPage.tsx';
import './index.css';
import { AuthProvider } from './auth/AuthContext.tsx';
import Login from './auth/Login.tsx';
import Signup from './auth/Signup.tsx';
import ForgotPassword from './auth/ForgotPassword.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/planner" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
);
