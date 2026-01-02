import { NextResponse } from 'next/server';
import { GoldCalculatorResponse } from '@/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || 'Mumbai';
        const carat = searchParams.get('carat') || '24k';
        const grams = searchParams.get('grams') || '10';

        const apiUrl = `https://kp-hl-httpapi-prod.angelone.in/goldcalculator?city=${city}&carat=${carat}&grams=${grams}`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch gold calculator data');
        }

        const data: GoldCalculatorResponse = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching gold calculator data:', error);
        return NextResponse.json(
            {
                success: false,
                data: {
                    city: '',
                    grams: 0,
                    carat: '',
                    price: '0',
                    difference: '0',
                    percentage: '0%'
                },
                error: 'Failed to fetch gold calculator data'
            },
            { status: 500 }
        );
    }
}
