import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, TrendingUp } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate network delay for feel
        setTimeout(() => {
            const result = login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex bg-[var(--bg-main)]">
            {/* Left Side - Hero / Branding */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Expensr</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Take Control of Your <br />
                        <span className="text-white/90">Financial Future</span>
                    </h1>
                    <p className="text-lg text-white/80 mb-8">
                        Track expenses, visualize trends, and reach your saving goals with our intuitive dashboard.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-gray-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full bg-white/10" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="font-bold text-sm">10k+ Users</span>
                            <span className="text-xs text-white/70">Trust Expensr daily</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/40">
                    © 2026 Expensr Inc. All rights reserved.
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-[var(--text-main)]">Welcome back</h2>
                        <p className="mt-2 text-[var(--text-muted)]">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium flex items-center justify-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-main)] ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-10 bg-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-[var(--text-main)]">Password</label>
                                <a href="#" className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-10 bg-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full py-3.5 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[var(--border)]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[var(--bg-main)] px-2 text-[var(--text-muted)]">Or continue with</span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-[var(--text-muted)]">
                        Don't have an account? {' '}
                        <Link to="/register" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] hover:underline">
                            Sign up for free
                        </Link>
                    </p>

                    <div className="mt-8 pt-6 border-t border-[var(--border)] text-center bg-[var(--bg-card)]/50 p-4 rounded-lg">
                        <p className="text-xs text-[var(--text-muted)] mb-1">Demo Credentials:</p>
                        <code className="text-xs bg-[var(--bg-hover)] px-2 py-1 rounded text-[var(--text-main)] font-mono">demo@example.com</code>
                        <span className="mx-2 text-[var(--text-muted)]">/</span>
                        <code className="text-xs bg-[var(--bg-hover)] px-2 py-1 rounded text-[var(--text-main)] font-mono">password</code>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
