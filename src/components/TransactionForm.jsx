import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Plus, X } from 'lucide-react';

export const TransactionForm = ({ onClose }) => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const { addTransaction } = useContext(GlobalContext);

    const onSubmit = e => {
        e.preventDefault();
        if (!text || !amount) return;

        const newTransaction = {
            id: Math.floor(Math.random() * 100000000),
            text,
            amount: +amount,
            date: new Date().toISOString()
        }
        addTransaction(newTransaction);
        setText('');
        setAmount('');
        if (onClose) onClose();
    }

    return (
        <div className="card p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                        <Plus size={18} />
                    </div>
                    Add New Transaction
                </h3>
                {/* Only show close button if passed (mobile modal case potentially) */}
                {onClose && (
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="text" className="text-sm font-medium ml-1">Description</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. Salary, Groceries..."
                        className="input"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium ml-1">
                        Amount <span className="text-xs text-[var(--text-muted)]">(negative for expense)</span>
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="input"
                    />
                </div>
                <button className="btn btn-primary w-full mt-2">
                    Add Transaction
                </button>
            </form>
        </div>
    )
}
