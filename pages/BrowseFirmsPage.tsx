import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import FirmCard from '../components/FirmCard';
import { FirmService } from '../lib/services';
import { PropFirm } from '../types';

const BrowseFirmsPage: React.FC = () => {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Real Data
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const data = await FirmService.getActiveFirms();
        setFirms(data);
      } catch (err) {
        console.error('Failed to load firms', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, []);

  // Filter States
  const [profitSplit, setProfitSplit] = useState(80);
  const [maxDrawdown, setMaxDrawdown] = useState(10);
  const [minRating, setMinRating] = useState(4);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);

  // Dynamic Date Logic
  const { dynamicTitle, todayDate } = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();

    // Logic: If > 21 days (3 weeks) have passed, show next month
    // Otherwise show current month
    const targetDate = currentDay > 21
      ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
      : now;

    const monthName = targetDate.toLocaleString('en-US', { month: 'short' });
    const year = targetDate.getFullYear();

    // Format: "Oct 24, 2024"
    const formattedToday = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      dynamicTitle: `Top Prop Trading Firms ${monthName} ${year}`,
      todayDate: formattedToday
    };
  }, []);

  const filteredFirms = firms.filter(firm => {
    // If we have no tags, ensure searching by name still works
    const tagMatch = firm.tags ? firm.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) : false;
    const matchesSearch = firm.name.toLowerCase().includes(searchTerm.toLowerCase()) || tagMatch;

    const matchesRating = firm.rating >= minRating;

    let matchesType = true;
    if (selectedAccountType) {
      const typeMap: Record<string, string> = {
        'One Step': '1-Step',
        'Two Step': '2-Step',
        'Three Step': '3-Step',
        'Instant': 'Instant'
      };
      const targetType = typeMap[selectedAccountType];
      // Check if ANY challenge matches the type
      matchesType = firm.challenges ? firm.challenges.some(c => c.challengeType === targetType) : false;
    }

    return matchesSearch && matchesRating && matchesType;
  });

  return (
    <main className="flex-grow pt-24 pb-20 bg-brand-black min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Page Heading */}
            <div className="mb-8 border-b border-brand-border pb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">{dynamicTitle}</h1>
                  <p className="text-brand-muted text-lg">Compare, review, and discover the world's leading proprietary trading firms designed for professional traders.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-muted">
                  <span className="material-symbols-outlined text-brand-gold text-[18px]">verified</span>
                  <span>Updated: {todayDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Sidebar Filters */}
              <aside className="w-full lg:w-72 shrink-0 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">tune</span> Filters
                  </h3>
                  <button
                    onClick={() => { setSearchTerm(''); setProfitSplit(80); setMaxDrawdown(10); setMinRating(4); setSelectedAccountType(null); }}
                    className="text-xs font-medium text-brand-gold hover:text-white transition-colors"
                  >
                    Reset All
                  </button>
                </div>

                {/* Filter Group: Account Type (Toggle) */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Evaluation Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['One Step', 'Two Step', 'Three Step', 'Instant'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedAccountType(selectedAccountType === type ? null : type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedAccountType === type
                            ? 'bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_10px_rgba(246,174,19,0.3)]'
                            : 'bg-brand-charcoal text-brand-muted border-brand-border hover:border-brand-gold/50 hover:text-white'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Group: Search */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Firm Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-muted">
                      <span className="material-symbols-outlined text-[18px]">search</span>
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-brand-charcoal border border-brand-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-white focus:border-brand-gold focus:ring-0 placeholder-brand-muted/50 focus:outline-none transition-colors"
                      placeholder="e.g. FTMO"
                    />
                  </div>
                </div>

                {/* Filter Group: Profit Split */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Profit Split</label>
                    <span className="text-xs text-brand-gold font-bold">Up to {profitSplit}%</span>
                  </div>
                  <div className="px-1">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={profitSplit}
                      onChange={(e) => setProfitSplit(Number(e.target.value))}
                      className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-xs text-brand-muted">
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Filter Group: Max Drawdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Max Drawdown</label>
                    <span className="text-xs text-white font-bold">{maxDrawdown}%</span>
                  </div>
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={maxDrawdown}
                      onChange={(e) => setMaxDrawdown(Number(e.target.value))}
                      className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-xs text-brand-muted">
                      <span>5%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                {/* Filter Group: Asset Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Asset Type</label>
                  <div className="space-y-2">
                    {['Forex', 'Indices', 'Commodities', 'Crypto'].map((asset) => (
                      <label key={asset} className="flex items-center gap-3 group cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked={['Indices'].includes(asset)}
                          className="size-4 rounded border-brand-border bg-brand-charcoal text-brand-gold focus:ring-offset-brand-black focus:ring-brand-gold checked:bg-brand-gold checked:border-brand-gold appearance-none border"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{asset}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter Group: Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-brand-muted uppercase tracking-wider">Minimum Rating</label>
                  <div className="flex flex-col gap-2">
                    {[4, 3].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="size-4 border-brand-border bg-brand-charcoal text-brand-gold focus:ring-offset-brand-black focus:ring-brand-gold appearance-none border rounded-full checked:bg-brand-gold"
                        />
                        <div className="flex text-brand-gold text-[16px]">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className={`material-symbols-outlined ${s <= rating ? 'fill-current' : 'text-brand-border'}`}>
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-brand-muted group-hover:text-white">& Up</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CTA Block */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-charcoal to-[#2a251a] border border-brand-border/50 text-center space-y-3">
                  <div className="size-10 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto text-brand-gold">
                    <span className="material-symbols-outlined">mark_email_unread</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">Get New Deals</h4>
                  <p className="text-xs text-brand-muted">Join 15,000+ traders getting weekly prop firm discounts.</p>
                  <button className="w-full py-2 text-xs font-bold uppercase tracking-wider text-brand-black bg-white rounded hover:bg-gray-200 transition-colors">Subscribe</button>
                </div>
              </aside>

              {/* Grid Content */}
              <div className="flex-1 flex flex-col min-w-0">

                {/* Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-brand-charcoal/50 p-3 rounded-xl border border-brand-border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-brand-muted">Showing <span className="text-white font-bold">{filteredFirms.length}</span> Firms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-brand-muted hidden sm:block">Sort by:</label>
                      <select className="bg-brand-black border border-brand-border text-white text-sm rounded-lg focus:ring-brand-gold focus:border-brand-gold block p-2 cursor-pointer">
                        <option>Highest Rated</option>
                        <option>Lowest Price</option>
                        <option>Newest Added</option>
                        <option>Max Funding</option>
                      </select>
                    </div>
                    <div className="h-6 w-px bg-brand-border mx-1"></div>
                    <button className="p-2 text-brand-gold hover:bg-white/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </button>
                    <button className="p-2 text-brand-muted hover:bg-white/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[20px]">view_list</span>
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredFirms.map((firm) => (
                    <FirmCard key={firm.id} firm={firm} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center justify-center p-4 gap-2">
                    <a className="flex size-10 items-center justify-center rounded-lg hover:bg-brand-charcoal transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-white text-[18px]">chevron_left</span>
                    </a>
                    <a className="text-sm font-bold flex size-10 items-center justify-center text-brand-black rounded-lg bg-brand-gold cursor-pointer">1</a>
                    <a className="text-sm font-medium flex size-10 items-center justify-center text-brand-muted hover:text-white hover:bg-brand-charcoal rounded-lg transition-colors cursor-pointer">2</a>
                    <a className="text-sm font-medium flex size-10 items-center justify-center text-brand-muted hover:text-white hover:bg-brand-charcoal rounded-lg transition-colors cursor-pointer">3</a>
                    <span className="flex size-10 items-center justify-center text-brand-muted">...</span>
                    <a className="text-sm font-medium flex size-10 items-center justify-center text-brand-muted hover:text-white hover:bg-brand-charcoal rounded-lg transition-colors cursor-pointer">8</a>
                    <a className="flex size-10 items-center justify-center rounded-lg hover:bg-brand-charcoal transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-white text-[18px]">chevron_right</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default BrowseFirmsPage;