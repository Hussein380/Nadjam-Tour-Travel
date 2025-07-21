// scripts/migrate-hotels-lowercase.js

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateHotels() {
  const hotelsSnapshot = await db.collection('hotels').get();
  const batch = db.batch();
  let count = 0;

  hotelsSnapshot.forEach(doc => {
    const data = doc.data();
    const nameLower = data.name ? data.name.toLowerCase() : '';
    const locationLower = data.location ? data.location.toLowerCase() : '';
    batch.update(doc.ref, { name_lower: nameLower, location_lower: locationLower });
    count++;
  });

  await batch.commit();
  console.log(`Migration complete! Updated ${count} hotels.`);
}

migrateHotels().catch(console.error); 