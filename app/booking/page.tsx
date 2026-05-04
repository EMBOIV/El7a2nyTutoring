'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { stepSlide } from '@/lib/animations';
import { subjects } from '@/lib/subjects';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;
type LevelOption = 'OL' | 'AS' | 'A2' | 'AL';
type ExamType = 'Cambridge' | 'Edexcel';
type ExamSession = 'Jan/Feb 2025' | 'May/Jun 2025' | 'Oct/Nov 2025' | 'Jan/Feb 2026' | 'May/Jun 2026' | 'Oct/Nov 2026' | 'Jan/Feb 2027' | 'May/Jun 2027';

interface ContactInfo { name: string; phone: string; }

interface Country { code: string; name: string; abbr: string; }

interface SubjectItem {
  id: string; name: string; emoji: string; tagline: string; category?: string;
}

interface SubjectSelection {
  subject: string; emoji: string;
  level: LevelOption | ''; examType: ExamType | ''; examSession: ExamSession | '';
}

const STEP_LABELS = ['Your Info', 'Subjects', 'Session Setup', 'Review'];
const LEVEL_OPTIONS: LevelOption[] = ['OL', 'AS', 'A2', 'AL'];
const EXAM_TYPES: ExamType[] = ['Cambridge', 'Edexcel'];
const EXAM_SESSIONS: ExamSession[] = [
  'Jan/Feb 2025', 'May/Jun 2025', 'Oct/Nov 2025',
  'Jan/Feb 2026', 'May/Jun 2026', 'Oct/Nov 2026',
  'Jan/Feb 2027', 'May/Jun 2027',
];

const COUNTRIES: Country[] = [
  { code: '+20',  name: 'Egypt',        abbr: 'EG' },
  { code: '+966', name: 'Saudi Arabia', abbr: 'SA' },
  { code: '+971', name: 'UAE',          abbr: 'AE' },
  { code: '+965', name: 'Kuwait',       abbr: 'KW' },
  { code: '+974', name: 'Qatar',        abbr: 'QA' },
  { code: '+973', name: 'Bahrain',      abbr: 'BH' },
  { code: '+968', name: 'Oman',         abbr: 'OM' },
  { code: '+962', name: 'Jordan',       abbr: 'JO' },
  { code: '+961', name: 'Lebanon',      abbr: 'LB' },
  { code: '+44',  name: 'UK',           abbr: 'GB' },
  { code: '+1',   name: 'USA / Canada', abbr: 'US' },
  { code: '+49',  name: 'Germany',      abbr: 'DE' },
  { code: '+33',  name: 'France',       abbr: 'FR' },
  { code: '+61',  name: 'Australia',    abbr: 'AU' },
];

function detectCountry(phone: string): Country | null {
  const d = phone.replace(/\D/g, '');
  if (!d) return null;
  if (/^0?1[0-5]/.test(d)) return COUNTRIES.find(c => c.code === '+20') ?? null;
  if (/^0?5/.test(d) && d.length >= 3) return COUNTRIES.find(c => c.code === '+966') ?? null;
  return null;
}

