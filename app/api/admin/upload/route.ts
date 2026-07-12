import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
const MAX_BYTES = 4 * 1024 * 1024; // kept under Vercel's ~4.5MB serverless body-size limit

export async function POST(request: NextRequest) {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        return NextResponse.json({ error: 'Image upload is not configured.' }, { status: 500 });
    }
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'Image must be smaller than 4MB.' }, { status: 400 });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'gpaisa-articles';
        const toSign = `folder=${folder}&timestamp=${timestamp}`;
        const signature = crypto.createHash('sha1').update(toSign + API_SECRET).digest('hex');

        const uploadForm = new FormData();
        uploadForm.append('file', file);
        uploadForm.append('api_key', API_KEY);
        uploadForm.append('timestamp', String(timestamp));
        uploadForm.append('signature', signature);
        uploadForm.append('folder', folder);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: uploadForm,
        });
        if (!cloudinaryRes.ok) {
            console.error('[ADMIN_UPLOAD] Cloudinary error:', cloudinaryRes.status, await cloudinaryRes.text().catch(() => ''));
            return NextResponse.json({ error: 'Image upload failed.' }, { status: 502 });
        }
        const data = await cloudinaryRes.json();
        return NextResponse.json({ secure_url: data.secure_url, public_id: data.public_id });
    } catch (error) {
        console.error('[ADMIN_UPLOAD] Unexpected error:', error);
        return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
    }
}
