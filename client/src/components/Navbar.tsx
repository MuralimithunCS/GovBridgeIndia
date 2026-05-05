'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
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
        <button className="lg:hidden text-slate-400">
          <Menu size={24} />
        </button>
      </div>
    </nav>
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
