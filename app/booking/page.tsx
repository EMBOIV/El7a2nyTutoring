'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { stepSlide } from '@/lib/animations';
import { addSession, isValidPhone, normalizePhone } from '@/lib/auth';
import { subjects } from '@/lib/subjects';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;
type LevelOption = 'IGCSE' | 'OL' | 'AS' | 'A2';
type SessionType = 'Group' | 'Private';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

interface UserSession {
  name: string;
  email: string;
  phone?: string;
}

interface SubjectItem {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  category?: string;
}

interface BookingSelection {
  level: LevelOption | '';
  subject: string;
  sessionType: SessionType | '';
  time: string;
}

const STEP_LABELS = ['Level', 'Subject', 'Session', 'Time'];
const LEVEL_OPTIONS: LevelOption[] = ['IGCSE', 'OL', 'AS', 'A2'];
const SESSION_TYPES: SessionType[] = ['Group', 'Private'];
const TIME_OPTIONS = ['Today evening', 'Tomorrow morning', 'Tomorrow evening', 'This weekend', 'Flexible'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSubjectEmoji(name: string): string {
  return subjects.find(subject => subject.name === name)?.emoji ?? '📘';
}

function LabeledInput({
  id, label, type, value, onChange, hasError,
}: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void; hasError?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#64748B] mb-1.5">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={type === 'email' ? 'your@email.com' : type === 'tel' ? '+201010294098' : 'Your full name'}
        className={`input-field ${hasError ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
      />
    </div>
  );
}

export default function BookingPage() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; time?: string }>({});
  const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(null);
  const [info, setInfo] = useState<ContactInfo>({ name: '', email: '', phone: '' });

  const [selection, setSelection] = useState<BookingSelection>({
    level: '',
    subject: '',
    sessionType: '',
    time: '',
  });

  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectOptions, setSubjectOptions] = useState<SubjectItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('el7a2ny_session');
      if (raw) {
        const user = JSON.parse(raw) as UserSession;
        if (user?.name && user?.email) {
          setLoggedInUser(user);
          setInfo({ name: user.name, email: user.email, phone: user.phone ?? '' });
        }
      }
    } catch {
      // Ignore invalid stored session values.
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    const preSubject = searchParams.get('subject');
    const preLevel = searchParams.get('level');

    if (preLevel && ['IGCSE', 'OL', 'AS', 'A2'].includes(preLevel)) {
      setSelection(prev => ({ ...prev, level: preLevel as LevelOption }));
    }

    if (preSubject) {
      const matched = subjects.find(s => s.name.toLowerCase() === preSubject.toLowerCase());
      if (matched) {
        setSelection(prev => ({ ...prev, subject: matched.name }));
      }
    }
  }, [searchParams]);

  const loadSubjects = async (level: LevelOption) => {
    setSubjectsLoading(true);
    try {
      const response = await fetch(`/api/subjects?level=${encodeURIComponent(level)}`);
      const payload = (await response.json()) as { subjects?: SubjectItem[] };
      if (response.ok && Array.isArray(payload.subjects)) {
        setSubjectOptions(payload.subjects);
        return;
      }
    } catch {
      // Fallback below.
    }

    const fallback = subjects.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, tagline: s.tagline }));
    setSubjectOptions(fallback);
    setSubjectsLoading(false);
  };

  useEffect(() => {
    if (!selection.level) {
      setSubjectOptions([]);
      return;
    }
    void loadSubjects(selection.level);
  }, [selection.level]);

  useEffect(() => {
    setSubjectsLoading(false);
  }, [subjectOptions]);

  useEffect(() => {
    if (!selection.level && !selection.subject && !selection.sessionType && !selection.time) {
      return;
    }

    const payload = {
      level: selection.level || undefined,
      subject: selection.subject || undefined,
      session_type: selection.sessionType || undefined,
      time: selection.time || undefined,
    };

    void fetch('/api/booking/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }, [selection.level, selection.subject, selection.sessionType, selection.time]);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/booking/session');
        const payload = (await response.json()) as {
          session?: { level?: string; subject?: string; session_type?: string; time?: string };
        };
        if (!response.ok || !payload.session) return;

        setSelection(prev => ({
          level: (payload.session?.level as LevelOption) ?? prev.level,
          subject: payload.session?.subject ?? prev.subject,
          sessionType: (payload.session?.session_type as SessionType) ?? prev.sessionType,
          time: payload.session?.time ?? prev.time,
        }));
      } catch {
        // Ignore session restore errors.
      }
    })();
  }, []);

  const filteredSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return subjectOptions;
    return subjectOptions.filter(subject => `${subject.name} ${subject.tagline}`.toLowerCase().includes(q));
  }, [subjectSearch, subjectOptions]);

  const validateInfo = () => {
    const e: { name?: string; email?: string; phone?: string; time?: string } = {};
    if (!selection.time.trim()) e.time = 'Please choose or enter a preferred time';

    if (!loggedInUser) {
      if (!info.name.trim()) e.name = 'Full name is required';
      if (!info.email.trim()) e.email = 'Email is required';
      else if (!EMAIL_RE.test(info.email)) e.email = 'Please enter a valid email address';
      if (!info.phone.trim()) e.phone = 'WhatsApp number is required';
      else if (!isValidPhone(info.phone)) e.phone = 'Use country code format, e.g. +201010294098';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setSuccess(false);
    setApiError('');
    setErrors({});
    setSelection({ level: '', subject: '', sessionType: '', time: '' });
    setSubjectSearch('');
    setInfo(loggedInUser
      ? { name: loggedInUser.name, email: loggedInUser.email, phone: loggedInUser.phone ?? '' }
      : { name: '', email: '', phone: '' });
  };

  const submitBooking = async () => {
    setApiError('');
    if (!validateInfo()) return;

    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;
    const phone = normalizePhone(loggedInUser?.phone ?? info.phone);

    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subjects: [
            {
              subject: selection.subject,
              session: selection.level,
              examSession: `${selection.sessionType} | ${selection.time}`,
            },
          ],
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload?.error || 'Booking request failed');

      addSession({
        id: crypto.randomUUID(),
        studentEmail: email,
        studentName: name,
        subject: selection.subject,
        date: new Date().toISOString().split('T')[0],
        time: selection.time,
        sessionType: selection.sessionType,
        status: 'pending',
        notes: `Level: ${selection.level}`,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressScale = (step - 1) / 3;

  if (success) {
    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;
    const phone = loggedInUser?.phone ?? info.phone;

    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full container-pad">
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
            <p className="text-[#334155] text-sm mb-4">Your guided booking has been received. We will contact you shortly.</p>
            <div className="rounded-xl bg-white border border-brand-grayMuted p-4 text-sm space-y-1 mb-4">
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Name</span>
                <span className="text-brand-navy font-semibold">{name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Email</span>
                <span className="text-brand-navy font-semibold">{email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">WhatsApp</span>
                <span className="text-brand-navy font-semibold">{phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Level</span>
                <span className="text-brand-navy font-semibold">{selection.level}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Subject</span>
                <span className="text-brand-navy font-semibold">{selection.subject}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-[#334155]">Session Type</span>
                <span className="text-brand-navy font-semibold">{selection.sessionType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#334155]">Preferred Time</span>
                <span className="text-brand-navy font-semibold">{selection.time}</span>
              </div>
            </div>
            <button onClick={resetAll} className="btn-primary mt-2 px-6 py-3 text-sm">Book Another Request</button>
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
            Guided Booking <span className="gradient-text">in 4 Steps</span>
          </h1>
          <p className="text-[#334155]">Level, subject, session type, then your preferred time. Simple and fast.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto container-pad">
          <div className="glass rounded-2xl p-5 md:p-8 border border-brand-grayMuted shadow-sm">
            {loggedInUser && (
              <div className="mb-6 flex items-center justify-between rounded-xl bg-brand-green/10 border border-brand-green/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-brand-green text-lg">✓</span>
                  <span className="text-sm text-brand-navy">Booking as <strong>{loggedInUser.name}</strong> ({loggedInUser.email}{loggedInUser.phone ? ` · ${loggedInUser.phone}` : ''})</span>
                </div>
                <Link href="/auth" className="text-xs text-[#64748B] hover:text-brand-orange underline">Not you?</Link>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#64748B] font-medium">Step {step} of 4</p>
              <p className="text-xs text-[#94A3B8]">Your choices stay saved while you continue</p>
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
                <motion.div key="level-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 1: Choose Level</h2>
                  <p className="text-[#334155] text-sm mb-6">Select your current level to unlock relevant subjects.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {LEVEL_OPTIONS.map(level => {
                      const active = selection.level === level;
                      return (
                        <button
                          key={level}
                          onClick={() => setSelection(prev => ({ ...prev, level, subject: '' }))}
                          className={`rounded-xl border px-4 py-4 text-sm font-semibold transition-all ${
                            active
                              ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                              : 'bg-white text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => selection.level && setStep(2)}
                      disabled={!selection.level}
                      className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="subject-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 2: Choose Subject</h2>
                  <p className="text-[#334155] text-sm mb-4">Search and pick one subject for your first session.</p>

                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={e => setSubjectSearch(e.target.value)}
                    placeholder="Search subject (e.g. Physics, Maths)..."
                    className="input-field mb-4"
                  />

                  {subjectsLoading ? (
                    <p className="text-sm text-[#64748B]">Loading subjects...</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSubjects.map(subject => {
                        const active = selection.subject === subject.name;
                        return (
                          <button
                            key={subject.id}
                            onClick={() => setSelection(prev => ({ ...prev, subject: subject.name }))}
                            className={`rounded-xl border p-4 text-left transition-all relative ${
                              active
                                ? 'bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-[0_4px_16px_rgba(242,116,5,0.22)]'
                                : 'bg-white border-brand-grayMuted hover:shadow-lg hover:shadow-brand-navyDeep/10 hover:border-brand-orange/40'
                            }`}
                          >
                            {active && (
                              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                            )}
                            <span className="text-2xl block mb-2">{subject.emoji}</span>
                            <span className="text-brand-navy text-sm font-semibold block">{subject.name}</span>
                            <span className="text-[#334155] text-xs">{subject.tagline}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!subjectsLoading && filteredSubjects.length === 0 && (
                    <p className="text-sm text-[#64748B] mt-2">No subjects found for this search. Try a shorter keyword.</p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => selection.subject && setStep(3)}
                      disabled={!selection.subject}
                      className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="session-type-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 3: Session Type</h2>
                  <p className="text-[#334155] text-sm mb-6">Choose what fits your pace and budget.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {SESSION_TYPES.map(type => {
                      const active = selection.sessionType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelection(prev => ({ ...prev, sessionType: type }))}
                          className={`rounded-xl border p-5 text-left transition-all ${
                            active
                              ? 'bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-[0_4px_16px_rgba(242,116,5,0.22)]'
                              : 'bg-white border-brand-grayMuted hover:border-brand-orange/40'
                          }`}
                        >
                          <p className="text-brand-navy font-semibold text-base">{type}</p>
                          <p className="text-[#64748B] text-sm mt-1">
                            {type === 'Group' ? 'Max 6 students per group with guided pacing.' : '1-to-1 focused support for urgent gaps and faster recovery.'}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => selection.sessionType && setStep(4)}
                      disabled={!selection.sessionType}
                      className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="time-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 4: Preferred Time</h2>
                  <p className="text-[#334155] text-sm mb-5">Pick a quick time option or type your own.</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {TIME_OPTIONS.map(option => {
                      const active = selection.time === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            setSelection(prev => ({ ...prev, time: option }));
                            if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
                          }}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                            active
                              ? 'bg-[#1B2A44] text-white border-[#1B2A44] shadow-md'
                              : 'text-brand-navy border-brand-grayMuted hover:border-[#1B2A44]/50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={selection.time}
                    onChange={e => {
                      setSelection(prev => ({ ...prev, time: e.target.value }));
                      if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
                    }}
                    placeholder="Or type your preferred time"
                    className={`input-field ${errors.time ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
                  />
                  {errors.time && <p className="text-red-400 text-xs mt-1.5">{errors.time}</p>}

                  {!loggedInUser && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <div>
                        <LabeledInput id="fullName" type="text" label="Full Name *" value={info.name} hasError={!!errors.name}
                          onChange={v => { setInfo(prev => ({ ...prev, name: v })); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }} />
                        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                      </div>
                      <div>
                        <LabeledInput id="email" type="email" label="Email Address *" value={info.email} hasError={!!errors.email}
                          onChange={v => { setInfo(prev => ({ ...prev, email: v })); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }} />
                        {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <LabeledInput id="phone" type="tel" label="WhatsApp Number with Country Code *" value={info.phone} hasError={!!errors.phone}
                          onChange={v => { setInfo(prev => ({ ...prev, phone: v })); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }} />
                        {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-brand-grayMuted bg-white p-5 mt-6 mb-5 text-sm">
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Level</span>
                      <span className="text-brand-navy font-semibold">{selection.level}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Subject</span>
                      <span className="text-brand-navy font-semibold">{getSubjectEmoji(selection.subject)} {selection.subject}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Session Type</span>
                      <span className="text-brand-navy font-semibold">{selection.sessionType}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#334155]">Preferred Time</span>
                      <span className="text-brand-navy font-semibold">{selection.time || 'Not selected yet'}</span>
                    </div>
                  </div>

                  {apiError && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={submitBooking} disabled={loading} className="btn-primary px-6 py-3 text-sm">
                      {loading ? 'Sending...' : 'Confirm Booking'}
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
