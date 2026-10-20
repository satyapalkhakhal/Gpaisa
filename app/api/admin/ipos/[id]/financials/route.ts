import { NextRequest, NextResponse } from 'next/server';
import { listFinancialsAdmin, createFinancial } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const financials = await listFinancialsAdmin(id);
        return NextResponse.json({ financials });
    } catch (error) {
        console.error('[ADMIN_IPO_FINANCIALS] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load financials' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        if (!body.period_label?.trim()) {
            return NextResponse.json({ error: 'Period label is required.' }, { status: 400 });
        }
        const financial = await createFinancial(id, {
            period_label: body.period_label.trim(),
            period_end_date: body.period_end_date || null,
            revenue: body.revenue ?? null,
            expenses: body.expenses ?? null,
            profit_after_tax: body.profit_after_tax ?? null,
            total_assets: body.total_assets ?? null,
            ebitda: body.ebitda ?? null,
            net_worth: body.net_worth ?? null,
            total_debt: body.total_debt ?? null,
        });
        return NextResponse.json({ financial }, { status: 201 });
    } catch (error) {
        console.error('[ADMIN_IPO_FINANCIALS] POST failed:', error);
        return NextResponse.json({ error: 'Failed to add financial period' }, { status: 500 });
    }
}
