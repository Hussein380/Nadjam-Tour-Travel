// scripts/migrate-hotel-locations.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json'); // Admin SDK key in root

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const locationMap = {
  // Nairobi
  'Nairobi': 'Nairobi',
  'NAIROBI': 'Nairobi',
  'Nairobi, Kenya': 'Nairobi',
  'Nairobi,westlands': 'Nairobi',
  'Westlands – Nairobi': 'Nairobi',
  '– Nairobi, Kenya': 'Nairobi',
  'Nairobi, Mombasa Road': 'Nairobi',
  // Mombasa
  'Mombasa': 'Mombasa',
  'Mombasa​​': 'Mombasa',
  'Bamburi Beach, Mombasa': 'Mombasa',
  'Shanzu, Mombasa': 'Mombasa',
  'Mombasa, Diani': 'Mombasa',
  // Diani
  'Diani, Mombasa': 'Diani',
  'Diani': 'Diani',
  'Diani Beach, Kenya': 'Diani',
  // Malindi
  'Malindi, Kenya': 'Malindi',
  // Watamu
  'Watamu': 'Watamu',
  // Voi
  'Voi, Kenya': 'Voi',
  // Amboseli
  'Amboseli National Park': 'Amboseli',
  // Samburu
  'Samburu National Reserve': 'Samburu',
  // Lake Nakuru
  'Lake Nakuru National Park': 'Lake Nakuru',
  // Masai Mara
  'Masai Mar': 'Masai Mara',
  'Masai Mara': 'Masai Mara',
  'Masai Mara, Kenya': 'Masai Mara',
  'Maasai Mara National Reserve': 'Masai Mara',
  // Naivasha
  'Naivasha, Kenya': 'Naivasha',
};

async function migrateLocations() {
  const snapshot = await db.collection('hotels').get();
  let updated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const currentLoc = data.location ? data.location.trim() : '';
    const newLoc = locationMap[currentLoc];
    if (newLoc && currentLoc !== newLoc) {
      await doc.ref.update({
        location: newLoc,
        location_lower: newLoc.toLowerCase(),
      });
      updated++;
      console.log(`Updated hotel ${doc.id}: "${currentLoc}" → "${newLoc}"`);
    }
  }
  console.log(`\nMigration complete! Updated ${updated} hotels.`);
  process.exit(0);
}

migrateLocations().catch(err => {
  console.error('Error migrating hotel locations:', err);
  process.exit(1);
}); 