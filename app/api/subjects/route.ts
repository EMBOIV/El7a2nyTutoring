import { NextRequest, NextResponse } from 'next/server';
import { getFilteredSubjects, groupSubjectsByCategory } from '@/lib/subjectFilters';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const level = searchParams.get('level');
  const grouped = searchParams.get('grouped') === 'true';

  const items = getFilteredSubjects(level);

  if (grouped) {
    return NextResponse.json(groupSubjectsByCategory(items));
  }

  return NextResponse.json({ subjects: items });
}
