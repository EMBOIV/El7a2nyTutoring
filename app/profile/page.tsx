'use client';

import { useState, useEffect, type ChangeEventHandler } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, getUsers, saveUsers, saveSession, clearSession, getInitials } from '@/lib/auth';
import type { AppSession } from '@/lib/auth';

const AVATARS = ['🎓', '📚', '🔬', '🧮', '🎯', '🌟', '💡', '🚀', '🦁', '🐬'];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

async function createCroppedAvatar(imageSrc: string, zoom: number, x: number, y: number) {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageSrc;
  });

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageSrc;

  const coverScale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
  const drawScale = coverScale * zoom;
  const drawW = img.naturalWidth * drawScale;
  const drawH = img.naturalHeight * drawScale;

  const maxShiftX = Math.max(0, (drawW - size) / 2);
  const maxShiftY = Math.max(0, (drawH - size) / 2);
  const shiftX = (x / 100) * maxShiftX;
  const shiftY = (y / 100) * maxShiftY;

  const drawX = -((drawW - size) / 2) + shiftX;
  const drawY = -((drawH - size) / 2) + shiftY;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  return canvas.toDataURL('image/jpeg', 0.92);
}

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<AppSession | null>(null);
  const [tab, setTab] = useState<'account' | 'password'>('account');
  const [toast, setToast] = useState('');

  // Account form
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadedSrc, setUploadedSrc] = useState('');
  const [cropZoom, setCropZoom] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [isApplyingCrop, setIsApplyingCrop] = useState(false);

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
        setUploadedSrc(result);
        setCropZoom(1);
        setCropX(0);
        setCropY(0);
        setUploadError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = async () => {
    if (!uploadedSrc) return;
    setIsApplyingCrop(true);
    try {
      const cropped = await createCroppedAvatar(uploadedSrc, cropZoom, cropX, cropY);
      setSelectedAvatar(cropped);
      setUploadedSrc('');
      showToast('Photo cropped and applied ✓');
    } catch {
      setUploadError('Could not process this image. Try another one.');
    } finally {
      setIsApplyingCrop(false);
    }
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
        <div className="flex items-center justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-4">
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
          <Link href="/booking" className="btn-primary px-5 py-2.5 text-sm">
            Book Your Session
          </Link>
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

              {uploadedSrc && (
                <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#64748B]">Crop photo</p>

                  <div className="w-44 h-44 mx-auto rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white relative">
                    <img
                      src={uploadedSrc}
                      alt="Crop preview"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: `translate(${cropX}%, ${cropY}%) scale(${cropZoom})`,
                        transformOrigin: 'center center',
                      }}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1.5">Zoom</label>
                      <input
                        type="range"
                        min={1}
                        max={2.5}
                        step={0.01}
                        value={cropZoom}
                        onChange={e => setCropZoom(clamp(+e.target.value, 1, 2.5))}
                        className="w-full accent-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1.5">Move X</label>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={cropX}
                        onChange={e => setCropX(clamp(+e.target.value, -100, 100))}
                        className="w-full accent-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#64748B] block mb-1.5">Move Y</label>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={cropY}
                        onChange={e => setCropY(clamp(+e.target.value, -100, 100))}
                        className="w-full accent-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setUploadedSrc('')}
                      className="btn-ghost px-4 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyCrop}
                      disabled={isApplyingCrop}
                      className="btn-primary px-4 py-2 text-xs disabled:opacity-60"
                    >
                      {isApplyingCrop ? 'Applying...' : 'Apply Crop'}
                    </button>
                  </div>
                </div>
              )}
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
