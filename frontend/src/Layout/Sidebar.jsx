// src/components/shared/Sidebar.jsx

import React from 'react';
import { Home, Users, CreditCard, FileText, Mail, BarChart3, Ticket, User, TrendingUp, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const activePage = location.pathname.split('/')[2]; // /admin/leads -> leads
    const  userRole = localStorage.getItem("user_role") || "";

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: 'dashboard', section: 'Main' },
        { name: 'Clients', icon: Users, path: 'clients', section: 'Main' },
        { name: 'Payments & Invoices', icon: CreditCard, path: 'payments', section: 'Main' },
        { name: 'Subscription Plans', icon: FileText, path: 'plans', section: 'Main' },
        { name: 'Emails & Notifications', icon: Mail, path: 'emails', section: 'Main' },
        { name: 'Trade Recommendation', icon: BarChart3, path: 'rai-data', section: 'Admin' },
        { name: 'Trade Satup', icon: BarChart3, path: 'tradeSatup', section: 'Admin' },
        { name: 'Support', icon: Ticket, path: 'support', section: 'Admin' },
        { name: 'User Management', icon: User, path: 'user-management', section: 'Admin' },
        { name: 'Leads', icon: TrendingUp, path: 'leads', section: 'Admin' },
        { name: 'Create Coupon Code', icon: TrendingUp, path: 'CreateCouponCode', section: 'Admin' },
        { name: 'Add Research Report', icon: TrendingUp, path: 'addResearchReport', section: 'Admin' },
        { name: 'Settings', icon: Settings, path: 'settings', section: 'System' },
    ];

    return (
        <div className="sidebar d-flex flex-column">
            <div className="sidebar-header">
                CRM Admin Panel
            </div>
            <nav className="nav flex-column mt-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={`/admin/${item.path}`}
                            className={`nav-link ${activePage === item.path ? 'active' : ''}`}
                        >
                            <Icon className="lucide-icon" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
