import { NextRequest, NextResponse } from 'next/server';
import { listNcdIssuesAdmin, createNcdIssue, getNcdIssueBySlugAdmin } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateNcdIssueInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const result = await listNcdIssuesAdmin({
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '20'),
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[ADMIN_NCD_ISSUES] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load NCD issues' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const errors = validateNcdIssueInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const slug = slugify(body.slug || `${body.companyName || ''}-ncd`);
        if (await getNcdIssueBySlugAdmin(slug)) {
            return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
        }

        const issue = await createNcdIssue({
            company_id: body.company_id,
            slug,
            status: body.status,
            open_date: body.open_date || null,
            close_date: body.close_date || null,
            allotment_date: body.allotment_date || null,
            listing_date: body.listing_date || null,
            issue_size: body.issue_size ?? null,
            base_issue_size: body.base_issue_size ?? null,
            shelf_limit: body.shelf_limit ?? null,
            credit_rating: body.credit_rating || null,
            rating_agency: body.rating_agency || null,
            secured: body.secured !== false,
            series: Array.isArray(body.series) ? body.series : [],
            registrar_id: body.registrar_id || null,
            lead_managers: Array.isArray(body.lead_managers) ? body.lead_managers : [],
            objects_of_issue: body.objects_of_issue || null,
            prospectus_url: body.prospectus_url || null,
            subscription_times_overall: body.subscription_times_overall ?? null,
            subscription_updated_at: body.subscription_times_overall != null ? new Date().toISOString() : null,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ issue }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_NCD_ISSUES] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create NCD issue' }, { status: 500 });
    }
}
