'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Map, Briefcase, ChevronRight, Save, Loader2, ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    state: 'Karnataka',
    district: '',
    occupation: 'Farmer',
    income: '',
    category: 'General',
    education: 'Secondary (10th)',
    disability: 'No',
    marital_status: 'Single',
    rural_urban: 'Rural'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchProfile(firebaseUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProfile = async (firebaseUser: any) => {
    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || firebaseUser.displayName || '',
          age: data.age || '',
          gender: data.gender || 'Male',
          state: data.state || 'Karnataka',
          district: data.district || '',
          occupation: data.occupation || 'Farmer',
          income: data.income || '',
          category: data.category || 'General',
          education: data.education || 'Secondary (10th)',
          disability: data.disability || 'No',
          marital_status: data.marital_status || 'Single',
          rural_urban: data.rural_urban || 'Rural'
        });
      } else {
        setFormData(prev => ({ ...prev, name: firebaseUser.displayName || '' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const token = await user.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setMessage('Profile updated successfully! Generating new recommendations...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#002f6c]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-6 sm:px-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-slate-900 mb-8 uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-premium">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#002f6c] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#002f6c]/20">
              <UserIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Complete Your Profile</h1>
              <p className="text-sm font-medium text-slate-400 mt-1">We use this to find schemes you're eligible for.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Age</label>
                <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Caste Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
                <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Occupation</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="Farmer">Farmer</option>
                  <option value="Student">Student</option>
                  <option value="Business">Business</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Salaried">Salaried</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Annual Income (₹)</label>
                <input required type="number" name="income" value={formData.income} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all" />
              </div>

              {/* Additional Details */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Education</label>
                <select name="education" value={formData.education} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="Below 10th">Below 10th</option>
                  <option value="Secondary (10th)">Secondary (10th)</option>
                  <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Disability Status</label>
                <select name="disability" value={formData.disability} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Marital Status</label>
                <select name="marital_status" value={formData.marital_status} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Area Type</label>
                <select name="rural_urban" value={formData.rural_urban} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#002f6c] focus:ring-1 focus:ring-[#002f6c] transition-all">
                  <option value="Rural">Rural</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
            </div>

            {message && (
              <div className="p-4 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold">
                {message}
              </div>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving Profile...' : 'Save Profile & Get Schemes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
