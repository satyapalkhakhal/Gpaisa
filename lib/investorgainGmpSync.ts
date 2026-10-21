// Server-only. Records grey market premium (GMP) from Investorgain into ipo_gmp_updates,
// one reading per IPO per IST day — the day-wise history the IPO page charts and tabulates.
// Run on a schedule through app/api/cron/gmp-sync (see deploy/ipo-sync.sh).
//
// - The live list (one JSON call) gives every current IPO's GMP; today's row is updated
//   in place as the day goes on, so each day ends holding that day's last reading.
// - The first time an IPO is matched, its Investorgain page is read once to backfill the
//   day-wise history from before we started tracking it.
// Only IPOs already in our database are touched (lib/growwIpoSync.ts creates them), and only
// rows with source = GMP_SOURCE, so GMP entered by hand in the admin is never changed.
import { insertRow, queryRows, updateRowById } from './db';
import { slugify } from './slugify';
import type { IpoLifecycleStatus } from './ipoTypes';
import { INVESTORGAIN_SITE, MONTHS, fetchReport, fetchWithRetry, htmlText as text, istDay } from './investorgain';

export const GMP_SOURCE = 'Investorgain';
const GMP_REPORT = 331;

/** One row of Investorgain's live GMP report (only the fields we use). */
interface ListRow {
    '~id': number;
    '~ipo_name': string;
    '~ipo_status1': string; // U upcoming, O open, C closed, LP/LN listed
    '~IPO_Category': string; // IPO (mainboard) or SME
    '~Srt_Open': string | null;
    '~urlrewrite_folder_name': string;
    GMP: string; // HTML, e.g. "&#8377;<b>135</b> (23.04%)..." or "&#8377;<b>--</b>"
    'Price (₹)': string;
    'Updated-On': string; // HTML around "21-Oct 13:02" (IST)
}

interface Reading {
    day: string; // IST 'YYYY-MM-DD'
    recordedAt: string; // ISO
    gmp: number;
}

interface DbIpo {
    id: string;
    slug: string;
    status: IpoLifecycleStatus;
    ipo_type: string;
    open_date: string | null;
    price_band_max: number | null;
    investorgain_id: number | null;
    company_name: string | null;
}

export interface GmpSyncReport {
    dryRun: boolean;
    fetched: number;
    readings: { slug: string; gmp: number; day: string }[];
    backfilled: { slug: string; days: number }[];
    unmatched: string[];
    errors: { ipo?: string; message: string }[];
}

// ── Parsing ──────────────────────────────────────────────────────────────

/** "₹ 135 (23.04%)" → 135; "₹ --" → null. */
function parseGmp(htmlish: string): number | null {
    const m = text(htmlish).match(/₹\s*(-?\s*[\d,]+(?:\.\d+)?)/);
    if (!m) return null;
    const n = Number(m[1].replace(/[\s,]/g, ''));
    return Number.isFinite(n) ? n : null;
}

/**
 * "21-Oct 13:02" (IST, no year) → ISO timestamp. The year is the current one unless that
 * would put the date in the future, which means it belongs to last year (Dec seen in Jan).
 */
