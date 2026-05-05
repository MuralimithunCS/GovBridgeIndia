'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        {/* LOGO */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#001b3d] rounded-xl flex items-center justify-center text-white font-black text-xl">G</div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">GovBridge <span className="text-orange-500">India</span></span>
          </Link>
        </div>

        {/* AUTH CARD */}
        <div className="bg-white rounded-[40px] p-10 sm:p-14 shadow-premium border border-slate-100 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-400 text-[15px] font-medium mb-12">Start your personalized benefits journey</p>

          <div className="space-y-6 text-left mb-10">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#002f6c] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Muralimithun CS"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl text-[15px] font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#002f6c]/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#002f6c] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl text-[15px] font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#002f6c]/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#002f6c] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl text-[15px] font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#002f6c]/5 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#001b3d] text-white py-5 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-[#001b3d]/10 mb-8"
          >
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18} />
          </button>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-grow h-[1px] bg-slate-100"></div>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Or sign up with</span>
            <div className="flex-grow h-[1px] bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <SocialButton icon={<Globe size={20} />} label="Google" />
            <SocialButton icon={<Globe size={20} />} label="Github" />
          </div>

          <p className="text-[14px] font-medium text-slate-400">
            Already have an account? <Link href="/login" className="text-[#002f6c] font-black hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-center gap-3 border border-slate-100 py-4 rounded-2xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
      {icon}
      {label}
    </button>
  );
}
