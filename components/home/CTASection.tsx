'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const TRUST = ['⭐ 4.9/5 student rating', '500+ students helped', 'Free first session', 'No long-term contract'];

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section relative overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="orb w-[700px] h-[700px] bg-brand-orange opacity-[0.06] -top-40 left-1/2 -translate-x-1/2"
          style={reduceMotion ? undefined : { animation: 'orb-drift-a 20s ease-in-out infinite' }}
        />
        <div className="orb w-[400px] h-[400px] bg-[#22C55E] opacity-[0.04] bottom-0 right-0"
          style={reduceMotion ? undefined : { animation: 'orb-drift-b 28s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(242,116,5,0.05)_0%,transparent_70%)]" />
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#E2E8F0]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto container-pad text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            Get Started
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold text-[#1B2A44] mt-4 mb-6 leading-[1.05]">
            Ready to Achieve
            <br />
            <span className="gradient-text">Your Best Grade?</span>
          </h2>

          <p className="text-[#334155] text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Join 500+ IGCSE students who transformed their grades with El7a2ny.
            Your first session is completely free.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/booking" className="cta-glow">
              <motion.span
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                className="btn-primary px-10 py-4 text-base font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                Book Free Session
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.span>
            </Link>
            <Link href="/contact">
              <motion.span
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="btn-ghost px-10 py-4 text-base font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                Talk to Us First
              </motion.span>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {TRUST.map((item) => (
              <span key={item} className="text-[#64748B] text-sm font-medium">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

