import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Trophy, Calendar, DollarSign, ExternalLink, Timer, Lock, CheckCircle, ArrowRight, Share2 } from 'lucide-react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Task {
    id: string;
    type: 'twitter' | 'discord' | 'youtube' | 'instagram' | 'telegram' | 'generic';
    text: string;
    url: string;
}

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
    tasks?: Task[]; // JSONB column
}

const CompetitionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [competition, setCompetition] = useState<Competition | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        if (id) fetchCompetition(id);
    }, [id]);

    useEffect(() => {
        if (competition?.tasks) {
            if (competition.tasks.length === 0) {
                setIsUnlocked(true);
            } else {
                const allCompleted = competition.tasks.every(t => completedTasks.includes(t.id));
                setIsUnlocked(allCompleted);
            }
        }
    }, [completedTasks, competition]);

    const fetchCompetition = async (compId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('competitions')
                .select('*')
                .eq('id', compId)
                .single();

            if (error) throw error;
            setCompetition(data);
        } catch (error) {
            console.error('Error fetching competition:', error);
            // navigate('/competitions'); // Optional: Redirect on error
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (task: Task) => {
        // Open link
        window.open(task.url, '_blank');

        // Optimistic verify (Simulate checking)
        if (!completedTasks.includes(task.id)) {
            setTimeout(() => {
                setCompletedTasks(prev => [...prev, task.id]);
            }, 2000); // 2 second delay to simulate user action
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    const getDaysRemaining = (targetDate?: string) => {
        if (!targetDate) return 0;
        const diff = new Date(targetDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div>
            </div>
        );
    }

    if (!competition) return null;

    return (
        <div className="min-h-screen bg-brand-dark font-sans text-white">

            {/* Hero Section */}
            <div className="pt-24 pb-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-brand-gold/10 rounded-full blur-[120px] opacity-50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Back Button */}
                    <button onClick={() => navigate('/competitions')} className="mb-8 flex items-center text-brand-muted hover:text-white transition-colors">
                        <ArrowRight className="rotate-180 mr-2" size={20} /> Back to Competitions
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Left: Main Info */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-16 w-16 bg-white/5 rounded-xl border border-white/10 p-2 flex items-center justify-center bg-white">
                                    <img src={competition.image_url} alt={competition.firm_name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold">{competition.title}</h1>
                                    <div className="text-brand-gold font-medium text-lg">{competition.firm_name}</div>
                                </div>
                            </div>

                            <p className="text-brand-muted text-lg mb-8 leading-relaxed">
                                {competition.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-brand-surface border border-brand-border p-4 rounded-xl">
                                    <div className="text-brand-muted text-xs uppercase tracking-wider mb-1">Prize Pool</div>
                                    <div className="text-2xl font-bold text-white">{competition.prize_pool}</div>
                                </div>
                                <div className="bg-brand-surface border border-brand-border p-4 rounded-xl">
                                    <div className="text-brand-muted text-xs uppercase tracking-wider mb-1">Entry Fee</div>
                                    <div className="text-2xl font-bold text-brand-gold">{competition.entry_fee}</div>
                                </div>
                                <div className="bg-brand-surface border border-brand-border p-4 rounded-xl">
                                    <div className="text-brand-muted text-xs uppercase tracking-wider mb-1">End Date</div>
                                    <div className="text-lg font-semibold text-white">{formatDate(competition.end_date)}</div>
                                </div>
                                <div className="bg-brand-surface border border-brand-border p-4 rounded-xl">
                                    <div className="text-brand-muted text-xs uppercase tracking-wider mb-1">Time Left</div>
                                    <div className="text-lg font-semibold text-white">{getDaysRemaining(competition.end_date)} Days</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Task Locker */}
                        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] pointer-events-none"></div>

                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                {isUnlocked ? <UnlockIcon /> : <Lock className="text-brand-gold" size={24} />}
                                {isUnlocked ? 'Entry Unlocked!' : 'Unlock Entry'}
                            </h3>
                            <p className="text-brand-muted text-sm mb-6">
                                {isUnlocked
                                    ? "You have completed all steps. Good luck!"
                                    : "Complete the tasks below to reveal the official join link."}
                            </p>

                            <div className="space-y-3 mb-8">
                                {competition.tasks && competition.tasks.length > 0 ? (
                                    competition.tasks.map((task, idx) => {
                                        const isCompleted = completedTasks.includes(task.id);
                                        return (
                                            <div
                                                key={task.id}
                                                onClick={() => !isCompleted && handleTaskClick(task)}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isCompleted
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                    : 'bg-black/30 border-white/10 hover:border-brand-gold/50 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500/20' : 'bg-white/10'}`}>
                                                        {getTaskIcon(task.type)}
                                                    </div>
                                                    <span className={`font-medium ${isCompleted ? 'text-green-100' : 'text-white'}`}>{task.text}</span>
                                                </div>
                                                {isCompleted ? <CheckCircle size={20} /> : <ArrowRight size={18} className="opacity-50" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 text-brand-muted text-sm">
                                        No tasks required. Free entry!
                                    </div>
                                )}
                            </div>

                            <a
                                href={isUnlocked ? competition.join_url : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full transition-all duration-300 ${!isUnlocked ? 'pointer-events-none opacity-50 grayscale' : ''}`}
                            >
                                <Button className="w-full justify-center py-4 text-lg font-bold shadow-glow animate-pulse-slow">
                                    {isUnlocked ? 'JOIN COMPETITION NOW' : 'LOCKED'}
                                </Button>
                            </a>

                            {!isUnlocked && (
                                <div className="text-center mt-3 text-xs text-brand-muted flex items-center justify-center gap-1">
                                    <Lock size={12} /> Complete {competition.tasks?.length || 0} tasks to unlock
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getTaskIcon = (type: string) => {
    switch (type) {
        case 'twitter': return <span className="material-symbols-outlined text-[18px]">tag</span>; // Using simple icon effectively
        case 'discord': return <span className="material-symbols-outlined text-[18px]">forum</span>;
        case 'youtube': return <span className="material-symbols-outlined text-[18px]">play_circle</span>;
        default: return <span className="material-symbols-outlined text-[18px]">link</span>;
    }
};

const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
);

export default CompetitionDetailPage;
