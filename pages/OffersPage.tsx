
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useModal } from '../context/ModalContext';
import { Loader2 } from 'lucide-react';

interface Offer {
  id: string;
  firm_id: string;
  title: string;
  code: string | null;
  discount: string | null;
  expiry_date: string | null;
  verified: boolean;
  status: string;
  firms?: {
    name: string;
    logo_url: string;
    website: string;
    affiliate_link: string
  };
}

const OffersPage: React.FC = () => {
  const { user } = useAuth(); // Destructured user from useAuth
  const { showModal } = useModal(); // Destructured showModal from useModal
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null); // Added verifying state
  const [proofFile, setProofFile] = useState<File | null>(null); // Added proofFile state

  useEffect(() => {
    fetchOffers(); // Changed to call fetchOffers directly
  }, []);

  // Modified fetchOffers to match the provided snippet
  const fetchOffers = async () => {
    setLoading(true); // Keep loading state consistent with original
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*, firms(name, logo_url, website, affiliate_link)') // Reverted select to original for full data
        .eq('status', 'active')
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Added copyCode function
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showModal({ type: 'success', title: 'Copied!', message: `Promo code ${code} copied to clipboard.` });
  };

  // Added handleVerify function
  const handleVerify = async (offerId: string) => {
    if (!user) {
      showModal({ type: 'info', title: 'Login Required', message: 'Please log in to submit verification.' });
      return;
    }
    if (!proofFile) {
      showModal({ type: 'warning', title: 'Missing Proof', message: 'Please upload a screenshot of your purchase.' });
      return;
    }

    const fileName = `${user.id}/${Date.now()}_proof.jpg`;
    const { error: uploadError } = await supabase.storage.from('proofs').upload(fileName, proofFile);

    if (uploadError) {
      showModal({ type: 'error', title: 'Upload Failed', message: 'Failed to upload proof. Please try again.' });
      return;
    }

    const { error: insertError } = await supabase.from('offer_verifications').insert({
      user_id: user.id,
      offer_id: offerId,
      proof_url: fileName,
      status: 'pending'
    });

    if (insertError) {
      showModal({ type: 'error', title: 'Submission Failed', message: 'Failed to submit verification.' });
    } else {
      showModal({ type: 'success', title: 'Submitted', message: 'Verification request submitted! We will review it shortly.' });
      setVerifying(null);
      setProofFile(null);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 pb-10">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight">Exclusive Prop Firm Deals</h2>
            <p className="text-brand-muted text-base">Verified discounts for premium trading accounts.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-gold bg-brand-gold/10 px-3 py-1.5 rounded-full border border-brand-gold/20">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="font-medium">{offers.filter(o => o.verified).length} Active Offers Verified Today</span>
          </div>
        </div>

        {/* Featured Hero Card (Static for now, could be dynamic later) */}
        <div className="rounded-xl border border-brand-gold/30 bg-gradient-to-r from-brand-charcoal via-[#2a2212] to-brand-charcoal p-6 md:p-8 relative overflow-hidden group shadow-lg shadow-black/50">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gold/10 blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-gold text-brand-black uppercase tracking-wider">Deal of the Month</span>
                <span className="text-brand-muted text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span> Limited Time
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                <span className="text-brand-gold">Save Big</span> on Top Firms
              </h3>
              <p className="text-brand-muted text-lg">Check out our verified list of prop firm coupons below.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex h-9 items-center gap-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 px-4 transition-colors hover:bg-brand-gold/20">
            <span className="text-sm font-medium text-brand-gold">All Offers</span>
          </button>
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-brand-muted gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p>Loading live offers...</p>
            </div>
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className="group flex flex-col justify-between gap-4 rounded-xl border border-brand-border bg-brand-charcoal p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        {offer.firms?.logo_url ? (
                          <img src={offer.firms.logo_url} alt={offer.firms.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <div className="font-bold text-white text-xs">{offer.firms?.name?.substring(0, 2)}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">{offer.firms?.name || 'Unknown Firm'}</h4>
                        <p className="text-xs text-brand-muted">Prop Firm</p>
                      </div>
                    </div>
                    {offer.verified && (
                      <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wide border border-green-500/20">Verified</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white group-hover:text-brand-gold transition-colors">{offer.discount || 'Special Deal'}</span>
                    </div>
                    <p className="text-sm text-brand-muted">{offer.title}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-brand-muted border-t border-brand-border pt-3">
                    {offer.expiry_date ? (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_month</span> Valid until {new Date(offer.expiry_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-brand-muted/50">No expiration date</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={offer.firms?.affiliate_link || offer.firms?.website || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-2.5 rounded-lg text-sm transition-colors text-center"
                    >
                      Claim Offer
                    </a>
                    {offer.code && (
                      <button
                        className="px-3 rounded-lg border border-brand-border bg-brand-black text-brand-muted hover:text-white hover:border-brand-gold/50 transition-colors flex items-center justify-center group/copy"
                        title="Copy Code"
                        onClick={() => {
                          navigator.clipboard.writeText(offer.code || '');
                          alert('Code copied!');
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        <div className="hidden group-hover/copy:block absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded">Copy</div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Active Offers</h3>
              <p className="text-brand-muted">Check back later for new deals or add some in the Admin Dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;