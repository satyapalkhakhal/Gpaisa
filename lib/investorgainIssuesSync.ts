// Server-only. Keeps NCD issues and rights issues current from Investorgain's NCD and
// rights-issue reports. Run on a schedule through app/api/cron/issues-sync (see
// deploy/ipo-sync.sh).
//
// Same rules as lib/growwIpoSync.ts: only empty fields are filled and status only moves
// forward, so anything an editor entered is kept. Issues not in the database yet are
// created (recent ones only), published straight away when they carry the facts a reader
// needs (NCD: dates + coupon series; rights: price + ratio + a date), otherwise as drafts.
// Detail pages (coupon series, issue size, registrar, …) are fetched only when a record is
// created or still lacks those details.
import { insertRow, queryRows, updateRowById } from './db';
import { slugify } from './slugify';
import {
    INVESTORGAIN_SITE,
    MONTHS,
    baseDomain,
    fetchReport,
    fetchWithRetry,
    firstHref,
    htmlText,
    istDay,
    keyValueRows,
    parseAmount,
    parseLongDate,
} from './investorgain';
import { NCD_LIFECYCLE_ORDER, RIGHTS_LIFECYCLE_ORDER } from './otherInvestmentsTypes';
import type { NcdSeries } from './otherInvestmentsTypes';

const NCD_REPORT = 400;
const RIGHTS_REPORT = 399;
// The reports reach back months; only issues with a date this recent (or later) are created.
const CREATE_WITHIN_DAYS = 30;
// Detail pages are ~150 KB each; cap them per run so a first run can't hammer the site.
const MAX_DETAIL_FETCHES = 15;

interface NcdRow {
    Issue: string;
    'Size(Base)': string;
    'Size(Shelf)': string;
    'Min Order Amount': string;
    'Open Date': string;
    'Close Date': string;
    Status: string;
    'Credit Rating': string;
    '~URLRewrite_Folder_Name': string;
}

interface RightsRow {
    Issue: string;
    Price: string;
    'Record Date': string;
    'Open Date': string;
    'Close Date': string;
    'Listing Date': string;
    Entitlement: string;
    '~URLRewrite_Folder_Name': string;
}

type Kind = 'ncd' | 'rights';
type Fields = Record<string, unknown>;

/** One Investorgain issue, normalized to our columns. */
interface Candidate {
    investorgainId: number;
    companyName: string;
    detailPath: string;
    fields: Fields;
}

interface DbRow {
    id: string;
    slug: string;
    status: string;
    investorgain_id: number | null;
    company_name: string | null;
    [column: string]: unknown;
}

interface KindReport {
    fetched: number;
    created: { slug: string; published: boolean }[];
    updated: { slug: string; fields: string[] }[];
    ignoredOld: number;
    errors: { issue?: string; message: string }[];
}

export interface IssuesSyncReport {
    dryRun: boolean;
    ncd: KindReport;
    rights: KindReport;
}

const KINDS = {
    ncd: { table: 'ncd_issues', order: NCD_LIFECYCLE_ORDER as readonly string[], keyDate: 'open_date', label: 'NCD' },
    rights: { table: 'rights_issues', order: RIGHTS_LIFECYCLE_ORDER as readonly string[], keyDate: 'record_date', label: 'Rights Issue' },
} as const;

// ── Parsing helpers ─────────────────────────────────────────────────────

const idFromPath = (path: string) => Number(path.match(/\/(\d+)\/?$/)?.[1]) || null;

/** The issue name without the status badge rights issues carry ("Veeram Securities <span class='badge'>U</span>"). */
function issueName(cell: string): string {
    return htmlText(cell.replace(/<span[^>]*badge[^>]*>[\s\S]*?<\/span>/gi, ''));
}

const TRAILING_MONTH = /\s+(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|june?|july?|aug(ust)?|sept?(ember)?|oct(ober)?|nov(ember)?|dec(ember)?)\.?$/i;

