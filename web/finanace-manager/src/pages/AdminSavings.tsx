import React, { useEffect, useState } from 'react';
import {
    PiggyBank,
    Search
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminSavings.css';
import './FinancePages.css';

interface SavingsDeposit {
    id: number;
    principal: number;
    interestRate: number;
    durationMonths: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    interestAmount: number;
    totalAmount: number;
    user: {
        name: string;
        email: string;
    };
    createdAt: string;
}

const AdminSavings: React.FC = () => {
    const [deposits, setDeposits] = useState<SavingsDeposit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/savings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeposits(response.data);
        } catch (error) {
            toast.error('Failed to fetch savings deposits');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await axios.patch(`http://localhost:5000/savings/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Deposit ${newStatus.toLowerCase()} successfully`);
            fetchDeposits();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredDeposits = deposits.filter(d =>
        d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading-container">Loading savings deposits...</div>;
    }

    return (
        <div className="finance-page admin-savings-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Manage Savings</h1>
                    <p>Review and process user savings applications.</p>
                </div>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Principal</th>
                            <th>ROI</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Maturity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeposits.map((deposit) => (
                            <tr key={deposit.id} className="table-row-animate">
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar-sm">{deposit.user.name[0]}</div>
                                        <div>
                                            <div className="main-desc">{deposit.user.name}</div>
                                            <div className="progress-text">{deposit.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="amount-cell">₹{deposit.principal.toLocaleString()}</td>
                                <td>{deposit.interestRate}%</td>
                                <td>{deposit.durationMonths} Months</td>
                                <td>
                                    <span className={`status-badge ${deposit.status.toLowerCase()}`}>
                                        {deposit.status}
                                    </span>
                                </td>
                                <td className="amount-cell">₹{deposit.totalAmount.toLocaleString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        {deposit.status === 'PENDING' && (
                                            <>
                                                <button
                                                    className="btn-action-sm btn-accept"
                                                    onClick={() => handleUpdateStatus(deposit.id, 'ACCEPTED')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn-action-sm btn-reject"
                                                    onClick={() => handleUpdateStatus(deposit.id, 'REJECTED')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {deposit.status === 'ACCEPTED' && (
                                            <button
                                                className="btn-action-sm btn-accept"
                                                onClick={() => handleUpdateStatus(deposit.id, 'COMPLETED')}
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDeposits.length === 0 && (
                    <div className="empty-content">
                        <PiggyBank size={48} className="empty-icon" />
                        <p>No savings applications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSavings;
