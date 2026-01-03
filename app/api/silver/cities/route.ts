import { NextResponse } from 'next/server';
import { fetchSilverCities } from '@/lib/angelOneApi';

export async function GET() {
    const data = await fetchSilverCities();
    return NextResponse.json({ success: true, data });
}
