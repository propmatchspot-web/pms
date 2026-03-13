import React, { useState } from 'react';
import { Link, NavLink, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Tag,
    MessageSquare,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    CreditCard,
    Shield,
    Trophy,
    Send
} from 'lucide-react';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Map user's requested menu items to our routes
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        {
            section: 'Management',
            items: [
                { icon: Building2, label: 'Firms', path: '/admin/firms', badge: '3', badgeColor: 'bg-primary text-background-dark' },
                { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews', badge: '12', badgeColor: 'bg-surface-highlight text-white/60 border border-border-dark' },
                { icon: CreditCard, label: 'Payouts', path: '/admin/payouts' }, // Placeholder route
                { icon: Shield, label: 'Trust Badges', path: '/admin/badges' }, // Placeholder route
                { icon: Trophy, label: 'Competitions', path: '/admin/competitions' },
                { icon: Tag, label: 'Offers', path: '/admin/offers' }, // Added to keep existing functionality
                { icon: Tag, label: 'Spot Replay Discounts', path: '/admin/spot-replay-discounts' },
                { icon: Send, label: 'Marketing', path: '/admin/marketing' },
            ]
        },
        {
            section: 'Settings',
            items: [
                { icon: Users, label: 'Users', path: '/admin/users' },
                { icon: Settings, label: 'Configuration', path: '/admin/settings' },
            ]
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden h-screen flex font-sans">
            {/* Sidebar */}
            <aside className={`w-72 bg-surface-dark border-r border-border-dark flex flex-col h-full flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-72 lg:ml-0'}`}>
                <div className="p-6 border-b border-border-dark flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-base font-bold leading-none tracking-tight">Admin Console</h1>
                        <span className="text-white/50 text-xs font-medium mt-1">Prop-Trading SaaS</span>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                    <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border grouptransition-colors ${location.pathname === '/admin'
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'border-transparent text-white/70 hover:bg-surface-highlight hover:text-white'
                        }`}>
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    {menuItems.slice(1).map((section, idx) => (
                        <div key={idx}>
                            <div className="pt-4 pb-2 px-3 text-xs font-bold text-white/40 uppercase tracking-wider">{section.section}</div>
                            {section.items?.map((item) => {
                                // Apply the new NavLink styling only for the 'Settings' section items
                                if (section.section === 'Settings') {
                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
                                        >
                                            <item.icon size={20} />
                                            {item.label}
                                        </NavLink>
                                    );
                                } else {
                                    // Keep existing Link styling for other sections
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-surface-highlight hover:text-white transition-all group ${location.pathname === item.path ? 'bg-surface-highlight text-white' : ''
                                                }`}
                                        >
                                            <item.icon size={20} className="group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                            {item.badge && (
                                                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                }
                            })}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-border-dark">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-highlight border border-border-dark">
                        <div className="h-8 w-8 rounded-full bg-cover bg-center bg-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxV30b-3XlwlrtQGkq2oDIvFTBVQWWZjAMqyTTgoPkFPREDEaL9GHrMAHV3LNR48itlHbvBRy69x7XHUvlUITO2iU4-Zu3iG2JeAnfRHewLc15PTkEoJKfBBHiEEsjBRUrk5JrQXwHmTGogNvtUAKZURO-Ly3nzOSHBVvfiY9i5SiBN01r4ow_ZDD4GMd6apEOfinZ-vOdtvu-46K0l186cadn7tBN8Mx3pAoqqGlTaxQGErbxykeXT8o1RabE0w_Bu_XEl6GHHq5T')" }}></div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">Alex Morgan</span>
                            <span className="text-xs text-white/50 truncate">Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
                {/* Top Header */}
                <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center w-96">
                        <div className="relative w-full group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                className="w-full bg-surface-dark border border-border-dark text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-white/30 transition-all"
                                placeholder="Search firms, users, or transactions..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-white/70 hover:text-white hover:bg-surface-highlight rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-surface-dark"></span>
                        </button>
                        <div className="h-6 w-px bg-border-dark mx-1"></div>
                        <button className="text-xs font-bold text-primary border border-primary/30 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
                            Export Report
                        </button>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
