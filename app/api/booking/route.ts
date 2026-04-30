import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface SubjectEntry {
  subject: string;
  session: string;
}

interface BookingPayload {
  name?: string;
  email?: string;
  subjects?: SubjectEntry[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_EMAIL = 'ali.a.embaby@hotmail.com';
const ADMIN_PHONE = '01010294098';
const FROM = 'El7a2ny Tutoring <onboarding@resend.dev>';

function buildSubjectsTable(entries: SubjectEntry[]): string {
  const rows = entries.map((e, i) => `
    <tr style="background:${i % 2 === 0 ? '#F8F8F8' : '#fff'};">
      <td style="padding:10px 14px;font-weight:600;">${e.subject}</td>
      <td style="padding:10px 14px;">${e.session}</td>
    </tr>`).join('');
  return `
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr style="background:#1B2A44;">
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Subject</th>
          <th style="padding:10px 14px;text-align:left;color:#fff;font-size:13px;">Level</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const entries = body.subjects;

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    if (!entries || entries.length === 0) return NextResponse.json({ error: 'At least one subject is required' }, { status: 400 });
    if (entries.some(e => !e.subject || !e.session)) return NextResponse.json({ error: 'Each subject must have a session' }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[BOOKING] RESEND_API_KEY not set — booking logged only');
      console.log('[BOOKING]', { name, email, subjects: entries });
      return NextResponse.json({ success: true, message: 'Booking request received ✅' });
    }

    const resend = new Resend(apiKey);
    const subjectList = entries.map(e => `${e.subject} (${e.session})`).join(', ');

    const studentHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#1B2A44;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:22px;">El7a2ny Tutoring</h1>
          <p style="margin:4px 0 0;color:#F27405;font-size:13px;">IGCSE Expert Tutoring</p>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <h2 style="margin:0 0 12px;color:#1B2A44;">Booking Confirmed! ✅</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your session request${entries.length > 1 ? 's have' : ' has'} been received. We will contact you shortly to confirm.</p>
          ${buildSubjectsTable(entries)}
          <div style="background:#F8F8F8;border-left:4px solid #F27405;padding:14px 18px;border-radius:4px;margin:16px 0;">
            <p style="margin:0;font-size:13px;color:#555;">Need to reach us? Call <strong>${ADMIN_PHONE}</strong> or reply to this email.</p>
          </div>
          <p style="margin-top:24px;">Best regards,<br/><strong>El7a2ny Tutoring Team</strong></p>
        </div>
      </div>`;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:560px;margin:auto;">
        <div style="background:#F27405;padding:20px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:20px;">New Booking Request${entries.length > 1 ? ` (${entries.length} subjects)` : ''}</h1>
        </div>
        <div style="padding:32px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr style="background:#F8F8F8;"><td style="padding:10px 14px;font-weight:600;width:40%;">Student Name</td><td style="padding:10px 14px;">${name}</td></tr>
            <tr><td style="padding:10px 14px;font-weight:600;">Email</td><td style="padding:10px 14px;">${email}</td></tr>
          </table>
          ${buildSubjectsTable(entries)}
        </div>
      </div>`;

    await Promise.all([
      resend.emails.send({ from: FROM, to: email, subject: `Booking Confirmation — ${entries.length} Subject${entries.length > 1 ? 's' : ''} | El7a2ny`, html: studentHtml }),
      resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `New Booking: ${name} — ${subjectList}`, html: adminHtml }),
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

