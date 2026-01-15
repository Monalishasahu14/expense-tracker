import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        // In a real app, you'd validate against a backend
        const storedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        const account = storedAccounts.find(acc => acc.email === email && acc.password === password);

        if (account) {
            const userData = { ...account, password: undefined }; // Don't store password in session
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } else {
            // For demo purposes, allow a default login if no accounts exist yet or fallback
            if (email === 'demo@example.com' && password === 'password') {
                const demoUser = { firstName: 'Demo', lastName: 'User', email: 'demo@example.com' };
                setUser(demoUser);
                localStorage.setItem('user', JSON.stringify(demoUser));
                return { success: true };
            }
            return { success: false, message: 'Invalid credentials' };
        }
    };

    const register = (userData) => {
        const storedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        if (storedAccounts.find(acc => acc.email === userData.email)) {
            return { success: false, message: 'Email already exists' };
        }

        // Add new user
        const newAccounts = [...storedAccounts, userData];
        localStorage.setItem('accounts', JSON.stringify(newAccounts));

        // Auto login after register
        const { password, ...safeUser } = userData;
        setUser(safeUser);
        localStorage.setItem('user', JSON.stringify(safeUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
