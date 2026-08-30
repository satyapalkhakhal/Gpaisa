import { NextRequest, NextResponse } from 'next/server';
import { deleteSubscriptionUpdate } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ subId: string }> }) {
    const { subId } = await params;
    try {
        await deleteSubscriptionUpdate(subId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_IPO_SUBSCRIPTION] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete subscription update' }, { status: 500 });
    }
}