/** "Muthoot Fincorp Tranche V" / "Natco Pharma September" → the company: "Muthoot Fincorp" / "Natco Pharma". */
function companyNameOf(name: string): string {
    let result = name.trim();
    for (let previous = ''; previous !== result; ) {
        previous = result;
        result = result.replace(/\s+tranch?e?\s+[ivx\d]+$/i, '').replace(TRAILING_MONTH, '').trim();
    }
    return result || name.trim();
}

const compact = (name: string) => slugify(name).replace(/-/g, '').replace(/(limited|ltd)$/, '');

/** "Crisil Ratings Limited : AA- Brickwork …" → { credit_rating: 'AA-', rating_agency: 'Crisil Ratings Limited' }. */
function parseRating(cell: string): { credit_rating: string | null; rating_agency: string | null } {
    const raw = htmlText(cell);
    if (!raw) return { credit_rating: null, rating_agency: null };
    const colon = raw.indexOf(':');
    const agency = colon > 0 ? raw.slice(0, colon).trim() : raw.match(/\bby\s+(.+)$/i)?.[1]?.trim() ?? null;
    const ratingPart = colon > 0 ? raw.slice(colon + 1) : raw;
    const token = ratingPart.match(/(?<![A-Za-z])(AAA|AA[+-]?|A[+-]?|BBB[+-]?|BB[+-]?|B[+-]?)(?![A-Za-z])/)?.[1];
    return { credit_rating: token ?? ratingPart.trim().slice(0, 60), rating_agency: agency ? agency.slice(0, 80) : null };
}

/** "13 Months" / "400 Days" / "5 Years" → months. */
function tenureMonths(raw: string): number | null {
    const m = raw.match(/([\d.]+)\s*(month|day|year)/i);
    if (!m) return null;
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    return Math.round(unit === 'year' ? n * 12 : unit === 'day' ? n / 30.4375 : n);
}

function payoutFrequency(raw: string): NcdSeries['frequency'] {
    const t = raw.toLowerCase();
    if (t.includes('month')) return 'monthly';
    if (t.includes('quarter')) return 'quarterly';
    if (t.includes('half')) return 'half_yearly';
    if (t.includes('cumulative') || t.includes('maturity')) return 'cumulative';
    return 'annual';
}

/** Every table on the page as rows of cell text. */
function tables(html: string): string[][][] {
    return (html.match(/<table[\s\S]*?<\/table>/gi) ?? []).map((t) =>
        (t.match(/<tr[\s\S]*?<\/tr>/gi) ?? []).map((tr) => (tr.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/gi) ?? []).map(htmlText))
    );
}

/** The NCD's series table (one column per series; rows Frequency / Nature / Tenor / Coupon / Effective Yield). */
function parseSeries(html: string, minInvestment: number | null): { series: NcdSeries[]; secured: boolean | null } {
    const table = tables(html).find((rows) => rows.some((r) => /coupon/i.test(r[0] ?? '')));
    if (!table) return { series: [], secured: null };
    const row = (label: RegExp) => table.find((r) => label.test(r[0] ?? '')) ?? [];
    const header = table[0];
    const [frequency, nature, tenor, coupon, yieldRow] = [/frequency/i, /nature/i, /tenor/i, /coupon/i, /effective yield/i].map(row);

    const series: NcdSeries[] = [];
    for (let i = 1; i < header.length; i++) {
        const months = tenureMonths(tenor[i] ?? '');
        const effective = parseAmount(yieldRow[i]);
        const rate = parseAmount(coupon[i]) ?? effective;
        if (months == null || rate == null) continue;
        series.push({
            name: header[i] || `Series ${i}`,
            tenure_months: months,
            coupon_rate: rate,
            frequency: payoutFrequency(frequency[i] ?? ''),
            min_investment: minInvestment,
            effective_yield: effective,
        });
    }
    const natures = nature.slice(1).filter(Boolean).map((n) => n.toLowerCase());
    return { series, secured: natures.length ? natures.every((n) => !n.includes('unsecured')) : null };
}

