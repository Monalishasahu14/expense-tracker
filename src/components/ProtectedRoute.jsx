import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" />;
};
