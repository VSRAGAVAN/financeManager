import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../api/userApi';
import { UserPlus, Trash2, Mail, Shield, User, Loader2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './FinancePages.css';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data || []);
        } catch (err) {
            toast.error('Failed to load users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (id === currentUser?.userId) {
            toast.error("You cannot delete yourself!");
            return;
        }

        const toastId = toast.loading('Removing user...');
        try {
            await deleteUser(id);
            await fetchUsers();
            toast.success('User removed successfully', { id: toastId });
        } catch (err) {
            toast.error('Failed to delete user', { id: toastId });
            console.error('Error deleting user:', err);
        }
    };

    const filteredUsers = users.filter((u: any) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && users.length === 0) return (
        <div className="loading-container">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Managing your team...</p>
        </div>
    );

    return (
        <div className="finance-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>User Management</h1>
                    <p>Control who has access to your financial data</p>
                </div>
                <button className="btn-primary main-add-btn">
                    <UserPlus size={20} />
                    <span>Add New User</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-card table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Team Member</th>
                            <th>Role & Access</th>
                            <th>Contact Info</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty-state">
                                    <div className="empty-content">
                                        <div className="empty-icon"><User size={48} /></div>
                                        <p>No users found matching your search.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((item: any) => (
                                <tr key={item.id} className="table-row-animate">
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm">{item.name?.[0] || <User size={14} />}</div>
                                            <div className="user-meta">
                                                <span className="font-semibold block">{item.name || 'Anonymous'}</span>
                                                {item.id === currentUser?.userId && <span className="badge-me">You</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${item.role.toLowerCase()}`}>
                                            <Shield size={12} />
                                            {item.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="icon-text text-muted">
                                            <Mail size={14} />
                                            <span className="text-sm">{item.email}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="btn-icon-danger"
                                            onClick={() => handleDelete(item.id)}
                                            disabled={item.id === currentUser?.userId}
                                            title={item.id === currentUser?.userId ? "You cannot delete yourself" : "Delete User"}
                                        >
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

export default UsersPage;
