'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in
        router.replace('/login');
      } else if (!user.emailVerified) {
        // Logged in but not verified
        await signOut(auth);
        router.replace('/login?error=unverified');
      } else {
        // Authorized
        setAuthorized(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#002f6c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Authenticating...</p>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
