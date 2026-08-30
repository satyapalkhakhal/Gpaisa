import { NextRequest, NextResponse } from 'next/server';
import { getAllotmentByIpoIdAdmin, upsertAllotment } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const allotment = await getAllotmentByIpoIdAdmin(id);
        return NextResponse.json({ allotment });
    } catch (error) {
        console.error('[ADMIN_IPO_ALLOTMENT] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load allotment info' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const allotment = await upsertAllotment(id, {
            registrar_id: body.registrar_id || null,
            basis_of_allotment_url: body.basis_of_allotment_url || null,
            allotment_date: body.allotment_date || null,
            refund_date: body.refund_date || null,
            demat_credit_date: body.demat_credit_date || null,
            listing_date: body.listing_date || null,
            status: body.status || null,
            notes: body.notes || null,
        });
        return NextResponse.json({ allotment });
    } catch (error) {
        console.error('[ADMIN_IPO_ALLOTMENT] PUT failed:', error);
        return NextResponse.json({ error: 'Failed to save allotment info' }, { status: 500 });
    }
}
