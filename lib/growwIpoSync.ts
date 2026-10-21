// Server-only. Pulls Groww's public IPO feeds (upcoming / open / closed) and reconciles
// them into ipos, companies and ipo_subscription_updates. Run on a schedule through
// app/api/cron/groww-ipo-sync (see deploy/ipo-sync.sh).
//
// Groww is a secondary source: the sync only fills fields that are still empty and only
// moves `status` forward, so nothing an editor entered in the admin is overwritten.
// IPOs not in the database yet are created as drafts for an editor to review and publish.
import { insertRow, queryRows, updateRowById } from './db';
import { slugify } from './slugify';
import type { IpoLifecycleStatus, IpoType } from './ipoTypes';

const GROWW_API = 'https://groww.in/v1/api/primaries/v1/ipo';
const FEEDS = ['upcoming', 'open', 'closed'] as const;
type Feed = (typeof FEEDS)[number];

const LIFECYCLE: IpoLifecycleStatus[] = ['drhp', 'rhp', 'announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'];

// The closed feed goes back months. Only create records for recent issues so the first
// run doesn't flood the admin with stale drafts; older IPOs are still updated if present.
const CREATE_CLOSED_WITHIN_DAYS = 30;
// A slug or company-name match is only trusted if the open dates are this close —
// companies do come back for a second IPO years later.
const SAME_ISSUE_MAX_DAYS_APART = 60;

// ── Groww response shapes (only the fields we use) ──────────────────────────

interface GrowwCategory {
    category: string; // IND (retail), HNI, EMP, SHA, ...
    lotSize: number | null;
    minPrice: number | null;
    maxPrice: number | null;
}

interface GrowwBase {
    searchId: string;
    companyName: string;
    isSme: boolean;
    logoUrl: string | null;
}

interface GrowwUpcoming extends GrowwBase {
    bidStartTimestamp: number | null;
    documentUrl: string | null;
}

interface GrowwOpen extends GrowwBase {
    bidStartTimestamp: number | null;
    bidEndTimestamp: number | null;
    overallSubscription: number | null;
    categories: GrowwCategory[] | null;
}

interface GrowwClosed extends GrowwBase {
    issuePrice: number | null;
    listingPrice: number | null;
    listingTimestamp: number | null;
    isListed: boolean;
    overallSubscription: number | null;
    openingDate: string | null;
    closingDate: string | null;
    allotmentDate: string | null;
    rtaLink: string | null;
}

/** One Groww entry, normalized to our columns. */
interface GrowwIpo {
    feed: Feed;
    searchId: string;
    companyName: string;
    ipoType: IpoType;
    logoUrl: string | null;
    status: IpoLifecycleStatus;
    /** Candidate column values; each is written only where our column is still empty. */
    fields: Record<string, string | number | null>;
    overallSubscription: number | null;
    rtaLink: string | null;
}

interface DbIpo {
    id: string;
    slug: string;
    status: IpoLifecycleStatus;
    company_id: string | null;
    company_slug: string | null;
    groww_search_id: string | null;
    [column: string]: unknown;
}

interface DbCompany {
    id: string;
    slug: string;
    logo_url: string | null;
}

export interface GrowwSyncReport {
    dryRun: boolean;
    fetched: Partial<Record<Feed, number>>;
    created: { slug: string; status: IpoLifecycleStatus }[];
    updated: { slug: string; fields: string[] }[];
    subscriptionRows: number;
    /** Closed-feed IPOs older than CREATE_CLOSED_WITHIN_DAYS with no matching record. */
    ignoredOld: number;
    errors: { searchId?: string; message: string }[];
}

// ── Helpers ──────────────────────────────────────────────────────────────

const istDateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });

/** Epoch millis → 'YYYY-MM-DD' in IST (Groww's timestamps are IST market times). */
function istDate(ms: number | null | undefined): string | null {
    return ms ? istDateFormat.format(new Date(ms)) : null;
}

function daysBetween(a: string, b: string): number {
    return Math.abs(Date.parse(a) - Date.parse(b)) / 86_400_000;
}

