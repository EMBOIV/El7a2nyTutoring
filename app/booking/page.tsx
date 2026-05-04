'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stepSlide } from '@/lib/animations';
import { EDUCATION_SYSTEMS, subjects as allSubjects } from '@/lib/subjects';
import type { EducationSystem } from '@/lib/subjects';
import { useLang } from '@/components/ui/LanguageProvider';

interface Country { code: string; name: string; flag: string }
const COUNTRIES: Country[] = [
  { code: '+20',  name: 'Egypt',        flag: '\U0001f1ea\U0001f1ec' },
  { code: '+966', name: 'Saudi Arabia', flag: '\U0001f1f8\U0001f1e6' },
  { code: '+971', name: 'UAE',          flag: '\U0001f1e6\U0001f1ea' },
  { code: '+965', name: 'Kuwait',       flag: '\U0001f1f0\U0001f1fc' },
  { code: '+974', name: 'Qatar',        flag: '\U0001f1f6\U0001f1e6' },
  { code: '+973', name: 'Bahrain',      flag: '\U0001f1e7\U0001f1ed' },
  { code: '+968', name: 'Oman',         flag: '\U0001f1f4\U0001f1f2' },
  { code: '+962', name: 'Jordan',       flag: '\U0001f1ef\U0001f1f4' },
  { code: '+961', name: 'Lebanon',      flag: '\U0001f1f1\U0001f1e7' },
  { code: '+44',  name: 'UK',           flag: '\U0001f1ec\U0001f1e7' },
  { code: '+1',   name: 'USA / Canada', flag: '\U0001f1fa\U0001f1f8' },
  { code: '+49',  name: 'Germany',      flag: '\U0001f1e9\U0001f1ea' },
  { code: '+33',  name: 'France',       flag: '\U0001f1eb\U0001f1f7' },
  { code: '+61',  name: 'Australia',    flag: '\U0001f1e6\U0001f1fa' },
];

