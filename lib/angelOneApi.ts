import { SilverCity, SilverCalculatorResponse, SilverHistoryResponse, GoldHistoryResponse } from '@/types';
import { goldHistoryRatePerGram } from '@/lib/goldUnits';
import type { GoldCarat, GoldHistoryBundle } from '@/lib/goldHistoryBundle';
import { SILVER_CITIES } from '@/lib/silverCityList';

const BASE_URL = 'https://kp-hl-httpapi-prod.angelone.in';

/** Gold cities with rate pages; their median is the all-India rate. */
export const GOLD_CITY_NAMES = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Coimbatore', 'Kerala'];

function median(values: number[]): number {
    const s = [...values].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * Median per date across city feeds, newest first, with each row's change from the next.
 * Only dates that at least half the feeds report are kept, so one stray city can't set the rate.
 */
function medianSeries(feeds: { date: string; value: number }[][]): { date: string; value: number; change: number; changePercent: number }[] {
    const byDate = new Map<string, number[]>();
    for (const feed of feeds) for (const { date, value } of feed) {
        if (value > 0) byDate.set(date, [...(byDate.get(date) ?? []), value]);
    }
    const longest = feeds.reduce((a, b) => (b.length > a.length ? b : a), []);
    const rows = longest
        .filter(({ date }) => (byDate.get(date)?.length ?? 0) * 2 >= feeds.length)
        .map(({ date }) => ({ date, value: median(byDate.get(date)!) }));
    return rows.map((row, i) => {
        const prev = rows[i + 1];
        const change = prev ? row.value - prev.value : 0;
        return { ...row, change, changePercent: prev ? (change / prev.value) * 100 : 0 };
    });
}

/**
 * AngelOne's own 'India' series runs about 7% (gold) and 16% (silver) below its city rates and
 * the market, so the all-India rate is the median of the city feeds instead.
 */
async function fetchIndiaGoldHistory(carat: string): Promise<GoldHistoryResponse | null> {
    const feeds = (await Promise.all(GOLD_CITY_NAMES.map(city => fetchCityGoldHistory(city, carat))))
        .map(res => (res?.data ?? []).map(r => ({ date: r.date, value: goldHistoryRatePerGram(r.rate) })))
        .filter(feed => feed.length);
    if (!feeds.length) return null;
    const sign = (n: number) => (n > 0 ? '+' : '');
    return {
        success: true,
        data: medianSeries(feeds).map(r => ({ date: r.date, rate: r.value.toFixed(2), change: `${sign(r.changePercent)}${r.changePercent.toFixed(2)}` })),
    };
}

async function fetchIndiaSilverHistory(gram: number): Promise<SilverHistoryResponse | null> {
    const feeds = (await Promise.all(SILVER_CITIES.map(c => fetchSilverHistory(c.symbol, gram))))
        .map(res => (res?.data?.history ?? []).map(h => ({ date: h.date, value: parseFloat(String(h.price)) })))
        .filter(feed => feed.length);
    if (!feeds.length) return null;
    return {
        success: true,
        data: {
            gram,
            history: medianSeries(feeds).map(r => ({
                date: r.date,
                price: r.value.toFixed(2),
                differenceAmount: r.change.toFixed(2),
                differencePercentage: r.changePercent.toFixed(2),
            })),
        },
    };
}

export async function fetchGoldHistory(city: string = 'India', carat: string = '24k'): Promise<GoldHistoryResponse | null> {
    return city === 'India' ? fetchIndiaGoldHistory(carat) : fetchCityGoldHistory(city, carat);
}

async function fetchCityGoldHistory(city: string, carat: string): Promise<GoldHistoryResponse | null> {
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

/** Gold history for one city across carats, for seeding SSR initial state (see lib/goldHistoryBundle.ts). */
export async function fetchGoldHistoryBundle(city: string = 'India', carats: GoldCarat[] = ['24k', '22k', '18k']): Promise<GoldHistoryBundle> {
    const entries = await Promise.all(carats.map(async (carat) => [carat, (await fetchGoldHistory(city, carat))?.data] as const));
    return Object.fromEntries(entries.filter(([, data]) => Array.isArray(data) && data.length)) as GoldHistoryBundle;
}

/**
 * 24K/22K/18K gold rates per gram for seeding SSR initial state. 'India' is the indicative
 * all-India rate; a city name (e.g. 'Delhi') gives that city's rate, as used by its history table.
 */
export async function fetchGoldRatesAllCarats(city: string = 'India'): Promise<GoldCaratRate[]> {
    const [h24k, h22k, h18k] = await Promise.all([
        fetchGoldHistory(city, '24k'),
        fetchGoldHistory(city, '22k'),
        fetchGoldHistory(city, '18k'),
    ]);

    if (!h24k?.data?.length || !h22k?.data?.length || !h18k?.data?.length) {
        return [];
    }

    const toRate = (history: GoldHistoryResponse, purity: '24K' | '22K' | '18K'): GoldCaratRate => {
        const latest = history.data[0];
        return {
            purity,
            pricePerGram: goldHistoryRatePerGram(latest.rate),
            change: parseFloat(latest.change) * goldHistoryRatePerGram(latest.rate) / 100,
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
    if (symbol === 'XAG') return fetchIndiaSilverHistory(gram);
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
