import { HREFLANG, SITE_URL } from './articleLocale';
import { isHindiGoldPageReviewed } from './cityGoldDataHi';

// English ↔ Hindi gold rate pages: /gold-rate[/city] ↔ /hi/gold-rate[/city].
// hreflang is only emitted once the Hindi page has passed editorial review (while
// unreviewed it is noindex, and hreflang must not point at noindex pages).

export function goldRatePath(lang: 'en' | 'hi', citySlug?: string): string {
    const base = lang === 'hi' ? '/hi/gold-rate' : '/gold-rate';
    return citySlug ? `${base}/${citySlug}` : base;
}

export function goldRateLanguageAlternates(citySlug?: string): Record<string, string> | undefined {
    if (!isHindiGoldPageReviewed(citySlug ?? 'hub')) return undefined;
    const en = `${SITE_URL}${goldRatePath('en', citySlug)}`;
    return {
        [HREFLANG.en]: en,
        [HREFLANG.hi]: `${SITE_URL}${goldRatePath('hi', citySlug)}`,
        'x-default': en,
    };
}