function detectCountry(phone: string): Country | null {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (/^0?1[0-5]/.test(digits)) return COUNTRIES.find(c => c.code === '+20') ?? null;
  if (/^0?5/.test(digits) && digits.length >= 3) return COUNTRIES.find(c => c.code === '+966') ?? null;
  return null;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface FormState {
  name: string; phone: string; countryCode: string;
  system: EducationSystem | ''; selectedSubjects: string[];
  date: string; time: string; notes: string;
  email: string;
}

const TIMES = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const STEP_COUNT = 5;

function StepIndicator({ step, labels }: { step: Step; labels: string[] }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {labels.map((label, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done   = idx < step;
        return (
          <div key={idx} className="flex items-center gap-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${done ? 'bg-brand-orange text-white' : active ? 'bg-[#1B2A44] text-white ring-4 ring-[#1B2A44]/10' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
              {done ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : idx}
            </div>
            <span className={`hidden sm:block text-xs font-medium ${active ? 'text-[#1B2A44]' : 'text-[#94A3B8]'}`}>{label}</span>
            {idx < STEP_COUNT && <div className={`w-4 sm:w-8 h-0.5 ${done ? 'bg-brand-orange' : 'bg-[#E2E8F0]'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingPage() {
  const { t, isRTL } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({ name:'', phone:'', countryCode:'+20', system:'', selectedSubjects:[], date:'', time:'', notes:'', email:'' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'general', string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const stepLabels = [t.booking.step1, t.booking.step2, t.booking.step3, t.booking.step4, t.booking.step5];

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  useEffect(() => {
    const detected = detectCountry(form.phone);
    if (detected && detected.code !== form.countryCode) setForm(f => ({ ...f, countryCode: detected.code }));
  }, [form.phone]);

  const subjectsForSystem = useMemo(() => form.system ? allSubjects.filter(s => s.system === form.system) : [], [form.system]);
  const selectedCountry = COUNTRIES.find(c => c.code === form.countryCode) ?? COUNTRIES[0];

  function validateStep(s: Step): boolean {
    const e: typeof errors = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = t.booking.nameRequired;
      if (!form.phone.trim()) e.phone = t.booking.phoneRequired;
      else if (form.phone.trim().replace(/\D/g,'').length < 6) e.phone = t.booking.phoneInvalid;
    }
    if (s === 2) {
      if (!form.system) e.system = t.booking.systemRequired;
      if (form.selectedSubjects.length === 0) e.selectedSubjects = t.booking.subjectsRequired;
    }
    if (s === 3) {
      if (!form.date) e.date = t.booking.dateRequired;
      if (!form.time) e.time = t.booking.timeRequired;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (!validateStep(step)) return; if (step < STEP_COUNT) setStep(s => (s + 1) as Step); }
  function back() { if (step > 1) setStep(s => (s - 1) as Step); }

  function toggleSubject(name: string) {
    setForm(f => ({ ...f, selectedSubjects: f.selectedSubjects.includes(name) ? f.selectedSubjects.filter(x => x !== name) : [...f.selectedSubjects, name] }));
  }

  async function submit() {
    setErrors({});
    setLoading(true);
    try {
      const rawPhone = form.phone.replace(/^0/, '');
      const fullPhone = `${form.countryCode}${rawPhone}`;
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phone: fullPhone,
          system: form.system,
          subjects: form.selectedSubjects.map(s => ({ subject: s, session: form.system })),
          preferredDate: form.date,
          preferredTime: form.time,
          notes: form.notes.trim() || undefined,
        }),
      });
      const payload = await res.json() as { error?: string };
      if (!res.ok) throw new Error(payload?.error ?? 'Booking failed');
      setSuccess(true);
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : t.common.error });
    } finally {
      setLoading(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[70px] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E]/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1B2A44] mb-3">{t.booking.successTitle}</h1>
          <p className="text-[#64748B] text-lg leading-relaxed mb-8">{t.booking.successMsg}</p>
          <button onClick={() => { setSuccess(false); setStep(1); setForm({ name:'', phone:'', countryCode:'+20', system:'', selectedSubjects:[], date:'', time:'', notes:'', email:'' }); }} className="btn-ghost px-6 py-3 text-sm">
            {t.booking.bookAnother}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[70px] pb-24 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-xl mx-auto">
        <div className="text-center pt-10 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Free Session</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A44] mb-2">{t.booking.title}</h1>
            <p className="text-[#64748B]">{t.booking.subtitle}</p>
          </motion.div>
        </div>

        <StepIndicator step={step} labels={stepLabels} />

        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_4px_24px_rgba(27,42,68,0.08)] overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" {...stepSlide} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-bold text-[#1B2A44]">{t.booking.step1}</h2>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t.booking.fullName} <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t.booking.fullNamePlaceholder} className={`input-field ${errors.name ? 'border-red-500/60' : ''}`} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t.booking.phoneNumber} <span className="text-red-400">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button type="button" onClick={() => setCountryOpen(o => !o)} className="h-[46px] px-3 flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1B2A44] hover:border-[#CBD5E1] transition-colors whitespace-nowrap">
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <AnimatePresence>
                        {countryOpen && (
                          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute top-full mt-1 left-0 z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-y-auto max-h-52 min-w-[190px]">
                            {COUNTRIES.map(c => (
                              <button key={c.code} type="button" onClick={() => { setForm(f => ({ ...f, countryCode: c.code })); setCountryOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-[#F8FAFC] transition-colors ${c.code === form.countryCode ? 'text-brand-orange font-medium bg-brand-orange/5' : 'text-[#334155]'}`}>
                                <span className="text-base">{c.flag}</span>
                                <span className="font-medium">{c.code}</span>
                                <span className="text-[#64748B] text-xs">{c.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder={t.booking.phonePlaceholder} className={`input-field flex-1 ${errors.phone ? 'border-red-500/60' : ''}`} />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  <p className="text-[#94A3B8] text-xs mt-1.5">{selectedCountry.flag} {selectedCountry.name} ({selectedCountry.code}) \u2014 auto-detected</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" {...stepSlide} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-bold text-[#1B2A44]">{t.booking.step2}</h2>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">{t.booking.selectSystem} <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {EDUCATION_SYSTEMS.map(sys => (
                      <button key={sys.id} type="button" onClick={() => setForm(f => ({ ...f, system: sys.id, selectedSubjects: [] }))} className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${form.system === sys.id ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/20' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'}`}>
                        <span className="text-2xl mt-0.5 flex-shrink-0">{sys.emoji}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold leading-tight ${form.system === sys.id ? 'text-brand-orange' : 'text-[#1B2A44]'}`}>{sys.label}</p>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-tight line-clamp-2">{sys.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.system && <p className="text-red-400 text-xs mt-1">{errors.system}</p>}
                </div>
                {form.system && (
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-1">{t.booking.selectSubjects} <span className="text-red-400">*</span></label>
                    <p className="text-xs text-[#94A3B8] mb-2">{t.booking.multipleAllowed}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                      {subjectsForSystem.map(s => {
                        const selected = form.selectedSubjects.includes(s.name);
                        return (
                          <button key={s.id} type="button" onClick={() => toggleSubject(s.name)} className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 ${selected ? 'border-brand-orange bg-brand-orange/5' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'}`}>
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${selected ? 'bg-brand-orange border-brand-orange' : 'border-[#CBD5E1]'}`}>
                              {selected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <span className="text-lg flex-shrink-0">{s.emoji}</span>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium leading-tight truncate ${selected ? 'text-brand-orange' : 'text-[#1B2A44]'}`}>{s.name}</p>
                              <p className="text-xs text-[#94A3B8] truncate">{s.tagline}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.selectedSubjects && <p className="text-red-400 text-xs mt-1">{errors.selectedSubjects}</p>}
                    {form.selectedSubjects.length > 0 && <p className="text-brand-orange text-xs mt-2 font-medium">{form.selectedSubjects.length} subject{form.selectedSubjects.length !== 1 ? 's' : ''} selected</p>}
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" {...stepSlide} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-bold text-[#1B2A44]">{t.booking.step3}</h2>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t.booking.preferredDate} <span className="text-red-400">*</span></label>
                  <input type="date" value={form.date} min={today} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={`input-field ${errors.date ? 'border-red-500/60' : ''}`} />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">{t.booking.preferredTime} <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIMES.map(time => (
                      <button key={time} type="button" onClick={() => setForm(f => ({ ...f, time }))} className={`py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${form.time === time ? 'bg-brand-orange text-white border-brand-orange' : 'border-[#E2E8F0] text-[#64748B] hover:border-brand-orange/40 hover:text-[#1B2A44]'}`}>{time}</button>
                    ))}
                  </div>
                  {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t.booking.notes}</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder={t.booking.notesPlaceholder} rows={3} className="input-field resize-none" />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" {...stepSlide} className="p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#1B2A44]">{t.booking.reviewTitle}</h2>
                <div className="divide-y divide-[#F1F5F9]">
                  {[
                    { label: t.booking.name, value: form.name },
                    { label: t.booking.phone, value: `${form.countryCode} ${form.phone}` },
                    { label: t.booking.system, value: EDUCATION_SYSTEMS.find(s => s.id === form.system)?.label ?? form.system },
                    { label: t.booking.subjects, value: form.selectedSubjects.join(', ') },
                    { label: t.booking.date, value: form.date },
                    { label: t.booking.time, value: form.time },
                    ...(form.notes ? [{ label: t.booking.notes, value: form.notes }] : []),
                  ].map(row => (
                    <div key={row.label} className="flex gap-3 py-3">
                      <span className="text-sm text-[#94A3B8] font-medium w-24 flex-shrink-0">{row.label}</span>
                      <span className="text-sm text-[#1B2A44] font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" {...stepSlide} className="p-6 sm:p-8 space-y-5">
                <h2 className="text-lg font-bold text-[#1B2A44]">{t.booking.step5}</h2>
                <p className="text-sm text-[#64748B]">Leave your email to receive a booking confirmation. This step is optional.</p>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1.5">{t.booking.email}</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t.booking.emailPlaceholder} className="input-field" />
                </div>
                {errors.general && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{errors.general}</div>}
                <button type="button" onClick={submit} disabled={loading} className="btn-primary w-full py-4 text-sm font-semibold disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Sending...
                    </span>
                  ) : t.booking.submitBooking}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`px-6 sm:px-8 pb-6 flex items-center ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button onClick={back} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1B2A44] font-medium transition-colors">
                <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                {t.booking.back}
              </button>
            )}
            {step < STEP_COUNT && (
              <button onClick={next} className="btn-primary px-7 py-2.5 text-sm font-semibold inline-flex items-center gap-1.5">
                {t.booking.next}
                <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
