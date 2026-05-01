'use client';

import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    icon: '🎯',
    title: 'Choose Level and Subject',
    description: 'Pick your level first, then quickly choose the right subject with guided search.',
    accent: 'from-brand-orange/20 to-brand-orange/5',
    border: 'border-brand-orange/30',
    glow: 'rgba(242,116,5,0.15)',
  },
  {
    number: '02',
    icon: '📅',
    title: 'Select Session Type',
    description: 'Choose a focused private session or a small group with up to 6 students.',
    accent: 'from-[#7BBF2A]/20 to-[#7BBF2A]/5',
    border: 'border-[#7BBF2A]/30',
    glow: 'rgba(123,191,42,0.15)',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Pick Time and Start',
    description: 'Choose your preferred time and start a simple system built for fast exam improvement.',
    accent: 'from-[#A5C8FF]/20 to-[#A5C8FF]/5',
    border: 'border-[#A5C8FF]/30',
    glow: 'rgba(165,200,255,0.15)',
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section relative overflow-hidden">
      {/* bg decoration */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-brand-orange opacity-[0.04] -top-20 -right-20" />
        <div className="orb w-80 h-80 bg-[#22C55E] opacity-[0.03] bottom-0 -left-10" />
        <div className="absolute inset-0 line-grid opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto container-pad relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B2A44] mt-4 mb-5 leading-tight">
            Guided Flow to
            <span className="gradient-text"> Better Results</span>
          </h2>
          <p className="text-[#64748B] max-w-lg mx-auto text-lg">
            Clear actions, no overload, and a faster path from booking to progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(242,116,5,0.5) 0%, rgba(165,200,255,0.5) 100%)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl p-7 bg-white border border-[#E2E8F0] shadow-sm card-dark-hover group`}
              style={{ boxShadow: '0 2px 12px rgba(27,42,68,0.06)' }}
            >
              {/* Step number watermark */}
              <span className="absolute top-4 right-5 text-5xl font-black text-[#1B2A44]/[0.04] select-none">{step.number}</span>

              {/* Icon */}
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${step.accent} border border-[#E2E8F0] items-center justify-center text-2xl mb-5 relative z-10`}
              >
                {step.icon}
              </motion.div>

              <h3 className="text-[#1B2A44] font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


