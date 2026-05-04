import { subjects } from '@/lib/subjects';
import type { EducationSystem } from '@/lib/subjects';

export type SupportedLevel = 'OL' | 'AS' | 'A2' | 'AL';

export interface SubjectResult {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  category: string;
  system: EducationSystem;
}

function normalizeLevel(level?: string | null): SupportedLevel | null {
  if (!level) return null;
  const normalized = level.trim().toUpperCase();
  if (normalized === 'OL' || normalized === 'AS' || normalized === 'A2' || normalized === 'AL') return normalized;
  if (normalized === 'IGCSE') return 'OL';
  return null;
}

// Category grouping within IGCSE system (for backward compat)
const IGCSE_CATEGORY: Record<string, string> = {
  mathematics: 'Math', physics: 'Science', chemistry: 'Science', biology: 'Science',
  'human-biology': 'Science', it: 'Technology', 'computer-science': 'Technology',
  accounting: 'Business', business: 'Business', economics: 'Business',
  'combined-science': 'Science', arabic: 'Languages', 'national-arabic': 'Languages',
};

export function getFilteredSubjects(level?: string | null): SubjectResult[] {
  const resolvedLevel = normalizeLevel(level);
  return subjects
    .filter(s => resolvedLevel ? s.system === 'IGCSE' : true)
    .map(s => ({
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      tagline: s.tagline,
      category: IGCSE_CATEGORY[s.id] ?? s.system,
      system: s.system,
    }));
}

export function getSubjectsBySystem(system?: EducationSystem | null): SubjectResult[] {
  return subjects
    .filter(s => system ? s.system === system : true)
    .map(s => ({
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      tagline: s.tagline,
      category: IGCSE_CATEGORY[s.id] ?? s.system,
      system: s.system,
    }));
}

export function searchSubjects(query: string, level?: string | null): SubjectResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getFilteredSubjects(level).filter(s => {
    const haystack = `${s.name} ${s.tagline} ${s.category} ${s.system}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function groupSubjectsByCategory(subjectList: SubjectResult[]): Record<string, string[]> {
  return subjectList.reduce<Record<string, string[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {});
}

export function groupSubjectsBySystem(subjectList: SubjectResult[]): Record<string, SubjectResult[]> {
  return subjectList.reduce<Record<string, SubjectResult[]>>((acc, s) => {
    if (!acc[s.system]) acc[s.system] = [];
    acc[s.system].push(s);
    return acc;
  }, {});
}


