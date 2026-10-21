import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isCronAuthorized } from '@/lib/cronAuth';
import { syncInvestorgainIssues } from '@/lib/investorgainIssuesSync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/cron/issues-sync[?dryRun=1] — NCD issues, rights issues and buybacks.
export async function POST(request: NextRequest) {
    if (!isCronAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const dryRun = request.nextUrl.searchParams.get('dryRun') === '1';
    try {
        const report = await syncInvestorgainIssues({ dryRun });
        const changed = [report.ncd, report.rights, report.buyback].some(r => r.created.length || r.updated.length);
        if (!dryRun && changed) {
            // Public pages read through cachedRows (tag 'db'); refresh them now instead of at TTL.
            revalidateTag('db');
        }
        const errors = [...report.ncd.errors, ...report.rights.errors, ...report.buyback.errors];
        if (errors.length) console.error('[ISSUES_SYNC] errors:', errors);
        const nothingFetched = !report.ncd.fetched && !report.rights.fetched && !report.buyback.fetched;
        return NextResponse.json(report, { status: nothingFetched ? 502 : 200 });
    } catch (error) {
        console.error('[ISSUES_SYNC] failed:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
