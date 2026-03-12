import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Award, ChevronRight, Users, Zap, CheckCircle2, ArrowRight, LineChart, Bookmark, Star, Cpu, Terminal, ChevronDown, HelpCircle, Sparkles, ShieldCheck, BarChart3, GraduationCap } from 'lucide-react';
import FirmCard from '../components/FirmCard';
import { supabase } from '../lib/supabaseClient';
import { PropFirm } from '../types';

// FAQ Accordion Item Component
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-brand-gold/20' : ''}`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${isOpen ? 'from-brand-gold/10 via-brand-gold/5 to-transparent' : 'from-white/[0.04] via-white/[0.02] to-white/[0.01]'} transition-all duration-300`}></div>
      <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
      <button onClick={() => setIsOpen(!isOpen)} className="relative z-[2] w-full flex items-center justify-between p-6 text-left">
        <span className={`font-bold ${isOpen ? 'text-brand-gold' : 'text-white'} transition-colors pr-4`}>{question}</span>
        <ChevronDown size={18} className={`text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
      </button>
      <div className={`relative z-[2] overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [topFirms, setTopFirms] = useState<PropFirm[]>([]);
  const [activeFirm, setActiveFirm] = useState(0);

  // Showcase firms for the hero widget
  const showcaseFirms = [
    { name: 'FTMO', rating: 4.9, profit: '90%', maxFunding: '$400K', drawdown: '10%', logo: 'https://www.google.com/s2/favicons?domain=ftmo.com&sz=128', tag: 'Most Popular' },
    { name: 'Funding Pips', rating: 4.8, profit: '90%', maxFunding: '$300K', drawdown: '8%', logo: 'https://www.google.com/s2/favicons?domain=fundingpips.com&sz=128', tag: 'Best Rules' },
    { name: 'The5ers', rating: 4.7, profit: '80%', maxFunding: '$250K', drawdown: '6%', logo: 'https://www.google.com/s2/favicons?domain=the5ers.com&sz=128', tag: 'Instant Funding' },
  ];

  // Live payout feed data
  const payoutFeed = [
    { trader: 'M.K.', amount: '$12,400', firm: 'FTMO', time: '2 min ago' },
    { trader: 'S.R.', amount: '$8,200', firm: 'Funding Pips', time: '5 min ago' },
    { trader: 'A.J.', amount: '$22,100', firm: 'The5ers', time: '8 min ago' },
    { trader: 'D.L.', amount: '$5,800', firm: 'E8 Markets', time: '12 min ago' },
  ];

  // Static logos for the infinite ticker - Premium prop firm logos
  const TICKER_LOGOS = [
    { name: 'Goat Funded Trader', logo: 'https://cdn.prod.website-files.com/67b3682cc0f1f956e16efe80/67b3682cc0f1f956e16efe99_Logo%20(76).avif' },
    { name: 'ATS Funded', logo: 'https://atsfunded.com/ats-logo.png' },
    { name: 'Blueberry Funded', logo: 'https://blueberryfunded.com/wp-content/themes/blueberryfunded-xmas/assets/img/logo.svg' },
    { name: 'Funding Pips', logo: 'https://media.propfirmmatch.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg' },
    { name: 'Alpha Capital', logo: 'https://alphacapitalgroup.uk/static/media/companyLogoInitials.879d8bbc8b528b1fd27761f4e43c34a0.svg' },
    { name: 'The5ers', logo: 'https://the5ers.com/images/menu/logo.svg' },
    { name: 'Funded Firm', logo: 'https://www.fundedfirm.com/_next/static/media/log.fa3e1c39.svg' },
    { name: 'FundedNext', logo: 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundednext%20logo_White%20(1).png&w=384&q=75' },
    { name: 'E8 Markets', logo: 'https://e8markets.com/images/logo/logo.svg' },
  ];

  // Duplicate logos for seamless infinite scroll
  const tickerFirms = [...TICKER_LOGOS, ...TICKER_LOGOS, ...TICKER_LOGOS];

  useEffect(() => {
    fetchTopFirms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFirm((prev) => (prev + 1) % showcaseFirms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchTopFirms = async () => {
    try {
      const { data, error } = await supabase
        .from('firms')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;

      if (data) {
        // Helper function to safely get favicon URL
        const getFaviconUrl = (websiteUrl: string | null | undefined, fallbackLogo: string | null) => {
          if (!websiteUrl) return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
          try {
            const hostname = new URL(websiteUrl).hostname;
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
          } catch {
            return fallbackLogo || 'https://placehold.co/400x400/181611/F6AE13?text=No+Logo';
          }
        };

        // Map DB fields to PropFirm type if necessary, or assume direct match
        // Ensure numbers are numbers, etc.
        const mappedFirms: PropFirm[] = data.map(f => ({
          ...f,
          rating: Number(f.rating) || 0,
          maxFunding: Number(f.max_funding) || 0,
          trustScore: Number(f.trust_score) || 95, // Default to 95 if column missing
          reviewCount: Number(f.review_count) || 0,
          profitSplit: f.profit_split || '',
          drawdown: f.drawdown || '',
          tags: f.tags || [],
          // Use Google Favicon Service for consistent high-quality logos
          logo: getFaviconUrl(f.website_url || f.website, f.logo_url),
          name: f.name,
          id: f.id,
          description: f.description || '',
          websiteUrl: f.website_url || f.website,
          affiliateLink: f.affiliate_link,
          promoCode: f.promo_code,
          discountValue: f.discount_value,
          platforms: f.platforms || [],
          paymentMethods: f.payment_methods || [],
          foundedYear: f.founded_year || new Date().getFullYear(),
          minDays: f.min_days || 0,
          maxDays: f.max_days || 0,
          dailyDrawdown: f.daily_drawdown || '',
          profitTarget: f.profit_target || '',
          leverage: f.leverage || '',
          commission: f.commission || '',
          newsTrading: f.news_trading || false,
          weekendHolding: f.weekend_holding || false,
          expertAdvisors: f.expert_advisors || false,
          refundPolicy: f.refund_policy || '',
          payoutFrequency: f.payout_frequency || '',
          trustPilotScore: f.trust_pilot_score ? Number(f.trust_pilot_score) : 0,
          twitterFollowers: f.twitter_followers ? Number(f.twitter_followers) : 0,
          discordMembers: f.discord_members ? Number(f.discord_members) : 0,
          supportEmail: f.support_email || '',
          challenges: [] // Not needed for card display
        }));

        setTopFirms(mappedFirms);
        // Ticker now uses static TICKER_LOGOS defined at component level
      }
    } catch (err) {
      console.error("Error fetching top firms for landing:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">

      {/* --- PREMIUM HERO SECTION (Original Design) --- */}
      <section className="relative pt-20 pb-0 lg:pt-24 overflow-hidden min-h-screen flex flex-col justify-center">

        {/* Inline styles for hero */}
        <style>{`
          .text-gradient-gold {
            background: linear-gradient(to right, #f6ae13, #fde68a, #f6ae13);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% auto;
            animation: textShimmer 3s linear infinite;
          }
          .hero-card {
            background: rgba(24, 22, 17, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(246, 174, 19, 0.15);
            border-radius: 20px;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px -10px rgba(246, 174, 19, 0.15);
          }
          .hero-card-secondary {
            background: rgba(34, 28, 16, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
          }
          @keyframes float-main { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(-2deg); } }
          @keyframes float-side-1 { 0%, 100% { transform: translateY(0) rotate(3deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
          @keyframes float-side-2 { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(-4deg); } }
          .comparison-bar {
            background: linear-gradient(90deg, #f6ae13, #fbbf24);
            border-radius: 6px;
            height: 6px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        {/* 1. DYNAMIC BACKGROUND LAYERS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-[80vh] perspective-1000 opacity-40">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px] rotate-x-60 origin-bottom animate-grid-flow" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          </div>
          <div className="absolute top-1/2 left-1/3 w-[1000px] h-[600px] bg-brand-gold/15 rounded-[100%] blur-[120px] animate-aurora mix-blend-screen" />
          <div className="absolute top-[35%] left-[55%] w-[700px] h-[500px] bg-yellow-500/8 rounded-[100%] blur-[100px] animate-pulse-slow mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
        </div>

        {/* 2. HERO CONTENT â€” SPLIT LAYOUT */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-4 mt-4 md:mt-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-brand-gold/20 rounded-full pl-3 pr-5 py-2 mb-8 backdrop-blur-xl shadow-[0_0_25px_-5px_rgba(246,174,19,0.2)] hover:border-brand-gold/50 transition-all cursor-default animate-fade-in-up">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
                </span>
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Trusted by 10,000+ Traders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up">
                <span className="text-white block mb-1">Find the Best</span>
                <span className="text-gradient-gold inline-block pb-1">Prop Firms.</span><br />
                <span className="text-white">Get Funded Faster.</span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed font-light animate-fade-in-up">
                The institutional-grade platform for funded traders. Compare 85+ firms side-by-side, analyze rules, and unlock exclusive discounts &mdash; all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in-up">
                <Link to="/firms">
                  <button className="group relative w-full sm:w-auto min-w-[240px] px-8 py-4 bg-brand-gold text-black font-bold text-lg tracking-wide rounded-xl overflow-hidden shadow-button-glow hover:shadow-[0_0_60px_-5px_rgba(247,174,17,0.7)] hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine group-hover:animate-none group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2">
                      Start Comparing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
                <Link to="/offers">
                  <button className="group relative w-full sm:w-auto min-w-[240px] px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium text-lg tracking-wide rounded-xl overflow-hidden hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      <Zap size={20} className="text-brand-gold group-hover:scale-110 transition-transform" />
                      View Exclusive Offers
                    </span>
                  </button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-5 pt-8 border-t border-white/10 animate-fade-in-up">
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
                  <span className="text-neutral-400 text-sm font-medium">10,000+ traders funded</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Unique Stacked Dashboard Cards */}
            <div className="lg:col-span-5 relative w-full hidden lg:flex items-center justify-center h-[580px]">

              {/* MAIN CARD: Cycling Firm Spotlight */}
              <div className="hero-card w-[92%] p-0 relative z-30" style={{ animation: 'float-main 7s ease-in-out infinite' }}>
                <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Live Firm Spotlight</span>
                  </div>
                  <div className="flex gap-1">
                    {showcaseFirms.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === activeFirm ? 'bg-brand-gold w-4' : 'bg-white/20 w-1.5'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="p-5 relative overflow-hidden" style={{ minHeight: '210px' }}>
                  {showcaseFirms.map((firm, idx) => (
                    <div
                      key={idx}
                      className={`transition-all duration-700 ease-in-out ${idx === activeFirm ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-6 absolute inset-x-5 top-5 pointer-events-none'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden p-1">
                            <img src={firm.logo} alt={firm.name} className="w-8 h-8 object-contain" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg leading-tight">{firm.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.floor(firm.rating) ? 'text-brand-gold fill-brand-gold' : 'text-neutral-700'}`} />)}
                              <span className="text-neutral-500 text-xs ml-1">{firm.rating}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold px-2.5 py-1 rounded-full border border-brand-gold/20 whitespace-nowrap">{firm.tag}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { label: 'Profit Split', val: firm.profit },
                          { label: 'Max Funding', val: firm.maxFunding },
                          { label: 'Drawdown', val: firm.drawdown },
                        ].map((stat, si) => (
                          <div key={si} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                            <p className="text-[8px] text-neutral-500 uppercase tracking-wider font-semibold mb-0.5">{stat.label}</p>
                            <p className="text-white font-bold text-sm">{stat.val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3.5 space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] text-neutral-500 uppercase font-semibold">Trust Score</span>
                            <span className="text-[10px] text-brand-gold font-bold">{(firm.rating * 20).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-[5px]">
                            <div className="comparison-bar" style={{ width: `${firm.rating * 20}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] text-neutral-500 uppercase font-semibold">Payout Speed</span>
                            <span className="text-[10px] text-brand-gold font-bold">{85 + idx * 5}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-[5px]">
                            <div className="comparison-bar" style={{ width: `${85 + idx * 5}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FLOATING CARD: Verified Payouts Feed */}
              <div className="hero-card-secondary absolute -left-8 bottom-[8%] z-40 w-[220px] p-0 overflow-hidden" style={{ animation: 'float-side-1 8s ease-in-out infinite' }}>
                <div className="px-3.5 py-2.5 border-b border-white/5 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Verified Payouts</span>
                </div>
                <div className="p-3 space-y-2">
                  {payoutFeed.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center text-[8px] font-bold text-brand-gold border border-brand-gold/20 flex-shrink-0">{p.trader}</div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-bold truncate">{p.amount}</p>
                          <p className="text-neutral-600 text-[9px] truncate">{p.firm}</p>
                        </div>
                      </div>
                      <span className="text-[8px] text-neutral-600 flex-shrink-0">{p.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FLOATING CARD: Quick Stats */}
              <div className="hero-card-secondary absolute -right-4 top-[5%] z-40 w-[180px] p-4" style={{ animation: 'float-side-2 9s ease-in-out infinite' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Total Saved</p>
                    <p className="text-white font-bold text-lg leading-none">$2.4M+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-2.5 py-1.5 border border-green-500/15">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-[10px] font-semibold">+18% this month</span>
                </div>
              </div>

              {/* Background glow orbs */}
              <div className="absolute top-[10%] right-0 w-40 h-40 rounded-full bg-brand-gold/10 blur-[60px] pointer-events-none"></div>
              <div className="absolute bottom-[15%] left-0 w-48 h-48 rounded-full bg-yellow-500/8 blur-[80px] pointer-events-none"></div>
            </div>

          </div>
        </div>

        {/* 3. INFINITE LOGO TICKER STRIP - HIDDEN */}
        {/*
        <div className="w-full border-y border-white/5 bg-black/80 backdrop-blur-md relative z-30 mt-auto">
          <div className="overflow-hidden py-8 flex select-none">
            <div className="flex whitespace-nowrap animate-marquee items-center min-w-full">
              {tickerFirms.map((firm, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center mx-12">
                  <img
                    src={firm.logo}
                    alt={firm.name}
                    className="h-12 md:h-16 w-auto object-contain max-w-[200px]"
                    style={{ opacity: 1, filter: 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 w-20 md:w-60 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 md:w-60 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
        */}

        {/* Premium Feature Grid — Exact Plaza Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mt-10 relative z-20 px-4 sm:px-6 lg:px-8">
          {[
            { icon: Zap, title: 'AI Matching', desc: 'Find your perfect firm in under 90 seconds with our proprietary AI algorithm.' },
            { icon: ShieldCheck, title: 'Verified Reviews', desc: 'Trust scores based on verified payout proofs and community feedback.' },
            { icon: TrendingUp, title: 'Real-time Data', desc: 'Live spreads, payout times, and rule changes updated daily.' },
            { icon: GraduationCap, title: 'Trader Education', desc: 'Master the challenge with our specific prep courses and tools.' },
          ].map((card, idx) => (
            <div key={idx} className="group relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-7 hover:bg-[#0d0d0b] hover:border-emerald-500/40 transition-all duration-500 overflow-hidden hover:-translate-y-2 shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                <card.icon className="w-7 h-7" />
              </div>
              <h3 className="relative z-10 font-bold text-xl text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">{card.title}</h3>
              <p className="relative z-10 text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-gold/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-sm">
                <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Top Performers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Highest Rated <span className="text-gradient-gold">Firms</span>
              </h2>
              <p className="text-neutral-400 max-w-lg text-base leading-relaxed">Firms that have consistently delivered payouts and transparent trading conditions, vetted by our community.</p>
            </div>
            <Link to="/firms" className="shrink-0">
              <button className="group flex items-center gap-2 bg-white/[0.04] border border-white/10 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all duration-300">
                View All Firms <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Firms Grid with Rankings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topFirms.map((firm, index) => (
              <div key={firm.id} className="relative group/rank">
                {/* Rank Badge */}
                <div className={`absolute -top-3 -left-2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-lg ${index === 0
                  ? 'bg-gradient-to-r from-brand-gold to-amber-400 text-black shadow-brand-gold/30'
                  : index === 1
                    ? 'bg-gradient-to-r from-neutral-300 to-neutral-400 text-black shadow-neutral-400/20'
                    : index === 2
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-amber-700/20'
                      : 'bg-white/10 text-neutral-300 border border-white/10'
                  }`}>
                  {index === 0 && <span className="text-sm">👑</span>}
                  #{index + 1}
                </div>

                {/* Gold glow for #1 */}
                {index === 0 && (
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-brand-gold/30 via-brand-gold/10 to-transparent pointer-events-none z-10"></div>
                )}

                <FirmCard firm={firm} className={index === 0 ? 'ring-1 ring-brand-gold/20' : ''} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link to="/firms">
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/10 text-white font-bold rounded-2xl hover:bg-brand-gold hover:text-black hover:border-brand-gold transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <span>Explore All Prop Firms</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-neutral-600 text-xs mt-4">Updated daily with verified data from 85+ prop trading firms</p>
          </div>
        </div>
      </section>



      {/* --- FEATURE BENTO GRID (PREMIUM V3) --- */}
      <section className="py-28 relative z-20 overflow-hidden">
        <style>{`
          @keyframes gauge-fill { from { stroke-dashoffset: 251; } }
          .bento-v3 { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
          .bento-v3:hover { transform: translateY(-6px); }
          @keyframes pulse-border { 0%, 100% { border-color: rgba(246,174,19,0.15); } 50% { border-color: rgba(246,174,19,0.4); } }
        `}</style>

        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#111010] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Award className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Why We're Different</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Built for <span className="text-gradient-gold">Serious Traders</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Everything you need to find, compare, and get funded by the right prop firm &mdash; backed by real data.
            </p>
          </div>

          {/* ====== ROW 1: Hero Stat Banner (Full Width) ====== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { value: '85+', label: 'Firms Compared', icon: <TrendingUp className="w-5 h-5" /> },
              { value: '$42M+', label: 'Payouts Tracked', icon: <Shield className="w-5 h-5" /> },
              { value: '150K+', label: 'Active Traders', icon: <Users className="w-5 h-5" /> },
              { value: '50+', label: 'Data Points Per Firm', icon: <Cpu className="w-5 h-5" /> },
            ].map((stat, i) => (
              <div key={i} className="bento-v3 group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 text-center hover:border-brand-gold/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mx-auto mb-3 group-hover:bg-brand-gold/20 transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight group-hover:text-brand-gold transition-colors">{stat.value}</div>
                  <div className="text-neutral-500 text-xs uppercase tracking-wider font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ====== ROW 2: Main Feature Cards (8+4 split) ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

            {/* CARD: Deep Data Comparison (8 col — HERO CARD) */}
            <div className="bento-v3 lg:col-span-8 relative rounded-3xl overflow-hidden group">
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.1] via-white/[0.04] to-white/[0.02] group-hover:from-brand-gold/40 group-hover:via-brand-gold/15 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-[#0c0b09]"></div>
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"></div>
              <div className="relative z-[2] p-8 md:p-10 flex flex-col md:flex-row gap-8">
                {/* Text Side */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/20 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300 shadow-lg shadow-brand-gold/5">
                        <TrendingUp size={22} />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/20 to-transparent"></div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">Deep Data Comparison</h3>
                    <p className="text-neutral-400 text-base leading-relaxed mb-6">
                      Filter 50+ data points side-by-side. Drawdown rules, news trading, commissions, hidden fees &mdash; we read the fine print so you don't have to.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {['Side-by-Side', 'Real-time', 'Filterable', '85+ Firms'].map((tag, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-white/[0.03] border border-white/[0.08] text-neutral-300 px-3.5 py-1.5 rounded-lg hover:border-brand-gold/30 hover:text-brand-gold hover:bg-brand-gold/5 transition-all cursor-default">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Mini Comparison Table */}
                <div className="w-full md:w-[300px] flex-shrink-0 rounded-2xl overflow-hidden self-start">
                  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden group-hover:border-brand-gold/15 transition-colors">
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shadow-sm shadow-brand-gold/50"></div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Live Comparison</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-md border border-brand-gold/20">FTMO</span>
                        <span className="text-[9px] font-bold text-neutral-500 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">Other</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3.5">
                      {[
                        { metric: 'Profit Split', a: '90%', b: '80%', pct: 90 },
                        { metric: 'Max Drawdown', a: '10%', b: '12%', pct: 83 },
                        { metric: 'Payout Speed', a: '24hr', b: '48hr', pct: 100 },
                        { metric: 'News Trading', a: '✓', b: '✗', pct: 100 },
                      ].map((row, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-neutral-500 font-medium">{row.metric}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-brand-gold">{row.a}</span>
                              <span className="text-neutral-600 text-[10px]">vs</span>
                              <span className="font-bold text-neutral-500">{row.b}</span>
                            </div>
                          </div>
                          <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-brand-gold to-amber-400 h-1.5 rounded-full" style={{ width: `${row.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Exclusive Deals (4 col — Gold Border) */}
            <div className="bento-v3 lg:col-span-4 relative rounded-3xl overflow-hidden group" style={{ animation: 'pulse-border 4s ease-in-out infinite' }}>
              {/* Gold gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold via-amber-500 to-yellow-600"></div>
              <div className="absolute inset-[1px] bg-[#0d0b07] rounded-3xl"></div>
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-brand-gold/15 rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/30 shadow-lg shadow-brand-gold/10">
                      <Zap size={22} />
                    </div>
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">Exclusive</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Deal Flow</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    Up to 20% off challenges + 125% refund offers you won't find anywhere else.
                  </p>
                </div>
                {/* Stacked Discount Badges */}
                <div className="space-y-2.5">
                  {[
                    { firm: 'FTMO', discount: '15% OFF', savings: '$45', hot: false },
                    { firm: 'Funding Pips', discount: '20% OFF', savings: '$80', hot: true },
                    { firm: 'The5ers', discount: '10% OFF', savings: '$30', hot: false },
                  ].map((deal, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all duration-300 ${deal.hot ? 'bg-brand-gold/10 border-brand-gold/30 shadow-sm shadow-brand-gold/10' : 'bg-white/[0.03] border-white/[0.06]'} group-hover:border-brand-gold/20`}>
                      <div>
                        <span className="font-bold text-white text-sm block">{deal.firm}</span>
                        <span className="text-[10px] text-neutral-500">Save {deal.savings}</span>
                      </div>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-lg ${deal.hot ? 'bg-brand-gold text-black shadow-sm shadow-brand-gold/30' : 'bg-white/10 text-brand-gold'}`}>{deal.discount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ====== ROW 3: Bottom Feature Cards (5+7 split) ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* CARD: TrustGuard Score (5 col) */}
            <div className="bento-v3 lg:col-span-5 relative rounded-3xl overflow-hidden group">
              {/* Glassmorphic border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.1] via-white/[0.04] to-white/[0.02] group-hover:from-emerald-500/40 group-hover:via-emerald-500/15 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-[#0c0b09]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"></div>
              <div className="relative z-[2] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-emerald-500/5">
                    <Shield size={22} />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">TrustGuard&trade; Score</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Proprietary algorithm that monitors payouts, reviews, and regulation compliance in real-time.
                </p>

                {/* Gauge + Legend */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gaugeGrad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="26" style={{ animation: 'gauge-fill 2s ease-out' }} />
                      <defs>
                        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white font-black text-2xl leading-none">9.2</span>
                      <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-wider mt-0.5">Excellent</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Payout Verified', pct: 96 },
                      { label: 'Community Trust', pct: 92 },
                      { label: 'Regulation Score', pct: 88 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-neutral-400 font-medium">{item.label}</span>
                          <span className="text-emerald-400 font-bold">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Trader Community (7 col) */}
            <div className="bento-v3 lg:col-span-7 relative rounded-3xl overflow-hidden group">
              {/* Glassmorphic border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.1] via-white/[0.04] to-white/[0.02] group-hover:from-violet-500/40 group-hover:via-violet-500/15 group-hover:to-transparent transition-all duration-500"></div>
              <div className="absolute inset-[1px] rounded-3xl bg-[#0c0b09]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"></div>
              <div className="relative z-[2] p-8 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/20 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-violet-500/5">
                        <Users size={22} />
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent"></div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Trader Community</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-5">
                      50,000+ funded traders sharing reviews, strategies, and verified payout proofs.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2.5">
                      {['bg-violet-500', 'bg-purple-600', 'bg-fuchsia-500', 'bg-indigo-500', 'bg-violet-400'].map((bg, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-black flex items-center justify-center text-[9px] font-bold text-white shadow-lg`} style={{ zIndex: 50 - i * 10 }}>
                          {['JT', 'MK', 'AS', 'DL', 'RK'][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">50,000+</div>
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Active Members</div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white/[0.02] rounded-2xl border border-white/[0.06] overflow-hidden self-start">
                  <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Live Feed</span>
                    </div>
                    <span className="text-[9px] text-neutral-600 font-medium">Just now</span>
                  </div>
                  <div className="p-3.5 space-y-3">
                    {[
                      { user: 'JT', action: 'verified a $12.4K payout from', firm: 'FTMO', color: 'text-brand-gold' },
                      { user: 'MK', action: 'left a 5-star review on', firm: 'Funding Pips', color: 'text-violet-400' },
                      { user: 'AS', action: 'saved $240 using discount at', firm: 'The5ers', color: 'text-emerald-400' },
                      { user: 'DL', action: 'compared 3 firms and chose', firm: 'E8 Markets', color: 'text-blue-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-violet-500/15 flex items-center justify-center text-[8px] font-bold text-violet-300 flex-shrink-0 mt-0.5 border border-violet-500/20">{item.user}</div>
                        <p className="text-neutral-500 text-[11px] leading-snug">
                          <span className="text-neutral-300 font-semibold">{item.user}</span> {item.action} <span className={`${item.color} font-semibold`}>{item.firm}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
                <Terminal className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                How It <span className="text-gradient-gold">Works</span>
              </h2>
              <p className="text-neutral-400 max-w-lg text-base leading-relaxed">
                From comparison to funded trader in three simple steps. No guesswork, no hidden surprises.
              </p>
            </div>
            <Link to="/firms" className="shrink-0">
              <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-black font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(246,174,19,0.2)]">
                Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Steps — Horizontal rows */}
          <div className="space-y-5">
            {[
              {
                step: '01',
                title: 'Compare Firms',
                desc: 'Filter and compare 85+ prop firms across 50+ data points including profit splits, drawdown rules, payout speed, commissions, and hidden fees — all in one powerful dashboard.',
                icon: <TrendingUp size={24} />,
                highlight: '85+ Firms',
                highlightSub: 'in our database',
              },
              {
                step: '02',
                title: 'Save with Discounts',
                desc: 'Access exclusive deals up to 20% off challenges and 125% refund offers. We negotiate directly with firms so you save hundreds on every purchase — money back in your pocket.',
                icon: <Zap size={24} />,
                highlight: 'Up to 20%',
                highlightSub: 'off challenges',
              },
              {
                step: '03',
                title: 'Get Funded',
                desc: 'Choose your firm with confidence using our TrustGuard™ algorithm and 50,000+ verified community reviews. Know exactly what you\'re getting before you commit a single dollar.',
                icon: <Shield size={24} />,
                highlight: '50K+',
                highlightSub: 'verified reviews',
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden">
                {/* Glassmorphic border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01] group-hover:from-brand-gold/25 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>

                <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
                  {/* Left: Number + Icon */}
                  <div className="flex items-center gap-5 md:w-[280px] shrink-0">
                    <div className="text-5xl md:text-6xl font-black text-white/[0.06] leading-none select-none group-hover:text-brand-gold/10 transition-colors">{item.step}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-all duration-300 shadow-lg shadow-brand-gold/5">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-brand-gold transition-colors">{item.title}</h3>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Step {item.step}</div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Description */}
                  <p className="text-neutral-400 text-sm leading-relaxed flex-1 md:pt-1">{item.desc}</p>

                  {/* Right: Highlight Stat */}
                  <div className="md:w-[140px] shrink-0 text-right hidden md:block">
                    <div className="text-2xl font-black text-brand-gold">{item.highlight}</div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{item.highlightSub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-[500px] h-[400px] bg-brand-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[300px] bg-violet-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
              <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Trader Stories</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              What Traders <span className="text-gradient-gold">Say</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Real traders, real results. Hear from our community of 50,000+ funded traders.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="mb-5">
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-gold/20 via-brand-gold/10 to-white/[0.02]"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex flex-col items-center md:items-start gap-4 md:w-[200px] shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-xl font-black text-black shadow-lg shadow-brand-gold/20">JT</div>
                  <div className="text-center md:text-left">
                    <div className="text-white font-bold text-lg">James T.</div>
                    <div className="text-neutral-500 text-sm">Funded Trader</div>
                    <div className="flex items-center gap-0.5 mt-2 justify-center md:justify-start">
                      {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />))}
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-center">
                    <div className="text-emerald-400 font-black text-lg">$12,400</div>
                    <div className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-wider">Payout via FTMO</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-brand-gold/20 text-6xl font-serif leading-none mb-4">"</div>
                  <p className="text-neutral-200 text-lg md:text-xl leading-relaxed font-medium -mt-8">
                    PropMatchSpot saved me $380 on my FTMO challenge and helped me find a firm with same-day payouts. The comparison tool is a game-changer — I compared 12 firms in 5 minutes and found the perfect one for my trading style. The TrustGuard score gave me confidence I wasn't throwing money away. Every funded trader needs this platform.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-[11px] font-semibold bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-lg border border-brand-gold/20">Saved $380</span>
                    <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">Same-day payout</span>
                    <span className="text-[11px] font-semibold bg-violet-500/10 text-violet-400 px-3 py-1.5 rounded-lg border border-violet-500/20">Compared 12 firms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {[
              {
                name: 'Sarah K.', role: 'Prop Trader',
                quote: "I was about to sign up with a firm that had terrible payout records — 3+ week delays and hidden conditions. The TrustGuard score warned me at 4.2/10 and I switched to a 9.2-rated firm instead. Best decision I ever made.",
                payout: '$8,200', firm: 'Funding Pips', avatar: 'SK', avatarColor: 'bg-violet-500',
                tag: 'Avoided scam firm', tagColor: 'bg-red-500/10 text-red-400 border-red-500/20',
              },
              {
                name: 'David R.', role: 'Full-time Trader',
                quote: "The exclusive discounts alone have saved me over $1,200 across three challenges. Plus the community reviews are incredibly detailed — real traders sharing payout proofs and honest experiences. Can't trade without it now.",
                payout: '$24,800', firm: 'The5ers', avatar: 'DR', avatarColor: 'bg-emerald-500',
                tag: 'Saved $1,200+', tagColor: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
              },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] group-hover:from-brand-gold/25 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
                <div className="relative z-[2] p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${item.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>{item.avatar}</div>
                      <div>
                        <div className="text-white font-bold text-sm">{item.name}</div>
                        <div className="text-neutral-500 text-xs">{item.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />))}
                    </div>
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mb-5">"{item.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border ${item.tagColor}`}>{item.tag}</span>
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-sm">{item.payout}</div>
                      <div className="text-neutral-600 text-[10px] uppercase tracking-wider">via {item.firm}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badge Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (<Star key={s} className="w-5 h-5 text-brand-gold fill-brand-gold" />))}
              </div>
              <span className="text-white font-black text-xl ml-2">4.9</span>
              <span className="text-neutral-500 text-sm">/5</span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="text-neutral-400 text-sm">Based on <span className="text-white font-bold">2,400+</span> verified trader reviews</div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">TrustGuard™ Verified</span>
            </div>
          </div>
        </div>
      </section>
      {/* ====== PLATFORM COMPARISON ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] bg-brand-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-emerald-500/[0.015] rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <LineChart className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">The Difference</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
              PropMatchSpot vs <span className="text-neutral-500">Going Solo</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Stop wasting hours researching. See why thousands of traders trust us over the old way.
            </p>
          </div>

          {/* Two-Column Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

            {/* LEFT: PropMatchSpot Card (Gold Highlighted) */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-gold/30 via-brand-gold/15 to-brand-gold/5"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2]">
                {/* Card Header */}
                <div className="px-7 py-5 border-b border-brand-gold/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/20">
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">PropMatchSpot</div>
                      <div className="text-brand-gold/60 text-[10px] font-bold uppercase tracking-wider">Recommended</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-black bg-brand-gold px-3 py-1 rounded-full uppercase tracking-wider">Free</span>
                </div>

                {/* Feature Rows */}
                <div className="p-5 space-y-0">
                  {[
                    { icon: <TrendingUp size={16} />, title: 'Firm Comparison', value: '85+ firms, side-by-side', desc: 'Filter by 50+ data points instantly' },
                    { icon: <Zap size={16} />, title: 'Exclusive Discounts', value: 'Up to 20% off', desc: 'Plus 125% refund offers' },
                    { icon: <Shield size={16} />, title: 'Trust Verification', value: 'TrustGuard™ algorithm', desc: 'Real-time payout & review monitoring' },
                    { icon: <Users size={16} />, title: 'Community Reviews', value: '50K+ verified traders', desc: 'Honest reviews & payout proofs' },
                    { icon: <Cpu size={16} />, title: 'Research Time', value: '5 minutes', desc: 'Everything in one dashboard' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-brand-gold/[0.03] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                        {row.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-white font-bold text-sm">{row.title}</span>
                          <span className="text-emerald-400 text-xs font-bold shrink-0">{row.value}</span>
                        </div>
                        <p className="text-neutral-500 text-xs">{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="px-7 py-4 border-t border-brand-gold/10 flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ Save $200-400</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ 5 min research</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ Verified data</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Going Solo Card (Dim/Neutral) */}
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.01]"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
              <div className="relative z-[2]">
                {/* Card Header */}
                <div className="px-7 py-5 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                      <span className="text-neutral-500 text-lg">🔍</span>
                    </div>
                    <div>
                      <div className="text-neutral-400 font-bold text-sm">Manual Research</div>
                      <div className="text-neutral-600 text-[10px] font-bold uppercase tracking-wider">The old way</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-neutral-600 bg-white/[0.04] px-3 py-1 rounded-full uppercase tracking-wider border border-white/[0.06]">Risky</span>
                </div>

                {/* Feature Rows */}
                <div className="p-5 space-y-0">
                  {[
                    { title: 'Firm Comparison', value: 'Visit each site individually', desc: 'No side-by-side, easy to miss details' },
                    { title: 'Discounts', value: 'No access', desc: 'Pay full price every time' },
                    { title: 'Trust Verification', value: 'Guesswork & hope', desc: 'No payout or review verification' },
                    { title: 'Community', value: 'Random forum posts', desc: 'Unverified, often biased reviews' },
                    { title: 'Research Time', value: '10+ hours', desc: 'Spread across dozens of sites' },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400/60 flex-shrink-0 mt-0.5">
                        <span className="text-xs">✗</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-neutral-400 font-bold text-sm">{row.title}</span>
                          <span className="text-neutral-600 text-xs font-medium shrink-0">{row.value}</span>
                        </div>
                        <p className="text-neutral-600 text-xs">{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="px-7 py-4 border-t border-white/[0.04] flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ Full price</span>
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ 10+ hours</span>
                  <span className="text-[10px] font-bold bg-red-500/5 text-red-400/60 px-3 py-1.5 rounded-lg border border-red-500/10">✗ Unverified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-brand-gold/10 to-brand-gold/15"></div>
            <div className="absolute inset-[1px] rounded-2xl bg-[#0c0b09]"></div>
            <div className="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-white mb-1">Ready to trade smarter?</h3>
                <p className="text-neutral-400 text-sm">Join 50,000+ traders who found their perfect firm — in under 5 minutes.</p>
              </div>
              <Link to="/firms" className="shrink-0">
                <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-black font-bold rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(246,174,19,0.25)] hover:shadow-[0_4px_30px_rgba(246,174,19,0.4)]">
                  <span>Start Comparing Now — It's Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FAQ SECTION ====== */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#0d0c0a] to-[#0a0908]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-brand-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto text-base leading-relaxed">
              Got questions? We've got answers. Here's everything you need to know about PropMatchSpot.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is PropMatchSpot really free?',
                a: 'Yes, 100% free — forever. We make money through affiliate partnerships with prop firms, which means you never pay a cent to use our comparison tools, reviews, or data. We also earn commissions from exclusive discount codes, which actually saves YOU money.',
              },
              {
                q: 'How does the TrustGuard™ score work?',
                a: 'TrustGuard™ is our proprietary algorithm that analyzes multiple factors including: verified payout records, payout speed consistency, community review sentiment, firm age and track record, rule transparency, and customer support quality. Scores are updated in real-time and range from 1-10.',
              },
              {
                q: 'Are the reviews on PropMatchSpot genuine?',
                a: 'Absolutely. Every review goes through our verification process. We require proof of purchase (challenge receipt) and prioritize reviews with payout screenshots. Fake reviews are detected by our AI system and removed. We have over 50,000 verified trader reviews.',
              },
              {
                q: 'How do I find the best prop firm for me?',
                a: 'Use our comparison tool to filter firms by what matters most to you — profit split, drawdown rules, payout speed, account size, challenge price, and more. You can compare up to 4 firms side-by-side. Our AI matching tool can also recommend firms based on your trading style and preferences.',
              },
              {
                q: 'Do the discount codes actually work?',
                a: 'Yes! We negotiate exclusive deals directly with prop firms. Our discounts range from 10-20% off challenge fees, and some firms offer 125% refund offers exclusively through PropMatchSpot. We verify every code regularly and remove expired ones immediately.',
              },
              {
                q: 'How often is the data updated?',
                a: 'Our core firm data (rules, pricing, profit splits) is verified weekly. TrustGuard™ scores update in real-time based on new reviews and payout reports. Discount codes are checked daily. If a firm changes its rules, we typically update within 24 hours.',
              },
              {
                q: 'Can I submit a firm to be listed?',
                a: 'Yes! If you know of a prop firm that isn\'t listed on PropMatchSpot, you can submit it through our contact page. Our team will verify the firm, collect data, and add it to the platform — usually within 1-2 weeks.',
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(246,174,19,0.08),transparent)]"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-brand-gold/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[200px] bg-amber-500/[0.02] rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-gold/[0.08] border border-brand-gold/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-brand-gold" />
            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Your Journey Starts Here</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Stop <span className="text-gradient-gold">Overpaying</span> for Challenges.
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Compare 85+ prop firms, access exclusive discounts, and find your perfect match — all in one place, completely free.
          </p>

          {/* Mini Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10">
            {[
              { val: '85+', label: 'Firms' },
              { val: '$42M+', label: 'Verified' },
              { val: '50K+', label: 'Traders' },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-5 bg-white/10 hidden sm:block"></div>}
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-lg">{stat.val}</span>
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link to="/firms">
              <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-black font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(246,174,19,0.3)] hover:shadow-[0_4px_40px_rgba(246,174,19,0.5)] hover:scale-[1.02]">
                <span>Start Comparing Free</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/offers">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 bg-transparent border border-white/10 hover:border-brand-gold/30 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:bg-white/[0.02]">
                <Bookmark size={18} className="text-brand-gold" />
                <span>View Exclusive Deals</span>
              </button>
            </Link>
          </div>

          {/* Trust message */}
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
            <Shield className="w-4 h-4 text-emerald-400/60" />
            <span>No sign-up required · 100% free · Trusted by 50,000+ traders</span>
          </div>
        </div>
      </section>

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
