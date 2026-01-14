import { NextRequest, NextResponse } from 'next/server';
import { getDistrictsForState } from '@/lib/constants';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const state = searchParams.get('state');

        if (!state) {
            return NextResponse.json(
                { error: 'State parameter is required' },
                { status: 400 }
            );
        }

        const districts = getDistrictsForState(state);

        return NextResponse.json({ districts }, {
            headers: {
                'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=604800'
            }
        });
    } catch (error) {
        console.error('Error in districts API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch districts' },
            { status: 500 }
        );
    }
}