export default function BookingPage() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const [info, setInfo] = useState<ContactInfo>({ name: '', phone: '' });
  const [countryCode, setCountryCode] = useState('+20');
  const [countryOpen, setCountryOpen] = useState(false);

  const [subjectOptions, setSubjectOptions] = useState<SubjectItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSelection[]>([]);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0];

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  // Auto-detect country from phone digits
  useEffect(() => {
    const detected = detectCountry(info.phone);
    if (detected && detected.code !== countryCode) setCountryCode(detected.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.phone]);

  useEffect(() => {
    void (async () => {
      setSubjectsLoading(true);
      try {
        const res = await fetch('/api/subjects');
        const payload = (await res.json()) as { subjects?: SubjectItem[] };
        if (res.ok && Array.isArray(payload.subjects)) {
          setSubjectOptions(payload.subjects);
        } else {
          setSubjectOptions(subjects.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, tagline: s.tagline, category: 'All' })));
        }
      } catch {
        setSubjectOptions(subjects.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, tagline: s.tagline, category: 'All' })));
      } finally {
        setSubjectsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const preSubject = searchParams.get('subject');
    const preLevel = searchParams.get('level');
    if (!preSubject) return;
    const matched = subjects.find(s => s.name.toLowerCase() === preSubject.toLowerCase());
    if (!matched) return;
    const level: LevelOption | '' = (['OL', 'AS', 'A2', 'AL'] as string[]).includes(preLevel ?? '') ? preLevel as LevelOption : '';
    setSelectedSubjects(prev => {
      if (prev.some(i => i.subject === matched.name)) return prev;
      return [{ subject: matched.name, emoji: matched.emoji, level, examType: '', examSession: '' }];
    });
  }, [searchParams]);

  const categories = useMemo(() => {
    const vals = new Set(subjectOptions.map(s => s.category || 'General'));
    return ['All', ...Array.from(vals)];
  }, [subjectOptions]);

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subjectOptions.filter(s => {
      const cat = s.category || 'General';
      if (activeCategory !== 'All' && cat !== activeCategory) return false;
      if (!q) return true;
      return `${s.name} ${s.tagline} ${cat}`.toLowerCase().includes(q);
    });
  }, [subjectOptions, search, activeCategory]);

  const selectedCount = selectedSubjects.length;
  const configuredAll = selectedCount > 0 && selectedSubjects.every(s => s.level && s.examType && s.examSession);
  const progressScale = (step - 1) / 3;

  const toggleSubject = (subject: SubjectItem) => {
    setSelectedSubjects(prev => {
      const exists = prev.find(i => i.subject === subject.name);
      if (exists) return prev.filter(i => i.subject !== subject.name);
      return [{ subject: subject.name, emoji: subject.emoji, level: '', examType: '', examSession: '' }];
    });
  };

  const updateSubjectSelection = (name: string, patch: Partial<SubjectSelection>) =>
    setSelectedSubjects(prev => prev.map(i => i.subject === name ? { ...i, ...patch } : i));

  const validateInfo = () => {
    const e: { name?: string; phone?: string } = {};
    if (!info.name.trim()) e.name = 'Full name is required';
    if (!info.phone.trim()) e.phone = 'Phone number is required';
    else if (info.phone.replace(/\D/g, '').length < 6) e.phone = 'Please enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitBooking = async () => {
    setApiError('');
    setLoading(true);
    try {
      const digits = info.phone.replace(/^0/, '').replace(/\D/g, '');
      const fullPhone = `${countryCode}${digits}`;
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: info.name.trim(),
          phone: fullPhone,
          subjects: selectedSubjects.map(s => ({
            subject: s.subject,
            session: s.level,
            examSession: `${s.examType} | ${s.examSession}`,
          })),
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload?.error || 'Booking request failed');
      setSuccess(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1); setLoading(false); setSuccess(false); setApiError(''); setErrors({});
    setInfo({ name: '', phone: '' }); setCountryCode('+20');
    setSearch(''); setActiveCategory('All'); setSelectedSubjects([]);
  };

  if (success) {
    const fullPhone = `${countryCode}${info.phone.replace(/^0/, '').replace(/\D/g, '')}`;
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full container-pad">
          <div className="glass rounded-2xl p-8 border border-brand-green/50 bg-brand-green/10">
            <div className="flex items-center gap-3 mb-3">
              <motion.svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-brand-green shrink-0">
                <motion.circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4 }} />
                <motion.path d="M7 12.5l3.1 3.1L17.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.35, delay: 0.22 }} />
              </motion.svg>
              <p className="text-brand-success font-semibold text-lg">Booking request sent successfully ✅</p>
            </div>
            <p className="text-[#334155] text-sm mb-4">We received your request. Our team will contact you shortly to confirm details.</p>
            <div className="rounded-xl bg-white border border-brand-grayMuted p-4 text-sm mb-5">
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Name</span>
                <span className="text-brand-navy font-semibold">{info.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Phone</span>
                <span className="text-brand-navy font-semibold">{fullPhone}</span>
              </div>
              {selectedSubjects.map((s, i) => (
                <div key={s.subject} className={`py-1 ${i < selectedSubjects.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                  <div className="flex justify-between">
                    <span className="text-[#334155]">{s.emoji} {s.subject}</span>
                    <span className="text-brand-navy font-semibold">{s.level}</span>
                  </div>
                  <div className="flex justify-end text-xs text-[#64748B]">{s.examType} • {s.examSession}</div>
                </div>
              ))}
            </div>
            <button onClick={resetAll} className="btn-primary mt-1 px-6 py-3 text-sm">Book Another Request</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[70px]">
      <section className="py-16 text-center relative overflow-hidden">
        <div className="line-grid absolute inset-0 opacity-35 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto container-pad">
          <div className="mb-4 text-left">
            <Link href="/subjects" className="inline-flex items-center text-sm text-[#64748B] hover:text-brand-orange transition-colors">
              ← Back to Subjects
            </Link>
          </div>
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest">Fast Booking</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mt-3 mb-4">
            Book a Free Session <span className="gradient-text">in 4 Steps</span>
          </h1>
          <p className="text-[#334155]">Tell us about yourself first, then pick your subject and configure your session.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto container-pad">
          <div className="glass rounded-2xl p-5 md:p-8 border border-brand-grayMuted shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#64748B] font-medium">Step {step} of 4</p>
              <p className="text-xs text-[#94A3B8]">Simple flow, your selections stay with you</p>
            </div>

            <div className="flex items-center gap-0 mb-6">
              {STEP_LABELS.map((label, index) => {
                const current = (index + 1) as Step;
                const active = step === current;
                const done = step > current;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center">
                    <motion.div
                      animate={active && !reduceMotion ? { scale: [1, 1.07, 1] } : undefined}
                      transition={{ duration: 0.5 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors ${
                        done ? 'bg-brand-green border-brand-green text-white'
                        : active ? 'bg-brand-orange border-brand-orange text-white'
                        : 'bg-white border-brand-grayMuted text-[#94A3B8]'
                      }`}
                    >
                      {done ? '✓' : current}
                    </motion.div>
                    <span className={`text-xs mt-1.5 hidden sm:block ${active ? 'text-brand-navy' : 'text-[#94A3B8]'}`}>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-1.5 bg-brand-grayMuted/60 rounded-full overflow-hidden mb-8">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-brand-orange to-brand-orangeSoft"
                animate={{ scaleX: progressScale }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
              />
            </div>

            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="info-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 1: Your Details</h2>
                  <div className="grid gap-4 max-w-lg">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-[#64748B] mb-1.5">Full Name *</label>
                      <input
                        id="fullName"
                        type="text"
                        value={info.name}
                        onChange={e => { setInfo(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
                        placeholder="Your full name"
                        className={`input-field ${errors.name ? 'border-red-500/60' : ''}`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-1.5">Phone Number *</label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCountryOpen(o => !o)}
                            className="h-[46px] px-3 flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1B2A44] hover:border-[#CBD5E1] transition-colors whitespace-nowrap"
                          >
                            <span className="text-[10px] font-bold text-[#64748B] tracking-wide">{selectedCountry.abbr}</span>
                            <span>{selectedCountry.code}</span>
                            <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {countryOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                className="absolute top-full mt-1 left-0 z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-y-auto max-h-52 min-w-[190px]"
                              >
                                {COUNTRIES.map(c => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { setCountryCode(c.code); setCountryOpen(false); }}
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-[#F8FAFC] transition-colors ${c.code === countryCode ? 'text-brand-orange font-medium bg-brand-orange/5' : 'text-[#334155]'}`}
                                  >
                                    <span className="text-[10px] font-bold text-[#64748B] w-6 tracking-wide">{c.abbr}</span>
                                    <span className="font-medium">{c.code}</span>
                                    <span className="text-[#64748B] text-xs">{c.name}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input
                          type="tel"
                          value={info.phone}
                          onChange={e => { setInfo(p => ({ ...p, phone: e.target.value })); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })); }}
                          placeholder="01012345678"
                          className={`input-field flex-1 ${errors.phone ? 'border-red-500/60' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                      <p className="text-[#94A3B8] text-xs mt-1.5">{selectedCountry.name} ({selectedCountry.code}) — auto-detected from number</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button onClick={() => validateInfo() && setStep(2)} className="btn-primary px-8 py-3 text-sm">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="subjects-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 2: Choose Subjects</h2>
                  <p className="text-[#334155] text-sm mb-4">Pick one subject. Use search + category filters for speed.</p>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search subjects quickly..."
                    className="input-field mb-3"
                  />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          activeCategory === cat
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand-orange/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {selectedCount > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {selectedSubjects.map(s => (
                        <span key={s.subject} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-orange/10 text-brand-navy border border-brand-orange/20">
                          {s.emoji} {s.subject}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="max-h-[360px] overflow-y-auto pr-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjectsLoading ? (
                      <p className="text-sm text-[#64748B]">Loading subjects...</p>
                    ) : (
                      filteredSubjects.map(subject => {
                        const isActive = selectedSubjects.some(i => i.subject === subject.name);
                        return (
                          <button
                            key={subject.id}
                            onClick={() => toggleSubject(subject)}
                            className={`rounded-xl border p-4 text-left transition-all relative ${
                              isActive
                                ? 'bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-[0_4px_16px_rgba(242,116,5,0.22)]'
                                : 'bg-white border-brand-grayMuted hover:border-brand-orange/40'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                            )}
                            <span className="text-2xl block mb-2">{subject.emoji}</span>
                            <span className="text-brand-navy text-sm font-semibold block">{subject.name}</span>
                            <span className="text-[#334155] text-xs">{subject.tagline}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                  {!subjectsLoading && filteredSubjects.length === 0 && (
                    <p className="text-sm text-[#64748B] mt-2">No subjects match that search.</p>
                  )}
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => selectedCount > 0 && setStep(3)}
                      disabled={selectedCount === 0}
                      className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
                    >
                      Continue with {selectedCount} Subject
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="setup-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 3: Setup Each Subject</h2>
                  <p className="text-[#334155] text-sm mb-6">Set level, exam type, and exam session for each selected subject.</p>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {selectedSubjects.map(subject => (
                      <div key={subject.subject} className="rounded-xl border border-brand-grayMuted bg-white p-4">
                        <p className="text-brand-navy font-semibold mb-3">{subject.emoji} {subject.subject}</p>
                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">Level</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {LEVEL_OPTIONS.map(level => (
                            <button
                              key={level}
                              onClick={() => updateSubjectSelection(subject.subject, { level })}
                              className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition-all ${
                                subject.level === level
                                  ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                  : 'text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">Exam Type</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {EXAM_TYPES.map(examType => (
                            <button
                              key={examType}
                              onClick={() => updateSubjectSelection(subject.subject, { examType })}
                              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                subject.examType === examType
                                  ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                  : 'text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                              }`}
                            >
                              {examType}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">Exam Session</p>
                        <select
                          value={subject.examSession}
                          onChange={e => updateSubjectSelection(subject.subject, { examSession: e.target.value as ExamSession })}
                          aria-label={`Exam session for ${subject.subject}`}
                          title={`Exam session for ${subject.subject}`}
                          className="input-field"
                        >
                          <option value="">Select exam session</option>
                          {EXAM_SESSIONS.map(es => (
                            <option key={es} value={es}>{es}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => configuredAll && setStep(4)}
                      disabled={!configuredAll}
                      className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="review-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 4: Review &amp; Submit</h2>
                  <div className="rounded-xl border border-brand-grayMuted bg-white p-5 mb-5 text-sm">
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Name</span>
                      <span className="text-brand-navy font-semibold">{info.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Phone</span>
                      <span className="text-brand-navy font-semibold">{countryCode} {info.phone}</span>
                    </div>
                    {selectedSubjects.map((s, i) => (
                      <div key={s.subject} className={`py-2 ${i < selectedSubjects.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                        <div className="flex justify-between">
                          <span className="text-[#334155]">{s.emoji} {s.subject}</span>
                          <span className="text-brand-navy font-semibold">{s.level}</span>
                        </div>
                        <div className="flex justify-end mt-0.5">
                          <span className="text-xs text-[#64748B]">{s.examType} • {s.examSession}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {apiError && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={submitBooking} disabled={loading} className="btn-primary px-6 py-3 text-sm">
                      {loading ? 'Sending...' : `Confirm ${selectedSubjects.length} Booking${selectedSubjects.length > 1 ? 's' : ''}`}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
