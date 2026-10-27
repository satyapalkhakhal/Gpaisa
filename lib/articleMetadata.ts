import type { Metadata } from 'next';
import type { Article } from './articlesApi';
import { DROPPED_CATEGORY_DB_VALUES } from './categories';
import { INDEXABLE_ROBOTS, metaDescription, pageTitle } from './seo';
import { HREFLANG, SITE_URL, articlePath, toArticleLanguage } from './articleLocale';

export function isDroppedCategory(category?: string | null): boolean {
    return !!category && DROPPED_CATEGORY_DB_VALUES.includes(category.toUpperCase());
}

/**
 * hreflang alternates for an article and its translation. Only emitted when a published
 * translation exists — each language version is self-canonical, and both list each other.
 */
export function articleLanguageAlternates(article: Article, translation: Article | null): Record<string, string> | undefined {
    if (!translation) return undefined;
    const lang = toArticleLanguage(article.language);
    const other = toArticleLanguage(translation.language);
    const urls: Record<string, string> = {
        [HREFLANG[lang]]: `${SITE_URL}${articlePath(lang, article.slug)}`,
        [HREFLANG[other]]: `${SITE_URL}${articlePath(other, translation.slug)}`,
    };
    urls['x-default'] = urls[HREFLANG.en];
    return urls;
}

export function buildArticleMetadata(article: Article, translation: Article | null): Metadata {
    const lang = toArticleLanguage(article.language);
    const url = `${SITE_URL}${articlePath(lang, article.slug)}`;
    const publishedTime = new Date(article.published_at || Date.now()).toISOString();
    const modifiedTime = new Date(article.content_updated_at || article.published_at || Date.now()).toISOString();
    // The SEO title/description set in admin win over the headline and excerpt, which are usually too long.
    const description = metaDescription(article.meta_description || article.excerpt || article.title);

    return {
        title: pageTitle(article.meta_title || article.title),
        description,
        authors: [{ name: article.author || 'Gpaisa Desk' }],
        openGraph: {
            title: article.title,
            description,
            type: 'article',
            url,
            locale: lang === 'hi' ? 'hi_IN' : 'en_IN',
            publishedTime,
            modifiedTime,
            authors: [article.author || 'Gpaisa Desk'],
            // Real dimensions vary per upload, so they are not declared here.
            images: article.image_url ? [{ url: article.image_url, alt: article.title }] : [],
            siteName: 'gpaisa.in',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
            images: article.image_url ? [article.image_url] : [],
        },
        alternates: {
            canonical: url,
            languages: articleLanguageAlternates(article, translation),
            // The root layout already links the English feed on every page.
            ...(lang === 'hi' ? { types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` } } : {}),
        },
        robots: isDroppedCategory(article.category) ? { index: false, follow: true } : INDEXABLE_ROBOTS,
    };
}
