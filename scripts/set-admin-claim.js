const admin = require('firebase-admin');

// IMPORTANT: Make sure you have the firebase-admin-key.json file in your project root
// You can download this from your Firebase project settings > Service accounts
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Please provide an email address as an argument.');
    console.error('Usage: node scripts/set-admin-claim.js admin@example.com');
    process.exit(1);
  }

  try {
    console.log(`Fetching user for email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    
    // This is where we set the custom claim.
    await admin.auth().setCustomUserClaims(user.uid, { isAdmin: true });
    
    console.log(`✅ Success! Admin claim set for ${email}.`);
    console.log('IMPORTANT: The user must log out and log back in for the changes to take effect.');

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: User with email "${email}" not found in Firebase Authentication.`);
      console.log('Please ensure the user has been created in the Firebase Console first.');
    } else {
      console.error('❌ An error occurred:');
      console.error(error);
    }
    process.exit(1);
  }

  process.exit(0);
}

setAdminClaim(); 