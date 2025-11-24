import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase/admin';
import cloudinary from 'cloudinary';
import { z } from 'zod';
import type { Query } from 'firebase-admin/firestore';
import { buildSlugCandidate, slugify } from '@/lib/slug';

const hotelSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  price: z.number().min(0),
  originalPrice: z.number().min(0),
  image: z.string().url(),
  amenities: z.array(z.string()),
  description: z.string().min(1),
  category: z.string().min(1),
  discount: z.number().min(0).max(100),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  slug: z.string().optional(),
});

// Configure Cloudinary with your server-side credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload image stream to Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  // We need to convert the file to a buffer to upload it
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(fileUri, {
      folder: 'nadjam-travel', // Optional: saves to a specific folder in Cloudinary
    })
      .then(result => {
        console.log('Cloudinary upload successful:', result.secure_url);
        resolve(result.secure_url);
      })
      .catch(error => {
        console.error('Cloudinary upload failed:', error);
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startAfter = searchParams.get('startAfter');
    // New filter params
    const search = searchParams.get('search');
    const amenities = searchParams.get('amenities');
    const hotelTypes = searchParams.get('hotelTypes');
    const location = searchParams.get('location');

    let query: Query = db.collection('hotels').orderBy('createdAt', 'desc');
    if (active !== 'all') {
      query = query.where('active', '==', active === 'false' ? false : true);
    }
    if (city) {
      query = query.where('location', '>=', city).where('location', '<=', city + '\uf8ff');
    }
    if (minPrice) {
      query = query.where('price', '>=', parseInt(minPrice));
    }
    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      query = query.where('name_lower', '>=', searchLower).where('name_lower', '<=', searchLower + '\uf8ff');
    }
    if (location) {
      const locationLower = location.toLowerCase();
      query = query.where('location_lower', '==', locationLower);
    }
    if (amenities) {
      const amenitiesArr = amenities.split(',');
      query = query.where('amenities', 'array-contains-any', amenitiesArr);
    }
    if (hotelTypes) {
      const typesArr = hotelTypes.split(',');
      query = query.where('types', 'array-contains-any', typesArr);
    }
    if (startAfter) {
      const startAfterDate = new Date(startAfter);
      query = query.startAfter(startAfterDate);
    }

    const snapshot = await query.limit(limit).get();
    if (snapshot.empty) {
      return NextResponse.json([], {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
    const hotels = snapshot.docs.map(doc => {
      const data = doc.data();
      const safeSlug = data.slug || buildSlugCandidate(data.name, doc.id);
      return {
        id: doc.id,
        ...data,
        slug: safeSlug,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    });

    // Add cache headers for better performance
    return NextResponse.json(hotels, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error in GET /api/hotels:', error);
    return NextResponse.json({ error: 'A server error occurred while fetching hotels.' }, { status: 500 });
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
    console.log('Received POST /api/hotels body:', body);

    const docRef = db.collection('hotels').doc();
    const slugInput = typeof body.slug === 'string' ? body.slug : body.name;
    const slugCandidate = buildSlugCandidate(slugInput, docRef.id);
    const slug = await ensureUniqueSlug(slugCandidate, docRef.id);

    const finalHotelData = {
      ...body,
      images: Array.isArray(body.images) ? body.images : [],
      price: parseFloat(body.price),
      originalPrice: parseFloat(body.originalPrice),
      discount: parseInt(body.discount, 10),
      rating: parseFloat(body.rating),
      reviews: parseInt(body.reviews, 10),
      featured: body.featured === true || body.featured === 'true',
      active: body.active === true || body.active === 'true',
      amenities: Array.isArray(body.amenities)
        ? body.amenities
        : typeof body.amenities === 'string'
          ? body.amenities.split(',').map((a: string) => a.trim())
          : [],
      types: Array.isArray(body.types) ? body.types : [],
      name_lower: body.name ? body.name.toLowerCase() : '',
      location_lower: body.location ? body.location.toLowerCase() : '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      slug,
      legacySlugs: [],
    };
    console.log('finalHotelData to be saved:', finalHotelData);

    await docRef.set(finalHotelData);

    return NextResponse.json({ message: 'Hotel created successfully!', id: docRef.id, slug }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hotel:', error);
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
} 