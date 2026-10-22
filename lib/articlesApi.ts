// Public read API for News Articles (server-only — reads Postgres directly).
import { CATEGORIES, DROPPED_CATEGORY_DB_VALUES } from './categories';
import { cachedRows } from './db';
import type { ArticleLanguage } from './articleLocale';

export interface Article {
    id: string;
    title: string;
    slug: string;
    category: string;
    subcategory: string | null;
    date: string;
    published_at: string;
    excerpt: string;
    content: string;
    image_url: string;
    author: string;
    author_avatar: string;
    read_time: string;
    tags: string[];
    is_featured: boolean;
    is_editors_pick: boolean;
    is_trending: boolean;
    masonry_height: string | null;
    created_at: string;
    status?: 'draft' | 'published';
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    focus_keyword?: string;
    // Legacy compat
    featured_image_url?: string;
    publishedAt?: string;
    category_id?: string;
    updated_at?: string;
    content_updated_at?: string | null;
    language?: ArticleLanguage;
    translation_of?: string | null;
    article_type?: 'article' | 'news';
}

// Helper to normalize article data for backward compatibility
function normalizeArticle(a: any): Article {
    return {
        ...a,
        featured_image_url: a.image_url || a.featured_image_url || '',
        publishedAt: a.published_at,
        image_url: a.image_url || a.featured_image_url || '',
    };
}

// Published articles matching `where`, newest first. `revalidateSeconds` matches the
// ISR window of the calling page (see each wrapper's default below), so the CDN
// caching already configured in next.config.mjs for these routes actually takes effect.
// `language` defaults to English so existing listings never pick up Hindi articles;
// null means any language.
async function fetchArticles(
    where: string,
    params: unknown[],
    limit: number | null,
    tag: string,
    revalidateSeconds: number,
    language: ArticleLanguage | null = 'en'
): Promise<Article[]> {
    const limitSql = limit == null ? '' : ` LIMIT ${Math.max(0, Math.floor(limit))}`;
    const languageSql = language ? ` AND language = '${language === 'hi' ? 'hi' : 'en'}'` : '';
    const rows = await cachedRows(
        `SELECT * FROM articles WHERE status = 'published'${languageSql} AND ${where} ORDER BY published_at DESC${limitSql}`,
        params,
        revalidateSeconds,
        tag
    );
    return rows.map(normalizeArticle);
}

const PUBLIC_CATEGORIES = `category IN ('BUSINESS', 'FINANCE', 'CREDIT_CARDS')`;

/**
 * News for one IPO's detail page: articles linked to it via ipo_id, or whose title names
 * "<company> IPO" (covers the many articles written before the link field existed).
 */
export async function fetchArticlesForIpo(ipoId: string, companyName: string, limit: number = 6, revalidateSeconds: number = 300): Promise<Article[]> {
    const titlePattern = `%${companyName.replace(/[\\%_]/g, '\\$&')} IPO%`;
    return fetchArticles('(ipo_id = $1 OR title ILIKE $2)', [ipoId, titlePattern], limit, `fetchArticlesForIpo(${ipoId})`, revalidateSeconds);
}

/**
 * Fetch all articles ordered by published_at desc
 */
export async function fetchAllArticles(limit: number = 50, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchArticles(PUBLIC_CATEGORIES, [], limit, 'fetchAllArticles', revalidateSeconds);
}

/**
 * Fetch latest articles (alias for backward compat)
 */
export async function fetchLatestArticles(limit: number = 20, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchAllArticles(limit, revalidateSeconds);
}

/**
 * Fetch articles by category (e.g., 'TECHNOLOGY', 'BUSINESS', 'TRAVEL')
 */
export async function fetchArticlesByCategory(
    category: string,
    limit: number = 10,
    revalidateSeconds: number = 300,
    language: ArticleLanguage = 'en'
): Promise<Article[]> {
    return fetchArticles('category ILIKE $1', [category], limit, `fetchByCategory(${category})`, revalidateSeconds, language);
}

/**
 * Latest on-topic articles in one language (all categories except the dropped ones).
 */
