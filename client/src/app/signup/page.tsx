'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/network-request-failed': return 'Network error. Please check your internet connection and try again.';
    case 'auth/email-already-in-use': return 'This email is already registered. Try logging in instead.';
    case 'auth/weak-password': return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    default: return 'Something went wrong. Please try again.';
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      router.push('/login?verify=true');
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6 text-left mb-10">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#002f6c] transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl text-[15px] font-medium placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-[#002f6c]/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#001b3d] text-white py-5 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-[#001b3d]/10 mb-8"
            >
              {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18} />
            </button>
          </form>

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
