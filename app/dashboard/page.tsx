'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getSession, getStudents, getSessions, getProgress, getReminders,
  saveSessions, upsertProgress, addReminder, addSession, markReminderRead,
  getInitials,
} from '@/lib/auth';
import type {
  AppSession, AppUser, SessionEntry, ProgressEntry, ReminderEntry,
} from '@/lib/auth';
import { subjects as SUBJECTS_LIST } from '@/lib/subjects';

const SESSION_TYPES = ['Online', 'Face-to-Face', 'WhatsApp'] as const;
const PROGRESS_COLORS = ['from-brand-orange to-brand-orangeSoft', 'from-[#7BBF2A] to-[#5a9c1a]', 'from-[#A5C8FF] to-[#6aa0e8]', 'from-[#FFD166] to-[#f0b429]'];

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-brand-orange to-brand-orangeSoft flex items-center justify-center text-white font-bold shadow-[0_2px_8px_rgba(242,116,5,0.35)] flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-14">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-[#6B829E] text-sm">{text}</p>
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────

function StudentDashboard({ session }: { session: AppSession }) {
  const [tab, setTab] = useState<'overview' | 'sessions' | 'progress' | 'reminders'>('overview');
  const [mySessions, setMySessions] = useState<SessionEntry[]>([]);
  const [myProgress, setMyProgress] = useState<ProgressEntry[]>([]);
  const [myReminders, setMyReminders] = useState<ReminderEntry[]>([]);

  const reload = useCallback(() => {
    setMySessions(getSessions().filter(s => s.studentEmail === session.email));
    setMyProgress(getProgress().filter(p => p.studentEmail === session.email));
    setMyReminders(getReminders().filter(r => r.studentEmail === session.email));
  }, [session.email]);

  useEffect(() => { reload(); }, [reload]);

  const unread = myReminders.filter(r => !r.read).length;

  const statusColor = (s: SessionEntry['status']) =>
    s === 'confirmed' ? 'text-[#7BBF2A] bg-[#7BBF2A]/10 border-[#7BBF2A]/25' :
    s === 'completed' ? 'text-[#A5C8FF] bg-[#A5C8FF]/10 border-[#A5C8FF]/25' :
    s === 'cancelled' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
    'text-[#FFD166] bg-[#FFD166]/10 border-[#FFD166]/25';

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar name={session.name} size="lg" />
          <div>
            <p className="text-[#9BAFC8] text-sm">Welcome back 👋</p>
            <h1 className="text-white font-bold text-2xl mt-0.5">{session.name}</h1>
            <p className="text-[#6B829E] text-xs mt-0.5">{session.email}</p>
          </div>
        </div>
        <Link href="/booking" className="btn-primary px-5 py-2.5 text-sm">+ Book Session</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sessions', value: mySessions.length, icon: '📚', color: 'text-brand-orange' },
          { label: 'Subjects Tracked', value: myProgress.length, icon: '📊', color: 'text-[#A5C8FF]' },
          { label: 'Avg Progress', value: myProgress.length ? Math.round(myProgress.reduce((a, b) => a + b.progress, 0) / myProgress.length) + '%' : '—', icon: '🎯', color: 'text-[#7BBF2A]' },
          { label: 'Reminders', value: unread > 0 ? `${unread} new` : myReminders.length, icon: '🔔', color: unread > 0 ? 'text-[#FFD166]' : 'text-[#9BAFC8]' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5 border border-white/[0.06]">
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[#6B829E] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-8 flex-wrap">
        {(['overview', 'sessions', 'progress', 'reminders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all relative ${
              tab === t ? 'bg-brand-orange text-white shadow-[0_4px_14px_rgba(242,116,5,0.30)]' : 'text-[#9BAFC8] hover:text-white'
            }`}
          >
            {t}
            {t === 'reminders' && unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FFD166] text-[#0F1C30] text-[9px] font-bold flex items-center justify-center">{unread}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div key="ov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-white font-semibold mb-3">Recent Sessions</h2>
                {mySessions.length === 0
                  ? <EmptyState icon="📅" text="No sessions yet. Book one!" />
                  : mySessions.slice(0, 3).map(s => (
                    <div key={s.id} className="glass rounded-2xl p-4 border border-white/[0.06] flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/20 flex items-center justify-center text-brand-orange font-bold flex-shrink-0">
                        {s.subject.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{s.subject}</p>
                        <p className="text-[#9BAFC8] text-xs">{s.date}{s.time && ` · ${s.time}`}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColor(s.status)}`}>{s.status}</span>
                    </div>
                  ))
                }
              </div>
              <div>
                <h2 className="text-white font-semibold mb-3">Progress Overview</h2>
                {myProgress.length === 0
                  ? <EmptyState icon="📈" text="Progress will appear once your teacher updates it." />
                  : myProgress.slice(0, 4).map((p, i) => (
                    <div key={p.subject} className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white text-sm font-medium">{p.subject}</span>
                        <span className="text-[#9BAFC8] text-sm">{p.progress}%{p.grade && ` · ${p.grade}`}</span>
                      </div>
                      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${PROGRESS_COLORS[i % PROGRESS_COLORS.length]}`} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'sessions' && (
          <motion.div key="sess" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-white font-semibold mb-4">My Sessions</h2>
            {mySessions.length === 0
              ? <EmptyState icon="📅" text="No sessions assigned yet." />
              : <div className="space-y-3">
                {mySessions.map(s => (
                  <div key={s.id} className="glass rounded-2xl p-5 border border-white/[0.06] flex flex-wrap items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {s.subject.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{s.subject}</p>
                      <p className="text-[#9BAFC8] text-sm">{s.date}{s.time && ` · ${s.time}`} · {s.sessionType}</p>
                      {s.notes && <p className="text-[#6B829E] text-xs mt-1 italic">{s.notes}</p>}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusColor(s.status)}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            }
          </motion.div>
        )}

        {tab === 'progress' && (
          <motion.div key="prog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-white font-semibold mb-6">Subject Progress</h2>
            {myProgress.length === 0
              ? <EmptyState icon="📊" text="Your teacher hasn't set progress yet." />
              : <div className="grid sm:grid-cols-2 gap-5">
                {myProgress.map((p, i) => (
                  <div key={p.subject} className="glass rounded-2xl p-6 border border-white/[0.06]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-medium">{p.subject}</span>
                      <div className="text-right">
                        <span className="text-white font-bold">{p.progress}%</span>
                        {p.grade && <span className="ml-2 text-brand-orange text-sm font-semibold">{p.grade}</span>}
                      </div>
                    </div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${PROGRESS_COLORS[i % PROGRESS_COLORS.length]}`} />
                    </div>
                    {p.notes && <p className="text-[#9BAFC8] text-xs mt-2 italic">{p.notes}</p>}
                    <p className="text-[#6B829E] text-xs mt-1">Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            }
          </motion.div>
        )}

        {tab === 'reminders' && (
          <motion.div key="rem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-white font-semibold mb-4">Reminders from Teacher</h2>
            {myReminders.length === 0
              ? <EmptyState icon="🔔" text="No reminders yet." />
              : <div className="space-y-3">
                {myReminders.map(r => (
                  <div key={r.id} className={`glass rounded-2xl p-5 border transition-all ${r.read ? 'border-white/[0.05]' : 'border-[#FFD166]/30 bg-[#FFD166]/[0.03]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{r.teacherName}</span>
                          {!r.read && <span className="text-[9px] bg-[#FFD166] text-[#0F1C30] px-1.5 py-0.5 rounded-full font-bold uppercase">New</span>}
                        </div>
                        <p className="text-[#9BAFC8] text-sm leading-relaxed">{r.message}</p>
                        <p className="text-[#6B829E] text-xs mt-2">{new Date(r.sentAt).toLocaleString()}</p>
                      </div>
                      {!r.read && (
                        <button onClick={() => { markReminderRead(r.id); reload(); }} className="text-xs text-[#9BAFC8] hover:text-white px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors flex-shrink-0">
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────────

function TeacherDashboard({ session }: { session: AppSession }) {
  const [tab, setTab] = useState<'students' | 'add-session' | 'progress' | 'reminders'>('students');
  const [students, setStudents] = useState<AppUser[]>([]);
  const [allSessions, setAllSessions] = useState<SessionEntry[]>([]);
  const [allProgress, setAllProgress] = useState<ProgressEntry[]>([]);
  const [toast, setToast] = useState('');

  const [sf, setSf] = useState({ studentEmail: '', subject: '', date: '', time: '', sessionType: 'Online' as SessionEntry['sessionType'], status: 'confirmed' as SessionEntry['status'], notes: '' });
  const [pf, setPf] = useState({ studentEmail: '', subject: '', progress: 50, grade: '', notes: '' });
  const [rf, setRf] = useState({ studentEmail: '', message: '' });

  const reload = useCallback(() => {
    setStudents(getStudents());
    setAllSessions(getSessions());
    setAllProgress(getProgress());
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const submitSession = () => {
    if (!sf.studentEmail || !sf.subject || !sf.date) { showToast('Please fill in student, subject and date.'); return; }
    const student = students.find(s => s.email === sf.studentEmail);
    if (!student) return;
    addSession({ id: crypto.randomUUID(), studentEmail: sf.studentEmail, studentName: student.name, subject: sf.subject, date: sf.date, time: sf.time, sessionType: sf.sessionType, status: sf.status, notes: sf.notes, createdAt: new Date().toISOString() });
    setSf({ studentEmail: '', subject: '', date: '', time: '', sessionType: 'Online', status: 'confirmed', notes: '' });
    reload(); showToast('Session added ✓');
  };

  const submitProgress = () => {
    if (!pf.studentEmail || !pf.subject) { showToast('Please select student and subject.'); return; }
    upsertProgress({ ...pf, updatedAt: new Date().toISOString() });
    setPf({ studentEmail: '', subject: '', progress: 50, grade: '', notes: '' });
    reload(); showToast('Progress saved ✓');
  };

  const submitReminder = () => {
    if (!rf.studentEmail || !rf.message.trim()) { showToast('Please select student and write a message.'); return; }
    addReminder({ id: crypto.randomUUID(), studentEmail: rf.studentEmail, message: rf.message.trim(), sentAt: new Date().toISOString(), teacherName: session.name, read: false });
    setRf({ studentEmail: '', message: '' }); showToast('Reminder sent ✓');
  };

  const fc = 'w-full bg-white/[0.05] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder-[#6B829E] focus:outline-none focus:border-brand-orange/60 transition-all';
  const lc = 'block text-[#9BAFC8] text-sm font-medium mb-1.5';
  const ss = { background: '#1B2A44' };

  const StudentSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className={fc} style={ss}>
      <option value="">Select student…</option>
      {students.map(s => <option key={s.email} value={s.email}>{s.name} ({s.email})</option>)}
    </select>
  );

  return (
    <div>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B2A44] border border-brand-orange/30 text-white text-sm px-5 py-3 rounded-2xl shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Avatar name={session.name} size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-2xl">{session.name}</h1>
            <span className="text-xs bg-brand-orange text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Teacher</span>
          </div>
          <p className="text-[#9BAFC8] text-sm mt-0.5">{students.length} students · {allSessions.length} sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Students', value: students.length, icon: '👨‍🎓', color: 'text-brand-orange' },
          { label: 'Total Sessions', value: allSessions.length, icon: '📅', color: 'text-[#A5C8FF]' },
          { label: 'Progress Records', value: allProgress.length, icon: '📊', color: 'text-[#7BBF2A]' },
          { label: 'Confirmed', value: allSessions.filter(s => s.status === 'confirmed').length, icon: '⏰', color: 'text-[#FFD166]' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5 border border-white/[0.06]">
            <span className="text-2xl block mb-2">{s.icon}</span>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[#6B829E] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-8 flex-wrap">
        {([{ key: 'students', label: 'Students' }, { key: 'add-session', label: 'Add Session' }, { key: 'progress', label: 'Set Progress' }, { key: 'reminders', label: 'Send Reminder' }] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-brand-orange text-white shadow-[0_4px_14px_rgba(242,116,5,0.30)]' : 'text-[#9BAFC8] hover:text-white'}`}
          >{t.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'students' && (
          <motion.div key="students" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="text-white font-semibold mb-4">All Students ({students.length})</h2>
            {students.length === 0
              ? <EmptyState icon="👨‍🎓" text="No students registered yet." />
              : <div className="space-y-3">
                {students.map(s => {
                  const ss2 = allSessions.filter(x => x.studentEmail === s.email);
                  const sp = allProgress.filter(x => x.studentEmail === s.email);
                  const avg = sp.length ? Math.round(sp.reduce((a, b) => a + b.progress, 0) / sp.length) : null;
                  return (
                    <div key={s.email} className="glass rounded-2xl p-5 border border-white/[0.06] flex flex-wrap items-center gap-4">
                      <Avatar name={s.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{s.name}</p>
                        <p className="text-[#9BAFC8] text-xs">{s.email}</p>
                      </div>
                      <div className="flex gap-4 text-center">
                        <div><p className="text-brand-orange font-bold">{ss2.length}</p><p className="text-[#6B829E] text-xs">sessions</p></div>
                        <div><p className="text-[#7BBF2A] font-bold">{avg !== null ? `${avg}%` : '—'}</p><p className="text-[#6B829E] text-xs">avg</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            {allSessions.length > 0 && (
              <>
                <h2 className="text-white font-semibold mt-8 mb-4">All Sessions</h2>
                <div className="space-y-3">
                  {allSessions.map(s => (
                    <div key={s.id} className="glass rounded-2xl p-4 border border-white/[0.06] flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{s.studentName} — {s.subject}</p>
                        <p className="text-[#9BAFC8] text-xs">{s.date}{s.time && ` · ${s.time}`} · {s.sessionType}</p>
                        {s.notes && <p className="text-[#6B829E] text-xs italic mt-0.5">{s.notes}</p>}
                      </div>
                      <select value={s.status} onChange={e => { const updated = allSessions.map(x => x.id === s.id ? { ...x, status: e.target.value as SessionEntry['status'] } : x); saveSessions(updated); reload(); }}
                        className="text-xs px-2 py-1 rounded-lg border border-white/[0.10] text-white focus:outline-none capitalize" style={ss}>
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {tab === 'add-session' && (
          <motion.div key="add" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="max-w-lg">
              <h2 className="text-white font-semibold mb-6">Schedule a Session</h2>
              <div className="space-y-4">
                <div><label className={lc}>Student *</label><StudentSelect value={sf.studentEmail} onChange={v => setSf(p => ({ ...p, studentEmail: v }))} /></div>
                <div><label className={lc}>Subject *</label>
                  <select value={sf.subject} onChange={e => setSf(p => ({ ...p, subject: e.target.value }))} className={fc} style={ss}>
                    <option value="">Select subject…</option>
                    {SUBJECTS_LIST.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lc}>Date *</label><input type="date" value={sf.date} onChange={e => setSf(p => ({ ...p, date: e.target.value }))} className={fc} /></div>
                  <div><label className={lc}>Time</label><input type="time" value={sf.time} onChange={e => setSf(p => ({ ...p, time: e.target.value }))} className={fc} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lc}>Type</label>
                    <select value={sf.sessionType} onChange={e => setSf(p => ({ ...p, sessionType: e.target.value as SessionEntry['sessionType'] }))} className={fc} style={ss}>
                      {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className={lc}>Status</label>
                    <select value={sf.status} onChange={e => setSf(p => ({ ...p, status: e.target.value as SessionEntry['status'] }))} className={fc} style={ss}>
                      {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className={lc}>Notes</label><textarea rows={3} value={sf.notes} onChange={e => setSf(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes for student…" className={`${fc} resize-none`} /></div>
                <button onClick={submitSession} className="btn-primary px-8 py-3 text-sm w-full">Add Session</button>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'progress' && (
          <motion.div key="prog" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="max-w-lg">
              <h2 className="text-white font-semibold mb-6">Update Student Progress</h2>
              <div className="space-y-4">
                <div><label className={lc}>Student *</label><StudentSelect value={pf.studentEmail} onChange={v => setPf(p => ({ ...p, studentEmail: v }))} /></div>
                <div><label className={lc}>Subject *</label>
                  <select value={pf.subject} onChange={e => setPf(p => ({ ...p, subject: e.target.value }))} className={fc} style={ss}>
                    <option value="">Select subject…</option>
                    {SUBJECTS_LIST.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lc}>Progress: {pf.progress}%</label>
                  <input type="range" min={0} max={100} value={pf.progress} onChange={e => setPf(p => ({ ...p, progress: +e.target.value }))} className="w-full accent-brand-orange" />
                  <div className="flex justify-between text-[#6B829E] text-xs mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>
                <div><label className={lc}>Grade (optional)</label><input type="text" value={pf.grade} onChange={e => setPf(p => ({ ...p, grade: e.target.value }))} placeholder="e.g. A*, B, 88%" className={fc} /></div>
                <div><label className={lc}>Notes</label><textarea rows={3} value={pf.notes} onChange={e => setPf(p => ({ ...p, notes: e.target.value }))} placeholder="Feedback for student…" className={`${fc} resize-none`} /></div>
                <button onClick={submitProgress} className="btn-primary px-8 py-3 text-sm w-full">Save Progress</button>
              </div>
              {allProgress.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-3">Saved Records</h3>
                  <div className="space-y-2">
                    {allProgress.map(p => (
                      <div key={`${p.studentEmail}-${p.subject}`} className="glass rounded-xl p-3 border border-white/[0.06] flex items-center gap-3 text-sm">
                        <div className="flex-1"><span className="text-white font-medium">{p.subject}</span><span className="text-[#6B829E] text-xs ml-2">{students.find(s => s.email === p.studentEmail)?.name ?? p.studentEmail}</span></div>
                        <span className="text-brand-orange font-bold">{p.progress}%</span>
                        {p.grade && <span className="text-[#7BBF2A] text-xs">{p.grade}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'reminders' && (
          <motion.div key="rem" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="max-w-lg">
              <h2 className="text-white font-semibold mb-6">Send Reminder to Student</h2>
              <div className="space-y-4">
                <div><label className={lc}>Student *</label><StudentSelect value={rf.studentEmail} onChange={v => setRf(p => ({ ...p, studentEmail: v }))} /></div>
                <div><label className={lc}>Message *</label>
                  <textarea rows={4} value={rf.message} onChange={e => setRf(p => ({ ...p, message: e.target.value }))}
                    placeholder="e.g. Don't forget to revise Chapter 5 before Friday's session…" className={`${fc} resize-none`} />
                </div>
                <button onClick={submitReminder} className="btn-primary px-8 py-3 text-sm w-full">Send Reminder</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AppSession | null | 'loading'>('loading');

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/auth'); return; }
    setSession(s);
  }, [router]);

  if (session === 'loading') {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-[70px] min-h-screen">
      <div className="max-w-7xl mx-auto container-pad py-10">
        {session.role === 'teacher'
          ? <TeacherDashboard session={session} />
          : <StudentDashboard session={session} />
        }
      </div>
    </div>
  );
}
