'use client';

import Link from 'next/link';
import { Search, Star, TrendingUp, Shield, ChevronRight, Heart, Home, GraduationCap, Briefcase, Check, ArrowRight, Activity, Map, User } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* HERO SECTION */}
      <section className="bg-white pt-16 pb-24 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Find Government <br />
              Schemes <br />
              <span className="text-orange-500">You Deserve</span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl font-medium mb-12 max-w-xl leading-relaxed">
              Discover 100+ Central and State government welfare schemes. 
              Check eligibility, get documents, and apply — all in one place.
            </p>
            
            <div className="relative max-w-xl mb-12 flex items-center bg-slate-50 border border-slate-100 rounded-3xl p-1 shadow-sm">
              <div className="absolute inset-y-0 left-6 flex items-center text-slate-300">
                <Search size={22} />
              </div>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/search?q=${search}`)}
                placeholder="Search schemes, benefits, or keywords..."
                className="flex-grow bg-transparent py-5 pl-16 pr-6 rounded-3xl text-[16px] font-medium placeholder:text-slate-300 outline-none"
              />
              <button 
                onClick={() => window.location.href = `/search?q=${search}`}
                className="bg-[#002f6c] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-colors"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-8 mb-12">
              <Link href="/dashboard" className="bg-[#001b3d] text-white py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-[#001b3d]/10 flex items-center gap-3">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/schemes" className="text-[14px] font-black text-slate-400 hover:text-slate-900 flex items-center gap-2 uppercase tracking-widest transition-colors">
                Browse All Schemes <ChevronRight size={18} />
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                <Avatar initial="R" color="bg-blue-600" />
                <Avatar initial="P" color="bg-[#002f6c]" />
                <Avatar initial="M" color="bg-orange-500" />
                <Avatar initial="S" color="bg-indigo-600" />
              </div>
              <div>
                <div className="flex gap-0.5 text-orange-500 mb-0.5">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Trusted by 10,000+ citizens</p>
              </div>
            </div>
          </div>

          {/* HERO IMAGE & OVERLAYS */}
          <div className="relative">
            <div className="bg-slate-200 aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative">
              <img 
                src="/gov-building.jpg" 
                alt="Government Building"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent"></div>
            </div>

            {/* FLOATING OVERLAYS */}
            <div className="absolute -top-6 -right-6 bg-white rounded-3xl p-5 shadow-2xl animate-bounce duration-[3000ms] border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <Home size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">You qualify for</p>
                <p className="text-lg font-black text-slate-900">12 schemes</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-3xl p-5 shadow-2xl animate-pulse duration-[4000ms] border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                <Check size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">New scheme found!</p>
                <p className="text-lg font-black text-slate-900">PM Awas Yojana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#002f6c] py-16 px-6 sm:px-12 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatItem value="100+" label="Government Schemes" />
          <StatItem value="28+" label="States Covered" />
          <StatItem value="50Cr+" label="Beneficiaries" />
          <StatItem value="15+" label="Ministries" />
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Browse by Category</h2>
          <p className="text-slate-400 font-medium text-lg">Find schemes tailored to your needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <CategoryCard label="Agriculture" icon={<TrendingUp />} color="bg-emerald-50 text-emerald-600" />
          <CategoryCard label="Education" icon={<GraduationCap />} color="bg-blue-50 text-blue-600" />
          <CategoryCard label="Healthcare" icon={<Heart />} color="bg-red-50 text-red-600" />
          <CategoryCard label="Housing" icon={<Home />} color="bg-orange-50 text-orange-600" />
          <CategoryCard label="Employment" icon={<Briefcase />} color="bg-indigo-50 text-indigo-600" />
          <CategoryCard label="Women" icon={<Star />} color="bg-pink-50 text-pink-600" />
        </div>
      </section>

      {/* FEATURED SCHEMES */}
      <section className="bg-white py-24 px-6 sm:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black mb-3">Featured Schemes</h2>
              <p className="text-slate-400 font-medium text-lg">High-impact programs from the Central Government</p>
            </div>
            <Link href="/schemes" className="bg-slate-50 text-[#002f6c] py-3 px-8 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center gap-2">
              View All Schemes <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedCard 
              title="PM Kisan Samman Nidhi" 
              desc="Direct income support of ₹6,000 per year to small and marginal farmers in three equal installments."
              benefit="₹6,000/year direct transfer"
              category="Agriculture"
            />
            <FeaturedCard 
              title="Ayushman Bharat PM-JAY" 
              desc="Health cover of ₹5 lakh per family per year for secondary and tertiary hospitalization."
              benefit="₹5 lakh health insurance/year"
              category="Healthcare"
              color="text-red-500"
            />
            <FeaturedCard 
              title="PM Awas Yojana (Gramin)" 
              desc="Financial assistance to rural BPL households for construction of pucca houses."
              benefit="₹1.2–1.3 lakh housing grant"
              category="Housing"
              color="text-orange-500"
            />
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4">Success Stories</h2>
          <p className="text-slate-400 font-medium text-lg">Real citizens, real impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <TestimonialCard 
            text="I had no idea about PM Kisan scheme until I found GovBridge. Got ₹6,000 directly in my account!"
            author="Ramesh Kumar"
            role="Farmer, Uttar Pradesh"
            initial="R"
          />
          <TestimonialCard 
            text="Found 4 scholarships I was eligible for. The eligibility explanation made it so easy to understand."
            author="Priya Sharma"
            role="Student, Maharashtra"
            initial="P"
          />
          <TestimonialCard 
            text="The Mudra loan scheme changed my business. GovBridge helped me find and apply with ease."
            author="Mohammed Aslam"
            role="Small Business Owner, Karnataka"
            initial="M"
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-[#002f6c] rounded-[48px] p-16 sm:p-24 text-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          <h2 className="text-5xl sm:text-6xl font-black mb-8 relative z-10">Start discovering your <br />benefits today</h2>
          <p className="text-slate-400 text-xl mb-16 relative z-10 max-w-3xl mx-auto leading-relaxed">
            Create your free profile and get personalized scheme recommendations in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 relative z-10">
            <Link 
              href="/dashboard" 
              className="bg-orange-500 text-white py-6 px-12 rounded-2xl font-black text-[15px] uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3"
            >
              Open Dashboard <ArrowRight size={20} />
            </Link>
            <Link 
              href="/schemes" 
              className="bg-white/10 text-white border border-white/20 py-6 px-12 rounded-2xl font-black text-[15px] uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center justify-center gap-3"
            >
              Browse Schemes <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Avatar({ initial, color }: any) {
  return (
    <div className={`w-10 h-10 ${color} rounded-full border-2 border-white flex items-center justify-center text-white font-black text-xs`}>
      {initial}
    </div>
  );
}

function StatItem({ value, label }: any) {
  return (
    <div className="space-y-2">
      <p className="text-4xl font-black text-orange-500">{value}</p>
      <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function CategoryCard({ label, icon, color }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center gap-6 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[14px] font-black text-slate-900">{label}</p>
    </div>
  );
}

function FeaturedCard({ title, desc, benefit, category, color = "text-emerald-500" }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-10 hover:shadow-2xl transition-all group relative overflow-hidden h-full">
      <div className="absolute top-10 right-10 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
        Central
      </div>
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002f6c] mb-10 group-hover:scale-110 transition-transform">
        <Home size={24} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-[#002f6c] transition-colors">{title}</h3>
      <p className="text-slate-400 text-[15px] leading-relaxed font-medium mb-10 line-clamp-3">
        {desc}
      </p>
      <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
        <p className={`text-[14px] font-black ${color}`}>{benefit}</p>
        <ChevronRight size={22} className="text-slate-200 group-hover:text-[#002f6c] transition-colors" />
      </div>
    </div>
  );
}

function TestimonialCard({ text, author, role, initial }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm hover:shadow-xl transition-all">
      <div className="flex gap-0.5 text-orange-500 mb-8">
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
        <Star size={16} fill="currentColor" />
      </div>
      <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#001b3d] rounded-2xl flex items-center justify-center text-white font-black text-lg">
          {initial}
        </div>
        <div>
          <p className="text-[15px] font-black text-slate-900">{author}</p>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  );
}
