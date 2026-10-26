import { NextRequest, NextResponse } from 'next/server';
import { queryRows } from '@/lib/db';

// Pages with a signup form; recorded per subscriber to see which pages convert.
const SOURCES = new Set(['article', 'ipo', 'ipo-detail', 'gold-rate']);

// Per-IP limit, in memory: the app runs as one process on the VM, so this is enough to stop a bot loop.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    if (attempts.size > 10_000) {
        for (const [key, entry] of attempts) if (entry.resetAt <= now) attempts.delete(key);
    }
    const entry = attempts.get(ip);
    if (!entry || entry.resetAt <= now) {
        attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    entry.count++;
    return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('cf-connecting-ip')
            || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many attempts. Please try again in a few minutes.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { email } = body;

        // Honeypot: a hidden field people never see. Bots fill it; pretend success and save nothing.
        if (body.company) {
            return NextResponse.json(
                { message: 'Successfully subscribed! 🎉', status: 'success' },
                { status: 201 }
            );
        }

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        const source = typeof body.source === 'string' && SOURCES.has(body.source) ? body.source : 'website';

        // Unique index on email: a repeat signup inserts nothing and returns no row
        const inserted = await queryRows(
            `INSERT INTO subscribers (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id`,
            [email.toLowerCase().trim(), source]
        );

        if (inserted.length === 0) {
            return NextResponse.json(
                { message: 'You are already subscribed!', status: 'duplicate' },
                { status: 200 }
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
