import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const packageSchema = z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    price: z.number().min(0),
    originalPrice: z.number().min(0),
    duration: z.string().min(1),
    rating: z.number().min(0).max(5),
    reviews: z.number().min(0),
    image: z.string().url(),
    description: z.string().min(1),
    category: z.string().min(1),
    discount: z.number().min(0).max(100),
    highlights: z.array(z.string()),
    difficulty: z.string().min(1),
    groupSize: z.string().min(1),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const minPrice = searchParams.get('minPrice');
        const featured = searchParams.get('featured');
        const active = searchParams.get('active');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = adminDb().collection('packages').where('active', '==', true);

        if (category) {
            query = query.where('category', '==', category);
        }
        if (difficulty) {
            query = query.where('difficulty', '==', difficulty);
        }
        if (minPrice) {
            query = query.where('price', '>=', parseInt(minPrice));
        }
        if (featured === 'true') {
            query = query.where('featured', '==', true);
        }
        if (active === 'false') {
            query = query.where('active', '==', false);
        }

        const snapshot = await query.limit(limit).offset(offset).get();
        const packages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));

        return NextResponse.json(packages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAdmin(req);
        const body = await req.json();

        const validatedData = packageSchema.parse(body);

        const packageData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await adminDb().collection('packages').add(packageData);

        return NextResponse.json({
            id: docRef.id,
            ...packageData
        }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
} 