import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const ContactUsPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:support@propmatchspot.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="min-h-screen bg-black pt-24">
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6">
                        <MessageSquare className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Contact <span className="text-gradient-gold">Us</span>
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or partnership inquiry? We'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="pb-20 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-5">
                            {[
                                { icon: <Mail size={20} />, title: 'Email Us', value: 'support@propmatchspot.com', href: 'mailto:support@propmatchspot.com' },
                                { icon: <Phone size={20} />, title: 'Call Us', value: '+91 88825 11483', href: 'tel:+918882511483' },
                                { icon: <MapPin size={20} />, title: 'Location', value: 'Remote — Serving traders worldwide', href: '' },
                            ].map((item, i) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden group">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-gold/20 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                                    <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                    <div className="relative z-[2] p-6 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold mb-1">{item.title}</div>
                                            {item.href ? (
                                                <a href={item.href} className="text-neutral-400 text-sm hover:text-brand-gold transition-colors">{item.value}</a>
                                            ) : (
                                                <p className="text-neutral-400 text-sm">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="relative rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-gold/15 via-brand-gold/10 to-brand-gold/5"></div>
                                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                <div className="relative z-[2] p-6">
                                    <div className="text-white font-bold mb-2">Response Time</div>
                                    <p className="text-neutral-400 text-sm">We typically respond within <span className="text-brand-gold font-bold">24 hours</span> on business days.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01]"></div>
                            <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                            <div className="relative z-[2] p-8">
                                <h3 className="text-xl font-black text-white mb-6">Send us a Message</h3>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Name</label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40 transition-colors placeholder:text-neutral-600" placeholder="Your name" />
                                        </div>
                                        <div>
                                            <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
                                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40 transition-colors placeholder:text-neutral-600" placeholder="you@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Subject</label>
                                        <input type="text" required value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40 transition-colors placeholder:text-neutral-600" placeholder="How can we help?" />
                                    </div>
                                    <div>
                                        <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">Message</label>
                                        <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/40 transition-colors placeholder:text-neutral-600 resize-none" placeholder="Tell us more..." />
                                    </div>
                                    <button type="submit" className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-black font-bold rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(246,174,19,0.2)]">
                                        <Send size={16} /> Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUsPage;
