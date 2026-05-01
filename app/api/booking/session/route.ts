import { NextRequest, NextResponse } from 'next/server';

interface BookingSessionState {
  level?: string;
  subject?: string;
  session_type?: 'Group' | 'Private';
  time?: string;
}

const bookingSessionStore = new Map<string, BookingSessionState>();

function getOrCreateSessionId(req: NextRequest): string {
  const existing = req.cookies.get('el7a2ny_booking_session')?.value;
  if (existing) return existing;
  return crypto.randomUUID();
}

function validatePayload(body: BookingSessionState): string | null {
  if (body.level && body.level.length > 20) return 'Invalid level';
  if (body.subject && body.subject.length > 80) return 'Invalid subject';
  if (body.time && body.time.length > 80) return 'Invalid time';
  if (body.session_type && body.session_type !== 'Group' && body.session_type !== 'Private') {
    return 'Invalid session type';
  }
  return null;
}

export async function POST(req: NextRequest) {
  const sessionId = getOrCreateSessionId(req);

  try {
    const body = (await req.json()) as BookingSessionState;
    const error = validatePayload(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const previous = bookingSessionStore.get(sessionId) ?? {};
    const nextState: BookingSessionState = {
      ...previous,
      ...(body.level !== undefined ? { level: body.level } : {}),
      ...(body.subject !== undefined ? { subject: body.subject } : {}),
      ...(body.session_type !== undefined ? { session_type: body.session_type } : {}),
      ...(body.time !== undefined ? { time: body.time } : {}),
    };

    bookingSessionStore.set(sessionId, nextState);

    const response = NextResponse.json({ success: true, session: nextState });
    response.cookies.set('el7a2ny_booking_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get('el7a2ny_booking_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ session: {} });
  }

  return NextResponse.json({ session: bookingSessionStore.get(sessionId) ?? {} });
}
