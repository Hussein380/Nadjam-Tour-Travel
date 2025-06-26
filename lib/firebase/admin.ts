import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// This function correctly handles the newline characters in the private key
// when it's loaded from an environment variable.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

// This check prevents the app from crashing during hot-reloads in development.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
            databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
        // Log the detailed error to the server console to help debug.
        console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    }
}

const db = getFirestore();
// Export the initialized admin instance and Firestore database.
export { admin, db }; 