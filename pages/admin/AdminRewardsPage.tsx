
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Search, Gift } from 'lucide-react';
import Button from '../../components/Button';
import { useModal } from '../../context/ModalContext';

interface Reward {
    id: string;
    title: string;
    description: string;
    cost: number;
    category: string;
    status: 'active' | 'inactive';
    code: string;
    image_url: string;
}

const AdminRewardsPage: React.FC = () => {
    const { showModal } = useModal();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Reward>>({
        title: '',
        description: '',
        cost: 0,
        category: 'General',
        status: 'active',
        code: '',
        image_url: ''
    });

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('rewards')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setRewards(data);
        setLoading(false);
    };

    const handleOpenModal = (reward?: Reward) => {
        if (reward) {
            setEditingReward(reward);
            setFormData(reward);
        } else {
            setEditingReward(null);
            setFormData({
                title: '',
                description: '',
                cost: 0,
                category: 'General',
                status: 'active',
                code: '',
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReward(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.cost) {
            showModal({ type: 'warning', title: 'Missing Information', message: "Title and Cost are required" });
            return;
        }

        try {
            if (editingReward) {
                // Update
                const { error } = await supabase
                    .from('rewards')
                    .update(formData)
                    .eq('id', editingReward.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('rewards')
                    .insert([formData]);
                if (error) throw error;
            }

            handleCloseModal();
            fetchRewards();
            showModal({ type: 'success', title: 'Success', message: 'Reward saved successfully!' });
        } catch (error: any) {
            showModal({ type: 'error', title: 'Error', message: 'Error saving reward: ' + error.message });
        }
    };

    const handleDelete = async (id: string) => {
        showModal({
            type: 'confirm',
            title: 'Delete Reward',
            message: 'Are you sure you want to delete this reward?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                const { error } = await supabase.from('rewards').delete().eq('id', id);
                if (error) {
                    showModal({ type: 'error', title: 'Error', message: 'Error deleting reward: ' + error.message });
                } else {
                    fetchRewards();
                    showModal({ type: 'success', title: 'Deleted', message: 'Reward deleted successfully.' });
                }
            }
        });
    };

    const filteredRewards = rewards.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Gift className="text-brand-gold" /> Rewards Management
                    </h1>
                    <p className="text-brand-muted text-sm mt-1">Create and manage items in the Rewards Store.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-brand-gold text-black">
                    <Plus size={18} className="mr-2" /> Add Reward
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 bg-brand-surface border border-brand-border rounded-lg p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search rewards..."
                        className="w-full bg-brand-charcoal border border-brand-border rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-charcoal border-b border-brand-border text-xs uppercase text-brand-muted font-bold tracking-wider">
                                <th className="px-6 py-4">Reward</th>
                                <th className="px-6 py-4">Cost (Pts)</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-muted">Loading...</td></tr>
                            ) : filteredRewards.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-brand-muted">No rewards found.</td></tr>
                            ) : (
                                filteredRewards.map((reward) => (
                                    <tr key={reward.id} className="group hover:bg-brand-charcoal/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-gray-800 overflow-hidden shrink-0">
                                                    {reward.image_url && <img src={reward.image_url} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{reward.title}</div>
                                                    <div className="text-brand-muted text-xs truncate max-w-[200px]">{reward.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-brand-gold font-bold">{reward.cost}</td>
                                        <td className="px-6 py-4 text-white">{reward.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px - 2 py - 1 rounded - full text - xs border ${reward.status === 'active'
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                } `}>
                                                {reward.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal(reward)} className="p-2 text-brand-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(reward.id)} className="p-2 text-brand-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-brand-border rounded-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-brand-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">{editingReward ? 'Edit Reward' : 'New Reward'}</h2>
                            <button onClick={handleCloseModal} className="text-brand-muted hover:text-white"><Plus size={24} className="rotate-45" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Cost (Points)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Category</label>
                                    <select
                                        className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Merch">Merch</option>
                                        <option value="Discount">Discount</option>
                                        <option value="Digital">Digital</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Redemption Code (Secret)</label>
                                <input
                                    type="text"
                                    className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold font-mono text-sm"
                                    placeholder="e.g. DISCOUNT_2024"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Image URL</label>
                                <input
                                    type="text"
                                    className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold text-sm"
                                    placeholder="https://..."
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Status</label>
                                <select
                                    className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-brand-gold text-black">Save Reward</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRewardsPage;
