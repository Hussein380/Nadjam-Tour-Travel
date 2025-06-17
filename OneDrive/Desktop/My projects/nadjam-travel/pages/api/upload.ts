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

type FormidableParseResult = { fields: Record<string, any>; files: Record<string, FormidableFile> };

function formidableParse(req: NextApiRequest): Promise<FormidableParseResult> {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: false });
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
        console.log('Formidable files:', files);
        const fileArray = Array.isArray(files.image) ? files.image : [files.image];
        const file = fileArray[0];
        console.log('fileArray:', fileArray);
        if (!file) {
            console.error('No image file found in upload');
            return res.status(400).json({ error: 'No image file provided' });
        }
        console.log('Uploading to Cloudinary:', file.filepath);
        const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'nadjam-travel',
        });
        console.log('Cloudinary result:', result);
        return res.status(200).json({ url: result.secure_url });
    } catch (error: any) {
        console.error('Upload failed:', error);
        return res.status(500).json({ error: 'Upload failed', details: error.message });
    }
} 