'use client';

import { useState, useEffect, type ChangeEventHandler } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSession, getUsers, saveUsers, saveSession, clearSession, getInitials } from '@/lib/auth';
import type { AppSession } from '@/lib/auth';

const AVATARS = ['🎓', '📚', '🔬', '🧮', '🎯', '🌟', '💡', '🚀', '🦁', '🐬'];

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<AppSession | null>(null);
  const [tab, setTab] = useState<'account' | 'password'>('account');
  const [toast, setToast] = useState('');

  // Account form
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Password form
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/auth'); return; }
    setSession(s);
    setName(s.name);
    setSelectedAvatar(s.avatar ?? '');
  }, [router]);

  if (!session) return null;

  const saveAccount = () => {
    if (!name.trim()) { showToast('Name cannot be empty.'); return; }
    const users = getUsers();
    const updated = users.map(u =>
      u.email === session.email ? { ...u, name: name.trim(), avatar: selectedAvatar } : u
    );
    saveUsers(updated);
    const newSession = { ...session, name: name.trim(), avatar: selectedAvatar };
    saveSession(newSession);
    setSession(newSession);
    showToast('Profile updated ✓');
  };

  const onUploadPhoto: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setSelectedAvatar(result);
        setUploadError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const savePassword = () => {
    const e: Record<string, string> = {};
    const users = getUsers();
    const user = users.find(u => u.email === session.email);
    if (!user) return;
    if (user.password !== pw.current) e.current = 'Current password is incorrect';
    if (pw.next.length < 8) e.next = 'At least 8 characters';
    if (pw.next !== pw.confirm) e.confirm = 'Passwords do not match';
    setPwErrors(e);
    if (Object.keys(e).length) return;
    const updated = users.map(u => u.email === session.email ? { ...u, password: pw.next } : u);
    saveUsers(updated);
    setPw({ current: '', next: '', confirm: '' });
    showToast('Password changed ✓');
  };

  const deleteAccount = () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    const users = getUsers().filter(u => u.email !== session.email);
    saveUsers(users);
    clearSession();
    router.push('/');
  };

  const fc = 'w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#1B2A44] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-brand-orange/60 transition-all';
  const lc = 'block text-[#334155] text-sm font-medium mb-1.5';
  const previewName = name || session.name;

  return (
    <div className="pt-[70px] min-h-screen">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-[#E2E8F0] text-[#1B2A44] text-sm px-5 py-3 rounded-2xl shadow-xl">
          {toast}
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto container-pad py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_20px_rgba(242,116,5,0.40)]">
            {selectedAvatar?.startsWith('data:image')
              ? <img src={selectedAvatar} alt={previewName} className="w-full h-full rounded-2xl object-cover" />
              : (selectedAvatar || getInitials(previewName))}
          </div>
          <div>
            <h1 className="text-[#1B2A44] font-bold text-2xl">{session.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[#64748B] text-sm">{session.email}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${session.role === 'teacher' ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30' : 'bg-[#F5F7FA] text-[#64748B] border border-[#E2E8F0]'}`}>
                {session.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#F5F7FA] rounded-2xl p-1.5 inline-flex gap-1 mb-8 border border-[#E2E8F0]">
          {(['account', 'password'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-brand-orange text-white shadow-[0_4px_14px_rgba(242,116,5,0.30)]' : 'text-[#64748B] hover:text-[#1B2A44]'
              }`}
            >{t === 'account' ? 'Account Info' : 'Change Password'}</button>
          ))}
        </div>

        {tab === 'account' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <div>
              <label className={lc}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={fc} />
            </div>

            <div>
              <label className={lc}>Email Address</label>
              <input type="email" value={session.email} disabled className={`${fc} opacity-50 cursor-not-allowed`} />
              <p className="text-[#94A3B8] text-xs mt-1.5">Email cannot be changed.</p>
            </div>

            <div>
              <label className={lc}>Avatar</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  onClick={() => setSelectedAvatar('')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${
                    !selectedAvatar ? 'border-brand-orange bg-brand-orange/15 text-brand-orange' : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#64748B]'
                  }`}
                >
                  {getInitials(previewName)}
                </button>
                {AVATARS.map(e => (
                  <button key={e} onClick={() => setSelectedAvatar(e)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${
                      selectedAvatar === e ? 'border-brand-orange bg-brand-orange/15 scale-110' : 'border-[#E2E8F0] bg-[#F5F7FA] hover:border-[#CBD5E1]'
                    }`}
                  >{e}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <label className="btn-ghost px-4 py-2 text-xs cursor-pointer">
                  Upload your photo
                  <input type="file" accept="image/*" className="hidden" onChange={onUploadPhoto} />
                </label>
                {selectedAvatar?.startsWith('data:image') && (
                  <button onClick={() => setSelectedAvatar('')} className="text-xs text-[#64748B] hover:text-[#1B2A44] underline">
                    Remove photo
                  </button>
                )}
              </div>
              {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={saveAccount} className="btn-primary px-8 py-3 text-sm">Save Changes</button>
            </div>

            {/* Danger zone */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <p className="text-[#94A3B8] text-xs mb-3 font-semibold uppercase tracking-wider">Danger Zone</p>
              <button onClick={deleteAccount} className="px-5 py-2.5 text-sm font-medium text-red-400 border border-red-500/25 rounded-xl hover:bg-red-500/10 transition-colors">
                Delete Account
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm space-y-5">
            {[
              { key: 'current', label: 'Current Password', ph: '••••••••' },
              { key: 'next', label: 'New Password', ph: 'At least 8 characters' },
              { key: 'confirm', label: 'Confirm New Password', ph: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label className={lc}>{f.label}</label>
                <input type="password" value={pw[f.key as keyof typeof pw]} onChange={e => { setPw(p => ({ ...p, [f.key]: e.target.value })); setPwErrors(p => ({ ...p, [f.key]: '' })); }}
                  placeholder={f.ph} className={`${fc} ${pwErrors[f.key] ? 'border-red-500/60' : ''}`} />
                {pwErrors[f.key] && <p className="text-red-400 text-xs mt-1">{pwErrors[f.key]}</p>}
              </div>
            ))}
            <button onClick={savePassword} className="btn-primary px-8 py-3 text-sm w-full">Update Password</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
