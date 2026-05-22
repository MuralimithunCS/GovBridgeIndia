'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import GoogleTranslate from './GoogleTranslate';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (pathname === '/login' || pathname === '/signup') return null;

  const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <>
      <nav className="bg-white border-b border-slate-100 px-4 sm:px-12 py-3 sticky top-0 z-[100] flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#001b3d] rounded flex items-center justify-center text-white font-black text-lg">G</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">GovBridge <span className="text-orange-500">India</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink href="/schemes" active={pathname.startsWith('/schemes')}>Schemes</NavLink>
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
          <NavLink href="/govbot" active={pathname === '/govbot'}>GovBot</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block flex-shrink-0 min-w-[140px]">
            <GoogleTranslate />
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" title="Edit Profile" className="w-8 h-8 bg-[#002f6c] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-[#002f6c]/10 hover:bg-[#001b3d] transition-colors ring-2 ring-transparent hover:ring-orange-400 ring-offset-1">
                {initial.toUpperCase()}
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-[13px] font-black text-[#002f6c] uppercase tracking-widest px-4 py-2 border border-[#002f6c]/10 rounded-xl hover:bg-[#002f6c]/5 transition-all">
              Login
            </Link>
          )}

          <button 
            className="lg:hidden text-slate-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-[90] bg-white lg:hidden border-b border-slate-100 shadow-xl"
          >
            <div className="flex flex-col p-6 space-y-2">
              <MobileNavLink href="/schemes" active={pathname.startsWith('/schemes')} onClick={() => setIsMobileMenuOpen(false)}>Schemes</MobileNavLink>
              <MobileNavLink href="/dashboard" active={pathname === '/dashboard'} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink href="/govbot" active={pathname === '/govbot'} onClick={() => setIsMobileMenuOpen(false)}>GovBot</MobileNavLink>
              
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-4 text-red-500 font-bold border-t border-slate-50 flex items-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`text-[14px] font-medium transition-colors ${active ? 'text-slate-900 bg-slate-100 px-4 py-2 rounded-lg' : 'text-slate-500 hover:text-slate-900'}`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, active, onClick }: { href: string; children: React.ReactNode; active: boolean, onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block text-[16px] font-bold py-4 border-b border-slate-50 transition-colors ${active ? 'text-[#002f6c]' : 'text-slate-600 hover:text-slate-900'}`}
    >
      {children}
    </Link>
  );
}
