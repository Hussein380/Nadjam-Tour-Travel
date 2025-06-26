import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com" // Optional, if using RTDB
    });
}

export const adminDb = () => admin.firestore();
export { admin }; 