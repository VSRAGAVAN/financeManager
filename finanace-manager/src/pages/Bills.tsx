import React, { useEffect, useState } from 'react';
import { getBills, createBill, deleteBill, updateBill, getUpcomingBills } from '../api/recurringApi';
import { Plus, Trash2, Calendar, DollarSign, Bell, CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './FinancePages.css';

const Bills: React.FC = () => {
    const [bills, setBills] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        title: '',
        dueDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const [allBills, upcomingBills] = await Promise.all([
                getBills(),
                getUpcomingBills()
            ]);
            setBills(allBills || []);
            setUpcoming(upcomingBills || []);
        } catch (err) {
            toast.error('Failed to load bills');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createBill({ ...formData, amount: parseFloat(formData.amount) });
            setFormData({ amount: '', title: '', dueDate: new Date().toISOString().split('T')[0] });
            setShowAdd(false);
            await fetchBills();
            toast.success('Bill reminder set');
        } catch (err) {
            toast.error('Failed to add bill');
        } finally {
            setActionLoading(false);
        }
    };

    const togglePaid = async (bill: any) => {
        try {
            await updateBill(bill.id, { isPaid: !bill.isPaid });
            await fetchBills();
            toast.success(bill.isPaid ? 'Marked as unpaid' : 'Bill marked as paid');
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBill(id);
            await fetchBills();
            toast.success('Bill deleted');
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return (
        <div className="loading-container">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Gathering your bills...</p>
        </div>
    );

    return (
        <div className="finance-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Bill Reminders</h1>
                    <p>Track your upcoming payments and avoid late fees</p>
                </div>
                <button className="btn-primary main-add-btn" onClick={() => setShowAdd(true)}>
                    <Plus size={20} />
                    <span>New Bill</span>
                </button>
            </div>

            <div className="bills-container">
                <div className="upcoming-section glass-card">
                    <div className="section-header">
                        <Bell className="text-primary" size={24} />
                        <h3>Upcoming this Week</h3>
                    </div>
                    {upcoming.length === 0 ? (
                        <p className="no-bills">No bills due this week. You're all caught up!</p>
                    ) : (
                        upcoming.map((bill: any) => (
                            <div key={bill.id} className="upcoming-item">
                                <div className="bill-info">
                                    <span className="bill-title">{bill.title}</span>
                                    <span className="bill-date">{new Date(bill.dueDate).toLocaleDateString()}</span>
                                </div>
                                <span className="bill-amount">${bill.amount}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="data-card table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Title</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill: any) => (
                                <tr key={bill.id} className={bill.isPaid ? 'row-paid' : ''}>
                                    <td>
                                        <button
                                            className={`status-chip ${bill.isPaid ? 'chip-success' : 'chip-warning'}`}
                                            onClick={() => togglePaid(bill)}
                                        >
                                            {bill.isPaid ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {bill.isPaid ? 'Paid' : 'Pending'}
                                        </button>
                                    </td>
                                    <td className="font-semibold">{bill.title}</td>
                                    <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                                    <td className="font-bold">${bill.amount}</td>
                                    <td className="text-right">
                                        <button className="btn-icon-danger" onClick={() => handleDelete(bill.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h3>Add Bill Reminder</h3>
                        </div>
                        <form onSubmit={handleAdd} className="finance-form">
                            <div className="form-group">
                                <label>Bill Title</label>
                                <div className="input-with-icon">
                                    <Bell size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Electricity Bill"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
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
                                <label>Due Date</label>
                                <div className="input-with-icon">
                                    <Calendar size={18} />
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={actionLoading}>
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : 'Add Reminder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bills;
