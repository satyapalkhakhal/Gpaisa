import { NextResponse } from 'next/server';
import { fetchMarketIndices } from '@/lib/indicesApi';

export async function GET() {
    try {
        const liveData = await fetchMarketIndices();

        // Return empty array if live data is unavailable — the ticker will hide itself
        if (!liveData || liveData.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        return NextResponse.json({ success: true, data: liveData }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });
    } catch (error) {
        // Return empty data instead of stale mock data — ticker hides gracefully
        return NextResponse.json({ success: true, data: [] });
    }
}
