import { NextRequest, NextResponse } from 'next/server';
import { listDocumentsAdmin, createDocument } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const documents = await listDocumentsAdmin(id);
        return NextResponse.json({ documents });
    } catch (error) {
        console.error('[ADMIN_IPO_DOCUMENTS] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        if (!body.title?.trim() || !body.url?.trim()) {
            return NextResponse.json({ error: 'Title and URL are required.' }, { status: 400 });
        }
        const document = await createDocument(id, {
            doc_type: body.doc_type || 'other',
            title: body.title.trim(),
            url: body.url.trim(),
            published_at: body.published_at || null,
        });
        return NextResponse.json({ document }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_IPO_DOCUMENTS] POST failed:', error);
        return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
    }
}
