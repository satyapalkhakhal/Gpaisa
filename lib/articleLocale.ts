// Edge-safe helpers shared by the English (/articles) and Hindi (/hi) article routes.

export type ArticleLanguage = 'en' | 'hi';

export const SITE_URL = 'https://www.gpaisa.in';

/** hreflang codes used in <link rel="alternate">, the sitemap and JSON-LD inLanguage. */
export const HREFLANG: Record<ArticleLanguage, string> = { en: 'en-IN', hi: 'hi-IN' };

export function articlePath(lang: ArticleLanguage, slug: string): string {
    return lang === 'hi' ? `/hi/articles/${slug}` : `/articles/${slug}`;
}

/** Listing page for each language: the English news hub, or the Hindi home. */
export function articleHubPath(lang: ArticleLanguage): string {
    return lang === 'hi' ? '/hi' : '/news';
}

// Hindi counterparts of site-wide nav destinations (header and footer). Page-level language
// switching uses each page's hreflang alternates instead (components/LanguageSwitcher.tsx).
const HINDI_NAV_HREFS: Record<string, string> = {
    '/gold-rate': '/hi/gold-rate',
    '/news': '/hi',
    '/category/business': '/hi/category/business',
    '/category/finance': '/hi/category/finance',
    '/category/ipo': '/hi/category/ipo',
};

/** A nav link in the reader's language: the Hindi version when one exists, else the original. */
export function localizedNavHref(href: string, lang: ArticleLanguage): string {
    return lang === 'hi' ? HINDI_NAV_HREFS[href] ?? href : href;
}

export function isHindiPath(pathname: string): boolean {
    return pathname === '/hi' || pathname.startsWith('/hi/');
}

export function toArticleLanguage(value: unknown): ArticleLanguage {
    return value === 'hi' ? 'hi' : 'en';
}
