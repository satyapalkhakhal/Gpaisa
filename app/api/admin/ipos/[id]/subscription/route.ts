import { NextRequest, NextResponse } from 'next/server';
import { listSubscriptionUpdatesAdmin, createSubscriptionUpdate } from '@/lib/supabaseAdmin';
import { validateSubscriptionUpdateInput } from '@/lib/ipoValidation';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const updates = await listSubscriptionUpdatesAdmin(id);
        return NextResponse.json({ updates });
    } catch (error) {
        console.error('[ADMIN_IPO_SUBSCRIPTION] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load subscription history' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateSubscriptionUpdateInput(body);
        if (errors.length) {
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const update = await createSubscriptionUpdate(id, {
            day_number: body.day_number,
            category: body.category,
            subscription_times: body.subscription_times,
            shares_offered: body.shares_offered ?? null,
            shares_bid: body.shares_bid ?? null,
            data_granularity: body.data_granularity || 'day_end',
            as_of: body.as_of || undefined,
        });
        return NextResponse.json({ update }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_IPO_SUBSCRIPTION] POST failed:', error);
        return NextResponse.json({ error: 'Failed to add subscription update' }, { status: 500 });
    }
}
