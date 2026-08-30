import { NextRequest, NextResponse } from 'next/server';
import { listBuybacksAdmin, createBuyback, getBuybackBySlugAdmin } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateBuybackInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const result = await listBuybacksAdmin({
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '20'),
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_BUYBACKS] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load buybacks' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const errors = validateBuybackInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const slug = slugify(body.slug || `${body.companyName || ''}-buyback`);
        if (await getBuybackBySlugAdmin(slug)) {
            return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
        }

        const buyback = await createBuyback({
            company_id: body.company_id,
            slug,
            status: body.status,
            method: body.method,
            buyback_price: body.buyback_price ?? null,
            buyback_price_max: body.buyback_price_max ?? null,
            record_date: body.record_date || null,
            tender_open_date: body.tender_open_date || null,
            tender_close_date: body.tender_close_date || null,
            buyback_size: body.buyback_size ?? null,
            acceptance_ratio: body.acceptance_ratio || null,
            registrar_id: body.registrar_id || null,
            notes: body.notes || null,
            letter_of_offer_url: body.letter_of_offer_url || null,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ buyback }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_BUYBACKS] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create buyback' }, { status: 500 });
    }
}
