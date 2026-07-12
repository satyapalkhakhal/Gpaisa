// Server-only. Never import this into a client component — it holds the Supabase
// service-role key, which bypasses RLS and must never reach the browser.
import { Article } from './supabaseApi';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function assertEnv() {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        throw new Error('[SUPABASE_ADMIN] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
}

async function supabaseAdminFetch(endpoint: string, init: RequestInit = {}, tag?: string): Promise<Response> {
    assertEnv();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
        ...init,
        headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
        cache: 'no-store',
    });
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'unknown');
        console.error(`[SUPABASE_ADMIN] ${tag || endpoint} failed: HTTP ${response.status} - ${errorText}`);
        throw new Error(`Supabase admin request failed (${response.status}): ${errorText}`);
    }
    return response;
}

export interface AdminArticleInput {
    title: string;
    slug: string;
    category: string;
    subcategory?: string | null;
    excerpt: string;
    content: string;
    image_url: string;
    author: string;
    author_avatar?: string;
    read_time?: string;
    tags?: string[];
    is_featured?: boolean;
    is_editors_pick?: boolean;
    is_trending?: boolean;
    status: 'draft' | 'published';
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    focus_keyword?: string;
    published_at?: string;
    date?: string;
}

// Unrestricted by category (unlike fetchAllArticles), paginated, filterable — for the admin listing page.
export async function listArticlesAdmin(opts: { page?: number; pageSize?: number; search?: string; category?: string; status?: string } = {}) {
    const { page = 1, pageSize = 20, search, category, status } = opts;
    const params = new URLSearchParams({ select: '*', order: 'created_at.desc' });
    if (search) params.set('or', `(title.ilike.*${search}*,excerpt.ilike.*${search}*)`);
    if (category) params.set('category', `eq.${category}`);
    if (status) params.set('status', `eq.${status}`);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const res = await supabaseAdminFetch(`articles?${params.toString()}`, {
        headers: { Prefer: 'count=exact', Range: `${from}-${to}`, 'Range-Unit': 'items' },
    }, 'listArticlesAdmin');

    const articles: Article[] = await res.json();
    const contentRange = res.headers.get('content-range'); // e.g. "0-19/57"
    const total = contentRange ? parseInt(contentRange.split('/')[1], 10) : articles.length;
    return { articles, total };
}

export async function getArticleByIdAdmin(id: string): Promise<Article | null> {
    const res = await supabaseAdminFetch(`articles?select=*&id=eq.${id}`, {}, 'getArticleByIdAdmin');
    const rows: Article[] = await res.json();
    return rows[0] ?? null;
}

export async function createArticle(input: AdminArticleInput): Promise<Article> {
    const now = new Date().toISOString();
    const res = await supabaseAdminFetch('articles', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, created_at: now, updated_at: now }),
    }, 'createArticle');
    const [row] = await res.json();
    return row;
}

export async function updateArticle(id: string, input: Partial<AdminArticleInput>): Promise<Article> {
    const res = await supabaseAdminFetch(`articles?id=eq.${id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    }, 'updateArticle');
    const rows: Article[] = await res.json();
    if (!rows.length) throw new Error('Article not found');
    return rows[0];
}

export async function deleteArticle(id: string): Promise<void> {
    await supabaseAdminFetch(`articles?id=eq.${id}`, { method: 'DELETE' }, 'deleteArticle');
}
