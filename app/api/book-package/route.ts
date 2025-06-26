import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
        }
        const data = await req.json();
        console.log('Package booking form data:', data);
        const {
            fullName,
            phone,
            email,
            nationality,
            travelers,
            startDate,
            special,
            payment,
            packageName,
        } = data;

        const subject = `New Package Booking Request - ${packageName} - ${fullName}`;
        const html = `
      <h2>New Package Booking Request</h2>
      <ul>
        <li><strong>Full Name:</strong> ${fullName}</li>
        <li><strong>Phone Number:</strong> ${phone}</li>
        <li><strong>Email Address:</strong> ${email}</li>
        <li><strong>Nationality:</strong> ${nationality}</li>
        <li><strong>Package Name:</strong> ${packageName}</li>
        <li><strong>Number of Travelers:</strong> ${travelers}</li>
        <li><strong>Preferred Start Date:</strong> ${startDate}</li>
        <li><strong>Special Requests:</strong> ${special || '-'}</li>
        <li><strong>Preferred Payment Method:</strong> ${payment}</li>
      </ul>
    `;

        const { data: emailData, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['nadjamtour@gmail.com'],
            subject,
            html,
            reply_to: email,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: error.message || 'Failed to send email.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Booking request sent successfully!' });
    } catch (err: any) {
        console.error('API route error:', err);
        return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
    }
} 