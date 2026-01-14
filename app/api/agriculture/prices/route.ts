import { NextRequest, NextResponse } from 'next/server';
import { fetchMandiPrices } from '@/lib/agriApi';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        const filters: any = {
            limit: 100
        };

        const state = searchParams.get('state');
        const district = searchParams.get('district');
        const market = searchParams.get('market');
        const commodity = searchParams.get('commodity');

        if (state) filters.state = state;
        if (district) filters.district = district;
        if (market) filters.market = market;
        if (commodity) filters.commodity = commodity;

        const data = await fetchMandiPrices(filters);

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400'
            }
        });
    } catch (error) {
        console.error('Error in prices API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prices' },
            { status: 500 }
        );
    }
}
