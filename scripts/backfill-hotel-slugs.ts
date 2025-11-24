import { admin, db } from '../lib/firebase/admin'
import { buildSlugCandidate } from '../lib/slug'

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  const sanitizedBase = baseSlug || 'hotel'
  let candidate = sanitizedBase
  let attempt = 1

  while (attempt < 50) {
    const snapshot = await db.collection('hotels').where('slug', '==', candidate).limit(1).get()
    if (snapshot.empty || snapshot.docs[0].id === excludeId) {
      return candidate
    }
    candidate = `${sanitizedBase}-${attempt}`
    attempt += 1
  }

  return `${sanitizedBase}-${Date.now()}`
}

async function backfillSlugs() {
  console.log('Starting hotel slug backfill...')
  const snapshot = await db.collection('hotels').get()
  console.log(`Found ${snapshot.size} hotel documents.`)

  let updated = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    if (data.slug) {
      continue
    }
    const candidate = buildSlugCandidate(data.name, doc.id)
    const slug = await ensureUniqueSlug(candidate, doc.id)
    const legacySlugs = Array.isArray(data.legacySlugs) ? data.legacySlugs : []

    await doc.ref.update({
      slug,
      legacySlugs,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    updated += 1
    console.log(`Slugged ${doc.id} -> ${slug}`)
  }

  console.log(`Completed. Updated ${updated} hotels.`)
}

backfillSlugs()
  .then(() => {
    console.log('Backfill complete.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Backfill failed:', error)
    process.exit(1)
  })

