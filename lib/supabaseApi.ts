// Supabase API Service for News Articles
import { CATEGORIES } from './categories';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug: Log env var availability (safe - only logs existence, not values)
if (!SUPABASE_URL) {
    console.error('[SUPABASE] ❌ NEXT_PUBLIC_SUPABASE_URL is not set!');
}
if (!SUPABASE_ANON_KEY) {
    console.error('[SUPABASE] ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set!');
}

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

// Reusable fetch helper with proper error logging
// `revalidateSeconds` matches the ISR window of the calling page (see each
// wrapper's default below) instead of forcing `no-store`, so the CDN caching
// already configured in next.config.mjs for these routes actually takes effect.
async function supabaseFetch(endpoint: string, tag?: string, revalidateSeconds: number = 300): Promise<any[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error(`[SUPABASE] Cannot fetch "${tag || endpoint}" - missing env vars. URL=${!!SUPABASE_URL}, KEY=${!!SUPABASE_ANON_KEY}`);
        return [];
    }

    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: revalidateSeconds }
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'unknown');
            console.error(`[SUPABASE] ❌ ${tag || endpoint} failed: HTTP ${response.status} - ${errorText}`);
            return [];
        }

        const data = await response.json();
        console.log(`[SUPABASE] ✅ ${tag || endpoint}: got ${Array.isArray(data) ? data.length : 1} results`);
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error(`[SUPABASE] ❌ ${tag || endpoint} threw:`, error);
        return [];
    }
}

/**
 * Fetch all articles ordered by published_at desc
 */
export async function fetchAllArticles(limit: number = 50, revalidateSeconds: number = 300): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&category=in.(BUSINESS,FINANCE)&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchAllArticles',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
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
    revalidateSeconds: number = 300
): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&category=ilike.${encodeURIComponent(category)}&status=eq.published&order=published_at.desc&limit=${limit}`,
        `fetchByCategory(${category})`,
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
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
 * Fetch featured articles
 */
export async function fetchFeaturedArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&category=in.(BUSINESS,FINANCE)&is_featured=eq.true&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchFeatured',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Fetch trending articles
 */
export async function fetchTrendingArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&category=in.(BUSINESS,FINANCE)&is_trending=eq.true&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchTrending',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Fetch editors pick articles
 */
export async function fetchEditorsPickArticles(limit: number = 5, revalidateSeconds: number = 300): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&is_editors_pick=eq.true&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchEditorsPick',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Fetch Gold News - articles whose content contains "gold" keyword
 */
export async function fetchGoldNews(limit: number = 6, revalidateSeconds: number = 86400): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&or=(content.ilike.*gold*,title.ilike.*gold*)&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchGoldNews',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Fetch Silver News - articles whose content contains "silver" keyword
 */
export async function fetchSilverNews(limit: number = 6, revalidateSeconds: number = 86400): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&or=(content.ilike.*silver*,title.ilike.*silver*)&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchSilverNews',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Fetch Loan News - articles with category IN ('BUSINESS','FINANCE') and content containing 'Home Loan'
 */
export async function fetchLoanNews(limit: number = 6, revalidateSeconds: number = 300): Promise<Article[]> {
    const articles = await supabaseFetch(
        `articles?select=*&category=in.(BUSINESS,FINANCE)&content=ilike.*Home Loan*&status=eq.published&order=published_at.desc&limit=${limit}`,
        'fetchLoanNews',
        revalidateSeconds
    );
    return articles.map(normalizeArticle);
}

/**
 * Get article by slug (SEO-friendly URLs)
 */
export async function fetchArticleBySlug(slug: string, revalidateSeconds: number = 86400): Promise<Article | null> {
    const articles = await supabaseFetch(
        `articles?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published`,
        `fetchBySlug(${slug})`,
        revalidateSeconds
    );
    return articles.length > 0 ? normalizeArticle(articles[0]) : null;
}

/**
 * Get article by ID
 */
export async function fetchArticleById(id: string, revalidateSeconds: number = 300): Promise<Article | null> {
    const articles = await supabaseFetch(
        `articles?select=*&id=eq.${id}&status=eq.published`,
        `fetchById(${id})`,
        revalidateSeconds
    );
    return articles.length > 0 ? normalizeArticle(articles[0]) : null;
}
