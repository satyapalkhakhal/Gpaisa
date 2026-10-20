import { NextRequest, NextResponse } from 'next/server';
import { queryRows } from '@/lib/db';

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

        // Unique index on email: a repeat signup inserts nothing and returns no row
        const inserted = await queryRows(
            `INSERT INTO subscribers (email, source) VALUES ($1, 'website') ON CONFLICT (email) DO NOTHING RETURNING id`,
            [email.toLowerCase().trim()]
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
