// ─── Role & auth utilities ────────────────────────────────────────────────────

export const TEACHER_EMAILS: string[] = ['ali.a.embaby@hotmail.com'];

export type UserRole = 'student' | 'teacher';

export interface AppSession {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AppUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
}

export interface SessionEntry {
  id: string;
  studentEmail: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  sessionType: 'Online' | 'Face-to-Face' | 'WhatsApp';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface ProgressEntry {
  studentEmail: string;
  subject: string;
  progress: number; // 0–100
  grade?: string;
  notes?: string;
  updatedAt: string;
}

export interface ReminderEntry {
  id: string;
  studentEmail: string;
  message: string;
  sentAt: string;
  teacherName: string;
  read: boolean;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function getRoleForEmail(email: string): UserRole {
  return TEACHER_EMAILS.includes(email.toLowerCase().trim()) ? 'teacher' : 'student';
}

export function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// ─── Session ─────────────────────────────────────────────────────────────────

export function getSession(): AppSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('el7a2ny_session');
    if (!raw) return null;
    const s = JSON.parse(raw) as AppSession;
    // Backfill role for sessions saved before role was added
    if (!s.role) s.role = getRoleForEmail(s.email);
    return s;
  } catch { return null; }
}

export function saveSession(session: AppSession): void {
  localStorage.setItem('el7a2ny_session', JSON.stringify(session));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('el7a2ny-auth'));
}

export function clearSession(): void {
  localStorage.removeItem('el7a2ny_session');
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('el7a2ny-auth'));
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function getUsers(): AppUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('el7a2ny_users');
    if (!raw) return [];
    return (JSON.parse(raw) as AppUser[]).map(u => ({
      ...u,
      role: u.role ?? getRoleForEmail(u.email),
    }));
  } catch { return []; }
}

export function saveUsers(users: AppUser[]): void {
  localStorage.setItem('el7a2ny_users', JSON.stringify(users));
}

export function getStudents(): AppUser[] {
  return getUsers().filter(u => u.role === 'student');
}

// ─── Sessions (teacher-assigned + booking-form submissions) ───────────────────

export function getSessions(): SessionEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('el7a2ny_sessions');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSessions(sessions: SessionEntry[]): void {
  localStorage.setItem('el7a2ny_sessions', JSON.stringify(sessions));
}

export function addSession(entry: SessionEntry): void {
  const sessions = getSessions();
  sessions.unshift(entry);
  saveSessions(sessions);
}

// ─── Progress ────────────────────────────────────────────────────────────────

export function getProgress(): ProgressEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('el7a2ny_progress');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveProgress(entries: ProgressEntry[]): void {
  localStorage.setItem('el7a2ny_progress', JSON.stringify(entries));
}

export function upsertProgress(entry: ProgressEntry): void {
  const all = getProgress();
  const idx = all.findIndex(p => p.studentEmail === entry.studentEmail && p.subject === entry.subject);
  if (idx >= 0) all[idx] = entry;
  else all.unshift(entry);
  saveProgress(all);
}

// ─── Reminders ───────────────────────────────────────────────────────────────

export function getReminders(): ReminderEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('el7a2ny_reminders');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveReminders(entries: ReminderEntry[]): void {
  localStorage.setItem('el7a2ny_reminders', JSON.stringify(entries));
}

export function addReminder(entry: ReminderEntry): void {
  const all = getReminders();
  all.unshift(entry);
  saveReminders(all);
}

export function markReminderRead(id: string): void {
  const all = getReminders().map(r => r.id === id ? { ...r, read: true } : r);
  saveReminders(all);
}
