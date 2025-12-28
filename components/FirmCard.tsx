import React from 'react';
import { Link } from 'react-router-dom';
import { PropFirm } from '../types';

interface FirmCardProps {
  firm: PropFirm;
  onCompare?: (firm: PropFirm) => void;
  isCompareSelected?: boolean;
}

const FirmCard: React.FC<FirmCardProps> = ({ firm, onCompare, isCompareSelected }) => {
  return (
    <article className="group bg-brand-charcoal rounded-xl border border-brand-border overflow-hidden hover:border-brand-gold/50 hover:shadow-[0_0_20px_rgba(246,174,19,0.05)] transition-all duration-300 flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden shrink-0">
               <img 
                 src={firm.logo} 
                 alt={firm.name} 
                 className="w-full h-full object-contain"
               />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight text-white group-hover:text-brand-gold transition-colors">{firm.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-900/50 text-teal-400 border border-teal-800">Verified</span>
                {firm.trustScore > 95 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-900/50 text-purple-400 border border-purple-800">Top Tier</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end text-brand-gold text-[14px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="material-symbols-outlined fill-current text-[16px]">
                  {firm.rating >= star ? 'star' : (firm.rating >= star - 0.5 ? 'star_half' : 'star_border')}
                </span>
              ))}
            </div>
            <div className="text-xs font-medium text-brand-muted mt-0.5">{firm.rating}/5 ({firm.reviewCount})</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-brand-border/50">
          <div className="text-center border-r border-brand-border/50 last:border-0">
            <p className="text-[10px] uppercase tracking-wide text-brand-muted mb-1">Max Fund</p>
            <p className="text-sm font-bold text-white tabular-nums">${(firm.maxFunding / 1000)}k</p>
          </div>
          <div className="text-center border-r border-brand-border/50 last:border-0">
            <p className="text-[10px] uppercase tracking-wide text-brand-muted mb-1">Split</p>
            <p className="text-sm font-bold text-white tabular-nums">{firm.profitSplit.replace('%', '')}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wide text-brand-muted mb-1">Drawdown</p>
            <p className="text-sm font-bold text-white tabular-nums">{firm.drawdown}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {firm.tags.slice(0, 3).map((tag, idx) => (
             <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brand-black text-brand-muted border border-brand-border whitespace-nowrap">
               {tag}
             </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#1e1912] border-t border-brand-border flex items-center gap-3">
        <Link to={`/firm/${firm.id}`} className="flex-1">
          <button className="w-full bg-brand-gold hover:bg-brand-goldHover text-brand-black font-bold text-sm py-2.5 rounded-lg transition-colors shadow-[0_2px_10px_rgba(246,174,19,0.2)]">
             View Firm
          </button>
        </Link>
        {onCompare && (
          <label className="flex items-center gap-2 cursor-pointer px-2 select-none">
            <input 
              className="rounded border-brand-border bg-brand-black text-brand-gold focus:ring-0 checked:bg-brand-gold" 
              type="checkbox"
              checked={isCompareSelected}
              onChange={() => onCompare(firm)}
            />
            <span className="text-xs text-brand-muted hover:text-white transition-colors">Compare</span>
          </label>
        )}
      </div>
    </article>
  );
};

export default FirmCard;