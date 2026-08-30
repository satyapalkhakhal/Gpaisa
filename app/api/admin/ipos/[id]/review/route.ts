import { NextRequest, NextResponse } from 'next/server';
import { getReviewByIpoIdAdmin, upsertReview } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const review = await getReviewByIpoIdAdmin(id);
        return NextResponse.json({ review });
    } catch (error) {
        console.error('[ADMIN_IPO_REVIEW] GET failed:', error);
        return NextResponse.json({ error: 'Failed to load review' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const review = await upsertReview(id, {
            business_quality_score: body.business_quality_score ?? null,
            financial_performance_score: body.financial_performance_score ?? null,
            growth_score: body.growth_score ?? null,
            valuation_score: body.valuation_score ?? null,
            industry_outlook: body.industry_outlook || null,
            management_notes: body.management_notes || null,
            strengths: Array.isArray(body.strengths) ? body.strengths : [],
            risks: Array.isArray(body.risks) ? body.risks : [],
            competitive_position: body.competitive_position || null,
            overall_view: body.overall_view || null,
            overall_score: body.overall_score ?? null,
            recommendation: body.recommendation || null,
            detailed_analysis_html: body.detailed_analysis_html || null,
            author: body.author || null,
            publish_status: body.publish_status === 'published' ? 'published' : 'draft',
        });
        return NextResponse.json({ review });
    } catch (error) {
        console.error('[ADMIN_IPO_REVIEW] PUT failed:', error);
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
}
