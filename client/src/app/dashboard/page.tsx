'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, TrendingUp, Bell, ChevronRight, Globe, Home, Heart, Briefcase, GraduationCap, Check, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    eligible: 0,
    total: 34,
    central: 22,
    newMonth: 4
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchData(firebaseUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchData = async (firebaseUser: any) => {
    try {
      const token = await firebaseUser.getIdToken();
      
      // Fetch Profile
      const profileRes = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      } else {
        // No profile found - user might need to complete it
        setProfile({ name: firebaseUser.displayName || 'New User', state: 'Not set', district: 'Not set' });
      }

      // Fetch Recommendations
      const recRes = await fetch('http://localhost:5000/api/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData.recommendations);
        setStats(prev => ({ ...prev, eligible: recData.recommendations.length }));
      }

      // Fetch All Schemes for count
      const schemesRes = await fetch('http://localhost:5000/api/schemes');
      if (schemesRes.ok) {
        const schemesData = await schemesRes.json();
        const centralCount = schemesData.filter((s: any) => s.type?.toLowerCase() === 'central').length;
        setStats(prev => ({ 
          ...prev, 
          total: schemesData.length,
          central: centralCount
        }));
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#002f6c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = profile?.name || user?.displayName || 'New User';
  const location = profile?.state ? `${profile.state}, ${profile.district}` : 'Profile incomplete';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <section className="bg-[#002f6c] pt-10 pb-16 px-6 sm:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <p className="text-slate-400 text-sm mb-1 font-medium">Welcome back,</p>
            <h1 className="text-3xl font-black mb-3">{userName}</h1>
            <div className="flex items-center gap-2 text-slate-400 text-[13px] font-bold">
              <Home size={14} />
              <span>{location}</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/20 ring-4 ring-white/10">
            {userName.charAt(0)}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 relative z-10">
          <div className="bg-[#001b3d] rounded-2xl p-4 px-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
              <Star size={18} />
            </div>
            <p className="text-[14px] font-bold">
              You qualify for <span className="text-orange-500">{stats.eligible} schemes</span> based on your profile
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Star className="text-orange-500" />} label="Eligible Schemes" value={stats.eligible.toString()} />
          <StatCard icon={<Globe className="text-blue-500" />} label="Total Schemes" value={stats.total.toString()} />
          <StatCard icon={<Home className="text-indigo-500" />} label="Central Schemes" value={stats.central.toString()} />
          <StatCard icon={<TrendingUp className="text-success" />} label="New This Month" value={stats.newMonth.toString()} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Star size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Recommended for You</h2>
                  <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{stats.eligible} schemes matched to your profile</p>
                </div>
              </div>
              <Link href="/schemes" className="text-[13px] font-black text-slate-400 hover:text-slate-900 flex items-center gap-1 uppercase tracking-widest transition-colors">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <UserIcon className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">Complete Your Profile</h3>
                  <p className="text-sm text-slate-400 font-medium mb-6">Update your details to see which government schemes you are eligible for.</p>
                  <Link href="/search" className="bg-[#002f6c] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#002f6c]/20 hover:bg-slate-900 transition-all">
                    Update Profile
                  </Link>
                </div>
              ) : (
                recommendations.map((scheme) => (
                  <Link key={scheme.id} href={`/schemes/${scheme.id}`} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <Heart className="text-red-500" size={20} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-[16px] font-black text-slate-800 group-hover:text-[#002f6c] truncate">{scheme.name}</h3>
                      <p className="text-[12px] font-bold text-slate-400 mt-1 line-clamp-1">{scheme.benefits?.split('.')[0]}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 bg-success/10 rounded-full flex items-center justify-center text-success">
                          <Check size={10} />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400">Matched based on {scheme.category}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400" />
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Bell size={20} />
              </div>
              <h2 className="text-xl font-black">Alerts & Deadlines</h2>
            </div>

            <div className="space-y-6">
              <AlertItem 
                title="PM Kisan 19th Installment" 
                desc="Next installment expected in April 2025. Ensure your Aadhaar is linked to your bank account."
                color="blue"
              />
              <AlertItem 
                title="Ayushman Bharat Card" 
                desc="New beneficiaries can now apply. Check if your family is included in SECC database."
                color="green"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium flex flex-col items-start gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
        <p className="text-[13px] font-bold text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function AlertItem({ title, desc, color }: { title: string; desc: string; color: string }) {
  const bg = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
  const text = color === 'blue' ? 'text-blue-600' : 'text-green-600';

  return (
    <div className="group cursor-pointer">
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
        <div className={`w-10 h-10 ${bg} ${text} rounded-xl flex items-center justify-center shrink-0`}>
          <Bell size={18} />
        </div>
        <div>
          <h4 className="text-[14px] font-black text-slate-800 mb-1 leading-tight group-hover:text-[#002f6c]">{title}</h4>
          <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}
