import { NextRequest, NextResponse } from 'next/server';
import { getNcdIssueByIdAdmin, getNcdIssueBySlugAdmin, updateNcdIssue, deleteNcdIssue } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';
import { validateNcdIssueInput } from '@/lib/otherInvestmentsValidation';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const issue = await getNcdIssueByIdAdmin(id);
        if (!issue) return NextResponse.json({ error: 'NCD issue not found' }, { status: 404 });
        return NextResponse.json({ issue });
    } catch (error) {
        console.error('[ADMIN_NCD_ISSUE] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load NCD issue' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const errors = validateNcdIssueInput(body);
        if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

        const existing = await getNcdIssueByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'NCD issue not found' }, { status: 404 });

        const slug = slugify(body.slug || existing.slug);
        if (slug !== existing.slug) {
            const collision = await getNcdIssueBySlugAdmin(slug);
            if (collision && collision.id !== id) {
                return NextResponse.json({ error: `Slug "${slug}" is already in use.` }, { status: 409 });
            }
        }

        const issue = await updateNcdIssue(id, {
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
            subscription_updated_at:
                body.subscription_times_overall != null && body.subscription_times_overall !== existing.subscription_times_overall
                    ? new Date().toISOString()
                    : existing.subscription_updated_at,
            is_featured: !!body.is_featured,
            meta_title: body.meta_title || null,
            meta_description: body.meta_description || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ issue });
    } catch (error) {
        console.error('[ADMIN_NCD_ISSUE] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update NCD issue' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const existing = await getNcdIssueByIdAdmin(id);
        if (!existing) return NextResponse.json({ error: 'NCD issue not found' }, { status: 404 });
        await deleteNcdIssue(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_NCD_ISSUE] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete NCD issue' }, { status: 500 });
    }
}
