import { NextRequest, NextResponse } from 'next/server';
import { deleteGmpUpdate } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ gmpId: string }> }) {
    const { gmpId } = await params;
    try {
        await deleteGmpUpdate(gmpId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_IPO_GMP] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete GMP update' }, { status: 500 });
    }
}
