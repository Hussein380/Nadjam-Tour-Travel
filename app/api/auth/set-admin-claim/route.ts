import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
    try {
        // First, verify the user making this request is an authenticated admin.
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);

        // Check if the user making the request is an admin
        if (decodedToken.isAdmin !== true) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to perform this action.' }, { status: 403 });
        }

        // Get the email of the user to make an admin from the request body.
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ error: 'Email is required in the request body.' }, { status: 400 });
        }

        console.log(`Admin ${decodedToken.email} is attempting to make ${email} an admin...`);

        // Get the user by their email address.
        const user = await admin.auth().getUserByEmail(email);

        // Set the custom claim 'isAdmin' to true for that user.
        await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });

        console.log(`Successfully set isAdmin=true for user ${user.uid}`);

        return NextResponse.json({ message: `Successfully made ${email} an admin.` });

    } catch (error: any) {
        console.error('Error setting admin claim:', error);
        return NextResponse.json({ error: 'Failed to set admin claim.', details: error.message }, { status: 500 });
    }
} 