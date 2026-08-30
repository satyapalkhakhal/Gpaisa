import { NextRequest, NextResponse } from 'next/server';
import { getCompanyByIdAdmin, updateCompany, deleteCompany } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const company = await getCompanyByIdAdmin(id);
        if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        return NextResponse.json({ company });
    } catch (error) {
        console.error('[ADMIN_COMPANY] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load company' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const company = await updateCompany(id, {
            name: body.name?.trim(),
            slug: body.slug ? slugify(body.slug) : undefined,
            logo_url: body.logo_url,
            sector: body.sector,
            industry: body.industry,
            about: body.about,
            website: body.website,
            incorporated_year: body.incorporated_year,
            registered_office: body.registered_office,
        });
        return NextResponse.json({ company });
    } catch (error) {
        console.error('[ADMIN_COMPANY] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await deleteCompany(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_COMPANY] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
    }
}
