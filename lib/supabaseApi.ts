// Supabase API Service for News Articles
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface Category {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featured_image_url: string;
    category_id: string;
    status: string;
    published_at: string;
    publishedAt?: string;
    updated_at?: string;
    author: string;
    read_time: string;
    views?: number;
    category?: Category;
}

/**
 * Fetch active categories ordered by display_order
 */
export async function fetchCategories(): Promise<Category[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/categories?is_active=eq.true&order=display_order.asc`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.log('Failed to fetch categories:', response.status);
            return [];
        }

        const categories = await response.json();
        return categories;
    } catch (error) {
        console.log('Error fetching categories:', error);
        return [];
    }
}

/**
 * Fetch articles by category
 */
export async function fetchArticlesByCategory(
    categoryId: string,
    limit: number = 10
): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?category_id=eq.${categoryId}&status=eq.published&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 } // Cache for 10 minutes
        });

        if (!response.ok) {
            console.log('Failed to fetch articles:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles;
    } catch (error) {
        console.log('Error fetching articles:', error);
        return [];
    }
}

/**
 * Fetch articles by category slug
 */
export async function fetchArticlesByCategorySlug(
    slug: string,
    limit: number = 10
): Promise<Article[]> {
    try {
        // First get category by slug
        const categoriesUrl = `${SUPABASE_URL}/rest/v1/categories?slug=eq.${slug}&is_active=eq.true`;

        const categoriesResponse = await fetch(categoriesUrl, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 3600 }
        });

        if (!categoriesResponse.ok) {
            return [];
        }

        const categories: Category[] = await categoriesResponse.json();

        if (categories.length === 0) {
            return [];
        }

        // Then fetch articles for that category
        return fetchArticlesByCategory(categories[0].id, limit);
    } catch (error) {
        console.log('Error fetching articles by slug:', error);
        return [];
    }
}

/**
 * Fetch latest articles across all categories
 */
export async function fetchLatestArticles(limit: number = 20): Promise<Article[]> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?status=eq.published&order=published_at.desc&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 600 } // Cache for 10 minutes
        });

        if (!response.ok) {
            console.log('Failed to fetch latest articles:', response.status);
            return [];
        }

        const articles = await response.json();
        return articles;
    } catch (error) {
        console.log('Error fetching latest articles:', error);
        return [];
    }
}

/**
 * Get article by ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&status=eq.published`;

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
        return articles.length > 0 ? articles[0] : null;
    } catch (error) {
        console.log('Error fetching article:', error);
        return null;
    }
}

/**
 * Get article by slug (SEO-friendly URLs)
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const url = `${SUPABASE_URL}/rest/v1/articles?slug=eq.${slug}&status=eq.published`;

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
        return articles.length > 0 ? articles[0] : null;
    } catch (error) {
        console.log('Error fetching article by slug:', error);
        return null;
    }
}
