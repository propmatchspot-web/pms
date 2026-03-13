import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, CheckCircle2, XCircle, Search, Edit2 } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discount_percentage: number;
    is_active: boolean;
    expires_at: string | null;
    max_uses: number | null;
    times_used: number;
    created_at: string;
}

const AdminSpotReplayCouponsPage: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formCode, setFormCode] = useState('');
    const [formDiscount, setFormDiscount] = useState<number | ''>('');
    const [formMaxUses, setFormMaxUses] = useState<number | ''>('');
    const [formExpiresAt, setFormExpiresAt] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching coupons:', error);
        } else {
            setCoupons(data || []);
        }
        setLoading(false);
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCode || !formDiscount) return;

        const { error } = await supabase.from('coupons').insert([
            {
                code: formCode.toUpperCase(),
                discount_percentage: Number(formDiscount),
                max_uses: formMaxUses ? Number(formMaxUses) : null,
                expires_at: formExpiresAt ? new Date(formExpiresAt).toISOString() : null,
                is_active: true
            }
        ]);

        if (error) {
            alert(`Error creating coupon: ${error.message}`);
        } else {
            setIsModalOpen(false);
            setFormCode('');
            setFormDiscount('');
            setFormMaxUses('');
            setFormExpiresAt('');
            fetchCoupons();
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('coupons')
            .update({ is_active: !currentStatus })
            .eq('id', id);

        if (!error) fetchCoupons();
    };

    const deleteCoupon = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;
        
        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (!error) fetchCoupons();
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Spot Replay Discounts</h2>
                    <p className="text-white/50 text-sm mt-1">Manage promo codes for the Spot Replay crypto checkout.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-gold hover:bg-brand-500 text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Create Coupon
                </button>
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-dark/50 border-b border-border-dark text-xs uppercase text-white/40 font-bold tracking-wider">
                                <th className="px-6 py-4">Promo Code</th>
                                <th className="px-6 py-4 text-center">Discount</th>
                                <th className="px-6 py-4 text-center">Usage</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-white/50">Loading coupons...</td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-white/50">No coupons found. Create one to get started!</td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon.id} className="group hover:bg-surface-highlight transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-brand-gold tracking-widest text-lg bg-brand-gold/10 inline-block px-3 py-1 rounded border border-brand-gold/20">
                                                {coupon.code}
                                            </div>
                                            {coupon.expires_at && (
                                                <div className="text-xs text-white/40 mt-1">
                                                    Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-white font-black text-xl">{coupon.discount_percentage}% OFF</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-white font-medium">
                                                {coupon.times_used} / {coupon.max_uses ? coupon.max_uses : '∞'}
                                            </div>
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full mx-auto mt-2 overflow-hidden">
                                                <div 
                                                    className="h-full bg-brand-gold" 
                                                    style={{ width: coupon.max_uses ? `${(coupon.times_used / coupon.max_uses) * 100}%` : '100%' }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                                    coupon.is_active 
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                                                }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${coupon.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                                {coupon.is_active ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => deleteCoupon(coupon.id)}
                                                className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#151310] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Create New Promo Code</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Code Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. BLACKFRIDAY"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:outline-none uppercase font-mono tracking-widest"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Discount Percentage *</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        required
                                        min="1"
                                        max="100"
                                        placeholder="50"
                                        value={formDiscount}
                                        onChange={(e) => setFormDiscount(Number(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white focus:border-brand-gold focus:outline-none"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Usage Limit</label>
                                    <input 
                                        type="number" 
                                        placeholder="Optional (e.g. 100)"
                                        value={formMaxUses}
                                        onChange={(e) => setFormMaxUses(Number(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-gold focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Expiration Date</label>
                                    <input 
                                        type="date" 
                                        value={formExpiresAt}
                                        onChange={(e) => setFormExpiresAt(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-brand-gold focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-brand-gold text-black hover:bg-brand-500 transition-colors font-bold text-sm shadow-[0_0_20px_-5px_rgba(246,174,19,0.4)]"
                                >
                                    Create Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSpotReplayCouponsPage;
