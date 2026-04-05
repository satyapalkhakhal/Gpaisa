// Supabase API Service for News Articles
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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

/**
 * Fetch all articles ordered by published_at desc
 */
export async function fetchAllArticles(limit: number = 50): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            console.log('Failed to fetch all articles:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching all articles:', error);
        return [];
    }
}

/**
 * Fetch latest articles (alias for backward compat)
 */
export async function fetchLatestArticles(limit: number = 20): Promise<Article[]> {
    return fetchAllArticles(limit);
}

/**
 * Fetch articles by category (e.g., 'TECHNOLOGY', 'BUSINESS', 'TRAVEL')
 */
export async function fetchArticlesByCategory(
    category: string,
    limit: number = 10
): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&category=ilike.${encodeURIComponent(category)}&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            console.log('Failed to fetch articles by category:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching articles by category:', error);
        return [];
    }
}

/**
 * Fetch articles by category slug (backward compat - maps slug to category name)
 */
export async function fetchArticlesByCategorySlug(
    slug: string,
    limit: number = 10
): Promise<Article[]> {
    // Map slugs to actual category values in the DB
    const slugToCategoryMap: Record<string, string> = {
        'news': '%',           // all categories for "news"
        'business': 'BUSINESS',
        'technology': 'TECHNOLOGY',
        'travel': 'TRAVEL',
        'world-affairs': 'WORLD',
        'sports': 'SPORTS',
        'movies': 'MOVIES',
        'education': 'EDUCATION',
        'finance': 'FINANCE',
        'ipo': 'IPO',
    };

    const category = slugToCategoryMap[slug];

    if (!category) {
        // Try direct match
        return fetchArticlesByCategory(slug, limit);
    }

    if (category === '%') {
        return fetchLatestArticles(limit);
    }

    return fetchArticlesByCategory(category, limit);
}

/**
 * Fetch featured articles
 */
export async function fetchFeaturedArticles(limit: number = 5): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&is_featured=eq.true&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) return [];
        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching featured articles:', error);
        return [];
    }
}

/**
 * Fetch trending articles
 */
export async function fetchTrendingArticles(limit: number = 5): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&is_trending=eq.true&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) return [];
        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching trending articles:', error);
        return [];
    }
}

/**
 * Fetch editors pick articles
 */
export async function fetchEditorsPickArticles(limit: number = 5): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&is_editors_pick=eq.true&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) return [];
        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching editors pick articles:', error);
        return [];
    }
}

/**
 * Fetch Gold News - articles whose content contains "gold" keyword
 */
export async function fetchGoldNews(limit: number = 6): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&or=(content.ilike.*gold*,title.ilike.*gold*)&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            console.log('Failed to fetch gold news:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching gold news:', error);
        return [];
    }
}

/**
 * Fetch Silver News - articles whose content contains "silver" keyword
 */
export async function fetchSilverNews(limit: number = 6): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&or=(content.ilike.*silver*,title.ilike.*silver*)&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            console.log('Failed to fetch silver news:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles.map(normalizeArticle);
    } catch (error) {
        console.log('Error fetching silver news:', error);
        return [];
    }
}

/**
 * Get article by slug (SEO-friendly URLs)
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&slug=eq.${encodeURIComponent(slug)}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            return null;
        }

        const articles = await response.json();
        return articles.length > 0 ? normalizeArticle(articles[0]) : null;
    } catch (error) {
        console.log('Error fetching article by slug:', error);
        return null;
    }
}

/**
 * Get article by ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?select=*&id=eq.${id}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 }
        });

        if (!response.ok) {
            return null;
        }

        const articles = await response.json();
        return articles.length > 0 ? normalizeArticle(articles[0]) : null;
    } catch (error) {
        console.log('Error fetching article:', error);
        return null;
    }
}
