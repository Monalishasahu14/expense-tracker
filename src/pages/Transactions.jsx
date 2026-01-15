import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const Transactions = () => {
    const { transactions, deleteTransaction } = useContext(GlobalContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, income, expense

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all'
            ? true
            : filterType === 'income' ? t.amount > 0 : t.amount < 0;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-main)]">Transactions</h2>
                    <p className="text-[var(--text-muted)]">Manage your history.</p>
                </div>
            </header>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-4 items-center mb-8">
                <div className="flex items-center gap-2 flex-1 bg-[var(--bg-main)] px-4 py-3 rounded-lg w-full">
                    <Search size={18} className="text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-[var(--text-main)] placeholder-[var(--text-muted)]"
                    />
                </div>
                <div className="flex items-center gap-2 bg-[var(--bg-main)] px-4 py-3 rounded-lg w-full sm:w-auto">
                    <Filter size={18} className="text-[var(--text-muted)]" />
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="bg-transparent border-none outline-none text-[var(--text-main)] cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredTransactions.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            layout
                            className="card p-4 flex justify-between items-center group hover:border-[var(--primary)]/30 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                                ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {t.amount > 0 ? '+' : '-'}
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--text-main)]">{t.text}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    ${Math.abs(t.amount).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(t.id)}
                                    className="p-2 rounded-full text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {filteredTransactions.length === 0 && (
                    <div className="text-center py-10 text-[var(--text-muted)]">
                        No transactions found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
