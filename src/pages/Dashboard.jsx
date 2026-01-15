import React, { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { useAuth } from '../context/AuthContext';
import { TransactionForm } from '../components/TransactionForm';
import { DashboardChart } from '../components/DashboardChart';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Download, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { format, isSameMonth, isSameYear, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

export const Dashboard = () => {
    const { transactions } = useContext(GlobalContext);
    const { user } = useAuth();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 0-11

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const date = new Date(t.date);
            const yearMatch = date.getFullYear() === parseInt(selectedYear);
            const monthMatch = selectedMonth === 'all' || date.getMonth() === parseInt(selectedMonth);
            return yearMatch && monthMatch;
        });
    }, [transactions, selectedYear, selectedMonth]);

    // Stats Logic
    const amounts = filteredTransactions.map(t => t.amount);
    const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    // Highest Monthly Expense Calculation
    const highestMonthlyExpense = useMemo(() => {
        const expenses = transactions.filter(t => t.amount < 0);
        const monthlyExpenses = {};

        expenses.forEach(t => {
            const monthKey = format(new Date(t.date), 'MMM yyyy');
            monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + Math.abs(t.amount);
        });

        let max = 0;
        let month = 'N/A';

        Object.entries(monthlyExpenses).forEach(([key, val]) => {
            if (val > max) {
                max = val;
                month = key;
            }
        });

        return { amount: max.toFixed(2), month };
    }, [transactions]);


    const handleExport = (type) => {
        const dataToExport = filteredTransactions.map(({ id, text, amount, date }) => ({
            Date: format(new Date(date), 'yyyy-MM-dd'),
            Title: text,
            Amount: amount,
            Type: amount > 0 ? 'Income' : 'Expense'
        }));

        if (type === 'csv') exportToCSV(dataToExport);
        else exportToJSON(dataToExport);
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-[var(--text-main)]"
                    >
                        Dashboard
                    </motion.h2>
                    <p className="text-[var(--text-muted)]">Welcome back, {user?.firstName}!</p>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2">
                        <Calendar size={16} className="text-[var(--text-muted)]" />
                        <select
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium"
                        >
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2">
                        <Filter size={16} className="text-[var(--text-muted)]" />
                        <select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium"
                        >
                            <option value="all">All Months</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i}>{format(new Date(2026, i, 1), 'MMMM')}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => handleExport('csv')}
                        className="btn bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-hover)] text-[var(--text-main)] px-3 py-2"
                        title="Export CSV"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Total Balance"
                    amount={totalBalance}
                    icon={Wallet}
                    color="text-indigo-500"
                    bgColor="bg-indigo-500/10"
                    delay={0.1}
                />
                <Card
                    title="Income"
                    amount={income}
                    icon={ArrowUpCircle}
                    color="text-green-500"
                    bgColor="bg-green-500/10"
                    delay={0.2}
                />
                <Card
                    title="Expenses"
                    amount={expense}
                    icon={ArrowDownCircle}
                    color="text-red-500"
                    bgColor="bg-red-500/10"
                    delay={0.3}
                />
                <Card
                    title={`Highest (${highestMonthlyExpense.month})`}
                    amount={highestMonthlyExpense.amount}
                    icon={ArrowDownCircle}
                    color="text-orange-500"
                    bgColor="bg-orange-500/10"
                    delay={0.4}
                />
            </div>

            {/* Charts & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <DashboardChart transactions={filteredTransactions} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="sticky top-[100px]">
                        <TransactionForm />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const Card = ({ title, amount, icon: Icon, color, bgColor, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="card p-6 flex items-start justify-between hover:shadow-md transition-shadow"
    >
        <div>
            <p className="text-[var(--text-muted)] text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">₹{amount}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
            <Icon size={24} />
        </div>
    </motion.div>
)
