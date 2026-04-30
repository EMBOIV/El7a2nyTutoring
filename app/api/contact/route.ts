import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+[1-9]\d{7,14}$/;
const ADMIN_EMAIL = 'ali.a.embaby@hotmail.com';
const FROM = 'El7a2ny Tutoring <onboarding@resend.dev>';

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone: rawPhone, subject, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };
    const phone = normalizePhone(rawPhone ?? '');

    if (!name?.trim())    return NextResponse.json({ error: 'Name is required' },    { status: 400 });
    if (!email?.trim())   return NextResponse.json({ error: 'Email is required' },   { status: 400 });
    if (!phone)           return NextResponse.json({ error: 'WhatsApp number is required' }, { status: 400 });
    if (!subject?.trim()) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!PHONE_RE.test(phone)) {
      return NextResponse.json({ error: 'Invalid WhatsApp number format (use country code)' }, { status: 400 });
    }

    if (name.length    > 120) return NextResponse.json({ error: 'Name too long' },    { status: 400 });
    if (email.length   > 254) return NextResponse.json({ error: 'Email too long' },   { status: 400 });
    if (phone.length > 20) return NextResponse.json({ error: 'Phone too long' }, { status: 400 });
    if (subject.length > 200) return NextResponse.json({ error: 'Subject too long' }, { status: 400 });
    if (message.length > 5000) return NextResponse.json({ error: 'Message too long' }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[CONTACT] RESEND_API_KEY not set — submission logged only');
      console.log('[CONTACT]', { name, email, phone, subject, messagePreview: message.slice(0, 60) });
      return NextResponse.json({ success: true, message: 'Message received. We will reply within 24 hours.' });
    }

    const resend = new Resend(apiKey);

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Contact Message</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:30%;">From</td><td style="padding:10px 14px;">${name}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;"><a href="mailto:${email}" style="color:#F27405;">${email}</a></td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">WhatsApp</td><td style="padding:10px 14px;">${phone}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">Subject</td><td style="padding:10px 14px;">${subject}</td></tr>
          </table>
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:16px 20px;border-radius:4px;">
            <p style="margin:0;white-space:pre-wrap;font-size:14px;color:#333;">${message}</p>
          </div>
        </div>
      </div>`;

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Contact: ${subject} — from ${name}`,
      html: adminHtml,
      replyTo: email,
    });

    return NextResponse.json({ success: true, message: 'Message received. We will reply within 24 hours.' });
  } catch (error) {
    console.error('[CONTACT API ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
