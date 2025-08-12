import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET() {
    try {
        const snapshot = await db.collection('hotels').get();
        const locationsSet = new Set<string>();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.location) {
                locationsSet.add(data.location.trim());
            }
        });
        const locations = Array.from(locationsSet).sort();

        // Add cache headers - locations change less frequently
        return NextResponse.json(locations, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
} 