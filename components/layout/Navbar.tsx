'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/components/ui/LanguageProvider';
import logoImage from '@/Images/El7a2nyproo1.png';

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLang();

  const NAV_LINKS = [
    { href: '/',         label: t.nav.home },
    { href: '/about',    label: t.nav.about },
    { href: '/subjects', label: t.nav.subjects },
    { href: '/contact',  label: t.nav.contact },
  ];

  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_2px_16px_rgba(27,42,68,0.08)]'
          : 'bg-white border-b border-[#E2E8F0]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="h-10 w-[130px] overflow-hidden group-hover:opacity-90 transition-opacity duration-300 bg-transparent">
            <Image
              src={logoImage}
              alt="El7a2ny logo"
              width={260}
              height={80}
              className="w-full h-full object-contain mix-blend-multiply"
              priority
            />
          </div>
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
                    isActive ? 'text-[#1B2A44]' : 'text-[#64748B] hover:text-[#1B2A44]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-brand-orange/10 rounded-xl border border-brand-orange/20"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#1B2A44] hover:border-[#CBD5E1] transition-all duration-200"
            aria-label="Switch language"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link href="/booking" className="btn-primary px-5 py-2.5 text-sm">
            {t.nav.bookSession}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#E2E8F0] text-[#64748B]"
            aria-label="Switch language"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="w-9 h-9 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1B2A44] transition-colors"
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
            className="md:hidden overflow-hidden bg-white border-t border-[#E2E8F0] shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                      : 'text-[#64748B] hover:text-[#1B2A44] hover:bg-[#F5F7FA]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                <Link
                  href="/booking"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-white bg-brand-orange hover:bg-brand-orangeSoft text-center transition-colors"
                >
                  {t.nav.bookSession}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

