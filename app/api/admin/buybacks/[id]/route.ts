import { NextRequest, NextResponse } from 'next/server';
import { getBuybackByIdAdmin, getBuybackBySlugAdmin, updateBuyback, deleteBuyback } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateBuybackInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const buyback = await getBuybackByIdAdmin(id);
        if (!buyback) return NextResponse.json({ error: 'Buyback not found' }, { status: 404 });
        return NextResponse.json({ buyback });
    } catch (error) {
        console.error('[ADMIN_BUYBACK] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load buyback' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateBuybackInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const existing = await getBuybackByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Buyback not found' }, { status: 404 });

        const slug = slugify(body.slug || existing.slug);
        if (slug !== existing.slug) {
            const collision = await getBuybackBySlugAdmin(slug);
            if (collision && collision.id !== id) {
                return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
            }
        }

        const buyback = await updateBuyback(id, {
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
        return NextResponse.json({ buyback });
    } catch (error) {
        console.error('[ADMIN_BUYBACK] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update buyback' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const existing = await getBuybackByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Buyback not found' }, { status: 404 });
        await deleteBuyback(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_BUYBACK] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete buyback' }, { status: 500 });
    }
}
