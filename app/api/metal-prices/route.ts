import { NextResponse } from 'next/server';
import { queryRows } from '@/lib/db';

// In-memory cache
let cachedData: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 1 month in ms

export async function GET() {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
        return NextResponse.json(cachedData, {
            headers: {
                'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
                'CDN-Cache-Control': 'public, max-age=2592000',
            },
        });
    }

    try {
        // Oldest → newest, the order the chart renders in
        const allRecords = await queryRows(
            'SELECT price_date, gold_usd, silver_usd FROM metal_price_history ORDER BY price_date ASC'
        );

        // Update cache
        cachedData = allRecords;
        cacheTimestamp = now;

        console.log(`[MetalPrices API] Fetched ${allRecords.length} records from the database`);

        return NextResponse.json(allRecords, {
            headers: {
                'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
                'CDN-Cache-Control': 'public, max-age=2592000',
            },
        });
    } catch (error) {
        console.error('[MetalPrices API] Error:', error);

        // Return stale cache if available
        if (cachedData) {
            return NextResponse.json(cachedData, {
                headers: { 'Cache-Control': 'public, max-age=3600' },
            });
        }

        return NextResponse.json({ error: 'Failed to fetch metal prices' }, { status: 500 });
    }
}
