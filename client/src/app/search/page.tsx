'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, ChevronRight, Heart, Home, GraduationCap, Briefcase, TrendingUp, Star, Shield, Activity, Map, User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/schemes');
        const data = await res.json();
        setSchemes(data);
      } catch (err) {
        console.error("Error fetching schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-[#002f6c] pt-16 pb-24 px-6 sm:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Advanced Search</h1>
          <p className="text-slate-300 text-lg mb-12 font-medium">Find the right government scheme using smart filters</p>
          
          <div className="space-y-8">
            <div className="relative max-w-4xl">
              <div className="absolute inset-y-0 left-6 flex items-center text-slate-400">
                <SearchIcon size={24} />
              </div>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search schemes, benefits, ministries, documents..."
                className="w-full bg-white text-slate-900 py-6 pl-16 pr-8 rounded-3xl text-[18px] font-medium placeholder:text-slate-400 outline-none shadow-2xl border-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Pill label="Agriculture" icon={<TrendingUp size={14} />} active={selectedCategory === 'Agriculture'} onClick={() => setSelectedCategory('Agriculture')} />
              <Pill label="Education" icon={<GraduationCap size={14} />} active={selectedCategory === 'Education'} onClick={() => setSelectedCategory('Education')} />
              <Pill label="Healthcare" icon={<Heart size={14} />} active={selectedCategory === 'Healthcare'} onClick={() => setSelectedCategory('Healthcare')} />
              <Pill label="Housing" icon={<Home size={14} />} active={selectedCategory === 'Housing'} onClick={() => setSelectedCategory('Housing')} />
              <Pill label="Employment" icon={<Briefcase size={14} />} active={selectedCategory === 'Employment'} onClick={() => setSelectedCategory('Employment')} />
              <Pill label="Women" icon={<Star size={14} />} active={selectedCategory === 'Women'} onClick={() => setSelectedCategory('Women')} />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-12">
        <aside className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-8 text-[15px]">
              <Filter size={18} className="text-slate-400" />
              <span>Filters</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Category</p>
              <SidebarItem label="All Categories" active={selectedCategory === 'All Categories'} onClick={() => setSelectedCategory('All Categories')} />
              <SidebarItem label="Agriculture" active={selectedCategory === 'Agriculture'} onClick={() => setSelectedCategory('Agriculture')} />
              <SidebarItem label="Education" active={selectedCategory === 'Education'} onClick={() => setSelectedCategory('Education')} />
              <SidebarItem label="Healthcare" active={selectedCategory === 'Healthcare'} onClick={() => setSelectedCategory('Healthcare')} />
              <SidebarItem label="Housing" active={selectedCategory === 'Housing'} onClick={() => setSelectedCategory('Housing')} />
              <SidebarItem label="Employment" active={selectedCategory === 'Employment'} onClick={() => setSelectedCategory('Employment')} />
              <SidebarItem label="Women" active={selectedCategory === 'Women'} onClick={() => setSelectedCategory('Women')} />
              <SidebarItem label="Insurance" active={selectedCategory === 'Insurance'} onClick={() => setSelectedCategory('Insurance')} />
              <SidebarItem label="Business" active={selectedCategory === 'Business'} onClick={() => setSelectedCategory('Business')} />
              <SidebarItem label="Pension" active={selectedCategory === 'Pension'} onClick={() => setSelectedCategory('Pension')} />
              <SidebarItem label="Infrastructure" active={selectedCategory === 'Infrastructure'} onClick={() => setSelectedCategory('Infrastructure')} />
              <SidebarItem label="Digital" active={selectedCategory === 'Digital'} onClick={() => setSelectedCategory('Digital')} />
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <p className="text-[14px] font-bold text-slate-500">
              <span className="text-slate-900">{filteredSchemes.length}</span> schemes found
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-slate-400">Sort by:</span>
              <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[13px] font-bold text-slate-700 outline-none">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Benefit Value</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"></div>)
            ) : (
              filteredSchemes.map((scheme) => (
                <HorizontalSchemeCard key={scheme.id} scheme={scheme} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Pill({ label, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
        active ? 'bg-white text-[#002f6c] border-white' : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SidebarItem({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${
        active ? 'bg-[#002f6c] text-white font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'
      }`}
    >
      <span className="text-[14px]">{label}</span>
      {active && <ChevronRight size={14} className="text-white/50" />}
    </button>
  );
}

function HorizontalSchemeCard({ scheme }: any) {
  const isNew = Math.random() > 0.8;
  const isState = scheme.state_applicable !== 'ALL';

  const getIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return <TrendingUp size={20} className="text-emerald-500" />;
      case 'healthcare': return <Heart size={20} className="text-red-500" />;
      case 'housing': return <Home size={20} className="text-orange-500" />;
      case 'education': return <GraduationCap size={20} className="text-blue-500" />;
      case 'women': return <User size={20} className="text-pink-500" />;
      case 'insurance': return <Shield size={20} className="text-indigo-500" />;
      default: return <Briefcase size={20} className="text-amber-600" />;
    }
  };

  const getBg = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return 'bg-emerald-50';
      case 'healthcare': return 'bg-red-50';
      case 'housing': return 'bg-orange-50';
      case 'education': return 'bg-blue-50';
      case 'women': return 'bg-pink-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <Link href={`/schemes/${scheme.id}`} className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-6 hover:shadow-xl hover:-translate-x-1 transition-all group border-l-4 border-l-transparent hover:border-l-[#002f6c]">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getBg(scheme.category)} shadow-sm transition-transform group-hover:scale-110`}>
        {getIcon(scheme.category)}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-[18px] font-black text-slate-900 group-hover:text-[#002f6c] transition-colors truncate">{scheme.name}</h3>
          {isNew && (
            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">
              New
            </span>
          )}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 border ${
            isState ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}>
            {isState ? 'State' : 'Central'}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Home size={12} />
            <span className="text-[11px] font-bold uppercase tracking-widest">{isState ? `${scheme.state_applicable} Government` : 'Central Government'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Map size={12} />
            <span className="text-[11px] font-bold uppercase tracking-widest">{scheme.state_applicable}</span>
          </div>
        </div>
        <p className="text-[13px] text-slate-400 font-medium line-clamp-1">
          {scheme.description}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-[13px] font-black text-orange-500 mb-1">{scheme.benefits?.split('.')[0].substring(0, 30)}</p>
        <div className="flex justify-end text-slate-200 group-hover:text-[#002f6c] transition-colors">
          <ChevronRight size={24} />
        </div>
      </div>
    </Link>
  );
}
