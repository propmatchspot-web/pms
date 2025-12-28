import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Loader2,
  Save,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  TrendingDown,
  Layers
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Challenge {
  id?: string;
  name: string;
  account_size: string;
  price: string;
  profit_target: string;
  daily_drawdown: string;
  max_drawdown: string;
  min_trading_days: string;
}

interface Firm {
  id: string;
  name: string;
  website: string | null;
  affiliate_link: string | null;
  logo_url: string | null;
  rating: number;
  status: string;
  description?: string;
  founded_year?: string;
  hq_location?: string;
  profit_split?: string;
  platforms?: string[];
  challenges?: { id: string }[];
}

const AdminFirmsPage: React.FC = () => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'challenges'>('details');
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch Firms
  const fetchFirms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('firms')
        .select('*, challenges(id)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFirms(data || []);
    } catch (error) {
      console.error('Error fetching firms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Challenges for a Firm
  const fetchChallenges = async (firmId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('firm_id', firmId);

      if (!error && data) {
        setChallenges(data);
      } else {
        setChallenges([]);
      }
    } catch (err) {
      console.error("Error loading challenges", err);
      setChallenges([]);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  useEffect(() => {
    if (selectedFirm) {
      fetchChallenges(selectedFirm.id);
    } else {
      setChallenges([]);
    }
  }, [selectedFirm]);

  const handleAddNew = () => {
    setSelectedFirm(null);
    setChallenges([]); // Clear challenges for new firm
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleEdit = (firm: Firm) => {
    setSelectedFirm(firm);
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this firm? This will also delete all its challenges.')) return;

    try {
      const { error } = await supabase.from('firms').delete().eq('id', id);
      if (error) throw error;
      setFirms(firms.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting firm:', error);
      alert('Failed to delete firm');
    }
  };

  // Handle Challenge Input Changes locally
  const updateChallenge = (index: number, field: keyof Challenge, value: string) => {
    const newChallenges = [...challenges];
    newChallenges[index] = { ...newChallenges[index], [field]: value };
    setChallenges(newChallenges);
  };

  const addChallengeRow = () => {
    setChallenges([...challenges, {
      name: 'New Challenge',
      account_size: '$10,000',
      price: '$99',
      profit_target: '8%',
      daily_drawdown: '5%',
      max_drawdown: '10%',
      min_trading_days: '5'
    }]);
  };

  const removeChallengeRow = (index: number) => {
    const newChallenges = [...challenges];
    newChallenges.splice(index, 1);
    setChallenges(newChallenges);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("handleSave: Starting...");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const firmData = {
      name: formData.get('name') as string,
      website: formData.get('website') as string,
      affiliate_link: formData.get('affiliate_link') as string,
      logo_url: formData.get('logo_url') as string,
      rating: parseFloat(formData.get('rating') as string) || 0,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      founded_year: formData.get('founded_year') as string,
      hq_location: formData.get('hq_location') as string,
      profit_split: formData.get('profit_split') as string,
      platforms: (formData.get('platforms') as string).split(',').map(p => p.trim()),
    };

    console.log("handleSave: Prepared firmData", firmData);

    try {
      let firmId = selectedFirm?.id;

      if (selectedFirm) {
        console.log("handleSave: Updating existing firm...", firmId);
        // Update Firm
        const { error } = await supabase
          .from('firms')
          .update(firmData)
          .eq('id', selectedFirm.id);

        console.log("handleSave: Update result error:", error);
        if (error) throw error;

        // Optimistic UI Update
        setFirms(firms.map(f => (f.id === selectedFirm.id ? { ...f, ...firmData } : f)));
      } else {
        console.log("handleSave: Inserting new firm...");
        // Create Firm
        const { data, error } = await supabase
          .from('firms')
          .insert([firmData])
          .select()
          .single();

        console.log("handleSave: Insert result:", { data, error });
        if (error) throw error;

        if (!data) throw new Error("No data returned from insert");

        firmId = data.id;
        console.log("handleSave: New firm ID:", firmId);
        setFirms([data, ...firms]);
      }

      // Handle Challenges Save
      if (firmId && challenges.length > 0) {
        console.log("handleSave: Saving challenges...", challenges.length);
        // 1. Delete existing (simple strategy: delete all for this firm and re-insert to avoid syncing issues)
        // ONLY if editing. If new, we just insert. 
        if (selectedFirm) {
          await supabase.from('challenges').delete().eq('firm_id', firmId);
        }

        // 2. Insert current state
        const challengesToInsert = challenges.map(c => ({
          firm_id: firmId,
          name: c.name,
          account_size: c.account_size,
          price: c.price,
          profit_target: c.profit_target,
          daily_drawdown: c.daily_drawdown,
          max_drawdown: c.max_drawdown,
          min_trading_days: c.min_trading_days
        }));

        const { error: challengeError } = await supabase.from('challenges').insert(challengesToInsert);
        console.log("handleSave: Challenge insert result:", challengeError);
        if (challengeError) console.error("Error saving challenges:", challengeError);
      }

      console.log("handleSave: Completed successfully, closing modal.");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving firm:', error);
      alert(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      console.log("handleSave: Finally block executed, stopping spinner.");
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Firm Management</h2>
          <p className="text-brand-muted text-sm mt-1">Add, edit, or remove prop firms from the platform.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-brand-gold text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-goldHover transition-colors shadow-lg shadow-brand-gold/20"
        >
          <Plus size={18} />
          Add New Firm
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
          <input
            type="text"
            placeholder="Search firms by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-dark border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-gold focus:ring-0 placeholder:text-brand-muted/50"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted gap-2">
            <Loader2 className="animate-spin" size={24} />
            Loading firms...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-dark border-b border-brand-border">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Firm Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Challenges</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Founded</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-white">
                {firms.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map((firm) => (
                  <tr key={firm.id} className="hover:bg-brand-surface/50 transition-colors group text-sm">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-surface-dark border border-brand-border flex items-center justify-center text-brand-muted overflow-hidden">
                          {firm.logo_url ? <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain p-1" /> : <ImageIcon size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-white">{firm.name}</div>
                          <a href={firm.website || '#'} target="_blank" className="text-xs text-brand-muted hover:text-brand-gold">{new URL(firm.website || 'https://example.com').hostname}</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${firm.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-brand-border text-brand-muted'}`}>
                        {firm.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-muted font-bold text-white">{firm.challenges?.length || 0}</td>
                    <td className="px-6 py-4 text-brand-muted">{firm.hq_location || '-'}</td>
                    <td className="px-6 py-4 text-brand-muted">{firm.founded_year || '-'}</td>
                    <td className="px-6 py-4 text-brand-gold font-bold">{firm.rating} / 5</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(firm)} className="p-2 hover:bg-surface-dark rounded-lg text-brand-muted hover:text-white transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(firm.id)} className="p-2 hover:bg-surface-dark rounded-lg text-brand-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-brand-card w-full max-w-4xl rounded-xl border border-brand-border shadow-2xl my-8 flex flex-col max-h-[90vh]">
            <form onSubmit={handleSave} className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-brand-border bg-brand-card rounded-t-xl sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedFirm ? `Edit ${selectedFirm.name}` : 'Create New Prop Firm'}</h3>
                  <p className="text-sm text-brand-muted">Populate all required details for the public listing.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-brand-muted hover:text-white"><XCircle size={24} /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-brand-border px-6 gap-6 bg-surface-dark">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-muted hover:text-white'}`}
                >
                  Firm Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('challenges')}
                  className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'challenges' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-muted hover:text-white'}`}
                >
                  Account Types & Challenges
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Firm Name</label>
                        <input name="name" required defaultValue={selectedFirm?.name} className="w-full bg-background-dark border border-brand-border rounded-lg p-3 text-white focus:border-brand-gold outline-none" placeholder="e.g. Apex Trader" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Status</label>
                        <select name="status" defaultValue={selectedFirm?.status || 'draft'} className="w-full bg-background-dark border border-brand-border rounded-lg p-3 text-white focus:border-brand-gold outline-none">
                          <option value="active">Active (Visible)</option>
                          <option value="draft">Draft (Hidden)</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-muted uppercase">Description</label>
                      <textarea name="description" rows={3} defaultValue={selectedFirm?.description || ''} className="w-full bg-background-dark border border-brand-border rounded-lg p-3 text-white focus:border-brand-gold outline-none" placeholder="Short bio of the firm..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Website URL</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="website" defaultValue={selectedFirm?.website || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="https://" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Affiliate Link</label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="affiliate_link" defaultValue={selectedFirm?.affiliate_link || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="?ref=..." />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Logo URL</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="logo_url" defaultValue={selectedFirm?.logo_url || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="https://..." />
                        </div>
                      </div>
                    </div>

                    <h4 className="text-white font-bold border-b border-brand-border pb-2 mt-4">Firm Specifics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Founded Year</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="founded_year" defaultValue={selectedFirm?.founded_year || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="2023" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">HQ Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="hq_location" defaultValue={selectedFirm?.hq_location || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="USA, Dubai..." />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Profit Split</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                          <input name="profit_split" defaultValue={selectedFirm?.profit_split || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="Up to 90%" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase">Trust Score</label>
                        <input name="rating" type="number" step="0.1" max="5" defaultValue={selectedFirm?.rating || 4.5} className="w-full bg-background-dark border border-brand-border rounded-lg p-3 text-white focus:border-brand-gold outline-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-muted uppercase">Platforms (comma separated)</label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                        <input name="platforms" defaultValue={selectedFirm?.platforms?.join(', ') || ''} className="w-full bg-background-dark border border-brand-border rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-gold outline-none" placeholder="MT4, MT5, cTrader, TradeLocker" />
                      </div>
                    </div>
                  </div>
                )}

                {/* CHALLENGES TAB */}
                {activeTab === 'challenges' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-bold">Funded Account Types</h4>
                      <button type="button" onClick={addChallengeRow} className="text-xs bg-brand-gold text-brand-black font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white transition-colors">
                        <Plus size={14} /> Add Account Type
                      </button>
                    </div>

                    {challenges.length === 0 ? (
                      <div className="text-center py-10 bg-background-dark rounded-xl border border-dashed border-brand-border text-brand-muted">
                        No account types defined yet. Click "Add Account Type" to start.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {challenges.map((challenge, idx) => (
                          <div key={idx} className="bg-background-dark border border-brand-border p-4 rounded-xl relative group">
                            <button
                              type="button"
                              onClick={() => removeChallengeRow(idx)}
                              className="absolute top-2 right-2 text-brand-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XCircle size={20} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Challenge Name</label>
                                <input
                                  value={challenge.name}
                                  onChange={(e) => updateChallenge(idx, 'name', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="Standard"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Account Size</label>
                                <input
                                  value={challenge.account_size}
                                  onChange={(e) => updateChallenge(idx, 'account_size', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="$10,000"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Price</label>
                                <input
                                  value={challenge.price}
                                  onChange={(e) => updateChallenge(idx, 'price', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="$99"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Min Days</label>
                                <input
                                  value={challenge.min_trading_days}
                                  onChange={(e) => updateChallenge(idx, 'min_trading_days', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="5"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Profit Target</label>
                                <input
                                  value={challenge.profit_target}
                                  onChange={(e) => updateChallenge(idx, 'profit_target', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="10%"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Daily Drawdown</label>
                                <input
                                  value={challenge.daily_drawdown}
                                  onChange={(e) => updateChallenge(idx, 'daily_drawdown', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="5%"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase text-brand-muted font-bold">Max Drawdown</label>
                                <input
                                  value={challenge.max_drawdown}
                                  onChange={(e) => updateChallenge(idx, 'max_drawdown', e.target.value)}
                                  className="w-full bg-surface-dark border border-brand-border rounded px-2 py-1.5 text-sm text-white focus:border-brand-gold"
                                  placeholder="10%"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Content */}
              <div className="p-6 border-t border-brand-border bg-brand-card rounded-b-xl flex justify-between items-center z-10 sticky bottom-0">
                <div className="text-xs text-brand-muted">
                  Changes are saved to live environment immediately.
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-lg border border-brand-border text-brand-muted hover:text-white hover:bg-brand-surface font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-2.5 rounded-lg bg-brand-gold text-brand-black font-bold hover:bg-brand-goldHover transition-colors flex items-center gap-2 shadow-lg shadow-brand-gold/20"
                  >
                    {saving && <Loader2 className="animate-spin" size={18} />}
                    {selectedFirm ? 'Update Firm Details' : 'Publish Firm'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFirmsPage;
