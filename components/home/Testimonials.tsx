'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/utils';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
  const prev = () => setActive(a => (a - 1 + total) % total);

  // Auto-advance every 5s
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const t = TESTIMONIALS[active];

  return (
    <section className="section bg-dark-surface/40">
      <div className="max-w-7xl mx-auto container-pad">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Hear From Our Students
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Card — AnimatePresence with mode=wait: exit before enter → no layout shift */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="glass rounded-2xl p-8 md:p-10 border border-white/[0.07]"
            >
              {/* Quote icon */}
              <div className="text-4xl text-indigo-400/40 font-serif mb-4 select-none">&ldquo;</div>

              <p className="text-slate-200 text-lg leading-relaxed mb-8">{t.text}</p>

              <div className="flex items-center gap-4">
                {/* Avatar — pure CSS gradient, no image request */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-indigo-400 text-sm">{t.grade}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 h-2 bg-indigo-500' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
