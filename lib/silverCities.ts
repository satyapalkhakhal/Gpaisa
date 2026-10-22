// Owned list of silver rate cities and their AngelOne price symbols. Routes, sitemaps and
// /api/silver/cities all read this list, so a /silver-rate/[city] page no longer 404s when
// AngelOne's live city list changes or fails (it then shows "rate unavailable" instead).
//
// Snapshot of AngelOne's silverCityList (2026-10-22). To refresh, compare with
// fetchSilverCities() in lib/angelOneApi.ts. Delhi and Kerala have content in
// lib/citySilverData.ts but no AngelOne symbol, so they have no silver rate page.
import type { SilverCity } from '@/types';
import { getCitySilverData } from './citySilverData';
import { SILVER_CITIES } from './silverCityList';

export { SILVER_CITIES };

export function getSilverCity(slug: string): SilverCity | undefined {
    return SILVER_CITIES.find(c => c.slug === slug.toLowerCase());
}

/**
 * Cities with their own written content (lib/citySilverData.ts). The rest render a shared
 * template that is near-identical across cities, so they stay live but noindex and out of
 * the sitemap until they get city-specific content.
 */
export function isSilverCityIndexable(slug: string): boolean {
    return !!getSilverCity(slug) && !!getCitySilverData(slug);
}

export const INDEXABLE_SILVER_CITIES: SilverCity[] = SILVER_CITIES.filter(c => isSilverCityIndexable(c.slug));
