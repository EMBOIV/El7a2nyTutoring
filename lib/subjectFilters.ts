import { subjects } from '@/lib/subjects';

export type SupportedLevel = 'OL' | 'AS' | 'A2' | 'AL';

export interface SubjectResult {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  category: string;
}

const CATEGORY_BY_SUBJECT_ID: Record<string, string> = {
  mathematics: 'Math',
  physics: 'Science',
  chemistry: 'Science',
  biology: 'Science',
  'human-biology': 'Science',
  it: 'Technology',
  'computer-science': 'Technology',
  accounting: 'Business',
  business: 'Business',
  economics: 'Business',
  'combined-science': 'Science',
  arabic: 'Languages',
  'national-arabic': 'Languages',
};

const LEVEL_SUBJECT_IDS: Record<SupportedLevel, string[]> = {
  OL: [
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'human-biology',
    'it',
    'computer-science',
    'accounting',
    'business',
    'economics',
    'combined-science',
    'arabic',
    'national-arabic',
  ],
  AS: [
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'human-biology',
    'it',
    'computer-science',
    'accounting',
    'business',
    'economics',
    'arabic',
  ],
  A2: [
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'human-biology',
    'it',
    'computer-science',
    'accounting',
    'business',
    'economics',
    'arabic',
  ],
  AL: [
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'human-biology',
    'it',
    'computer-science',
    'accounting',
    'business',
    'economics',
    'arabic',
  ],
};

function normalizeLevel(level?: string | null): SupportedLevel | null {
  if (!level) return null;
  const normalized = level.trim().toUpperCase();
  if (normalized === 'OL' || normalized === 'AS' || normalized === 'A2' || normalized === 'AL') {
    return normalized;
  }
  if (normalized === 'IGCSE') {
    // Backward compatibility for older clients.
    return 'OL';
  }
  return null;
}

export function getFilteredSubjects(level?: string | null): SubjectResult[] {
  const resolvedLevel = normalizeLevel(level);
  const allowed = resolvedLevel ? new Set(LEVEL_SUBJECT_IDS[resolvedLevel]) : null;

  return subjects
    .filter(subject => (allowed ? allowed.has(subject.id) : true))
    .map(subject => ({
      id: subject.id,
      name: subject.name,
      emoji: subject.emoji,
      tagline: subject.tagline,
      category: CATEGORY_BY_SUBJECT_ID[subject.id] ?? 'Other',
    }));
}

export function searchSubjects(query: string, level?: string | null): SubjectResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getFilteredSubjects(level).filter(subject => {
    const haystack = `${subject.name} ${subject.tagline} ${subject.category}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function groupSubjectsByCategory(subjectList: SubjectResult[]): Record<string, string[]> {
  return subjectList.reduce<Record<string, string[]>>((acc, subject) => {
    if (!acc[subject.category]) {
      acc[subject.category] = [];
    }
    acc[subject.category].push(subject.name);
    return acc;
  }, {});
}
