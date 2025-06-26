import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { File as FormidableFile } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

type FormidableParseResult = { fields: Record<string, any>; files: Record<string, FormidableFile | FormidableFile[] | undefined> };

function formidableParse(req: NextApiRequest): Promise<FormidableParseResult> {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { files } = await formidableParse(req);
        let fileArray: FormidableFile[] = [];
        if (Array.isArray(files.images)) {
            fileArray = files.images;
        } else if (files.images) {
            fileArray = [files.images];
        } else if (files.image) {
            fileArray = Array.isArray(files.image) ? files.image : [files.image];
        }
        if (!fileArray.length) {
            return res.status(400).json({ error: 'No image files provided' });
        }
        const uploadResults = await Promise.all(
            fileArray.map(file =>
                cloudinary.uploader.upload(file.filepath, { folder: 'nadjam-travel' })
            )
        );
        const urls = uploadResults.map(r => r.secure_url);
        return res.status(200).json({ urls });
    } catch (error: any) {
        console.error('Upload failed:', error);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
    }
} 