import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Date to a readable string */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/** Pad number to 2 digits */
export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Get days in a given month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Get day of week for first day of month (0=Sun) */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export const TIME_SLOTS = [
  '09:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00',
];

export const TESTIMONIALS = [
  {
    name: 'Sara Al-Mansouri',
    grade: 'A* in Mathematics',
    avatar: 'SA',
    text: 'El7a2ny completely transformed my understanding of calculus. My tutor\'s step-by-step approach and patience made it click. I went from a C to an A* in just one semester!',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    name: 'Ahmed Khalil',
    grade: 'A in Physics & Chemistry',
    avatar: 'AK',
    text: 'I was struggling with both Physics and Chemistry. The structured sessions and constant feedback were game-changers. Highly recommend to every IGCSE student.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Lena Farouk',
    grade: 'A* in English Literature',
    avatar: 'LF',
    text: 'My essay-writing improved dramatically after just a few sessions. The tutor taught me how to analyse texts with confidence and write under timed conditions.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Omar Youssef',
    grade: 'A in Biology',
    avatar: 'OY',
    text: 'The Biology sessions here are phenomenal. Complex topics like genetics and cell division were broken down so clearly. I actually enjoyed studying for the first time!',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Nour Hassan',
    grade: 'A* in Economics',
    avatar: 'NH',
    text: 'Economics made zero sense until I started at El7a2ny. The real-world examples and exam technique coaching really set this platform apart.',
    color: 'from-amber-500 to-orange-500',
  },
];

export const TEAM = [
  {
    name: 'Dr. Karim Saad',
    role: 'Lead Mathematics Tutor',
    bio: 'PhD in Applied Mathematics. 10+ years teaching IGCSE and A-Level. Helped 300+ students achieve A*.',
    initials: 'KS',
    gradient: 'from-indigo-500 to-violet-600',
    subjects: ['Mathematics', 'Further Maths'],
  },
  {
    name: 'Ms. Dina Mostafa',
    role: 'Science Lead',
    bio: 'MSc in Biochemistry from AUC. Passionate about making science accessible, engaging and exam-ready.',
    initials: 'DM',
    gradient: 'from-emerald-500 to-teal-600',
    subjects: ['Biology', 'Chemistry'],
  },
  {
    name: 'Mr. Tarek Nour',
    role: 'Physics & ICT Tutor',
    bio: 'BSc in Physics, certified Cambridge examiner. Bridges the gap between theory and real-world application.',
    initials: 'TN',
    gradient: 'from-blue-500 to-cyan-600',
    subjects: ['Physics', 'ICT'],
  },
  {
    name: 'Ms. Sarah Williams',
    role: 'English & Humanities',
    bio: 'MA in English Literature from University of Edinburgh. Transforms students into confident analytical writers.',
    initials: 'SW',
    gradient: 'from-amber-500 to-orange-600',
    subjects: ['English Language', 'English Literature', 'History'],
  },
];
