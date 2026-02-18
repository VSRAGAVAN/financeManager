import React, { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../api/financeApi';
import { Plus, Trash2, Calendar, DollarSign, Tag, Loader2, Search, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import './FinancePages.css';

const Expense: React.FC = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ amount: '', category: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await getExpenses();
            setExpenses(data || []);
        } catch (err) {
            toast.error('Failed to load expense records');
            console.error('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        const toastId = toast.loading('Recording expense...');
        try {
            await createExpense({ ...formData, amount: parseFloat(formData.amount) });
            setFormData({ amount: '', category: '', date: new Date().toISOString().split('T')[0] });
            setShowAdd(false);
            await fetchExpenses();
            toast.success('Expense recorded', { id: toastId });
        } catch (err) {
            toast.error('Failed to save expense', { id: toastId });
            console.error('Error creating expense:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const toastId = toast.loading('Deleting record...');
        try {
            await deleteExpense(id);
            await fetchExpenses();
            toast.success('Record removed', { id: toastId });
        } catch (err) {
            toast.error('Failed to delete expense', { id: toastId });
            console.error('Error deleting expense:', err);
        }
    };

    const filteredExpenses = expenses.filter((item: any) =>
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && expenses.length === 0) return (
        <div className="loading-container">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Gathering your expenses...</p>
        </div>
    );

    return (
        <div className="finance-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Expense Tracking</h1>
                    <p>Keep your business spending under control</p>
                </div>
                <button className="btn-primary main-add-btn" onClick={() => setShowAdd(true)}>
                    <Plus size={20} />
                    <span>New Expense</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Filter categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h3>Record Expense</h3>
                            <p>Enter the details of your business expenditure</p>
                        </div>
                        <form onSubmit={handleAdd} className="finance-form">
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={18} />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <div className="input-with-icon">
                                    <Tag size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Office Rent, Marketing"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Expense Date</label>
                                <div className="input-with-icon">
                                    <Calendar size={18} />
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn-primary danger-btn" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="data-card table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-state">
                                    <div className="empty-content">
                                        <div className="empty-icon danger-icon"><TrendingDown size={48} /></div>
                                        <p>No expenses found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredExpenses.map((item: any) => (
                                <tr key={item.id} className="table-row-animate">
                                    <td className="date-cell">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td>
                                        <div className="source-cell">
                                            <div className="indicator-danger"></div>
                                            <span className="font-semibold">{item.category}</span>
                                        </div>
                                    </td>
                                    <td className="amount-cell">
                                        <span className="text-danger font-bold">-${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </td>
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
    );
};

export default Expense;
