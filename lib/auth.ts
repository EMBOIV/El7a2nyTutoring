// ─── Role & auth utilities ────────────────────────────────────────────────────

// Map teacher email → their assigned subjects
export const TEACHERS: Record<string, { subjects: string[] }> = {
  'ali.a.embaby@hotmail.com': {
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Human Biology', 'Information Technology', 'Computer Science', 'Accounting', 'Business Studies', 'Economics', 'Combined Science', 'Arabic', 'National Arabic'],
  },
  'ali.a.embaby@gmail.com': {
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Human Biology', 'Information Technology', 'Computer Science', 'Accounting', 'Business Studies', 'Economics', 'Combined Science', 'Arabic', 'National Arabic'],
  },
};

export const TEACHER_EMAILS: string[] = Object.keys(TEACHERS);

export type UserRole = 'student' | 'teacher';

export interface AppSession {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface AppUser {
  name: string;
  email: string;
  phone: string;
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

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+[1-9]\d{7,14}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, '').trim();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(normalizeEmail(value));
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(normalizePhone(value));
}

export function isEmail(value: string): boolean {
  return isValidEmail(value);
}

export function isPhone(value: string): boolean {
  return isValidPhone(value);
}

  export function getTeacherSubjects(email: string): string[] {
    return TEACHERS[email.toLowerCase().trim()]?.subjects ?? [];
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
      email: normalizeEmail(u.email),
      phone: u.phone ? normalizePhone(u.phone) : '',
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

// ─── Exams ───────────────────────────────────────────────────────────────────

export function getExams(): ExamEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('el7a2ny_exams');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveExams(exams: ExamEntry[]): void {
  localStorage.setItem('el7a2ny_exams', JSON.stringify(exams));
}

export function addExam(exam: ExamEntry): void {
  const all = getExams();
  all.unshift(exam);
  saveExams(all);
}

export interface ExamEntry {
  id: string;
  teacherEmail: string;
  studentEmail: string;
  studentName: string;
  subject: string;
  examTitle: string;
  grade: string;
  date: string;
  notes?: string;
  createdAt: string;
}
