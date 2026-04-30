'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormState {
  loading: boolean;
  success: boolean;
  error: string;
}

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@el7a2ny.com',
    href: 'mailto:hello@el7a2ny.com',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: 'WhatsApp',
    value: '+20 101 029 4098',
    href: 'https://wa.me/201010294098',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Cairo, Egypt (Online Sessions Available)',
    href: '#map',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [state, setState] = useState<FormState>({ loading: false, success: false, error: '' });

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim())                    e.name    = 'Name is required';
    if (!form.email.trim())                   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = 'Enter a valid email';
    if (!form.phone.trim())                   e.phone   = 'WhatsApp number is required';
    else if (!/^\+[1-9]\d{7,14}$/.test(form.phone.replace(/[\s()-]/g, '').trim())) e.phone = 'Use country code format, e.g. +201010294098';
    if (!form.subject.trim())                 e.subject = 'Subject is required';
    if (!form.message.trim())                 e.message = 'Message is required';
    else if (form.message.length < 20)        e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState({ loading: true, success: false, error: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send');
      setState({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setState({ loading: false, success: false, error: 'Something went wrong. Please try again.' });
    }
  };

  const field = (key: keyof FormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors(er => ({ ...er, [key]: undefined }));
    },
  });

  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="line-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="orb w-[300px] h-[300px] bg-brand-orange opacity-[0.07] animate-float -top-[10%] right-[5%]" />
        <div className="relative z-10 max-w-2xl mx-auto container-pad">
          <span className="inline-block text-brand-orange text-xs font-bold uppercase tracking-[0.18em] mb-3 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B2A44] mt-3 mb-4">
            We&apos;d Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-[#64748B] text-lg">
            Have a question? Want to discuss a study plan? Drop us a message and we&apos;ll reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto container-pad">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <h2 className="text-[#1B2A44] font-semibold mb-5">Contact Information</h2>
                <div className="space-y-4">
                  {CONTACT_INFO.map(c => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange flex-shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-[#94A3B8] text-xs mb-0.5">{c.label}</p>
                        <p className="text-[#1B2A44] text-sm group-hover:text-brand-orange transition-colors">{c.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div id="map" className="bg-[#F5F7FA] rounded-2xl overflow-hidden border border-[#E2E8F0] h-48 flex items-center justify-center">
                <div className="text-center text-[#94A3B8]">
                  <svg className="w-8 h-8 mx-auto mb-2 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-xs text-[#64748B]">Cairo, Egypt</p>
                  <p className="text-xs mt-1 text-[#94A3B8]">Online sessions available worldwide</p>
                </div>
              </div>

              {/* Office hours */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                <h3 className="text-[#1B2A44] font-semibold mb-3 text-sm">Office Hours</h3>
                {[
                  ['Sun – Thu', '9:00 AM – 9:00 PM'],
                  ['Fri – Sat', '12:00 PM – 8:00 PM'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-[#E2E8F0] last:border-0">
                    <span className="text-[#64748B] text-sm">{day}</span>
                    <span className="text-[#1B2A44] text-sm">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
                <h2 className="text-[#1B2A44] font-semibold text-xl mb-6">Send a Message</h2>

                {state.success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                      ✓
                    </div>
                    <h3 className="text-[#1B2A44] font-semibold text-lg mb-2">Message Sent!</h3>
                    <p className="text-[#64748B] text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setState(s => ({ ...s, success: false }))} className="btn-ghost px-6 py-2 text-sm">
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="text-[#334155] text-sm font-medium block mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          className={`input-field ${errors.name ? 'border-red-500/60 focus:border-red-500/80' : ''}`}
                          {...field('name')}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[#334155] text-sm font-medium block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
                          {...field('email')}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[#334155] text-sm font-medium block mb-1.5">WhatsApp Number with Country Code *</label>
                      <input
                        type="tel"
                        placeholder="+201010294098"
                        className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
                        {...field('phone')}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="text-[#334155] text-sm font-medium block mb-1.5">Subject *</label>
                      <input
                        type="text"
                        placeholder="e.g. Question about IGCSE Maths sessions"
                        className={`input-field ${errors.subject ? 'border-red-500/60' : ''}`}
                        {...field('subject')}
                      />
                      {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-[#334155] text-sm font-medium block mb-1.5">Message *</label>
                      <textarea
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className={`input-field resize-none ${errors.message ? 'border-red-500/60' : ''}`}
                        {...field('message')}
                      />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    </div>

                    {state.error && (
                      <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        {state.error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={state.loading}
                      className="btn-primary w-full py-4 text-sm"
                    >
                      {state.loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
