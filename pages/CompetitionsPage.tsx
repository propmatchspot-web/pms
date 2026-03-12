import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Ensure this path is correct
import { Trophy, Calendar, DollarSign, ExternalLink, Timer, Filter, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

interface Competition {
    id: string;
    firm_name: string;
    title: string;
    description: string;
    prize_pool: string;
    entry_fee: string;
    start_date: string;
    end_date: string;
    join_url: string;
    image_url: string;
    status: 'upcoming' | 'active' | 'ended';
}

const CompetitionsPage = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('competitions')
                .select('*')
                .order('start_date', { ascending: true });

            if (error) throw error;
            console.log("Supabase Competitions Data:", data); // DEBUG
            setCompetitions(data || []);
        } catch (error) {
            console.error('Error fetching competitions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompetitions = competitions.filter(comp =>
        filter === 'all' ? true : comp.status === filter
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const getDaysRemaining = (targetDate: string) => {
        const diff = new Date(targetDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-36 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-brand-gold/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Trading <span className="text-brand-gold">Competitions</span>
                    </h1>
                    <p className="text-brand-muted text-lg max-w-2xl mx-auto">
                        Test your skills, compete with others, and win funded accounts or cash prizes.
                        Join the most exciting trading events in the industry.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-12">
                    <div className="bg-brand-surface border border-brand-border p-1.5 rounded-xl flex gap-2">
                        {(['all', 'active', 'upcoming'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${filter === f
                                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'
                                    : 'text-brand-muted hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCompetitions.map((comp) => (
                        <div
                            key={comp.id}
                            className="group bg-brand-surface border border-brand-border rounded-2xl overflow-hidden hover:border-brand-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10 flex flex-col h-full"
                        >
                            {/* Image Banner */}
                            <div className="h-48 bg-brand-charcoal relative overflow-hidden p-6 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent opacity-60"></div>
                                <img
                                    src={comp.image_url || 'https://via.placeholder.com/150'}
                                    alt={comp.firm_name}
                                    className="h-20 w-auto object-contain z-10 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${comp.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                        comp.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {comp.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <div className="text-brand-gold text-sm font-semibold mb-1">{comp.firm_name}</div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">{comp.title}</h3>
                                    <p className="text-brand-muted text-sm line-clamp-2">{comp.description}</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div>
                                        <div className="text-brand-muted text-xs mb-1 flex items-center gap-1">
                                            <Trophy size={12} /> Prize Pool
                                        </div>
                                        <div className="text-white font-bold">{comp.prize_pool}</div>
                                    </div>
                                    <div>
                                        <div className="text-brand-muted text-xs mb-1 flex items-center gap-1">
                                            <DollarSign size={12} /> Entry Fee
                                        </div>
                                        <div className="text-brand-gold font-bold">{comp.entry_fee}</div>
                                    </div>
                                    <div>
                                        <div className="text-brand-muted text-xs mb-1 flex items-center gap-1">
                                            <Calendar size={12} /> Start Date
                                        </div>
                                        <div className="text-white text-sm">{formatDate(comp.start_date)}</div>
                                    </div>
                                    <div>
                                        <div className="text-brand-muted text-xs mb-1 flex items-center gap-1">
                                            <Timer size={12} /> Starts In
                                        </div>
                                        <div className="text-white text-sm font-mono">
                                            {getDaysRemaining(comp.start_date)} Days
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="mt-auto">
                                    <Link
                                        to={`/competition/${comp.id}`}
                                        className="block w-full"
                                    >
                                        <Button className="w-full justify-center gap-2 bg-gradient-to-r from-brand-gold to-yellow-500 text-black border-none hover:shadow-lg hover:shadow-brand-gold/20">
                                            View Details <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCompetitions.length === 0 && !loading && (
                    <div className="text-center py-20 text-brand-muted">
                        <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No competitions found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionsPage;
