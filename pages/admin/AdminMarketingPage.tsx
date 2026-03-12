import React, { useState } from 'react';
import { Send, Eye, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabaseClient';

const AdminMarketingPage: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [targetAudience, setTargetAudience] = useState<'db_users' | 'resend_contacts' | 'manual_selection'>('db_users');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    // Manual Selection State
    const [availableContacts, setAvailableContacts] = useState<any[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
    const [showContactSelector, setShowContactSelector] = useState(false);

    const fetchContacts = async () => {
        setIsLoadingContacts(true);
        setStatus({ type: null, message: '' });
        try {
            const { data, error } = await supabase.functions.invoke('send-marketing-email', {
                body: { type: 'fetch_contacts' }
            });
            if (error) throw error;
            if (data.error) throw new Error(data.error);

            setAvailableContacts(data.contacts || []);
            setShowContactSelector(true);
            setTargetAudience('manual_selection');
        } catch (err: any) {
            console.error('Failed to fetch contacts:', err);
            setStatus({ type: 'error', message: 'Failed to load contacts from Resend. ' + err.message });
        } finally {
            setIsLoadingContacts(false);
        }
    };

    const toggleContact = (email: string) => {
        const newSelected = new Set(selectedContacts);
        if (newSelected.has(email)) newSelected.delete(email);
        else newSelected.add(email);
        setSelectedContacts(newSelected);
    };

    const handleSend = async (actionType: 'test' | 'campaign') => {
        if (!subject || !content) {
            setStatus({ type: 'error', message: 'Please fill in both subject and content.' });
            return;
        }

        // If manual selection, validate
        if (actionType === 'campaign' && targetAudience === 'manual_selection' && selectedContacts.size === 0) {
            setStatus({ type: 'error', message: 'Please select at least one contact.' });
            return;
        }

        setIsSending(true);
        setStatus({ type: null, message: '' });

        try {
            // Using Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('send-marketing-email', {
                body: {
                    subject,
                    html: content,
                    type: actionType, // 'test' or 'campaign'
                    target: targetAudience === 'manual_selection' ? 'resend_contacts' : targetAudience,
                    recipient: targetAudience === 'manual_selection' ? Array.from(selectedContacts) : undefined
                },
            });

            if (error) throw error;
            if (data && data.error) throw new Error(data.error); // Handle custom error response

            setStatus({
                type: 'success',
                message: actionType === 'test'
                    ? 'Test email sent successfully! Check your inbox.'
                    : `Campaign sent successfully to ${data?.count || 'many'} subscribers!`
            });
        } catch (err: any) {
            console.error('Failed to send email:', err);
            setStatus({ type: 'error', message: err.message || 'Failed to send email. Ensure the Edge Function is deployed.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Marketing Campaigns</h1>
                    <p className="text-white/60">Create and send promotional emails to your subscribers.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className="space-y-6">
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                        <div className="space-y-4">
                            {/* Audience Selector */}
                            <div className="space-y-3">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { setTargetAudience('db_users'); setShowContactSelector(false); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${targetAudience === 'db_users'
                                            ? 'bg-primary/20 border-primary text-primary font-bold'
                                            : 'bg-background-dark border-border-dark text-white/60 hover:bg-white/5'
                                            }`}
                                    >
                                        <Users size={18} />
                                        <span>App Users (DB)</span>
                                    </button>
                                    <button
                                        onClick={() => { setTargetAudience('resend_contacts'); setShowContactSelector(false); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${targetAudience === 'resend_contacts'
                                            ? 'bg-primary/20 border-primary text-primary font-bold'
                                            : 'bg-background-dark border-border-dark text-white/60 hover:bg-white/5'
                                            }`}
                                    >
                                        <Users size={18} />
                                        <span>Resend List (All)</span>
                                    </button>
                                </div>

                                <button
                                    onClick={fetchContacts}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${targetAudience === 'manual_selection'
                                        ? 'bg-primary/20 border-primary text-primary font-bold'
                                        : 'bg-background-dark border-border-dark text-white/60 hover:bg-white/5'
                                        }`}
                                >
                                    {isLoadingContacts ? <span className="animate-spin">⌛</span> : <Users size={18} />}
                                    <span>Select Specific People (Manual)</span>
                                </button>

                                {/* Contact Selector UI */}
                                {showContactSelector && (
                                    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10 max-h-60 overflow-y-auto">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold text-white">Select Users ({selectedContacts.size})</span>
                                            <button
                                                onClick={() => setSelectedContacts(selectedContacts.size === availableContacts.length ? new Set() : new Set(availableContacts.map(c => c.email)))}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                {selectedContacts.size === availableContacts.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </div>
                                        {availableContacts.length === 0 ? (
                                            <p className="text-white/40 text-sm text-center py-4">No contacts found in Resend.</p>
                                        ) : (
                                            <div className="space-y-1">
                                                {availableContacts.map((contact, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 hover:bg-white/5 p-2 rounded cursor-pointer" onClick={() => toggleContact(contact.email)}>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedContacts.has(contact.email) ? 'bg-primary border-primary' : 'border-white/40'}`}>
                                                            {selectedContacts.has(contact.email) && <div className="w-2 h-2 bg-black rounded-sm" />}
                                                        </div>
                                                        <div className="text-sm text-white/80 overflow-hidden text-ellipsis">{contact.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-white/40 mt-2 text-center">
                                {targetAudience === 'db_users' && 'Sends to users registered in your Supabase "profiles" table.'}
                                {targetAudience === 'resend_contacts' && 'Broadcasts to ALL contacts in your Resend Audience.'}
                                {targetAudience === 'manual_selection' && 'Sends only to the specific people you select above.'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Subject Line</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. 50% Off All Challenges Today Only!"
                                className="w-full bg-background-dark border border-border-dark text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Email Content (HTML Supported)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="<p>Hello Traders,</p><p>Check out our latest offers...</p>"
                                className="w-full h-80 bg-background-dark border border-border-dark text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm"
                            />
                        </div>
                    </div>

                    {/* Status Message */}
                    {status.message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => handleSend('test')}
                            disabled={isSending}
                            className="flex-1 justify-center gap-2 border-border-dark hover:bg-surface-highlight"
                        >
                            {isSending ? 'Sending...' : <><Eye size={18} /> Send Test to Me</>}
                        </Button>
                        <Button
                            onClick={() => handleSend('campaign')}
                            disabled={isSending}
                            className="flex-1 justify-center gap-2 bg-brand-gold text-black hover:bg-white"
                        >
                            {isSending ? 'Sending...' : <><Send size={18} /> Send to All Subscribers</>}
                        </Button>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl overflow-hidden h-full min-h-[600px] border border-border-dark shadow-2xl relative">
                        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
                                    Preview: {subject || 'New Campaign'}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 h-full bg-white text-black prose max-w-none">
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                                    <Eye size={48} className="mb-4 opacity-20" />
                                    <p>Live preview will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMarketingPage;
