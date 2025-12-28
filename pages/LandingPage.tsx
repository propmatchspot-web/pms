import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Award, ChevronRight, Users, Zap, CheckCircle2, ArrowRight, LineChart, Bookmark } from 'lucide-react';
import FirmCard from '../components/FirmCard';
import { MOCK_FIRMS } from '../constants';

const LandingPage: React.FC = () => {
  const topFirms = MOCK_FIRMS.slice(0, 3);
  
  // Create a ticker list by repeating the mock firms to ensure smooth scrolling
  // Duplicating 4 times creates a long enough strip for the loop
  const tickerFirms = MOCK_FIRMS.length > 0 ? [...MOCK_FIRMS, ...MOCK_FIRMS, ...MOCK_FIRMS, ...MOCK_FIRMS] : [];

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      
      {/* --- WOW FACTOR HERO SECTION --- */}
      <section className="relative pt-32 pb-0 lg:pt-40 overflow-hidden min-h-screen flex flex-col justify-center items-center">
        
        {/* 1. DYNAMIC BACKGROUND LAYERS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             
             {/* Deep Space Background */}
             <div className="absolute inset-0 bg-black" />
             
             {/* 3D Moving Floor Grid */}
             <div className="absolute inset-x-0 bottom-0 h-[80vh] perspective-1000 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:50px_50px] rotate-x-60 origin-bottom animate-grid-flow" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" /> 
             </div>

             {/* The Enhanced "Aurora" - Breathing Gold Spotlight */}
             <div className="absolute top-1/2 left-1/2 w-[1000px] h-[600px] bg-brand-gold/20 rounded-[100%] blur-[120px] animate-aurora mix-blend-screen pointer-events-none" />
             {/* Secondary accent light for depth */}
             <div className="absolute top-[40%] left-[45%] w-[800px] h-[500px] bg-yellow-500/10 rounded-[100%] blur-[100px] animate-pulse-slow mix-blend-screen pointer-events-none delay-1000" />
             
             {/* Ambient Noise Texture */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
        </div>

        {/* 2. HERO CONTENT */}
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 mb-20">
          
          {/* Holographic Trust Badge */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1.5 mb-10 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(247,174,17,0.3)] hover:border-brand-gold/50 transition-all cursor-default animate-fade-in-up">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold animate-pulse-slow">
               <Shield size={12} fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-neutral-200 tracking-widest uppercase">Verified Payouts Live</span>
          </div>
          
          {/* THE 2-LINE HEADLINE (Fixed Sizing) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tighter text-white mb-8 leading-[1.0] animate-fade-in-up">
            <span className="block mb-2 whitespace-normal xl:whitespace-nowrap">Find the Best Prop Firms.</span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-100 to-brand-gold animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Faster. Smarter.
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-lg md:text-2xl text-neutral-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up delay-100">
            The institutional-grade terminal for funded traders. <br className="hidden md:block"/>
            Compare spreads, analyze rules, and unlock exclusive deal flow.
          </p>
          
          {/* High-End CTAs (PREMIUM BUTTONS) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-200">
            
            {/* Primary Button */}
            <Link to="/firms">
              <button className="group relative w-full sm:w-auto min-w-[260px] px-8 py-5 bg-brand-gold text-black font-bold text-lg tracking-wide rounded-xl overflow-hidden shadow-button-glow hover:shadow-[0_0_60px_-5px_rgba(247,174,17,0.7)] hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shine group-hover:animate-none group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Comparing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            {/* Secondary Button */}
            <Link to="/offers">
              <button className="group relative w-full sm:w-auto min-w-[260px] px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-medium text-lg tracking-wide rounded-xl overflow-hidden hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300">
                <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <Zap size={20} className="text-brand-gold group-hover:scale-110 transition-transform" />
                  View Exclusive Offers
                </span>
              </button>
            </Link>
          </div>

          {/* Floating Glass Elements (3D Decorations) */}
          <div className="absolute top-[20%] right-[5%] hidden 2xl:block animate-float-delayed pointer-events-none">
             <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 hover:border-brand-gold/40">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-900/20 flex items-center justify-center text-green-400 border border-green-500/20">
                     <TrendingUp size={20}/>
                   </div>
                   <div className="text-left">
                      <p className="text-xs text-neutral-400 font-bold uppercase">Profit Split</p>
                      <p className="text-xl font-bold text-white">90% Verified</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-[20%] left-[5%] hidden 2xl:block animate-float pointer-events-none">
             <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500 hover:border-brand-gold/40">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                     <CheckCircle2 size={20}/>
                   </div>
                   <div className="text-left">
                      <p className="text-xs text-neutral-400 font-bold uppercase">Trust Score</p>
                      <p className="text-xl font-bold text-white">98/100</p>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* 3. INFINITE LOGO TICKER STRIP */}
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
          {/* Fade edges for ticker */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-60 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 md:w-60 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* --- FEATURE BENTO GRID (PREMIUM & REDESIGNED) --- */}
      <section className="py-32 bg-brand-charcoal border-b border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Professionals Choose Us</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">We provide the data layer for the prop trading industry, ensuring transparency and trust.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Deep Data Comparison (Wide) */}
            <div className="md:col-span-2 relative p-8 md:p-10 rounded-3xl bg-black border border-white/10 overflow-hidden group hover:border-brand-gold/20 transition-all duration-500">
               {/* Background Chart Effect */}
               <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-1/4 translate-y-1/4">
                 <LineChart size={300} className="text-neutral-700" strokeWidth={1} />
               </div>
               
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-8 text-brand-gold border border-brand-gold/20">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Deep Data Comparison</h3>
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-lg">
                      Filter 50+ data points including drawdown types, news trading rules, commission structures, and hidden fees. We read the fine print so you don't have to.
                    </p>
                  </div>
               </div>
            </div>

            {/* Card 2: Exclusive Deal Flow (Gold Background) */}
            <div className="md:col-span-1 relative p-8 md:p-10 rounded-3xl bg-brand-gold text-black border border-brand-gold overflow-hidden shadow-[0_0_30px_rgba(247,174,17,0.2)] group hover:scale-[1.02] transition-transform duration-300">
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center mb-8 text-black">
                    <Bookmark size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Exclusive Deal Flow</h3>
                    <p className="text-black/80 text-base md:text-lg leading-relaxed font-medium">
                      Access negotiated discounts up to 20% off and 125% refund offers found nowhere else.
                    </p>
                  </div>
               </div>
            </div>

            {/* Card 3: TrustGuard Score (Standard) */}
            <div className="md:col-span-1 relative p-8 md:p-10 rounded-3xl bg-black border border-white/10 overflow-hidden group hover:border-blue-500/40 transition-all duration-500">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-500 border border-blue-500/20">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">TrustGuard™ Score</h3>
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                      Our proprietary algorithm monitors payout proofs and community sentiment in real-time.
                    </p>
                  </div>
               </div>
            </div>

            {/* Card 4: Trader Community (Wide with List Visual) */}
            <div className="md:col-span-2 relative p-8 md:p-10 rounded-3xl bg-black border border-white/10 overflow-hidden group hover:border-purple-500/40 transition-all duration-500">
               <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-500 border border-purple-500/20">
                      <Users size={28} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Trader Community</h3>
                    <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
                      Join 50,000+ traders sharing strategies, reviews, and payout verifications.
                    </p>
                  </div>
                  {/* List Visualization */}
                  <div className="flex-1 w-full bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm max-w-sm ml-auto">
                     <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 shrink-0"></div>
                            <div className="h-2.5 bg-neutral-800 rounded w-full"></div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Highest Rated Firms</h2>
              <p className="text-neutral-400 max-w-xl text-lg">Firms that have consistently delivered payouts and transparent trading conditions.</p>
            </div>
            <Link to="/firms">
              <button className="group flex items-center gap-2 border border-white/20 px-6 py-3 rounded-lg text-white font-medium hover:border-brand-gold hover:text-brand-gold transition-colors">
                View All Firms <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topFirms.map(firm => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Numbers */}
      <section className="py-24 border-t border-white/10 bg-brand-charcoal">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
               {[
                  { label: 'Total Payouts Verified', val: '$42M+' },
                  { label: 'Active Monthly Users', val: '150k+' },
                  { label: 'Prop Firms Listed', val: '85' },
                  { label: 'Average Discount', val: '15%' },
               ].map((stat, i) => (
                  <div key={i} className="group cursor-default">
                     <h3 className="text-4xl md:text-6xl font-black text-white mb-3 font-mono group-hover:text-brand-gold transition-colors">{stat.val}</h3>
                     <p className="text-neutral-500 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Stop Overpaying for Challenges.</h2>
          <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Find the perfect firm that matches your trading style and get funded today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link to="/firms">
                <button className="w-full sm:w-auto min-w-[260px] px-8 py-4 bg-brand-gold text-black font-bold text-lg tracking-wide rounded-xl shadow-neon hover:shadow-[0_0_50px_-5px_rgba(247,174,17,0.7)] hover:scale-105 transition-all">Start Comparing</button>
             </Link>
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