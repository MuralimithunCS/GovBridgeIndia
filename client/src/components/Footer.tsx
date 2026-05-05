'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#001b3d] text-white pt-24 pb-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#002f6c] rounded-xl flex items-center justify-center text-white font-black text-xl">G</div>
              <span className="text-2xl font-bold text-white tracking-tight">GovBridge <span className="text-orange-500">India</span></span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
              Bridging citizens with government schemes, welfare benefits, and infrastructure services across India.
            </p>
            <p className="text-[12px] text-slate-500 uppercase tracking-[0.2em] font-black max-w-sm">
              This is an independent information platform. Not affiliated with any government body.
            </p>
          </div>

          <div>
            <h4 className="font-black text-[13px] uppercase tracking-[0.2em] mb-8 text-slate-500">Quick Links</h4>
            <div className="flex flex-col gap-5 text-slate-400 text-[15px] font-bold">
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">All Schemes</Link>
              <Link href="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
              <Link href="/admin" className="hover:text-orange-500 transition-colors">Admin Panel</Link>
              <Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link>
            </div>
          </div>

          <div>
            <h4 className="font-black text-[13px] uppercase tracking-[0.2em] mb-8 text-slate-500">Categories</h4>
            <div className="flex flex-col gap-5 text-slate-400 text-[15px] font-bold">
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Agriculture</Link>
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Education</Link>
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Healthcare</Link>
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Women</Link>
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Employment</Link>
              <Link href="/schemes" className="hover:text-orange-500 transition-colors">Housing</Link>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            © 2025 GovBridge India. Built for the citizens.
          </p>
          <div className="flex gap-10 text-[13px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
