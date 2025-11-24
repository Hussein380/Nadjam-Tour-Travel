import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { buildSlugCandidate } from '@/lib/slug'

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const params = await (context.params instanceof Promise ? context.params : Promise.resolve(context.params))
  const rawSlug = params.slug || ''
  const normalizedSlug = buildSlugCandidate(rawSlug, rawSlug)

  try {
    const hotelsCollection = db.collection('hotels')
    let snapshot = await hotelsCollection.where('slug', '==', normalizedSlug).limit(1).get()

    if (snapshot.empty) {
      snapshot = await hotelsCollection.where('legacySlugs', 'array-contains', normalizedSlug).limit(1).get()
    }

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Hotel not found' }, {
        status: 404,
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        },
      })
    }

    const doc = snapshot.docs[0]
    const data = doc.data()
    const hotel = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    }

    return NextResponse.json(hotel, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching hotel by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 })
  }
}

