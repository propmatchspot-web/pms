import React from 'react';
import { Link } from 'react-router-dom';
import { PropFirm } from '../types';
import { useComparison } from '../context/ComparisonContext';
import FirmLogo from './FirmLogo';
import PlatformLogo from './PlatformLogo';
import { ArrowUpRight, GitCompareArrows } from 'lucide-react';

interface FirmCardProps {
  firm: PropFirm;
  className?: string;
}

const FirmCard: React.FC<FirmCardProps> = ({ firm, className }) => {
  const { toggleFirm, isInComparison } = useComparison();
  const isSelected = isInComparison(firm.id);

  const getFaviconUrl = () => {
    if (firm.favicon) return firm.favicon;
    if (firm.website) {
      try {
        const hostname = new URL(firm.website).hostname;
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
      } catch (e) {
        return firm.logo;
      }
    }
    return firm.logo;
  };

  const iconUrl = getFaviconUrl();
  const splitNum = parseInt(firm.profitSplit?.replace('%', '') || '80');

  return (
    <article className={`group relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:translate-y-[-4px] ${className || ''}`}>
      {/* Card Border Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] group-hover:from-brand-gold/30 group-hover:via-brand-gold/10 group-hover:to-transparent transition-all duration-500 pointer-events-none z-0"></div>

      {/* Card Inner */}
      <div className="absolute inset-[1px] rounded-2xl bg-[#0f0e0b] z-[1]"></div>

      {/* Content */}
      <div className="relative z-[2] flex-1 flex flex-col">
        {/* Top Section: Logo + Name + Rating */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-brand-gold/30 transition-colors">
                  <FirmLogo
                    src={iconUrl}
                    fallbackSrc={firm.logo}
                    alt={firm.name}
                    size="md"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[15px] leading-tight text-white group-hover:text-brand-gold transition-colors duration-300">{firm.name}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Verified
                  </span>
                  {firm.trustScore > 95 && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">Top Tier</span>
                  )}
                </div>
              </div>
            </div>
            {/* Rating */}
            <div className="text-right shrink-0">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2.5 py-1.5 group-hover:border-brand-gold/20 transition-colors">
                <div className="flex items-center gap-0.5 text-brand-gold text-[13px] justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="material-symbols-outlined fill-current text-[14px]">
                      {firm.rating >= star ? 'star' : (firm.rating >= star - 0.5 ? 'star_half' : 'star_border')}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] font-semibold text-neutral-400 mt-0.5 text-center">{firm.rating}/5 ({firm.reviewCount})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-5 pb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Max Fund', value: `$${firm.maxFunding ? Math.round(firm.maxFunding / 1000) : 0}k`, color: 'text-white' },
              { label: 'Profit Split', value: `${firm.profitSplit ? firm.profitSplit.replace('%', '') : '80'}%`, color: 'text-brand-gold' },
              { label: 'Drawdown', value: firm.drawdown || '10%', color: 'text-white' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2.5 text-center group-hover:border-white/[0.08] transition-colors">
                <div className={`text-sm font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-semibold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Profit Split Visual Bar */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-neutral-500 font-medium">Profit Split</span>
            <span className="text-brand-gold font-bold">{splitNum}%</span>
          </div>
          <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold to-amber-400 transition-all duration-1000"
              style={{ width: `${splitNum}%` }}
            ></div>
          </div>
        </div>

        {/* Platform Tags */}
        <div className="px-5 pb-4 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {((firm.tags && firm.tags.length > 0 ? firm.tags : firm.platforms) || []).slice(0, 4).map((tag, idx) => (
              <PlatformLogo key={idx} platform={tag} size="sm" />
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-4 py-3.5 border-t border-white/[0.05] flex items-center gap-2.5 mt-auto">
          <Link to={`/firm/${firm.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-500 hover:to-brand-gold text-black font-bold text-sm py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(246,174,19,0.2)] hover:shadow-[0_4px_20px_rgba(246,174,19,0.35)]">
              View Firm
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </button>
          </Link>
          <button
            onClick={() => toggleFirm(firm)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${isSelected
                ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold'
                : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:border-brand-gold/20 hover:text-white'
              }`}
          >
            <GitCompareArrows size={14} />
            {isSelected ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FirmCard;