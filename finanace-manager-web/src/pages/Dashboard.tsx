import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Calendar,
    Activity,
    PlusCircle,
    BarChart3
} from 'lucide-react';
import { getIncomes, getExpenses } from '../api/financeApi';
import { getUpcomingBills } from '../api/recurringApi';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        recentActivity: [] as any[],
        upcomingBills: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [incomes, expenses] = await Promise.all([getIncomes(), getExpenses()]);

            const totalInc = incomes?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
            const totalExp = expenses?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;

            // Combine and sort for recent activity
            const combined = [
                ...(incomes || []).map((i: any) => ({ ...i, type: 'income' })),
                ...(expenses || []).map((e: any) => ({ ...e, type: 'expense' }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const upcoming = await getUpcomingBills();

            setStats({
                totalIncome: totalInc,
                totalExpense: totalExp,
                balance: totalInc - totalExp,
                recentActivity: combined.slice(0, 5),
                upcomingBills: upcoming || []
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="dashboard-loading">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p>Analyzing your performance...</p>
        </div>
    );

    const cards = [
        {
            title: 'Available Balance',
            amount: stats.balance,
            icon: <Wallet size={24} />,
            color: 'balance',
            subtitle: 'Real-time cash flow'
        },
        {
            title: 'Total Revenue',
            amount: stats.totalIncome,
            icon: <TrendingUp size={24} />,
            color: 'income',
            subtitle: 'All time earnings',
            trend: <ArrowUpRight size={16} />
        },
        {
            title: 'Total Spending',
            amount: stats.totalExpense,
            icon: <TrendingDown size={24} />,
            color: 'expense',
            subtitle: 'All time costs',
            trend: <ArrowDownRight size={16} />
        }
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header-premium">
                <div className="header-content">
                    <h1>Executive Overview</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <div className="header-date">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </header>

            {stats.upcomingBills.length > 0 && (
                <div className="upcoming-alert-banner">
                    <div className="alert-content">
                        <TrendingDown size={20} />
                        <span>You have <strong>{stats.upcomingBills.length}</strong> bills due this week.</span>
                    </div>
                    <Link to="/bills" className="btn-alert-action">Pay Now</Link>
                </div>
            )}

            <div className="stats-grid-premium">
                {cards.map((card, idx) => (
                    <div key={idx} className={`stat-card-premium ${card.color}`}>
                        <div className="card-flare"></div>
                        <div className="stat-card-header">
                            <div className="icon-wrapper">
                                {card.icon}
                            </div>
                            {card.trend && <div className="trend-badge">{card.trend}</div>}
                        </div>
                        <div className="stat-card-body">
                            <span>{card.title}</span>
                            <h3>${card.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <p>{card.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid-layout">
                <div className="activity-section glass-card-premium">
                    <div className="section-header">
                        <div className="title-with-icon">
                            <Activity size={20} className="text-primary" />
                            <h3>Recent Activity</h3>
                        </div>
                        <Link to="/income" className="view-all">See All</Link>
                    </div>
                    <div className="activity-list">
                        {stats.recentActivity.length === 0 ? (
                            <div className="empty-activity">
                                <p>No recent transactions to display.</p>
                            </div>
                        ) : (
                            stats.recentActivity.map((item, idx) => (
                                <div key={idx} className="activity-item">
                                    <div className={`activity-icon-sm ${item.type}`}>
                                        {item.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    </div>
                                    <div className="activity-details">
                                        <span className="activity-source">{item.source || item.category}</span>
                                        <span className="activity-date">{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`activity-amount ${item.type}`}>
                                        {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="actions-section glass-card-premium">
                    <div className="section-header">
                        <div className="title-with-icon">
                            <PlusCircle size={20} className="text-primary" />
                            <h3>Quick Actions</h3>
                        </div>
                    </div>
                    <div className="action-grid-premium">
                        <Link to="/income" className="quick-action-card income">
                            <TrendingUp size={24} />
                            <span>Add Income</span>
                        </Link>
                        <Link to="/expense" className="quick-action-card expense">
                            <TrendingDown size={24} />
                            <span>Add Expense</span>
                        </Link>
                    </div>
                    <div className="premium-upsell-card mt-4">
                        <BarChart3 size={32} className="text-secondary mb-2" />
                        <h4>Premium Insights</h4>
                        <p>Unlock detailed category analysis and GST summaries.</p>
                        <Link to="/analytics" className="btn-alert-action w-full text-center mt-2">
                            View Analytics
                        </Link>
                    </div>
                    <div className="tips-card mt-4">
                        <h4>Pro Tip</h4>
                        <p>Regularly tracking your expenses helps identifying unnecessary costs early.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
