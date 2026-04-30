export interface Subject {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  topics: string[];
  sessions: number;
  gradient: string;
  glow: string;
}

export type Level = 'OL' | 'AS' | 'A2' | 'AL';

export const LEVELS: Level[] = ['OL', 'AS', 'A2', 'AL'];

export const LEVEL_INFO: Record<Level, {
  label: string;
  difficulty: string;
  description: string;
  pill: string;
  bar: string;
  barWidth: string;
}> = {
  OL: {
    label: 'Ordinary Level',
    difficulty: 'Easy / Average',
    description: 'IGCSE foundation — core subject knowledge for all students.',
    pill: 'bg-blue-50 text-blue-600 border-blue-200',
    bar: 'from-blue-400 to-blue-600',
    barWidth: 'w-1/4',
  },
  AS: {
    label: 'Advanced Subsidiary',
    difficulty: 'Medium',
    description: 'First half of A Level — introduces advanced concepts and deeper analysis.',
    pill: 'bg-amber-50 text-amber-600 border-amber-200',
    bar: 'from-amber-400 to-amber-600',
    barWidth: 'w-2/4',
  },
  A2: {
    label: 'Second Year of A Level',
    difficulty: 'Hard',
    description: 'Second half of A Level — complex topics requiring strong AS foundations.',
    pill: 'bg-orange-50 text-orange-600 border-orange-200',
    bar: 'from-orange-400 to-orange-600',
    barWidth: 'w-3/4',
  },
  AL: {
    label: 'Full A Level',
    difficulty: 'Very Hard',
    description: 'Complete A Level combining AS + A2 — the highest qualification offered.',
    pill: 'bg-violet-50 text-violet-600 border-violet-200',
    bar: 'from-violet-500 to-violet-700',
    barWidth: 'w-full',
  },
};


