// Single source of truth for category slug <-> DB value mapping.
// articles.category stores the uppercase dbValue (e.g. 'BUSINESS'), not the URL slug.
// Each category has an English hub (/category/<slug>) and a Hindi hub (/hi/category/<slug>)
// listing that language's articles.
import { HREFLANG, SITE_URL, type ArticleLanguage } from './articleLocale';

export interface CategoryDef {
    slug: string;
    dbValue: string;
    name: string;
    description: string;
    hiName: string;
    hiDescription: string;
}

export const CATEGORIES: CategoryDef[] = [
    {
        slug: 'business', dbValue: 'BUSINESS', name: 'Business News', description: 'Latest business news, market updates, and corporate developments',
        hiName: 'बिज़नेस', hiDescription: 'शेयर बाजार, सोना-चांदी और कारोबार से जुड़ी ताज़ा खबरें और उनका आपकी जेब पर असर।',
    },
    {
        slug: 'finance', dbValue: 'FINANCE', name: 'Finance News', description: 'Financial news, investment tips, and economic analysis',
        hiName: 'पर्सनल फाइनेंस', hiDescription: 'लोन, EMI, FD, बचत योजनाएं, टैक्स, सैलरी और पेंशन से जुड़ी खबरें और गाइड, आसान हिंदी में।',
    },
    {
        slug: 'ipo', dbValue: 'IPO', name: 'IPO News', description: 'Latest IPO launches, GMP, and listing updates',
        hiName: 'आईपीओ', hiDescription: 'नए IPO, GMP, सब्सक्रिप्शन, अलॉटमेंट और लिस्टिंग की ताज़ा जानकारी हिंदी में।',
    },
    {
        slug: 'credit-cards', dbValue: 'CREDIT_CARDS', name: 'Credit Cards', description: 'Credit card reviews, comparisons and how to use credit well',
        hiName: 'क्रेडिट कार्ड', hiDescription: 'क्रेडिट कार्ड के रिव्यू, तुलना, फीस, रिवॉर्ड और CIBIL स्कोर से जुड़ी जानकारी हिंदी में।',
    },
    {
        slug: 'world-affairs', dbValue: 'WORLD', name: 'International News', description: 'Global news and international affairs coverage',
        hiName: 'दुनिया', hiDescription: 'दुनिया भर की आर्थिक खबरें और भारत पर उनका असर।',
    },
];

/** English credit card articles live on the /credit-cards hub, which predates this category. */
const ENGLISH_HUB_OVERRIDES: Record<string, string> = { 'credit-cards': '/credit-cards' };

export function categoryPath(category: CategoryDef, lang: ArticleLanguage): string {
    return lang === 'hi' ? `/hi/category/${category.slug}` : ENGLISH_HUB_OVERRIDES[category.slug] ?? `/category/${category.slug}`;
}

export function categoryName(category: CategoryDef, lang: ArticleLanguage): string {
    return lang === 'hi' ? category.hiName : category.name;
}

// Off-topic categories dropped from a finance-authority site (2026-07-17).
// Their category hub pages and sitemap/index entries were removed; individual
// articles already published under these categories are set to noindex
// rather than deleted, since the underlying content still exists in the database.
export const DROPPED_CATEGORY_DB_VALUES = ['TECHNOLOGY', 'TRAVEL', 'SPORTS', 'MOVIES', 'EDUCATION'];

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryByDbValue(value: string): CategoryDef | undefined {
    return CATEGORIES.find(c => c.dbValue.toLowerCase() === (value || '').toLowerCase());
}

/**
 * hreflang alternates for a category hub, only when both language versions have articles
 * (an empty hub is noindex, and hreflang must point at indexable pages).
 */
export function categoryLanguageAlternates(category: CategoryDef, hasEnglish: boolean, hasHindi: boolean) {
    if (!hasEnglish || !hasHindi) return undefined;
    const en = `${SITE_URL}${categoryPath(category, 'en')}`;
    return { [HREFLANG.en]: en, [HREFLANG.hi]: `${SITE_URL}${categoryPath(category, 'hi')}`, 'x-default': en };
}
