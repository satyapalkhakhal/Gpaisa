// Single source of truth for category slug <-> DB value mapping.
// articles.category stores the uppercase dbValue (e.g. 'BUSINESS'), not the URL slug.
export interface CategoryDef {
    slug: string;
    dbValue: string;
    name: string;
    description: string;
}

export const CATEGORIES: CategoryDef[] = [
    { slug: 'business', dbValue: 'BUSINESS', name: 'Business News', description: 'Latest business news, market updates, and corporate developments' },
    { slug: 'finance', dbValue: 'FINANCE', name: 'Finance News', description: 'Financial news, investment tips, and economic analysis' },
    { slug: 'ipo', dbValue: 'IPO', name: 'IPO News', description: 'Latest IPO launches, GMP, and listing updates' },
    { slug: 'world-affairs', dbValue: 'WORLD', name: 'International News', description: 'Global news and international affairs coverage' },
];

// Off-topic categories dropped from a finance-authority site (2026-07-17).
// Their category hub pages and sitemap/index entries were removed; individual
// articles already published under these categories are set to noindex
// rather than deleted, since the underlying content still exists in Supabase.
export const DROPPED_CATEGORY_DB_VALUES = ['TECHNOLOGY', 'TRAVEL', 'SPORTS', 'MOVIES', 'EDUCATION'];

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryByDbValue(value: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.dbValue.toLowerCase() === (value || '').toLowerCase());
}
