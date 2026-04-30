'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { subjects } from '@/lib/subjects';
import { stepSlide } from '@/lib/animations';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;
type SessionOption = 'Online' | 'Face-to-Face (Private)' | 'WhatsApp Session';

// Each selected subject has its own session choice
interface SubjectSession {
  subject: string;
  session: SessionOption | '';
  emoji: string;
}

interface ContactInfo {
  name: string;
  email: string;
}

interface UserSession {
  name: string;
  email: string;
}

const STEP_LABELS = ['Subjects', 'Sessions', 'Your Info', 'Confirm'];
const SESSION_OPTIONS: SessionOption[] = ['Online', 'Face-to-Face (Private)', 'WhatsApp Session'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LabeledInput({
  id, label, type, value, onChange, hasError,
}: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void; hasError?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#9BAFC8] mb-1.5">{label}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={type === 'email' ? 'your@email.com' : 'Your full name'}
        className={`input-field ${hasError ? 'border-red-500/60 focus:border-red-500/80' : ''}`} />
    </div>
  );
}

export default function BookingPage() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(null);

  // Multi-subject: array of { subject, session, emoji }
  const [selections, setSelections] = useState<SubjectSession[]>([]);
  const [info, setInfo] = useState<ContactInfo>({ name: '', email: '' });

  // Read auth session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('el7a2ny_session');
      if (raw) {
        const user = JSON.parse(raw) as UserSession;
        if (user?.name && user?.email) {
          setLoggedInUser(user);
          setInfo({ name: user.name, email: user.email });
        }
      }
    } catch { /* ignore */ }
  }, []);

  const progressScale = useMemo(() => {
    if (loggedInUser) {
      if (step === 1) return 0;
      if (step === 2) return 0.5;
      return 1;
    }
    if (step === 1) return 0;
    if (step === 2) return 0.33;
    if (step === 3) return 0.66;
    return 1;
  }, [step, loggedInUser]);

  const toggleSubject = (name: string, emoji: string) => {
    setSelections(prev => {
      const exists = prev.find(s => s.subject === name);
      if (exists) return prev.filter(s => s.subject !== name);
      return [...prev, { subject: name, emoji, session: '' }];
    });
  };

  const setSession = (subject: string, session: SessionOption) => {
    setSelections(prev => prev.map(s => s.subject === subject ? { ...s, session } : s));
  };

  const allSessionsFilled = selections.length > 0 && selections.every(s => s.session !== '');

  const validateInfo = () => {
    const e: { name?: string; email?: string } = {};
    if (!info.name.trim()) e.name = 'Full name is required';
    if (!info.email.trim()) e.email = 'Email is required';
    else if (!EMAIL_RE.test(info.email)) e.email = 'Please enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setSuccess(false);
    setApiError('');
    setErrors({});
    setSelections([]);
    setInfo(loggedInUser ? { name: loggedInUser.name, email: loggedInUser.email } : { name: '', email: '' });
  };

  const submitBooking = async () => {
    setApiError('');
    const infoValid = loggedInUser ? true : validateInfo();
    if (!infoValid) { setStep(3); return; }

    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;

    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subjects: selections.map(s => ({ subject: s.subject, session: s.session })) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Booking request failed');
      setSuccess(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;
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
            <p className="text-slate-700 text-sm mb-4">Your session requests have been received. We will contact you shortly.</p>
            <div className="rounded-xl bg-white border border-brand-grayMuted p-4 text-sm space-y-1 mb-4">
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-slate-600">Name</span>
                <span className="text-brand-navy font-semibold">{name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-brand-grayMuted">
                <span className="text-slate-600">Email</span>
                <span className="text-brand-navy font-semibold">{email}</span>
              </div>
              {selections.map((s, i) => (
                <div key={s.subject} className={`flex justify-between py-1 ${i < selections.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                  <span className="text-slate-600">{s.emoji} {s.subject}</span>
                  <span className="text-brand-navy font-semibold">{s.session}</span>
                </div>
              ))}
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
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-widest">Fast Booking</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy mt-3 mb-4">
            IGCSE Booking <span className="gradient-text">in 4 Steps</span>
          </h1>
          <p className="text-slate-700">Pick one or more subjects, choose a session for each, and submit in under a minute.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto container-pad">
          <div className="glass rounded-2xl p-5 md:p-8 border border-brand-grayMuted shadow-sm">

            {/* Logged-in banner */}
            {loggedInUser && (
              <div className="mb-6 flex items-center justify-between rounded-xl bg-brand-green/10 border border-brand-green/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-brand-green text-lg">✓</span>
                  <span className="text-sm text-brand-navy">Booking as <strong>{loggedInUser.name}</strong> ({loggedInUser.email})</span>
                </div>
                <Link href="/auth" className="text-xs text-slate-500 hover:text-brand-orange underline">Not you?</Link>
              </div>
            )}

            {/* Step indicators */}
            <div className="flex items-center gap-0 mb-6">
              {STEP_LABELS.map((label, index) => {
                const current = (index + 1) as Step;
                // Hide step 3 indicator when logged in
                if (loggedInUser && current === 3) return null;
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
                          : 'bg-white border-brand-grayMuted text-slate-500'
                      }`}
                    >
                      {done ? '✓' : current}
                    </motion.div>
                    <span className={`text-xs mt-1.5 hidden sm:block ${active ? 'text-brand-navy' : 'text-slate-500'}`}>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-1.5 bg-brand-grayMuted/60 rounded-full overflow-hidden mb-8">
              <motion.div className="h-full origin-left bg-gradient-to-r from-brand-orange to-brand-orangeSoft"
                animate={{ scaleX: progressScale }} transition={{ duration: 0.26, ease: 'easeOut' }} />
            </div>

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Pick subjects ── */}
              {step === 1 && (
                <motion.div key="subject-step" {...stepSlide}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-brand-navy font-bold text-xl">Step 1: Select Subjects</h2>
                    {selections.length > 0 && (
                      <span className="text-xs bg-brand-orange text-white rounded-full px-2.5 py-1 font-semibold">
                        {selections.length} selected
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-5">You can select multiple subjects. Tap a subject to select or deselect it.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => {
                      const selected = selections.some(s => s.subject === subject.name);
                      return (
                        <motion.button
                          key={subject.id}
                          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                          onClick={() => toggleSubject(subject.name, subject.emoji)}
                          className={`rounded-xl border p-4 text-left transition-all duration-200 relative ${
                            selected
                              ? 'bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-[0_4px_16px_rgba(242,116,5,0.22)]'
                              : 'bg-white border-brand-grayMuted hover:shadow-lg hover:shadow-brand-navyDeep/10 hover:border-brand-orange/40'
                          }`}
                        >
                          {selected && (
                            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">✓</span>
                          )}
                          <span className="text-2xl block mb-2">{subject.emoji}</span>
                          <span className="text-brand-navy text-sm font-semibold block">{subject.name}</span>
                          <span className="text-slate-600 text-xs">{subject.tagline}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => selections.length > 0 && setStep(2)}
                      disabled={selections.length === 0}
                      className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
                    >
                      Continue with {selections.length || ''} Subject{selections.length !== 1 ? 's' : ''}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Pick session per subject ── */}
              {step === 2 && (
                <motion.div key="session-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 2: Select Session per Subject</h2>
                  <p className="text-slate-600 text-sm mb-6">Choose how you&apos;d like to have each session.</p>
                  <div className="space-y-6">
                    {selections.map(sel => (
                      <div key={sel.subject} className="rounded-xl border border-brand-grayMuted bg-white p-4">
                        <p className="text-brand-navy font-semibold mb-3">{sel.emoji} {sel.subject}</p>
                        <div className="grid grid-cols-3 gap-3">
                          {SESSION_OPTIONS.map(session => {
                            const active = sel.session === session;
                            return (
                              <motion.button
                                key={session}
                                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                                onClick={() => setSession(sel.subject, session)}
                                className={`rounded-lg border px-2 py-3 text-center text-sm font-medium transition-all duration-200 ${
                                  active
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                    : 'text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                                }`}
                              >
                                {session}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => allSessionsFilled && setStep(loggedInUser ? 4 : 3)}
                      disabled={!allSessionsFilled}
                      className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Contact info (skip if logged in) ── */}
              {step === 3 && !loggedInUser && (
                <motion.div key="info-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 3: Enter Your Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <LabeledInput id="fullName" type="text" label="Full Name *" value={info.name} hasError={!!errors.name}
                        onChange={v => { setInfo(p => ({ ...p, name: v })); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }} />
                      {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                    </div>
                    <div>
                      <LabeledInput id="email" type="email" label="Email Address *" value={info.email} hasError={!!errors.email}
                        onChange={v => { setInfo(p => ({ ...p, email: v })); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }} />
                      {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={() => validateInfo() && setStep(4)} className="btn-primary px-6 py-3 text-sm">Continue</button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Confirm ── */}
              {step === 4 && (
                <motion.div key="confirm-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 4: Confirmation</h2>
                  <div className="rounded-xl border border-brand-grayMuted bg-white p-5 mb-5 text-sm">
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-slate-600">Name</span>
                      <span className="text-brand-navy font-semibold">{loggedInUser?.name ?? info.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-slate-600">Email</span>
                      <span className="text-brand-navy font-semibold">{loggedInUser?.email ?? info.email}</span>
                    </div>
                    {selections.map((s, i) => (
                      <div key={s.subject} className={`flex justify-between py-2 ${i < selections.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                        <span className="text-slate-600">{s.emoji} {s.subject}</span>
                        <span className="text-brand-navy font-semibold">{s.session}</span>
                      </div>
                    ))}
                  </div>

                  {apiError && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(loggedInUser ? 2 : 3)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={submitBooking} disabled={loading} className="btn-primary px-6 py-3 text-sm">
                      {loading ? 'Sending...' : `Confirm ${selections.length} Booking${selections.length > 1 ? 's' : ''}`}
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
