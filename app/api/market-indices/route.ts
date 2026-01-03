import { NextResponse } from 'next/server';
import { fetchMarketIndices } from '@/lib/indicesApi';
import { marketIndices as mockIndices } from '@/lib/mockData';

export async function GET() {
    try {
        const liveData = await fetchMarketIndices();

        // Fallback to mock data if live data is empty (e.g. scraping failed)
        if (!liveData || liveData.length === 0) {
            return NextResponse.json({ success: true, data: mockIndices });
        }

        return NextResponse.json({ success: true, data: liveData });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch indices' }, { status: 500 });
    }
}
