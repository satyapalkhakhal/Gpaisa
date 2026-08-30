import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ docId: string }> }) {
    const { docId } = await params;
    try {
        await deleteDocument(docId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_IPO_DOCUMENTS] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
