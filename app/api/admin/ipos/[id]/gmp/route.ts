import { NextRequest, NextResponse } from 'next/server';
import { listGmpUpdatesAdmin, createGmpUpdate } from '@/lib/supabaseAdmin';
import { validateGmpUpdateInput } from '@/lib/ipoValidation';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const updates = await listGmpUpdatesAdmin(id);
        return NextResponse.json({ updates });
    } catch (error) {
        console.error('[ADMIN_IPO_GMP] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load GMP history' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateGmpUpdateInput(body);
        if (errors.length) {
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const update = await createGmpUpdate(id, {
            gmp_value: body.gmp_value,
            gmp_percentage: body.gmp_percentage ?? null,
            estimated_listing_price: body.estimated_listing_price ?? null,
            kostak_rate: body.kostak_rate ?? null,
            subject_to_sauda: body.subject_to_sauda ?? null,
            source: body.source.trim(),
            direction: body.direction || null,
            notes: body.notes || null,
            recorded_at: body.recorded_at || undefined,
        });
        return NextResponse.json({ update }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_IPO_GMP] POST failed:', error);
        return NextResponse.json({ error: 'Failed to add GMP update' }, { status: 500 });
    }
}
