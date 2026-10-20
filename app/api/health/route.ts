import { NextResponse } from 'next/server';
import { pingDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Liveness + database check for the uptime monitor and deploy script.
export async function GET() {
    try {
        await pingDb();
        return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error('[HEALTH] Database check failed:', error);
        return NextResponse.json({ status: 'error', database: 'unreachable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
}