export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Maths',
    emoji: '∑',
    tagline: 'Numbers, patterns and exam strategy',
    description:
      'Build rock-solid foundations in algebra, geometry, statistics and number theory. Our structured approach takes you from core concepts to A-Level mastery.',
    topics: ['Algebra & Equations', 'Geometry & Trigonometry', 'Statistics & Probability', 'Number Theory', 'Functions & Graphs'],
    sessions: 48,
    gradient: 'from-blue-600 to-indigo-700',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    id: 'physics',
    name: 'Physics',
    emoji: '⚛',
    tagline: 'Forces, energy & the universe',
    description:
      'Explore mechanics, waves, electricity and modern physics with hands-on problem-solving techniques that make abstract concepts click.',
    topics: ['Mechanics & Forces', 'Electricity & Magnetism', 'Waves & Light', 'Thermal Physics', 'Nuclear Physics'],
    sessions: 42,
    gradient: 'from-violet-600 to-purple-700',
    glow: 'rgba(139,92,246,0.35)',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    emoji: '⚗',
    tagline: 'Matter, reactions & bonding',
    description:
      'Demystify atomic structure, chemical bonding, stoichiometry and organic chemistry with clear explanations and exam-focused practice.',
    topics: ['Atomic Structure', 'Chemical Bonding', 'Stoichiometry', 'Organic Chemistry', 'Electrolysis'],
    sessions: 40,
    gradient: 'from-emerald-600 to-teal-700',
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    id: 'biology',
    name: 'Biology',
    emoji: '🧬',
    tagline: 'Life, cells & ecosystems',
    description:
      'Study cells, genetics, human biology and ecology in an engaging way that turns complex biological processes into memorable knowledge.',
    topics: ['Cell Biology', 'Genetics & Inheritance', 'Human Physiology', 'Ecology', 'Biotechnology'],
    sessions: 38,
    gradient: 'from-green-600 to-emerald-700',
    glow: 'rgba(22,163,74,0.35)',
  },
  {
    id: 'human-biology',
    name: 'Human Biology',
    emoji: '🫀',
    tagline: 'Body systems, health and physiology',
    description:
      'Focus deeply on human anatomy and physiology with clear, exam-focused explanations and targeted revision plans.',
    topics: ['Cells and Tissues', 'Nutrition', 'Respiration', 'Circulation', 'Homeostasis'],
    sessions: 32,
    gradient: 'from-lime-600 to-green-700',
    glow: 'rgba(101,163,13,0.35)',
  },
  {
    id: 'it',
    name: 'IT',
    emoji: '💻',
    tagline: 'Data, systems and digital tools',
    description:
      'Master hardware, software, networking, data representation and programming concepts to ace both the theory and practical components.',
    topics: ['Data Representation', 'Computer Architecture', 'Networking', 'Algorithms', 'Databases'],
    sessions: 36,
    gradient: 'from-cyan-600 to-blue-700',
    glow: 'rgba(6,182,212,0.35)',
  },
  {
    id: 'computer-science',
    name: 'CS',
    emoji: '🖥',
    tagline: 'Programming, algorithms and logic',
    description:
      'Learn computational thinking, algorithm design and practical programming with full exam-board style practice.',
    topics: ['Problem Solving', 'Algorithms', 'Programming Concepts', 'Data Structures', 'Computer Systems'],
    sessions: 38,
    gradient: 'from-sky-600 to-indigo-700',
    glow: 'rgba(14,116,144,0.35)',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    emoji: '🧾',
    tagline: 'Books, statements and analysis',
    description:
      'From double-entry to final accounts, we simplify accounting logic and build the skills needed for accurate exam answers.',
    topics: ['Double Entry', 'Ledger Accounts', 'Income Statement', 'Balance Sheet', 'Ratio Analysis'],
    sessions: 30,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'business',
    name: 'Business',
    emoji: '💼',
    tagline: 'Strategy, finance and enterprise',
    description:
      'Explore business operations, marketing, HR and finance while developing the analytical and evaluative skills exam boards reward.',
    topics: ['Business Organisation', 'Marketing', 'Finance and Accounts', 'Human Resources', 'Operations Management'],
    sessions: 32,
    gradient: 'from-pink-600 to-rose-600',
    glow: 'rgba(219,39,119,0.35)',
  },
  {
    id: 'economics',
    name: 'Economics',
    emoji: '📊',
    tagline: 'Markets, money and policy',
    description:
      'Grasp micro and macro-economic principles with real-world examples, graph analysis and structured evaluation techniques.',
    topics: ['Supply and Demand', 'Market Structures', 'Macroeconomics', 'International Trade', 'Development Economics'],
    sessions: 34,
    gradient: 'from-yellow-500 to-amber-600',
    glow: 'rgba(234,179,8,0.35)',
  },
  {
    id: 'combined-science',
    name: 'Combined Science',
    emoji: '🧪',
    tagline: 'Integrated biology, chemistry and physics',
    description:
      'Get full support across the combined science syllabus with targeted practice in all three science disciplines.',
    topics: ['Core Biology', 'Core Chemistry', 'Core Physics', 'Practical Skills', 'Exam Strategy'],
    sessions: 28,
    gradient: 'from-emerald-600 to-cyan-700',
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    id: 'arabic',
    name: 'Arabic',
    emoji: '🌙',
    tagline: 'Language, literature and expression',
    description:
      'Strengthen reading comprehension, written expression, grammar and literary analysis for First Language and Second Language IGCSE Arabic.',
    topics: ['Reading Comprehension', 'Grammar & Syntax', 'Essay Writing', 'Literature Analysis', 'Oral Practice'],
    sessions: 26,
    gradient: 'from-indigo-600 to-violet-700',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    id: 'national-arabic',
    name: 'National Arabic (Year 12 Only)',
    emoji: '📝',
    tagline: 'Year 12 focused Arabic preparation',
    description:
      'Specialized support for Year 12 National Arabic with focused exam preparation and structured writing drills.',
    topics: ['Advanced Grammar', 'Model Essays', 'Reading Analysis', 'Exam Technique', 'Past Paper Practice'],
    sessions: 24,
    gradient: 'from-purple-600 to-fuchsia-700',
    glow: 'rgba(168,85,247,0.35)',
  },
];
