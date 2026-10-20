import { NextRequest, NextResponse } from 'next/server';
import { deleteFinancial } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ finId: string }> }) {
    const { finId } = await params;
    try {
        await deleteFinancial(finId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_IPO_FINANCIALS] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete financial period' }, { status: 500 });
    }
}
