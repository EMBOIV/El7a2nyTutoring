import { NextRequest, NextResponse } from 'next/server';

// Lightweight API route — no DB dependency for now
// Swap body storage for a real DB (e.g. Firebase/Supabase) in production

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    // Server-side validation (defence-in-depth — never trust client-only validation)
    if (!name?.trim())    return NextResponse.json({ error: 'Name is required' },    { status: 400 });
    if (!email?.trim())   return NextResponse.json({ error: 'Email is required' },   { status: 400 });
    if (!subject?.trim()) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitise length limits (prevent abuse)
    if (name.length    > 120) return NextResponse.json({ error: 'Name too long' },    { status: 400 });
    if (email.length   > 254) return NextResponse.json({ error: 'Email too long' },   { status: 400 });
    if (subject.length > 200) return NextResponse.json({ error: 'Subject too long' }, { status: 400 });
    if (message.length > 5000) return NextResponse.json({ error: 'Message too long' }, { status: 400 });

    // TODO: replace with real email sender (Resend, SendGrid, etc.)
    console.log('[Contact form submission]', { name, email, subject, messagePreview: message.slice(0, 60) });

    return NextResponse.json({ success: true, message: 'Message received. We will reply within 24 hours.' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
