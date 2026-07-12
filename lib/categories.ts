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
    { slug: 'technology', dbValue: 'TECHNOLOGY', name: 'Technology News', description: 'Latest tech news, gadgets, AI, and software development' },
    { slug: 'travel', dbValue: 'TRAVEL', name: 'Travel News', description: 'Travel guides, destinations, and tourism updates' },
    { slug: 'finance', dbValue: 'FINANCE', name: 'Finance News', description: 'Financial news, investment tips, and economic analysis' },
    { slug: 'ipo', dbValue: 'IPO', name: 'IPO News', description: 'Latest IPO launches, GMP, and listing updates' },
    { slug: 'world-affairs', dbValue: 'WORLD', name: 'International News', description: 'Global news and international affairs coverage' },
    { slug: 'sports', dbValue: 'SPORTS', name: 'Sports News', description: 'Latest sports news, scores, and updates' },
    { slug: 'movies', dbValue: 'MOVIES', name: 'Movies News', description: 'Latest movie news, reviews, and entertainment updates' },
    { slug: 'education', dbValue: 'EDUCATION', name: 'Education News', description: 'Education news, exam updates, and academic developments' },
];

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryByDbValue(value: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.dbValue.toLowerCase() === (value || '').toLowerCase());
}
