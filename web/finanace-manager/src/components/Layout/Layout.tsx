import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="layout-container">
            <button className="mobile-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                <Sidebar />
            </div>

            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
