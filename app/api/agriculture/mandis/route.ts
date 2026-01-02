import { NextRequest, NextResponse } from 'next/server';
import { getMandisByDistrict } from '@/lib/agriApi';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const state = searchParams.get('state');
        const district = searchParams.get('district');

        if (!state || !district) {
            return NextResponse.json(
                { error: 'State and district parameters are required' },
                { status: 400 }
            );
        }

        const mandis = await getMandisByDistrict(state, district);

        return NextResponse.json({ mandis });
    } catch (error) {
        console.error('Error in mandis API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mandis' },
            { status: 500 }
        );
    }
}
