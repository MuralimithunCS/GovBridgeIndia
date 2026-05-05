'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink, Share2, CheckCircle2, AlertCircle, FileText, Info, ArrowRight, TrendingUp, Heart, Home, GraduationCap, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedSchemes, setRelatedSchemes] = useState<any[]>([]);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/schemes/${params.id}`);
        const data = await res.json();
        setScheme(data);

        // Fetch related schemes
        const relRes = await fetch('http://localhost:5000/api/schemes');
        const relData = await relRes.json();
        setRelatedSchemes(relData.filter((s: any) => s._id !== params.id && s.category === data.category).slice(0, 3));
      } catch (err) {
        console.error("Error fetching scheme:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading Scheme Details...</div>;
  if (!scheme) return <div className="p-20 text-center font-bold text-red-500">Scheme not found.</div>;

  const getIcon = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return <TrendingUp className="text-orange-500" />;
      case 'healthcare': return <Heart className="text-red-500" />;
      case 'housing': return <Home className="text-orange-500" />;
      case 'education': return <GraduationCap className="text-blue-500" />;
      default: return <Briefcase className="text-amber-600" />;
    }
  };

  const getBg = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'agriculture': return 'bg-orange-50';
      case 'healthcare': return 'bg-red-50';
      case 'housing': return 'bg-orange-50';
      case 'education': return 'bg-blue-50';
      default: return 'bg-amber-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-slate-900 mb-8 uppercase tracking-widest transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Schemes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="space-y-8">
            {/* HEADER CARD */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-premium">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getBg(scheme.category)} shadow-sm`}>
                    {getIcon(scheme.category)}
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                      {scheme.state_applicable?.toLowerCase() === 'all' ? 'Central Government' : 'State Government'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{scheme.name}</h1>
                    <p className="text-[13px] font-bold text-slate-400 flex items-center gap-2 mt-1">
                      <Briefcase size={14} /> Ministry of {scheme.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-all border border-slate-100">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
                <p className="text-[12px] font-black text-orange-400 uppercase tracking-widest mb-2">Key Benefit</p>
                <h3 className="text-xl font-black text-orange-600">{scheme.benefits?.split('.')[0]}</h3>
              </div>

              <div className="space-y-6">
                <p className="text-slate-500 text-[16px] leading-relaxed font-medium">
                  {scheme.description}
                </p>
                <a 
                  href={scheme.apply_link} 
                  target="_blank" 
                  className="inline-flex items-center justify-center gap-3 bg-[#002f6c] text-white py-5 px-10 rounded-2xl font-black text-[15px] hover:bg-slate-900 transition-all shadow-lg shadow-[#002f6c]/20 w-full sm:w-auto"
                >
                  Apply Online <ExternalLink size={18} />
                </a>
              </div>
            </div>

            {/* ELIGIBILITY SECTION */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-premium">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-xl font-black">Eligibility Criteria</h2>
              </div>
              
              <div className="space-y-4">
                <EligibilityItem text="Annual Family Income Below ₹2.0 Lakh" checked={true} />
                <EligibilityItem text={`Occupation: ${scheme.category}`} checked={true} />
                <EligibilityItem text={`State Residency: ${scheme.state_applicable}`} checked={scheme.state_applicable === 'ALL'} />
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                <AlertCircle size={24} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-[14px] font-bold text-slate-900 mb-1">Check your profile match</p>
                  <p className="text-[13px] font-medium text-slate-400 leading-relaxed">
                    Make sure your profile is updated to see if you meet all requirements for this specific scheme.
                  </p>
                </div>
              </div>
            </div>

            {/* DOCUMENTS SECTION */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-premium">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-black">Required Documents</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocumentCard text="Aadhar Card" />
                <DocumentCard text="Land Records / Proof of Work" />
                <DocumentCard text="Bank Passbook / Cancelled Cheque" />
                <DocumentCard text="Income Certificate" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
              <h3 className="text-[16px] font-black mb-6">Quick Info</h3>
              <div className="space-y-6">
                <InfoRow label="Type" value={scheme.state_applicable?.toLowerCase() === 'all' ? 'Central Government' : 'State Government'} />
                <InfoRow label="Category" value={scheme.category} />
                <InfoRow label="Ministry" value={`Ministry of ${scheme.category}`} />
              </div>
            </div>

            <div className="bg-[#002f6c] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-black mb-4 relative z-10">Ready to Apply?</h3>
              <p className="text-slate-400 text-[14px] mb-8 relative z-10 leading-relaxed">
                Click below to go to the official government portal and submit your application.
              </p>
              <a 
                href={scheme.apply_link} 
                target="_blank" 
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                Official Portal <ExternalLink size={16} />
              </a>
            </div>

            <div className="space-y-6">
              <h3 className="text-[16px] font-black ml-1">Related Schemes</h3>
              <div className="space-y-4">
                {relatedSchemes.map((s: any) => (
                  <Link key={s._id} href={`/schemes/${s._id}`} className="block bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${getBg(s.category)}`}>
                        {getIcon(s.category)}
                      </div>
                      <h4 className="text-[14px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#002f6c]">{s.name}</h4>
                    </div>
                    <p className="text-[11px] text-orange-500 font-black uppercase tracking-widest">{s.benefits?.split('.')[0].substring(0, 30)}...</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function EligibilityItem({ text, checked }: { text: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-none">
      {checked ? <CheckCircle2 size={20} className="text-success shrink-0" /> : <AlertCircle size={20} className="text-slate-300 shrink-0" />}
      <span className={`text-[15px] font-bold ${checked ? 'text-slate-700' : 'text-slate-400'}`}>{text}</span>
    </div>
  );
}

function DocumentCard({ text }: { text: string }) {
  return (
    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <span className="text-[14px] font-bold text-slate-700">{text}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-[14px] font-bold text-slate-800">{value}</p>
    </div>
  );
}
