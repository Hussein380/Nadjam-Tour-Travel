import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase/admin';
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
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    description: z.string().min(1),
    category: z.string().min(1),
    discount: z.number().min(0).max(100),
    highlights: z.array(z.string()),
    difficulty: z.string().min(1),
    groupSize: z.string().min(1),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    types: z.array(z.string()).optional(),
    itinerary: z.array(z.object({ day: z.number(), title: z.string(), description: z.string() })).optional(),
    inclusions: z.array(z.string()).optional(),
    exclusions: z.array(z.string()).optional(),
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
        const startAfter = searchParams.get('startAfter');
        // Remove offset

        let query = db.collection('packages').where('active', '==', true);

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

        const search = searchParams.get('search');
        const location = searchParams.get('location');

        if (search) {
            const searchLower = search.toLowerCase();
            query = query.where('title_lower', '>=', searchLower).where('title_lower', '<=', searchLower + '\uf8ff');
        }
        if (location) {
            const locationLower = location.toLowerCase();
            query = query.where('location_lower', '==', locationLower);
        }

        // Add orderBy for cursor-based pagination
        if (search) {
            query = query.orderBy('title_lower').orderBy('createdAt', 'desc');
        } else {
            query = query.orderBy('createdAt', 'desc');
        }

        // Apply startAfter if provided
        if (startAfter) {
            const startAfterDate = new Date(startAfter);
            query = query.startAfter(startAfterDate);
        }

        const snapshot = await query.limit(limit).get();
        const packages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));

        // Add cache headers for better performance
        return NextResponse.json(packages, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
        });
    } catch (error) {
        console.error('API /api/packages error:', error);
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(token);

        const body = await req.json();

        // Normalize fields like hotels
        const normalized = {
            ...body,
            images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
            price: body.price !== undefined ? parseFloat(body.price) : 0,
            originalPrice: body.originalPrice !== undefined ? parseFloat(body.originalPrice) : 0,
            discount: body.discount !== undefined ? parseInt(body.discount, 10) : 0,
            rating: body.rating !== undefined ? parseFloat(body.rating) : 0,
            reviews: body.reviews !== undefined ? parseInt(body.reviews, 10) : 0,
            featured: body.featured === true || body.featured === 'true',
            active: body.active === true || body.active === 'true',
            highlights: Array.isArray(body.highlights)
                ? body.highlights
                : (typeof body.highlights === 'string' && body.highlights.length > 0 ? body.highlights.split(',').map((h: string) => h.trim()) : []),
            types: Array.isArray(body.types) ? body.types : (body.types ? [body.types] : []),
            itinerary: Array.isArray(body.itinerary) ? body.itinerary : (body.itinerary ? [body.itinerary] : []),
            inclusions: Array.isArray(body.inclusions) ? body.inclusions : (body.inclusions ? [body.inclusions] : []),
            exclusions: Array.isArray(body.exclusions) ? body.exclusions : (body.exclusions ? [body.exclusions] : []),
        };
        console.log('Normalized package data:', normalized);

        let validatedData;
        try {
            validatedData = packageSchema.parse(normalized);
        } catch (zodError) {
            console.error('Zod validation error:', zodError);
            return NextResponse.json({ error: 'Validation failed', details: zodError.errors }, { status: 400 });
        }

        // Prefer images array, fallback to single image, fallback to placeholder
        const packageData = {
            ...validatedData,
            image: validatedData.images && validatedData.images.length > 0 ? validatedData.images[0] : '/placeholder.svg',
            title_lower: validatedData.title.toLowerCase(),
            location_lower: validatedData.location.toLowerCase(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await db.collection('packages').add(packageData);

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