export interface Subject {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  topics: string[];
  difficulty: 'Foundation' | 'Core' | 'Extended';
  sessions: number;
  gradient: string;
  glow: string;
}

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    emoji: '∑',
    tagline: 'Numbers, patterns & problem solving',
    description:
      'Build rock-solid foundations in algebra, geometry, statistics and number theory. Our structured approach takes you from core concepts to extended-level mastery.',
    topics: ['Algebra & Equations', 'Geometry & Trigonometry', 'Statistics & Probability', 'Number Theory', 'Functions & Graphs'],
    difficulty: 'Extended',
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
    difficulty: 'Extended',
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
    difficulty: 'Extended',
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
    difficulty: 'Extended',
    sessions: 38,
    gradient: 'from-green-600 to-emerald-700',
    glow: 'rgba(22,163,74,0.35)',
  },
  {
    id: 'ict',
    name: 'ICT / Computer Sci.',
    emoji: '💻',
    tagline: 'Data, systems & algorithms',
    description:
      'Master hardware, software, networking, data representation and programming concepts to ace both the theory and practical components.',
    topics: ['Data Representation', 'Computer Architecture', 'Networking', 'Algorithms', 'Databases'],
    difficulty: 'Core',
    sessions: 36,
    gradient: 'from-cyan-600 to-blue-700',
    glow: 'rgba(6,182,212,0.35)',
  },
  {
    id: 'english-language',
    name: 'English Language',
    emoji: '✒',
    tagline: 'Reading, writing & comprehension',
    description:
      'Develop the reading comprehension, writing fluency and language analysis skills needed to score an A* in your IGCSE English exams.',
    topics: ['Reading Comprehension', 'Summary Writing', 'Directed Writing', 'Narrative & Descriptive Writing', 'Language Analysis'],
    difficulty: 'Core',
    sessions: 32,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    emoji: '📖',
    tagline: 'Texts, themes & critical writing',
    description:
      'Analyse prose, poetry and drama with confidence. Learn how to structure compelling essays and use textual evidence effectively.',
    topics: ['Prose Analysis', 'Poetry Comparison', 'Drama (Shakespeare)', 'Essay Writing', 'Unseen Texts'],
    difficulty: 'Core',
    sessions: 30,
    gradient: 'from-orange-500 to-rose-600',
    glow: 'rgba(249,115,22,0.35)',
  },
  {
    id: 'history',
    name: 'History',
    emoji: '🏛',
    tagline: 'Events, causes & consequences',
    description:
      'Navigate key 20th-century events with structured revision techniques, source analysis skills and model essay frameworks.',
    topics: ['World War I & II', 'Cold War', 'Source Analysis', 'Essay Technique', 'Modern International Relations'],
    difficulty: 'Core',
    sessions: 28,
    gradient: 'from-red-600 to-rose-700',
    glow: 'rgba(220,38,38,0.35)',
  },
  {
    id: 'geography',
    name: 'Geography',
    emoji: '🌍',
    tagline: 'Landscapes, climate & people',
    description:
      'Understand physical and human geography processes, interpret data and maps, and apply geographical concepts to case studies.',
    topics: ['Plate Tectonics', 'Rivers & Coasts', 'Population & Settlement', 'Climate & Weather', 'Economic Development'],
    difficulty: 'Core',
    sessions: 28,
    gradient: 'from-teal-600 to-cyan-700',
    glow: 'rgba(20,184,166,0.35)',
  },
  {
    id: 'economics',
    name: 'Economics',
    emoji: '📊',
    tagline: 'Markets, money & policy',
    description:
      'Grasp micro and macro-economic principles with real-world examples, graph analysis and structured evaluation techniques.',
    topics: ['Supply & Demand', 'Market Structures', 'Macroeconomics', 'International Trade', 'Development Economics'],
    difficulty: 'Extended',
    sessions: 34,
    gradient: 'from-yellow-500 to-amber-600',
    glow: 'rgba(234,179,8,0.35)',
  },
  {
    id: 'business',
    name: 'Business Studies',
    emoji: '💼',
    tagline: 'Strategy, finance & enterprise',
    description:
      'Explore business operations, marketing, HR and finance while developing the analytical and evaluative skills exam boards reward.',
    topics: ['Business Organisation', 'Marketing', 'Finance & Accounts', 'Human Resources', 'Operations Management'],
    difficulty: 'Core',
    sessions: 30,
    gradient: 'from-pink-600 to-rose-600',
    glow: 'rgba(219,39,119,0.35)',
  },
  {
    id: 'arabic',
    name: 'Arabic',
    emoji: '🌙',
    tagline: 'Language, literature & expression',
    description:
      'Strengthen reading comprehension, written expression, grammar and literary analysis for First Language and Second Language IGCSE Arabic.',
    topics: ['Reading Comprehension', 'Grammar & Syntax', 'Essay Writing', 'Literature Analysis', 'Oral Practice'],
    difficulty: 'Core',
    sessions: 26,
    gradient: 'from-indigo-600 to-violet-700',
    glow: 'rgba(99,102,241,0.35)',
  },
];

export const difficultyColors = {
  Foundation: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Core:       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Extended:   'bg-violet-500/15 text-violet-400 border-violet-500/20',
};
