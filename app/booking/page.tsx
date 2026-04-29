'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { subjects } from '@/lib/subjects';
import { stepSlide } from '@/lib/animations';

type Step = 1 | 2 | 3 | 4;
type SessionOption = 'June / July' | 'October / November' | 'January';

interface BookingState {
  subject: string;
  session: SessionOption | '';
  name: string;
  email: string;
}

const STEP_LABELS = ['Subject', 'Session', 'Your Info', 'Confirm'];
const SESSION_OPTIONS: SessionOption[] = ['June / July', 'October / November', 'January'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field-wrap">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="input-field input-floating"
      />
      <label htmlFor={id} className="field-label">{label}</label>
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

  const [booking, setBooking] = useState<BookingState>({
    subject: '',
    session: '',
    name: '',
    email: '',
  });

  const progressScale = useMemo(() => {
    if (step === 1) return 0;
    if (step === 2) return 0.33;
    if (step === 3) return 0.66;
    return 1;
  }, [step]);

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setSuccess(false);
    setApiError('');
    setErrors({});
    setBooking({ subject: '', session: '', name: '', email: '' });
  };

  const validateInfo = () => {
    const nextErrors: { name?: string; email?: string } = {};

    if (!booking.name.trim()) nextErrors.name = 'Full name is required';
    if (!booking.email.trim()) nextErrors.email = 'Email is required';
    else if (!EMAIL_RE.test(booking.email)) nextErrors.email = 'Please enter a valid email address';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitBooking = async () => {
    setApiError('');

    if (!booking.subject || !booking.session || !validateInfo()) {
      if (!booking.subject) setStep(1);
      else if (!booking.session) setStep(2);
      else setStep(3);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
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
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full container-pad">
          <div className="glass rounded-2xl p-8 border border-brand-green/50 bg-brand-green/10">
            <div className="flex items-center gap-3">
              <motion.svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-brand-green">
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.path
                  d="M7 12.5l3.1 3.1L17.5 8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.22 }}
                />
              </motion.svg>
              <p className="text-brand-success font-semibold text-lg">Booking request sent successfully ✅</p>
            </div>

            <p className="mt-3 text-slate-700 text-sm leading-relaxed">
              Your session request has been received. We will contact you shortly.
            </p>

            <div className="mt-6 rounded-xl bg-white border border-brand-grayMuted p-4 text-sm">
              {[
                ['Subject', booking.subject],
                ['Exam Session', booking.session],
                ['Name', booking.name],
                ['Email', booking.email],
              ].map(([label, value], index) => (
                <div key={label} className={`flex justify-between py-2 ${index < 3 ? 'border-b border-brand-grayMuted' : ''}`}>
                  <span className="text-slate-600">{label}</span>
                  <span className="text-brand-navy font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={resetAll} className="btn-primary mt-6 px-6 py-3 text-sm">Book Another Request</button>
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
          <p className="text-slate-700">Choose your subject, exam session, and submit your request in under one minute.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto container-pad">
          <div className="glass rounded-2xl p-5 md:p-8 border border-brand-grayMuted shadow-sm">
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
                        done
                          ? 'bg-brand-green border-brand-green text-white'
                          : active
                            ? 'bg-brand-orange border-brand-orange text-white'
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
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-brand-orange to-brand-orangeSoft"
                animate={{ scaleX: progressScale }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
              />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="subject-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 1: Select Subject</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => {
                      const selected = booking.subject === subject.name;
                      return (
                        <motion.button
                          key={subject.id}
                          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          onClick={() => {
                            setBooking((prev) => ({ ...prev, subject: subject.name }));
                            setStep(2);
                          }}
                          className={`rounded-xl border p-4 text-left bg-white transition-all duration-200 hover:shadow-lg hover:shadow-brand-navyDeep/15 ${
                            selected ? 'border-brand-orange ring-2 ring-brand-orange/20' : 'border-brand-grayMuted'
                          }`}
                        >
                          <span className="text-2xl block mb-2">{subject.emoji}</span>
                          <span className="text-brand-navy text-sm font-semibold block">{subject.name}</span>
                          <span className="text-slate-600 text-xs">{subject.tagline}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="session-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 2: Select Exam Session</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {SESSION_OPTIONS.map((session) => {
                      const selected = booking.session === session;
                      return (
                        <motion.button
                          key={session}
                          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          animate={selected && !reduceMotion ? { boxShadow: ['0 0 0 0 rgba(242,116,5,0)', '0 0 0 8px rgba(242,116,5,0.12)', '0 0 0 0 rgba(242,116,5,0)'] } : undefined}
                          transition={{ duration: 0.5 }}
                          onClick={() => setBooking((prev) => ({ ...prev, session }))}
                          className={`rounded-xl border px-4 py-6 text-center font-semibold transition-all duration-200 ${
                            selected
                              ? 'bg-brand-orange text-white border-brand-orange'
                              : 'bg-white text-brand-navy border-brand-grayMuted hover:border-brand-orange/60'
                          }`}
                        >
                          {session}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={() => booking.session && setStep(3)} disabled={!booking.session} className="btn-primary px-6 py-3 text-sm disabled:opacity-50">
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="info-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 3: Enter Your Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FloatingInput
                        id="fullName"
                        type="text"
                        label="Full Name *"
                        value={booking.name}
                        onChange={(value) => {
                          setBooking((prev) => ({ ...prev, name: value }));
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                      />
                      {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
                    </div>

                    <div>
                      <FloatingInput
                        id="email"
                        type="email"
                        label="Email *"
                        value={booking.email}
                        onChange={(value) => {
                          setBooking((prev) => ({ ...prev, email: value }));
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                      />
                      {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={() => validateInfo() && setStep(4)} className="btn-primary px-6 py-3 text-sm">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="confirm-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 4: Confirmation</h2>

                  <div className="rounded-xl border border-brand-grayMuted bg-white p-5 mb-5">
                    {[
                      ['Subject', booking.subject],
                      ['Exam Session', booking.session],
                      ['Name', booking.name],
                      ['Email', booking.email],
                    ].map(([label, value], index) => (
                      <div key={label} className={`flex justify-between py-2 ${index < 3 ? 'border-b border-brand-grayMuted' : ''}`}>
                        <span className="text-slate-600 text-sm">{label}</span>
                        <span className="text-brand-navy font-semibold text-sm">{value}</span>
                      </div>
                    ))}
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
