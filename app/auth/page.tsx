'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Tab = 'login' | 'signup';

interface LoginForm  { email: string; password: string }
interface SignupForm { name: string; email: string; password: string; confirm: string }

function LoginFormComp({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<LoginForm> = {};
    if (!form.email)    e.email    = 'Email required';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div>
        <label className="text-slate-300 text-sm font-medium block mb-1.5">Email</label>
        <input type="email" placeholder="your@email.com" className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
          value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="text-slate-300 text-sm font-medium block mb-1.5">Password</label>
        <input type="password" placeholder="••••••••" className={`input-field ${errors.password ? 'border-red-500/60' : ''}`}
          value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
      </div>
      <div className="flex justify-end">
        <a href="#" className="text-indigo-400 text-xs hover:text-indigo-300">Forgot password?</a>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}

function SignupFormComp({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<SignupForm> = {};
    if (!form.name) e.name = 'Name required';
    if (!form.email) e.email = 'Email required';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {[
        { key: 'name',     label: 'Full Name',        type: 'text',     ph: 'Your name' },
        { key: 'email',    label: 'Email',             type: 'email',    ph: 'your@email.com' },
        { key: 'password', label: 'Password',          type: 'password', ph: '••••••••' },
        { key: 'confirm',  label: 'Confirm Password',  type: 'password', ph: '••••••••' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-slate-300 text-sm font-medium block mb-1.5">{f.label}</label>
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
  const [tab, setTab] = useState<Tab>('login');
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[70px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm mx-auto container-pad"
        >
          <div className="text-5xl mb-5">🎓</div>
          <h2 className="text-white font-bold text-2xl mb-3">
            {tab === 'login' ? 'Welcome back!' : 'Account created!'}
          </h2>
          <p className="text-slate-400 mb-8">You&apos;re now signed in to El7a2ny Tutoring.</p>
          <Link href="/dashboard" className="btn-primary px-8 py-3 text-sm inline-flex">Go to Dashboard</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex pt-[70px]">
      {/* Left branding panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center animated-gradient">
        <div className="orb w-[300px] h-[300px] bg-indigo-600/25 animate-float top-[10%] left-[5%]" />
        <div className="orb w-[240px] h-[240px] bg-violet-600/20 animate-float-delayed bottom-[10%] right-[5%]" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h2 className="text-white font-extrabold text-3xl mb-4">El7a2ny Tutoring</h2>
          <p className="text-slate-400 leading-relaxed max-w-xs mx-auto">
            Join 500+ IGCSE students who are unlocking their potential with expert tutoring.
          </p>
          <div className="mt-10 space-y-3">
            {['Personalised sessions', 'Expert Cambridge tutors', '95% success rate', 'Flexible scheduling'].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs">✓</span>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-3">
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
                  tab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
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
              className="glass rounded-2xl p-8 border border-white/[0.07]"
            >
              <h1 className="text-white font-bold text-xl mb-6">
                {tab === 'login' ? 'Sign in to your account' : 'Create your free account'}
              </h1>

              {tab === 'login'
                ? <LoginFormComp  onSuccess={() => setSuccess(true)} />
                : <SignupFormComp onSuccess={() => setSuccess(true)} />
              }

              <p className="text-center text-slate-500 text-xs mt-5">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-indigo-400 hover:text-indigo-300">
                  {tab === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>

          <p className="text-center text-slate-600 text-xs mt-6">
            By continuing you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Terms</a> &{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
