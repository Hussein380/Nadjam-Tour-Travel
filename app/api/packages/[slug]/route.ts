import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase/admin';
import { z } from 'zod';

const packageUpdateSchema = z.object({
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    originalPrice: z.number().min(0).optional(),
    duration: z.string().min(1).optional(),
    rating: z.number().min(0).max(5).optional(),
    reviews: z.number().min(0).optional(),
    image: z.string().url().optional(),
    images: z.array(z.string().url()).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    discount: z.number().min(0).max(100).optional(),
    highlights: z.array(z.string()).optional(),
    difficulty: z.string().min(1).optional(),
    groupSize: z.string().min(1).optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
    itinerary: z.array(z.object({ day: z.number(), title: z.string(), description: z.string() })).optional(),
    inclusions: z.array(z.string()).optional(),
    exclusions: z.array(z.string()).optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;
    try {
        const snapshot = await db
            .collection('packages')
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const doc = snapshot.docs[0];
        const packageData = {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data()?.createdAt?.toDate(),
            updatedAt: doc.data()?.updatedAt?.toDate(),
        };

        return NextResponse.json(packageData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;
    try {
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(token);

        const body = await req.json();

        const validatedData = packageUpdateSchema.parse(body);
        console.log('PUT validatedData:', validatedData);

        // Prefer images array, fallback to single image
        const updateData: any = {
            ...validatedData,
            updatedAt: new Date(),
        };
        if (validatedData.images && validatedData.images.length > 0) {
            updateData.image = validatedData.images[0];
        } else if (validatedData.image) {
            updateData.image = validatedData.image;
        }
        // Update lowercase fields for search
        if (validatedData.title) {
            updateData.title_lower = validatedData.title.toLowerCase();
        }
        if (validatedData.location) {
            updateData.location_lower = validatedData.location.toLowerCase();
        }
        console.log('PUT updateData:', updateData);

        // Find the document by slug first
        const snapshot = await db
            .collection('packages')
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const docId = snapshot.docs[0].id;
        await db.collection('packages').doc(docId).update(updateData);

        return NextResponse.json({
            id: docId,
            ...updateData
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;
    try {
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(token);

        // Find the document by slug first
        const snapshot = await db
            .collection('packages')
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const docId = snapshot.docs[0].id;

        // Hard delete - remove the document from Firestore
        await db.collection('packages').doc(docId).delete();

        return NextResponse.json({ message: 'Package deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
} 