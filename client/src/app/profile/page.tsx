'use client';

import { User, Map, Check, Shield, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-12">
        <h1 className="text-4xl font-black mb-2 tracking-tight">My Profile</h1>
        <p className="text-slate-400 font-medium mb-10">Manage your personal details and preferences</p>

        {/* PROFILE HEADER CARD */}
        <div className="bg-[#001b3d] rounded-[32px] p-8 sm:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-8 mb-10 shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-orange-500/20">
              M
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1">Muralimithun CS</h2>
              <p className="text-slate-400 font-medium text-[15px] mb-3">muraliyadhav34@gmail.com</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-success text-[13px] font-bold">
                <Check size={16} />
                <span>Profile Complete</span>
              </div>
            </div>
          </div>

          <button className="bg-white/10 text-white border border-white/20 py-3 px-8 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 relative z-10">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PERSONAL INFO CARD */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <h3 className="text-lg font-black">Personal Info</h3>
            </div>

            <div className="space-y-6">
              <InfoField label="Full Name" value="Muralimithun CS" />
              <InfoField label="Age" value="20 years" />
              <InfoField label="Gender" value="Male" />
            </div>
          </div>

          {/* LOCATION CARD */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Map size={20} />
              </div>
              <h3 className="text-lg font-black">Location</h3>
            </div>

            <div className="space-y-6">
              <InfoField label="State" value="Karnataka" />
              <InfoField label="District" value="Banglore" />
              <InfoField label="Area" value="Urban" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[15px] font-bold text-slate-700">{value}</p>
    </div>
  );
}
