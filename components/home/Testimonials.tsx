'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/utils';

const STARS = Array(5).fill(null);

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
  const prev = () => setActive(a => (a - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  const t = TESTIMONIALS[active];

  return (
    <section className="section relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#F5F7FA]" />
        <div className="orb w-[600px] h-[600px] bg-brand-orange opacity-[0.04] -top-40 left-1/2 -translate-x-1/2" />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#E2E8F0]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E2E8F0]" />
      </div>

      <div className="max-w-7xl mx-auto container-pad relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B2A44] mt-4 mb-5 leading-tight">
            Students Who
            <span className="gradient-text"> Succeeded</span>
          </h2>
          <p className="text-[#64748B] max-w-lg mx-auto text-lg">
            Real results from real IGCSE students.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 32, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -32, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-8 md:p-10 bg-white border border-[#E2E8F0]"
              style={{ boxShadow: '0 4px 32px rgba(27,42,68,0.08)' }}
            >
              {/* Card shine */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(242,116,5,0.02) 0%, transparent 50%)' }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {STARS.map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-brand-orange fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <div className="text-5xl text-brand-orange/20 font-serif leading-none mb-2 select-none">&ldquo;</div>
              <p className="text-[#334155] text-lg leading-relaxed mb-8 font-medium">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[#1B2A44] font-semibold">{t.name}</p>
                  <p className="text-brand-orange text-sm font-medium">{t.grade}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1B2A44] hover:border-[#CBD5E1] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-7 h-2.5 bg-brand-orange' : 'w-2.5 h-2.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next"
              className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1B2A44] hover:border-[#CBD5E1] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


