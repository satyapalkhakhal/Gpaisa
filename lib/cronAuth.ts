// Server-only. Guards /api/cron/* routes, which deploy/ipo-sync.sh calls from inside the
// app container; Caddy also blocks /api/cron/* from the internet.
import type { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

export function isCronAuthorized(request: NextRequest): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) return false;
    const given = Buffer.from(request.headers.get('authorization') || '');
    const expected = Buffer.from(`Bearer ${secret}`);
    return given.length === expected.length && timingSafeEqual(given, expected);
}
