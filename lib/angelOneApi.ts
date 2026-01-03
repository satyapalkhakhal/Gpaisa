import { SilverCity, SilverCalculatorResponse, SilverHistoryResponse } from '@/types';

const BASE_URL = 'https://kp-hl-httpapi-prod.angelone.in';

export async function fetchSilverCities(): Promise<SilverCity[]> {
    try {
        const response = await fetch(`${BASE_URL}/silverCityList`, {
            next: { revalidate: 86400 } // Cache for 24 hours as city list rarely changes
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching silver cities:', error);
        return [];
    }
}

export async function fetchSilverHistory(symbol: string = 'XAG', gram: number = 10): Promise<SilverHistoryResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/silverhistory?symbol=${symbol}&gram=${gram}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await response.json();
        if (data.success) {
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching silver history:', error);
        return null;
    }
}

export async function fetchSilverCalculator(symbol: string): Promise<SilverCalculatorResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/silverCalculator?symbol=${symbol}`, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });
        const data = await response.json();
        if (data.success) {
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching silver calculator:', error);
        return null;
    }
}
