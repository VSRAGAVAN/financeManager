import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Download, FileText, FileSpreadsheet, Calculator, Lock,
    TrendingUp, TrendingDown, Zap, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsSummary, downloadPDF, downloadExcel, getGSTSummary } from '../api/financeApi';
import toast from 'react-hot-toast';
import './FinancePages.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [gstSummary, setGstSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const isPremium = user?.plan === 'PREMIUM';

    useEffect(() => {
        if (isPremium) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [isPremium]);

    const fetchData = async () => {
        try {
            const [data, gst] = await Promise.all([
                getAnalyticsSummary(),
                getGSTSummary()
            ]);
            setSummary(data);
            setGstSummary(gst);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load insights');
        } finally {
            setLoading(false);
        }
    };

    if (!isPremium) {
        return (
            <div className="analytics-blocked-container">
                <div className="premium-lock-overlay">
                    <div className="lock-content glass-card-premium">
                        <div className="premium-badge">PREMIUM FEATURE</div>
                        <Lock size={64} className="text-primary mb-4" />
                        <h2>Unlock Deep Insights</h2>
                        <p>Get advanced analytics, custom reports, and GST summaries to take control of your finances.</p>
                        <div className="premium-features-list">
                            <div className="feature-item"><Zap size={18} /> Category Analytics</div>
                            <div className="feature-item"><Zap size={18} /> PDF & Excel Exports</div>
                            <div className="feature-item"><Zap size={18} /> India-specific GST Summary</div>
                        </div>
                        <button className="btn-upgrade-premium" onClick={() => toast.success('Upgrade flow coming soon!')}>
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
                <div className="blur-background-content">
                    {/* Placeholder content behind blur */}
                    <header className="page-header">
                        <h1>Financial Analytics</h1>
                    </header>
                    <div className="stats-grid-premium">
                        <div className="stat-card-premium balance"><h3>$0.00</h3></div>
                        <div className="stat-card-premium income"><h3>$0.00</h3></div>
                        <div className="stat-card-premium expense"><h3>$0.00</h3></div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return <div>Analyzing your finances...</div>;

    const chartData = summary ? Object.entries(summary.monthlyTrends).map(([month, data]: any) => ({
        name: month,
        income: data.income,
        expense: data.expense
    })) : [];

    const pieData = summary ? Object.entries(summary.categoryBreakdown).map(([name, value]) => ({
        name, value
    })) : [];

    return (
        <div className="analytics-container">
            <header className="page-header d-flex justify-content-between align-items-center">
                <div>
                    <h1>Premium Analytics</h1>
                    <p>Comprehensive breakdown of your financial health.</p>
                </div>
                <div className="export-actions">
                    <button className="btn-secondary" onClick={downloadPDF}>
                        <FileText size={18} /> PDF Report
                    </button>
                    <button className="btn-secondary" onClick={downloadExcel}>
                        <FileSpreadsheet size={18} /> Excel Export
                    </button>
                </div>
            </header>

            <div className="stats-grid-premium">
                <div className="stat-card-premium income">
                    <span className="label">Total Revenue</span>
                    <h3>₹{summary?.totalIncome.toLocaleString()}</h3>
                    <TrendingUp size={24} className="icon-overlay" />
                </div>
                <div className="stat-card-premium expense">
                    <span className="label">Total Spending</span>
                    <h3>₹{summary?.totalExpense.toLocaleString()}</h3>
                    <TrendingDown size={24} className="icon-overlay" />
                </div>
                <div className="stat-card-premium balance">
                    <span className="label">GST Collected</span>
                    <h3>₹{gstSummary?.collectedGST.toLocaleString()}</h3>
                    <Calculator size={24} className="icon-overlay" />
                </div>
                <div className="stat-card-premium balance">
                    <span className="label">GST Paid</span>
                    <h3>₹{gstSummary?.paidGST.toLocaleString()}</h3>
                    <Calculator size={24} className="icon-overlay" />
                </div>
            </div>

            <div className="analytics-grid">
                <div className="chart-card glass-card-premium">
                    <h3>Income vs Expenses (Monthly)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card-premium">
                    <h3>Spending by Category</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="gst-summary-section glass-card-premium mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3><Calculator className="text-primary mr-2" /> GST Summary (India)</h3>
                    <div className="gst-badge">Net Payable: ₹{gstSummary?.netGST.toLocaleString()}</div>
                </div>

                <div className="table-container">
                    <table className="fm-table">
                        <thead>
                            <tr>
                                <th>Source/Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>GST Rate</th>
                                <th>GST Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gstSummary?.breakdown.income.map((i: any, idx: number) => (
                                <tr key={`inc-${idx}`}>
                                    <td><span className="badge-income">INC</span> {i.source}</td>
                                    <td>{new Date(i.date).toLocaleDateString()}</td>
                                    <td>₹{i.amount}</td>
                                    <td>{i.gstRate}%</td>
                                    <td className="text-success">+₹{i.gstAmount}</td>
                                </tr>
                            ))}
                            {gstSummary?.breakdown.expense.map((e: any, idx: number) => (
                                <tr key={`exp-${idx}`}>
                                    <td><span className="badge-expense">EXP</span> {e.category}</td>
                                    <td>{new Date(e.date).toLocaleDateString()}</td>
                                    <td>₹{e.amount}</td>
                                    <td>{e.gstRate}%</td>
                                    <td className="text-danger">-₹{e.gstAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
