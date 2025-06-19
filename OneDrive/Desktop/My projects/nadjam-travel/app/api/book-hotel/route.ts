import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        // Debug: Log API key presence
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
        }
        const data = await req.json();
        console.log('Booking form data:', data);
        const {
            fullName,
            phone,
            email,
            nationality,
            hotelName,
            roomType,
            guests,
            rooms,
            checkin,
            checkout,
            special,
            payment,
        } = data;

        const subject = `New Hotel Booking Request - ${hotelName} - ${fullName}`;
        const html = `
      <h2>New Hotel Booking Request</h2>
      <ul>
        <li><strong>Full Name:</strong> ${fullName}</li>
        <li><strong>Phone Number:</strong> ${phone}</li>
        <li><strong>Email Address:</strong> ${email}</li>
        <li><strong>Nationality:</strong> ${nationality}</li>
        <li><strong>Hotel Name:</strong> ${hotelName}</li>
        <li><strong>Room Type:</strong> ${roomType || '-'}</li>
        <li><strong>Number of Guests:</strong> ${guests}</li>
        <li><strong>Number of Rooms:</strong> ${rooms}</li>
        <li><strong>Check-in Date:</strong> ${checkin}</li>
        <li><strong>Check-out Date:</strong> ${checkout}</li>
        <li><strong>Special Requests:</strong> ${special || '-'}</li>
        <li><strong>Preferred Payment Method:</strong> ${payment}</li>
      </ul>
    `;

        const { data: emailData, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Use default sender for testing
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