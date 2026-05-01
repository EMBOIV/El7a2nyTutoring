'use client';

import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '🎓',
    title: 'Results-First Learning System',
    description: 'A clear method that moves students from confusion to exam-ready performance, step by step.',
    gradient: 'from-brand-orange/20 to-brand-orange/5',
    border: 'border-brand-orange/25',
    iconBg: 'from-brand-orange/30 to-brand-orange/10',
  },
  {
    icon: '📋',
    title: 'Targeted Study Plans',
    description: 'No generic lessons. We focus on your weak topics first and build momentum fast.',
    gradient: 'from-[#7BBF2A]/15 to-[#7BBF2A]/5',
    border: 'border-[#7BBF2A]/25',
    iconBg: 'from-[#7BBF2A]/30 to-[#7BBF2A]/10',
  },
  {
    icon: '📈',
    title: 'Weekly Progress Tracking',
    description: 'You always know what improved, what is next, and what to revise before exams.',
    gradient: 'from-[#A5C8FF]/15 to-[#A5C8FF]/5',
    border: 'border-[#A5C8FF]/25',
    iconBg: 'from-[#A5C8FF]/30 to-[#A5C8FF]/10',
  },
  {
    icon: '🕐',
    title: 'Flexible Booking',
    description: 'Book in under a minute and choose times that fit school, revision, and deadlines.',
    gradient: 'from-[#FFD166]/15 to-[#FFD166]/5',
    border: 'border-[#FFD166]/25',
    iconBg: 'from-[#FFD166]/30 to-[#FFD166]/10',
  },
  {
    icon: '💬',
    title: 'Fast Help Before Exams',
    description: 'Urgent support is available when exams are close and you need quick, focused recovery.',
    gradient: 'from-brand-orange/15 to-brand-orange/5',
    border: 'border-brand-orange/20',
    iconBg: 'from-brand-orange/25 to-brand-orange/8',
  },
  {
    icon: '🏆',
    title: 'Built for Real Improvement',
    description: 'Works for both struggling students and high achievers who want a stronger final grade.',
    gradient: 'from-[#7BBF2A]/15 to-[#7BBF2A]/5',
    border: 'border-[#7BBF2A]/20',
    iconBg: 'from-[#7BBF2A]/25 to-[#7BBF2A]/8',
  },
];

export default function Features() {
  return (
    <section className="section relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#F5F7FA]" />
        <div className="orb w-[600px] h-[600px] bg-brand-orange opacity-[0.04] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-px bg-[#E2E8F0]" />
      </div>

      <div className="max-w-7xl mx-auto container-pad relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            Why El7a2ny
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B2A44] mt-4 mb-5 leading-tight">
            A Platform Designed for
            <span className="gradient-text"> Exam Results</span>
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto text-lg">
            Simple flow, fast decisions, and consistent progress you can feel week by week.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, transition: { duration: 0.22 } }}
              className={`relative rounded-2xl p-7 bg-white border border-[#E2E8F0] shadow-sm group cursor-default hover:shadow-md hover:border-brand-orange/30 transition-all duration-300`}
            >
              {/* Hover shine */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)' }}
              />

              <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.iconBg} border border-[#E2E8F0] items-center justify-center text-2xl mb-5`}>
                {feature.icon}
              </div>

              <h3 className="text-[#1B2A44] font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
