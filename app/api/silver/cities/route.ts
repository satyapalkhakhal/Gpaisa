import { NextResponse } from 'next/server';
import { SILVER_CITIES } from '@/lib/silverCities';

// Same owned list the /silver-rate/[city] routes use (lib/silverCities.ts).
export async function GET() {
    return NextResponse.json({ success: true, data: SILVER_CITIES });
}
