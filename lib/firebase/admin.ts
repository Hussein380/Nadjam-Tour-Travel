import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Normalize envs and handle Windows/PowerShell newline escaping in the private key
const envProjectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
const envClientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
// Some hosts wrap the key in quotes; strip leading/trailing quotes and fix newlines
const envPrivateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const envPrivateKey = envPrivateKeyRaw
	? envPrivateKeyRaw.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
	: undefined;

// Initialize once; fail fast if misconfigured so callers don't continue with undefined app
if (!admin.apps.length) {
	try {
		// Validate required envs early for clearer errors
		if (!envProjectId || !envClientEmail || !envPrivateKey) {
			throw new Error(
				`Missing Firebase Admin envs. ` +
				`Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY`
			);
		}

		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: envProjectId,
				clientEmail: envClientEmail,
				privateKey: envPrivateKey,
			}),
			databaseURL: `https://${envProjectId}.firebaseio.com`,
		});
		console.log('Firebase Admin SDK initialized successfully.');
	} catch (error: any) {
		// Surface the error and stop further use instead of swallowing and crashing later
		console.error('CRITICAL: Firebase Admin SDK initialization failed. Error:', error?.message || error);
		throw error;
	}
}

const db = getFirestore();
export { admin, db };