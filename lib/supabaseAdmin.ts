// Server-only. Never import this into a client component — it holds the Supabase
// service-role key, which bypasses RLS and must never reach the browser.
import { Article } from './supabaseApi';
import {
    Company,
    Ipo,
    IpoAllotmentInfo,
    IpoDocument,
    IpoGmpUpdate,
    IpoReview,
    IpoSubscriptionUpdate,
    Registrar,
} from './ipoTypes';

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

// ─────────────────────────────────────────────────────────────────────────
// IPO vertical — companies, registrars, ipos, and their child records.
// Same supabaseAdminFetch/PostgREST pattern as articles above.
// ─────────────────────────────────────────────────────────────────────────

export interface AdminCompanyInput {
    name: string;
    slug: string;
    logo_url?: string | null;
    sector?: string | null;
    industry?: string | null;
    about?: string | null;
    website?: string | null;
    incorporated_year?: number | null;
    registered_office?: string | null;
}

export async function listCompaniesAdmin(search?: string): Promise<Company[]> {
    const params = new URLSearchParams({ select: '*', order: 'name.asc' });
    if (search) params.set('name', `ilike.*${search}*`);
    const res = await supabaseAdminFetch(`companies?${params.toString()}`, {}, 'listCompaniesAdmin');
    return res.json();
}

export async function getCompanyByIdAdmin(id: string): Promise<Company | null> {
    const res = await supabaseAdminFetch(`companies?select=*&id=eq.${id}`, {}, 'getCompanyByIdAdmin');
    const rows: Company[] = await res.json();
    return rows[0] ?? null;
}

export async function createCompany(input: AdminCompanyInput): Promise<Company> {
    const now = new Date().toISOString();
    const res = await supabaseAdminFetch('companies', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, created_at: now, updated_at: now }),
    }, 'createCompany');
    const [row] = await res.json();
    return row;
}

export async function updateCompany(id: string, input: Partial<AdminCompanyInput>): Promise<Company> {
    const res = await supabaseAdminFetch(`companies?id=eq.${id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    }, 'updateCompany');
    const rows: Company[] = await res.json();
    if (!rows.length) throw new Error('Company not found');
    return rows[0];
}

export async function deleteCompany(id: string): Promise<void> {
    await supabaseAdminFetch(`companies?id=eq.${id}`, { method: 'DELETE' }, 'deleteCompany');
}

export interface AdminRegistrarInput {
    name: string;
    slug: string;
    website?: string | null;
    allotment_status_check_url?: string | null;
    logo_url?: string | null;
}

export async function listRegistrarsAdmin(): Promise<Registrar[]> {
    const res = await supabaseAdminFetch('registrars?select=*&order=name.asc', {}, 'listRegistrarsAdmin');
    return res.json();
}

export async function createRegistrar(input: AdminRegistrarInput): Promise<Registrar> {
    const now = new Date().toISOString();
    const res = await supabaseAdminFetch('registrars', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, created_at: now, updated_at: now }),
    }, 'createRegistrar');
    const [row] = await res.json();
    return row;
}

export async function updateRegistrar(id: string, input: Partial<AdminRegistrarInput>): Promise<Registrar> {
    const res = await supabaseAdminFetch(`registrars?id=eq.${id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    }, 'updateRegistrar');
    const rows: Registrar[] = await res.json();
    if (!rows.length) throw new Error('Registrar not found');
    return rows[0];
}

export async function deleteRegistrar(id: string): Promise<void> {
    await supabaseAdminFetch(`registrars?id=eq.${id}`, { method: 'DELETE' }, 'deleteRegistrar');
}

export interface AdminIpoInput {
    company_id: string;
    slug: string;
    ipo_type: string;
    status: string;
    open_date?: string | null;
    close_date?: string | null;
    allotment_date?: string | null;
    refund_date?: string | null;
    demat_date?: string | null;
    listing_date?: string | null;
    price_band_min?: number | null;
    price_band_max?: number | null;
    face_value?: number | null;
    lot_size?: number | null;
    fresh_issue_amount?: number | null;
    ofs_amount?: number | null;
    total_issue_size?: number | null;
    exchange?: string | null;
    registrar_id?: string | null;
    lead_managers?: string[];
    objects_of_issue?: string | null;
    drhp_url?: string | null;
    rhp_url?: string | null;
    is_featured?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    publish_status: string;
    listing_price?: number | null;
    listing_day_close_price?: number | null;
    current_market_price?: number | null;
    current_price_updated_at?: string | null;
}

