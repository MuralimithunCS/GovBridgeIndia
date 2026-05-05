'use client';

import { CheckCircle2, ChevronRight, Heart, Home, GraduationCap, Shield, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface SchemeCardProps {
  rec: any;
  isPrimary?: boolean;
}

export default function SchemeCard({ rec }: SchemeCardProps) {
  const scheme = rec.scheme;
  
  // Get icon based on category
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'healthcare': return <Heart className="text-red-500" size={24} />;
      case 'housing': return <Home className="text-orange-500" size={24} />;
      case 'student': return <GraduationCap className="text-blue-500" size={24} />;
      case 'insurance': return <Shield className="text-green-500" size={24} />;
      case 'farmer': return <Briefcase className="text-amber-600" size={24} />;
      default: return <User className="text-slate-500" size={24} />;
    }
  };

  const getIconBg = (category: string) => {
    switch (category.toLowerCase()) {
      case 'healthcare': return 'bg-red-50';
      case 'housing': return 'bg-orange-50';
      case 'student': return 'bg-blue-50';
      case 'insurance': return 'bg-green-50';
      case 'farmer': return 'bg-amber-50';
      default: return 'bg-slate-50';
    }
  };

  const benefitAmount = scheme.benefit_amount_text || scheme.benefit_amount || "₹12,000/yr";
  const eligibilityReason = rec.reasons?.[0] || "You meet the requirements";

  return (
    <Link href={`/schemes/${scheme._id}`}>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 hover:shadow-md transition-shadow flex items-center gap-5 cursor-pointer group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getIconBg(scheme.category)}`}>
          {getIcon(scheme.category)}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-[17px] font-bold text-slate-900 mb-0.5">{scheme.name}</h3>
          <p className="text-[15px] font-medium text-orange-600 mb-1">{benefitAmount}</p>
          <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-medium">
            <CheckCircle2 size={14} className="text-success" />
            {eligibilityReason}
          </div>
        </div>

        <div className="text-slate-300 group-hover:text-slate-900 transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
    </Link>
  );
}
