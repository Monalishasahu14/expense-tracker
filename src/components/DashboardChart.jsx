import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { format } from 'date-fns';

export const DashboardChart = ({ transactions }) => {
    // 1. Trend Data (Area Chart) - Cumulative Balance over time or Daily Net
    const trendData = useMemo(() => {
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        return sorted.map(t => ({
            name: format(new Date(t.date), 'MMM d'),
            amount: t.amount,
            date: t.date
        }));
    }, [transactions]);

    // 2. Income vs Expense (Pie Chart)
    const pieData = useMemo(() => {
        const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
        const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));

        return [
            { name: 'Income', value: income },
            { name: 'Expense', value: expense }
        ].filter(d => d.value > 0);
    }, [transactions]);

    const COLORS = ['#10b981', '#ef4444']; // Emerald-500, Red-500

    // 3. Comparison (Bar Chart) - Grouped by day (or month if dataset is large, but simplifing for now)
    // We'll aggregate by Title for a "Top Categories" feel since we lack categories?
    // Or just group by day: Income vs Expense per day.
    const barData = useMemo(() => {
        const grouped = {};
        transactions.forEach(t => {
            const day = format(new Date(t.date), 'MMM d');
            if (!grouped[day]) grouped[day] = { name: day, income: 0, expense: 0 };
            if (t.amount > 0) grouped[day].income += t.amount;
            else grouped[day].expense += Math.abs(t.amount); // use positive for bar height
        });
        // Sort by date key (converting back to date for sort might be tricky, relying on transactions sort)
        return Object.values(grouped).sort((a, b) => { // Crude sort if keys are not sortable nicely
            // Better: Sort transactions first, then reduce.
            return 0;
        });
    }, [transactions]);

    // Better Bar Data Generation
    const properBarData = useMemo(() => {
        const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        const grouped = sorted.reduce((acc, t) => {
            const key = format(new Date(t.date), 'MMM d');
            const existing = acc.find(item => item.name === key);
            if (existing) {
                if (t.amount > 0) existing.income += t.amount;
                else existing.expense += Math.abs(t.amount);
            } else {
                acc.push({
                    name: key,
                    income: t.amount > 0 ? t.amount : 0,
                    expense: t.amount < 0 ? Math.abs(t.amount) : 0
                });
            }
            return acc;
        }, []);
        return grouped;
    }, [transactions]);


    if (transactions.length === 0) {
        return (
            <div className="card h-[300px] flex items-center justify-center text-[var(--text-muted)]">
                No data for selected period
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Row 1: Net Trend */}
            <div className="card h-[350px] p-6">
                <h3 className="text-lg font-semibold mb-6">Net Trend</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-main)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="var(--primary)" fill="url(#colorAmount)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Row 2: Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="card h-[350px] p-6">
                    <h3 className="text-lg font-semibold mb-2">Income vs Expense</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="card h-[350px] p-6">
                    <h3 className="text-lg font-semibold mb-2">Daily Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={properBarData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <Tooltip
                                cursor={{ fill: 'var(--bg-hover)' }}
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
