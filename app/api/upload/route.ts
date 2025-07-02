import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(req: NextRequest) {
    console.log('[UPLOAD] Received upload request');
    const formData = await req.formData();
    const files = formData.getAll('images');
    console.log(`[UPLOAD] Number of files received: ${files.length}`);
    const urls: string[] = [];

    for (const file of files) {
        if (file instanceof File) {
            try {
                console.log(`[UPLOAD] Uploading file: ${file.name}, size: ${file.size}`);
                const buffer = Buffer.from(await file.arrayBuffer());
                const base64 = buffer.toString('base64');
                const dataUri = `data:${file.type};base64,${base64}`;
                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: 'nadjam-travel',
                });
                console.log(`[UPLOAD] Uploaded to Cloudinary: ${result.secure_url}`);
                urls.push(result.secure_url);
            } catch (err) {
                console.error('[UPLOAD] Error uploading file to Cloudinary:', err);
                throw err;
            }
        } else {
            console.warn('[UPLOAD] Skipped non-File entry in formData');
        }
    }

    console.log(`[UPLOAD] Returning URLs: ${urls.length}`);
    return NextResponse.json({ urls });
} 