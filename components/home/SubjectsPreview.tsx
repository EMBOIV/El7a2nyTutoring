'use client';

import Link from 'next/link';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { subjects } from '@/lib/subjects';
import { fadeSlideUp, staggerContainer } from '@/lib/animations';

const PREVIEW = subjects.slice(0, 6);

function TiltCard({
  title,
  tagline,
  emoji,
  sessions,
  difficulty,
}: {
  title: string;
  tagline: string;
  emoji: string;
  sessions: number;
  difficulty: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const softRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.8 });
  const softRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.8 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 8);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduceMotion ? undefined : { rotateX: softRotateX, rotateY: softRotateY, transformStyle: 'preserve-3d' }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="group rounded-2xl p-[1px] bg-gradient-to-b from-brand-orange/45 to-brand-navyDeep/30"
    >
      <div className="rounded-2xl bg-white p-6 border border-brand-grayMuted/80 h-full transition-shadow duration-200 group-hover:shadow-[0_14px_30px_rgba(22,34,56,0.24)]">
        <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-brand-navy to-brand-navyDeep items-center justify-center text-white text-2xl mb-4">
          {emoji}
        </div>

        <div className="flex items-start justify-between mb-2">
          <h3 className="text-brand-navy font-semibold">{title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
              difficulty === 'Extended'
                ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/30'
                : 'bg-brand-navy/8 text-brand-navy border-brand-grayMuted'
            }`}
          >
            {difficulty}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">{tagline}</p>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{sessions} sessions available</span>
          <span className="text-brand-orange group-hover:translate-x-1 transition-transform inline-block">Learn more →</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SubjectsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto container-pad">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeSlideUp}
          className="text-center mb-14"
        >
          <span className="text-brand-orange text-sm font-semibold uppercase tracking-widest">Curriculum</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2 mb-4">IGCSE Subjects We Cover</h2>
          <p className="text-slate-700 max-w-xl mx-auto">
            From sciences to humanities, we offer expert tutoring across all major IGCSE subjects.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {PREVIEW.map((subject) => (
            <motion.div key={subject.id} variants={fadeSlideUp}>
              <Link href="/subjects" aria-label={`Explore ${subject.name}`}>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mt-10"
        >
          <Link href="/subjects" className="btn-ghost px-8 py-3 text-sm">
            View All 12 Subjects
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