export async function listIposAdmin(opts: { page?: number; pageSize?: number; search?: string; status?: string; ipoType?: string } = {}) {
    const { page = 1, pageSize = 20, search, status, ipoType } = opts;
    const params = new URLSearchParams({ select: '*', order: 'created_at.desc' });
    if (search) params.set('slug', `ilike.*${search}*`);
    if (status) params.set('status', `eq.${status}`);
    if (ipoType) params.set('ipo_type', `eq.${ipoType}`);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const res = await supabaseAdminFetch(`ipos?${params.toString()}`, {
        headers: { Prefer: 'count=exact', Range: `${from}-${to}`, 'Range-Unit': 'items' },
    }, 'listIposAdmin');

    const ipos: Ipo[] = await res.json();
    const contentRange = res.headers.get('content-range');
    const total = contentRange ? parseInt(contentRange.split('/')[1], 10) : ipos.length;
    return { ipos, total };
}

export async function getIpoByIdAdmin(id: string): Promise<Ipo | null> {
    const res = await supabaseAdminFetch(`ipos?select=*&id=eq.${id}`, {}, 'getIpoByIdAdmin');
    const rows: Ipo[] = await res.json();
    return rows[0] ?? null;
}

export async function getIpoBySlugAdmin(slug: string): Promise<Ipo | null> {
    const res = await supabaseAdminFetch(`ipos?select=*&slug=eq.${encodeURIComponent(slug)}`, {}, 'getIpoBySlugAdmin');
    const rows: Ipo[] = await res.json();
    return rows[0] ?? null;
}

export async function createIpo(input: AdminIpoInput): Promise<Ipo> {
    const now = new Date().toISOString();
    const res = await supabaseAdminFetch('ipos', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, created_at: now, updated_at: now }),
    }, 'createIpo');
    const [row] = await res.json();
    return row;
}

export async function updateIpo(id: string, input: Partial<AdminIpoInput>): Promise<Ipo> {
    const res = await supabaseAdminFetch(`ipos?id=eq.${id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
    }, 'updateIpo');
    const rows: Ipo[] = await res.json();
    if (!rows.length) throw new Error('IPO not found');
    return rows[0];
}

export async function deleteIpo(id: string): Promise<void> {
    await supabaseAdminFetch(`ipos?id=eq.${id}`, { method: 'DELETE' }, 'deleteIpo');
}

// ── GMP updates (append-only log) ───────────────────────────────────────

export interface AdminGmpUpdateInput {
    gmp_value: number;
    gmp_percentage?: number | null;
    estimated_listing_price?: number | null;
    kostak_rate?: number | null;
    subject_to_sauda?: number | null;
    source: string;
    direction?: string | null;
    notes?: string | null;
    recorded_at?: string;
}

export async function listGmpUpdatesAdmin(ipoId: string): Promise<IpoGmpUpdate[]> {
    const res = await supabaseAdminFetch(
        `ipo_gmp_updates?select=*&ipo_id=eq.${ipoId}&order=recorded_at.desc`,
        {},
        'listGmpUpdatesAdmin'
    );
    return res.json();
}

export async function createGmpUpdate(ipoId: string, input: AdminGmpUpdateInput): Promise<IpoGmpUpdate> {
    const res = await supabaseAdminFetch('ipo_gmp_updates', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, ipo_id: ipoId, recorded_at: input.recorded_at || new Date().toISOString() }),
    }, 'createGmpUpdate');
    const [row] = await res.json();
    return row;
}

export async function deleteGmpUpdate(id: string): Promise<void> {
    await supabaseAdminFetch(`ipo_gmp_updates?id=eq.${id}`, { method: 'DELETE' }, 'deleteGmpUpdate');
}

// ── Subscription updates ─────────────────────────────────────────────────

export interface AdminSubscriptionUpdateInput {
    day_number: number;
    category: string;
    subscription_times: number;
    shares_offered?: number | null;
    shares_bid?: number | null;
    data_granularity?: string;
    as_of?: string;
}

export async function listSubscriptionUpdatesAdmin(ipoId: string): Promise<IpoSubscriptionUpdate[]> {
    const res = await supabaseAdminFetch(
        `ipo_subscription_updates?select=*&ipo_id=eq.${ipoId}&order=day_number.asc,category.asc`,
        {},
        'listSubscriptionUpdatesAdmin'
    );
    return res.json();
}

export async function createSubscriptionUpdate(ipoId: string, input: AdminSubscriptionUpdateInput): Promise<IpoSubscriptionUpdate> {
    const res = await supabaseAdminFetch('ipo_subscription_updates', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
            ...input,
            ipo_id: ipoId,
            data_granularity: input.data_granularity || 'day_end',
            as_of: input.as_of || new Date().toISOString(),
        }),
    }, 'createSubscriptionUpdate');
    const [row] = await res.json();
    return row;
}

export async function deleteSubscriptionUpdate(id: string): Promise<void> {
    await supabaseAdminFetch(`ipo_subscription_updates?id=eq.${id}`, { method: 'DELETE' }, 'deleteSubscriptionUpdate');
}

// ── Allotment info (1:1 with an IPO) ────────────────────────────────────

export interface AdminAllotmentInput {
    registrar_id?: string | null;
    basis_of_allotment_url?: string | null;
    allotment_date?: string | null;
    refund_date?: string | null;
    demat_credit_date?: string | null;
    listing_date?: string | null;
    status?: string | null;
    notes?: string | null;
}

export async function getAllotmentByIpoIdAdmin(ipoId: string): Promise<IpoAllotmentInfo | null> {
    const res = await supabaseAdminFetch(`ipo_allotment_info?select=*&ipo_id=eq.${ipoId}`, {}, 'getAllotmentByIpoIdAdmin');
    const rows: IpoAllotmentInfo[] = await res.json();
    return rows[0] ?? null;
}

export async function upsertAllotment(ipoId: string, input: AdminAllotmentInput): Promise<IpoAllotmentInfo> {
    const existing = await getAllotmentByIpoIdAdmin(ipoId);
    const now = new Date().toISOString();
    if (existing) {
        const res = await supabaseAdminFetch(`ipo_allotment_info?id=eq.${existing.id}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({ ...input, updated_at: now }),
        }, 'updateAllotment');
        const [row] = await res.json();
        return row;
    }
    const res = await supabaseAdminFetch('ipo_allotment_info', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, ipo_id: ipoId, created_at: now, updated_at: now }),
    }, 'createAllotment');
    const [row] = await res.json();
    return row;
}

