import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

type SessionOption = 'June / July' | 'October / November' | 'January';

interface BookingPayload {
  subject?: string;
  session?: SessionOption;
  name?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_EMAIL = 'ali.a.embaby@hotmail.com';
const ADMIN_PHONE = '01010294098';
const FROM = 'El7a2ny Tutoring <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingPayload;
    const subject = body.subject?.trim();
    const session = body.session?.trim() as SessionOption | undefined;
    const name = body.name?.trim();
    const email = body.email?.trim();

    if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    if (!session) return NextResponse.json({ error: 'Session is required' }, { status: 400 });
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[BOOKING] RESEND_API_KEY not set — booking logged only');
      console.log('[BOOKING]', { name, email, subject, session });
      return NextResponse.json({ success: true, message: 'Booking request received ✅' });
    }

    const resend = new Resend(apiKey);

    const studentHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Booking Confirmed! ✅</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your session request has been received. We will contact you shortly to confirm your booking.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Subject</td><td style="padding:10px 14px;">${subject}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Exam Session</td><td style="padding:10px 14px;">${session}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">Contact Phone</td><td style="padding:10px 14px;">${ADMIN_PHONE}</td></tr>
          </table>
          <p style="color:#555;font-size:13px;">If you have any questions, reply to this email or call us at ${ADMIN_PHONE}.</p>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Request</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Student Name</td><td style="padding:10px 14px;">${name}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;">${email}</td></tr>
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;">Subject</td><td style="padding:10px 14px;">${subject}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Exam Session</td><td style="padding:10px 14px;">${session}</td></tr>
          </table>
        </div>
      </div>`;

    await Promise.all([
      resend.emails.send({ from: FROM, to: email, subject: 'Booking Confirmation - El7a2ny Tutoring', html: studentHtml }),
      resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `New Booking: ${name} — ${subject}`, html: adminHtml }),
    ]);

    return NextResponse.json({ success: true, message: 'Booking request sent successfully ✅' });
  } catch (error) {
    console.error('[BOOKING API ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
