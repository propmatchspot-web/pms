import React, { useState, useEffect } from 'react';
import { Share, Star, Info, CheckCircle, Plus, X, ChevronDown, Trophy, Shield, Calendar, DollarSign } from 'lucide-react';
import { FirmService } from '../lib/services';
import { PropFirm } from '../types';

const ComparePage: React.FC = () => {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [selectedFirmIds, setSelectedFirmIds] = useState<(string | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirms = async () => {
      setLoading(true);
      try {
        const data = await FirmService.getActiveFirms();
        setFirms(data || []);

        // Pre-select first 3 firms if available
        if (data && data.length > 0) {
          const initialIds = [...selectedFirmIds];
          if (data.length >= 1) initialIds[0] = data[0].id;
          if (data.length >= 2) initialIds[1] = data[1].id;
          if (data.length >= 3) initialIds[2] = data[2].id;
          setSelectedFirmIds(initialIds);
        }
      } catch (err) {
        console.error('Error fetching firms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, []);

  const handleSelectFirm = (index: number, firmId: string) => {
    const newSelected = [...selectedFirmIds];
    newSelected[index] = firmId;
    setSelectedFirmIds(newSelected);
  };

  const handleRemoveFirm = (index: number) => {
    const newSelected = [...selectedFirmIds];
    newSelected[index] = null;
    setSelectedFirmIds(newSelected);
  };

  const getFirmById = (id: string | null) => firms.find(f => f.id === id);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-black text-white font-sans">
      <main className="flex-1 flex flex-col items-center px-4 md:px-10 lg:px-20">
        <div className="w-full max-w-[1200px] flex flex-col gap-6">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 text-sm">
            <a className="text-brand-muted hover:text-white transition-colors" href="/#/">Home</a>
            <span className="text-brand-muted">/</span>
            <span className="text-brand-gold font-medium">Compare</span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end pb-4 border-b border-brand-border">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Compare Firms</h1>
              <p className="text-brand-muted text-base max-w-2xl">Select up to 3 prop firms to analyze trading conditions, fees, and rules side-by-side.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border hover:bg-brand-charcoal text-white text-sm font-medium transition-colors">
                <Share size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Comparison Container */}
          <div className="w-full overflow-hidden rounded-xl border border-brand-border bg-brand-charcoal shadow-2xl">
            {/* Selection Header (Grid) */}
            <div className="grid grid-cols-[160px_1fr_1fr_1fr] md:grid-cols-[200px_1fr_1fr_1fr] bg-brand-black border-b border-brand-border sticky top-0 z-10">
              {/* Corner */}
              <div className="p-4 flex items-end border-r border-brand-border pb-6">
                <span className="text-brand-muted text-xs font-bold uppercase tracking-wider">Parameters</span>
              </div>

              {/* Firm Selectors */}
              {[0, 1, 2].map((index) => {
                const selectedFirm = getFirmById(selectedFirmIds[index]);
                return (
                  <div key={index} className="p-4 border-r border-brand-border relative group last:border-r-0 min-w-[150px]">
                    {selectedFirm ? (
                      <div className="flex flex-col h-full justify-between gap-4">
                        <div className="flex items-start justify-between">
                          <div className="size-12 rounded-xl border border-brand-border bg-brand-charcoal p-1 overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={selectedFirm.logo} alt={selectedFirm.name} className="w-full h-full object-contain" />
                          </div>
                          <button onClick={() => handleRemoveFirm(index)} className="text-brand-muted hover:text-red-400 transition-colors">
                            <X size={20} />
                          </button>
                        </div>

                        <div>
                          <h3 className="font-bold text-white leading-none truncate mb-1">{selectedFirm.name}</h3>
                          <div className="flex items-center gap-1 mb-3">
                            <Star size={12} className="text-brand-gold fill-brand-gold" />
                            <span className="text-xs text-brand-muted font-bold">{selectedFirm.rating}</span>
                            <span className="text-[10px] text-brand-muted">({selectedFirm.reviewCount || 0} reviews)</span>
                          </div>

                          <div className="relative">
                            <select
                              className="w-full bg-brand-charcoal border border-brand-border rounded-lg text-xs md:text-sm text-white px-2 py-1.5 pr-6 focus:border-brand-gold focus:ring-0 appearance-none cursor-pointer outline-none transition-all hover:border-brand-gold/50"
                              value={selectedFirm.id}
                              onChange={(e) => handleSelectFirm(index, e.target.value)}
                            >
                              {firms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-2 text-brand-muted pointer-events-none" size={14} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center min-h-[140px]">
                        <div className="relative h-full flex items-center">
                          <select
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => handleSelectFirm(index, e.target.value)}
                            value=""
                          >
                            <option value="" disabled>Select Firm</option>
                            {firms.filter(f => !selectedFirmIds.includes(f.id)).map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                          <div className="border-2 border-dashed border-brand-border hover:border-brand-gold/50 hover:bg-brand-charcoal/50 rounded-xl h-full w-full flex flex-col items-center justify-center gap-3 transition-all group-hover:border-brand-gold/30">
                            <div className="size-10 rounded-full bg-brand-black border border-brand-border text-brand-muted flex items-center justify-center group-hover:text-white transition-colors">
                              <Plus size={24} />
                            </div>
                            <span className="text-sm font-bold text-brand-muted group-hover:text-white transition-colors">Add Firm</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparison Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-fixed">
                <colgroup>
                  <col className="w-[160px] md:w-[200px]" />
                  <col className="w-1/3" />
                  <col className="w-1/3" />
                  <col className="w-1/3" />
                </colgroup>

                {/* SECTION: KEY METRICS */}
                <tbody>
                  <tr className="bg-brand-charcoal border-b border-brand-border">
                    <td className="px-5 py-2 text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-wider bg-black/20" colSpan={4}>
                      Key Metrics
                    </td>
                  </tr>

                  {/* Profit Split */}
                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      <Trophy size={16} className="text-brand-gold" /> Profit Split
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <span className="font-bold text-white text-lg">{getFirmById(selectedFirmIds[i])?.profitSplit || '80%'}</span>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Trust Score */}
                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      <Shield size={16} className={"text-green-500"} /> Trust Score
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-2 w-16 bg-brand-black rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${getFirmById(selectedFirmIds[i])?.trustScore || 80}%` }}></div>
                            </div>
                            <span className="font-bold text-white">{getFirmById(selectedFirmIds[i])?.trustScore || 0}/100</span>
                          </div>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Max Funding */}
                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      <DollarSign size={16} className="text-blue-400" /> Max Funding
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <span className="font-medium text-white text-base">${(getFirmById(selectedFirmIds[i])?.maxFunding || 0).toLocaleString()}</span>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>

                  {/* Drawdown */}
                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      <div className="size-4 rounded bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-[10px]">D</div> Drawdown Limit
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <span className="font-medium text-white">{getFirmById(selectedFirmIds[i])?.drawdown || '10%'}</span>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>
                </tbody>

                {/* SECTION: COMPANY INFO */}
                <tbody>
                  <tr className="bg-brand-charcoal border-b border-brand-border">
                    <td className="px-5 py-2 text-[10px] md:text-xs font-bold text-brand-gold uppercase tracking-wider bg-black/20" colSpan={4}>
                      Company Info
                    </td>
                  </tr>

                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      <Calendar size={16} /> Founded Year
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <span className="text-white">{getFirmById(selectedFirmIds[i])?.foundedYear || getFirmById(selectedFirmIds[i])?.founded}</span>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b border-brand-border hover:bg-brand-black/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-brand-muted font-medium border-r border-brand-border flex items-center gap-2 h-full">
                      HQ Location
                    </td>
                    {[0, 1, 2].map(i => (
                      <td key={i} className="px-4 py-4 text-sm border-r last:border-r-0 border-brand-border text-center">
                        {selectedFirmIds[i] ? (
                          <span className="text-white">{getFirmById(selectedFirmIds[i])?.hqLocation || 'Unknown'}</span>
                        ) : <span className="text-brand-muted/30">--</span>}
                      </td>
                    ))}
                  </tr>
                </tbody>

                {/* Footer / CTAs */}
                <tfoot>
                  <tr>
                    <td className="p-4 border-r border-brand-border bg-brand-charcoal"></td>
                    {[0, 1, 2].map(i => {
                      const firm = getFirmById(selectedFirmIds[i]);
                      return (
                        <td key={i} className="p-6 border-r last:border-r-0 border-brand-border bg-brand-charcoal">
                          {firm ? (
                            <div className="flex justify-center">
                              <a className="w-full max-w-[180px] bg-brand-gold hover:bg-brand-goldHover text-brand-black text-center py-2.5 rounded-lg font-bold text-sm transition-transform hover:scale-105 shadow-[0_0_15px_rgba(246,174,19,0.15)]" href={firm.website || '#'} target="_blank" rel="noreferrer">
                                Visit Site
                              </a>
                            </div>
                          ) : (
                            <div className="flex justify-center"><span className="text-brand-muted text-sm">--</span></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparePage;