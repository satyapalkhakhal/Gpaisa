// Server-only. Never import this into a client component — it writes straight to
// Postgres via lib/db.ts, bypassing every public read filter.
import { Article } from './articlesApi';
import type { ArticleLanguage } from './articleLocale';
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
import { Buyback, NcdIssue, NcdSeries, RightsIssue } from './otherInvestmentsTypes';
import { deleteRowById, insertRow, queryRows, updateRowById } from './db';

// Builds `WHERE a AND b` from optional filters, skipping empty values; every `?` in a
// filter's SQL becomes that filter's positional param.
function buildWhere(filters: [string, unknown][]): { where: string; params: unknown[] } {
    const active = filters.filter(([, value]) => value !== undefined && value !== null && value !== '');
    return {
        where: active.length ? `WHERE ${active.map(([sql], i) => sql.replace(/\?/g, `$${i + 1}`)).join(' AND ')}` : '',
        params: active.map(([, value]) => value),
    };
}

// Newest-first page of `table` plus the total matching count, for the admin listing pages.
async function listPaged<T>(table: string, filters: [string, unknown][], page: number, pageSize: number): Promise<{ rows: T[]; total: number }> {
    const { where, params } = buildWhere(filters);
    const limit = Math.max(1, Math.floor(pageSize) || 20);
    const offset = Math.max(0, (Math.floor(page) || 1) - 1) * limit;
    const [rows, [{ total }]] = await Promise.all([
        queryRows<T>(`SELECT * FROM ${table} ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params),
        queryRows<{ total: number }>(`SELECT count(*)::int AS total FROM ${table} ${where}`, params),
    ]);
    return { rows, total };
}

async function getOne<T>(table: string, column: 'id' | 'slug' | 'ipo_id', value: string): Promise<T | null> {
    const [row] = await queryRows<T>(`SELECT * FROM ${table} WHERE ${column} = $1 LIMIT 1`, [value]);
    return row ?? null;
}

// Child records of one IPO, in the given ORDER BY.
function listByIpo<T>(table: string, ipoId: string, orderBy: string): Promise<T[]> {
    return queryRows<T>(`SELECT * FROM ${table} WHERE ipo_id = $1 ORDER BY ${orderBy}`, [ipoId]);
}

async function updateOrThrow<T>(table: string, id: string, data: Record<string, unknown>, notFound: string): Promise<T> {
    const rows = await updateRowById<T>(table, id, { ...data, updated_at: new Date().toISOString() });
    if (!rows.length) throw new Error(notFound);
    return rows[0];
}

function insertWithTimestamps<T>(table: string, data: Record<string, unknown>): Promise<T> {
    const now = new Date().toISOString();
    return insertRow<T>(table, { ...data, created_at: now, updated_at: now });
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
    content_updated_at?: string;
    language?: ArticleLanguage;
    translation_of?: string | null;
    article_type?: 'article' | 'news';
}

// Unrestricted by category (unlike fetchAllArticles), paginated, filterable — for the admin listing page.
export async function listArticlesAdmin(opts: { page?: number; pageSize?: number; search?: string; category?: string; status?: string } = {}) {
    const { page = 1, pageSize = 20, search, category, status } = opts;
    const { rows: articles, total } = await listPaged<Article>('articles', [
        ['(title ILIKE ? OR excerpt ILIKE ?)', search && `%${search}%`],
        ['category = ?', category],
        ['status = ?', status],
    ], page, pageSize);
    return { articles, total };
}

export async function getArticleByIdAdmin(id: string): Promise<Article | null> {
    return getOne<Article>('articles', 'id', id);
}

// Any status. Slugs are unique per language, so a translation can reuse its original's slug.
export async function getArticleBySlugAdmin(slug: string, language: ArticleLanguage): Promise<Article | null> {
    const [row] = await queryRows<Article>(`SELECT * FROM articles WHERE slug = $1 AND language = $2 LIMIT 1`, [slug, language]);
    return row ?? null;
}

// The Hindi article (any status) that translates the given English article, if any.
export async function getTranslationOfAdmin(englishId: string): Promise<Article | null> {
    const [row] = await queryRows<Article>(`SELECT * FROM articles WHERE translation_of = $1 LIMIT 1`, [englishId]);
    return row ?? null;
}

export async function createArticle(input: AdminArticleInput): Promise<Article> {
    return insertWithTimestamps<Article>('articles', { ...input });
}

export async function updateArticle(id: string, input: Partial<AdminArticleInput>): Promise<Article> {
    return updateOrThrow<Article>('articles', id, input, 'Article not found');
}

export async function deleteArticle(id: string): Promise<void> {
    await deleteRowById('articles', id);
}

// ─────────────────────────────────────────────────────────────────────────
// IPO vertical — companies, registrars, ipos, and their child records.
// Same lib/db.ts helpers as articles above.
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
    phone?: string | null;
    email?: string | null;
}

export async function listCompaniesAdmin(search?: string): Promise<Company[]> {
    const { where, params } = buildWhere([['name ILIKE ?', search && `%${search}%`]]);
    return queryRows<Company>(`SELECT * FROM companies ${where} ORDER BY name ASC`, params);
}

export async function getCompanyByIdAdmin(id: string): Promise<Company | null> {
    return getOne<Company>('companies', 'id', id);
}

export async function createCompany(input: AdminCompanyInput): Promise<Company> {
    return insertWithTimestamps<Company>('companies', { ...input });
}

export async function updateCompany(id: string, input: Partial<AdminCompanyInput>): Promise<Company> {
    return updateOrThrow<Company>('companies', id, input, 'Company not found');
}

export async function deleteCompany(id: string): Promise<void> {
    await deleteRowById('companies', id);
}

export interface AdminRegistrarInput {
    name: string;
    slug: string;
    website?: string | null;
    allotment_status_check_url?: string | null;
    logo_url?: string | null;
    phone?: string | null;
    email?: string | null;
}

export async function listRegistrarsAdmin(): Promise<Registrar[]> {
    return queryRows<Registrar>('SELECT * FROM registrars ORDER BY name ASC');
}

export async function createRegistrar(input: AdminRegistrarInput): Promise<Registrar> {
    return insertWithTimestamps<Registrar>('registrars', { ...input });
}

export async function updateRegistrar(id: string, input: Partial<AdminRegistrarInput>): Promise<Registrar> {
    return updateOrThrow<Registrar>('registrars', id, input, 'Registrar not found');
}

export async function deleteRegistrar(id: string): Promise<void> {
    await deleteRowById('registrars', id);
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
    reservation_percentages?: Record<string, number>;
    objects_of_issue_breakdown?: { purpose: string; amount: number }[];
    peer_comparison?: { name: string; eps: number | null; pe_ratio: number | null; ronw_percent: number | null; nav: number | null; income: number | null }[];
    promoter_holding_pre_percent?: number | null;
    promoter_holding_post_percent?: number | null;
    anchor_bidding_date?: string | null;
    anchor_shares?: number | null;
    anchor_allocation_amount?: number | null;
    anchor_lock_in_50pct_date?: string | null;
    anchor_lock_in_remaining_date?: string | null;
    anchor_list_url?: string | null;
    post_issue_shares_outstanding?: number | null;
}

export async function listIposAdmin(opts: { page?: number; pageSize?: number; search?: string; status?: string; ipoType?: string } = {}) {
    const { page = 1, pageSize = 20, search, status, ipoType } = opts;
    const { rows: ipos, total } = await listPaged<Ipo>('ipos', [
        ['slug ILIKE ?', search && `%${search}%`],
        ['status = ?', status],
        ['ipo_type = ?', ipoType],
    ], page, pageSize);
    return { ipos, total };
}

export async function getIpoByIdAdmin(id: string): Promise<Ipo | null> {
    return getOne<Ipo>('ipos', 'id', id);
}

export async function getIpoBySlugAdmin(slug: string): Promise<Ipo | null> {
    return getOne<Ipo>('ipos', 'slug', slug);
}

export async function createIpo(input: AdminIpoInput): Promise<Ipo> {
    return insertWithTimestamps<Ipo>('ipos', { ...input });
}

export async function updateIpo(id: string, input: Partial<AdminIpoInput>): Promise<Ipo> {
    return updateOrThrow<Ipo>('ipos', id, input, 'IPO not found');
}

export async function deleteIpo(id: string): Promise<void> {
    await deleteRowById('ipos', id);
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
    return listByIpo<IpoGmpUpdate>('ipo_gmp_updates', ipoId, 'recorded_at DESC');
}

export async function createGmpUpdate(ipoId: string, input: AdminGmpUpdateInput): Promise<IpoGmpUpdate> {
    return insertRow<IpoGmpUpdate>('ipo_gmp_updates', { ...input, ipo_id: ipoId, recorded_at: input.recorded_at || new Date().toISOString() });
}

export async function deleteGmpUpdate(id: string): Promise<void> {
    await deleteRowById('ipo_gmp_updates', id);
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
    return listByIpo<IpoSubscriptionUpdate>('ipo_subscription_updates', ipoId, 'day_number ASC, category ASC');
}

export async function createSubscriptionUpdate(ipoId: string, input: AdminSubscriptionUpdateInput): Promise<IpoSubscriptionUpdate> {
    return insertRow<IpoSubscriptionUpdate>('ipo_subscription_updates', {
        ...input,
        ipo_id: ipoId,
        data_granularity: input.data_granularity || 'day_end',
        as_of: input.as_of || new Date().toISOString(),
    });
}

export async function deleteSubscriptionUpdate(id: string): Promise<void> {
    await deleteRowById('ipo_subscription_updates', id);
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
    return getOne<IpoAllotmentInfo>('ipo_allotment_info', 'ipo_id', ipoId);
}

export async function upsertAllotment(ipoId: string, input: AdminAllotmentInput): Promise<IpoAllotmentInfo> {
    const existing = await getAllotmentByIpoIdAdmin(ipoId);
    const now = new Date().toISOString();
    if (existing) {
        const [row] = await updateRowById<IpoAllotmentInfo>('ipo_allotment_info', existing.id, { ...input, updated_at: now });
        return row;
    }
    return insertRow<IpoAllotmentInfo>('ipo_allotment_info', { ...input, ipo_id: ipoId, created_at: now, updated_at: now });
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
    return getOne<IpoReview>('ipo_reviews', 'ipo_id', ipoId);
}

export async function upsertReview(ipoId: string, input: AdminReviewInput): Promise<IpoReview> {
    const existing = await getReviewByIpoIdAdmin(ipoId);
    const now = new Date().toISOString();
    const publishedAt = input.publish_status === 'published' ? (existing?.published_at || now) : existing?.published_at || null;
    if (existing) {
        const [row] = await updateRowById<IpoReview>('ipo_reviews', existing.id, { ...input, published_at: publishedAt, updated_at: now });
        return row;
    }
    return insertRow<IpoReview>('ipo_reviews', { ...input, ipo_id: ipoId, published_at: publishedAt, created_at: now, updated_at: now });
}

// ── Documents ─────────────────────────────────────────────────────────

export interface AdminDocumentInput {
    doc_type: string;
    title: string;
    url: string;
    published_at?: string | null;
}

export async function listDocumentsAdmin(ipoId: string): Promise<IpoDocument[]> {
    return listByIpo<IpoDocument>('ipo_documents', ipoId, 'published_at DESC');
}

export async function createDocument(ipoId: string, input: AdminDocumentInput): Promise<IpoDocument> {
    return insertRow<IpoDocument>('ipo_documents', { ...input, ipo_id: ipoId, created_at: new Date().toISOString() });
}

export async function deleteDocument(id: string): Promise<void> {
    await deleteRowById('ipo_documents', id);
}

// ── Financial statements (append-only per-period log) ───────────────────

export interface AdminFinancialInput {
    period_label: string;
    period_end_date?: string | null;
    revenue?: number | null;
    expenses?: number | null;
    profit_after_tax?: number | null;
    total_assets?: number | null;
    ebitda?: number | null;
    net_worth?: number | null;
    total_debt?: number | null;
}

export async function listFinancialsAdmin(ipoId: string): Promise<import('./ipoTypes').IpoFinancials[]> {
    return listByIpo('ipo_financials', ipoId, 'period_end_date ASC NULLS LAST');
}

export async function createFinancial(ipoId: string, input: AdminFinancialInput) {
    return insertRow('ipo_financials', { ...input, ipo_id: ipoId, created_at: new Date().toISOString() });
}

export async function deleteFinancial(id: string): Promise<void> {
    await deleteRowById('ipo_financials', id);
}

// ─────────────────────────────────────────────────────────────────────────
// Other Investments — NCD Issues, Rights Issues, Buybacks. Lighter CRUD than
// the IPO vertical (no child sub-resources) — same lib/db.ts helpers.
// ─────────────────────────────────────────────────────────────────────────

export interface AdminNcdIssueInput {
    company_id: string;
    slug: string;
    status: string;
    open_date?: string | null;
    close_date?: string | null;
    allotment_date?: string | null;
    listing_date?: string | null;
    issue_size?: number | null;
    base_issue_size?: number | null;
    shelf_limit?: number | null;
    credit_rating?: string | null;
    rating_agency?: string | null;
    secured?: boolean;
    series?: NcdSeries[];
    registrar_id?: string | null;
    lead_managers?: string[];
    objects_of_issue?: string | null;
    prospectus_url?: string | null;
    subscription_times_overall?: number | null;
    subscription_updated_at?: string | null;
    is_featured?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    publish_status: string;
}

export async function listNcdIssuesAdmin(opts: { page?: number; pageSize?: number; search?: string; status?: string } = {}) {
    const { page = 1, pageSize = 20, search, status } = opts;
    const { rows: issues, total } = await listPaged<NcdIssue>('ncd_issues', [
        ['slug ILIKE ?', search && `%${search}%`],
        ['status = ?', status],
    ], page, pageSize);
    return { issues, total };
}

export async function getNcdIssueByIdAdmin(id: string): Promise<NcdIssue | null> {
    return getOne<NcdIssue>('ncd_issues', 'id', id);
}

export async function getNcdIssueBySlugAdmin(slug: string): Promise<NcdIssue | null> {
    return getOne<NcdIssue>('ncd_issues', 'slug', slug);
}

export async function createNcdIssue(input: AdminNcdIssueInput): Promise<NcdIssue> {
    return insertWithTimestamps<NcdIssue>('ncd_issues', { ...input });
}

export async function updateNcdIssue(id: string, input: Partial<AdminNcdIssueInput>): Promise<NcdIssue> {
    return updateOrThrow<NcdIssue>('ncd_issues', id, input, 'NCD issue not found');
}

export async function deleteNcdIssue(id: string): Promise<void> {
    await deleteRowById('ncd_issues', id);
}

export interface AdminRightsIssueInput {
    company_id: string;
    slug: string;
    status: string;
    record_date?: string | null;
    re_trading_start?: string | null;
    re_trading_end?: string | null;
    application_start?: string | null;
    application_end?: string | null;
    allotment_date?: string | null;
    listing_date?: string | null;
    rights_ratio?: string | null;
    issue_price?: number | null;
    face_value?: number | null;
    issue_size?: number | null;
    re_price?: number | null;
    re_price_updated_at?: string | null;
    registrar_id?: string | null;
    objects_of_issue?: string | null;
    letter_of_offer_url?: string | null;
    is_featured?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    publish_status: string;
}

export async function listRightsIssuesAdmin(opts: { page?: number; pageSize?: number; search?: string; status?: string } = {}) {
    const { page = 1, pageSize = 20, search, status } = opts;
    const { rows: issues, total } = await listPaged<RightsIssue>('rights_issues', [
        ['slug ILIKE ?', search && `%${search}%`],
        ['status = ?', status],
    ], page, pageSize);
    return { issues, total };
}

export async function getRightsIssueByIdAdmin(id: string): Promise<RightsIssue | null> {
    return getOne<RightsIssue>('rights_issues', 'id', id);
}

export async function getRightsIssueBySlugAdmin(slug: string): Promise<RightsIssue | null> {
    return getOne<RightsIssue>('rights_issues', 'slug', slug);
}

export async function createRightsIssue(input: AdminRightsIssueInput): Promise<RightsIssue> {
    return insertWithTimestamps<RightsIssue>('rights_issues', { ...input });
}

export async function updateRightsIssue(id: string, input: Partial<AdminRightsIssueInput>): Promise<RightsIssue> {
    return updateOrThrow<RightsIssue>('rights_issues', id, input, 'Rights issue not found');
}

export async function deleteRightsIssue(id: string): Promise<void> {
    await deleteRowById('rights_issues', id);
}

export interface AdminBuybackInput {
    company_id: string;
    slug: string;
    status: string;
    method: string;
    buyback_price?: number | null;
    buyback_price_max?: number | null;
    record_date?: string | null;
    tender_open_date?: string | null;
    tender_close_date?: string | null;
    buyback_size?: number | null;
    acceptance_ratio?: string | null;
    registrar_id?: string | null;
    notes?: string | null;
    letter_of_offer_url?: string | null;
    is_featured?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    publish_status: string;
}

export async function listBuybacksAdmin(opts: { page?: number; pageSize?: number; search?: string; status?: string } = {}) {
    const { page = 1, pageSize = 20, search, status } = opts;
    const { rows: buybacks, total } = await listPaged<Buyback>('buybacks', [
        ['slug ILIKE ?', search && `%${search}%`],
        ['status = ?', status],
    ], page, pageSize);
    return { buybacks, total };
}

export async function getBuybackByIdAdmin(id: string): Promise<Buyback | null> {
    return getOne<Buyback>('buybacks', 'id', id);
}

export async function getBuybackBySlugAdmin(slug: string): Promise<Buyback | null> {
    return getOne<Buyback>('buybacks', 'slug', slug);
}

export async function createBuyback(input: AdminBuybackInput): Promise<Buyback> {
    return insertWithTimestamps<Buyback>('buybacks', { ...input });
}

export async function updateBuyback(id: string, input: Partial<AdminBuybackInput>): Promise<Buyback> {
    return updateOrThrow<Buyback>('buybacks', id, input, 'Buyback not found');
}

export async function deleteBuyback(id: string): Promise<void> {
    await deleteRowById('buybacks', id);
}
