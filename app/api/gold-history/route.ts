import { NextResponse } from 'next/server';
import { GoldHistoryResponse } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || 'India';
        const carat = searchParams.get('carat') || '24k';

        const apiUrl = `https://kp-hl-httpapi-prod.angelone.in/goldhistory?city=${city}&carat=${carat}`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch gold history data');
        }

        const data: GoldHistoryResponse = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching gold history:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch gold history' },
            { status: 500 }
        );
    }
}
