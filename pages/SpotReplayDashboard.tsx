import React, { useState } from 'react'
import { ArrowRight, History, Target, TrendingUp, ShieldCheck, Star, CheckCircle2, Play, Zap, BarChart3, Clock, Users, Award, Monitor, ChevronDown, Repeat, Brain, Layers, DollarSign, ExternalLink } from 'lucide-react'

// FAQ Accordion
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-brand-gold/20' : ''}`}>
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${isOpen ? 'from-brand-gold/10 via-brand-gold/5 to-transparent' : 'from-white/[0.04] via-white/[0.02] to-white/[0.01]'} transition-all duration-300`} />
            <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]" />
            <button onClick={() => setIsOpen(!isOpen)} className="relative z-[2] w-full flex items-center justify-between p-6 text-left">
                <span className={`font-bold ${isOpen ? 'text-brand-gold' : 'text-white'} transition-colors pr-4`}>{question}</span>
                <ChevronDown size={18} className={`text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
            </button>
            <div className={`relative z-[2] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    )
}

export default function SpotReplayDashboard() {

    return (
        <div className="flex flex-col min-h-screen bg-[#181611] overflow-x-hidden font-sans">

            {/* INLINE ANIMATIONS */}
            <style>{`
        .text-gradient-gold {
          background: linear-gradient(to right, #f6ae13, #fde68a, #f6ae13);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: textShimmer 3s linear infinite;
        }
        @keyframes textShimmer { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
        @keyframes gridFlow { 0% { transform: translateY(0) } 100% { transform: translateY(40px) } }
        @keyframes aurora { 0% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; } 50% { transform: translate(-50%, -55%) scale(1.2); opacity: 0.25; } 100% { transform: translate(-45%, -50%) scale(1.1); opacity: 0.15; } }
        @keyframes shine { 0% { left: -100%; opacity: 0; } 20% { left: 100%; opacity: 0.6; } 100% { left: 100%; opacity: 0; } }
        @keyframes float-main { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(-2deg); } }
        @keyframes float-side-1 { 0%, 100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        @keyframes float-side-2 { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(-4deg); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .hero-card {
          background: rgba(24, 22, 17, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(246, 174, 19, 0.15);
          border-radius: 20px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px -10px rgba(246, 174, 19, 0.15);
        }
        .hero-card-secondary {
          background: rgba(34, 28, 16, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }
        .bento-feature {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bento-feature:hover { transform: translateY(-4px); }
      `}</style>

            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 1 — HERO                                                   */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="relative pt-20 pb-0 lg:pt-24 overflow-hidden min-h-screen flex flex-col justify-center">

                {/* Dynamic Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-black" />
                    <div className="absolute inset-x-0 bottom-0 h-[80vh] opacity-40" style={{ perspective: '1000px' }}>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px] origin-bottom" style={{ transform: 'rotateX(60deg)', animation: 'gridFlow 20s linear infinite' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
                    </div>
                    <div className="absolute top-1/2 left-1/3 w-[1000px] h-[600px] bg-brand-gold/15 rounded-[100%] blur-[120px] mix-blend-screen" style={{ animation: 'aurora 10s ease-in-out infinite alternate' }} />
                    <div className="absolute top-[35%] left-[55%] w-[700px] h-[500px] bg-yellow-500/8 rounded-[100%] blur-[100px] mix-blend-screen" style={{ animation: 'pulse-gold 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
                </div>

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-4 mt-4 md:mt-6 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-7 text-left">
                            <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-brand-gold/20 rounded-full pl-3 pr-5 py-2 mb-8 backdrop-blur-xl shadow-[0_0_25px_-5px_rgba(246,174,19,0.2)] hover:border-brand-gold/50 transition-all cursor-default animate-fade-in-up md:mt-10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
                                </span>
                                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Spot Replay Engine Live</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <span className="text-gradient-gold inline-block pb-1">BACKTEST YOUR EDGE ACROSS ALL ASSETS</span>
                            </h1>

                            <p className="max-w-xl text-lg md:text-xl text-brand-muted mb-10 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                The institutional-grade backtesting platform for serious traders. Simulate real historical data, execute trades on TradingView charts, and refine your approach — zero risk.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <a
                                    href="https://replay.propmatchspot.com/signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-full sm:w-auto min-w-[240px] px-8 py-4 bg-brand-gold text-black font-bold text-lg tracking-wide rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(246,174,19,0.6)] hover:shadow-[0_0_60px_-5px_rgba(247,174,17,0.7)] hover:scale-105 transition-all duration-300 text-center"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_6s_ease-in-out_infinite] group-hover:animate-none group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Start Backtesting Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </a>
                                <a
                                    href="https://replay.propmatchspot.com/login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-full sm:w-auto min-w-[240px] px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium text-lg tracking-wide rounded-xl overflow-hidden hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300 text-center"
                                >
                                    <span className="relative flex items-center justify-center gap-2">
                                        <History size={20} className="text-brand-gold group-hover:-rotate-45 transition-transform" />
                                        Sign In
                                    </span>
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-5 pt-8 border-t border-brand-border animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="flex -space-x-3">
                                    {['bg-brand-gold', 'bg-amber-600', 'bg-yellow-700'].map((bg, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-brand-black ${bg} flex items-center justify-center text-black font-bold text-sm shadow-lg`} style={{ zIndex: 30 - i * 10 }}>
                                            {['JT', 'MK', 'AS'][i]}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-0.5 mb-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />)}
                                    </div>
                                    <span className="text-brand-muted text-sm font-medium">1M+ candles replayed by traders</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Floating Dashboard Cards */}
                        <div className="lg:col-span-5 relative w-full hidden lg:flex items-center justify-center h-[580px]">

                            {/* MAIN CARD */}
                            <div className="hero-card w-[92%] p-0 relative z-30" style={{ animation: 'float-main 7s ease-in-out infinite' }}>
                                <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Replay Engine</span>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">Live</span>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6 text-brand-gold" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">EURUSD — 15m</h4>
                                            <p className="text-neutral-500 text-xs">Session: Asian Breakout</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                                        {[
                                            { label: 'Balance', val: '$102,450' },
                                            { label: 'Win Rate', val: '68.5%' },
                                            { label: 'Trades', val: '42' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                                                <p className="text-[8px] text-neutral-500 uppercase tracking-wider font-semibold mb-0.5">{s.label}</p>
                                                <p className="text-white font-bold text-sm">{s.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Mini chart lines */}
                                    <div className="h-16 flex items-end gap-[3px] px-1">
                                        {[35, 42, 38, 50, 55, 48, 60, 52, 65, 58, 70, 75, 68, 72, 80, 78, 85, 82, 88, 90, 84, 87, 92, 95].map((h, i) => (
                                            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-gold/40 to-brand-gold/80 transition-all" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* FLOAT CARD: Speed controls */}
                            <div className="hero-card-secondary absolute -left-8 bottom-[8%] z-40 w-[200px] p-4" style={{ animation: 'float-side-1 8s ease-in-out infinite' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Playing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {['1x', '2x', '5x', '10x'].map((s, i) => (
                                        <div key={i} className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${i === 2 ? 'bg-brand-gold text-black' : 'bg-white/5 text-neutral-500 border border-white/5'}`}>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FLOAT CARD: Quick stat */}
                            <div className="hero-card-secondary absolute -right-4 top-[5%] z-40 w-[180px] p-4" style={{ animation: 'float-side-2 9s ease-in-out infinite' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-brand-gold" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Net P&L</p>
                                        <p className="font-bold text-lg leading-none text-emerald-400">+$2,450</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-2.5 py-1.5 border border-green-500/15">
                                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                                    <span className="text-green-400 text-[10px] font-semibold">Risk-free mode</span>
                                </div>
                            </div>

                            <div className="absolute top-[10%] right-0 w-40 h-40 rounded-full bg-brand-gold/10 blur-[60px] pointer-events-none" />
                            <div className="absolute bottom-[15%] left-0 w-48 h-48 rounded-full bg-yellow-500/8 blur-[80px] pointer-events-none" />
                        </div>

                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 2 — HOW IT WORKS (3-Step Flow)                            */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="py-24 relative z-20 overflow-hidden bg-[#0c0b09]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <Repeat className="w-4 h-4 text-brand-gold" />
                            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">How It Works</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Three Steps to <span className="text-gradient-gold">Mastery</span>
                        </h2>
                        <p className="text-brand-muted max-w-2xl mx-auto text-lg">
                            From session setup to strategy refinement — the complete workflow takes under 60 seconds to begin.
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                        {[
                            {
                                step: '01',
                                icon: Target,
                                title: 'Configure Your Session',
                                desc: 'Choose your asset (Forex, Crypto, Indices), set a time range, pick your strategy, and define your starting balance. Our wizard guides you in 4 easy steps.',
                                detail: 'Prop Firm simulation mode included',
                                color: 'brand-gold'
                            },
                            {
                                step: '02',
                                icon: Play,
                                title: 'Replay & Execute',
                                desc: 'Watch the market unfold candle-by-candle on real TradingView charts. Place market, limit, and stop orders with full SL/TP management — just like live trading.',
                                detail: 'Adjustable speed: 1x to 50x',
                                color: 'brand-gold'
                            },
                            {
                                step: '03',
                                icon: BarChart3,
                                title: 'Analyze & Improve',
                                desc: 'Review your trades, track performance metrics, monitor your P&L curve, and identify patterns in your strategy. Iterate until your edge is razor-sharp.',
                                detail: 'Full trade journal + analytics',
                                color: 'brand-gold'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bento-feature relative rounded-[24px] overflow-hidden group">
                                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-white/[0.01] group-hover:from-brand-gold/20 group-hover:via-brand-gold/5 group-hover:to-transparent transition-all duration-500" />
                                <div className="absolute inset-[1px] rounded-[23px] bg-[#0c0b09]" />
                                <div className="relative z-10 p-8 lg:p-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shadow-[0_0_20px_rgba(246,174,19,0.15)] group-hover:shadow-[0_0_30px_rgba(246,174,19,0.3)] transition-all">
                                            <item.icon className="w-6 h-6 text-brand-gold" />
                                        </div>
                                        <span className="text-5xl font-black text-white/5 group-hover:text-brand-gold/10 transition-colors">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">{item.desc}</p>
                                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                                        <span className="text-xs font-semibold text-neutral-300">{item.detail}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 3 — FEATURES BENTO GRID                                   */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="py-24 relative z-20 overflow-hidden bg-[#181611]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />

                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <Layers className="w-4 h-4 text-brand-gold" />
                            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Feature Arsenal</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Everything You Need to <span className="text-gradient-gold">Win</span>
                        </h2>
                        <p className="text-brand-muted max-w-2xl mx-auto text-lg">
                            Built by traders, for traders. Every feature exists because we needed it ourselves.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                icon: Monitor,
                                title: 'TradingView Charts',
                                desc: 'Professional-grade charts with all indicators, drawing tools, and timeframes you love. Not a toy chart — the real thing.',
                                badge: 'Core'
                            },
                            {
                                icon: Clock,
                                title: 'Speed Controls',
                                desc: 'Play, pause, step forward, rewind. Adjust speed from 1x to 50x. Skip boring consolidation, study volatile sessions closely.',
                                badge: 'Essential'
                            },
                            {
                                icon: DollarSign,
                                title: 'Order Management',
                                desc: 'Place market, limit, and stop orders. Set stop-loss and take-profit. Manage positions exactly like a real broker environment.',
                                badge: 'Pro'
                            },
                            {
                                icon: Award,
                                title: 'Prop Firm Simulation',
                                desc: 'Practice for prop firm challenges with real drawdown limits, profit targets, minimum trading days, and time limits — pass before you pay.',
                                badge: 'Exclusive'
                            },
                            {
                                icon: Brain,
                                title: 'Multi-Asset Support',
                                desc: 'Forex majors, crypto pairs, gold, indices — all supported with high-quality historical data from verified sources.',
                                badge: 'Versatile'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Performance Analytics',
                                desc: 'Track win rate, P&L curve, drawdown, best/worst trades, and more. Understand your strengths and fix your leaks.',
                                badge: 'Analytics'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="bento-feature relative rounded-[20px] overflow-hidden group">
                                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-white/[0.01] group-hover:from-brand-gold/15 group-hover:via-brand-gold/5 group-hover:to-transparent transition-all duration-500" />
                                <div className="absolute inset-[1px] rounded-[19px] bg-[#0f0e0b]" />
                                <div className="relative z-10 p-7">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(246,174,19,0.2)] transition-all">
                                            <feature.icon className="w-5 h-5 text-brand-gold" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold px-2.5 py-1 rounded-full border border-brand-gold/20">
                                            {feature.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{feature.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 4 — COMPARISON TABLE                                      */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="py-24 relative z-20 overflow-hidden bg-[#0c0b09]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <ShieldCheck className="w-4 h-4 text-brand-gold" />
                            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Why Spot Replay</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            <span className="text-gradient-gold">Unfair Advantage</span> Over Competitors
                        </h2>
                        <p className="text-brand-muted max-w-2xl mx-auto text-lg">
                            Most replay tools charge $50-100/month. We give you institutional-grade power for free.
                        </p>
                    </div>

                    {/* Table */}
                    <div className="relative rounded-[24px] overflow-hidden">
                        <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-brand-gold/10 via-brand-gold/5 to-transparent" />
                        <div className="absolute inset-[1px] rounded-[23px] bg-[#0c0b09]" />

                        <div className="relative z-10 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left p-5 text-neutral-500 font-bold uppercase text-xs tracking-widest">Feature</th>
                                        <th className="text-center p-5">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-brand-gold font-black text-lg">Spot Replay</span>
                                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">FREE</span>
                                            </div>
                                        </th>
                                        <th className="text-center p-5 text-neutral-400 font-bold">Others</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ['TradingView Charts', true, false],
                                        ['Prop Firm Simulation', true, false],
                                        ['Real Market Data', true, true],
                                        ['Multi-Asset (Forex + Crypto)', true, false],
                                        ['Order Management (SL/TP)', true, true],
                                        ['Speed Control (1x-50x)', true, true],
                                        ['Free Tier', true, false],
                                        ['No Credit Card Required', true, false],
                                    ].map(([feature, us, them], i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 pl-5 text-neutral-300 font-medium">{feature as string}</td>
                                            <td className="p-4 text-center">
                                                {us
                                                    ? <CheckCircle2 className="w-5 h-5 text-brand-gold mx-auto" />
                                                    : <span className="text-red-400 text-lg">✕</span>
                                                }
                                            </td>
                                            <td className="p-4 text-center">
                                                {them
                                                    ? <CheckCircle2 className="w-5 h-5 text-neutral-600 mx-auto" />
                                                    : <span className="text-red-400/60 text-lg">✕</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 5 — PRICING PLANS                                         */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="py-24 relative z-20 overflow-hidden bg-[#181611]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <DollarSign className="w-4 h-4 text-brand-gold" />
                            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Pricing</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Simple, <span className="text-gradient-gold">Transparent</span> Pricing
                        </h2>
                        <p className="text-brand-muted max-w-2xl mx-auto text-lg">
                            Start free. Upgrade when you're ready to go unlimited.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-[900px] mx-auto">

                        {/* ── SPOT BASIC (FREE) ── */}
                        <div className="bento-feature relative rounded-[24px] overflow-hidden group">
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-white/[0.01]" />
                            <div className="absolute inset-[1px] rounded-[23px] bg-[#0f0e0b]" />
                            <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1 mb-4">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Free Forever</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-1">Spot Basic</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">$0</span>
                                        <span className="text-neutral-500 text-sm">/month</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3.5 mb-8 flex-1">
                                    {[
                                        'Up to 1 year of backtest data',
                                        '1 live session at a time',
                                        'TradingView charts',
                                        'Order management (SL/TP)',
                                        'Speed controls (1x-10x)',
                                        'Basic analytics',
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                                            <span className="text-neutral-300 text-sm">{f}</span>
                                        </div>
                                    ))}
                                    {[
                                        'Unlimited sessions',
                                        'Full historical data',
                                        'Speed up to 50x',
                                    ].map((f, i) => (
                                        <div key={`no-${i}`} className="flex items-center gap-3 opacity-40">
                                            <span className="w-4 h-4 flex items-center justify-center text-neutral-600 text-xs flex-shrink-0">✕</span>
                                            <span className="text-neutral-500 text-sm line-through">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <a
                                    href="https://replay.propmatchspot.com/signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-center py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-gold/30 transition-all duration-300 text-center"
                                >
                                    Get Started Free
                                </a>
                            </div>
                        </div>

                        {/* ── SPOT EXCLUSIVE ($39/mo) ── */}
                        <div className="bento-feature relative rounded-[24px] overflow-hidden group">
                            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-brand-gold/30 via-brand-gold/10 to-brand-gold/5" />
                            <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-b from-[#1a1508] to-[#0f0e0b]" />
                            {/* Popular badge */}
                            <div className="absolute top-4 right-4 z-20">
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-brand-gold text-black px-3 py-1 rounded-full shadow-[0_0_20px_rgba(246,174,19,0.4)]">Most Popular</span>
                            </div>
                            <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 mb-4">
                                        <Award className="w-3 h-3 text-brand-gold" />
                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Unlimited Power</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-gold mb-1">Spot Exclusive</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">$39</span>
                                        <span className="text-neutral-500 text-sm">/month</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3.5 mb-8 flex-1">
                                    {[
                                        'Unlimited historical data (all years)',
                                        'Unlimited live sessions',
                                        'TradingView charts',
                                        'Order management (SL/TP)',
                                        'Speed controls (1x-50x)',
                                        'Advanced analytics & P&L curves',
                                        'Prop Firm simulation mode',
                                        'Priority data loading',
                                        'Early access to new features',
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" />
                                            <span className="text-neutral-200 text-sm">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA — NOWPayments Crypto Checkout */}
                                <a
                                    href="https://nowpayments.io/payment/?iid=4409214177"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn relative w-full flex justify-center py-3.5 px-6 rounded-xl text-sm font-bold text-black bg-brand-gold hover:bg-white transition-all duration-300 text-center overflow-hidden shadow-[0_0_30px_-5px_rgba(246,174,19,0.5)]"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_6s_ease-in-out_infinite]" />
                                    <span className="relative flex items-center gap-2">
                                        Pay with Crypto <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 6 — FAQ + FINAL CTA                                       */}
            {/* ════════════════════════════════════════════════════════════════════ */}
            <section className="py-24 relative z-20 overflow-hidden bg-[#181611]">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent" />

                <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <Zap className="w-4 h-4 text-brand-gold" />
                            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">FAQ</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                            Questions? <span className="text-gradient-gold">Answered.</span>
                        </h2>
                    </div>

                    <div className="space-y-3 mb-20">
                        <FaqItem
                            question="Is Spot Replay really free?"
                            answer="Yes! The core backtesting engine is completely free. You can create sessions, replay market data, place trades, and analyze your performance without paying a cent. Premium features like unlimited sessions and advanced analytics are available with an upgrade."
                        />
                        <FaqItem
                            question="What markets can I replay?"
                            answer="Currently we support all major Forex pairs (EUR/USD, GBP/JPY, etc.), cryptocurrencies (BTC, ETH, and more via Binance), and gold (XAU/USD). We're actively adding indices and stocks."
                        />
                        <FaqItem
                            question="How realistic is the simulation?"
                            answer="Very realistic. We use real historical tick data — no fabricated candles. The order execution engine simulates slippage and fills orders at market prices, just like a real broker. You get TradingView charts with all the indicators and tools you use in live trading."
                        />
                        <FaqItem
                            question="Can I practice for prop firm challenges?"
                            answer="Absolutely! Our Prop Firm Simulation mode lets you configure daily drawdown limits, max drawdown, profit targets, minimum trading days, and time limits. Practice passing FTMO, Funding Pips, or any prop firm challenge before spending real money."
                        />
                        <FaqItem
                            question="Do I need a TradingView subscription?"
                            answer="No. The TradingView charts are built into Spot Replay — you don't need a separate TradingView account or subscription. All chart features, indicators, and drawing tools are included."
                        />
                        <FaqItem
                            question="How is my data saved?"
                            answer="All your sessions, trades, and progress are saved to your account automatically. You can close the browser, come back later, and resume exactly where you left off. Nothing is lost."
                        />
                    </div>

                    {/* Final CTA */}
                    <div className="relative rounded-[28px] overflow-hidden">
                        <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-brand-gold/20 via-brand-gold/10 to-brand-gold/5" />
                        <div className="absolute inset-[1px] rounded-[27px] bg-gradient-to-b from-[#1a1508] to-[#0c0b09]" />
                        <div className="relative z-10 py-16 px-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(246,174,19,0.2)]">
                                <Zap className="w-8 h-8 text-brand-gold" />
                            </div>
                            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                                Ready to Master the Markets?
                            </h3>
                            <p className="text-brand-muted text-lg max-w-lg mx-auto mb-8">
                                Join thousands of traders who are sharpening their edge with Spot Replay. No credit card needed.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="https://replay.propmatchspot.com/signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative w-full sm:w-auto min-w-[260px] px-8 py-4 bg-brand-gold text-black font-bold text-lg tracking-wide rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(246,174,19,0.6)] hover:shadow-[0_0_60px_-5px_rgba(247,174,17,0.7)] hover:scale-105 transition-all duration-300 text-center"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_6s_ease-in-out_infinite]" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Start Backtesting Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </a>
                                <a
                                    href="https://replay.propmatchspot.com/login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto min-w-[200px] px-8 py-4 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-xl hover:bg-white/10 hover:border-brand-gold/50 transition-all text-center"
                                >
                                    Sign In →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
