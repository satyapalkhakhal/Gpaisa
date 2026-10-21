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

export function isHindiPath(pathname: string): boolean {
    return pathname === '/hi' || pathname.startsWith('/hi/');
}

export function toArticleLanguage(value: unknown): ArticleLanguage {
    return value === 'hi' ? 'hi' : 'en';
}
