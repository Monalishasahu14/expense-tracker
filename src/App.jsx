import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GlobalProvider } from './context/GlobalState'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Analytics } from './pages/Analytics'
import { ProtectedRoute } from './components/ProtectedRoute'
import './styles/index.css'

function App() {
    return (
        <AuthProvider>
            <GlobalProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="transactions" element={<Transactions />} />
                                <Route path="analytics" element={<Analytics />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </GlobalProvider>
        </AuthProvider>
    )
}

export default App