export async function fetchArticlesByLanguage(
    language: ArticleLanguage,
    limit: number = 50,
    revalidateSeconds: number = 300
): Promise<Article[]> {
    return fetchArticles('category <> ALL($1::text[])', [DROPPED_CATEGORY_DB_VALUES], limit, `fetchByLanguage(${language})`, revalidateSeconds, language);
}

/**
 * Fetch articles by category slug (backward compat - maps slug to category name)
 */
export async function fetchArticlesByCategorySlug(
    slug: string,
    limit: number = 10,
    revalidateSeconds: number = 86400
): Promise<Article[]> {
    // Map slugs to actual category values in the DB
    const slugToCategoryMap: Record<string, string> = {
        news: '%', // all categories for "news"
        ...Object.fromEntries(CATEGORIES.map(c => [c.slug, c.dbValue])),
    };

    const category = slugToCategoryMap[slug];

    if (!category) {
        // Try direct match
        return fetchArticlesByCategory(slug, limit, revalidateSeconds);
    }

    if (category === '%') {
        return fetchLatestArticles(limit, revalidateSeconds);
    }

    return fetchArticlesByCategory(category, limit, revalidateSeconds);
}

/**
 * Published articles (both languages, on-topic categories) whose byline matches `nameKey`
 * case- and space-insensitively — see authorNameKey() in lib/authors.ts.
 */
export async function fetchArticlesByAuthor(nameKey: string, limit: number = 200, revalidateSeconds: number = 3600): Promise<Article[]> {
    return fetchArticles(
        `lower(regexp_replace(btrim(author), '\\s+', ' ', 'g')) = $1 AND category <> ALL($2::text[])`,
        [nameKey, DROPPED_CATEGORY_DB_VALUES],
        limit,
        `fetchByAuthor(${nameKey})`,
        revalidateSeconds,
        null
    );
}

/**
 * Fetch featured articles
 */
export async function fetchFeaturedArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchArticles(`${PUBLIC_CATEGORIES} AND is_featured`, [], limit, 'fetchFeatured', revalidateSeconds);
}

/**
 * Fetch trending articles
 */
export async function fetchTrendingArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchArticles(`${PUBLIC_CATEGORIES} AND is_trending`, [], limit, 'fetchTrending', revalidateSeconds);
}

/**
 * Fetch editors pick articles
 */
export async function fetchEditorsPickArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchArticles('is_editors_pick', [], limit, 'fetchEditorsPick', revalidateSeconds);
}

/**
 * Fetch Gold News - articles whose content contains "gold" keyword
 */
export async function fetchGoldNews(limit: number = 6, revalidateSeconds: number = 86400): Promise<Article[]> {
    return fetchArticles(`(content ILIKE '%gold%' OR title ILIKE '%gold%')`, [], limit, 'fetchGoldNews', revalidateSeconds);
}

/**
 * Fetch Silver News - articles whose content contains "silver" keyword
 */
export async function fetchSilverNews(limit: number = 6, revalidateSeconds: number = 86400): Promise<Article[]> {
    return fetchArticles(`(content ILIKE '%silver%' OR title ILIKE '%silver%')`, [], limit, 'fetchSilverNews', revalidateSeconds);
}

/**
 * Fetch Loan News - articles with category IN ('BUSINESS','FINANCE') and content containing 'Home Loan'
 */
export async function fetchLoanNews(limit: number = 6, revalidateSeconds: number = 300): Promise<Article[]> {
    return fetchArticles(`${PUBLIC_CATEGORIES} AND content ILIKE '%Home Loan%'`, [], limit, 'fetchLoanNews', revalidateSeconds);
}

/**
 * Fetch credit card articles (reviews, comparisons, best-of lists) plus credit-score guides.
 * Matched case-insensitively because the subcategory is stored as both "Credit Card" and "Credit card".
 */
