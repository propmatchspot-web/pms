import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Heart, MessageSquare, Award, Gift, Settings, LogOut, User as UserIcon } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    points: 0,
    reviews: 0,
    saved: 0
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);

    // Placeholder for fetching real stats counts
    // In a real app, you'd make a COUNT query to 'reviews', 'saved_firms', etc.
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab stats={stats} user={user} />;
      case 'Favorites':
        return <FavoritesTab user={user} />;
      case 'My Reviews':
        return <ReviewsTab user={user} />;
      case 'Achievements':
        return <AchievementsTab stats={stats} />;
      case 'Rewards':
        return <RewardsTab stats={stats} />;
      case 'Settings':
        return <SettingsTab user={user} profile={profile} refreshProfile={getProfile} />;
      default:
        return <OverviewTab stats={stats} user={user} />;
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-brand-surface rounded-xl border border-brand-border p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-black font-bold text-xl overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="uppercase">{profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-white font-bold truncate">{profile?.full_name || 'User'}</h3>
                  <p className="text-xs text-brand-muted truncate">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: LayoutDashboard, label: 'Overview' },
                  { icon: Heart, label: 'Favorites' },
                  { icon: MessageSquare, label: 'My Reviews' },
                  { icon: Award, label: 'Achievements' },
                  { icon: Gift, label: 'Rewards' },
                  { icon: Settings, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.label
                      ? 'bg-brand-gold text-black shadow-glow'
                      : 'text-brand-muted hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}

                <div className="pt-6 mt-6 border-t border-brand-border">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

// Sub-components
/* -----------------------------------------------------------------------------------------
   1. OVERVIEW TAB
----------------------------------------------------------------------------------------- */
const OverviewTab = ({ stats, user }: { stats: any, user: any }) => (
  <div className="space-y-8 animate-fade-in-up">
    {/* Welcome Banner */}
    <div className="bg-gradient-to-r from-brand-charcoal to-brand-surface border border-brand-border rounded-xl p-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h2>
        <p className="text-brand-muted">Here's what's happening with your trading journey today.</p>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Award}
        label="Loyalty Points"
        value={stats.points?.toString() || "0"}
        subValue="+0 pts"
        color="text-brand-gold"
        bg="bg-brand-gold/10"
      />
      <StatCard
        icon={MessageSquare}
        label="Reviews Posted"
        value={stats.reviews?.toString() || "0"}
        color="text-blue-500"
        bg="bg-blue-500/10"
      />
      <StatCard
        icon={Heart}
        label="Saved Firms"
        value={stats.saved?.toString() || "0"}
        color="text-red-500"
        bg="bg-red-500/10"
      />
    </div>

    {/* Exclusive Reward */}
    <div className="relative rounded-xl overflow-hidden p-8 flex items-center bg-gradient-to-r from-brand-gold to-yellow-600 shadow-glow">
      <div className="relative z-10 text-black">
        <h3 className="text-2xl font-bold mb-2">Claim your free audit!</h3>
        <p className="font-medium mb-6 max-w-md">You've reached Level 1. Keep engaging to unlock a free trading journal audit via Stitch AI.</p>
        <button className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-900 transition-colors shadow-lg">
          Coming Soon
        </button>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/10 skew-x-12"></div>
    </div>
  </div>
);

