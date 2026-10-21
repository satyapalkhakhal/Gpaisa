import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isCronAuthorized } from '@/lib/cronAuth';
import { syncGrowwIpos } from '@/lib/growwIpoSync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/cron/groww-ipo-sync[?dryRun=1]
export async function POST(request: NextRequest) {
    if (!isCronAuthorized(request)) {
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
