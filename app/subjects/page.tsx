'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subjects, difficultyColors } from '@/lib/subjects';
import type { Subject } from '@/lib/subjects';
import Link from 'next/link';

function SubjectModal({ subject, onClose }: { subject: Subject; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="glass rounded-2xl p-8 max-w-lg w-full border border-white/[0.1] shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {subject.emoji}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">{subject.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColors[subject.difficulty]}`}>
                  {subject.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">{subject.description}</p>

          {/* Topics */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Key Topics</h3>
            <div className="grid grid-cols-1 gap-2">
              {subject.topics.map((topic, i) => (
                <div key={topic} className="flex items-center gap-3 glass rounded-xl px-4 py-2.5">
                  <span className="text-indigo-400 text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-slate-300 text-sm">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Difficulty Level</span>
              <span className={difficultyColors[subject.difficulty].split(' ')[1]}>{subject.difficulty}</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${subject.gradient} transition-all ${
                  subject.difficulty === 'Foundation'
                    ? 'w-1/3'
                    : subject.difficulty === 'Core'
                      ? 'w-2/3'
                      : 'w-full'
                }`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/booking?subject=${encodeURIComponent(subject.name)}`} className="btn-primary flex-1 py-3 text-sm text-center">
              Book Subject Now
            </Link>
            <button onClick={onClose} className="btn-ghost px-5 py-3 text-sm">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function SubjectsPage() {
  const [selected, setSelected] = useState<Subject | null>(null);
  const [filter, setFilter] = useState<'All' | 'Foundation' | 'Core' | 'Extended'>('All');

  const filtered = filter === 'All' ? subjects : subjects.filter(s => s.difficulty === filter);

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="line-grid absolute inset-0 opacity-50 pointer-events-none" />
        <div className="orb w-[350px] h-[350px] bg-brand-orange opacity-[0.08] animate-float -top-[15%] left-[60%]" />
        <div className="relative z-10 max-w-3xl mx-auto container-pad">
            <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Curriculum</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5">
            IGCSE <span className="gradient-text">Subjects</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Choose from 13 expertly taught IGCSE subjects. Click any card to explore the syllabus.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-[70px] z-30 bg-[#0F1C30]/85 backdrop-blur-xl border-b border-white/[0.06] py-3">
        <div className="max-w-7xl mx-auto container-pad flex gap-2 overflow-x-auto">
          {(['All', 'Foundation', 'Core', 'Extended'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-brand-orange text-white shadow-[0_4px_14px_rgba(242,116,5,0.35)]'
                  : 'bg-white/[0.05] border border-white/[0.09] text-[#9BAFC8] hover:text-white hover:border-white/[0.18]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(subject => (
              <motion.button
                key={subject.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(subject)}
                className="group glass rounded-2xl p-6 text-left border border-white/[0.06] hover:border-white/[0.16]
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {subject.emoji}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm">{subject.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${difficultyColors[subject.difficulty]}`}>
                    {subject.difficulty.slice(0, 3)}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-4">{subject.tagline}</p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{subject.sessions} sessions</span>
                  <span className="text-brand-orange group-hover:translate-x-1 transition-transform inline-block">View →</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && <SubjectModal subject={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
