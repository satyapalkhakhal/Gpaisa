import { NextRequest, NextResponse } from 'next/server';
import { listRegistrarsAdmin, createRegistrar } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const registrars = await listRegistrarsAdmin();
        return NextResponse.json({ registrars });
    } catch (error) {
        console.error('[ADMIN_REGISTRARS] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load registrars' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.name?.trim()) {
            return NextResponse.json({ error: 'Registrar name is required.' }, { status: 400 });
        }
        const registrar = await createRegistrar({
            name: body.name.trim(),
            slug: slugify(body.slug || body.name),
            website: body.website || null,
            allotment_status_check_url: body.allotment_status_check_url || null,
            logo_url: body.logo_url || null,
        });
        return NextResponse.json({ registrar }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_REGISTRARS] POST failed:', error);
        return NextResponse.json({ error: 'Failed to create registrar' }, { status: 500 });
    }
}
