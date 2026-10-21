// Public read API for the IPO vertical (server-only — reads Postgres directly). Mirrors
// lib/articlesApi.ts conventions: cached for `revalidateSeconds`, never throws, degrades to []/null.
import { cachedRows } from './db';
import {
    Company,
    Ipo,
    IpoAllotmentInfo,
    IpoDetail,
    IpoDocument,
    IpoFinancials,
    IpoGmpUpdate,
    IpoLifecycleStatus,
    IpoReview,
    IpoSubscriptionUpdate,
    IpoType,
    Registrar,
} from './ipoTypes';

// `company` embedded as a nested object (null when unset), the shape PostgREST's
// `select=*,company:companies(*)` used to return.
const IPO_WITH_COMPANY = `SELECT i.*, (SELECT to_json(c) FROM companies c WHERE c.id = i.company_id) AS company FROM ipos i`;

interface IpoListOpts {
    ipoType?: IpoType;
    limit?: number;
    revalidateSeconds?: number;
}

async function fetchIposByStatus(statuses: IpoLifecycleStatus[], opts: IpoListOpts = {}, newestFirst = false): Promise<Ipo[]> {
    const { ipoType, limit = 50, revalidateSeconds = 300 } = opts;
    return cachedRows(
        `${IPO_WITH_COMPANY}
         WHERE i.publish_status = 'published' AND i.status = ANY($1::text[]) AND ($2::text IS NULL OR i.ipo_type = $2)
         ORDER BY i.open_date ${newestFirst ? 'DESC' : 'ASC'} NULLS LAST LIMIT $3`,
        [statuses, ipoType ?? null, limit],
        revalidateSeconds,
        `fetchIposByStatus(${statuses.join(',')})`
    );
}

export function fetchUpcomingIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['announced', 'upcoming'], opts);
}

export function fetchOpenIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['open'], opts);
}

export function fetchClosedIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    // Past issues: newest first, so the LIMIT drops the oldest rather than the latest.
    return fetchIposByStatus(['closed', 'allotment'], opts, true);
}

export function fetchListedIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['listed'], { ...opts, revalidateSeconds: opts.revalidateSeconds ?? 3600 }, true);
}

export async function fetchFeaturedIpos(limit: number = 5, revalidateSeconds: number = 300): Promise<Ipo[]> {
    return cachedRows(
        `${IPO_WITH_COMPANY} WHERE i.publish_status = 'published' AND i.is_featured ORDER BY i.open_date DESC LIMIT $1`,
        [limit],
        revalidateSeconds,
        'fetchFeaturedIpos'
    );
}

export async function fetchCompanyById(id: string, revalidateSeconds: number = 3600): Promise<Company | null> {
    const rows = await cachedRows<Company>(`SELECT * FROM companies WHERE id::text = $1`, [id], revalidateSeconds, `fetchCompanyById(${id})`);
    return rows[0] ?? null;
}

export async function fetchRegistrarById(id: string, revalidateSeconds: number = 3600): Promise<Registrar | null> {
    const rows = await cachedRows<Registrar>(`SELECT * FROM registrars WHERE id::text = $1`, [id], revalidateSeconds, `fetchRegistrarById(${id})`);
    return rows[0] ?? null;
}

/**
 * Full IPO detail aggregate for the detail page: core record + company + registrar +
 * GMP history (append-only log, newest first) + subscription history + allotment + review + documents.
 */
export async function fetchIpoBySlug(slug: string, revalidateSeconds: number = 300): Promise<IpoDetail | null> {
    const ipoRows = await cachedRows<Ipo>(
        `SELECT * FROM ipos WHERE slug = $1 AND publish_status = 'published'`,
        [slug],
        revalidateSeconds,
        `fetchIpoBySlug(${slug})`
    );
    const ipo: Ipo | undefined = ipoRows[0];
    if (!ipo) return null;

    const [company, registrar, gmpHistory, subscriptionHistory, allotmentRows, reviewRows, documents, financials] = await Promise.all([
        ipo.company_id ? fetchCompanyById(ipo.company_id, revalidateSeconds) : Promise.resolve(null),
        ipo.registrar_id ? fetchRegistrarById(ipo.registrar_id, revalidateSeconds) : Promise.resolve(null),
        cachedRows<IpoGmpUpdate>(
            `SELECT * FROM ipo_gmp_updates WHERE ipo_id = $1 ORDER BY recorded_at DESC`,
            [ipo.id],
            revalidateSeconds,
            `fetchGmpHistory(${ipo.id})`
        ),
        cachedRows<IpoSubscriptionUpdate>(
            `SELECT * FROM ipo_subscription_updates WHERE ipo_id = $1 ORDER BY day_number ASC, category ASC`,
            [ipo.id],
            revalidateSeconds,
            `fetchSubscriptionHistory(${ipo.id})`
        ),
        cachedRows<IpoAllotmentInfo>(`SELECT * FROM ipo_allotment_info WHERE ipo_id = $1`, [ipo.id], revalidateSeconds, `fetchAllotment(${ipo.id})`),
        cachedRows<IpoReview>(
            `SELECT * FROM ipo_reviews WHERE ipo_id = $1 AND publish_status = 'published'`,
            [ipo.id],
            revalidateSeconds,
            `fetchReview(${ipo.id})`
        ),
        cachedRows<IpoDocument>(
            `SELECT * FROM ipo_documents WHERE ipo_id = $1 ORDER BY published_at DESC`,
            [ipo.id],
            revalidateSeconds,
            `fetchDocuments(${ipo.id})`
        ),
        cachedRows<IpoFinancials>(
            `SELECT * FROM ipo_financials WHERE ipo_id = $1 ORDER BY period_end_date ASC NULLS LAST`,
            [ipo.id],
            revalidateSeconds,
            `fetchFinancials(${ipo.id})`
        ),
    ]);

    return {
        ...ipo,
        company,
        registrar,
        gmp_history: gmpHistory,
        subscription_history: subscriptionHistory,
        allotment: allotmentRows[0] ?? null,
        review: reviewRows[0] ?? null,
        documents,
        financials: financials || [],
        // Defensive defaults — these columns are undefined on any row fetched before
        // migration 0005 has been applied, or from a stale ISR cache during rollout.
        reservation_percentages: ipo.reservation_percentages || {},
        objects_of_issue_breakdown: ipo.objects_of_issue_breakdown || [],
        peer_comparison: ipo.peer_comparison || [],
    };
}

