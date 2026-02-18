import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    Users,
    LogOut,
    Wallet,
    AlertCircle,
    Repeat,
    Bell,
    Sun,
    Moon,
    BarChart3,
    LifeBuoy,
    PiggyBank
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] },
        { name: 'Income', path: '/income', icon: <TrendingUp size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Expense', path: '/expense', icon: <TrendingDown size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] },
        { name: 'Recurring', path: '/recurring', icon: <Repeat size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Bills', path: '/bills', icon: <Bell size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF'] },
        { name: 'Savings Scheme', path: '/savings', icon: <PiggyBank size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] },
        { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['OWNER', 'ADMIN'] },
        { name: 'Support & Apps', path: '/support', icon: <LifeBuoy size={20} />, roles: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] },
        { name: 'Manage Savings', path: '/admin-savings', icon: <PiggyBank size={20} />, roles: ['OWNER', 'ADMIN'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-box">
                        <Wallet className="logo-icon" size={24} />
                    </div>
                    <span className="logo-text">Financely</span>
                </div>

                <nav className="sidebar-nav">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="nav-icon">{item.icon}</div>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">{user?.role?.[0]}</div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <p className="user-role">{user?.role}</p>
                        </div>
                    </div>
                    <div className="sidebar-footer-actions">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>
                        <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {showLogoutModal && (
                <div className="modal-overlay" style={{ zIndex: 2000 }}>
                    <div className="modal-content logout-modal">
                        <div className="modal-icon-danger">
                            <AlertCircle size={32} />
                        </div>
                        <h3>Sign Out?</h3>
                        <p>Are you sure you want to log out of your account?</p>
                        <div className="modal-actions">
                            <button className="btn-ghost" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button className="btn-danger-action" onClick={() => {
                                setShowLogoutModal(false);
                                logout();
                            }}>Yes, Log Out</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
