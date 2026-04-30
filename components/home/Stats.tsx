'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat { value: number; suffix: string; label: string; icon: string; color: string; glow: string; }

const STATS: Stat[] = [
  { value: 500,  suffix: '+', label: 'Students Helped',  icon: '👩‍🎓', color: 'text-brand-orange',  glow: 'rgba(242,116,5,0.20)' },
  { value: 13,   suffix: '',  label: 'IGCSE Subjects',   icon: '📚', color: 'text-[#7BBF2A]',      glow: 'rgba(123,191,42,0.20)' },
  { value: 95,   suffix: '%', label: 'Success Rate',     icon: '🏆', color: 'text-[#A5C8FF]',      glow: 'rgba(165,200,255,0.20)' },
  { value: 4,    suffix: '+', label: 'Years Experience', icon: '⭐', color: 'text-[#FFD166]',      glow: 'rgba(255,209,102,0.20)' },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <>{count}{suffix}</>;
}

export default function Stats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="relative py-16 overflow-hidden" ref={ref}>
      {/* divider lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center rounded-2xl p-6 card-dark card-dark-hover group"
              style={{ boxShadow: inView ? `0 0 40px ${stat.glow}` : 'none' }}
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className={`text-4xl md:text-5xl font-extrabold mb-2 ${stat.color} tabular-nums`}>
                <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-[#9BAFC8] text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

