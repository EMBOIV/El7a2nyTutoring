'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subjects, LEVEL_INFO, LEVELS } from '@/lib/subjects';
import type { Subject, Level } from '@/lib/subjects';
import Link from 'next/link';

/* ── Level pill chip ─────────────────────────────────────────────────────── */
function LevelPill({ level, active }: { level: Level; active?: boolean }) {
  const info = LEVEL_INFO[level];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
        active
          ? info.pill.replace('/10', '/20').replace('/50', '') + ' ring-1 ring-current/40 scale-105'
          : info.pill + ' opacity-70'
      }`}
    >
      {level}
    </span>
  );
}

/* ── Subject modal ───────────────────────────────────────────────────────── */
function SubjectModal({ subject, onClose }: { subject: Subject; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2A44]/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-2xl p-8 max-w-lg w-full border border-[#E2E8F0] shadow-[0_12px_40px_rgba(27,42,68,0.10)] max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {subject.emoji}
              </div>
              <div>
                <h2 className="text-[#1B2A44] font-bold text-xl">{subject.name}</h2>
                <p className="text-[#64748B] text-xs mt-0.5">{subject.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1B2A44]"
            >
              ✕
            </button>
          </div>

          <p className="text-[#334155] leading-relaxed mb-6">{subject.description}</p>

          {/* Topics */}
          <div className="mb-6">
            <h3 className="text-[#1B2A44] font-semibold mb-3 text-sm uppercase tracking-wider">Key Topics</h3>
            <div className="grid grid-cols-1 gap-2">
              {subject.topics.map((topic, i) => (
                <div key={topic} className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl px-4 py-2.5 border border-[#E2E8F0]">
                  <span className="text-brand-orange text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[#334155] text-sm">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level breakdown */}
          <div className="mb-6">
            <h3 className="text-[#1B2A44] font-semibold mb-3 text-sm uppercase tracking-wider">Available Levels</h3>
            <div className="space-y-2">
              {LEVELS.map(lvl => {
                const info = LEVEL_INFO[lvl];
                return (
                  <div key={lvl} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${info.pill}`}>
                    <span className="font-black text-sm w-6 shrink-0">{lvl}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight">{info.label}</p>
                      <p className="text-xs opacity-70 leading-tight">{info.description}</p>
                    </div>
                    <span className="text-[10px] font-bold whitespace-nowrap bg-white/70 rounded-full px-2 py-0.5 border border-current/20">
                      {info.difficulty}
                    </span>
                  </div>
                );
              })}
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

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function SubjectsPage() {
  const [selected, setSelected] = useState<Subject | null>(null);
  const [activeLevel, setActiveLevel] = useState<'All' | Level>('All');

  const activeLevelInfo = activeLevel !== 'All' ? LEVEL_INFO[activeLevel] : null;

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="line-grid absolute inset-0 opacity-50 pointer-events-none" />
        <div className="orb w-[350px] h-[350px] bg-brand-orange opacity-[0.08] animate-float -top-[15%] left-[60%]" />
        <div className="relative z-10 max-w-3xl mx-auto container-pad">
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Curriculum</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B2A44] mt-3 mb-5">
            IGCSE <span className="gradient-text">Subjects</span>
          </h1>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            All 13 subjects are available at every level — OL, AS, A2, and Full A Level.
            Click any card to explore topics and levels.
          </p>
        </div>
      </section>

      {/* Level filter + banner */}
      <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0]">
        {/* Tabs */}
        <div className="max-w-7xl mx-auto container-pad pt-3 pb-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveLevel('All')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeLevel === 'All'
                ? 'bg-[#1B2A44] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1B2A44] hover:border-[#CBD5E1]'
            }`}
          >
            All Subjects
          </button>
          {LEVELS.map(lvl => {
            const info = LEVEL_INFO[lvl];
            const active = activeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  active ? info.pill.replace('/10', '/20') + ' shadow-sm' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                }`}
              >
                <span className="font-black">{lvl}</span>
                <span className={`ml-1.5 text-xs font-normal hidden sm:inline ${active ? '' : 'text-[#94A3B8]'}`}>
                  · {info.difficulty}
                </span>
              </button>
            );
          })}
        </div>

        {/* Level info banner */}
        <AnimatePresence>
          {activeLevelInfo && (
            <motion.div
              key={activeLevel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`max-w-7xl mx-auto container-pad pb-3`}>
                <div className={`rounded-xl px-4 py-3 border flex items-center gap-4 ${activeLevelInfo.pill}`}>
                  {/* Bar */}
                  <div className="hidden sm:flex flex-col gap-1 w-28 shrink-0">
                    <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${activeLevelInfo.bar} ${activeLevelInfo.barWidth}`} />
                    </div>
                    <p className="text-[10px] font-semibold opacity-70">{activeLevelInfo.difficulty}</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{activeLevel} — {activeLevelInfo.label}</p>
                    <p className="text-xs opacity-80">{activeLevelInfo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid — all 13 subjects always shown */}
      <section className="section">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {subjects.map(subject => (
              <motion.button
                key={subject.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(subject)}
                className="group bg-white rounded-2xl p-6 text-left border border-[#E2E8F0] hover:border-brand-orange/30
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {subject.emoji}
                </div>

                <h3 className="text-[#1B2A44] font-semibold text-sm mb-1">{subject.name}</h3>
                <p className="text-[#64748B] text-xs leading-relaxed mb-4">{subject.tagline}</p>

                {/* All 4 level pills — highlight active filter */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {LEVELS.map(lvl => (
                    <LevelPill key={lvl} level={lvl} active={activeLevel === 'All' || activeLevel === lvl} />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
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