/** "Issue Objects" table → "purpose; purpose; …". */
function parseObjects(html: string): string | null {
    const table = tables(html).find((rows) => rows[0]?.some((c) => /issue objects/i.test(c)));
    const purposes = table?.slice(1).map((r) => r[1]).filter((p) => p && !/^total$/i.test(p));
    return purposes?.length ? purposes.join('; ') : null;
}

function parseLeadManagers(html: string): string[] {
    return [...html.matchAll(/class="ipo-acc-mgr-link"[^>]*title="([^"]+)"/g)].map((m) => htmlText(m[1]));
}

function parseRegistrarWebsite(html: string): string | null {
    return html.match(/ipo-acc-registrar-html[\s\S]*?Website:<\/strong>\s*<a[^>]*href="([^"]+)"/i)?.[1] ?? null;
}

// ── Normalization ─────────────────────────────────────────────────────────

function ncdStatus(f: Fields, statusText: string, today: string): string {
    const open = f.open_date as string | null;
    const close = f.close_date as string | null;
    if (open && today < open) return 'upcoming';
    if (open && close && today <= close) return 'open';
    if (close && today > close) return 'closed';
    if (/open/i.test(statusText)) return 'open';
    if (/close/i.test(statusText)) return 'closed';
    return /upcoming/i.test(statusText) ? 'upcoming' : 'announced';
}

function rightsStatus(f: Fields, today: string): string {
    const due = (column: string) => (f[column] as string | null) != null && (f[column] as string) <= today;
    if (due('listing_date')) return 'listed';
    if (due('allotment_date')) return 'allotment';
    if (f.application_end && (f.application_end as string) < today) return 'closed';
    if (due('application_start')) return 'open';
    if (due('record_date')) return 'record_date';
    return 'announced';
}

function fromNcdRow(row: NcdRow, today: string): Candidate | null {
    const investorgainId = idFromPath(row['~URLRewrite_Folder_Name']);
    if (!investorgainId) return null;
    const name = issueName(row.Issue);
    const fields: Fields = {
        open_date: parseLongDate(row['Open Date']),
        close_date: parseLongDate(row['Close Date']),
        base_issue_size: parseAmount(row['Size(Base)']),
        shelf_limit: parseAmount(row['Size(Shelf)']),
        ...parseRating(row['Credit Rating']),
        min_investment: parseAmount(row['Min Order Amount']), // folded into each series, not a column
    };
    fields.status = ncdStatus(fields, htmlText(row.Status), today);
    return { investorgainId, companyName: companyNameOf(name), detailPath: row['~URLRewrite_Folder_Name'], fields };
}

function fromRightsRow(row: RightsRow, today: string): Candidate | null {
    const investorgainId = idFromPath(row['~URLRewrite_Folder_Name']);
    if (!investorgainId) return null;
    const ratio = htmlText(row.Entitlement);
    const fields: Fields = {
        issue_price: parseAmount(row.Price),
        rights_ratio: /^\d+\s*:\s*\d+$/.test(ratio) ? ratio.replace(/\s+/g, '') : null,
        record_date: parseLongDate(row['Record Date']),
        application_start: parseLongDate(row['Open Date']),
        application_end: parseLongDate(row['Close Date']),
        listing_date: parseLongDate(row['Listing Date']),
    };
    // Investorgain sometimes lists a "listing date" before the issue even closes; drop it.
    if (fields.listing_date && fields.application_end && (fields.listing_date as string) < (fields.application_end as string)) {
        fields.listing_date = null;
    }
    fields.status = rightsStatus(fields, today);
    return { investorgainId, companyName: companyNameOf(issueName(row.Issue)), detailPath: row['~URLRewrite_Folder_Name'], fields };
}

