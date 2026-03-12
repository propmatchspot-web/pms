import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Tag,
    CheckCircle,
    XCircle,
    Copy,
    Calendar,
    Loader2
} from 'lucide-react';
import Button from '../../components/Button';
import { useModal } from '../../context/ModalContext';
import { supabase } from '../../lib/supabaseClient';

interface Offer {
    id: string;
    firm_id: string;
    title: string;
    code: string | null;
    discount: string | null;
    expiry_date: string | null;
    verified: boolean;
    status: string;
    firms?: { name: string }; // Joined Data
}

interface Firm {
    id: string;
    name: string;
}

const AdminOffersPage: React.FC = () => {
    const { showModal } = useModal();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [firms, setFirms] = useState<Firm[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [saving, setSaving] = useState(false);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Offers with Firm Names
                // Use a try-catch for the specific join in case the relationship doesn't exist yet
                const { data: offersData, error: offersError } = await supabase
                    .from('offers')
                    .select('*, firms(name)')
                    .order('created_at', { ascending: false });

                if (offersError) {
                    console.error('Error fetching offers:', offersError);
                    // Don't throw, just set empty so page renders
                    setOffers([]);
                } else {
                    setOffers(offersData || []);
                }

                // Fetch Firms for Dropdown
                const { data: firmsData, error: firmsError } = await supabase
                    .from('firms')
                    .select('id, name')
                    .eq('status', 'active')
                    .order('name');

                if (firmsError) console.error('Error fetching firms:', firmsError);
                setFirms(firmsData || []);

            } catch (error) {
                console.error('Unexpected error in AdminOffersPage:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleEdit = (offer: Offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedOffer(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        showModal({
            type: 'confirm',
            title: 'Delete Offer',
            message: 'Are you sure you want to delete this offer?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    const { error } = await supabase.from('offers').delete().eq('id', id);
                    if (error) throw error;
                    setOffers(offers.filter(o => o.id !== id));
                    showModal({ type: 'success', title: 'Deleted', message: 'Offer deleted successfully.' });
                } catch (error) {
                    console.error('Error deleting offer:', error);
                    showModal({ type: 'error', title: 'Error', message: 'Failed to delete offer.' });
                }
            }
        });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const offerData = {
            firm_id: formData.get('firm_id') as string,
            title: formData.get('title') as string,
            code: formData.get('code') as string,
            discount: formData.get('discount') as string,
            expiry_date: formData.get('expiry_date') || null,
            verified: formData.get('verified') === 'on',
            status: 'active', // Defaulting to active for now
        };

        try {
            if (selectedOffer) {
                // Update
                const { error } = await supabase
                    .from('offers')
                    .update(offerData)
                    .eq('id', selectedOffer.id);

                if (error) throw error;
                // Refetch to get the joined firm name easily
                const { data } = await supabase.from('offers').select('*, firms(name)').eq('id', selectedOffer.id).single();
                setOffers(offers.map(o => (o.id === selectedOffer.id ? data : o)));
            } else {
                // Create
                const { data, error } = await supabase
                    .from('offers')
                    .insert([offerData])
                    .select('*, firms(name)')
                    .single();

                if (error) throw error;
                setOffers([data, ...offers]);
            }
            setIsModalOpen(false);
            showModal({ type: 'success', title: 'Success', message: 'Offer saved successfully!' });
        } catch (error) {
            console.error('Error saving offer:', error);
            showModal({ type: 'error', title: 'Error', message: 'Failed to save offer.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Offer Management</h2>
                    <p className="text-brand-muted text-sm mt-1">Manage discounts, coupon codes, and special deals.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 bg-brand-gold text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-goldHover transition-colors shadow-lg shadow-brand-gold/20"
                >
                    <Plus size={18} />
                    Add New Offer
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search offers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-black border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-gold focus:ring-0 placeholder:text-brand-muted/50"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2 border border-brand-border rounded-lg text-sm text-brand-muted hover:text-white hover:bg-brand-surface bg-brand-black transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-brand-muted gap-2">
                        <Loader2 className="animate-spin" size={24} />
                        Loading offers...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-brand-surface border-b border-brand-border">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Offer Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Discount Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Expiry</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {offers.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase())).map((offer) => (
                                    <tr key={offer.id} className="hover:bg-brand-surface/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-sm">{offer.title}</span>
                                                <span className="text-xs text-brand-gold font-medium mt-0.5">
                                                    {offer.firms?.name || 'Unknown Firm'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {offer.code ? (
                                                <div className="flex items-center gap-2 bg-brand-black border border-brand-border px-2 py-1 rounded max-w-fit">
                                                    <code className="text-brand-muted font-mono text-xs">{offer.code}</code>
                                                    <Copy size={12} className="text-brand-muted hover:text-white cursor-pointer" />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-brand-muted italic">No Code</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${offer.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
                                            {offer.expiry_date ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {offer.expiry_date}
                                                </div>
                                            ) : (
                                                <span className="text-brand-muted/50">No Expiry</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(offer)}
                                                    className="p-2 text-brand-muted hover:text-white hover:bg-brand-black rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(offer.id)}
                                                    className="p-2 text-brand-muted hover:text-red-500 hover:bg-brand-black rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {offers.length === 0 && (
                            <div className="text-center py-10 text-brand-muted">
                                No offers found. Add your first offer above.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-brand-card w-full max-w-lg rounded-2xl border border-brand-border shadow-2xl animate-fade-in-up">
                        <form onSubmit={handleSave}>
                            <div className="flex justify-between items-center p-6 border-b border-brand-border">
                                <h3 className="text-xl font-bold text-white">{selectedOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-brand-muted hover:text-white transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Associated Firm</label>
                                    <select name="firm_id" required defaultValue={selectedOffer?.firm_id || ''} className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2.5 text-white focus:border-brand-gold outline-none">
                                        <option value="">Select Firm...</option>
                                        {firms.map(firm => (
                                            <option key={firm.id} value={firm.id}>{firm.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Offer Title</label>
                                    <input name="title" required defaultValue={selectedOffer?.title} className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2.5 text-white focus:border-brand-gold outline-none" placeholder="e.g. 50% OFF Summer Sale" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Discount Code</label>
                                        <input name="code" defaultValue={selectedOffer?.code || ''} className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2.5 text-white focus:border-brand-gold outline-none font-mono" placeholder="CODE123" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Expiry Date</label>
                                        <input name="expiry_date" type="date" defaultValue={selectedOffer?.expiry_date || ''} className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2.5 text-white focus:border-brand-gold outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Discount Details</label>
                                    <input name="discount" defaultValue={selectedOffer?.discount || ''} className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2.5 text-white focus:border-brand-gold outline-none" placeholder="e.g. 10% or $50" />
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <input name="verified" type="checkbox" id="verified" className="rounded border-brand-border bg-brand-black text-brand-gold focus:ring-brand-gold" defaultChecked={selectedOffer?.verified} />
                                    <label htmlFor="verified" className="text-sm text-white select-none">Mark as Verified Deal</label>
                                </div>
                            </div>
                            <div className="p-6 border-t border-brand-border flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-surface font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-goldHover transition-colors flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="animate-spin" size={16} />}
                                    {selectedOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffersPage;
