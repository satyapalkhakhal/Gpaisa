import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('[SUBSCRIBE] Missing Supabase env vars');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // First check if email already exists
        const checkResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/subscribers?email=eq.${encodeURIComponent(email.toLowerCase().trim())}&select=email`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
            }
        );

        if (checkResponse.ok) {
            const existing = await checkResponse.json();
            if (Array.isArray(existing) && existing.length > 0) {
                return NextResponse.json(
                    { message: 'You are already subscribed!', status: 'duplicate' },
                    { status: 200 }
                );
            }
        }

        // Insert new subscriber
        const insertResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/subscribers`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    source: 'website',
                }),
            }
        );

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text().catch(() => 'unknown');

            // Handle unique constraint violation (duplicate)
            if (insertResponse.status === 409 || errorText.includes('duplicate') || errorText.includes('unique')) {
                return NextResponse.json(
                    { message: 'You are already subscribed!', status: 'duplicate' },
                    { status: 200 }
                );
            }

            console.error('[SUBSCRIBE] Insert failed:', insertResponse.status, errorText);
            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Successfully subscribed! 🎉', status: 'success' },
            { status: 201 }
        );
    } catch (error) {
        console.error('[SUBSCRIBE] Error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
