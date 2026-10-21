import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isCronAuthorized } from '@/lib/cronAuth';
import { syncInvestorgainGmp } from '@/lib/investorgainGmpSync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/cron/gmp-sync[?dryRun=1]
export async function POST(request: NextRequest) {
    if (!isCronAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const dryRun = request.nextUrl.searchParams.get('dryRun') === '1';
    try {
        const report = await syncInvestorgainGmp({ dryRun });
        if (!dryRun && (report.readings.length || report.backfilled.length)) {
            // Public pages read through cachedRows (tag 'db'); refresh them now instead of at TTL.
            revalidateTag('db');
        }
        if (report.errors.length) console.error('[GMP_SYNC] errors:', report.errors);
        return NextResponse.json(report, { status: report.fetched ? 200 : 502 });
    } catch (error) {
        console.error('[GMP_SYNC] failed:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
