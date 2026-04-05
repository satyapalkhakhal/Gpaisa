import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const checks: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL ? `✅ Set (${SUPABASE_URL.substring(0, 30)}...)` : '❌ NOT SET',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? `✅ Set (${SUPABASE_ANON_KEY.substring(0, 20)}...)` : '❌ NOT SET',
        },
        api_test: null as any,
    };

    // Test actual API call
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
            const url = `${SUPABASE_URL}/rest/v1/articles?select=id,title&limit=2&order=published_at.desc`;
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store'
            });

            const status = response.status;
            const body = await response.text();

            checks.api_test = {
                status,
                ok: response.ok,
                body_preview: body.substring(0, 500),
                url_used: url,
            };
        } catch (error: any) {
            checks.api_test = {
                error: error.message,
                type: error.name,
            };
        }
    } else {
        checks.api_test = { error: 'Skipped - env vars not set' };
    }

    return NextResponse.json(checks, { status: 200 });
}
