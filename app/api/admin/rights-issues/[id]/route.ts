import { NextRequest, NextResponse } from 'next/server';
import { getRightsIssueByIdAdmin, getRightsIssueBySlugAdmin, updateRightsIssue, deleteRightsIssue } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateRightsIssueInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const issue = await getRightsIssueByIdAdmin(id);
        if (!issue) return NextResponse.json({ error: 'Rights issue not found' }, { status: 404 });
        return NextResponse.json({ issue });
    } catch (error) {
        console.error('[ADMIN_RIGHTS_ISSUE] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load rights issue' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateRightsIssueInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const existing = await getRightsIssueByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Rights issue not found' }, { status: 404 });

        const slug = slugify(body.slug || existing.slug);
        if (slug !== existing.slug) {
            const collision = await getRightsIssueBySlugAdmin(slug);
            if (collision && collision.id !== id) {
                return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
            }
        }

        const issue = await updateRightsIssue(id, {
            company_id: body.company_id,
            slug,
            status: body.status,
            record_date: body.record_date || null,
            re_trading_start: body.re_trading_start || null,
            re_trading_end: body.re_trading_end || null,
            application_start: body.application_start || null,
            application_end: body.application_end || null,
            allotment_date: body.allotment_date || null,
            listing_date: body.listing_date || null,
            rights_ratio: body.rights_ratio || null,
            issue_price: body.issue_price ?? null,
            face_value: body.face_value ?? null,
            issue_size: body.issue_size ?? null,
            re_price: body.re_price ?? null,
            re_price_updated_at:
                body.re_price != null && body.re_price !== existing.re_price ? new Date().toISOString() : existing.re_price_updated_at,
            registrar_id: body.registrar_id || null,
            objects_of_issue: body.objects_of_issue || null,
            letter_of_offer_url: body.letter_of_offer_url || null,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ issue });
    } catch (error) {
        console.error('[ADMIN_RIGHTS_ISSUE] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update rights issue' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const existing = await getRightsIssueByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'Rights issue not found' }, { status: 404 });
        await deleteRightsIssue(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_RIGHTS_ISSUE] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete rights issue' }, { status: 500 });
    }
}
