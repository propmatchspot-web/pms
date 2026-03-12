import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, Zap, ArrowRight, Target, Eye, Heart, CheckCircle2, Award, Clock, Globe } from 'lucide-react';

const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-24">

            {/* ====== Hero ====== */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.08),transparent)]"></div>
                <div className="absolute top-1/3 left-0 w-[400px] h-[300px] bg-brand-gold/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-0 w-[300px] h-[200px] bg-amber-500/[0.02] rounded-full blur-[80px] pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-8">
                        <Shield className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">About PropMatchSpot</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                        Built by Traders.<br /><span className="text-gradient-gold">For Traders.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
                        We're on a mission to bring transparency, fairness, and real data to the prop trading industry — so you never have to gamble on a firm again.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        {[
                            { val: '85+', label: 'Firms Listed' },
                            { val: '50K+', label: 'Active Traders' },
                            { val: '$42M+', label: 'Payouts Tracked' },
                            { val: '4.9/5', label: 'Trust Rating' },
                        ].map((stat, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="w-px h-8 bg-white/10 hidden sm:block"></div>}
                                <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-black text-white">{stat.val}</div>
                                    <div className="text-neutral-500 text-[10px] uppercase tracking-wider font-bold">{stat.label}</div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== Our Story ====== */}
            <section className="py-20 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-4">Our Story</div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                                We Were Tired of Getting <span className="text-gradient-gold">Scammed</span>
                            </h2>
                            <div className="space-y-4 text-neutral-400 text-sm leading-relaxed">
                                <p>
                                    Like many of you, we started as traders looking for prop firms. We spent <strong className="text-white">weeks</strong> researching — comparing profit splits on one site, checking payout records on another, reading scattered forum reviews, and hoping we wouldn't pick a firm that vanished with our money.
                                </p>
                                <p>
                                    After losing <strong className="text-white">$800+</strong> to a prop firm with fake reviews and delayed payouts, we decided enough was enough. There had to be a better way.
                                </p>
                                <p>
                                    That's when <strong className="text-brand-gold">PropMatchSpot</strong> was born — a single platform where traders can compare every major firm side-by-side, access verified payout data, read real community reviews, and save money with exclusive deals. All for free.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Cards */}
                        <div className="space-y-4">
                            {[
                                { year: '2023', title: 'The Problem', desc: 'Lost $800+ to a poorly-rated prop firm. Realized there was no reliable way to compare firms.', icon: <Target size={18} /> },
                                { year: '2024', title: 'The Build', desc: 'Built PropMatchSpot from scratch — aggregating data from 50+ firms, creating TrustGuard™ algorithm.', icon: <Zap size={18} /> },
                                { year: '2025', title: 'The Growth', desc: '50,000+ traders, 85+ firms listed, $42M+ in verified payouts tracked, and growing every day.', icon: <TrendingUp size={18} /> },
                            ].map((item, i) => (
                                <div key={i} className="group relative rounded-2xl overflow-hidden">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-gold/20 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                                    <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                    <div className="relative z-[2] p-6 flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-1">{item.year}</div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-neutral-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== What We Do ====== */}
            <section className="py-20 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-4">What We Offer</div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Everything You Need in <span className="text-gradient-gold">One Place</span></h2>
                        <p className="text-neutral-400 max-w-xl mx-auto text-sm">Tools and data that give you an unfair advantage when choosing your prop firm.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: <TrendingUp size={22} />, title: 'Firm Comparison', desc: 'Compare 85+ firms across 50+ data points — profit splits, drawdowns, fees, and more.' },
                            { icon: <Shield size={22} />, title: 'TrustGuard™ Score', desc: 'Our proprietary algorithm analyzes payouts, reviews, and firm reliability in real-time.' },
                            { icon: <Award size={22} />, title: 'Exclusive Deals', desc: "Up to 20% off challenges and 125% refund offers — deals you won't find anywhere else." },
                            { icon: <Users size={22} />, title: 'Community Reviews', desc: '50K+ verified traders sharing honest reviews, payout proofs, and real experiences.' },
                        ].map((item, i) => (
                            <div key={i} className="group relative rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-gold/20 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                <div className="relative z-[2] p-6">
                                    <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== Our Values ====== */}
            <section className="py-20 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-4">Our Values</div>
                        <h2 className="text-3xl md:text-4xl font-black text-white">What We Stand <span className="text-gradient-gold">For</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                icon: <Eye size={24} />,
                                title: 'Radical Transparency',
                                desc: 'No paid rankings, no hidden agendas. Every firm is evaluated with the same criteria. If a firm has issues, we say it — publicly.',
                                highlights: ['Unbiased ratings', 'Public methodology', 'No pay-to-rank'],
                            },
                            {
                                icon: <Heart size={24} />,
                                title: 'Community First',
                                desc: "Our 50,000+ traders are the backbone of this platform. Real reviews, real payout proofs, real experiences. We protect our community from scam firms.",
                                highlights: ['Verified reviews', 'Payout proof required', 'Scam alerts'],
                            },
                            {
                                icon: <Globe size={24} />,
                                title: 'Accessible to All',
                                desc: "PropMatchSpot is 100% free and always will be. Every trader deserves access to quality data, regardless of account size or experience level.",
                                highlights: ['Free forever', 'No sign-up walls', 'Global coverage'],
                            },
                        ].map((item, i) => (
                            <div key={i} className="group relative rounded-2xl overflow-hidden">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-gold/20 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                <div className="relative z-[2] p-8">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                                    <div className="space-y-2">
                                        {item.highlights.map((h, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span className="text-neutral-300 text-xs font-medium">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== Why Traders Trust Us ====== */}
            <section className="py-20 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-gold/15 via-brand-gold/10 to-brand-gold/5"></div>
                        <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                        <div className="relative z-[2] p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <div className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mb-4">Why Us</div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Trusted by <span className="text-gradient-gold">50,000+</span> Traders Worldwide</h2>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">We're not just another comparison site. We're a community-driven platform built on real data, real reviews, and real savings.</p>
                                    <Link to="/firms">
                                        <button className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-bold text-sm rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(246,174,19,0.2)]">
                                            Start Comparing <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: <Clock size={18} />, val: '5 min', label: 'Average research time' },
                                        { icon: <Award size={18} />, val: '$300+', label: 'Average savings per trader' },
                                        { icon: <Shield size={18} />, val: '24/7', label: 'Payout monitoring' },
                                        { icon: <Users size={18} />, val: '85+', label: 'Firms compared' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                                            <div className="text-brand-gold mb-2 flex justify-center">{s.icon}</div>
                                            <div className="text-white font-black text-lg">{s.val}</div>
                                            <div className="text-neutral-500 text-[10px] uppercase tracking-wider font-bold">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== CTA ====== */}
            <section className="py-20 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Find Your Perfect Firm?</h2>
                    <p className="text-neutral-400 text-sm mb-8 max-w-lg mx-auto">Join 50,000+ traders who trust PropMatchSpot to compare, save, and get funded — all for free.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/firms">
                            <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-bold rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(246,174,19,0.25)]">
                                Start Comparing Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/10 hover:border-brand-gold/30 text-white font-bold rounded-2xl transition-all duration-300">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;
