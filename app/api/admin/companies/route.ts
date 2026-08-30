import { NextRequest, NextResponse } from 'next/server';
import { listCompaniesAdmin, createCompany } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    try {
        const companies = await listCompaniesAdmin(searchParams.get('search') || undefined);
        return NextResponse.json({ companies });
    } catch (error) {
        console.error('[ADMIN_COMPANIES] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load companies' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.name?.trim()) {
            return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
        }
        const company = await createCompany({
            name: body.name.trim(),
            slug: slugify(body.slug || body.name),
            logo_url: body.logo_url || null,
            sector: body.sector || null,
            industry: body.industry || null,
            about: body.about || null,
            website: body.website || null,
            incorporated_year: body.incorporated_year ?? null,
            registered_office: body.registered_office || null,
        });
        return NextResponse.json({ company }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_COMPANIES] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
    }
}
