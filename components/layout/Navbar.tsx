'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSession, clearSession, getInitials } from '@/lib/auth';
import type { AppSession } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/subjects', label: 'Subjects' },
  { href: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession]       = useState<AppSession | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Read session on mount + sync across tabs
  useEffect(() => {
    const load = () => setSession(getSession());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const logout = () => {
    clearSession();
    setSession(null);
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0F1C30]/80 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.40)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center shadow-[0_4px_14px_rgba(242,116,5,0.45)] group-hover:shadow-[0_4px_20px_rgba(242,116,5,0.65)] transition-shadow duration-300">
            <span className="text-white font-black text-sm">E</span>
          </div>
          <span className="font-bold text-lg">
            <span className="text-white">El7a2ny</span>
            <span className="text-brand-orange font-semibold text-sm ml-1 hidden sm:inline">Tutoring</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-[#9BAFC8] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.10]"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
          {session && (
            <li>
              <Link
                href="/dashboard"
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  pathname === '/dashboard' ? 'text-white' : 'text-[#9BAFC8] hover:text-white'
                }`}
              >
                {pathname === '/dashboard' && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.10]"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }} />
                )}
                <span className="relative z-10">Dashboard</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              {/* Avatar + name */}
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center text-white text-xs font-bold shadow-[0_2px_8px_rgba(242,116,5,0.40)]">
                  {getInitials(session.name)}
                </div>
                <div className="leading-tight">
                  <p className="text-white text-sm font-medium">{session.name.split(' ')[0]}</p>
                  {session.role === 'teacher' && (
                    <p className="text-brand-orange text-[10px] font-semibold uppercase tracking-wider">Teacher</p>
                  )}
                </div>
              </Link>
              <button onClick={logout} className="px-3 py-2 text-sm font-medium text-[#9BAFC8] hover:text-white transition-colors rounded-xl hover:bg-white/[0.05]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="px-4 py-2 text-sm font-medium text-[#9BAFC8] hover:text-white transition-colors duration-200">
                Login
              </Link>
              <Link href="/booking" className="btn-primary px-5 py-2.5 text-sm">
                Book a Session
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center text-[#9BAFC8] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden bg-[#0F1C30]/95 backdrop-blur-2xl border-t border-white/[0.07]"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-white/[0.08] text-white border border-white/[0.10]'
                      : 'text-[#9BAFC8] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <Link href="/dashboard" className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === '/dashboard' ? 'bg-white/[0.08] text-white border border-white/[0.10]' : 'text-[#9BAFC8] hover:text-white hover:bg-white/[0.05]'
                }`}>Dashboard</Link>
              )}
              <div className="mt-2 pt-2 border-t border-white/[0.07]">
                {session ? (
                  <div className="space-y-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.05] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(session.name)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{session.name}</p>
                        <p className="text-[#9BAFC8] text-xs capitalize">{session.role}</p>
                      </div>
                    </Link>
                    <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#9BAFC8] hover:text-white hover:bg-white/[0.05] transition-colors">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/auth"    className="flex-1 btn-ghost text-sm py-2.5">Login</Link>
                    <Link href="/booking" className="flex-1 btn-primary text-sm py-2.5">Book Session</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

