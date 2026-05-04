'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getRoleForEmail,
  getUsers,
  saveUsers,
  saveSession,
  getInitials,
  isEmail,
  isPhone,
  isValidEmail,
  isValidPhone,
  normalizeEmail,
  normalizePhone,
} from '@/lib/auth';
import type { AppUser } from '@/lib/auth';

type Tab = 'login' | 'signup';

interface LoginForm  { identifier: string; password: string }
interface SignupForm { name: string; email: string; phone: string; password: string; confirm: string }

function LoginFormComp({ onSuccess }: { onSuccess: (name: string, email: string) => void }) {
  const [form, setForm] = useState<LoginForm>({ identifier: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<LoginForm> = {};
    if (!form.identifier) {
      e.identifier = 'Email or phone required';
    } else if (!isEmail(form.identifier) && !isPhone(form.identifier)) {
      e.identifier = 'Enter a valid email or WhatsApp number with country code (e.g. +201010294098)';
    }
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const identifier = form.identifier.trim();
    const byEmail = isEmail(identifier);
    const normalizedIdentifier = byEmail ? normalizeEmail(identifier) : normalizePhone(identifier);
    const users = getUsers();
    const found = users.find(u => (byEmail ? u.email === normalizedIdentifier : normalizePhone(u.phone) === normalizedIdentifier) && u.password === form.password);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    if (!found) {
      setErrors({ password: 'Invalid email/phone or password' });
      return;
    }
    const role = getRoleForEmail(found.email);
    saveSession({ name: found.name, email: found.email, phone: found.phone, role });
    onSuccess(found.name, found.email);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <label className="text-[#334155] text-sm font-medium block mb-1.5">Email or WhatsApp Number</label>
        <input type="text" placeholder="your@email.com or +201010294098" className={`input-field ${errors.identifier ? 'border-red-500/60' : ''}`}
          value={form.identifier} onChange={e => setForm(f => ({ ...f, identifier: e.target.value }))} />
        {errors.identifier && <p className="text-red-400 text-xs mt-1">{errors.identifier}</p>}
      </div>
      <div>
        <label className="text-[#334155] text-sm font-medium block mb-1.5">Password</label>
        <input type="password" placeholder="••••••••" className={`input-field ${errors.password ? 'border-red-500/60' : ''}`}
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
      </div>
      <div className="flex justify-end">
        <a href="#" className="text-brand-orange text-xs hover:text-brand-orangeSoft">Forgot password?</a>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

function SignupFormComp({ onSuccess }: { onSuccess: (name: string, email: string) => void }) {
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<SignupForm> = {};
    if (!form.name) e.name = 'Name required';
    if (!form.email) e.email = 'Email required';
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone) e.phone = 'WhatsApp number required';
    else if (!isValidPhone(form.phone)) e.phone = 'Use country code format, e.g. +201010294098';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const users = getUsers();
    const normalizedEmail = normalizeEmail(form.email);
    const normalizedPhone = normalizePhone(form.phone);
    const exists = users.find(u => u.email === normalizedEmail || normalizePhone(u.phone) === normalizedPhone);
    if (exists) {
      setErrors({ email: 'An account with this email or phone already exists' });
      setLoading(false);
      return;
    }
    const role = getRoleForEmail(normalizedEmail);
    const newUser: AppUser = {
      name: form.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: form.password,
      role,
    };
    saveUsers([...users, newUser]);
    saveSession({ name: form.name.trim(), email: normalizedEmail, phone: normalizedPhone, role });
    // Send welcome email (fire and forget)
    fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.trim(), email: normalizedEmail, phone: normalizedPhone }),
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onSuccess(form.name, form.email);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {[
        { key: 'name',     label: 'Full Name',        type: 'text',     ph: 'Your name' },
        { key: 'email',    label: 'Email',             type: 'email',    ph: 'your@email.com' },
        { key: 'phone',    label: 'WhatsApp Number',   type: 'tel',      ph: '+201010294098' },
        { key: 'password', label: 'Password',          type: 'password', ph: '••••••••' },
        { key: 'confirm',  label: 'Confirm Password',  type: 'password', ph: '••••••••' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-[#334155] text-sm font-medium block mb-1.5">{f.label}</label>
          <input
            type={f.type}
            placeholder={f.ph}
            className={`input-field ${errors[f.key as keyof SignupForm] ? 'border-red-500/60' : ''}`}
            value={form[f.key as keyof SignupForm]}
            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
          />
          {errors[f.key as keyof SignupForm] && (
            <p className="text-red-400 text-xs mt-1">{errors[f.key as keyof SignupForm]}</p>
          )}
        </div>
      ))}
      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm mt-2">
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [successUser, setSuccessUser] = useState<{ name: string; email: string } | null>(null);

  // Redirect to home if already logged in
  useEffect(() => {
    try {
      const raw = localStorage.getItem('el7a2ny_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name && parsed?.email) {
          router.replace('/');
        }
      }
    } catch {
      // Invalid session — ignore
    }
  }, [router]);

  const handleSuccess = (name: string, email: string) => setSuccessUser({ name, email });

  if (successUser) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[70px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm mx-auto container-pad"
        >
          <div className="text-5xl mb-5">🎓</div>
          <h2 className="text-[#1B2A44] font-bold text-2xl mb-3">
            {tab === 'login' ? `Welcome back, ${successUser.name}!` : 'Account created!'}
          </h2>
          <p className="text-[#64748B] mb-2">You&apos;re now signed in to El7a2ny Tutoring.</p>
          {tab === 'signup' && (
            <p className="text-[#64748B] text-sm mb-6">A welcome email has been sent to <strong className="text-[#1B2A44]">{successUser.email}</strong></p>
          )}
          {tab === 'login' && <div className="mb-8" />}
          <Link href="/dashboard" className="btn-primary px-8 py-3 text-sm inline-flex">Go to Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex pt-[70px]">
      {/* Left branding panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center animated-gradient">
        <div className="orb w-[300px] h-[300px] bg-brand-orange opacity-[0.12] animate-float top-[10%] left-[5%]" />
        <div className="orb w-[240px] h-[240px] bg-brand-orange opacity-[0.03] animate-float-delayed bottom-[10%] right-[5%]" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(242,116,5,0.40)]">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h2 className="text-[#1B2A44] font-extrabold text-3xl mb-4">El7a2ny Tutoring</h2>
          <p className="text-[#64748B] leading-relaxed max-w-xs mx-auto">
            Join 500+ IGCSE students who are unlocking their potential with expert tutoring.
          </p>
          <div className="mt-10 space-y-3">
            {['Personalised sessions', 'Expert Cambridge tutors', '95% success rate', 'Flexible scheduling'].map(f => (
              <div key={f} className="flex items-center gap-3 text-[#64748B] text-sm">
                <span className="w-5 h-5 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center text-brand-green text-xs">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo on mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center mx-auto mb-3 shadow-[0_4px_14px_rgba(242,116,5,0.35)]">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <span className="gradient-text font-bold text-xl">El7a2ny Tutoring</span>
          </div>

          {/* Tabs */}
          <div className="glass rounded-2xl p-1.5 flex mb-8">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t ? 'bg-brand-orange text-white shadow-[0_4px_14px_rgba(242,116,5,0.30)]' : 'text-[#64748B] hover:text-[#1B2A44]'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === 'login' ? 16 : -16 }}
              transition={{ duration: 0.22 }}
              className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm"
            >
              <h1 className="text-[#1B2A44] font-bold text-xl mb-6">
                {tab === 'login' ? 'Sign in to your account' : 'Create your free account'}
              </h1>

              {tab === 'login'
                ? <LoginFormComp  onSuccess={handleSuccess} />
                : <SignupFormComp onSuccess={handleSuccess} />
              }

              <p className="text-center text-[#94A3B8] text-xs mt-5">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-brand-orange hover:text-brand-orangeSoft font-medium">
                  {tab === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-[#94A3B8] text-xs mt-6">
            By continuing you agree to our{' '}
            <a href="#" className="text-[#64748B] hover:text-[#1B2A44]">Terms</a> &{' '}
            <a href="#" className="text-[#64748B] hover:text-[#1B2A44]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
