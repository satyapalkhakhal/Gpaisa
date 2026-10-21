import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'crypto';
import { syncGrowwIpos } from '@/lib/growwIpoSync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Called by deploy/ipo-sync.sh from inside the app container; Caddy blocks /api/cron/*
// from the internet, and the bearer secret guards it regardless.
function authorized(request: NextRequest): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;
    const given = Buffer.from(request.headers.get('authorization') || '');
    const expected = Buffer.from(`Bearer ${secret}`);
    return given.length === expected.length && timingSafeEqual(given, expected);
}

// POST /api/cron/groww-ipo-sync[?dryRun=1]
export async function POST(request: NextRequest) {
    if (!authorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const dryRun = request.nextUrl.searchParams.get('dryRun') === '1';
    try {
        const report = await syncGrowwIpos({ dryRun });
        if (!dryRun && (report.created.length || report.updated.length || report.subscriptionRows)) {
            // Public pages read through cachedRows (tag 'db'); refresh them now instead of at TTL.
            revalidateTag('db');
        }
        if (report.errors.length) console.error('[GROWW_IPO_SYNC] errors:', report.errors);
        const nothingFetched = !Object.keys(report.fetched).length;
        return NextResponse.json(report, { status: nothingFetched ? 502 : 200 });
    } catch (error) {
        console.error('[GROWW_IPO_SYNC] failed:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
