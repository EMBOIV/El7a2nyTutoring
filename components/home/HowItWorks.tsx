'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeSlideUp, staggerContainer } from '@/lib/animations';

const STEPS = [
  {
    number: '01',
    title: 'Choose Your Subject',
    description: 'Browse our IGCSE subjects and pick the one(s) you need help with.',
  },
  {
    number: '02',
    title: 'Book a Session',
    description: 'Pick your exam session and submit your details in under one minute.',
  },
  {
    number: '03',
    title: 'Learn & Improve',
    description: 'Join personalised sessions, track progress, and raise your exam confidence.',
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto container-pad">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }} variants={fadeSlideUp} className="text-center mb-14">
          <span className="text-brand-orange text-sm font-semibold uppercase tracking-widest">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2 mb-4">How It Works</h2>
          <p className="text-slate-700 max-w-xl mx-auto">Three clear steps to unlock your best IGCSE result.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-70px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-brand-navy/30 via-brand-orange/35 to-brand-navyDeep/30" />

          {STEPS.map((step) => (
            <motion.div key={step.number} variants={fadeSlideUp} className="relative text-center group">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navyDeep items-center justify-center text-white mb-6 shadow-lg mx-auto relative z-10"
              >
                <span className="font-bold">{step.number}</span>
              </motion.div>

              <span className="absolute top-2 right-[calc(50%-48px)] text-6xl font-black text-brand-orange/10 select-none">{step.number}</span>

              <h3 className="text-brand-navy font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-slate-700 text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
