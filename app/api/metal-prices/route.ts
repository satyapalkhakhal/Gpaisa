import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://rfuumgvtjfvxmhocxhfk.supabase.co/rest/v1';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
        // Fetch in desc order so Supabase's 1000-row free-tier limit
        // returns the most recent data instead of ancient history
        const url = `${SUPABASE_URL}/metal_price_history?select=price_date,gold_usd,silver_usd&order=price_date.desc&limit=1000`;
        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Supabase error: ${res.status}`);
        }

        const data = await res.json();

        // Reverse to ascending order (oldest → newest) for chart rendering
        const allRecords = data.reverse();

        // Update cache
        cachedData = allRecords;
        cacheTimestamp = now;

        console.log(`[MetalPrices API] Fetched ${allRecords.length} records from Supabase`);

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
