import { SilverCity, SilverCalculatorResponse, SilverHistoryResponse, GoldHistoryResponse } from '@/types';

const BASE_URL = 'https://kp-hl-httpapi-prod.angelone.in';

export async function fetchGoldHistory(city: string = 'India', carat: string = '24k'): Promise<GoldHistoryResponse | null> {
    try {
        const response = await fetch(`${BASE_URL}/goldhistory?city=${city}&carat=${carat}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await response.json();
        if (data.success) {
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching gold history:', error);
        return null;
    }
}

export interface GoldCaratRate {
    purity: '24K' | '22K' | '18K';
    pricePerGram: number;
    change: number;
    changePercent: number;
}

/** National (India-wide) 24K/22K/18K gold rates per gram, for seeding SSR initial state. */
export async function fetchGoldRatesAllCarats(): Promise<GoldCaratRate[]> {
    const [h24k, h22k, h18k] = await Promise.all([
        fetchGoldHistory('India', '24k'),
        fetchGoldHistory('India', '22k'),
        fetchGoldHistory('India', '18k'),
    ]);

    if (!h24k?.data?.length || !h22k?.data?.length || !h18k?.data?.length) {
        return [];
    }

    const toRate = (history: GoldHistoryResponse, purity: '24K' | '22K' | '18K'): GoldCaratRate => {
        const latest = history.data[0];
        return {
            purity,
            pricePerGram: parseFloat(latest.rate) / 10,
            change: parseFloat(latest.change) * (parseFloat(latest.rate) / 10) / 100,
            changePercent: parseFloat(latest.change),
        };
    };

    return [
        toRate(h24k, '24K'),
        toRate(h22k, '22K'),
        toRate(h18k, '18K'),
    ];
}

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

export interface SilverRateData {
    price: number;
    change: number;
    changePercent: number;
}

/** Latest silver rate (per gram) for a given symbol, for seeding SSR initial state. */
export async function fetchSilverRateData(symbol: string = 'XAG'): Promise<SilverRateData | null> {
    if (symbol.includes('-')) {
        const calc = await fetchSilverCalculator(symbol);
        if (!calc?.data?.silver) return null;
        return {
            price: calc.data.silver.today,
            change: calc.data.silver.differenceAmount,
            changePercent: calc.data.silver.differencePercentage,
        };
    }

    const history = await fetchSilverHistory(symbol, 1);
    if (!history?.data?.history?.length) return null;
    const latest = history.data.history[0];
    return {
        price: parseFloat(String(latest.price)),
        change: parseFloat(String(latest.differenceAmount)),
        changePercent: parseFloat(String(latest.differencePercentage)),
    };
}
