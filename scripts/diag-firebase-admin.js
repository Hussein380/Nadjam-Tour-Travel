// Quick diagnosis for Firebase Admin env and initialization
// Safe output: does not print full secrets
// Load env from .env.local (preferred) then .env for Node scripts
try {
	require('dotenv').config({ path: '.env.local' });
	require('dotenv').config(); // fallback .env
} catch {}
const admin = require('firebase-admin');

function mask(str, show = 6) {
	if (!str) return 'MISSING';
	const head = str.slice(0, show);
	const tail = str.slice(-show);
	return `${head}...${tail} (len=${str.length})`;
}

function getEnv(name) {
	return process.env[name];
}

function normalizePrivateKey(pk) {
	if (!pk) return undefined;
	return pk.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
}

(async () => {
	const projectId = getEnv('FIREBASE_ADMIN_PROJECT_ID')?.trim();
	const clientEmail = getEnv('FIREBASE_ADMIN_CLIENT_EMAIL')?.trim();
	const privateKeyRaw = getEnv('FIREBASE_ADMIN_PRIVATE_KEY');
	const privateKey = normalizePrivateKey(privateKeyRaw);

	console.log('Firebase Admin Env Check:');
	console.log(' - FIREBASE_ADMIN_PROJECT_ID:', projectId || 'MISSING');
	console.log(' - FIREBASE_ADMIN_CLIENT_EMAIL:', clientEmail || 'MISSING');
	console.log(' - FIREBASE_ADMIN_PRIVATE_KEY:', privateKey ? mask(privateKey) : 'MISSING');

	if (!projectId || !clientEmail || !privateKey) {
		console.error('Result: Missing required env(s). Initialization will fail.');
		process.exit(1);
	}

	try {
		if (!admin.apps.length) {
			admin.initializeApp({
				credential: admin.credential.cert({
					projectId,
					clientEmail,
					privateKey,
				}),
				databaseURL: `https://${projectId}.firebaseio.com`,
			});
		}
		await admin.firestore().listCollections(); // simple call to verify access
		console.log('Result: Firebase Admin initialized successfully and Firestore is reachable.');
		process.exit(0);
	} catch (err) {
		console.error('Result: Firebase Admin initialization FAILED.');
		console.error(err?.message || err);
		process.exit(2);
	}
})();


