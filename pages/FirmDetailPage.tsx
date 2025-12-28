import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ExternalLink, CheckCircle, AlertTriangle, ChevronRight, Globe, Calendar, DollarSign, TrendingDown, Clock, Layers, Star, MapPin, Monitor, XCircle, Check, CreditCard, PieChart } from 'lucide-react';
import Button from '../components/Button';
import FirmCard from '../components/FirmCard';
import { MOCK_FIRMS, MOCK_REVIEWS } from '../constants';

import { FirmService } from '../lib/services';
import { PropFirm } from '../types';

const FirmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
    fetchFirmDetails();
  }, [id]);

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
          <div className="flex flex-col rounded-xl bg-brand-charcoal border border-brand-border p-6 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start relative z-10">
              <div className="flex gap-6">
                {/* Logo */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-black p-2">
                  <img src={firm.logo} alt={firm.name} className="h-full w-full object-contain" />
                </div>

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
                    {firm.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-md bg-brand-border px-2 py-1 text-xs font-medium text-brand-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
                <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-brand-gold text-brand-black text-sm font-bold shadow-[0_0_15px_rgba(246,174,19,0.15)] hover:bg-brand-goldHover hover:shadow-[0_0_20px_rgba(246,174,19,0.3)] transition-all">
                  Visit Official Website
                </button>
                <p className="text-center text-xs text-brand-muted flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-green-500">local_offer</span> Exclusive: 100% Refund
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
                <div className="bg-brand-charcoal border border-brand-border rounded-xl p-5 sticky top-36">
                  <h4 className="text-white font-bold text-lg mb-4">Platform Specs</h4>
                  <ul className="flex flex-col gap-4">
                    <li className="flex justify-between items-center border-b border-brand-border pb-3">
                      <span className="text-brand-muted text-sm">Platforms</span>
                      <span className="text-white font-medium text-sm text-right flex flex-col items-end">
                        {firm.platforms.join(', ')}
                      </span>
                    </li>
                    <li className="flex justify-between items-center border-b border-brand-border pb-3">
                      <span className="text-brand-muted text-sm">Leverage</span>
                      <span className="text-white font-medium text-sm">{firm.leverage || '1:100'}</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-brand-border pb-3">
                      <span className="text-brand-muted text-sm">News Trading</span>
                      <span className="text-green-400 font-medium text-sm flex items-center gap-1">
                        <CheckCircle size={14} /> Allowed
                      </span>
                    </li>
                    <li className="flex justify-between items-center border-b border-brand-border pb-3">
                      <span className="text-brand-muted text-sm">Weekend Holding</span>
                      <span className="text-red-400 font-medium text-sm flex items-center gap-1">
                        <XCircle size={14} /> Prohibited
                      </span>
                    </li>
                    <li className="flex justify-between items-center pt-1">
                      <span className="text-brand-muted text-sm">Scaling Plan</span>
                      <span className="text-white font-medium text-sm">Yes (every 3 months)</span>
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
              <div className="flex bg-brand-charcoal rounded-lg p-1 border border-brand-border w-fit">
                <button className="px-4 py-1.5 rounded-md bg-brand-gold text-brand-black text-sm font-bold shadow-sm">One Step</button>
                <button className="px-4 py-1.5 rounded-md text-brand-muted hover:text-white text-sm font-medium transition-colors">Two Step</button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-charcoal">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-brand-black text-brand-muted uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Account Size</th>
                      <th className="px-6 py-4">Profit Target</th>
                      <th className="px-6 py-4">Daily Drawdown</th>
                      <th className="px-6 py-4">Max Drawdown</th>
                      <th className="px-6 py-4">Min Days</th>
                      <th className="px-6 py-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-white">
                    {firm.challenges && firm.challenges.length > 0 ? (
                      firm.challenges.map((challenge, idx) => (
                        <tr key={challenge.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-brand-gold">{challenge.accountSize}</td>
                          <td className="px-6 py-4">{challenge.profitTarget}</td>
                          <td className="px-6 py-4 text-brand-muted">{challenge.dailyDrawdown}</td>
                          <td className="px-6 py-4">{challenge.maxDrawdown}</td>
                          <td className="px-6 py-4">{challenge.minTradingDays}</td>
                          <td className="px-6 py-4 text-right font-bold">{challenge.price}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-brand-muted">
                          No challenge details available for this firm yet.
                        </td>
                      </tr>
                    )}
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
                    <div className="text-white text-2xl font-bold">12 Hours</div>
                  </div>
                </div>
                <div className="h-2 w-full bg-brand-black rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%]"></div>
                </div>
                <p className="text-xs text-brand-muted">95% of requests processed within 24h</p>
              </div>

              <div className="bg-brand-charcoal border border-brand-border rounded-xl p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-brand-muted text-sm font-medium">Last 30 Days Payouts</div>
                    <div className="text-white text-2xl font-bold">$4.2M+</div>
                  </div>
                  <span className="bg-brand-gold/20 text-brand-gold text-xs px-2 py-1 rounded font-bold">+12% vs last month</span>
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
              <h3 className="text-white text-xl font-bold">Trader Reviews</h3>
              <div className="flex items-center gap-2">
                <span className="text-brand-muted text-sm hidden sm:inline">Sort by:</span>
                <select className="bg-brand-charcoal border-brand-border text-white text-sm rounded-lg focus:ring-brand-gold focus:border-brand-gold p-2 outline-none">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                  <option>Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {MOCK_REVIEWS.filter(r => r.firmId === firm.id || r.firmId === '1').map((review) => (
                <div key={review.id} className="bg-brand-charcoal border border-brand-border rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold uppercase border border-brand-gold/30">
                        {review.user.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-white font-bold">{review.user}</div>
                        <div className="text-brand-muted text-xs flex items-center gap-1">
                          {review.verified && <CheckCircle size={10} className="text-green-500" />} Funded Trader • {review.date}
                        </div>
                      </div>
                    </div>
                    <span className="bg-brand-black px-2 py-1 rounded text-xs text-brand-muted border border-brand-border">Verified Purchase</span>
                  </div>
                  <div className="flex text-brand-gold mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className="material-symbols-outlined text-[18px]">
                        {review.rating >= star ? 'star' : 'star_border'}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.content}
                  </p>
                </div>
              ))}

              {/* Fallback mock review if list is empty or short */}
              <div className="bg-brand-charcoal border border-brand-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">SM</div>
                    <div>
                      <div className="text-white font-bold">Sarah M.</div>
                      <div className="text-brand-muted text-xs">Evaluation Phase • 1 week ago</div>
                    </div>
                  </div>
                </div>
                <div className="flex text-brand-gold mb-2">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="material-symbols-outlined text-[18px] text-brand-border">star</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Great platform execution. Support is a bit slow to respond during weekends, but otherwise a solid experience. The profit split is a huge plus.
                </p>
              </div>
            </div>

            <button className="w-full py-3 text-brand-muted text-sm font-medium border border-brand-border rounded-lg hover:bg-brand-charcoal hover:text-white transition-colors">
              Load More Reviews
            </button>
          </div>

          {/* Similar Firms Carousel */}
          <div id="similar" className="flex flex-col gap-6 pt-12 pb-12 mt-8">
            <h3 className="text-white text-xl font-bold">Similar Firms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_FIRMS.filter(f => f.id !== firm.id).slice(0, 3).map(similarFirm => (
                <FirmCard key={similarFirm.id} firm={similarFirm} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FirmDetailPage;