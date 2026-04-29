'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { fadeSlideUp } from '@/lib/animations';

const TITLE = 'Unlock Your IGCSE Potential';

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 0.5], [0, -18]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden animated-gradient hero-fade-mask">
      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

      <motion.div
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="hero-shape w-44 h-44 top-[14%] left-[8%] animate-float"
      />
      <motion.div
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="hero-shape w-64 h-64 bottom-[18%] right-[10%] animate-float-delayed"
      />
      <motion.div
        style={reduceMotion ? undefined : { y: parallaxY }}
        className="hero-shape w-32 h-32 top-[34%] right-[22%] animate-float-slow"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 border border-brand-orange/35 bg-white/90"
        >
          <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
          <span className="text-sm text-brand-navy font-semibold">Now enrolling · Academic Year 2025/2026</span>
        </motion.div>

        <motion.h1
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.05 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          {!reduceMotion ? (
            <span className="inline-flex flex-wrap justify-center gap-x-[0.02em]">
              {TITLE.split('').map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.02 * index, ease: [0.22, 1, 0.36, 1] }}
                  className={char === ' ' ? 'w-[0.35em]' : ''}
                >
                  {char === ' ' ? '\u00a0' : char}
                </motion.span>
              ))}
            </span>
          ) : (
            TITLE
          )}
        </motion.h1>

        <motion.p
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.18 }}
          className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Premium, personalised tutoring for IGCSE students with proven strategies,
          expert tutors, and clear progress every week.
        </motion.p>

        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.24 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/booking" className="cta-glow">
            <motion.span
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="btn-primary px-8 py-4 text-base cursor-pointer"
            >
              Book a Free Session
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.span>
          </Link>
          <Link href="/subjects">
            <motion.span
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="btn-ghost px-8 py-4 text-base cursor-pointer"
            >
              Explore Subjects
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeSlideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="mt-14 flex flex-wrap justify-center gap-8 text-sm"
        >
          {['No hidden fees', 'Expert Cambridge tutors', 'Flexible scheduling', 'Progress tracking'].map((item) => (
            <span key={item} className="text-slate-200">{item}</span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-65">
        <span className="text-xs text-slate-100 tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/60 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce-slow" />
        </div>
      </div>
    </section>
  );
}
