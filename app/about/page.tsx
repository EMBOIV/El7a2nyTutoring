'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { TEAM } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const TIMELINE = [
  { year: '2020', title: 'Founded in Cairo', desc: 'Started with 3 tutors and a vision to make quality IGCSE tutoring accessible to every student.' },
  { year: '2021', title: 'Went Online', desc: 'Expanded to fully online sessions, reaching students across Egypt and the MENA region.' },
  { year: '2022', title: '200 Students Milestone', desc: 'Celebrated 200 active students and a 92% exam success rate across all subjects.' },
  { year: '2023', title: 'Team Expanded', desc: 'Grew to 12 expert tutors covering all IGCSE subjects with dedicated Cambridge-trained specialists.' },
  { year: '2024', title: '500+ Students & 95% Success', desc: 'Reached over 500 students with a 95% success rate — our best year yet.' },
];

function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="relative max-w-2xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-brand-orange via-brand-orange/50 to-transparent" />

      <div className="space-y-8">
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
            className="pl-14 relative"
          >
            {/* Dot */}
            <div className="absolute left-3 top-1.5 w-4 h-4 rounded-full bg-brand-orange border-2 border-[#F5F7FA] shadow-[0_0_8px_rgba(242,116,5,0.30)]" />

            <span className="text-brand-orange text-xs font-semibold uppercase tracking-wider">{item.year}</span>
            <h3 className="text-[#1B2A44] font-semibold mt-0.5 mb-1">{item.title}</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="orb w-[400px] h-[400px] bg-brand-orange opacity-[0.08] animate-float -top-[10%] -right-[5%]" />
        <div className="line-grid absolute inset-0 opacity-40 pointer-events-none" />

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto container-pad text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Our Story</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1B2A44] mt-3 mb-6">
              Built for IGCSE.<br />
              <span className="gradient-text">Driven by Results.</span>
            </h1>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto leading-relaxed">
              El7a2ny was founded by educators who believed that every student deserves access to expert tutoring — not just those who can afford elite schools.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Our Mission',
                text: 'To make world-class IGCSE tutoring accessible to every motivated student. We combine expert knowledge with personalised teaching to help students unlock their academic potential.',
                gradient: 'from-brand-orange/15 to-brand-orange/5',
                border: 'border-brand-orange/20',
              },
              {
                icon: '🚀',
                title: 'Our Vision',
                text: 'To become the leading IGCSE tutoring platform in the MENA region, empowering students to achieve not just good grades, but a genuine love for learning.',
                gradient: 'from-[#22C55E]/15 to-[#22C55E]/5',
                border: 'border-[#22C55E]/20',
              },
            ].map(item => (
              <div
                key={item.title}
                className={`glass rounded-2xl p-8 border ${item.border} bg-gradient-to-br ${item.gradient}`}
              >
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h2 className="text-[#1B2A44] font-bold text-xl mb-3">{item.title}</h2>
                <p className="text-[#64748B] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A44] mt-2">Our Story So Far</h2>
          </div>
          <Timeline />
        </div>
      </section>

      {/* Team */}
      <section className="section bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A44] mt-2 mb-4">Meet Our Tutors</h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Experts who don&apos;t just know their subjects — they know how to teach them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="bg-white rounded-2xl p-6 text-center border border-[#E2E8F0] hover:border-brand-orange/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="text-[#1B2A44] font-semibold">{member.name}</h3>
                <p className="text-brand-orange text-sm mt-1 mb-3">{member.role}</p>
                <p className="text-[#64748B] text-xs leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {member.subjects.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-[#F5F7FA] rounded-full text-[#64748B] border border-[#E2E8F0]">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="max-w-2xl mx-auto container-pad">
          <h2 className="text-3xl font-bold text-[#1B2A44] mb-4">Ready to Start Learning?</h2>
          <p className="text-[#64748B] mb-8">Book your first free session with one of our tutors today.</p>
          <Link href="/booking" className="btn-primary px-8 py-4 text-base inline-flex">
            Book a Free Session
          </Link>
        </div>
      </section>
    </div>
  );
}