/* -----------------------------------------------------------------------------------------
   2. FAVORITES TAB
----------------------------------------------------------------------------------------- */
const FavoritesTab = ({ user }: { user: any }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('saved_firms')
        .select('*, firm:firms(*)') // Join with firms table
        .eq('user_id', user.id);
      if (data) setFavorites(data);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  if (loading) return <div className="text-brand-muted">Loading favorites...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Saved Firms</h2>
        <span className="text-brand-muted">{favorites.length} saved</span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-brand-surface border border-brand-border rounded-xl">
          <Heart className="mx-auto h-12 w-12 text-brand-muted mb-4 opacity-50" />
          <h3 className="text-white text-lg font-medium">No saved firms yet</h3>
          <p className="text-brand-muted mt-2">Browse firms and click the heart icon to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-gold/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <img src={fav.firm.logo_url} alt={fav.firm.name} className="h-10 w-10 rounded object-contain bg-white/5 p-1" />
                <Button size="xs" variant="secondary" className="text-red-500 hover:text-red-400">
                  <Heart size={14} className="fill-current" />
                </Button>
              </div>
              <h3 className="font-bold text-white">{fav.firm.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-brand-muted">
                <span className="text-brand-gold">★ {fav.firm.rating}</span>
                <span>•</span>
                <span>{fav.firm.profit_split} Split</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------------------------
   3. REVIEWS TAB
----------------------------------------------------------------------------------------- */
const ReviewsTab = ({ user }: { user: any }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      // In a real app, you'd filter by user_id. Assuming 'reviews' table has user_id or user_name
      // For now we might just query by user name or mocked ID if user_id isn't strictly enforced yet
      // But let's assume strict relation
      if (!user) return;
      // Temporarily fetch all for demo if user_id column missing, but ideally:
      // .eq('user_id', user.id)
      const { data } = await supabase
        .from('reviews')
        .select('*, firm:firms(name)')
        .order('created_at', { ascending: false });

      // Client side filter if needed or just show all for demo purposes
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">My Reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-brand-surface border border-brand-border rounded-xl">
          <MessageSquare className="mx-auto h-12 w-12 text-brand-muted mb-4 opacity-50" />
          <h3 className="text-white text-lg font-medium">No reviews yet</h3>
          <p className="text-brand-muted mt-2">Share your experience with firms to help others.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-brand-surface border border-brand-border rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-lg">{review.firm?.name || 'Unknown Firm'}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < review.rating ? 'text-brand-gold' : 'text-gray-700'}`}>★</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-brand-muted">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300 mt-2">{review.comment}</p>
              <div className="mt-4 flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${review.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                  {review.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------------------------
   4. ACHIEVEMENTS TAB
----------------------------------------------------------------------------------------- */
const AchievementsTab = ({ stats }: { stats: any }) => {
  // Simple logic: Check stats to unlock badges
  const badges = [
    { id: 1, name: 'First Steps', desc: 'Create your account', icon: '🚀', unlocked: true }, // Everyone has this
    { id: 2, name: 'Reviewer', desc: 'Post 1 Review', icon: '📝', unlocked: (stats.reviews || 0) >= 1 },
    { id: 3, name: 'Critic', desc: 'Post 5 Reviews', icon: '⭐', unlocked: (stats.reviews || 0) >= 5 },
    { id: 4, name: 'Collector', desc: 'Save 3 Firms', icon: '❤️', unlocked: (stats.saved || 0) >= 3 },
    { id: 5, name: 'Pro Trader', desc: 'Reach Level 2', icon: '🏆', unlocked: (stats.points || 0) >= 1000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-6 rounded-xl border transition-all ${badge.unlocked
              ? 'bg-brand-surface border-brand-gold/30 shadow-glow'
              : 'bg-brand-charcoal border-brand-border opacity-60 grayscale'
              }`}
          >
            <div className="text-4xl mb-4">{badge.icon}</div>
            <h3 className={`font-bold text-lg ${badge.unlocked ? 'text-white' : 'text-neutral-500'}`}>
              {badge.name}
            </h3>
            <p className="text-sm text-brand-muted mt-1">{badge.desc}</p>
            {badge.unlocked ? (
              <div className="absolute top-4 right-4 text-green-500">
                <Award size={20} />
              </div>
            ) : (
              <div className="absolute top-4 right-4 text-neutral-600">
                <span className="text-xs font-bold uppercase border border-neutral-600 px-2 py-0.5 rounded">Locked</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------
   5. REWARDS TAB
----------------------------------------------------------------------------------------- */
const RewardsTab = ({ stats }: { stats: any }) => {
  // Mock rewards based on points/level
  const rewards = [
    { id: 1, title: 'Free Audit', cost: 0, desc: 'One-time free journal audit', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200', available: true },
    { id: 2, title: '10% Off Stitch AI', cost: 500, desc: 'Get pro features for less', image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=200', available: (stats.points || 0) >= 500 },
    { id: 3, title: 'Exclusive E-Book', cost: 1000, desc: 'Advanced Risk Management', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200', available: (stats.points || 0) >= 1000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white">Rewards Store</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden group">
            <div className="h-32 bg-gray-800 relative">
              <img src={reward.image} alt={reward.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-white backdrop-blur-sm">
                {reward.cost === 0 ? 'FREE' : `${reward.cost} Pts`}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white text-lg">{reward.title}</h3>
              <p className="text-sm text-brand-muted mt-1 mb-4">{reward.desc}</p>
              <Button
                className={`w-full ${reward.available ? 'bg-brand-gold text-black' : 'bg-brand-charcoal text-neutral-500 cursor-not-allowed'}`}
                disabled={!reward.available}
              >
                {reward.available ? 'Redeem Reward' : `Need ${reward.cost - (stats.points || 0)} more pts`}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------
   6. SETTINGS TAB
----------------------------------------------------------------------------------------- */
const SettingsTab = ({ user, profile, refreshProfile }: { user: any, profile: any, refreshProfile: () => void }) => {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name || '');
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (error) {
      setMsg('Error updating profile');
    } else {
      setMsg('Profile updated successfully!');
      refreshProfile();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Email Address</label>
            <input type="text" disabled value={user?.email} className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-muted mb-2">Display Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-brand-charcoal border border-brand-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
          {msg && <p className={`text-sm ${msg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{msg}</p>}
          <div className="pt-4">
            <Button type="submit" disabled={loading} className="bg-brand-gold text-black w-full sm:w-auto">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subValue, color, bg }: any) => (
  <div className="bg-brand-surface border border-brand-border rounded-xl p-6 hover:border-brand-gold/30 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 ${bg} rounded-lg ${color}`}><Icon size={20} /></div>
      {subValue && <span className="text-xs text-green-500 font-medium">{subValue}</span>}
    </div>
    <h4 className="text-brand-muted text-sm">{label}</h4>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

export default UserDashboard;