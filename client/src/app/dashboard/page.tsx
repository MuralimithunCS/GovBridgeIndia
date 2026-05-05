'use client';

import { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, Bell, ChevronRight, Globe, Home, Heart, Briefcase, GraduationCap, Check } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schemes');
        const data = await res.json();
        setSchemes(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <section className="bg-[#002f6c] pt-10 pb-16 px-6 sm:px-12 text-white relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-1 font-medium">Welcome back,</p>
            <h1 className="text-3xl font-black mb-3">Muralimithun CS</h1>
            <div className="flex items-center gap-2 text-slate-400 text-[13px] font-bold">
              <Home size={14} />
              <span>Karnataka, Bangalore</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/20">
            M
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-[#001b3d] rounded-2xl p-4 px-6 flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
              <Star size={18} />
            </div>
            <p className="text-[14px] font-bold">
              You qualify for <span className="text-orange-500">8 schemes</span> based on your profile
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Star className="text-orange-500" />} label="Eligible Schemes" value="8" />
          <StatCard icon={<Globe className="text-blue-500" />} label="Total Schemes" value="34" />
          <StatCard icon={<Home className="text-indigo-500" />} label="Central Schemes" value="22" />
          <StatCard icon={<TrendingUp className="text-success" />} label="New This Month" value="4" />
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
                  <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">8 schemes matched to your profile</p>
                </div>
              </div>
              <Link href="/schemes" className="text-[13px] font-black text-slate-400 hover:text-slate-900 flex items-center gap-1 uppercase tracking-widest transition-colors">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse"></div>)
              ) : (
                schemes.map((scheme) => (
                  <Link key={scheme._id} href={`/schemes/${scheme._id}`} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <Heart className="text-red-500" size={20} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-[16px] font-black text-slate-800 group-hover:text-[#002f6c]">{scheme.name}</h3>
                      <p className="text-[12px] font-black text-orange-500 mt-1 uppercase tracking-widest">₹5 Lakh health insurance/year</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 bg-success/10 rounded-full flex items-center justify-center text-success">
                          <Check size={10} />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400">Your income is within the ₹3.0L limit</p>
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
