import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export const Sidebar = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/transactions', icon: Receipt, label: 'Transactions' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <aside className="fixed top-0 left-0 w-[280px] h-screen bg-[var(--bg-card)] border-r border-[var(--border)] hidden md:flex flex-col p-6 z-20 transition-colors duration-300">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Receipt size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">Expensr</h1>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? 'bg-[var(--bg-hover)] text-[var(--primary)]'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-[var(--text-main)]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
