// Public (anon-key) read API for the IPO vertical. Mirrors lib/supabaseApi.ts conventions:
// server-side ISR fetch caching via `next.revalidate`, never throws, degrades to []/null.
import {
    Company,
    Ipo,
    IpoAllotmentInfo,
    IpoDetail,
    IpoDocument,
    IpoGmpUpdate,
    IpoLifecycleStatus,
    IpoReview,
    IpoSubscriptionUpdate,
    IpoType,
    Registrar,
} from './ipoTypes';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function ipoFetch(endpoint: string, tag?: string, revalidateSeconds: number = 300): Promise<any[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error(`[IPO_API] Cannot fetch "${tag || endpoint}" - missing env vars.`);
        return [];
    }

    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
            next: { revalidate: revalidateSeconds },
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'unknown');
            console.error(`[IPO_API] ❌ ${tag || endpoint} failed: HTTP ${response.status} - ${errorText}`);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error(`[IPO_API] ❌ ${tag || endpoint} threw:`, error);
        return [];
    }
}

interface IpoListOpts {
    ipoType?: IpoType;
    limit?: number;
    revalidateSeconds?: number;
}

async function fetchIposByStatus(statuses: IpoLifecycleStatus[], opts: IpoListOpts = {}): Promise<Ipo[]> {
    const { ipoType, limit = 50, revalidateSeconds = 300 } = opts;
    const params = new URLSearchParams({
        select: '*,company:companies(*)',
        publish_status: 'eq.published',
        status: `in.(${statuses.join(',')})`,
        order: 'open_date.asc.nullslast',
        limit: String(limit),
    });
    if (ipoType) params.set('ipo_type', `eq.${ipoType}`);
    return ipoFetch(`ipos?${params.toString()}`, `fetchIposByStatus(${statuses.join(',')})`, revalidateSeconds);
}

export function fetchUpcomingIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['announced', 'upcoming'], opts);
}

export function fetchOpenIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['open'], opts);
}

export function fetchClosedIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['closed', 'allotment'], opts);
}

export function fetchListedIpos(opts: IpoListOpts = {}): Promise<Ipo[]> {
    return fetchIposByStatus(['listed'], { ...opts, revalidateSeconds: opts.revalidateSeconds ?? 3600 });
}

export async function fetchFeaturedIpos(limit: number = 5, revalidateSeconds: number = 300): Promise<Ipo[]> {
    return ipoFetch(
        `ipos?select=*,company:companies(*)&publish_status=eq.published&is_featured=eq.true&order=open_date.desc&limit=${limit}`,
        'fetchFeaturedIpos',
        revalidateSeconds
    );
}

export async function fetchCompanyById(id: string, revalidateSeconds: number = 3600): Promise<Company | null> {
    const rows = await ipoFetch(`companies?select=*&id=eq.${id}`, `fetchCompanyById(${id})`, revalidateSeconds);
    return rows[0] ?? null;
}

export async function fetchRegistrarById(id: string, revalidateSeconds: number = 3600): Promise<Registrar | null> {
    const rows = await ipoFetch(`registrars?select=*&id=eq.${id}`, `fetchRegistrarById(${id})`, revalidateSeconds);
    return rows[0] ?? null;
}

/**
 * Full IPO detail aggregate for the detail page: core record + company + registrar +
 * GMP history (append-only log, newest first) + subscription history + allotment + review + documents.
 */
export async function fetchIpoBySlug(slug: string, revalidateSeconds: number = 300): Promise<IpoDetail | null> {
    const ipoRows = await ipoFetch(
        `ipos?select=*&slug=eq.${encodeURIComponent(slug)}&publish_status=eq.published`,
        `fetchIpoBySlug(${slug})`,
        revalidateSeconds
    );
    const ipo: Ipo | undefined = ipoRows[0];
    if (!ipo) return null;

    const [company, registrar, gmpHistory, subscriptionHistory, allotmentRows, reviewRows, documents] = await Promise.all([
        ipo.company_id ? fetchCompanyById(ipo.company_id, revalidateSeconds) : Promise.resolve(null),
        ipo.registrar_id ? fetchRegistrarById(ipo.registrar_id, revalidateSeconds) : Promise.resolve(null),
        ipoFetch(
            `ipo_gmp_updates?select=*&ipo_id=eq.${ipo.id}&order=recorded_at.desc`,
            `fetchGmpHistory(${ipo.id})`,
            revalidateSeconds
        ) as Promise<IpoGmpUpdate[]>,
        ipoFetch(
            `ipo_subscription_updates?select=*&ipo_id=eq.${ipo.id}&order=day_number.asc,category.asc`,
            `fetchSubscriptionHistory(${ipo.id})`,
            revalidateSeconds
        ) as Promise<IpoSubscriptionUpdate[]>,
        ipoFetch(`ipo_allotment_info?select=*&ipo_id=eq.${ipo.id}`, `fetchAllotment(${ipo.id})`, revalidateSeconds) as Promise<IpoAllotmentInfo[]>,
        ipoFetch(
            `ipo_reviews?select=*&ipo_id=eq.${ipo.id}&publish_status=eq.published`,
            `fetchReview(${ipo.id})`,
            revalidateSeconds
        ) as Promise<IpoReview[]>,
        ipoFetch(
            `ipo_documents?select=*&ipo_id=eq.${ipo.id}&order=published_at.desc`,
            `fetchDocuments(${ipo.id})`,
            revalidateSeconds
        ) as Promise<IpoDocument[]>,
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
            const rows = await ipoFetch(
                `ipo_gmp_updates?select=*&ipo_id=eq.${ipo.id}&order=recorded_at.desc&limit=1`,
                `fetchLatestGmp(${ipo.id})`,
                revalidateSeconds
            );
            return { ipo, latestGmp: (rows[0] as IpoGmpUpdate) ?? null };
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

/**
 * Minimal field set for sitemap generation.
 */
export async function fetchAllPublishedIpoSlugs(revalidateSeconds: number = 86400): Promise<Pick<Ipo, 'slug' | 'updated_at'>[]> {
    return ipoFetch(
        `ipos?select=slug,updated_at&publish_status=eq.published&order=updated_at.desc`,
        'fetchAllPublishedIpoSlugs',
        revalidateSeconds
    );
}
