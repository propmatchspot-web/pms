import React from 'react';
import { LayoutDashboard, Heart, MessageSquare, Award, Gift, Settings, LogOut, Bell } from 'lucide-react';
import Button from '../components/Button';

const UserDashboard: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-64">
            <div className="bg-brand-charcoal rounded-xl border border-neutral-800 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-black font-bold text-xl">
                  JD
                </div>
                <div>
                  <h3 className="text-white font-bold">John Doe</h3>
                  <p className="text-xs text-neutral-400">Pro Member</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: LayoutDashboard, label: 'Overview', active: true },
                  { icon: Heart, label: 'Favorites', active: false },
                  { icon: MessageSquare, label: 'My Reviews', active: false },
                  { icon: Award, label: 'Achievements', active: false },
                  { icon: Gift, label: 'Rewards', active: false },
                  { icon: Settings, label: 'Settings', active: false },
                ].map((item) => (
                  <button 
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active 
                        ? 'bg-brand-gold text-black' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-6 mt-6 border-t border-neutral-800">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-charcoal border border-neutral-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold"><Award size={20} /></div>
                  <span className="text-xs text-green-500 font-medium">+120 pts</span>
                </div>
                <h4 className="text-neutral-400 text-sm">Loyalty Points</h4>
                <p className="text-2xl font-bold text-white mt-1">2,450</p>
              </div>
              <div className="bg-brand-charcoal border border-neutral-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><MessageSquare size={20} /></div>
                </div>
                <h4 className="text-neutral-400 text-sm">Reviews Posted</h4>
                <p className="text-2xl font-bold text-white mt-1">12</p>
              </div>
              <div className="bg-brand-charcoal border border-neutral-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Heart size={20} /></div>
                </div>
                <h4 className="text-neutral-400 text-sm">Saved Firms</h4>
                <p className="text-2xl font-bold text-white mt-1">5</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-brand-charcoal border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Claimed Discount Code', desc: 'Used code MATCH20 at Alpha Capital', time: '2 hours ago', icon: Gift },
                  { title: 'Posted a Review', desc: 'Reviewed FundedNext (5 stars)', time: 'Yesterday', icon: MessageSquare },
                  { title: 'Saved Firm', desc: 'Added Blue Guardian to favorites', time: '3 days ago', icon: Heart },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-600">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Reward */}
            <div className="relative rounded-xl overflow-hidden p-8 flex items-center bg-gradient-to-r from-brand-gold to-yellow-600">
               <div className="relative z-10 text-black">
                  <h3 className="text-2xl font-bold mb-2">Claim your free audit!</h3>
                  <p className="font-medium mb-6 max-w-md">You've reached Level 3. Unlock a free trading journal audit from our pro mentors.</p>
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-900 transition-colors">Claim Reward</button>
               </div>
               <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/10 skew-x-12"></div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;