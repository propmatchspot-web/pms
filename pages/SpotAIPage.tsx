import React, { useState } from 'react';
import { PropFirm } from '../types';
import { Loader2, Zap, ArrowRight, CheckCircle2, RefreshCcw, Star, BarChart3, DollarSign, ShieldAlert, MonitorSmartphone, Target, TrendingUp, Activity } from 'lucide-react';
import { determineGroqMatch, QuizPreferences } from '../services/groqService';
import { supabase } from '../lib/supabaseClient';
import { mapFirmFromDB } from '../lib/services';
import { Link } from 'react-router-dom';

const QUESTIONS = [
    {
        key: 'experienceLevel',
        question: "What's your trading experience?",
        subtitle: 'We tailor firm recommendations to your skill level.',
        icon: Target,
        options: [
            { value: 'Beginner', label: 'Beginner', desc: 'Less than 1 year of trading', emoji: '🌱' },
            { value: 'Intermediate', label: 'Intermediate', desc: '1-3 years, consistent strategy', emoji: '📈' },
            { value: 'Advanced', label: 'Advanced', desc: '3+ years, profitable track record', emoji: '🎯' },
            { value: 'Professional', label: 'Professional', desc: 'Full-time trader or fund manager', emoji: '🏆' },
        ]
    },
    {
        key: 'tradingStyle',
        question: "How do you trade?",
        subtitle: 'This helps us match you with firms that support your strategy.',
        icon: Activity,
        options: [
            { value: 'Scalping', label: 'Scalping', desc: 'Quick in-and-out trades, seconds to minutes', emoji: '⚡' },
            { value: 'Day Trading', label: 'Day Trading', desc: 'Positions opened and closed within the day', emoji: '☀️' },
            { value: 'Swing Trading', label: 'Swing Trading', desc: 'Multi-day positions, riding momentum', emoji: '🌊' },
            { value: 'Algorithmic', label: 'Algorithmic', desc: 'Automated bots and systematic strategies', emoji: '🤖' },
        ]
    },
    {
        key: 'budget',
        question: "Budget for your first challenge?",
        subtitle: 'We only recommend firms within your price range.',
        icon: DollarSign,
        options: [
            { value: 50, label: 'Up to $50', desc: 'Micro accounts, lowest entry', emoji: '💵' },
            { value: 100, label: 'Up to $100', desc: 'Popular starter challenges', emoji: '💰' },
            { value: 250, label: 'Up to $250', desc: 'Mid-range with more flexibility', emoji: '💎' },
            { value: 500, label: 'Up to $500', desc: 'Premium challenges, bigger accounts', emoji: '🏦' },
            { value: 1000, label: '$500+', desc: 'Maximum account sizes & benefits', emoji: '👑' },
        ]
    },
    {
        key: 'riskAppetite',
        question: "What's your risk tolerance?",
        subtitle: 'Different firms have different drawdown rules.',
        icon: ShieldAlert,
        options: [
            { value: 'Conservative (Low Drawdown)', label: 'Conservative', desc: 'Low drawdown limits, steady growth', emoji: '🛡️' },
            { value: 'Moderate', label: 'Moderate', desc: 'Balanced risk, standard rules', emoji: '⚖️' },
            { value: 'Aggressive (High Leverage)', label: 'Aggressive', desc: 'High leverage, bigger targets', emoji: '🔥' },
        ]
    },
    {
        key: 'preferredPlatform',
        question: "Preferred trading platform?",
        subtitle: 'We\'ll ensure your firm supports your favorite platform.',
        icon: MonitorSmartphone,
        options: [
            { value: 'MT4', label: 'MetaTrader 4', desc: 'Classic & widely supported', emoji: '📊' },
            { value: 'MT5', label: 'MetaTrader 5', desc: 'Modern with more asset classes', emoji: '📈' },
            { value: 'cTrader', label: 'cTrader', desc: 'Fast execution, advanced charting', emoji: '⚡' },
            { value: 'TradingView', label: 'TradingView', desc: 'Browser-based, social features', emoji: '🌐' },
        ]
    }
];

