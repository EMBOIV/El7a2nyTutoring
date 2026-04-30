import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface SignupPayload {
  name?: string;
  email?: string;
  phone?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+[1-9]\d{7,14}$/;
const FROM = 'El7a2ny Tutoring <onboarding@resend.dev>';

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SignupPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = normalizePhone(body.phone ?? '');

    if (!name || !email || !EMAIL_RE.test(email) || !phone || !PHONE_RE.test(phone)) {
      return NextResponse.json({ error: 'Name, valid email, and WhatsApp number with country code are required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    const welcomeHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Welcome to El7a2ny! 🎓</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your account has been created successfully. You can now book IGCSE tutoring sessions and track your progress from your dashboard.</p>
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:16px 20px;border-radius:4px;margin:20px 0;">
            <p style="margin:0;font-weight:600;color:#1B2A44;">Next Steps</p>
            <p style="margin:8px 0 0;font-size:14px;color:#555;">Browse subjects → Choose your exam session → Book a tutoring session</p>
          </div>
          <p style="color:#555;font-size:13px;">If you have any questions, feel free to contact us.</p>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`;

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Welcome to El7a2ny Tutoring! 🎓',
      html: welcomeHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SIGNUP EMAIL ERROR]', error);
    // Don't fail signup if email fails
    return NextResponse.json({ success: true });
  }
}
