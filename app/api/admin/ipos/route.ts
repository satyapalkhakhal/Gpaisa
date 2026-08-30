import { NextRequest, NextResponse } from 'next/server';
import { listIposAdmin, createIpo, getIpoBySlugAdmin } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateIpoInput } from '@/lib/ipoValidation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const result = await listIposAdmin({
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '20'),
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
            ipoType: searchParams.get('ipoType') || undefined,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_IPOS] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load IPOs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const errors = validateIpoInput(body);
        if (errors.length) {
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const slug = slugify(body.slug || `${body.companyName || ''}-ipo`);
        if (await getIpoBySlugAdmin(slug)) {
            return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
        }

        const ipo = await createIpo({
            company_id: body.company_id,
            slug,
            ipo_type: body.ipo_type,
            status: body.status,
            open_date: body.open_date || null,
            close_date: body.close_date || null,
            allotment_date: body.allotment_date || null,
            refund_date: body.refund_date || null,
            demat_date: body.demat_date || null,
            listing_date: body.listing_date || null,
            price_band_min: body.price_band_min ?? null,
            price_band_max: body.price_band_max ?? null,
            face_value: body.face_value ?? null,
            lot_size: body.lot_size ?? null,
            fresh_issue_amount: body.fresh_issue_amount ?? null,
            ofs_amount: body.ofs_amount ?? null,
            total_issue_size: body.total_issue_size ?? null,
            exchange: body.exchange || null,
            registrar_id: body.registrar_id || null,
            lead_managers: Array.isArray(body.lead_managers) ? body.lead_managers : [],
            objects_of_issue: body.objects_of_issue || null,
            drhp_url: body.drhp_url || null,
            rhp_url: body.rhp_url || null,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
            listing_price: body.listing_price ?? null,
            listing_day_close_price: body.listing_day_close_price ?? null,
            current_market_price: body.current_market_price ?? null,
            current_price_updated_at: body.current_market_price != null ? new Date().toISOString() : null,
        });
        return NextResponse.json({ ipo }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_IPOS] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create IPO' }, { status: 500 });
    }
}
