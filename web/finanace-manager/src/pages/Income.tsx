import React, { useEffect, useState } from 'react';
import { getIncomes, createIncome, deleteIncome } from '../api/financeApi';
import { Plus, Trash2, Calendar, DollarSign, Tag, Loader2, Search, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import './FinancePages.css';

const Income: React.FC = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const data = await getIncomes();
            setIncomes(data || []);
        } catch (err) {
            toast.error('Failed to load income records');
            console.error('Error fetching incomes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        const toastId = toast.loading('Adding income...');
        try {
            await createIncome({ ...formData, amount: parseFloat(formData.amount) });
            setFormData({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });
            setShowAdd(false);
            await fetchIncomes();
            toast.success('Income added successfully', { id: toastId });
        } catch (err) {
            toast.error('Failed to add income', { id: toastId });
            console.error('Error creating income:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const toastId = toast.loading('Deleting record...');
        try {
            await deleteIncome(id);
            await fetchIncomes();
            toast.success('Record deleted', { id: toastId });
        } catch (err) {
            toast.error('Failed to delete record', { id: toastId });
            console.error('Error deleting income:', err);
        }
    };

    const filteredIncomes = incomes.filter((item: any) =>
        item.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && incomes.length === 0) return (
        <div className="loading-container">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Loading your finances...</p>
        </div>
    );

    return (
        <div className="finance-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Income Streams</h1>
                    <p>Monitor your revenue and business growth</p>
                </div>
                <button className="btn-primary main-add-btn" onClick={() => setShowAdd(true)}>
                    <Plus size={20} />
                    <span>New Income</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search sources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h3>Add Income</h3>
                            <p>Enter the details of your new revenue source</p>
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
                                <label>Source Name</label>
                                <div className="input-with-icon">
                                    <Tag size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Client Project X"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Transaction Date</label>
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
                                <button type="submit" className="btn-primary" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Record Income'}
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
                            <th>Source</th>
                            <th>Amount</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncomes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-state">
                                    <div className="empty-content">
                                        <div className="empty-icon"><TrendingUp size={48} /></div>
                                        <p>No income records found.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredIncomes.map((item: any) => (
                                <tr key={item.id} className="table-row-animate">
                                    <td className="date-cell">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td>
                                        <div className="source-cell">
                                            <div className="indicator-success"></div>
                                            <span className="font-semibold">{item.source}</span>
                                        </div>
                                    </td>
                                    <td className="amount-cell">
                                        <span className="text-success font-bold">+${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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

export default Income;