const SpotAIPage: React.FC = () => {
    const [step, setStep] = useState(-1); // -1 = welcome screen
    const [answers, setAnswers] = useState<Partial<QuizPreferences>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{ firm: PropFirm; explanation: string } | null>(null);

    const handleOptionSelect = async (key: string, value: any) => {
        const newAnswers = { ...answers, [key]: value };
        setAnswers(newAnswers);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsAnalyzing(true);
            await processResults(newAnswers as QuizPreferences);
        }
    };

    const processResults = async (finalAnswers: QuizPreferences) => {
        const aiResult = await determineGroqMatch(finalAnswers);
        let winningFirm: PropFirm | null = null;
        if (aiResult.firmId) {
            const { data, error } = await supabase
                .from('firms').select('*, challenges(*)').eq('id', aiResult.firmId).single();
            if (!error && data) winningFirm = mapFirmFromDB(data);
        }
        if (!winningFirm) {
            const { data } = await supabase.from('firms').select('*, challenges(*)').eq('status', 'active').limit(1);
            if (data && data[0]) winningFirm = mapFirmFromDB(data[0]);
        }
        if (winningFirm) setResult({ firm: winningFirm, explanation: aiResult.explanation });
        setIsAnalyzing(false);
    };

    // ────────── Loading State ──────────
    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-lg mx-auto text-center px-6 relative z-10">
                    <div className="relative mb-10 inline-block">
                        <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-25 animate-pulse scale-150"></div>
                        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-gold/20 to-amber-500/10 border border-brand-gold/30 flex items-center justify-center">
                            <Loader2 className="w-14 h-14 text-brand-gold animate-spin" />
                        </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-3">Analyzing Your Profile</h3>
                    <p className="text-neutral-500 text-sm mb-8">Spot AI is processing live data from 85+ firms</p>
                    <div className="space-y-4 max-w-sm mx-auto">
                        {[
                            { text: 'Scanning firm database...', delay: '0ms' },
                            { text: 'Verifying payout records...', delay: '600ms' },
                            { text: 'Matching risk profile...', delay: '1200ms' },
                            { text: 'Calculating compatibility...', delay: '1800ms' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-left animate-pulse" style={{ animationDelay: item.delay }}>
                                <div className="w-2 h-2 rounded-full bg-brand-gold shrink-0"></div>
                                <span className="text-neutral-400 text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ────────── Result State ──────────
    if (result) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(246,174,19,0.06),transparent)]"></div>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-brand-gold/10 rounded-2xl mb-6 ring-1 ring-brand-gold/30 shadow-[0_0_40px_rgba(246,174,19,0.2)]">
                            <Zap className="w-8 h-8 text-brand-gold animate-pulse" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Spot AI <span className="text-gradient-gold">Match</span> Found
                        </h2>
                        <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                            Our AI analyzed your profile against 85+ firms and found your perfect match.
                        </p>
                    </div>

                    {/* Result Card */}
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-gold/15 via-brand-gold/10 to-brand-gold/5"></div>
                        <div className="absolute inset-[1px] rounded-3xl bg-[#0c0b09]"></div>
                        <div className="relative z-[2]">
                            <div className="bg-gradient-to-r from-brand-gold/20 to-amber-500/20 p-2 flex justify-center">
                                <span className="text-xs font-bold tracking-widest text-white uppercase flex items-center">
                                    <CheckCircle2 className="w-3 h-3 mr-2 text-emerald-400" /> 98% Compatibility Score
                                </span>
                            </div>
                            <div className="p-8 md:p-10">
                                <div className="flex items-start md:items-center flex-col md:flex-row gap-6 mb-8 border-b border-white/5 pb-8">
                                    <img src={result.firm.logo} className="w-20 h-20 rounded-2xl bg-[#161611] border border-white/10 shadow-lg object-contain p-2" alt={result.firm.name} />
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-white mb-2">{result.firm.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.firm.tags.slice(0, 4).map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white/5 border border-white/10 rounded-full text-neutral-300">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 text-center min-w-[130px]">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                                            <span className="text-white font-black text-xl">{result.firm.rating}</span>
                                        </div>
                                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Trust Score</div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#161611] to-[#0c0b09] p-6 rounded-2xl border border-brand-gold/15 mb-8 relative overflow-hidden">
                                    <div className="absolute top-4 right-4 text-brand-gold/[0.06]"><Zap className="w-16 h-16 transform -rotate-12" /></div>
                                    <h4 className="text-xs font-bold text-brand-gold mb-4 flex items-center uppercase tracking-widest">
                                        <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping mr-2"></span>
                                        Spot AI Intel Report
                                    </h4>
                                    <p className="text-neutral-300 text-base leading-relaxed font-light italic relative z-10">"{result.explanation}"</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                    {[
                                        { label: 'Profit Split', val: result.firm.profitSplit },
                                        { label: 'Max Drawdown', val: result.firm.drawdown },
                                        { label: 'Max Funding', val: `$${(result.firm.maxFunding / 1000).toFixed(0)}K` },
                                        { label: 'Platforms', val: result.firm.platforms.slice(0, 2).join(', ') },
                                    ].map((s, i) => (
                                        <div key={i} className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mb-1">{s.label}</div>
                                            <div className="text-white font-bold text-sm">{s.val}</div>
                                        </div>
                                    ))}
                                </div>
                                <Link to={`/firm/${result.firm.id}`}>
                                    <button className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(246,174,19,0.25)] hover:shadow-[0_4px_30px_rgba(246,174,19,0.4)]">
                                        View {result.firm.name} Details <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <button onClick={() => { setStep(-1); setResult(null); setAnswers({}); }} className="text-neutral-500 hover:text-white text-sm flex items-center justify-center mx-auto transition-colors gap-2">
                            <RefreshCcw className="w-4 h-4" /> Retake Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ────────── Welcome / Intro Screen ──────────
    if (step === -1) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(246,174,19,0.08),transparent)]"></div>
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-brand-gold/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        {/* Animated AI icon */}
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 animate-pulse scale-150"></div>
                            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-gold/20 to-amber-500/10 border border-brand-gold/30 flex items-center justify-center shadow-[0_0_60px_rgba(246,174,19,0.15)]">
                                <Zap className="w-12 h-12 text-brand-gold" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1]">
                            Meet <span className="text-gradient-gold">Spot AI</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto leading-relaxed mb-4">
                            Your personal prop firm matchmaker. Answer 5 quick questions and our AI will analyze 85+ firms to find your perfect match.
                        </p>
                        <p className="text-neutral-600 text-sm mb-10">
                            ⏱ Takes less than 60 seconds · 🔒 No sign-up required · ⚡ Powered by AI
                        </p>

                        <button
                            onClick={() => setStep(0)}
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-gold to-amber-500 text-black font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(246,174,19,0.3)] hover:shadow-[0_4px_40px_rgba(246,174,19,0.5)] hover:scale-[1.02]"
                        >
                            Start Matching <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Feature pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {[
                            { icon: <BarChart3 size={18} />, title: 'Data-Driven', desc: 'Analyzes live data from 85+ verified firms' },
                            { icon: <Target size={18} />, title: 'Personalized', desc: 'Matches your style, budget, and risk level' },
                            { icon: <TrendingUp size={18} />, title: 'Proven', desc: '50K+ traders matched with their ideal firm' },
                        ].map((item, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden group">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-white/[0.01] group-hover:from-brand-gold/15 group-hover:via-brand-gold/5 group-hover:to-transparent transition-all duration-500"></div>
                                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                                <div className="relative z-[2] p-5 text-center">
                                    <div className="text-brand-gold mb-3 flex justify-center">{item.icon}</div>
                                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-neutral-500 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ────────── Quiz State ──────────
    const currentQ = QUESTIONS[step];
    const StepIcon = currentQ.icon;

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(246,174,19,0.05),transparent)]"></div>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header with step dots */}
                <div className="mb-10">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        {QUESTIONS.map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${i < step ? 'bg-brand-gold text-black' :
                                        i === step ? 'bg-brand-gold/20 border-2 border-brand-gold text-brand-gold shadow-[0_0_15px_rgba(246,174,19,0.2)]' :
                                            'bg-white/[0.04] border border-white/10 text-neutral-600'
                                    }`}>
                                    {i < step ? <CheckCircle2 size={16} /> : i + 1}
                                </div>
                                {i < QUESTIONS.length - 1 && (
                                    <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${i < step ? 'bg-brand-gold' : 'bg-white/10'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-4">
                            <StepIcon className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Step {step + 1} of {QUESTIONS.length}</span>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01]"></div>
                    <div className="absolute inset-[1px] rounded-3xl bg-[#0c0b09]"></div>
                    <div className="relative z-[2] p-8 md:p-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/[0.03] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight relative z-10">{currentQ.question}</h2>
                        <p className="text-neutral-500 text-sm mb-8 relative z-10">{currentQ.subtitle}</p>

                        <div className="space-y-3 relative z-10">
                            {currentQ.options.map((opt: any, idx: number) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleOptionSelect(currentQ.key, opt.value)}
                                    className="w-full text-left p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 flex items-center gap-4 group hover:shadow-[0_0_20px_rgba(246,174,19,0.08)]"
                                >
                                    <div className="text-2xl w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-brand-gold/10 group-hover:border-brand-gold/20 transition-all">
                                        {opt.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-base text-white group-hover:text-brand-gold transition-colors">{opt.label}</div>
                                        <div className="text-neutral-500 text-xs mt-0.5">{opt.desc}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-gold text-neutral-600 group-hover:text-black transition-all shrink-0">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom info */}
                <div className="flex items-center justify-center gap-6 mt-8 text-neutral-600 text-xs">
                    <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-brand-gold" /> AI-Powered
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Free Forever
                    </span>
                    <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-brand-gold" /> 85+ Firms
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SpotAIPage;
