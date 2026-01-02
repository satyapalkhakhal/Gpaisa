import { NextResponse } from 'next/server';
import { INDIA_STATES, COMMON_COMMODITIES } from '@/lib/constants';

export async function GET() {
    try {
        return NextResponse.json({
            states: [...INDIA_STATES],
            commodities: [...COMMON_COMMODITIES]
        });
    } catch (error) {
        console.error('Error in states API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch states' },
            { status: 500 }
        );
    }
}
