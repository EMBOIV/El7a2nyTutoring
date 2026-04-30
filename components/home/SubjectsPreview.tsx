'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { subjects } from '@/lib/subjects';

const PREVIEW = subjects.slice(0, 6);

const DIFF_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Extended: { bg: 'bg-brand-orange/10', text: 'text-brand-orange', border: 'border-brand-orange/30' },
  Core:     { bg: 'bg-[#7BBF2A]/10',   text: 'text-[#7BBF2A]',    border: 'border-[#7BBF2A]/30' },
};

function TiltCard({ title, tagline, emoji, sessions, difficulty }: {
  title: string; tagline: string; emoji: string; sessions: number; difficulty: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref     = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const sRotX   = useSpring(rotateX, { stiffness: 160, damping: 20 });
  const sRotY   = useSpring(rotateY, { stiffness: 160, damping: 20 });

  const dc = DIFF_COLORS[difficulty] ?? DIFF_COLORS['Core'];

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduceMotion || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rotateX.set(-(((e.clientY - r.top)  / r.height - 0.5) * 10));
      }}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      style={reduceMotion ? undefined : { rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative h-full"
    >
      {/* Outer border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-orange/30 to-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px', borderRadius: '16px' }} />

      <div className="relative rounded-2xl card-dark border border-white/[0.08] p-6 h-full flex flex-col group-hover:border-brand-orange/25 transition-all duration-300"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
      >
        {/* Shine on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
        />

        <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-brand-navy to-[#0F1C30] border border-white/[0.10] items-center justify-center text-2xl mb-4 relative z-10 shadow-lg">
          {emoji}
        </div>

        <div className="flex items-start justify-between mb-2 relative z-10">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ml-2 flex-shrink-0 ${dc.bg} ${dc.text} ${dc.border}`}>
            {difficulty}
          </span>
        </div>

        <p className="text-[#9BAFC8] text-sm leading-relaxed mb-5 relative z-10 flex-1">{tagline}</p>

        <div className="flex items-center justify-between text-xs text-[#6B829E] relative z-10 mt-auto">
          <span>{sessions} sessions</span>
          <span className="text-brand-orange group-hover:translate-x-1.5 transition-transform duration-200 inline-block">
            Learn more →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SubjectsPreview() {
  return (
    <section className="section relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-[#1B2A44] opacity-80 -bottom-40 -right-20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
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
            Curriculum
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-5 leading-tight">
            IGCSE Subjects
            <span className="gradient-text"> We Cover</span>
          </h2>
          <p className="text-[#9BAFC8] max-w-xl mx-auto text-lg">
            From sciences to humanities — expert tutoring across every major IGCSE subject, tailored to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREVIEW.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href="/subjects" aria-label={`Explore ${subject.name}`} className="block h-full">
                <TiltCard
                  title={subject.name}
                  tagline={subject.tagline}
                  emoji={subject.emoji}
                  sessions={subject.sessions}
                  difficulty={subject.difficulty}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mt-12"
        >
          <Link href="/subjects" className="btn-ghost px-9 py-3.5 text-sm">
            View All 13 Subjects
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


