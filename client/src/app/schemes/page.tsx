'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, Heart, Home, GraduationCap, Briefcase, TrendingUp, Star, AlertCircle, Shield, Activity, Map, User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      <section className="bg-[#002f6c] pt-16 pb-20 px-6 sm:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black mb-4 tracking-tight">All Government Schemes</h1>
          <p className="text-slate-300 text-lg mb-10 font-medium">Browse 34+ Central and State government schemes</p>
          
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes, benefits, ministries..."
              className="w-full bg-white text-slate-900 py-5 pl-14 pr-6 rounded-2xl text-[16px] font-medium placeholder:text-slate-400 outline-none shadow-xl border-none"
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-10">
        <aside className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold mb-6 text-[15px]">
              <Filter size={18} className="text-slate-400" />
              <span>Filters</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Category</p>
              <FilterItem label="All Categories" active={selectedCategory === 'All Categories'} onClick={() => setSelectedCategory('All Categories')} icon={<Activity size={16} />} />
              <FilterItem label="Agriculture" active={selectedCategory === 'Agriculture'} onClick={() => setSelectedCategory('Agriculture')} icon={<TrendingUp size={16} />} />
              <FilterItem label="Education" active={selectedCategory === 'Education'} onClick={() => setSelectedCategory('Education')} icon={<GraduationCap size={16} />} />
              <FilterItem label="Healthcare" active={selectedCategory === 'Healthcare'} onClick={() => setSelectedCategory('Healthcare')} icon={<Heart size={16} />} />
              <FilterItem label="Housing" active={selectedCategory === 'Housing'} onClick={() => setSelectedCategory('Housing')} icon={<Home size={16} />} />
              <FilterItem label="Employment" active={selectedCategory === 'Employment'} onClick={() => setSelectedCategory('Employment')} icon={<Briefcase size={16} />} />
              <FilterItem label="Women" active={selectedCategory === 'Women'} onClick={() => setSelectedCategory('Women')} icon={<User size={16} />} />
              <FilterItem label="Insurance" active={selectedCategory === 'Insurance'} onClick={() => setSelectedCategory('Insurance')} icon={<Shield size={16} />} />
              <FilterItem label="Business" active={selectedCategory === 'Business'} onClick={() => setSelectedCategory('Business')} icon={<Home size={16} />} />
              <FilterItem label="Pension" active={selectedCategory === 'Pension'} onClick={() => setSelectedCategory('Pension')} icon={<Briefcase size={16} />} />
              <FilterItem label="Infrastructure" active={selectedCategory === 'Infrastructure'} onClick={() => setSelectedCategory('Infrastructure')} icon={<Home size={16} />} />
              <FilterItem label="Digital" active={selectedCategory === 'Digital'} onClick={() => setSelectedCategory('Digital')} icon={<Settings size={16} />} />
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-8">
            <p className="text-[14px] font-bold text-slate-500">
              <span className="text-slate-900">{filteredSchemes.length}</span> schemes found
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSchemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterItem({ label, active, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${
        active ? 'bg-[#002f6c] text-white font-bold shadow-lg shadow-[#002f6c]/10' : 'text-slate-600 hover:bg-slate-100 font-medium'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}>{icon}</span>}
        <span className="text-[14px]">{label}</span>
      </div>
      {active && <ChevronRight size={14} className="text-white/50" />}
    </button>
  );
}

function SchemeCard({ scheme }: any) {
  const isNew = Math.random() > 0.8;
  const isState = scheme.state_applicable !== 'ALL';
  
  const getIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return <TrendingUp className="text-emerald-500" />;
      case 'healthcare': return <Heart className="text-red-500" />;
      case 'housing': return <Home className="text-orange-500" />;
      case 'education': return <GraduationCap className="text-blue-500" />;
      case 'women': return <User className="text-pink-500" />;
      case 'insurance': return <Shield className="text-indigo-500" />;
      case 'business': return <Home className="text-emerald-500" />;
      default: return <Briefcase className="text-amber-600" />;
    }
  };

  const getBg = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return 'bg-emerald-50';
      case 'healthcare': return 'bg-red-50';
      case 'housing': return 'bg-orange-50';
      case 'education': return 'bg-blue-50';
      case 'women': return 'bg-pink-50';
      case 'insurance': return 'bg-indigo-50';
      case 'business': return 'bg-emerald-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <Link href={`/schemes/${scheme.id}`} className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden h-full min-h-[340px]">
      <div className="flex justify-end gap-2 absolute top-6 right-6 z-10">
        {isNew && (
          <div className="px-2 py-0.5 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">
            New
          </div>
        )}
        <div className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
          isState ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
        }`}>
          {isState ? 'State' : 'Central'}
        </div>
      </div>
      
      <div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${getBg(scheme.category)} shadow-sm transition-transform group-hover:scale-110`}>
          {getIcon(scheme.category)}
        </div>
        <h3 className="text-[17px] font-black text-slate-900 mb-2 leading-tight group-hover:text-[#002f6c] transition-colors line-clamp-2">{scheme.name}</h3>
        <p className="text-[12px] text-slate-400 font-medium mb-6 line-clamp-2 leading-relaxed">
          {scheme.description}
        </p>

        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <Home size={12} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
              {scheme.state_applicable === 'ALL' ? 'Central Government' : `${scheme.state_applicable} Government`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Map size={12} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scheme.state_applicable}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[13px] font-black text-orange-500">
          {scheme.benefits?.split('.')[0].substring(0, 40)}
        </span>
        <ChevronRight size={18} className="text-slate-200 group-hover:text-[#002f6c] transition-colors" />
      </div>
    </Link>
  );
}
