import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const ADMIN_EMAIL = 'ali.a.embaby@hotmail.com';
const FROM = 'El7a2ny Tutoring <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name?: string; phone?: string };
    const name = body.name?.trim();
    const phone = body.phone?.trim();

    if (!name || !phone) return NextResponse.json({ ok: false }, { status: 400 });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('[LEAD]', { name, phone });
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Lead: ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1B2A44;max-width:480px;margin:auto;">
          <div style="background:#1B2A44;padding:18px 28px;border-radius:10px 10px 0 0;">
            <h2 style="margin:0;color:#F27405;font-size:17px;">New Booking Lead</h2>
          </div>
          <div style="padding:24px 28px;border:1px solid #E6E6E6;border-top:none;border-radius:0 0 10px 10px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr style="background:#F8F8F8;">
                <td style="padding:10px 14px;font-weight:600;width:40%;">Name</td>
                <td style="padding:10px 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-weight:600;">Phone</td>
                <td style="padding:10px 14px;">${phone}</td>
              </tr>
            </table>
            <p style="margin-top:18px;font-size:13px;color:#64748B;">This lead just started the booking flow — subjects not selected yet.</p>
          </div>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[LEAD API ERROR]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
