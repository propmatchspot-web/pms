import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ExternalLink, CheckCircle, AlertTriangle, ChevronRight, Globe, Calendar, DollarSign, TrendingDown, Clock, Layers, Star, MapPin, Monitor, XCircle, Check, CreditCard, PieChart, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import FirmCard from '../components/FirmCard';
import FirmLogo from '../components/FirmLogo';
import PlatformLogo from '../components/PlatformLogo';


import { FirmService } from '../lib/services';
import { PropFirm } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useModal } from '../context/ModalContext';

// Helper function to convert country name to flag emoji
const getCountryFlag = (location: string): string => {
  const countryFlags: { [key: string]: string } = {
    'usa': '🇺🇸', 'united states': '🇺🇸', 'us': '🇺🇸', 'america': '🇺🇸',
    'uk': '🇬🇧', 'united kingdom': '🇬🇧', 'england': '🇬🇧', 'britain': '🇬🇧',
    'uae': '🇦🇪', 'dubai': '🇦🇪', 'united arab emirates': '🇦🇪',
    'pakistan': '🇵🇰', 'pk': '🇵🇰',
    'india': '🇮🇳', 'in': '🇮🇳',
    'canada': '🇨🇦', 'ca': '🇨🇦',
    'australia': '🇦🇺', 'au': '🇦🇺',
    'germany': '🇩🇪', 'de': '🇩🇪',
    'france': '🇫🇷', 'fr': '🇫🇷',
    'spain': '🇪🇸', 'es': '🇪🇸',
    'italy': '🇮🇹', 'it': '🇮🇹',
    'netherlands': '🇳🇱', 'nl': '🇳🇱', 'holland': '🇳🇱',
    'switzerland': '🇨🇭', 'ch': '🇨🇭',
    'singapore': '🇸🇬', 'sg': '🇸🇬',
    'hong kong': '🇭🇰', 'hk': '🇭🇰',
    'japan': '🇯🇵', 'jp': '🇯🇵',
    'china': '🇨🇳', 'cn': '🇨🇳',
    'south africa': '🇿🇦', 'za': '🇿🇦',
    'nigeria': '🇳🇬', 'ng': '🇳🇬',
    'brazil': '🇧🇷', 'br': '🇧🇷',
    'mexico': '🇲🇽', 'mx': '🇲🇽',
    'cyprus': '🇨🇾', 'cy': '🇨🇾',
    'malta': '🇲🇹', 'mt': '🇲🇹',
    'seychelles': '🇸🇨', 'sc': '🇸🇨',
    'belize': '🇧🇿', 'bz': '🇧🇿',
    'st. vincent': '🇻🇨', 'saint vincent': '🇻🇨',
  };

  const lower = location.toLowerCase().trim();
  // Check for direct match or partial match
  for (const [key, flag] of Object.entries(countryFlags)) {
    if (lower.includes(key)) return flag;
  }
  return '🌍'; // Default globe for unknown
};

const FirmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const { showModal } = useModal();

  // Missing States
  const [isSaved, setIsSaved] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]); // Using any[] for now as Review type might be complex, or infer from usage
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitMsg, setSubmitMsg] = useState('');
  const [selectedChallengeType, setSelectedChallengeType] = useState<string>('all');
  const [similarFirms, setSimilarFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    const fetchFirmDetails = async () => {
      if (!id) return;
      try {
        const data = await FirmService.getFirmDetails(id);
        setFirm(data);
      } catch (error) {
        console.error("Failed to load firm details", error);
      } finally {
        setLoading(false);
      }
    };

    const checkSavedStatus = async () => {
      if (!user || !id) return;
      const { data } = await supabase
        .from('saved_firms')
        .select('*')
        .eq('user_id', user.id)
        .eq('firm_id', id)
        .single();
      setIsSaved(!!data);
    };

    const fetchReviews = async () => {
      if (!id) return;
      setReviewLoading(true);
      const { data } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('firm_id', id)
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setReviewLoading(false);
    };

    const fetchSimilarFirms = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('firms')
          .select('*')
          .neq('id', id)
          .limit(3);

        if (data && !error) {
          const mapped = data.map((f: any) => ({
            id: f.id,
            name: f.name,
            logo: f.logo_url || `https://www.google.com/s2/favicons?domain=${f.website_url}&sz=128`,
            rating: Number(f.rating) || 0,
            reviewCount: Number(f.review_count) || 0,
            trustScore: Number(f.trust_score) || 95,
            maxFunding: Number(f.max_funding) || 0,
            profitSplit: f.profit_split || '80%',
            drawdown: f.drawdown || '10%',
            tags: f.tags || [],
            challenges: [],
          }));
          setSimilarFirms(mapped);
        }
      } catch (err) {
        console.error('Error fetching similar firms:', err);
      }
    };

    fetchFirmDetails();
    checkSavedStatus();
    fetchReviews();
    fetchSimilarFirms();
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) {
      showModal({
        type: 'info',
        title: 'Login Required',
        message: 'Please log in to save firms to your favorites.'
      });
      return;
    }

    if (isSaved) {
      await supabase.from('saved_firms').delete().match({ user_id: user.id, firm_id: id });
      setIsSaved(false);
    } else {
      await supabase.from('saved_firms').insert({ user_id: user.id, firm_id: id });
      setIsSaved(true);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      firm_id: id,
      rating: newReview.rating,
      comment: newReview.comment,
      status: 'pending' // Auto-approve or pending based on policy
    });

    if (error) {
      setSubmitMsg("Failed to post review.");
      showModal({
        type: 'error',
        title: 'Review Failed',
        message: 'Failed to post review. Please try again.'
      });
    } else {
      setSubmitMsg("Review submitted successfully!");
      showModal({
        type: 'success',
        title: 'Review Submitted',
        message: 'Your review has been submitted successfully!'
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      // Refresh reviews
      const { data } = await supabase.from('reviews').select('*, profiles(full_name)').eq('firm_id', id).order('created_at', { ascending: false });
      if (data) setReviews(data);
    }
  };


  // Scroll spy for active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'rules', 'payouts', 'reviews'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 100 && rect.top <= 500) {
            setActiveTab(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 140; // Height of navbar + sticky tabs
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveTab(sectionId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-brand-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Firm Not Found</h2>
          <Link to="/firms"><Button>Back to Browse</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-black text-brand-muted font-sans">

      {/* Main Content Area */}
      <div className="flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[1100px] w-full px-4 sm:px-6 flex-1 gap-6">

          {/* Profile Header */}
          <div className="flex flex-col rounded-xl bg-brand-charcoal border border-brand-border p-4 md:p-6 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* DESKTOP LAYOUT (md and up): Original 3-column layout */}
            <div className="hidden md:flex md:flex-row md:justify-between md:items-start gap-6 relative z-10">
              <div className="flex gap-6">
                {/* Logo */}
                <FirmLogo src={firm.logo} alt={firm.name} size="xl" className="border border-brand-border bg-brand-black" />

                {/* Title & Badges */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">{firm.name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 border border-green-800 px-2 py-0.5 text-xs font-medium text-green-400">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-brand-muted text-sm md:text-base">
                    <div className="flex items-center gap-1 text-brand-gold">
                      <span className="material-symbols-outlined fill-current text-[18px]">star</span>
                      <span className="font-bold text-white">{firm.rating}</span>
                      <span className="text-brand-muted">/ 5</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-brand-muted"></span>
                    <span className="flex items-center gap-1">
                      <Shield size={14} className={firm.trustScore > 90 ? "text-green-500" : "text-yellow-500"} />
                      {firm.trustScore > 90 ? "Excellent Trust Score" : "Good Trust Score"}
                    </span>
                  </div>

                  <div className="mt-1 flex gap-2">
                    {(firm.tags || []).map(tag => (
                      <PlatformLogo key={tag} platform={tag} size="sm" />
                    ))}
                  </div>

                  {/* Firm Details - Year Founded & HQ */}
                  <div className="mt-2 flex items-center gap-4 text-sm text-brand-muted">
                    {firm.foundedYear && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-brand-gold" />
                        <span>Founded {firm.foundedYear}</span>
                      </span>
                    )}
                    {firm.hqLocation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand-gold" />
                        <span className="flex items-center gap-1">
                          <span className="text-lg leading-none">{getCountryFlag(firm.hqLocation)}</span>
                          <span>{firm.hqLocation}</span>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA - Desktop */}
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="flex gap-2">
                  <button
                    onClick={toggleSave}
                    className={`flex items-center justify-center w-11 h-11 rounded-lg border transition-all ${isSaved ? 'bg-brand-gold text-brand-black border-brand-gold' : 'bg-brand-charcoal border-brand-border text-brand-muted hover:text-white hover:border-white'}`}
                    title={isSaved ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Heart size={20} className={isSaved ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => {
                      FirmService.trackClick(firm.id, 'firm_detail');
                      window.open(firm.website, '_blank');
                    }}
                    className="flex-1 cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-brand-gold text-brand-black text-sm font-bold shadow-[0_0_15px_rgba(246,174,19,0.15)] hover:bg-brand-goldHover hover:shadow-[0_0_20px_rgba(246,174,19,0.3)] transition-all">
                    Visit Official Website
                  </button>
                </div>
                {/* Promo Code Section */}
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(firm.discountCode || 'SPOT');
                    showModal({ type: 'success', title: 'Code Copied!', message: `Promo code "${firm.discountCode || 'SPOT'}" copied to clipboard!` });
                  }}
                  className="flex items-center justify-center gap-3 px-4 py-2.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 cursor-pointer hover:border-brand-gold hover:bg-brand-gold/20 transition-all group"
                >
                  <span className="text-brand-gold text-sm font-medium">Code</span>
                  <span className="w-px h-4 bg-brand-gold/40"></span>
                  <span className="text-white font-bold tracking-wider">{firm.discountCode || 'SPOT'}</span>
                  <span className="material-symbols-outlined text-brand-gold text-[18px] group-hover:scale-110 transition-transform">content_copy</span>
                </div>
                <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-green-500">local_offer</span> Exclusive: 100% Refund
                </p>
              </div>
            </div>

            {/* MOBILE LAYOUT (below md): Centered stacked layout */}
            <div className="flex md:hidden flex-col items-center gap-4 relative z-10">
              {/* Logo - Centered */}
              <FirmLogo src={firm.logo} alt={firm.name} size="xl" className="border border-brand-border bg-brand-black" />

              {/* Title & Verified Badge */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-white text-xl font-bold leading-tight">{firm.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 border border-green-800 px-2.5 py-1 text-xs font-medium text-green-400">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                </span>
              </div>

              {/* Rating & Trust Score - Side by side on mobile */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-brand-gold">
                  <span className="material-symbols-outlined fill-current text-[16px]">star</span>
                  <span className="font-bold text-white">{firm.rating}</span>
                  <span className="text-brand-muted text-xs">/ 5</span>
                </div>
                <span className="text-brand-border">•</span>
                <span className="flex items-center gap-1 text-brand-muted">
                  <Shield size={12} className={firm.trustScore > 90 ? "text-green-500" : "text-yellow-500"} />
                  <span className="text-xs">{firm.trustScore > 90 ? "Excellent" : "Good"} Trust</span>
                </span>
              </div>

              {/* Platform Tags */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {(firm.tags || []).map(tag => (
                  <PlatformLogo key={tag} platform={tag} size="sm" />
                ))}
              </div>

              {/* Firm Details - Mobile */}
              <div className="flex items-center justify-center gap-3 text-xs text-brand-muted">
                {firm.foundedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-brand-gold" />
                    <span>Est. {firm.foundedYear}</span>
                  </span>
                )}
                {firm.hqLocation && (
                  <span className="flex items-center gap-1">
                    <span className="text-base leading-none">{getCountryFlag(firm.hqLocation)}</span>
                    <span>{firm.hqLocation}</span>
                  </span>
                )}
              </div>

              {/* CTA Buttons - Full width */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={toggleSave}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all ${isSaved ? 'bg-brand-gold text-brand-black border-brand-gold' : 'bg-brand-surface border-brand-border text-brand-muted'}`}
                  >
                    <Heart size={20} className={isSaved ? "fill-current" : ""} />
                  </button>
                  <button
                    onClick={() => {
                      FirmService.trackClick(firm.id, 'firm_detail');
                      window.open(firm.website, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center rounded-lg h-12 bg-brand-gold text-brand-black font-bold shadow-lg">
                    Visit Official Website
                  </button>
                </div>
                {/* Promo Code Section - Mobile */}
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(firm.discountCode || 'SPOT');
                    showModal({ type: 'success', title: 'Code Copied!', message: `Promo code "${firm.discountCode || 'SPOT'}" copied to clipboard!` });
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 cursor-pointer active:scale-95 active:bg-brand-gold/20 transition-all w-full"
                >
                  <span className="text-brand-gold text-xs font-medium">Code</span>
                  <span className="w-px h-3 bg-brand-gold/40"></span>
                  <span className="text-white font-bold text-sm tracking-wider">{firm.discountCode || 'SPOT'}</span>
                  <span className="material-symbols-outlined text-brand-gold text-[16px]">content_copy</span>
                </div>
                <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-green-500">local_offer</span> Exclusive: 100% Refund
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Tabs Navigation */}
          <div className="sticky top-[72px] z-40 bg-brand-black/95 backdrop-blur border-b border-brand-border">
            <div className="flex gap-8 overflow-x-auto no-scrollbar px-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'rules', label: 'Challenge Rules' },
                { id: 'payouts', label: 'Payouts' },
                { id: 'reviews', label: 'Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`group flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-[80px] transition-colors ${activeTab === tab.id
                    ? 'border-b-brand-gold text-white'
                    : 'border-b-transparent text-brand-muted hover:text-white'
                    }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-wide">{tab.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content: Overview */}
          <div id="overview" className="flex flex-col gap-8 pt-4 scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Description & Stats */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <section>
                  <h3 className="text-white text-xl font-bold mb-4">Firm Overview</h3>
                  <p className="text-brand-muted leading-relaxed">
                    {firm.description} {firm.name} has established itself as a market leader by offering competitive spreads and a wide range of trading instruments. Their platform is designed for serious traders looking for scalability and reliability.
                  </p>
                </section>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-brand-charcoal border border-brand-border p-4 rounded-lg flex flex-col gap-2">
                    <div className="text-brand-muted text-xs uppercase font-bold tracking-wider">Founded</div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-gold text-[20px]">calendar_today</span> {firm.foundedYear || firm.founded || '2023'}
                    </div>
                  </div>
                  <div className="bg-brand-charcoal border border-brand-border p-4 rounded-lg flex flex-col gap-2">
                    <div className="text-brand-muted text-xs uppercase font-bold tracking-wider">HQ Location</div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-gold text-[20px]">location_on</span> {firm.hqLocation || 'USA'}
                    </div>
                  </div>
                  <div className="bg-brand-charcoal border border-brand-border p-4 rounded-lg flex flex-col gap-2">
                    <div className="text-brand-muted text-xs uppercase font-bold tracking-wider">Max Capital</div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-gold text-[20px]">payments</span> ${(firm.maxFunding / 1000)}k
                    </div>
                  </div>
                  <div className="bg-brand-charcoal border border-brand-border p-4 rounded-lg flex flex-col gap-2">
                    <div className="text-brand-muted text-xs uppercase font-bold tracking-wider">Profit Split</div>
                    <div className="text-white font-semibold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-brand-gold text-[20px]">pie_chart</span> {firm.profitSplit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-brand-charcoal to-brand-black border border-brand-border/50 rounded-xl p-6 sticky top-36 shadow-lg relative overflow-hidden group">
                  {/* Subtle Top Glow */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                  <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <Layers className="text-brand-gold" size={20} />
                    Platform Specs
                  </h4>

                  <ul className="flex flex-col gap-5">
                    <li className="flex flex-col gap-2 border-b border-brand-border/30 pb-4">
                      <span className="text-brand-muted text-xs uppercase font-bold tracking-wider">Platforms</span>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {firm.platforms.map((p, i) => (
                          <span key={i} className="text-white bg-brand-charcoal border border-brand-border px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                            {p}
                          </span>
                        ))}
                      </div>
                    </li>

                    <li className="flex justify-between items-center border-b border-brand-border/30 pb-4">
                      <span className="text-brand-muted text-sm font-medium">Leverage</span>
                      <span className="text-white font-bold text-base tracking-wide bg-brand-charcoal px-2 py-0.5 rounded border border-brand-border/30">{firm.leverage || '1:100'}</span>
                    </li>

                    <li className="flex justify-between items-center border-b border-brand-border/30 pb-4">
                      <span className="text-brand-muted text-sm font-medium">News Trading</span>
                      {firm.newsTrading ? (
                        <span className="text-green-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 bg-green-900/10 px-2 py-1 rounded-full border border-green-900/20">
                          <CheckCircle size={12} strokeWidth={3} /> Allowed
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 bg-red-900/10 px-2 py-1 rounded-full border border-red-900/20">
                          <XCircle size={12} strokeWidth={3} /> Not Allowed
                        </span>
                      )}
                    </li>

                    <li className="flex justify-between items-center border-b border-brand-border/30 pb-4">
                      <span className="text-brand-muted text-sm font-medium">Weekend Holding</span>
                      {firm.weekendHolding ? (
                        <span className="text-green-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 bg-green-900/10 px-2 py-1 rounded-full border border-green-900/20">
                          <CheckCircle size={12} strokeWidth={3} /> Allowed
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 bg-red-900/10 px-2 py-1 rounded-full border border-red-900/20">
                          <XCircle size={12} strokeWidth={3} /> Prohibited
                        </span>
                      )}
                    </li>

                    <li className="flex flex-col gap-2 pt-1">
                      <span className="text-brand-muted text-xs uppercase font-bold tracking-wider flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-brand-gold" /> Scaling Plan
                      </span>
                      <div className="relative">
                        {firm.scalingPlan ? (
                          <div className="bg-brand-charcoal/80 border border-brand-border/50 rounded-lg p-3 shadow-inner">
                            <p className="text-white text-sm leading-relaxed">
                              {firm.scalingPlanDetails || 'Yes (every 3 months)'}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-brand-muted/70 italic text-sm p-2">
                            <XCircle size={14} /> Not Offered by this firm
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content: Challenge Rules */}
          <div id="rules" className="flex flex-col gap-6 pt-8 border-t border-brand-border mt-8 scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-white text-xl font-bold">Challenge Rules & Pricing</h3>
              <div className="flex flex-wrap bg-brand-charcoal rounded-lg p-1 border border-brand-border gap-1">
                {['all', '1-Step', '2-Step', '3-Step', 'Instant'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChallengeType(type)}
                    className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${selectedChallengeType === type
                      ? 'bg-brand-gold text-brand-black shadow-sm'
                      : 'text-brand-muted hover:text-white'
                      }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-charcoal">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-brand-black text-brand-muted uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-4 sm:px-6 py-4">Account Size</th>
                      <th className="px-4 sm:px-6 py-4">Type</th>
                      <th className="px-4 sm:px-6 py-4 hidden md:table-cell">Profit Target</th>
                      <th className="px-4 sm:px-6 py-4 hidden lg:table-cell">Daily DD</th>
                      <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Max DD</th>
                      <th className="px-4 sm:px-6 py-4">Price</th>
                      {/* PREMIUM FEATURE: Action column - uncomment when enabling Buy Now button
                      <th className="px-4 sm:px-6 py-4 text-right">Action</th>
                      */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-white">
                    {(() => {
                      const filteredChallenges = firm?.challenges?.filter(c =>
                        selectedChallengeType === 'all' || c.challengeType === selectedChallengeType
                      ) || [];

                      if (filteredChallenges.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-4xl text-brand-muted">search_off</span>
                                <p className="text-brand-muted font-medium">
                                  {selectedChallengeType === 'all'
                                    ? 'No challenges available for this firm yet.'
                                    : `No ${selectedChallengeType} challenges listed for this firm.`
                                  }
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return filteredChallenges.map((challenge) => (
                        <tr key={challenge.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 sm:px-6 py-4 font-bold text-brand-gold">{challenge.accountSize}</td>
                          <td className="px-4 sm:px-6 py-4">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-gold/20 text-brand-gold">
                              {challenge.challengeType}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 hidden md:table-cell">{challenge.profitTarget}</td>
                          <td className="px-4 sm:px-6 py-4 text-brand-muted hidden lg:table-cell">{challenge.dailyDrawdown}</td>
                          <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">{challenge.maxDrawdown}</td>
                          <td className="px-4 sm:px-6 py-4 font-bold">{challenge.price}</td>
                          <td className="px-4 sm:px-6 py-4 text-right">
                            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                              {firm.discountCode && (
                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/30 text-green-400 border border-green-800 whitespace-nowrap">
                                  Code: {firm.discountCode}
                                </span>
                              )}
                              <a
                                href={firm.affiliateLink || firm.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => FirmService.trackClick(firm.id, 'challenge_buy')}
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-brand-gold text-brand-black text-xs sm:text-sm font-bold hover:bg-brand-goldHover transition-colors shadow-lg shadow-brand-gold/20 whitespace-nowrap"
                              >
                                Buy Now
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tab Content: Payouts */}
          <div id="payouts" className="flex flex-col gap-6 pt-8 border-t border-brand-border mt-8 scroll-mt-32">
            <h3 className="text-white text-xl font-bold">Payout Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brand-charcoal border border-brand-border rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-900/30 text-green-400">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <div className="text-brand-muted text-sm font-medium">Average Payout Time</div>
                    <div className="text-white text-2xl font-bold">{firm.avgPayoutTime || '12 Hours'}</div>
                  </div>
                </div>
                <div className="h-2 w-full bg-brand-black rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${firm.payoutPercentage || 95}%` }}></div>
                </div>
                <p className="text-xs text-brand-muted">{firm.payoutPercentage || 95}% of requests processed within 24h</p>
              </div>

              <div className="bg-brand-charcoal border border-brand-border rounded-xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-brand-muted text-sm font-medium">Last 30 Days Payouts</div>
                    <div className="text-white text-2xl font-bold">{firm.last30DaysPayouts || '$4.2M+'}</div>
                  </div>
                  <span className="bg-brand-gold/20 text-brand-gold text-xs px-2 py-1 rounded font-bold">{firm.payoutGrowth || '+12%'} vs last month</span>
                </div>
                <div className="flex gap-2 mt-4 items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-charcoal bg-brand-border flex items-center justify-center text-xs text-white">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-brand-muted ml-2">Verified trader proofs available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content: Reviews */}
          <div id="reviews" className="flex flex-col gap-6 pt-8 border-t border-brand-border mt-8 scroll-mt-32">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl font-bold">Trader Reviews ({reviews.length})</h3>

              {!showReviewForm && (
                <Button onClick={() => user ? setShowReviewForm(true) : showModal({ type: 'info', title: 'Login Required', message: 'Please log in to write a review.' })} size="sm" variant="secondary">
                  <MessageSquare size={16} className="mr-2" /> Write a Review
                </Button>
              )}
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <div className="bg-brand-surface border border-brand-border rounded-xl p-6 animate-fade-in-up">
                <h4 className="text-white font-bold mb-4">Write your review</h4>
                <form onSubmit={submitReview} className="flex flex-col gap-4">
                  <div>
                    <label className="text-brand-muted text-sm mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`p-1 transition-transform hover:scale-110 ${newReview.rating >= star ? 'text-brand-gold' : 'text-gray-600'}`}
                        >
                          <Star fill={newReview.rating >= star ? "currentColor" : "none"} size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-brand-muted text-sm mb-2 block">Your Experience</label>
                    <textarea
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this firm..."
                      className="w-full bg-brand-black border border-brand-border rounded-lg p-3 text-white focus:border-brand-gold outline-none min-h-[100px]"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit">Submit Review</Button>
                    <Button type="button" variant="ghost" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                  </div>
                  {submitMsg && <p className="text-green-500 text-sm">{submitMsg}</p>}
                </form>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="bg-brand-charcoal border border-brand-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold uppercase border border-brand-gold/30">
                        {review.profiles?.full_name?.substring(0, 2) || 'TR'}
                      </div>
                      <div>
                        <div className="text-white font-bold">{review.profiles?.full_name || 'Trader'}</div>
                        <div className="text-brand-muted text-xs flex items-center gap-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-brand-gold mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="material-symbols-outlined text-[18px]">
                        {review.rating >= star ? 'star' : 'star_border'}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              )) : (
                <div className="text-center py-12 text-brand-muted bg-brand-charcoal/50 rounded-xl border border-brand-border border-dashed">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            {reviews.length > 5 && (
              <button className="w-full py-3 text-brand-muted text-sm font-medium border border-brand-border rounded-lg hover:bg-brand-charcoal hover:text-white transition-colors">
                Load More Reviews
              </button>
            )}
          </div>

          {/* Similar Firms Carousel */}
          <div id="similar" className="flex flex-col gap-6 pt-12 pb-12 mt-8">
            <h3 className="text-white text-xl font-bold">Similar Firms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarFirms.length > 0 ? (
                similarFirms.map(similarFirm => (
                  <FirmCard key={similarFirm.id} firm={similarFirm} />
                ))
              ) : (
                <p className="text-brand-muted col-span-3 text-center py-8">No similar firms found. Add more firms in the Admin Panel.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FirmDetailPage;