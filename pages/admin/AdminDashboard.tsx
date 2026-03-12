import React from 'react';
import {
    Users,
    Building2,
    Tag,
    TrendingUp,
    MoreVertical,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = React.useState({
        firmsCount: 0,
        offersCount: 0,
        usersCount: 0,
        clicksCount: 0,
        avgRating: "0.0"
    });
    const [analytics, setAnalytics] = React.useState({
        activeUsers: 0,
        recurringUsers: 0,
        totalInteractions: 0,
        topFirm: 'None'
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    { count: firmsCount, data: firmsData },
                    { count: offersCount },
                    { count: usersCount },
                    { data: firmsRatings },
                    { count: clicksCount, data: clicksData }
                ] = await Promise.all([
                    supabase.from('firms').select('id, name', { count: 'exact' }),
                    supabase.from('offers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('firms').select('rating'),
                    supabase.from('clicks').select('user_id, firm_id', { count: 'exact' })
                ]);

                const totalRating = firmsRatings?.reduce((acc, curr) => acc + (curr.rating || 0), 0) || 0;
                const avgRating = firmsRatings?.length ? (totalRating / firmsRatings.length).toFixed(1) : '0.0';

                // STATIC DATA (Requested by User for Demo/visuals)
                setAnalytics({
                    activeUsers: 24892,
                    recurringUsers: 113450,
                    totalInteractions: 854302,
                    topFirm: 'FundingPips'
                });

                // Calculate Analytics
                const validClicks = clicksData || [];
                const uniqueUsers = new Set(validClicks.map(c => c.user_id).filter(Boolean));

                const userCounts: Record<string, number> = {};
                validClicks.forEach(c => {
                    if (c.user_id) userCounts[c.user_id] = (userCounts[c.user_id] || 0) + 1;
                });
                const recurring = Object.values(userCounts).filter(count => count > 1).length;

                const firmCounts: Record<string, number> = {};
                validClicks.forEach(c => {
                    if (c.firm_id) firmCounts[c.firm_id] = (firmCounts[c.firm_id] || 0) + 1;
                });

                let topFirmId = '';
                let maxClicks = 0;
                Object.entries(firmCounts).forEach(([firmId, count]) => {
                    if (count > maxClicks) {
                        maxClicks = count;
                        topFirmId = firmId;
                    }
                });

                const topFirmName = firmsData?.find(f => f.id === topFirmId)?.name || 'None';

                setStats({
                    firmsCount: firmsCount || 0,
                    offersCount: offersCount || 0,
                    usersCount: usersCount || 0,
                    clicksCount: clicksCount || 0,
                    avgRating
                });

                /* REAL ANALYTICS DISABLED FOR DEMO OVERRIDE
                setAnalytics({
                    activeUsers: uniqueUsers.size,
                    recurringUsers: recurring,
                    totalInteractions: clicksCount || 0,
                    topFirm: topFirmName
                });
                */
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Section Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h2>
                    <p className="text-white/50 text-sm mt-1">Real-time metrics and verification queue.</p>
                </div>
                <div className="flex gap-2">
                    <select className="bg-surface-dark border border-border-dark text-white/80 text-sm rounded-lg px-3 py-1.5 focus:border-primary outline-none">
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Payout Volume</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-sm">payments</span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">$4.2M</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                        <span className="text-green-500 text-xs font-bold">+12.5%</span>
                        <span className="text-white/30 text-xs ml-1">vs last month</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Offers</span>
                        <span className="material-symbols-outlined text-orange-400 bg-orange-400/10 p-1.5 rounded-md text-sm">local_offer</span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : stats.offersCount}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                        <span className="text-green-500 text-xs font-bold">+5%</span>
                        <span className="text-white/30 text-xs ml-1">new this week</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Firms</span>
                        <span className="material-symbols-outlined text-blue-400 bg-blue-400/10 p-1.5 rounded-md text-sm">apartment</span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : stats.firmsCount}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                        <span className="text-green-500 text-xs font-bold">+2</span>
                        <span className="text-white/30 text-xs ml-1">onboarded this week</span>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Users</span>
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-sm">people</span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : stats.usersCount}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-white/30 text-xs">Registered Accounts</span>
                    </div>
                </div>
            </div>

            {/* Traffic Analytics Section */}
            <div className="flex flex-col gap-4">
                <h3 className="text-white font-bold text-lg">Traffic Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Active Users */}
                    <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Users (30d)</span>
                            <span className="material-symbols-outlined text-purple-400 bg-purple-400/10 p-1.5 rounded-md text-sm">person_search</span>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : analytics.activeUsers.toLocaleString()}</div>
                        <div className="text-white/30 text-xs mt-1">Unique visitors interacting</div>
                    </div>

                    {/* Recurring Users */}
                    <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Recurring Users</span>
                            <span className="material-symbols-outlined text-teal-400 bg-teal-400/10 p-1.5 rounded-md text-sm">history</span>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : analytics.recurringUsers.toLocaleString()}</div>
                        <div className="text-white/30 text-xs mt-1">Returned multiple times</div>
                    </div>

                    {/* Engagement */}
                    <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Interactions</span>
                            <span className="material-symbols-outlined text-pink-400 bg-pink-400/10 p-1.5 rounded-md text-sm">touch_app</span>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">{loading ? '...' : analytics.totalInteractions.toLocaleString()}</div>
                        <div className="text-white/30 text-xs mt-1">Clicks & View Actions</div>
                    </div>

                    {/* Total Sales - 921 */}
                    <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Sales</span>
                            <span className="material-symbols-outlined text-green-400 bg-green-400/10 p-1.5 rounded-md text-sm">shopping_cart</span>
                        </div>
                        <div className="text-3xl font-bold text-white tracking-tight">921</div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                            <span className="text-green-500 text-xs font-bold">+18%</span>
                            <span className="text-white/30 text-xs ml-1">this month</span>
                        </div>
                    </div>

                    {/* Top Performing Firm */}
                    <div className="bg-surface-dark border border-border-dark p-5 rounded-xl flex flex-col gap-1 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Most Popular Firm</span>
                            <span className="material-symbols-outlined text-yellow-400 bg-yellow-400/10 p-1.5 rounded-md text-sm">trophy</span>
                        </div>
                        <div className="text-xl font-bold text-white tracking-tight truncate" title={analytics.topFirm}>{loading ? '...' : analytics.topFirm}</div>
                        <div className="text-white/30 text-xs mt-1">Highest engagement</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts Section */}
                <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg">Monthly Active Prop Firms</h3>
                            <p className="text-white/40 text-xs">Firm growth over the last 6 months</p>
                        </div>
                        <button className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    </div>
                    <div className="relative w-full h-[250px]">
                        {/* SVG Chart */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 250">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#f6ae13" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#f6ae13" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line stroke="#463b26" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                            <line stroke="#463b26" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                            <line stroke="#463b26" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                            <line stroke="#463b26" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                            {/* The Chart Line */}
                            <path d="M0,200 C50,200 80,180 130,160 C180,140 210,150 260,120 C310,90 340,110 390,80 C440,50 470,70 520,60 C570,50 600,80 650,40 C700,0 750,20 800,20" fill="none" stroke="#f6ae13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                            {/* Area under curve */}
                            <path d="M0,200 C50,200 80,180 130,160 C180,140 210,150 260,120 C310,90 340,110 390,80 C440,50 470,70 520,60 C570,50 600,80 650,40 C700,0 750,20 800,20 V250 H0 Z" fill="url(#chartGradient)" opacity="0.5"></path>
                            {/* Data Points (Markers) */}
                            <circle cx="130" cy="160" fill="#221c10" r="4" stroke="#f6ae13" strokeWidth="2"></circle>
                            <circle cx="260" cy="120" fill="#221c10" r="4" stroke="#f6ae13" strokeWidth="2"></circle>
                            <circle cx="390" cy="80" fill="#221c10" r="4" stroke="#f6ae13" strokeWidth="2"></circle>
                            <circle cx="520" cy="60" fill="#221c10" r="4" stroke="#f6ae13" strokeWidth="2"></circle>
                            <circle cx="650" cy="40" fill="#221c10" r="4" stroke="#f6ae13" strokeWidth="2"></circle>
                            {/* Tooltip simulated */}
                            <g transform="translate(650, 15)">
                                <rect fill="#f6ae13" height="24" rx="4" width="60" x="-30" y="-30"></rect>
                                <text fill="#221c10" fontSize="12" fontWeight="bold" textAnchor="middle" x="0" y="-14">45 Firms</text>
                            </g>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 px-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                {/* Pending Actions Queue */}
                <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col">
                    <h3 className="text-white font-bold text-lg mb-4">Needs Attention</h3>
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
                        {/* Action Item */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-background-dark/50 border border-border-dark hover:border-primary/50 transition-colors cursor-pointer group">
                            <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg mt-0.5">
                                <span className="material-symbols-outlined text-[20px]">apartment</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-white text-sm font-semibold truncate">Apex Trader Funding</h4>
                                    <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">2m ago</span>
                                </div>
                                <p className="text-white/60 text-xs mb-2">New Firm Registration application.</p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-bold bg-primary text-background-dark px-2 py-1 rounded hover:bg-white transition-colors">Review</button>
                                    <button className="text-[10px] font-bold bg-white/10 text-white px-2 py-1 rounded hover:bg-white/20 transition-colors">Ignore</button>
                                </div>
                            </div>
                        </div>
                        {/* Action Item */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-background-dark/50 border border-border-dark hover:border-primary/50 transition-colors cursor-pointer group">
                            <div className="bg-orange-500/20 text-orange-500 p-2 rounded-lg mt-0.5">
                                <span className="material-symbols-outlined text-[20px]">flag</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-white text-sm font-semibold truncate">Review #8921</h4>
                                    <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">15m ago</span>
                                </div>
                                <p className="text-white/60 text-xs mb-2">Flagged for suspicious activity.</p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-bold bg-primary text-background-dark px-2 py-1 rounded hover:bg-white transition-colors">Moderate</button>
                                </div>
                            </div>
                        </div>
                        {/* Action Item */}
                        <div className="flex gap-3 items-start p-3 rounded-lg bg-background-dark/50 border border-border-dark hover:border-primary/50 transition-colors cursor-pointer group">
                            <div className="bg-green-500/20 text-green-500 p-2 rounded-lg mt-0.5">
                                <span className="material-symbols-outlined text-[20px]">payments</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-white text-sm font-semibold truncate">Payout Verification</h4>
                                    <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">1h ago</span>
                                </div>
                                <p className="text-white/60 text-xs mb-2">$12,450.00 claim by User_99.</p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-bold bg-primary text-background-dark px-2 py-1 rounded hover:bg-white transition-colors">Verify</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Data Table: Firm Approvals (Static Mock for visual match for now, or fetch firms) */}
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border-dark flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h3 className="text-white font-bold text-lg">Firm Applications</h3>
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">Pending Approval</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">filter_list</span>
                            <select className="bg-background-dark border border-border-dark text-white text-xs rounded-lg pl-8 pr-3 py-2 outline-none focus:border-primary">
                                <option>All Statuses</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-dark/50 border-b border-border-dark text-xs uppercase text-white/40 font-bold tracking-wider">
                                <th className="px-6 py-4">Entity Name</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">AUM Capacity</th>
                                <th className="px-6 py-4">Risk Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark text-sm">
                            <tr className="group hover:bg-surface-highlight transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gray-700 bg-cover bg-center border border-border-dark" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPpmsbHpUaqON5UjB_8VrnchrjNjcoBJOWTPWbngWDOMaPznrgRbZKqUsE5mMqj3xqv_zfB65RrH-qfS2nEIVbFoZu2A3XLCDLKAE5xNwAXcLw_bq5DXkj7C7n9Q_HdEdAd5xe3c73xm6lMR-HzquFFnUotvTtvj2W0kurKWsd3pMJTn4R3qqP3TxHRQb8q05AdiVEmqDMGWG_-rfagJnGafG4icLevHkiWR4UThFWiXXSkRZNPFAWI7hq3NX0MP3GYbBSI4WlK_SY')" }}></div>
                                        <div>
                                            <div className="font-bold text-white">Nova Funding Group</div>
                                            <div className="text-white/40 text-xs">Proprietary Trading</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white/70 tabular-nums">Oct 24, 2023</td>
                                <td className="px-6 py-4 text-white font-mono">$10M+</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[85%]"></div>
                                        </div>
                                        <span className="text-xs text-green-500 font-bold">Low</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        Pending
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Reject">
                                            <span className="material-symbols-outlined text-[20px]">close</span>
                                        </button>
                                        <button className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" title="Approve">
                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
