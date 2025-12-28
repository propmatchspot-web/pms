import React, { useEffect, useState } from 'react';
import { Shield, Award, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Badge {
    id: string;
    firm_id: string;
    badge_type: 'Verified Firm' | 'Trader\'s Choice' | 'Fast Payouts';
    issued_at: string;
    firms?: {
        name: string;
        logo_url: string;
    };
}

interface Firm {
    id: string;
    name: string;
}

const AdminBadgesPage: React.FC = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [firms, setFirms] = useState<Firm[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFirm, setSelectedFirm] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Badges
            const { data: badgesData, error: badgesError } = await supabase
                .from('trust_badges')
                .select('*, firms(name, logo_url)')
                .order('issued_at', { ascending: false });

            if (badgesError) throw badgesError;
            setBadges(badgesData || []);

            // Fetch Firms (for selection)
            const { data: firmsData, error: firmsError } = await supabase
                .from('firms')
                .select('id, name')
                .eq('status', 'active')
                .order('name');

            if (firmsData) setFirms(firmsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueBadge = async (badgeType: string) => {
        if (!selectedFirm) {
            alert('Please select a firm first.');
            return;
        }

        try {
            const { error } = await supabase.from('trust_badges').insert([{
                firm_id: selectedFirm,
                badge_type: badgeType
            }]);

            if (error) throw error;

            alert(`Issued "${badgeType}" badge successfully!`);
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error issuing badge:', error);
            alert('Failed to issue badge.');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Trust Badges</h2>
                    <p className="text-brand-muted text-sm mt-1">Manage verification badges and trust scores.</p>
                </div>

                {/* Firm Selector */}
                <div className="flex items-center gap-3 bg-surface-dark p-2 rounded-lg border border-brand-border">
                    <span className="text-sm font-medium text-brand-muted pl-2">Target Firm:</span>
                    <select
                        value={selectedFirm}
                        onChange={(e) => setSelectedFirm(e.target.value)}
                        className="bg-brand-charcoal text-white text-sm rounded border border-brand-border px-3 py-1.5 focus:border-brand-gold focus:outline-none"
                    >
                        <option value="">Select a firm...</option>
                        {firms.map(f => (
                            <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Badge Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-brand-gold transition-colors group">
                    <div className="bg-green-500/20 p-4 rounded-full text-green-500 group-hover:scale-110 transition-transform">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Verified Firm</h3>
                        <p className="text-sm text-brand-muted mt-1">Issued after full due diligence check.</p>
                    </div>
                    <button
                        onClick={() => handleIssueBadge('Verified Firm')}
                        className="text-xs font-bold bg-brand-charcoal border border-brand-border px-4 py-2 rounded-lg text-white hover:bg-green-500 hover:border-green-500 hover:text-black transition-colors w-full"
                    >
                        Issue Badge
                    </button>
                </div>

                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-brand-gold transition-colors group">
                    <div className="bg-brand-gold/20 p-4 rounded-full text-brand-gold group-hover:scale-110 transition-transform">
                        <Award size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Trader's Choice</h3>
                        <p className="text-sm text-brand-muted mt-1">Awarded to top 10% highest rated firms.</p>
                    </div>
                    <button
                        onClick={() => handleIssueBadge('Trader\'s Choice')}
                        className="text-xs font-bold bg-brand-charcoal border border-brand-border px-4 py-2 rounded-lg text-white hover:bg-brand-gold hover:border-brand-gold hover:text-black transition-colors w-full"
                    >
                        Issue Badge
                    </button>
                </div>

                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:border-brand-gold transition-colors group">
                    <div className="bg-blue-500/20 p-4 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Fast Payouts</h3>
                        <p className="text-sm text-brand-muted mt-1">Verified payment processing &lt; 24h.</p>
                    </div>
                    <button
                        onClick={() => handleIssueBadge('Fast Payouts')}
                        className="text-xs font-bold bg-brand-charcoal border border-brand-border px-4 py-2 rounded-lg text-white hover:bg-blue-500 hover:border-blue-500 hover:text-black transition-colors w-full"
                    >
                        Issue Badge
                    </button>
                </div>
            </div>

            {/* Active Badges List */}
            <div className="mt-4">
                <h3 className="text-l font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-gold">history</span> Active Badges Issued
                </h3>

                <div className="bg-surface-dark border border-brand-border rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-brand-muted">Loading badges...</div>
                    ) : badges.length === 0 ? (
                        <div className="p-8 text-center text-brand-muted">No active badges issued manually yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-charcoal/50 border-b border-brand-border">
                                    <tr>
                                        <th className="p-4 text-xs uppercase text-brand-muted">Firm</th>
                                        <th className="p-4 text-xs uppercase text-brand-muted">Badge Type</th>
                                        <th className="p-4 text-xs uppercase text-brand-muted">Issued Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {badges.map(badge => (
                                        <tr key={badge.id} className="hover:bg-brand-charcoal/30">
                                            <td className="p-4 font-bold text-white flex items-center gap-2">
                                                {badge.firms?.logo_url && <img src={badge.firms.logo_url} className="size-6 rounded-full" />}
                                                {badge.firms?.name || 'Unknown'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${badge.badge_type === 'Verified Firm' ? 'bg-green-500/10 text-green-500' :
                                                        badge.badge_type === 'Trader\'s Choice' ? 'bg-brand-gold/10 text-brand-gold' :
                                                            'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {badge.badge_type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-brand-muted">
                                                {new Date(badge.issued_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AdminBadgesPage;
