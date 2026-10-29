// Server-side data for the gold and silver rate pages: today's rate with the change from the
// previous day, a short history and the city comparison table, all in one shape so the page
// components (components/rates) can render gold and silver the same way.
import { GOLD_CITY_NAMES, fetchGoldHistoryBundle, fetchSilverHistory } from './angelOneApi';
import { goldHistoryRatePerGram } from './goldUnits';
import { SILVER_CITIES } from './silverCityList';

/** Gold cities with rate pages (/gold-rate/<slug>), in display order. */
export const GOLD_CITIES: { city: string; slug: string }[] = GOLD_CITY_NAMES.map(city => ({ city, slug: city.toLowerCase() }));

export interface RatePoint {
    /** Display date as the feed gives it, e.g. "21 October 2026". */
    date: string;
    /** INR per gram. */
    perGram: number;
    /** Change from the previous point, INR per gram (0 for the oldest point). */
    change: number;
    changePercent: number;
}

/** Newest first. */
export type RateSeries = RatePoint[];

export interface GoldSnapshot {
    '24K': RateSeries;
    '22K': RateSeries;
    '18K': RateSeries;
}

/** Rebuilds per-gram changes from consecutive closes, so every row has a consistent ₹ change. */
function toSeries(rows: { date: string; perGram: number }[]): RateSeries {
    return rows.map((row, i) => {
        const prev = rows[i + 1];
        const change = prev ? row.perGram - prev.perGram : 0;
        return { ...row, change, changePercent: prev && prev.perGram ? (change / prev.perGram) * 100 : 0 };
    });
}

/** Gold history for one city ('India' for the indicative all-India rate). Empty series when the feed fails. */
export async function fetchGoldSnapshot(city: string): Promise<GoldSnapshot> {
    const bundle = await fetchGoldHistoryBundle(city, ['24k', '22k', '18k']).catch(() => ({}) as Awaited<ReturnType<typeof fetchGoldHistoryBundle>>);
    const series = (carat: '24k' | '22k' | '18k') =>
        toSeries((bundle[carat] ?? []).map(r => ({ date: r.date, perGram: goldHistoryRatePerGram(r.rate) })).filter(r => r.perGram > 0));
    return { '24K': series('24k'), '22K': series('22k'), '18K': series('18k') };
}

export interface CityRateRow {
    city: string;
    slug: string;
    /** Latest INR per gram for each column (gold: 24K/22K; silver: one rate). */
    rates: Record<string, number>;
    changePercent: number;
}

export async function fetchGoldCityTable(): Promise<CityRateRow[]> {
    const rows = await Promise.all(GOLD_CITIES.map(async ({ city, slug }): Promise<CityRateRow | null> => {
        const snap = await fetchGoldSnapshot(city);
        const r24 = snap['24K'][0];
        const r22 = snap['22K'][0];
        if (!r24 || !r22) return null;
        return { city, slug, rates: { '24K': r24.perGram, '22K': r22.perGram }, changePercent: r24.changePercent };
    }));
    return rows.filter((r): r is CityRateRow => r !== null);
}

/**
 * Silver for one AngelOne symbol ('XAG' = all-India, 'XAG-MUMB' = Mumbai…): the last ten days
 * per gram, newest first. The history feed alone is used (it includes today), so the page,
 * its history table and the city table always agree.
 */
export async function fetchSilverSeries(symbol: string): Promise<RateSeries> {
    const history = await fetchSilverHistory(symbol, 10).catch(() => null);
    const gram = history?.data?.gram || 10;
    return toSeries((history?.data?.history ?? [])
        .map(h => ({ date: h.date, perGram: parseFloat(String(h.price)) / gram }))
        .filter(r => r.perGram > 0));
}

export async function fetchSilverCityTable(): Promise<CityRateRow[]> {
    const rows = await Promise.all(SILVER_CITIES.map(async ({ city, slug, symbol }): Promise<CityRateRow | null> => {
        const latest = (await fetchSilverSeries(symbol))[0];
        if (!latest) return null;
        return { city, slug, rates: { silver: latest.perGram }, changePercent: latest.changePercent };
    }));
    return rows.filter((r): r is CityRateRow => r !== null);
}

/** High, low and net move over a series (newest first). */
export function seriesStats(series: RateSeries) {
    if (series.length === 0) return null;
    const values = series.map(p => p.perGram);
    const first = series[series.length - 1].perGram;
    const last = series[0].perGram;
    return {
        high: Math.max(...values),
        low: Math.min(...values),
        change: last - first,
        changePercent: first ? ((last - first) / first) * 100 : 0,
        from: series[series.length - 1].date,
        to: series[0].date,
    };
}
