import React, { useContext, useMemo, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { motion } from 'framer-motion';

export const Analytics = () => {
    const { transactions } = useContext(GlobalContext);
    const [year, setYear] = useState(new Date().getFullYear());

    // 1. Smart Categorization Logic
    const categoryData = useMemo(() => {
        const categories = {
            'Food & Dining': ['food', 'grocery', 'dinner', 'lunch', 'breakfast', 'restaurant', 'cafe', 'coffee'],
            'Transportation': ['uber', 'lyft', 'taxi', 'bus', 'train', 'fuel', 'gas', 'ticket'],
            'Utilities': ['bill', 'electricity', 'water', 'internet', 'phone', 'mobile', 'subscription'],
            'Entertainment': ['movie', 'netflix', 'game', 'concert', 'spotify', 'music'],
            'Shopping': ['cloth', 'shoe', 'amazon', 'store', 'buy'],
            'Income': ['salary', 'freelance', 'paycheck', 'bonus', 'deposit']
        };

        const result = {};

        transactions.forEach(t => {
            if (t.amount > 0) return; // Skip income for expense categorization (or handle separately)

            const text = t.text.toLowerCase();
            let matched = false;
            const amount = Math.abs(t.amount);

            for (const [cat, keywords] of Object.entries(categories)) {
                if (cat === 'Income') continue;
                if (keywords.some(k => text.includes(k))) {
                    result[cat] = (result[cat] || 0) + amount;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                result['Others'] = (result['Others'] || 0) + amount;
            }
        });

        return Object.entries(result)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // 2. Monthly Comparison (Bar Chart)
    const monthlyData = useMemo(() => {
        const months = eachMonthOfInterval({
            start: startOfYear(new Date(year, 0, 1)),
            end: endOfYear(new Date(year, 0, 1))
        });

        return months.map(month => {
            const monthTransactions = transactions.filter(t =>
                isSameMonth(new Date(t.date), month)
            );

            const income = monthTransactions
                .filter(t => t.amount > 0)
                .reduce((acc, t) => acc + t.amount, 0);

            const expense = Math.abs(monthTransactions
                .filter(t => t.amount < 0)
                .reduce((acc, t) => acc + t.amount, 0));

            return {
                name: format(month, 'MMM'),
                Income: income,
                Expense: expense
            };
        });
    }, [transactions, year]);

    const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#64748b'];

    return (
        <div className="space-y-8 pb-10">
            <header className="flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold text-[var(--text-main)]">Analytics</h2>
                    <p className="text-[var(--text-muted)]">Deep dive into your financial data</p>
                </motion.div>

                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2">
                    <select
                        value={year}
                        onChange={e => setYear(parseInt(e.target.value))}
                        className="bg-transparent outline-none font-medium"
                    >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categorization Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 min-h-[400px]"
                >
                    <h3 className="text-lg font-semibold mb-4">Expense Categories <span className="text-xs font-normal text-[var(--text-muted)]">(Inferred)</span></h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    formatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                            Not enough data to categorize
                        </div>
                    )}
                </motion.div>

                {/* Monthly Comparison Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6 min-h-[400px]"
                >
                    <h3 className="text-lg font-semibold mb-4">Monthly Comparison ({year})</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-hover)' }}
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Trend Area Chart (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6 lg:col-span-2 min-h-[400px]"
                >
                    <h3 className="text-lg font-semibold mb-4">Financial Health Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Income"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#colorIncome)"
                                name="Income Trend"
                            />
                            <Area
                                type="monotone"
                                dataKey="Expense"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fill="transparent"
                                name="Expense Trend"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};
