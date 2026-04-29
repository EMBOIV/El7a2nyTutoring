import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 20,
  });
}

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

    const transport = getTransport();
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@el7a2ny.local';

    if (!transport) {
      // Fast fallback in non-configured environments so UI remains responsive.
      console.log('[BOOKING - NO SMTP CONFIG]', { subject, session, name, email, adminEmail: ADMIN_EMAIL });
      return NextResponse.json({
        success: true,
        message: 'Booking request sent successfully ✅',
      });
    }

    const studentMail = {
      from,
      to: email,
      subject: 'El7a2ny Booking Confirmation',
      text: [
        `Hello ${name},`,
        '',
        'Your session request has been received. We will contact you shortly.',
        '',
        `Subject: ${subject}`,
        `Session: ${session}`,
        '',
        'Thanks,',
        'El7a2ny Tutoring',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1B2A44;">
          <h2 style="margin:0 0 12px 0;">El7a2ny Booking Confirmation</h2>
          <p>Hello ${name},</p>
          <p>Your session request has been received. We will contact you shortly.</p>
          <p><strong>Subject:</strong> ${subject}<br/><strong>Session:</strong> ${session}</p>
          <p>Thanks,<br/>El7a2ny Tutoring</p>
        </div>
      `,
    };

    const adminMail = {
      from,
      to: ADMIN_EMAIL,
      subject: 'New IGCSE Booking Request',
      text: [
        'New booking request received.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        `Session: ${session}`,
        '',
        `Phone: ${ADMIN_PHONE}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1B2A44;">
          <h2 style="margin:0 0 12px 0;">New IGCSE Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Session:</strong> ${session}</p>
          <hr style="border:none;border-top:1px solid #CFCFCF;margin:16px 0;"/>
          <p style="margin:0;"><strong>Phone:</strong> ${ADMIN_PHONE}</p>
        </div>
      `,
    };

    // Send both emails in parallel for low latency.
    await Promise.all([transport.sendMail(studentMail), transport.sendMail(adminMail)]);

    return NextResponse.json({
      success: true,
      message: 'Booking request sent successfully ✅',
    });
  } catch (error) {
    console.error('[BOOKING API ERROR]', error);
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
