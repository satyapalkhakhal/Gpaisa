import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, category, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Please fill in all required fields (name, email, subject, message).' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        // Validate string lengths for security
        if (name.length > 200 || email.length > 320 || subject.length > 500 || message.length > 5000) {
            return NextResponse.json(
                { error: 'One or more fields exceed the maximum allowed length.' },
                { status: 400 }
            );
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('[CONTACT] Missing RESEND_API_KEY');
            return NextResponse.json(
                { error: 'Server configuration error. Please try again later.' },
                { status: 500 }
            );
        }

        // Send email via Resend REST API (no SDK needed)
        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'gpaisa.in Contact Form <onboarding@resend.dev>',
                to: ['contact@gpaisa.in'],
                reply_to: email,
                subject: `[Contact Form] ${subject}`,
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #059669, #047857); padding: 20px 24px; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Message — gpaisa.in</h1>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 12px; font-weight: 600; color: #374151; width: 120px; vertical-align: top;">Name</td>
                                    <td style="padding: 8px 12px; color: #1f2937;">${esc(name)}</td>
                                </tr>
                                <tr style="background: #f9fafb;">
                                    <td style="padding: 8px 12px; font-weight: 600; color: #374151; vertical-align: top;">Email</td>
                                    <td style="padding: 8px 12px; color: #1f2937;">
                                        <a href="mailto:${esc(email)}" style="color: #059669;">${esc(email)}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 12px; font-weight: 600; color: #374151; vertical-align: top;">Subject</td>
                                    <td style="padding: 8px 12px; color: #1f2937;">${esc(subject)}</td>
                                </tr>
                                ${category ? `
                                <tr style="background: #f9fafb;">
                                    <td style="padding: 8px 12px; font-weight: 600; color: #374151; vertical-align: top;">Category</td>
                                    <td style="padding: 8px 12px; color: #1f2937;">${esc(category)}</td>
                                </tr>` : ''}
                            </table>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                            <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 14px;">Message</h3>
                            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${esc(message)}</div>
                            <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
                                Sent from gpaisa.in contact form at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </p>
                        </div>
                    </div>
                `,
            }),
        });

        if (!resendResponse.ok) {
            const errBody = await resendResponse.text().catch(() => 'unknown');
            console.error('[CONTACT] Resend API error:', resendResponse.status, errBody);
            return NextResponse.json(
                { error: 'Failed to send message. Please try again.' },
                { status: 500 }
            );
        }

        const data = await resendResponse.json();
        console.log('[CONTACT] ✅ Email sent successfully, ID:', data?.id);

        return NextResponse.json(
            { message: "Message sent successfully! We'll get back to you within 24-48 hours.", status: 'success' },
            { status: 200 }
        );
    } catch (error) {
        console.error('[CONTACT] Error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

// Prevent XSS in email HTML
function esc(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
