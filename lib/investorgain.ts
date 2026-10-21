// Server-only. Shared plumbing for the Investorgain syncs (lib/investorgainGmpSync.ts,
// lib/investorgainIssuesSync.ts): fetching their JSON reports and pages, and turning
// their HTML snippets into plain values.

export const INVESTORGAIN_SITE = 'https://www.investorgain.com';
const REPORT_API = 'https://webnodejs.investorgain.com/cloud/v2/report/data-read';

const HEADERS = {
    Accept: 'application/json, text/html',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
    Origin: INVESTORGAIN_SITE,
    Referer: `${INVESTORGAIN_SITE}/`,
};

export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const istDayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' });

/** A moment → its IST calendar day, 'YYYY-MM-DD'. */
export const istDay = (d: Date) => istDayFormat.format(d);

export async function fetchWithRetry(url: string, attempt = 1): Promise<Response> {
    try {
        const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20_000), headers: HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
    } catch (error) {
        // One retry for network blips; a run is cheap, but a missed fetch waits for the next one.
        if (attempt < 2) return fetchWithRetry(url, attempt + 1);
        throw new Error(`${url}: ${(error as Error).message}`);
    }
}

/** Rows of one of Investorgain's reports (331 GMP, 399 rights issues, 400 NCDs), `all` view. */
export async function fetchReport<T>(reportId: number): Promise<T[]> {
    const [year, month] = istDay(new Date()).split('-').map(Number);
    const fyStart = month >= 4 ? year : year - 1;
    const fy = `${fyStart}-${String(fyStart + 1).slice(2)}`;
    const res = await fetchWithRetry(`${REPORT_API}/${reportId}/1/${month}/${year}/${fy}/0/all?search=`);
    const body = await res.json();
    if (!Array.isArray(body?.reportTableData)) throw new Error(`Investorgain report ${reportId}: unexpected response shape`);
    return body.reportTableData;
}

/** An HTML snippet's visible text, with the entities Investorgain uses decoded. */
export function htmlText(htmlish: string | null | undefined): string {
    return (htmlish ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#8377;|&#x20b9;/gi, '₹')
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

/** "12th Oct 2026" → '2026-10-12'; "Awaiting" / blank → null. */
export function parseLongDate(raw: string | null | undefined): string | null {
    const m = htmlText(raw).match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})[A-Za-z]*\.?,?\s+(\d{4})/);
    if (!m) return null;
    const month = MONTHS.indexOf(m[2].toLowerCase());
    return month < 0 ? null : `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** "₹ 1,119.50" / "₹25.00 Cr" → 1119.5 / 25; anything without a number → null. */
export function parseAmount(raw: string | null | undefined): number | null {
    const m = htmlText(raw).match(/-?[\d,]+(?:\.\d+)?/);
    if (!m) return null;
    const n = Number(m[0].replace(/,/g, ''));
    return Number.isFinite(n) ? n : null;
}

/** The `<tr><td>Label</td><td>Value</td></tr>` rows of every table on a page, label → cell HTML. */
export function keyValueRows(html: string): Map<string, string> {
    const rows = new Map<string, string>();
    for (const tr of html.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
        const cells = tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi);
        if (cells?.length === 2) {
            const label = htmlText(cells[0]);
            if (label && !rows.has(label)) rows.set(label, cells[1]);
        }
    }
    return rows;
}

/** First link target inside an HTML snippet. */
export function firstHref(htmlish: string | null | undefined): string | null {
    return htmlish?.match(/href="(https?:\/\/[^"]+)"/i)?.[1] ?? null;
}

/** Registrable domain ("ipostatus.kfintech.com" → "kfintech.com"), to match registrar links. */
export function baseDomain(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
        return new URL(url).hostname.split('.').slice(-2).join('.');
    } catch {
        return null;
    }
}
