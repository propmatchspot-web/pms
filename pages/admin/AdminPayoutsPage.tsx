import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Payout {
    id: string;
    firm_id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processed' | 'rejected';
    trader_name: string;
    payout_date: string;
    firms?: {
        name: string;
        logo_url: string;
    };
}

const AdminPayoutsPage: React.FC = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const { data, error } = await supabase
                .from('payouts')
                .select('*, firms(name, logo_url)')
                .order('payout_date', { ascending: false });

            if (error) throw error;
            setPayouts(data || []);
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: 'processed' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('payouts')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setPayouts(payouts.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // Calculate Stats
    const totalPending = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
    const totalPaid = payouts.filter(p => p.status === 'processed').reduce((sum, p) => sum + Number(p.amount), 0);
    const totalRejected = payouts.filter(p => p.status === 'rejected').reduce((sum, p) => sum + Number(p.amount), 0);

    const filteredPayouts = payouts.filter(p =>
        p.trader_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.firms?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Payout Management</h2>
                    <p className="text-brand-muted text-sm mt-1">Track and verify payout queues from prop firms.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search payouts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-brand-charcoal text-white pl-10 pr-4 py-2 rounded-lg border border-brand-border focus:border-brand-gold focus:outline-none"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <h4 className="text-brand-muted text-sm font-bold uppercase">Pending Processing</h4>
                        <Clock className="text-brand-gold" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">${totalPending.toLocaleString()}</div>
                    <div className="text-xs text-brand-muted mt-1">{payouts.filter(p => p.status === 'pending').length} requests waiting</div>
                </div>
                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <h4 className="text-brand-muted text-sm font-bold uppercase">Paid (Total)</h4>
                        <CheckCircle className="text-green-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">${totalPaid.toLocaleString()}</div>
                    <div className="text-xs text-brand-muted mt-1">{payouts.filter(p => p.status === 'processed').length} processed</div>
                </div>
                <div className="bg-surface-dark border border-brand-border p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                        <h4 className="text-brand-muted text-sm font-bold uppercase">Flagged / Rejected</h4>
                        <AlertCircle className="text-red-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">${totalRejected.toLocaleString()}</div>
                    <div className="text-xs text-brand-muted mt-1">{payouts.filter(p => p.status === 'rejected').length} rejected</div>
                </div>
            </div>

            {/* Payout Table */}
            <div className="bg-surface-dark border border-brand-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-border bg-brand-charcoal/50">
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase">Trader</th>
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase">Firm</th>
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase">Amount</th>
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase">Status</th>
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase">Date</th>
                                <th className="p-4 text-sm font-bold text-brand-muted uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-brand-muted">Loading payouts...</td>
                                </tr>
                            ) : filteredPayouts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-brand-muted">No payouts found.</td>
                                </tr>
                            ) : (
                                filteredPayouts.map((payout) => (
                                    <tr key={payout.id} className="hover:bg-brand-charcoal/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{payout.trader_name}</div>
                                            <div className="text-xs text-brand-muted">ID: {payout.id.slice(0, 8)}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {payout.firms?.logo_url && (
                                                    <img src={payout.firms.logo_url} alt="" className="size-6 rounded-full" />
                                                )}
                                                <span className="text-sm text-gray-300">{payout.firms?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-white">${payout.amount.toLocaleString()}</div>
                                            <div className="text-xs text-brand-muted">{payout.currency}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payout.status === 'processed' ? 'bg-green-500/10 text-green-500' :
                                                payout.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-brand-gold/10 text-brand-gold'
                                                }`}>
                                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-brand-muted">
                                            {new Date(payout.payout_date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            {payout.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(payout.id, 'processed')}
                                                        className="p-1 hover:bg-green-500/20 text-green-500 rounded"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(payout.id, 'rejected')}
                                                        className="p-1 hover:bg-red-500/20 text-red-500 rounded"
                                                        title="Reject"
                                                    >
                                                        <AlertCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPayoutsPage;
