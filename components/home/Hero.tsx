'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const BADGES = ['No hidden fees', 'Expert Cambridge tutors', 'Flexible scheduling', 'Progress tracking'];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F1C30]">
      {/* ── Animated background orbs ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large teal-navy orb top-left */}
        <div
          className="orb w-[700px] h-[700px] bg-[#1B2A44] opacity-90 -top-40 -left-40"
          style={reduceMotion ? undefined : { animation: 'orb-drift-a 20s ease-in-out infinite' }}
        />
        {/* Orange accent orb top-right */}
        <div
          className="orb w-[500px] h-[500px] bg-brand-orange opacity-[0.12] -top-20 right-0"
          style={reduceMotion ? undefined : { animation: 'orb-drift-b 26s ease-in-out infinite' }}
        />
        {/* Deep navy blob center */}
        <div
          className="orb w-[600px] h-[400px] bg-[#0F1C30] opacity-80 top-1/3 left-1/2 -translate-x-1/2"
          style={reduceMotion ? undefined : { animation: 'orb-drift-a 30s ease-in-out 6s infinite' }}
        />
        {/* Subtle orange bottom */}
        <div
          className="orb w-[400px] h-[400px] bg-brand-orange opacity-[0.08] bottom-0 left-1/4"
          style={reduceMotion ? undefined : { animation: 'orb-drift-b 22s ease-in-out 3s infinite' }}
        />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Top radial orange glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(242,116,5,0.13)_0%,transparent_70%)]" />
      </div>

      {/* ── Ring decorations ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-shape w-52 h-52 top-[12%] left-[6%]"
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="hero-shape w-72 h-72 bottom-[14%] right-[8%]"
        />
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="hero-shape w-36 h-36 top-[38%] right-[20%]"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-10 bg-white/[0.06] border border-white/[0.12] backdrop-blur-sm"
        >
          <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          <span className="text-sm text-[#9BAFC8] font-medium">Now enrolling · Academic Year 2025/2026</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.08] tracking-tight mb-6"
        >
          <span className="text-white">Unlock Your</span>
          <br />
          <span className="gradient-text">IGCSE Potential</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.20, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-[#9BAFC8] max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Premium, personalised tutoring for IGCSE students — with proven strategies,
          expert tutors, and measurable progress every single week.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <Link href="/booking" className="cta-glow">
            <motion.span
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="btn-primary px-9 py-4 text-base font-semibold cursor-pointer inline-flex items-center gap-2"
            >
              Book a Free Session
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.span>
          </Link>
          <Link href="/subjects">
            <motion.span
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="btn-ghost px-9 py-4 text-base font-semibold cursor-pointer inline-flex items-center gap-2"
            >
              Explore Subjects
            </motion.span>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {BADGES.map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm text-[#9BAFC8]">
              <span className="w-4 h-4 rounded-full bg-brand-green/20 border border-brand-green/50 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-xs text-[#9BAFC8] tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce-slow" />
        </div>
      </div>
    </section>
  );
}
