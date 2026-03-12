import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import FirmLogo from './FirmLogo';

const ComparisonFloatingBar: React.FC = () => {
    const { selectedFirms, removeFirm, clearSelection } = useComparison();

    if (selectedFirms.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
            <div className="max-w-[1200px] mx-auto bg-brand-charcoal border border-brand-border rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Left: Selected Firms */}
                <div className="flex items-center gap-4 flex-1 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <span className="text-white font-bold text-sm whitespace-nowrap mr-2">
                        Compare ({selectedFirms.length}/3):
                    </span>

                    <div className="flex gap-3">
                        {selectedFirms.map(firm => (
                            <div key={firm.id} className="relative group shrink-0">
                                <FirmLogo src={firm.logo} alt={firm.name} size="sm" className="rounded-lg border border-brand-border" />
                                <button
                                    onClick={() => removeFirm(firm.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Empty Slots placeholders */}
                        {[...Array(3 - selectedFirms.length)].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-lg border border-dashed border-brand-border bg-brand-black/30 flex items-center justify-center shrink-0">
                                <span className="text-brand-muted text-xs font-medium">{i + 1 + selectedFirms.length}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={clearSelection}
                        className="text-brand-muted hover:text-white text-xs font-medium underline px-3"
                    >
                        Clear All
                    </button>

                    <Link to="/compare">
                        <button className="flex items-center gap-2 bg-brand-gold hover:bg-brand-goldHover text-brand-black font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(246,174,19,0.15)] hover:shadow-[0_0_20px_rgba(246,174,19,0.3)] hover:scale-105 active:scale-95">
                            Compare Now <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ComparisonFloatingBar;
