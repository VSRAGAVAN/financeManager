import React from 'react';
import {
    Monitor,
    Smartphone,
    Instagram,
    MessageCircle,
    Mail,
    Download,
    ExternalLink,
    LifeBuoy
} from 'lucide-react';
import './Support.css';
import './FinancePages.css';

const Support: React.FC = () => {
    const handleDownload = (platform: string) => {
        // Placeholder for actual download logic
        console.log(`Downloading for ${platform}`);
        alert(`Thank you for choosing Financely! Your ${platform} download will start shortly.`);
    };

    return (
        <div className="finance-page support-page">
            <div className="page-header">
                <div className="header-titles">
                    <h1>Support & Apps</h1>
                    <p>What platform do you want? Choose your preferred way to experience Financely.</p>
                </div>
            </div>

            <div className="support-container">
                <div className="support-grid">
                    {/* Downloads Section */}
                    <div className="support-section">
                        <div className="section-title">
                            <Download size={24} />
                            <span>Download Our Apps</span>
                        </div>

                        <div className="platform-cards">
                            <button className="platform-card" onClick={() => handleDownload('Desktop')}>
                                <div className="platform-info">
                                    <div className="platform-icon">
                                        <Monitor size={24} />
                                    </div>
                                    <div className="platform-details">
                                        <h4>Desktop App</h4>
                                        <p>Windows, macOS & Linux</p>
                                    </div>
                                </div>
                                <div className="download-badge">
                                    <Download size={16} />
                                    <span>Download</span>
                                </div>
                            </button>

                            <button className="platform-card" onClick={() => handleDownload('Mobile')}>
                                <div className="platform-info">
                                    <div className="platform-icon">
                                        <Smartphone size={24} />
                                    </div>
                                    <div className="platform-details">
                                        <h4>Mobile App</h4>
                                        <p>iOS & Android</p>
                                    </div>
                                </div>
                                <div className="download-badge">
                                    <Download size={16} />
                                    <span>Install</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Social Support Section */}
                    <div className="support-section">
                        <div className="section-title">
                            <LifeBuoy size={24} />
                            <span>Social Support</span>
                        </div>

                        <div className="social-links">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link-btn instagram">
                                <div className="social-icon"><Instagram size={22} /></div>
                                <span>Follow on Instagram</span>
                                <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </a>

                            <a href="https://wa.me/yournumber" target="_blank" rel="noopener noreferrer" className="social-link-btn whatsapp">
                                <div className="social-icon"><MessageCircle size={22} /></div>
                                <span>Chat on WhatsApp</span>
                                <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </a>

                            <a href="mailto:support@financely.com" className="social-link-btn mail">
                                <div className="social-icon"><Mail size={22} /></div>
                                <span>Email Support</span>
                                <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
