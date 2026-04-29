import Link from 'next/link';

// Server component — static HTML, CSS-only gradient background
export default function CTASection() {
  return (
    <section className="section relative overflow-hidden">
      {/* Background gradient blob — CSS only */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-dark-bg to-violet-900/30 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-indigo-600/15 animate-float -top-[30%] -left-[10%]" />
      <div className="orb w-[400px] h-[400px] bg-violet-600/15 animate-float-delayed -bottom-[20%] -right-[10%]" />

      <div className="relative z-10 max-w-3xl mx-auto container-pad text-center">
        <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Get Started</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-5 leading-tight">
          Ready to Achieve<br />
          <span className="gradient-text">Your Best Grade?</span>
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Join 500+ IGCSE students who improved their grades with El7a2ny. Book your first session today — the first one is free.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/booking" className="btn-primary px-8 py-4 text-base">
            Book Free Session
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="/contact" className="btn-ghost px-8 py-4 text-base">
            Talk to Us First
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-slate-500 text-sm">
          ⭐ 4.9 / 5 average rating from 200+ student reviews
        </p>
      </div>
    </section>
  );
}
