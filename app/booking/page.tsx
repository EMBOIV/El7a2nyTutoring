'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { stepSlide } from '@/lib/animations';
import {
  addSession,
  getSessions,
  getRoleForEmail,
  getUsers,
  isValidPhone,
  normalizeEmail,
  normalizePhone,
  saveSession,
  saveUsers,
} from '@/lib/auth';
import type { AppUser } from '@/lib/auth';
import { subjects } from '@/lib/subjects';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;
type LevelOption = 'OL' | 'AS' | 'A2' | 'AL';
type ExamType = 'Cambridge' | 'Edexcel';
type ExamSession = 'Jan/Feb 2025' | 'May/Jun 2025' | 'Oct/Nov 2025' | 'Jan/Feb 2026' | 'May/Jun 2026' | 'Oct/Nov 2026' | 'Jan/Feb 2027' | 'May/Jun 2027';

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

interface SubjectSelection {
  subject: string;
  emoji: string;
  level: LevelOption | '';
  examType: ExamType | '';
  examSession: ExamSession | '';
}

const STEP_LABELS = ['Subjects', 'Session Setup', 'Your Info', 'Review'];
const LEVEL_OPTIONS: LevelOption[] = ['OL', 'AS', 'A2', 'AL'];
const EXAM_TYPES: ExamType[] = ['Cambridge', 'Edexcel'];
const EXAM_SESSIONS: ExamSession[] = ['Jan/Feb 2025', 'May/Jun 2025', 'Oct/Nov 2025', 'Jan/Feb 2026', 'May/Jun 2026', 'Oct/Nov 2026', 'Jan/Feb 2027', 'May/Jun 2027'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const [loggedInUser, setLoggedInUser] = useState<UserSession | null>(null);
  const [info, setInfo] = useState<ContactInfo>({ name: '', email: '', phone: '' });

  const [subjectOptions, setSubjectOptions] = useState<SubjectItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSelection[]>([]);

  const [signupPassword, setSignupPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

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
      // Ignore invalid session payload.
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    void (async () => {
      setSubjectsLoading(true);
      try {
        const response = await fetch('/api/subjects');
        const payload = (await response.json()) as { subjects?: SubjectItem[] };
        if (response.ok && Array.isArray(payload.subjects)) {
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

    const level: LevelOption | '' = preLevel === 'OL' || preLevel === 'AS' || preLevel === 'A2' || preLevel === 'AL' ? preLevel : '';

    setSelectedSubjects(prev => {
      if (prev.some(item => item.subject === matched.name)) return prev;
      return [{ subject: matched.name, emoji: matched.emoji, level, examType: '', examSession: '' }];
    });
  }, [searchParams]);

  const categories = useMemo(() => {
    const values = new Set(subjectOptions.map(subject => subject.category || 'General'));
    return ['All', ...Array.from(values)];
  }, [subjectOptions]);

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subjectOptions.filter(subject => {
      const category = subject.category || 'General';
      if (activeCategory !== 'All' && category !== activeCategory) return false;
      if (!q) return true;
      return `${subject.name} ${subject.tagline} ${category}`.toLowerCase().includes(q);
    });
  }, [subjectOptions, search, activeCategory]);

  const selectedCount = selectedSubjects.length;
  const configuredAll = selectedSubjects.length > 0 && selectedSubjects.every(subject => subject.level && subject.examType && subject.examSession);

  const progressScale = (step - 1) / 3;

  const toggleSubject = (subject: SubjectItem) => {
    setSelectedSubjects(prev => {
      const exists = prev.find(item => item.subject === subject.name);
      if (exists) return prev.filter(item => item.subject !== subject.name);
      // Single subject booking only.
      return [{ subject: subject.name, emoji: subject.emoji, level: '', examType: '', examSession: '' }];
    });
  };

  const updateSubjectSelection = (subjectName: string, patch: Partial<SubjectSelection>) => {
    setSelectedSubjects(prev => prev.map(item => item.subject === subjectName ? { ...item, ...patch } : item));
  };

  const validateInfo = () => {
    const e: { name?: string; email?: string; phone?: string } = {};
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

  const submitBooking = async () => {
    setApiError('');
    if (!validateInfo()) {
      setStep(3);
      return;
    }

    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;
    const phone = normalizePhone(loggedInUser?.phone ?? info.phone);

    const duplicatePending = getSessions().some(existing => {
      if (existing.status !== 'pending') return false;
      if (normalizeEmail(existing.studentEmail) !== normalizeEmail(email)) return false;
      return selectedSubjects.some(subject => {
        const expectedNotes = `Level: ${subject.level} | Exam Type: ${subject.examType} | Exam Session: ${subject.examSession}`;
        return existing.subject === subject.subject && existing.notes === expectedNotes;
      });
    });

    if (duplicatePending) {
      setApiError('You already have this session pending. Please wait for confirmation or rejection before booking it again.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subjects: selectedSubjects.map(subject => ({
            subject: subject.subject,
            session: subject.level,
            examSession: `${subject.examType} | ${subject.examSession}`,
          })),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload?.error || 'Booking request failed');

      const today = new Date().toISOString().split('T')[0];
      selectedSubjects.forEach(subject => {
        addSession({
          id: crypto.randomUUID(),
          studentEmail: email,
          studentName: name,
          subject: subject.subject,
          date: today,
          time: '',
          sessionType: 'Online',
          status: 'pending',
          notes: `Level: ${subject.level} | Exam Type: ${subject.examType} | Exam Session: ${subject.examSession}`,
          createdAt: new Date().toISOString(),
        });
      });

      setSuccess(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createOptionalAccount = async () => {
    if (loggedInUser) return;

    setSignupError('');
    if (signupPassword.trim().length < 8) {
      setSignupError('Use at least 8 characters for your password.');
      return;
    }

    const normalizedEmailValue = normalizeEmail(info.email);
    const normalizedPhoneValue = normalizePhone(info.phone);
    const users = getUsers();
    const exists = users.find(user => user.email === normalizedEmailValue || normalizePhone(user.phone) === normalizedPhoneValue);

    if (exists) {
      setSignupError('You already have an account with this email or phone. Use Sign In.');
      return;
    }

    setSignupLoading(true);
    try {
      const role = getRoleForEmail(normalizedEmailValue);
      const newUser: AppUser = {
        name: info.name.trim(),
        email: normalizedEmailValue,
        phone: normalizedPhoneValue,
        password: signupPassword,
        role,
      };

      saveUsers([...users, newUser]);
      saveSession({ name: newUser.name, email: newUser.email, phone: newUser.phone, role });

      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser.name, email: newUser.email, phone: newUser.phone }),
      }).catch(() => {});

      setSignupSuccess(true);
      setLoggedInUser({ name: newUser.name, email: newUser.email, phone: newUser.phone });
    } finally {
      setSignupLoading(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setLoading(false);
    setSuccess(false);
    setApiError('');
    setErrors({});
    setSearch('');
    setActiveCategory('All');
    setSelectedSubjects([]);
    setSignupPassword('');
    setSignupError('');
    setSignupSuccess(false);
    setInfo(loggedInUser
      ? { name: loggedInUser.name, email: loggedInUser.email, phone: loggedInUser.phone ?? '' }
      : { name: '', email: '', phone: '' });
  };

  if (success) {
    const name = loggedInUser?.name ?? info.name;
    const email = loggedInUser?.email ?? info.email;
    const phone = loggedInUser?.phone ?? info.phone;

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
              {selectedSubjects.map((subject, index) => (
                <div key={subject.subject} className={`py-1 ${index < selectedSubjects.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                  <div className="flex justify-between">
                    <span className="text-[#334155]">{subject.emoji} {subject.subject}</span>
                    <span className="text-brand-navy font-semibold">{subject.level}</span>
                  </div>
                  <div className="flex justify-end text-xs text-[#64748B]">{subject.examType} • {subject.examSession}</div>
                </div>
              ))}
            </div>

            {!loggedInUser && (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-4">
                <p className="text-brand-navy font-semibold text-sm">Save your details for next time (Optional)</p>
                <p className="text-[#64748B] text-xs mt-1 mb-3">
                  Create a password to turn this booking into an account. Your data stays private and is only used for your tutoring journey.
                </p>

                {signupSuccess ? (
                  <p className="text-sm text-brand-green font-medium">Account created successfully. You can now sign in anytime.</p>
                ) : (
                  <>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      placeholder="Create password (min 8 chars)"
                      className="input-field"
                    />
                    {signupError && <p className="text-red-500 text-xs mt-2">{signupError}</p>}
                    <button
                      onClick={createOptionalAccount}
                      disabled={signupLoading}
                      className="btn-primary mt-3 px-5 py-2.5 text-sm"
                    >
                      {signupLoading ? 'Saving...' : 'Save My Details Securely'}
                    </button>
                  </>
                )}
              </div>
            )}

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
            Subject-First Booking <span className="gradient-text">in 4 Steps</span>
          </h1>
          <p className="text-[#334155]">Choose subjects first, then configure each one quickly without long scrolling.</p>
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
                <motion.div key="subjects-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 1: Choose Subjects</h2>
                  <p className="text-[#334155] text-sm mb-4">Pick one subject. Use search + category filters for speed.</p>

                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search subjects quickly..."
                    className="input-field mb-3"
                  />

                  <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          activeCategory === category
                            ? 'bg-brand-orange text-white border-brand-orange'
                            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-brand-orange/40'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {selectedCount > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {selectedSubjects.map(subject => (
                        <span key={subject.subject} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-orange/10 text-brand-navy border border-brand-orange/20">
                          {subject.emoji} {subject.subject}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="max-h-[360px] overflow-y-auto pr-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjectsLoading ? (
                      <p className="text-sm text-[#64748B]">Loading subjects...</p>
                    ) : (
                      filteredSubjects.map(subject => {
                        const active = selectedSubjects.some(item => item.subject === subject.name);
                        return (
                          <button
                            key={subject.id}
                            onClick={() => toggleSubject(subject)}
                            className={`rounded-xl border p-4 text-left transition-all relative ${
                              active
                                ? 'bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-[0_4px_16px_rgba(242,116,5,0.22)]'
                                : 'bg-white border-brand-grayMuted hover:border-brand-orange/40'
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
                      })
                    )}
                  </div>

                  {!subjectsLoading && filteredSubjects.length === 0 && (
                    <p className="text-sm text-[#64748B] mt-2">No subjects match that search.</p>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => selectedCount > 0 && setStep(2)}
                      disabled={selectedCount === 0}
                      className="btn-primary px-8 py-3 text-sm disabled:opacity-40"
                    >
                      Continue with {selectedCount} Subject
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="setup-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-2">Step 2: Setup Each Subject</h2>
                  <p className="text-[#334155] text-sm mb-6">Set level, exam type, and exam session for each selected subject.</p>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {selectedSubjects.map(subject => (
                      <div key={subject.subject} className="rounded-xl border border-brand-grayMuted bg-white p-4">
                        <p className="text-brand-navy font-semibold mb-3">{subject.emoji} {subject.subject}</p>

                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">Level</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {LEVEL_OPTIONS.map(level => {
                            const active = subject.level === level;
                            return (
                              <button
                                key={level}
                                onClick={() => updateSubjectSelection(subject.subject, { level })}
                                className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition-all ${
                                  active
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                    : 'text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                                }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">Exam Type</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {EXAM_TYPES.map(examType => {
                            const active = subject.examType === examType;
                            return (
                              <button
                                key={examType}
                                onClick={() => updateSubjectSelection(subject.subject, { examType })}
                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                                  active
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                                    : 'text-brand-navy border-brand-grayMuted hover:border-brand-orange/50'
                                }`}
                              >
                                {examType}
                              </button>
                            );
                          })}
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
                          {EXAM_SESSIONS.map(examSession => (
                            <option key={examSession} value={examSession}>{examSession}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button
                      onClick={() => configuredAll && setStep(3)}
                      disabled={!configuredAll}
                      className="btn-primary px-6 py-3 text-sm disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="info-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 3: Your Details</h2>

                  {loggedInUser ? (
                    <div className="rounded-xl border border-brand-grayMuted bg-white p-4">
                      <p className="text-sm text-[#334155] mb-2">You are already signed in. We will use your saved details.</p>
                      <p className="text-sm text-brand-navy font-medium">{loggedInUser.name} · {loggedInUser.email}{loggedInUser.phone ? ` · ${loggedInUser.phone}` : ''}</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <LabeledInput id="fullName" type="text" label="Full Name *" value={info.name} hasError={!!errors.name}
                          onChange={value => { setInfo(prev => ({ ...prev, name: value })); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }} />
                        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                      </div>
                      <div>
                        <LabeledInput id="email" type="email" label="Email Address *" value={info.email} hasError={!!errors.email}
                          onChange={value => { setInfo(prev => ({ ...prev, email: value })); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })); }} />
                        {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <LabeledInput id="phone" type="tel" label="WhatsApp Number with Country Code *" value={info.phone} hasError={!!errors.phone}
                          onChange={value => { setInfo(prev => ({ ...prev, phone: value })); if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined })); }} />
                        {errors.phone && <p className="text-red-400 text-xs mt-1.5">{errors.phone}</p>}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 text-sm">Back</button>
                    <button onClick={() => (loggedInUser || validateInfo()) && setStep(4)} className="btn-primary px-6 py-3 text-sm">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="review-step" {...stepSlide}>
                  <h2 className="text-brand-navy font-bold text-xl mb-4">Step 4: Review & Submit</h2>
                  <div className="rounded-xl border border-brand-grayMuted bg-white p-5 mb-5 text-sm">
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Name</span>
                      <span className="text-brand-navy font-semibold">{loggedInUser?.name ?? info.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">Email</span>
                      <span className="text-brand-navy font-semibold">{loggedInUser?.email ?? info.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-brand-grayMuted">
                      <span className="text-[#334155]">WhatsApp</span>
                      <span className="text-brand-navy font-semibold">{loggedInUser?.phone ?? info.phone}</span>
                    </div>
                    {selectedSubjects.map((subject, index) => (
                      <div key={subject.subject} className={`py-2 ${index < selectedSubjects.length - 1 ? 'border-b border-brand-grayMuted' : ''}`}>
                        <div className="flex justify-between">
                          <span className="text-[#334155]">{subject.emoji} {subject.subject}</span>
                          <span className="text-brand-navy font-semibold">{subject.level}</span>
                        </div>
                        <div className="flex justify-end mt-0.5">
                          <span className="text-xs text-[#64748B]">{subject.examType} • {subject.examSession}</span>
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
