// AngelOne /goldhistory responses for one city, keyed by carat (latest first). Pages load
// the bundle on the server (fetchGoldHistoryBundle in lib/angelOneApi.ts) and pass it to
// the gold components as `initialHistory`, so the tables are in the server HTML: crawlers
// can't fetch /api/* (robots.txt), and visitors don't see the layout jump on load.
// Components without an initial bundle fall back to fetchGoldHistoryBundleClient.
import type { GoldHistoryItem } from '@/types';

export type GoldCarat = '24k' | '22k' | '18k';

export type GoldHistoryBundle = Partial<Record<GoldCarat, GoldHistoryItem[]>>;

export async function fetchGoldHistoryBundleClient(city: string, carats: GoldCarat[]): Promise<GoldHistoryBundle> {
    const entries = await Promise.all(carats.map(async (carat) => {
        try {
            const json = await fetch(`/api/gold-history?city=${encodeURIComponent(city)}&carat=${carat}`).then(r => r.json());
            return [carat, json.success && Array.isArray(json.data) ? (json.data as GoldHistoryItem[]) : undefined] as const;
        } catch (error) {
            console.error(`Failed to load gold history (${city}, ${carat}):`, error);
            return [carat, undefined] as const;
        }
    }));
    return Object.fromEntries(entries.filter(([, data]) => data)) as GoldHistoryBundle;
}

/** True when every requested carat has at least `minRows` history rows. */
export function hasCarats(bundle: GoldHistoryBundle | undefined, carats: GoldCarat[], minRows = 1): bundle is GoldHistoryBundle {
    return !!bundle && carats.every((c) => (bundle[c]?.length ?? 0) >= minRows);
}
