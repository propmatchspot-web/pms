import React from 'react';
import { Save } from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
                <p className="text-brand-muted text-sm mt-1">Configure global settings for Prop Match Spot.</p>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6 space-y-8">
                {/* General Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-brand-border pb-2">General Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-muted">Platform Name</label>
                            <input type="text" defaultValue="Prop Match Spot" className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2 text-white focus:border-brand-gold outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-brand-muted">Support Email</label>
                            <input type="email" defaultValue="support@propmatch.com" className="w-full bg-brand-black border border-brand-border rounded-lg px-4 py-2 text-white focus:border-brand-gold outline-none" />
                        </div>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white border-b border-brand-border pb-2">Feature Toggles</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-brand-black/30 rounded-lg border border-brand-border">
                            <div>
                                <p className="text-white font-medium">Public Registrations</p>
                                <p className="text-xs text-brand-muted">Allow new users to create accounts.</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5" />
                                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-brand-border cursor-pointer checked:bg-brand-gold"></label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-brand-black/30 rounded-lg border border-brand-border">
                            <div>
                                <p className="text-white font-medium">Maintenance Mode</p>
                                <p className="text-xs text-brand-muted">Disable public access to the site.</p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer right-5" />
                                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-brand-border cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-brand-border flex justify-end">
                    <button className="flex items-center gap-2 bg-brand-gold text-brand-black px-6 py-2.5 rounded-lg font-bold hover:bg-brand-goldHover transition-colors shadow-lg shadow-brand-gold/20">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
