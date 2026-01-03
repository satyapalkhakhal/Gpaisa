import { NextResponse } from 'next/server';
import { fetchSilverCalculator } from '@/lib/angelOneApi';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'XAG';

    const data = await fetchSilverCalculator(symbol);

    if (data) {
        return NextResponse.json(data);
    }

    return NextResponse.json({ success: false, error: 'Failed to fetch silver calculator' }, { status: 500 });
}
