'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <>
      <nav className="bg-white border-b border-slate-100 px-4 sm:px-12 py-3 sticky top-0 z-[100] flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#001b3d] rounded flex items-center justify-center text-white font-black text-lg">G</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">GovBridge <span className="text-orange-500">India</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink href="/schemes" active={pathname.startsWith('/schemes')}>Schemes</NavLink>
          <NavLink href="/search" active={pathname === '/search'}>Search</NavLink>
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
          <NavLink href="/govbot" active={pathname === '/govbot'}>GovBot</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[13px] font-bold text-slate-500 cursor-pointer hover:text-slate-900">
            <Globe size={16} />
            <span>English</span>
          </div>
          <div className="w-8 h-8 bg-[#002f6c] rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer">
            M
          </div>
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
              <MobileNavLink href="/search" active={pathname === '/search'} onClick={() => setIsMobileMenuOpen(false)}>Search</MobileNavLink>
              <MobileNavLink href="/dashboard" active={pathname === '/dashboard'} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
              <MobileNavLink href="/govbot" active={pathname === '/govbot'} onClick={() => setIsMobileMenuOpen(false)}>GovBot</MobileNavLink>
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