export interface GmpBoardEntry {
    ipo: Ipo;
    latestGmp: IpoGmpUpdate | null;
}

/**
 * "Today's IPO GMP" leaderboard: every open/upcoming published IPO with its latest GMP point.
 * N+1 by design — GMP is an append-only log, not a joinable column — acceptable at Phase-1 volumes.
 */
export async function fetchLatestGmpBoard(revalidateSeconds: number = 300): Promise<GmpBoardEntry[]> {
    const ipos = await fetchIposByStatus(['announced', 'upcoming', 'open', 'closed', 'allotment'], { limit: 50, revalidateSeconds });
    const entries = await Promise.all(
        ipos.map(async (ipo) => {
            const rows = await cachedRows<IpoGmpUpdate>(
                `SELECT * FROM ipo_gmp_updates WHERE ipo_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
                [ipo.id],
                revalidateSeconds,
                `fetchLatestGmp(${ipo.id})`
            );
            return { ipo, latestGmp: rows[0] ?? null };
        })
    );
    return entries;
}

export interface ListingPerformanceEntry {
    ipo: Ipo;
    listingGainPercent: number | null;
    currentGainPercent: number | null;
}

function gainPercent(issuePrice: number | null, outcomePrice: number | null): number | null {
    if (issuePrice == null || outcomePrice == null || issuePrice === 0) return null;
    return ((outcomePrice - issuePrice) / issuePrice) * 100;
}

/**
 * Listed IPOs with actual listing-day and current price vs. issue price — validates
 * (or debunks) how the pre-listing GMP estimate played out. Sorted by current gain desc.
 */
export async function fetchListingPerformanceBoard(revalidateSeconds: number = 300): Promise<ListingPerformanceEntry[]> {
    const ipos = await fetchListedIpos({ limit: 100, revalidateSeconds });
    const entries = ipos
        .filter(ipo => ipo.listing_price != null)
        .map(ipo => ({
            ipo,
            listingGainPercent: gainPercent(ipo.price_band_max, ipo.listing_price),
            currentGainPercent: gainPercent(ipo.price_band_max, ipo.current_market_price),
        }));
    entries.sort((a, b) => (b.currentGainPercent ?? b.listingGainPercent ?? -Infinity) - (a.currentGainPercent ?? a.listingGainPercent ?? -Infinity));
    return entries;
}

export interface IpoReviewSummary {
    review: IpoReview;
    ipoSlug: string;
    ipoType: IpoType;
    ipoStatus: IpoLifecycleStatus;
    companyName: string;
}

/**
 * Latest published IPO reviews across all IPOs, newest-first — for homepage/hub
 * "featured reviews" surfaces. Embeds the parent IPO (and its company's name) as `r.ipo`.
 */
export async function fetchLatestIpoReviews(limit: number = 5, revalidateSeconds: number = 300): Promise<IpoReviewSummary[]> {
    const rows = await cachedRows(
        `SELECT r.*,
                (SELECT json_build_object(
                     'slug', i.slug, 'ipo_type', i.ipo_type, 'status', i.status, 'publish_status', i.publish_status,
                     'company', (SELECT json_build_object('name', c.name) FROM companies c WHERE c.id = i.company_id))
                 FROM ipos i WHERE i.id = r.ipo_id) AS ipo
         FROM ipo_reviews r
         WHERE r.publish_status = 'published'
         ORDER BY r.published_at DESC LIMIT $1`,
        [limit],
        revalidateSeconds,
        'fetchLatestIpoReviews'
    );
    return rows
        .filter((r: any) => r.ipo && r.ipo.publish_status === 'published')
        .map((r: any) => ({
            review: r,
            ipoSlug: r.ipo.slug,
            ipoType: r.ipo.ipo_type,
            ipoStatus: r.ipo.status,
            companyName: r.ipo.company?.name || r.ipo.slug,
        }));
}

/**
 * Minimal field set for sitemap generation.
 */
export async function fetchAllPublishedIpoSlugs(revalidateSeconds: number = 86400): Promise<Pick<Ipo, 'slug' | 'updated_at'>[]> {
    return cachedRows(
        `SELECT slug, updated_at FROM ipos WHERE publish_status = 'published' ORDER BY updated_at DESC`,
        [],
        revalidateSeconds,
        'fetchAllPublishedIpoSlugs'
    );
}
