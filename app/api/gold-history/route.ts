import { NextResponse } from 'next/server';
import { fetchGoldHistory } from '@/lib/angelOneApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'India';
    const carat = searchParams.get('carat') || '24k';

    const data = await fetchGoldHistory(city, carat);

    if (data) {
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400'
            }
        });
    }

    return NextResponse.json(
        { success: false, data: [], error: 'Failed to fetch gold history' },
        { status: 500 }
    );
}
