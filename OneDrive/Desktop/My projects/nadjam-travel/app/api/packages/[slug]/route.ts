import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdmin } from '@/lib/auth';
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
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    discount: z.number().min(0).max(100).optional(),
    highlights: z.array(z.string()).optional(),
    difficulty: z.string().min(1).optional(),
    groupSize: z.string().min(1).optional(),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const snapshot = await adminDb()
            .collection('packages')
            .where('slug', '==', params.slug)
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
    try {
        const user = await verifyAdmin(req);
        const body = await req.json();

        const validatedData = packageUpdateSchema.parse(body);

        const updateData = {
            ...validatedData,
            updatedAt: new Date(),
        };

        // Find the document by slug first
        const snapshot = await adminDb()
            .collection('packages')
            .where('slug', '==', params.slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const docId = snapshot.docs[0].id;
        await adminDb().collection('packages').doc(docId).update(updateData);

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
    try {
        const user = await verifyAdmin(req);

        // Find the document by slug first
        const snapshot = await adminDb()
            .collection('packages')
            .where('slug', '==', params.slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const docId = snapshot.docs[0].id;

        // Soft delete - set active and featured to false
        await adminDb().collection('packages').doc(docId).update({
            active: false,
            featured: false,
            updatedAt: new Date(),
        });

        return NextResponse.json({ message: 'Package deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
} 