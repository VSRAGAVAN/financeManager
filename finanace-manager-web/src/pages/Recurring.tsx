import React, { useEffect, useState } from 'react';
import { getRecurringTransactions, createRecurringTransaction, deleteRecurringTransaction, getSubscriptionSuggestions } from '../api/recurringApi';
import { Plus, Trash2, Calendar, DollarSign, Repeat, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './FinancePages.css';

const Recurring: React.FC = () => {
    const [recurring, setRecurring] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        type: 'SUBSCRIPTION',
        nextDueDate: new Date().toISOString().split('T')[0],
        totalAmount: '',
        paidAmount: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recurringData, suggestionsData] = await Promise.all([
                getRecurringTransactions(),
                getSubscriptionSuggestions()
            ]);
            setRecurring(recurringData || []);
            setSuggestions(suggestionsData || []);
        } catch (err) {
            toast.error('Failed to load recurring finances');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createRecurringTransaction({
                ...formData,
                amount: parseFloat(formData.amount),
                totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : null,
                paidAmount: formData.paidAmount ? parseFloat(formData.paidAmount) : null
            });
            setFormData({ amount: '', description: '', type: 'SUBSCRIPTION', nextDueDate: new Date().toISOString().split('T')[0], totalAmount: '', paidAmount: '' });
            setShowAdd(false);
            await fetchData();
            toast.success('Recurring transaction added');
        } catch (err) {
            toast.error('Failed to add transaction');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const toastId = toast.loading('Removing...');
        try {
            await deleteRecurringTransaction(id);
            await fetchData();
            toast.success('Removed successfully', { id: toastId });
        } catch (err) {
            toast.error('Failed to remove', { id: toastId });
        }
    };

    const convertSuggestion = (suggestion: any) => {
        setFormData({
            amount: suggestion.amount.toString(),
            description: suggestion.category,
            type: 'SUBSCRIPTION',
            nextDueDate: new Date().toISOString().split('T')[0],
            totalAmount: '',
            paidAmount: ''
        });
        setShowAdd(true);
    };

    if (loading) return (
        <div className="loading-container">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Scanning your subscriptions...</p>
        </div>
    );

    return (
        <div className="finance-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Recurring Finances</h1>
                    <p>Manage your Subscriptions, EMIs, and Rent payments</p>
                </div>
                <button className="btn-primary main-add-btn" onClick={() => setShowAdd(true)}>
                    <Plus size={20} />
                    <span>New recurring</span>
                </button>
            </div>

            {suggestions.length > 0 && (
                <div className="suggestions-banner glass-card">
                    <div className="suggestion-header">
                        <Sparkles className="text-warning" size={24} />
                        <h3>Smart Subscription Detection</h3>
                    </div>
                    <p>We found expenses that look like subscriptions. Would you like to track them?</p>
                    <div className="suggestions-list">
                        {suggestions.map((s: any, i) => (
                            <div key={i} className="suggestion-item">
                                <div className="suggestion-info">
                                    <span className="suggestion-name">{s.category}</span>
                                    <span className="suggestion-amount">${s.amount}</span>
                                </div>
                                <button className="btn-ghost btn-sm" onClick={() => convertSuggestion(s)}>
                                    Track <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="recurring-grid">
                {['SUBSCRIPTION', 'EMI', 'RENT'].map(type => (
                    <div key={type} className="recurring-section">
                        <h3 className="section-title">{type} Tracking</h3>
                        <div className="data-card table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Next Due</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recurring.filter((r: any) => r.type === type).length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="empty-state">No {type.toLowerCase()} found</td>
                                        </tr>
                                    ) : (
                                        recurring.filter((r: any) => r.type === type).map((item: any) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="desc-cell">
                                                        <span className="main-desc">{item.description}</span>
                                                        {item.type === 'EMI' && item.totalAmount > 0 && (
                                                            <div className="emi-progress-container">
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress-fill"
                                                                        style={{ width: `${Math.min((item.paidAmount / item.totalAmount) * 100, 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="progress-text">
                                                                    ${item.paidAmount} of ${item.totalAmount}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="amount-cell font-bold">${item.amount}</td>
                                                <td className="date-cell">{new Date(item.nextDueDate).toLocaleDateString()}</td>
                                                <td className="text-right">
                                                    <button className="btn-icon-danger" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h3>Add Recurring Transaction</h3>
                        </div>
                        <form onSubmit={handleAdd} className="finance-form">
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="custom-select"
                                >
                                    <option value="SUBSCRIPTION">Subscription</option>
                                    <option value="EMI">EMI</option>
                                    <option value="RENT">Rent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <div className="input-with-icon">
                                    <Repeat size={18} />
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Next Due Date</label>
                                <div className="input-with-icon">
                                    <Calendar size={18} />
                                    <input
                                        type="date"
                                        value={formData.nextDueDate}
                                        onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            {formData.type === 'EMI' && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Total Amount ($)</label>
                                        <input
                                            type="number"
                                            value={formData.totalAmount}
                                            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                                            placeholder="Total loan/EMI"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Amount Paid ($)</label>
                                        <input
                                            type="number"
                                            value={formData.paidAmount}
                                            onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                                            placeholder="Already paid"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recurring;
