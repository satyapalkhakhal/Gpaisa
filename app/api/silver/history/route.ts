import { NextResponse } from 'next/server';
import { fetchSilverHistory } from '@/lib/angelOneApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'XAG';
    const gram = parseInt(searchParams.get('gram') || '10');

    const data = await fetchSilverHistory(symbol, gram);

    if (data) {
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400'
            }
        });
    }

    return NextResponse.json({ success: false, error: 'Failed to fetch silver history' }, { status: 500 });
}
