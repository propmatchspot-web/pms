import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    MessageSquare,
    MoreVertical,
    Star,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Review {
    id: string;
    firm_id: string;
    user_name: string;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
    firms?: { name: string; logo_url: string };
}

const AdminReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, firms(name, logo_url)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('reviews')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error('Error updating review:', error);
            alert('Failed to update status');
        }
    };

    const filteredReviews = filterStatus === 'all'
        ? reviews
        : reviews.filter(r => r.status === filterStatus);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">Review Moderation</h2>
                    <p className="text-brand-muted text-sm mt-1">Approve, reject, or flag user reviews.</p>
                </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['all', 'pending', 'approved', 'rejected', 'flagged'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${filterStatus === status
                                    ? 'bg-brand-gold text-brand-black font-bold'
                                    : 'bg-brand-black border border-brand-border text-brand-muted hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-brand-muted gap-2">
                        <Loader2 className="animate-spin" size={24} />
                        Loading reviews...
                    </div>
                ) : filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-brand-card border border-brand-border rounded-xl p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-lg bg-brand-black border border-brand-border flex items-center justify-center text-brand-muted overflow-hidden">
                                        {review.firms?.logo_url ? (
                                            <img src={review.firms.logo_url} alt={review.firms.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <div className="font-bold text-xs">{review.firms?.name?.substring(0, 2)}</div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{review.firms?.name || 'Unknown Firm'}</h4>
                                        <div className="flex items-center gap-2 text-sm text-brand-muted">
                                            <span>by <span className="text-brand-gold">{review.user_name}</span></span>
                                            <span>•</span>
                                            <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${review.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        review.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            review.status === 'flagged' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                                    }`}>
                                    {review.status}
                                </div>
                            </div>

                            <div className="bg-brand-black/50 border border-brand-border rounded-lg p-4">
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={`${i < review.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-muted'}`} />
                                    ))}
                                    <span className="text-white font-bold text-sm ml-2">{review.rating}.0</span>
                                </div>
                                <p className="text-brand-muted text-sm leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-brand-border mt-2">
                                {review.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(review.id, 'approved')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            <CheckCircle2 size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(review.id, 'rejected')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(review.id, 'flagged')}
                                            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            <AlertTriangle size={16} /> Flag
                                        </button>
                                    </>
                                )}
                                {review.status !== 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange(review.id, 'pending')}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-black border border-brand-border text-brand-muted hover:text-white rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Reset to Pending
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-brand-card border border-brand-border rounded-xl">
                        <MessageSquare className="mx-auto text-brand-muted opacity-20 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-white">No Reviews Found</h3>
                        <p className="text-brand-muted">There are no reviews matching this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviewsPage;