/** Columns read from the issue's detail page. */
function detailFields(kind: Kind, html: string, candidate: Candidate, registrarByDomain: Map<string, string>, today: string): Fields {
    const kv = keyValueRows(html);
    const detail: Fields = {
        objects_of_issue: parseObjects(html),
        registrar_id: registrarByDomain.get(baseDomain(parseRegistrarWebsite(html)) ?? '') ?? null,
    };
    if (kind === 'ncd') {
        const { series, secured } = parseSeries(html, candidate.fields.min_investment as number | null);
        if (series.length) detail.series = series;
        if (secured != null) detail.secured = secured;
        const managers = parseLeadManagers(html);
        if (managers.length) detail.lead_managers = managers;
        detail.prospectus_url = firstHref(kv.get('RHP')) ?? firstHref(kv.get('DRHP'));
    } else {
        detail.issue_size = parseAmount(kv.get('Issue Size (Amount)'));
        detail.face_value = parseAmount(kv.get('Face Value'));
        detail.letter_of_offer_url = firstHref(kv.get('Letter of Offer'));
        const allotment = htmlText(html).match(/Basis of Allotment\s+(?:Done|Upcoming|Today|Ongoing)?\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3}\s+\d{4})/);
        detail.allotment_date = parseLongDate(allotment?.[1]);
        detail.status = rightsStatus({ ...candidate.fields, ...detail }, today);
    }
    return detail;
}

// ── Sync ──────────────────────────────────────────────────────────────────

const isEmpty = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0);

/** Candidate values for columns that are still empty on `row`, plus a forward-only status. */
function fillMissing(row: DbRow, fields: Fields, order: readonly string[]): Fields {
    const patch: Fields = {};
    for (const [column, value] of Object.entries(fields)) {
        if (column === 'status' || column === 'min_investment' || isEmpty(value)) continue;
        if (isEmpty(row[column])) patch[column] = value;
    }
    const status = fields.status as string;
    if (order.indexOf(status) > order.indexOf(row.status)) patch.status = status;
    return patch;
}

function isComplete(kind: Kind, f: Fields): boolean {
    return kind === 'ncd'
        ? !!(f.open_date && f.close_date && Array.isArray(f.series) && f.series.length)
        : !!(f.issue_price && f.rights_ratio && (f.record_date || f.application_start));
}

/** Latest date we know for the issue — decides whether it's recent enough to create. */
function latestDate(f: Fields): string | null {
    const dates = ['open_date', 'close_date', 'record_date', 'application_start', 'application_end', 'listing_date']
        .map((c) => f[c] as string | null)
        .filter((d): d is string => !!d);
    return dates.length ? dates.sort().at(-1)! : null;
}

function slugFor(kind: Kind, c: Candidate, taken: Set<string>): string {
    const date = ((kind === 'ncd' ? c.fields.open_date : c.fields.record_date ?? c.fields.application_start) as string | null) ?? istDay(new Date());
    const base = slugify(`${c.companyName} ${KINDS[kind].label} ${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`);
    return taken.has(base) ? `${base}-${c.investorgainId}` : base;
}