/** Weekdays from `start` to `end` inclusive (at least 1) — the bidding day number. */
function biddingDay(start: string, end: string): number {
    let count = 0;
    for (let d = new Date(`${start}T00:00:00Z`); d <= new Date(`${end}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
        const weekday = d.getUTCDay();
        if (weekday !== 0 && weekday !== 6) count++;
    }
    return Math.max(1, count);
}

/** Registrable domain ("ipostatus.kfintech.com" → "kfintech.com"), to match RTA links to registrars. */
function baseDomain(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
        return new URL(url).hostname.split('.').slice(-2).join('.');
    } catch {
        return null;
    }
}

async function fetchFeed<T>(feed: Feed, attempt = 1): Promise<T[]> {
    let res: Response;
    try {
        res = await fetch(`${GROWW_API}/${feed}?v=1`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(15_000),
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
            },
        });
    } catch (error) {
        // One retry for network blips; a run is cheap, but a missed feed waits for the next one.
        if (attempt < 2) return fetchFeed<T>(feed, attempt + 1);
        throw new Error(`Groww ${feed} feed: ${(error as Error).message}`);
    }
    if (!res.ok) throw new Error(`Groww ${feed} feed: HTTP ${res.status}`);
    const body = await res.json();
    if (!Array.isArray(body?.ipoList)) throw new Error(`Groww ${feed} feed: unexpected response shape`);
    return body.ipoList;
}

// ── Normalization ─────────────────────────────────────────────────────────

function base(feed: Feed, g: GrowwBase) {
    return {
        feed,
        searchId: g.searchId,
        companyName: g.companyName.trim(),
        ipoType: (g.isSme ? 'sme' : 'mainboard') as IpoType,
        logoUrl: g.logoUrl || null,
    };
}

function fromUpcoming(g: GrowwUpcoming): GrowwIpo {
    // No bid date yet means the company has only filed its offer document.
    const status: IpoLifecycleStatus = g.bidStartTimestamp ? 'upcoming' : g.documentUrl ? 'drhp' : 'announced';
    return {
        ...base('upcoming', g),
        status,
        fields: { open_date: istDate(g.bidStartTimestamp), drhp_url: g.documentUrl || null },
        overallSubscription: null,
        rtaLink: null,
    };
}

function fromOpen(g: GrowwOpen): GrowwIpo {
    // The retail (IND) category carries the public price band and lot size.
    const retail = g.categories?.find((c) => c.category === 'IND') ?? g.categories?.[0];
    return {
        ...base('open', g),
        status: 'open',
        fields: {
            open_date: istDate(g.bidStartTimestamp),
            close_date: istDate(g.bidEndTimestamp),
            price_band_min: retail?.minPrice ?? null,
            price_band_max: retail?.maxPrice ?? null,
            lot_size: retail?.lotSize ?? null,
        },
        overallSubscription: g.overallSubscription,
        rtaLink: null,
    };
}

function fromClosed(g: GrowwClosed, today: string): GrowwIpo {
    const status: IpoLifecycleStatus = g.isListed
        ? 'listed'
        : g.allotmentDate && g.allotmentDate <= today ? 'allotment' : 'closed';
    return {
        ...base('closed', g),
        status,
        fields: {
            open_date: g.openingDate,
            close_date: g.closingDate,
            allotment_date: g.allotmentDate,
            listing_date: istDate(g.listingTimestamp),
            // The final issue price is the top of the band for every book-built issue.
            price_band_max: g.issuePrice,
            listing_price: g.listingPrice,
        },
        overallSubscription: g.overallSubscription,
        rtaLink: g.rtaLink,
    };
}

// ── Sync ──────────────────────────────────────────────────────────────────

/** Column values from `fields` for columns that are still empty on `ipo`. */
function fillMissing(ipo: DbIpo, fields: GrowwIpo['fields']): Record<string, unknown> {
    const patch: Record<string, unknown> = {};
    for (const [column, value] of Object.entries(fields)) {
        if (value != null && value !== '' && ipo[column] == null) patch[column] = value;
    }
    // Never write a half-band that would violate price_band_min <= price_band_max.
    const min = (patch.price_band_min ?? ipo.price_band_min) as number | null;
    const max = (patch.price_band_max ?? ipo.price_band_max) as number | null;
    if (min != null && max != null && min > max) {
        delete patch.price_band_min;
        delete patch.price_band_max;
    }
    return patch;
}

/** Whether a slug/company-name match plausibly is this same issue rather than an earlier one. */
function plausiblySameIssue(ipo: DbIpo, g: GrowwIpo): boolean {
    if (ipo.groww_search_id && ipo.groww_search_id !== g.searchId) return false;
    const growwOpen = g.fields.open_date as string | null;
    const ourOpen = ipo.open_date as string | null;
    if (growwOpen && ourOpen) return daysBetween(growwOpen, ourOpen) <= SAME_ISSUE_MAX_DAYS_APART;
    // A listed IPO can't be the same issue as one Groww still shows as pre-listing.
    return !(ipo.status === 'listed' && g.status !== 'listed');
}

export async function syncGrowwIpos({ dryRun = false } = {}): Promise<GrowwSyncReport> {
    const report: GrowwSyncReport = { dryRun, fetched: {}, created: [], updated: [], subscriptionRows: 0, ignoredOld: 0, errors: [] };
    const today = istDate(Date.now())!;

    const entries: GrowwIpo[] = [];
    for (const feed of FEEDS) {
        try {
            if (feed === 'upcoming') entries.push(...(await fetchFeed<GrowwUpcoming>(feed)).map(fromUpcoming));
            if (feed === 'open') entries.push(...(await fetchFeed<GrowwOpen>(feed)).map(fromOpen));
            if (feed === 'closed') entries.push(...(await fetchFeed<GrowwClosed>(feed)).map((g) => fromClosed(g, today)));
            report.fetched[feed] = entries.filter((e) => e.feed === feed).length;
        } catch (error) {
            report.errors.push({ message: (error as Error).message });
        }
    }

    const [ipos, companies, registrars] = await Promise.all([
        queryRows<DbIpo>(`SELECT i.*, c.slug AS company_slug FROM ipos i LEFT JOIN companies c ON c.id = i.company_id`),
        queryRows<DbCompany>(`SELECT id, slug, logo_url FROM companies`),
        queryRows<{ id: string; website: string | null; allotment_status_check_url: string | null }>(
            `SELECT id, website, allotment_status_check_url FROM registrars`
        ),
    ]);

    const byGrowwId = new Map(ipos.filter((i) => i.groww_search_id).map((i) => [i.groww_search_id!, i]));
    const bySlug = new Map(ipos.map((i) => [i.slug, i]));
    const companyBySlug = new Map(companies.map((c) => [c.slug, c]));
    const registrarByDomain = new Map<string, string>();
    for (const r of registrars) {
        for (const url of [r.allotment_status_check_url, r.website]) {
            const domain = baseDomain(url);
            if (domain && !registrarByDomain.has(domain)) registrarByDomain.set(domain, r.id);
        }
    }

    const findExisting = (g: GrowwIpo): DbIpo | undefined => {
        const linked = byGrowwId.get(g.searchId);
        if (linked) return linked;
        const companySlug = slugify(g.companyName);
        const candidates = [
            bySlug.get(slugify(g.searchId)),
            bySlug.get(slugify(`${g.companyName}-ipo`)),
            ...ipos.filter((i) => i.company_slug === companySlug),
        ];
        return candidates.find((i): i is DbIpo => !!i && plausiblySameIssue(i, g));
    };

    for (const g of entries) {
        try {
            const registrarId = registrarByDomain.get(baseDomain(g.rtaLink) ?? '') ?? null;
            let ipo = findExisting(g);

            if (ipo) {
                const patch = fillMissing(ipo, { ...g.fields, registrar_id: registrarId });
                if (!ipo.groww_search_id) patch.groww_search_id = g.searchId;
                if (LIFECYCLE.indexOf(g.status) > LIFECYCLE.indexOf(ipo.status)) patch.status = g.status;

                const changed = Object.keys(patch).filter((k) => k !== 'groww_search_id');
                if (Object.keys(patch).length && !dryRun) {
                    await updateRowById('ipos', ipo.id, { ...patch, updated_at: new Date().toISOString() });
                }
                Object.assign(ipo, patch);
                byGrowwId.set(g.searchId, ipo);
                if (changed.length) report.updated.push({ slug: ipo.slug, fields: changed });

                const company = companies.find((c) => c.id === ipo!.company_id);
                if (company && !company.logo_url && g.logoUrl) {
                    if (!dryRun) await updateRowById('companies', company.id, { logo_url: g.logoUrl, updated_at: new Date().toISOString() });
                    company.logo_url = g.logoUrl;
                }
            } else {
                const closedOn = g.fields.close_date as string | null;
                if (g.feed === 'closed' && (!closedOn || daysBetween(closedOn, today) > CREATE_CLOSED_WITHIN_DAYS)) {
                    report.ignoredOld++;
                    continue;
                }
                const created = await createDraft(g, registrarId, { bySlug, companyBySlug, companies, dryRun });
                if (!created) {
                    report.errors.push({ searchId: g.searchId, message: 'No free slug for new IPO' });
                    continue;
                }
                report.created.push({ slug: created.slug, status: g.status });
                if (dryRun) continue;
                ipo = created;
                ipos.push(ipo);
                bySlug.set(ipo.slug, ipo);
                byGrowwId.set(g.searchId, ipo);
            }

            if (!dryRun && (await syncOverallSubscription(ipo, g, today))) report.subscriptionRows++;
        } catch (error) {
            report.errors.push({ searchId: g.searchId, message: (error as Error).message });
        }
    }

    return report;
}

async function createDraft(
    g: GrowwIpo,
    registrarId: string | null,
    ctx: { bySlug: Map<string, DbIpo>; companyBySlug: Map<string, DbCompany>; companies: DbCompany[]; dryRun: boolean }
): Promise<DbIpo | null> {
    const year = ((g.fields.open_date as string | null) ?? istDate(Date.now())!).slice(0, 4);
    // Same convention as the admin form; Groww's searchId has typos ("hero-fincrop-limited-ipo").
    const slug = [`${g.companyName}-ipo`, `${g.companyName}-ipo-${year}`, g.searchId]
        .map(slugify)
        .find((s) => s && !ctx.bySlug.has(s));
    if (!slug) return null;
    if (ctx.dryRun) return { id: '', slug, status: g.status, company_id: null, company_slug: null, groww_search_id: g.searchId };

    const now = new Date().toISOString();
    const companySlug = slugify(g.companyName);
    let company = ctx.companyBySlug.get(companySlug);
    if (!company) {
        company = await insertRow<DbCompany>('companies', {
            name: g.companyName,
            slug: companySlug,
            logo_url: g.logoUrl,
            created_at: now,
            updated_at: now,
        });
        ctx.companyBySlug.set(company.slug, company);
        ctx.companies.push(company);
    }

    const fields = Object.fromEntries(Object.entries(g.fields).filter(([, v]) => v != null && v !== ''));
    const ipo = await insertRow<DbIpo>('ipos', {
        ...fields,
        company_id: company.id,
        slug,
        ipo_type: g.ipoType,
        status: g.status,
        registrar_id: registrarId,
        groww_search_id: g.searchId,
        publish_status: 'draft',
        created_at: now,
        updated_at: now,
    });
    return { ...ipo, company_slug: company.slug };
}

/**
 * Records Groww's overall subscription figure: a live 'intraday' row for today's bidding
 * day while the issue is open, and the final 'day_end' figure once it closes. Day numbers
 * count weekdays only, so a market holiday mid-issue shifts them by one — hence an editor's
 * 'day_end' rows always win: for that day while open, and for any day once closed.
 * Returns whether a row was written.
 */
async function syncOverallSubscription(ipo: DbIpo, g: GrowwIpo, today: string): Promise<boolean> {
    const times = g.overallSubscription;
    const openDate = (g.fields.open_date ?? ipo.open_date) as string | null;
    if (!times || times <= 0 || !openDate || g.feed === 'upcoming') return false;

    const closeDate = (g.fields.close_date ?? ipo.close_date) as string | null;
    const isOpen = g.feed === 'open';
    const lastDay = isOpen || !closeDate ? today : closeDate;
    const day = biddingDay(openDate, lastDay < openDate ? openDate : lastDay);

    const rows = await queryRows<{ id: string; day_number: number; data_granularity: string; subscription_times: number }>(
        `SELECT id, day_number, data_granularity, subscription_times FROM ipo_subscription_updates
         WHERE ipo_id = $1 AND category = 'overall'`,
        [ipo.id]
    );
    const finalRows = rows.filter((r) => r.data_granularity === 'day_end');
    if (isOpen ? finalRows.some((r) => r.day_number === day) : finalRows.length) return false;

    const granularity = isOpen ? 'intraday' : 'day_end';
    const now = new Date().toISOString();
    const existing = rows.find((r) => r.day_number === day);
    if (existing) {
        if (existing.subscription_times === times && existing.data_granularity === granularity) return false;
        await updateRowById('ipo_subscription_updates', existing.id, { subscription_times: times, data_granularity: granularity, as_of: now });
    } else {
        await insertRow('ipo_subscription_updates', {
            ipo_id: ipo.id,
            day_number: day,
            category: 'overall',
            subscription_times: times,
            data_granularity: granularity,
            as_of: now,
        });
    }
    return true;
}