export async function fetchCreditCardArticles(limit: number = 50, revalidateSeconds: number = 3600): Promise<Article[]> {
    return fetchArticles(
        `${PUBLIC_CATEGORIES} AND (category = 'CREDIT_CARDS' OR subcategory ILIKE '%credit%card%' OR title ILIKE '%credit%card%' OR title ILIKE '%cibil%' OR title ILIKE '%credit%score%')`,
        [],
        limit,
        'fetchCreditCardArticles',
        revalidateSeconds
    );
}

/**
 * Get article by slug (SEO-friendly URLs)
 */
export async function fetchArticleBySlug(
    slug: string,
    revalidateSeconds: number = 86400,
    language: ArticleLanguage = 'en'
): Promise<Article | null> {
    const articles = await fetchArticles('slug = $1', [slug], null, `fetchBySlug(${slug})`, revalidateSeconds, language);
    return articles[0] ?? null;
}

/**
 * The published counterpart of an article in the other language, if any:
 * a Hindi article's English original, or an English article's Hindi translation.
 */
export async function fetchArticleTranslation(article: Article, revalidateSeconds: number = 86400): Promise<Article | null> {
    if (article.language === 'hi') {
        if (!article.translation_of) return null;
        const rows = await fetchArticles('id::text = $1', [article.translation_of], 1, `fetchTranslationOf(${article.id})`, revalidateSeconds, 'en');
        return rows[0] ?? null;
    }
    const rows = await fetchArticles('translation_of::text = $1', [article.id], 1, `fetchTranslationFor(${article.id})`, revalidateSeconds, 'hi');
    return rows[0] ?? null;
}

/**
 * Get article by ID
 */
export async function fetchArticleById(id: string, revalidateSeconds: number = 300): Promise<Article | null> {
    const articles = await fetchArticles('id::text = $1', [id], null, `fetchById(${id})`, revalidateSeconds, null);
    return articles[0] ?? null;
}

/**
 * Minimal field set for sitemap generation — every published article (both languages)
 * outside `excludedCategories`, with what's needed to pair translations.
 */
export async function fetchArticleSitemapEntries(
    excludedCategories: string[],
    revalidateSeconds: number = 86400
): Promise<Pick<Article, 'id' | 'slug' | 'published_at' | 'content_updated_at' | 'category' | 'language' | 'translation_of' | 'author'>[]> {
    return cachedRows(
        `SELECT id, slug, published_at, content_updated_at, category, language, translation_of, author FROM articles
         WHERE status = 'published' AND category <> ALL($1::text[])
         ORDER BY published_at DESC LIMIT 1000`,
        [excludedCategories],
        revalidateSeconds,
        'fetchArticleSitemapEntries'
    );
}

/**
 * Latest published articles outside `excludedCategories`, for the RSS feed.
 */
export async function fetchFeedArticles(
    excludedCategories: string[],
    limit: number = 50,
    revalidateSeconds: number = 3600,
    language: ArticleLanguage = 'en'
): Promise<Article[]> {
    return fetchArticles('category <> ALL($1::text[])', [excludedCategories], limit, `fetchFeedArticles(${language})`, revalidateSeconds, language);
}

/**
 * Lightweight cards for the gold/silver news widgets (client components fetch these via /api/news).
 */
export async function fetchMetalNewsCards(metal: 'gold' | 'silver', limit: number = 6, revalidateSeconds: number = 3600, language: ArticleLanguage = 'en') {
    // Articles about the metal (title match) first, then Business articles that discuss it;
    // an IPO or card review that mentions gold in passing is not gold news.
    return cachedRows(
        `SELECT id, title, slug, excerpt, image_url, published_at, date, read_time, author, category, language FROM articles
         WHERE status = 'published' AND language = $2 AND category <> ALL($3::text[])
           AND (title ILIKE $1 OR (category = 'BUSINESS' AND content ILIKE $1))
         ORDER BY (title ILIKE $1) DESC, published_at DESC LIMIT ${Math.max(0, Math.floor(limit))}`,
        [`%${metal}%`, language, DROPPED_CATEGORY_DB_VALUES],
        revalidateSeconds,
        `fetchMetalNewsCards(${metal},${language})`
    );
}