// ── Structured review (1:1 with an IPO) ─────────────────────────────────

export interface AdminReviewInput {
    business_quality_score?: number | null;
    financial_performance_score?: number | null;
    growth_score?: number | null;
    valuation_score?: number | null;
    industry_outlook?: string | null;
    management_notes?: string | null;
    strengths?: string[];
    risks?: string[];
    competitive_position?: string | null;
    overall_view?: string | null;
    overall_score?: number | null;
    recommendation?: string | null;
    detailed_analysis_html?: string | null;
    author?: string | null;
    publish_status: string;
}

export async function getReviewByIpoIdAdmin(ipoId: string): Promise<IpoReview | null> {
    const res = await supabaseAdminFetch(`ipo_reviews?select=*&ipo_id=eq.${ipoId}`, {}, 'getReviewByIpoIdAdmin');
    const rows: IpoReview[] = await res.json();
    return rows[0] ?? null;
}

export async function upsertReview(ipoId: string, input: AdminReviewInput): Promise<IpoReview> {
    const existing = await getReviewByIpoIdAdmin(ipoId);
    const now = new Date().toISOString();
    const publishedAt = input.publish_status === 'published' ? (existing?.published_at || now) : existing?.published_at || null;
    if (existing) {
        const res = await supabaseAdminFetch(`ipo_reviews?id=eq.${existing.id}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=representation' },
            body: JSON.stringify({ ...input, published_at: publishedAt, updated_at: now }),
        }, 'updateReview');
        const [row] = await res.json();
        return row;
    }
    const res = await supabaseAdminFetch('ipo_reviews', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, ipo_id: ipoId, published_at: publishedAt, created_at: now, updated_at: now }),
    }, 'createReview');
    const [row] = await res.json();
    return row;
}

// ── Documents ─────────────────────────────────────────────────────────

export interface AdminDocumentInput {
    doc_type: string;
    title: string;
    url: string;
    published_at?: string | null;
}

export async function listDocumentsAdmin(ipoId: string): Promise<IpoDocument[]> {
    const res = await supabaseAdminFetch(
        `ipo_documents?select=*&ipo_id=eq.${ipoId}&order=published_at.desc`,
        {},
        'listDocumentsAdmin'
    );
    return res.json();
}

export async function createDocument(ipoId: string, input: AdminDocumentInput): Promise<IpoDocument> {
    const res = await supabaseAdminFetch('ipo_documents', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ ...input, ipo_id: ipoId, created_at: new Date().toISOString() }),
    }, 'createDocument');
    const [row] = await res.json();
    return row;
}

export async function deleteDocument(id: string): Promise<void> {
    await supabaseAdminFetch(`ipo_documents?id=eq.${id}`, { method: 'DELETE' }, 'deleteDocument');
}
