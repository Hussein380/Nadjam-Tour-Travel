import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase/admin';
import { v2 as cloudinary } from 'cloudinary';
import { buildSlugCandidate } from '@/lib/slug';

// Configure Cloudinary with your server-side credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Helper function to upload image stream to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileUri, {
            folder: 'nadjam-travel',
        })
            .then(result => {
                resolve(result.secure_url);
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const sanitizedBase = baseSlug || 'hotel';
    let candidate = sanitizedBase;
    let attempt = 1;

    while (attempt < 50) {
        const snapshot = await db.collection('hotels').where('slug', '==', candidate).limit(1).get();
        if (snapshot.empty || snapshot.docs[0].id === excludeId) {
            return candidate;
        }
        candidate = `${sanitizedBase}-${attempt}`;
        attempt += 1;
    }

    return `${sanitizedBase}-${Date.now()}`;
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    // Fix for Next.js 13+ app directory: await params if needed
    const params = await (context.params instanceof Promise ? context.params : Promise.resolve(context.params));
    try {
        // Public GET: do not require authentication
        const doc = await db.collection('hotels').doc(params.id).get();
        if (!doc.exists) {
            return NextResponse.json({ error: 'Hotel not found' }, {
                status: 404,
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
                }
            });
        }
        const data = doc.data() || {};
        if (!data.slug) {
            const slugCandidate = buildSlugCandidate(data.name, doc.id);
            data.slug = await ensureUniqueSlug(slugCandidate, doc.id);
            await doc.ref.update({
                slug: data.slug,
                legacySlugs: Array.isArray(data.legacySlugs) ? data.legacySlugs : [],
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        const hotel = {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate(),
            updatedAt: data?.updatedAt?.toDate(),
        };

        // Add cache headers for better performance
        return NextResponse.json(hotel, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    // Fix for Next.js 13+ app directory: await params if needed
    const params = await (context.params instanceof Promise ? context.params : Promise.resolve(context.params));
    try {
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(token);
        const hotelId = params.id;
        const docRef = db.collection('hotels').doc(hotelId);
        const existingDoc = await docRef.get();
        if (!existingDoc.exists) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
        }
        const existingData = existingDoc.data() || {};
        let hotelData: any = {};
        let imageUrl: string | undefined = undefined;
        let imageFile: File | null = null;
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            hotelData = await req.json();
        } else if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            for (const [key, value] of formData.entries()) {
                if (key === 'image') {
                    imageFile = value as File;
                } else {
                    hotelData[key] = value;
                }
            }
            // If a new image is provided, upload it.
            if (imageFile && imageFile.size > 0) {
                imageUrl = await uploadToCloudinary(imageFile);
            }
        } else {
            return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
        }
        // Build update object dynamically: only include fields present in the request
        const finalHotelData: any = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        if ('price' in hotelData) finalHotelData.price = parseFloat(hotelData.price);
        if ('originalPrice' in hotelData) finalHotelData.originalPrice = parseFloat(hotelData.originalPrice);
        if ('discount' in hotelData) finalHotelData.discount = parseInt(hotelData.discount, 10);
        if ('rating' in hotelData) finalHotelData.rating = parseFloat(hotelData.rating);
        if ('reviews' in hotelData) finalHotelData.reviews = parseInt(hotelData.reviews, 10);
        if ('featured' in hotelData) finalHotelData.featured = hotelData.featured === true || hotelData.featured === 'true';
        if ('active' in hotelData) finalHotelData.active = hotelData.active === true || hotelData.active === 'true';
        if ('amenities' in hotelData) {
            finalHotelData.amenities = Array.isArray(hotelData.amenities)
                ? hotelData.amenities
                : (typeof hotelData.amenities === 'string' ? hotelData.amenities.split(',').map((a: string) => a.trim()) : []);
        }
        if ('types' in hotelData) finalHotelData.types = Array.isArray(hotelData.types) ? hotelData.types : [];
        // Add any other fields present in hotelData that aren't already handled
        Object.keys(hotelData).forEach(key => {
            if (key === 'slug') return;
            if (!(key in finalHotelData)) {
                finalHotelData[key] = hotelData[key];
            }
        });
        if (imageUrl) {
            finalHotelData.image = imageUrl;
        }
        if (typeof hotelData.slug === 'string' && hotelData.slug.trim().length > 0) {
            const targetSlug = buildSlugCandidate(hotelData.slug, hotelId);
            if (!existingData.slug || targetSlug !== existingData.slug) {
                finalHotelData.slug = await ensureUniqueSlug(targetSlug, hotelId);
                const legacy = Array.isArray(existingData.legacySlugs) ? existingData.legacySlugs : [];
                const nextLegacy = new Set(legacy);
                if (existingData.slug) {
                    nextLegacy.add(existingData.slug);
                }
                if (nextLegacy.size > 0) {
                    finalHotelData.legacySlugs = Array.from(nextLegacy);
                }
            }
        } else if (!existingData.slug) {
            const fallbackSlug = buildSlugCandidate(existingData.name ?? finalHotelData.name, hotelId);
            finalHotelData.slug = await ensureUniqueSlug(fallbackSlug, hotelId);
            if (existingData.legacySlugs) {
                finalHotelData.legacySlugs = existingData.legacySlugs;
            }
        }
        await docRef.update(finalHotelData);
        return NextResponse.json({ message: 'Hotel updated successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error(`Error updating hotel ${context.params.id}:`, error);
        if (error.code === 'auth/id-token-expired') {
            return NextResponse.json({ error: 'Authentication token has expired. Please log in again.' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to update hotel.' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Standardized authentication block
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(token);

        // True delete - remove the document from Firestore
        await db.collection('hotels').doc(params.id).delete();

        return NextResponse.json({ message: 'Hotel deleted successfully' });
    } catch (error: any) {
        console.error(`Error deleting hotel ${params.id}:`, error);
        if (error.code === 'auth/id-token-expired') {
            return NextResponse.json({ error: 'Authentication token has expired. Please log in again.' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 });
    }
} 