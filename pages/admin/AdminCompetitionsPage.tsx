import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Trophy, Plus, Search, Edit2, Trash2, X, Check, Save } from 'lucide-react';
import Button from '../../components/Button';
import { useModal } from '../../context/ModalContext';

interface Competition {
    id: string;
    firm_name: string;
    title: string;
    description: string;
    prize_pool: string;
    entry_fee: string;
    start_date: string;
    end_date: string;
    join_url: string;
    image_url: string;
    status: 'upcoming' | 'active' | 'ended';
    tasks?: { id: string; type: string; text: string; url: string }[];
}

const AdminCompetitionsPage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState<Partial<Competition>>({
        firm_name: '',
        title: '',
        description: '',
        prize_pool: '',
        entry_fee: 'Free',
        start_date: '',
        end_date: '',
        join_url: '',
        image_url: '',
        status: 'upcoming',
        tasks: []
    });

    const { showModal } = useModal();

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('competitions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching competitions:', error);
        else setCompetitions(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        try {
            if (!formData.title || !formData.firm_name) {
                showModal({ type: 'warning', title: 'Missing Information', message: 'Title and Firm Name are required.' });
                return;
            }

            const payload = { ...formData };

            let error;
            if (formData.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('competitions')
                    .update(payload)
                    .eq('id', formData.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('competitions')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            setIsEditing(false);
            resetForm();
            fetchCompetitions();
            showModal({ type: 'success', title: 'Success', message: 'Competition saved successfully!' });
        } catch (err: any) {
            showModal({ type: 'error', title: 'Error', message: 'Error saving competition: ' + err.message });
        }
    };

    const handleDelete = async (id: string) => {
        showModal({
            type: 'confirm',
            title: 'Delete Competition',
            message: 'Are you sure you want to delete this competition? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                const { error } = await supabase.from('competitions').delete().eq('id', id);
                if (error) {
                    showModal({ type: 'error', title: 'Error', message: 'Error deleting: ' + error.message });
                } else {
                    fetchCompetitions();
                    showModal({ type: 'success', title: 'Deleted', message: 'Competition deleted successfully.' });
                }
            }
        });
    };

    const startEdit = (comp: Competition) => {
        setFormData(comp);
        setIsEditing(true);
    };

    const resetForm = () => {
        setFormData({
            firm_name: '',
            title: '',
            description: '',
            prize_pool: '',
            entry_fee: 'Free',
            start_date: '',
            end_date: '',
            join_url: '',
            image_url: '',
            status: 'upcoming'
        });
    };

    const filteredCompetitions = competitions.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.firm_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Trophy className="text-brand-gold" /> Competitions Manager
                    </h1>
                    <p className="text-brand-muted">Manage active and upcoming trading competitions.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsEditing(true); }} className="gap-2 bg-brand-gold text-black hover:bg-white">
                    <Plus size={18} /> Add Competition
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                <input
                    type="text"
                    placeholder="Search competitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-3 text-white focus:border-brand-gold focus:outline-none"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10 text-brand-muted">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredCompetitions.map((comp) => (
                        <div key={comp.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-center justify-between group hover:border-brand-gold/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-black/30 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden">
                                    {comp.image_url ? (
                                        <img src={comp.image_url} alt={comp.firm_name} className="h-full w-full object-contain" />
                                    ) : <Trophy className="text-brand-muted" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{comp.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-brand-muted">
                                        <span className="text-brand-gold">{comp.firm_name}</span>
                                        <span>•</span>
                                        <span>{comp.prize_pool}</span>
                                        <span>•</span>
                                        <span className={`capitalize ${comp.status === 'active' ? 'text-green-400' :
                                            comp.status === 'upcoming' ? 'text-blue-400' : 'text-gray-400'
                                            }`}>{comp.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEdit(comp)} className="p-2 hover:bg-white/10 rounded-lg text-brand-gold transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(comp.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-brand-border flex justify-between items-center sticky top-0 bg-brand-surface z-10">
                            <h2 className="text-xl font-bold text-white">
                                {formData.id ? 'Edit Competition' : 'New Competition'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-brand-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Firm Name</label>
                                    <input
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.firm_name}
                                        onChange={e => setFormData({ ...formData, firm_name: e.target.value })}
                                        placeholder="e.g. FTMO"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Status</label>
                                    <select
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Competition Title</label>
                                <input
                                    className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Winter Trading Sprint"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Description</label>
                                <textarea
                                    className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Details about the competition..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Prize Pool</label>
                                    <input
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.prize_pool}
                                        onChange={e => setFormData({ ...formData, prize_pool: e.target.value })}
                                        placeholder="e.g. $10,000 Cash"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Entry Fee</label>
                                    <input
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.entry_fee}
                                        onChange={e => setFormData({ ...formData, entry_fee: e.target.value })}
                                        placeholder="e.g. Free"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                                        onChange={e => setFormData({ ...formData, start_date: new Date(e.target.value).toISOString() })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-muted mb-1">End Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                        value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                                        onChange={e => setFormData({ ...formData, end_date: new Date(e.target.value).toISOString() })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Affiliate Link (Join URL)</label>
                                <input
                                    className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                    value={formData.join_url}
                                    onChange={e => setFormData({ ...formData, join_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-muted mb-1">Logo URL</label>
                                <input
                                    className="w-full bg-black/30 border border-brand-border rounded-lg p-2.5 text-white focus:border-brand-gold outline-none"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Tasks Manager */}
                            <div className="pt-4 border-t border-brand-border">
                                <label className="block text-sm font-medium text-white mb-3">Required Tasks (Unlock Steps)</label>
                                <div className="space-y-3">
                                    {(formData.tasks || []).map((task, idx) => (
                                        <div key={idx} className="bg-black/20 p-3 rounded-lg border border-brand-border flex gap-2 items-start">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                                                <select
                                                    className="bg-brand-surface border border-brand-border rounded px-2 py-1 text-sm text-white focus:border-brand-gold outline-none"
                                                    value={task.type}
                                                    onChange={(e) => {
                                                        const newTasks = [...(formData.tasks || [])];
                                                        newTasks[idx] = { ...task, type: e.target.value as any };
                                                        setFormData({ ...formData, tasks: newTasks });
                                                    }}
                                                >
                                                    <option value="twitter">Twitter</option>
                                                    <option value="discord">Discord</option>
                                                    <option value="youtube">YouTube</option>
                                                    <option value="instagram">Instagram</option>
                                                    <option value="telegram">Telegram</option>
                                                    <option value="generic">Generic Website</option>
                                                </select>
                                                <input
                                                    className="bg-brand-surface border border-brand-border rounded px-2 py-1 text-sm text-white focus:border-brand-gold outline-none"
                                                    placeholder="Task Text (e.g. Follow us)"
                                                    value={task.text}
                                                    onChange={(e) => {
                                                        const newTasks = [...(formData.tasks || [])];
                                                        newTasks[idx] = { ...task, text: e.target.value };
                                                        setFormData({ ...formData, tasks: newTasks });
                                                    }}
                                                />
                                                <input
                                                    className="bg-brand-surface border border-brand-border rounded px-2 py-1 text-sm text-white focus:border-brand-gold outline-none"
                                                    placeholder="URL to Visit"
                                                    value={task.url}
                                                    onChange={(e) => {
                                                        const newTasks = [...(formData.tasks || [])];
                                                        newTasks[idx] = { ...task, url: e.target.value };
                                                        setFormData({ ...formData, tasks: newTasks });
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newTasks = (formData.tasks || []).filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, tasks: newTasks });
                                                }}
                                                className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        className="w-full text-sm py-2 border-dashed border-brand-muted/50 text-brand-muted hover:text-white hover:border-brand-gold"
                                        onClick={() => {
                                            const newTask = { id: Date.now().toString(), type: 'generic', text: '', url: '' };
                                            setFormData({ ...formData, tasks: [...(formData.tasks || []), newTask] as any });
                                        }}
                                    >
                                        <Plus size={16} className="mr-2" /> Add Required Task
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-brand-border flex justify-end gap-3 sticky bottom-0 bg-brand-surface z-10">
                            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} className="gap-2 bg-brand-gold text-black">
                                <Save size={18} /> Save Competition
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCompetitionsPage;