function parseIstStamp(raw: string, now = new Date()): string | null {
    const m = text(raw).match(/(\d{1,2})-([A-Za-z]{3})\s+(\d{1,2}):(\d{2})/);
    if (!m) return null;
    const month = MONTHS.indexOf(m[2].toLowerCase());
    if (month < 0) return null;
    const build = (year: number) =>
        new Date(`${year}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}T${m[3].padStart(2, '0')}:${m[4]}:00+05:30`);
    let date = build(Number(istDay(now).slice(0, 4)));
    if (date.getTime() > now.getTime() + 86_400_000) date = build(date.getUTCFullYear() - 1);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** The day-wise table ("GMP Date | GMP | Est. Listing Price | ...") on an IPO's Investorgain page. */
function parseHistoryPage(html: string): Reading[] {
    const table = html.match(/<table[\s\S]*?<\/table>/gi)?.find((t) => /GMP\s*Date/i.test(text(t)));
    if (!table) return [];
    const readings: Reading[] = [];
    for (const row of table.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
        const cells = row.match(/<td[\s\S]*?<\/td>/gi);
        if (!cells || cells.length < 2) continue;
        const recordedAt = parseIstStamp(cells[0]);
        const gmp = parseGmp(cells[1]);
        if (recordedAt && gmp != null) readings.push({ day: istDay(new Date(recordedAt)), recordedAt, gmp });
    }
    return readings;
}

// ── Matching ─────────────────────────────────────────────────────────────

/** "R.K.Fashion Accessories" → "rkfashionaccessories" — spacing/punctuation-free name. */
const compact = (name: string) => slugify(name).replace(/-/g, '').replace(/(limited|ltd)$/, '');

/**
 * Investorgain and our feed spell names differently ("Tonbo Imaging India" / "Tonbo Imaging",
 * "Vaibhav Vyapaar" / "Vaibhav Vyapar"), so a match needs the same open date and type plus a
 * name that is a prefix of the other or shares its first 5 letters — and must be unambiguous.
 */
function findIpo(row: ListRow, ipos: DbIpo[]): DbIpo | undefined {
    const linked = ipos.find((i) => i.investorgain_id === row['~id']);
    if (linked) return linked;

    const name = compact(row['~ipo_name']);
    const type = row['~IPO_Category'] === 'SME' ? 'sme' : 'mainboard';
    const open = row['~Srt_Open'];
    const pool = ipos.filter((i) => !i.investorgain_id && i.company_name && i.ipo_type === type);

    if (!open) {
        const exact = pool.filter((i) => compact(i.company_name!) === name);
        return exact.length === 1 ? exact[0] : undefined;
    }
    const sameDay = pool.filter((i) => i.open_date === open);
    for (const close of [
        (i: DbIpo) => compact(i.company_name!).startsWith(name) || name.startsWith(compact(i.company_name!)),
        (i: DbIpo) => compact(i.company_name!).slice(0, 5) === name.slice(0, 5),
    ]) {
        const hits = sameDay.filter(close);
        if (hits.length === 1) return hits[0];
    }
    return undefined;
}

// ── Writing ──────────────────────────────────────────────────────────────

interface StoredRow {
    id: string;
    day: string;
    recorded_at: string;
    gmp_value: number;
}

/**
 * Upserts readings as one GMP_SOURCE row per IST day (a newer reading replaces that day's
 * row), with % / est. listing / direction derived against the issue price and the previous day.
 * Returns how many rows were written.
 */
async function writeReadings(ipo: DbIpo, price: number | null, readings: Reading[]): Promise<number> {
    const stored = await queryRows<StoredRow>(
        `SELECT id, to_char(recorded_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, recorded_at, gmp_value
         FROM ipo_gmp_updates WHERE ipo_id = $1 AND source = $2 ORDER BY recorded_at`,
        [ipo.id, GMP_SOURCE]
    );
    const byDay = new Map(stored.map((r) => [r.day, r]));

    // Latest reading per day, oldest day first so each day can compare with the one before.
    const latestPerDay = new Map<string, Reading>();
    for (const r of readings) {
        const seen = latestPerDay.get(r.day);
        if (!seen || r.recordedAt > seen.recordedAt) latestPerDay.set(r.day, r);
    }
    const days = [...latestPerDay.values()].sort((a, b) => a.day.localeCompare(b.day));

    let written = 0;
    for (const r of days) {
        const existing = byDay.get(r.day);
        // Postgres and JS format timestamps differently, so compare instants, not strings.
        if (existing && Date.parse(existing.recorded_at) >= Date.parse(r.recordedAt)) continue;

        const previous = [...byDay.values()].filter((s) => s.day < r.day).sort((a, b) => b.day.localeCompare(a.day))[0];
        const fields = {
            gmp_value: r.gmp,
            gmp_percentage: price ? Math.round((r.gmp / price) * 10_000) / 100 : null,
            estimated_listing_price: price ? price + r.gmp : null,
            direction: !previous ? null : r.gmp > previous.gmp_value ? 'up' : r.gmp < previous.gmp_value ? 'down' : 'flat',
            recorded_at: r.recordedAt,
        };
        if (existing) {
            await updateRowById('ipo_gmp_updates', existing.id, fields);
            byDay.set(r.day, { ...existing, gmp_value: r.gmp, recorded_at: r.recordedAt });
        } else {
            const row = await insertRow<{ id: string }>('ipo_gmp_updates', { ...fields, ipo_id: ipo.id, source: GMP_SOURCE });
            byDay.set(r.day, { id: row.id, day: r.day, gmp_value: r.gmp, recorded_at: r.recordedAt });
        }
        written++;
    }
    return written;
}

export async function syncInvestorgainGmp({ dryRun = false } = {}): Promise<GmpSyncReport> {
    const report: GmpSyncReport = { dryRun, fetched: 0, readings: [], backfilled: [], unmatched: [], errors: [] };

    let rows: ListRow[];
    try {
        rows = await fetchReport<ListRow>(GMP_REPORT);
    } catch (error) {
        report.errors.push({ message: (error as Error).message });
        return report;
    }
    report.fetched = rows.length;

    const ipos = await queryRows<DbIpo>(
        `SELECT i.id, i.slug, i.status, i.ipo_type, i.open_date, i.price_band_max, i.investorgain_id, c.name AS company_name
         FROM ipos i LEFT JOIN companies c ON c.id = i.company_id`
    );

    for (const row of rows) {
        // GMP stops meaning anything once the shares trade on the exchange.
        if (row['~ipo_status1'].startsWith('L')) continue;
        const ipo = findIpo(row, ipos);
        if (!ipo) {
            report.unmatched.push(row['~ipo_name']);
            continue;
        }
        try {
            if (!ipo.investorgain_id) {
                if (!dryRun) await updateRowById('ipos', ipo.id, { investorgain_id: row['~id'] });
                ipo.investorgain_id = row['~id'];
            }
            const price = ipo.price_band_max ?? (Number(row['Price (₹)']) || null);

            const [{ count }] = await queryRows<{ count: number }>(
                `SELECT count(*)::int AS count FROM ipo_gmp_updates WHERE ipo_id = $1 AND source = $2`,
                [ipo.id, GMP_SOURCE]
            );
            if (count === 0) {
                const page = await fetchWithRetry(`${INVESTORGAIN_SITE}${row['~urlrewrite_folder_name']}`);
                const history = parseHistoryPage(await page.text());
                if (history.length) {
                    if (!dryRun) await writeReadings(ipo, price, history);
                    report.backfilled.push({ slug: ipo.slug, days: new Set(history.map((h) => h.day)).size });
                }
            }

            const gmp = parseGmp(row.GMP);
            const recordedAt = parseIstStamp(row['Updated-On']);
            if (gmp == null || !recordedAt) continue; // "₹ --": no grey market quote yet
            const reading = { day: istDay(new Date(recordedAt)), recordedAt, gmp };
            if (dryRun || (await writeReadings(ipo, price, [reading]))) {
                report.readings.push({ slug: ipo.slug, gmp, day: reading.day });
            }
        } catch (error) {
            report.errors.push({ ipo: ipo.slug, message: (error as Error).message });
        }
    }

    return report;
}
