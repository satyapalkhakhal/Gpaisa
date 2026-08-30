import { NextRequest, NextResponse } from 'next/server';
import { updateRegistrar, deleteRegistrar } from '@/lib/supabaseAdmin';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const registrar = await updateRegistrar(id, {
            name: body.name?.trim(),
            slug: body.slug ? slugify(body.slug) : undefined,
            website: body.website,
            allotment_status_check_url: body.allotment_status_check_url,
            logo_url: body.logo_url,
        });
        return NextResponse.json({ registrar });
    } catch (error) {
        console.error('[ADMIN_REGISTRAR] PATCH failed:', error);
        return NextResponse.json({ error: 'Failed to update registrar' }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await deleteRegistrar(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[ADMIN_REGISTRAR] DELETE failed:', error);
        return NextResponse.json({ error: 'Failed to delete registrar' }, { status: 500 });
    }
}