async function syncKind(kind: Kind, candidates: Candidate[], ctx: {
    dryRun: boolean;
    today: string;
    registrarByDomain: Map<string, string>;
    companyBySlug: Map<string, string>;
    detailBudget: { left: number };
}, report: KindReport): Promise<void> {
    const { table, order, keyDate } = KINDS[kind];
    const rows = await queryRows<DbRow>(`SELECT t.*, c.name AS company_name FROM ${table} t LEFT JOIN companies c ON c.id = t.company_id`);
    const slugs = new Set(rows.map((r) => r.slug));
    const cutoff = istDay(new Date(Date.parse(`${ctx.today}T00:00:00Z`) - CREATE_WITHIN_DAYS * 86_400_000));

    const fetchDetail = async (c: Candidate): Promise<Fields> => {
        if (ctx.detailBudget.left <= 0) return {};
        ctx.detailBudget.left--;
        const page = await fetchWithRetry(`${INVESTORGAIN_SITE}${c.detailPath}`);
        return detailFields(kind, await page.text(), c, ctx.registrarByDomain, ctx.today);
    };

    for (const c of candidates) {
        try {
            const key = c.fields[keyDate] as string | null;
            const existing =
                rows.find((r) => r.investorgain_id === c.investorgainId) ??
                rows.find((r) => !r.investorgain_id && r.company_name && key && r[keyDate] === key && compact(r.company_name) === compact(c.companyName));
            const recent = (latestDate(c.fields) ?? '') >= cutoff;

            if (existing) {
                let fields = c.fields;
                const lacksDetail = kind === 'ncd' ? isEmpty(existing.series) : existing.issue_size == null && existing.face_value == null;
                if (lacksDetail && recent) fields = { ...fields, ...(await fetchDetail(c)) };

                const patch = fillMissing(existing, fields, order);
                const changed = Object.keys(patch);
                if (!existing.investorgain_id) patch.investorgain_id = c.investorgainId;
                if (Object.keys(patch).length && !ctx.dryRun) {
                    await updateRowById(table, existing.id, { ...patch, updated_at: new Date().toISOString() });
                }
                Object.assign(existing, patch);
                if (changed.length) report.updated.push({ slug: existing.slug, fields: changed });
                continue;
            }

            if (!recent) {
                report.ignoredOld++;
                continue;
            }
            const fields: Fields = { ...c.fields, ...(await fetchDetail(c)) };
            delete fields.min_investment;
            const slug = slugFor(kind, c, slugs);
            const published = isComplete(kind, fields);
            report.created.push({ slug, published });
            slugs.add(slug);
            if (ctx.dryRun) continue;

            const now = new Date().toISOString();
            const companySlug = slugify(c.companyName);
            let companyId = ctx.companyBySlug.get(companySlug);
            if (!companyId) {
                const company = await insertRow<{ id: string }>('companies', { name: c.companyName, slug: companySlug, created_at: now, updated_at: now });
                companyId = company.id;
                ctx.companyBySlug.set(companySlug, companyId);
            }
            const values = Object.fromEntries(Object.entries(fields).filter(([, v]) => !isEmpty(v)));
            const row = await insertRow<DbRow>(table, {
                ...values,
                company_id: companyId,
                slug,
                investorgain_id: c.investorgainId,
                publish_status: published ? 'published' : 'draft',
                created_at: now,
                updated_at: now,
            });
            rows.push({ ...row, company_name: c.companyName });
        } catch (error) {
            report.errors.push({ issue: c.companyName, message: (error as Error).message });
        }
    }
}

export async function syncInvestorgainIssues({ dryRun = false } = {}): Promise<IssuesSyncReport> {
    const blank = (): KindReport => ({ fetched: 0, created: [], updated: [], ignoredOld: 0, errors: [] });
    const report: IssuesSyncReport = { dryRun, ncd: blank(), rights: blank() };
    const today = istDay(new Date());

    const [registrars, companies] = await Promise.all([
        queryRows<{ id: string; website: string | null; allotment_status_check_url: string | null }>(
            `SELECT id, website, allotment_status_check_url FROM registrars`
        ),
        queryRows<{ id: string; slug: string }>(`SELECT id, slug FROM companies`),
    ]);
    const registrarByDomain = new Map<string, string>();
    for (const r of registrars) {
        for (const url of [r.allotment_status_check_url, r.website]) {
            const domain = baseDomain(url);
            if (domain && !registrarByDomain.has(domain)) registrarByDomain.set(domain, r.id);
        }
    }
    const ctx = { dryRun, today, registrarByDomain, companyBySlug: new Map(companies.map((c) => [c.slug, c.id])), detailBudget: { left: MAX_DETAIL_FETCHES } };

    const feeds: [Kind, number, (row: never, today: string) => Candidate | null][] = [
        ['ncd', NCD_REPORT, fromNcdRow as (row: never, today: string) => Candidate | null],
        ['rights', RIGHTS_REPORT, fromRightsRow as (row: never, today: string) => Candidate | null],
    ];
    for (const [kind, reportId, normalize] of feeds) {
        try {
            const rows = await fetchReport<never>(reportId);
            report[kind].fetched = rows.length;
            const candidates = rows.map((r) => normalize(r, today)).filter((c): c is Candidate => !!c);
            await syncKind(kind, candidates, ctx, report[kind]);
        } catch (error) {
            report[kind].errors.push({ message: (error as Error).message });
        }
    }
    return report;
}
