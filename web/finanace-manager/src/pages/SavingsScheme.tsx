import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    ShieldCheck,
    Clock,
    Percent,
    Zap,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './SavingsScheme.css';
import './FinancePages.css';

const SavingsScheme: React.FC = () => {
    const { token } = useAuth();
    const [principal, setPrincipal] = useState(10000);
    const [duration, setDuration] = useState(12); // Months
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculation = useMemo(() => {
        const rate = 0.12; // 12%
        const time = duration / 12;
        const interest = principal * rate * time;
        const total = principal + interest;
        return { interest, total, duration: time };
    }, [principal, duration]);

    const handleApply = async () => {
        try {
            setIsSubmitting(true);
            await axios.post('http://localhost:5000/savings', {
                principal,
                durationMonths: duration,
                interestAmount: calculation.interest,
                totalAmount: calculation.total,
                interestRate: 12.0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Savings application submitted successfully!');
        } catch (error) {
            toast.error('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="finance-page savings-scheme-page">
            <div className="scheme-header">
                <div className="header-content">
                    <h1>Flexible Savings Scheme</h1>
                    <p>Earn fixed 12% annual returns on your short-term investments.</p>
                </div>
                <div className="badge-12">12%</div>
            </div>

            <div className="calculator-card">
                <div className="calc-inputs">
                    <div className="calc-group">
                        <label>
                            Investment Amount
                            <span>₹{principal.toLocaleString()}</span>
                        </label>
                        <input
                            type="range"
                            min="10000"
                            max="500000"
                            step="5000"
                            className="styled-range"
                            value={principal}
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                        />
                        <div className="range-labels" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>₹10,000</span>
                            <span>₹5,00,000</span>
                        </div>
                    </div>

                    <div className="calc-group">
                        <label>Investment Period</label>
                        <div className="duration-toggle">
                            <button
                                className={`duration-btn ${duration === 6 ? 'active' : ''}`}
                                onClick={() => setDuration(6)}
                            >
                                6 Months
                            </button>
                            <button
                                className={`duration-btn ${duration === 12 ? 'active' : ''}`}
                                onClick={() => setDuration(12)}
                            >
                                1 Year
                            </button>
                        </div>
                    </div>

                    <div className="calc-info-alert" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} color="var(--primary)" />
                            Safe and fixed returns with zero market risk.
                        </p>
                    </div>
                </div>

                <div className="calc-results">
                    <div className="result-row">
                        <span className="label">Investment</span>
                        <span className="value">₹{principal.toLocaleString()}</span>
                    </div>
                    <div className="result-row">
                        <span className="label">Duration</span>
                        <span className="value">{duration === 12 ? '1 Year' : '6 Months'}</span>
                    </div>
                    <div className="result-row">
                        <span className="label">Interest rate</span>
                        <span className="value" style={{ color: '#10b981' }}>12% p.a.</span>
                    </div>
                    <div className="result-row">
                        <span className="label">Interest Amount</span>
                        <span className="value">₹{calculation.interest.toLocaleString()}</span>
                    </div>

                    <div className="result-row maturity-amount">
                        <div className="col">
                            <span className="label">Maturity Value</span>
                            <div className="value">₹{calculation.total.toLocaleString()}</div>
                        </div>
                    </div>

                    <button className="apply-btn" onClick={handleApply} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Apply Now'}
                        {!isSubmitting && <ArrowRight size={20} style={{ marginLeft: '10px' }} />}
                    </button>
                </div>
            </div>

            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon"><TrendingUp size={24} /></div>
                    <h3>Higher Returns</h3>
                    <p>Better than traditional savings accounts and most FDs in the market today.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Clock size={24} /></div>
                    <h3>Short Term</h3>
                    <p>Flexible lock-in periods of just 6 months to 1 year for your quick goals.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Percent size={24} /></div>
                    <h3>Fixed 12% ROI</h3>
                    <p>Transparent and fixed returns calculated using simple interest model.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon"><Zap size={24} /></div>
                    <h3>Instant Process</h3>
                    <p>Submit your application instantly. Our admins will process it within 24 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default SavingsScheme;
