import { NextRequest, NextResponse } from 'next/server';
import { groupSubjectsByCategory, searchSubjects } from '@/lib/subjectFilters';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = (searchParams.get('q') ?? '').trim();
  const level = searchParams.get('level');
  const grouped = searchParams.get('grouped') === 'true';

  if (!q) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  if (q.length > 60) {
    return NextResponse.json({ error: 'Search query is too long' }, { status: 400 });
  }

  const items = searchSubjects(q, level);

  if (grouped) {
    return NextResponse.json(groupSubjectsByCategory(items));
  }

  return NextResponse.json({ subjects: items });
}
