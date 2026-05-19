'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, ChevronLeft, Filter, Briefcase, Map, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/schemes`);
        const allSchemes = await res.json();
        
        // Simple client-side search for now
        const filtered = allSchemes.filter((s: any) => 
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Search Results</h1>
          <p className="text-slate-400 font-medium">
            Found {results.length} schemes for "{query}"
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
              <SearchIcon size={18} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/search?q=${searchTerm}`)}
              placeholder="Search again..."
              className="bg-white border border-slate-200 py-3 pl-12 pr-6 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#002f6c]/10 transition-all"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center font-bold text-slate-300 animate-pulse">Searching through schemes...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((scheme) => (
            <Link key={scheme.id} href={`/schemes/${scheme.id}`} className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002f6c] group-hover:scale-110 transition-transform">
                  <Briefcase size={20} />
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {scheme.type}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-[#002f6c] transition-colors">{scheme.name}</h3>
              <p className="text-slate-400 text-[14px] leading-relaxed font-medium mb-8 line-clamp-3 flex-grow">
                {scheme.description}
              </p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                  <Map size={14} />
                  <span>{scheme.state_applicable}</span>
                </div>
                <ArrowRight size={18} className="text-slate-200 group-hover:text-[#002f6c] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon size={32} className="text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No schemes found</h2>
          <p className="text-slate-400 font-medium mb-10">Try using broader keywords or browsing by category.</p>
          <Link href="/schemes" className="bg-[#002f6c] text-white py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all">
            Browse All Schemes
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#002f6c] py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[13px] font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<div className="p-20 text-center text-slate-300">Loading search...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
