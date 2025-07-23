import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

export async function GET() {
    try {
        const snapshot = await db.collection('packages').get();
        const locationsSet = new Set<string>();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.location) {
                locationsSet.add(data.location.trim());
            }
        });
        const locations = Array.from(locationsSet).sort();
        return NextResponse.json(locations, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
} 