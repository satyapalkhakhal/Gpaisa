import { NextRequest, NextResponse } from 'next/server';
import { fetchMetalNewsCards } from '@/lib/articlesApi';

// Latest published gold/silver articles for the client-side news widgets.
export async function GET(request: NextRequest) {
    const metal = request.nextUrl.searchParams.get('metal');
    if (metal !== 'gold' && metal !== 'silver') {
        return NextResponse.json({ error: 'metal must be "gold" or "silver"' }, { status: 400 });
    }
    const articles = await fetchMetalNewsCards(metal, 6);
    return NextResponse.json(articles, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
}
