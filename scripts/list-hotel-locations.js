// scripts/list-hotel-locations.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function listUniqueLocations() {
  const snapshot = await db.collection('hotels').get();
  const locations = new Set();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.location) {
      locations.add(data.location.trim());
    }
  });
  console.log('Unique hotel locations:');
  Array.from(locations).sort().forEach(loc => console.log(loc));
  console.log(`\nTotal unique locations: ${locations.size}`);
  process.exit(0);
}

listUniqueLocations().catch(err => {
  console.error('Error listing hotel locations:', err);
  process.exit(1);
}); 