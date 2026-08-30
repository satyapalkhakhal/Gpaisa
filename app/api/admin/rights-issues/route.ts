import { NextRequest, NextResponse } from 'next/server';
import { listRightsIssuesAdmin, createRightsIssue, getRightsIssueBySlugAdmin } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateRightsIssueInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const result = await listRightsIssuesAdmin({
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '20'),
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_RIGHTS_ISSUES] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load rights issues' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const errors = validateRightsIssueInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const slug = slugify(body.slug || `${body.companyName || ''}-rights-issue`);
        if (await getRightsIssueBySlugAdmin(slug)) {
            return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
        }

        const issue = await createRightsIssue({
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
            re_price_updated_at: body.re_price != null ? new Date().toISOString() : null,
            registrar_id: body.registrar_id || null,
            objects_of_issue: body.objects_of_issue || null,
            letter_of_offer_url: body.letter_of_offer_url || null,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ issue }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_RIGHTS_ISSUES] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create rights issue' }, { status: 500 });
    }
}
