// Public read API for NCD Issues, Rights Issues, and Buybacks (server-only — reads Postgres directly).
// Mirrors lib/ipoApi.ts conventions: cached for `revalidateSeconds`, never throws.
import { cachedRows } from './db';
import { Buyback, NcdIssue, RightsIssue } from './otherInvestmentsTypes';

type Table = 'ncd_issues' | 'rights_issues' | 'buybacks';

// `company` (and optionally `registrar`) embedded as nested objects, null when unset.
function selectWithCompany(table: Table, withRegistrar = false): string {
    const registrar = withRegistrar
        ? `, (SELECT to_json(r) FROM registrars r WHERE r.id = t.registrar_id) AS registrar`
        : '';
    return `SELECT t.*, (SELECT to_json(c) FROM companies c WHERE c.id = t.company_id) AS company${registrar} FROM ${table} t`;
}

async function fetchList<T>(table: Table, orderColumn: string, limit: number, tag: string, revalidateSeconds: number): Promise<T[]> {
    return cachedRows<T>(
        `${selectWithCompany(table)} WHERE t.publish_status = 'published' ORDER BY t.${orderColumn} DESC NULLS LAST LIMIT $1`,
        [limit],
        revalidateSeconds,
        tag
    );
}

async function fetchBySlug<T>(table: Table, slug: string, tag: string, revalidateSeconds: number): Promise<T | null> {
    const rows = await cachedRows<T>(
        `${selectWithCompany(table, true)} WHERE t.slug = $1 AND t.publish_status = 'published'`,
        [slug],
        revalidateSeconds,
        tag
    );
    return rows[0] ?? null;
}

async function fetchSlugs<T>(table: Table, tag: string, revalidateSeconds: number): Promise<T[]> {
    return cachedRows<T>(`SELECT slug, updated_at FROM ${table} WHERE publish_status = 'published'`, [], revalidateSeconds, tag);
}

// ── Indexing gate ─────────────────────────────────────────────────────────
// Synced NCD / rights / buyback records are data rows with a one-line synced summary,
// i.e. the same facts other sites already publish. A page is indexed (and listed in the
// sitemap) only once an editor has written a real explanation in its free-text field.

export const MIN_EDITORIAL_CHARS = 300;

const EDITORIAL_COLUMN: Record<Table, string> = {
    ncd_issues: 'objects_of_issue',
    rights_issues: 'objects_of_issue',
    buybacks: 'notes',
};

export function hasEditorialText(text: string | null | undefined): boolean {
    return (text?.trim().length ?? 0) >= MIN_EDITORIAL_CHARS;
}

export async function fetchIndexableSlugs(table: Table, revalidateSeconds: number = 86400): Promise<{ slug: string; updated_at: string }[]> {
    return cachedRows(
        `SELECT slug, updated_at FROM ${table}
         WHERE publish_status = 'published' AND char_length(btrim(coalesce(${EDITORIAL_COLUMN[table]}, ''))) >= ${MIN_EDITORIAL_CHARS}`,
        [],
        revalidateSeconds,
        `fetchIndexableSlugs(${table})`
    );
}

// ── NCD Issues ─────────────────────────────────────────────────────────────

export async function fetchNcdIssues(limit: number = 50, revalidateSeconds: number = 300): Promise<NcdIssue[]> {
    return fetchList('ncd_issues', 'open_date', limit, 'fetchNcdIssues', revalidateSeconds);
}

export async function fetchNcdIssueBySlug(slug: string, revalidateSeconds: number = 300): Promise<NcdIssue | null> {
    return fetchBySlug('ncd_issues', slug, `fetchNcdIssueBySlug(${slug})`, revalidateSeconds);
}

export async function fetchAllPublishedNcdSlugs(revalidateSeconds: number = 86400): Promise<Pick<NcdIssue, 'slug' | 'updated_at'>[]> {
    return fetchSlugs('ncd_issues', 'fetchAllPublishedNcdSlugs', revalidateSeconds);
}

// ── Rights Issues ────────────────────────────────────────────────────────

export async function fetchRightsIssues(limit: number = 50, revalidateSeconds: number = 300): Promise<RightsIssue[]> {
    return fetchList('rights_issues', 'record_date', limit, 'fetchRightsIssues', revalidateSeconds);
}

export async function fetchRightsIssueBySlug(slug: string, revalidateSeconds: number = 300): Promise<RightsIssue | null> {
    return fetchBySlug('rights_issues', slug, `fetchRightsIssueBySlug(${slug})`, revalidateSeconds);
}

export async function fetchAllPublishedRightsIssueSlugs(revalidateSeconds: number = 86400): Promise<Pick<RightsIssue, 'slug' | 'updated_at'>[]> {
    return fetchSlugs('rights_issues', 'fetchAllPublishedRightsIssueSlugs', revalidateSeconds);
}

// ── Buybacks ─────────────────────────────────────────────────────────────

export async function fetchBuybacks(limit: number = 50, revalidateSeconds: number = 300): Promise<Buyback[]> {
    return fetchList('buybacks', 'record_date', limit, 'fetchBuybacks', revalidateSeconds);
}

export async function fetchBuybackBySlug(slug: string, revalidateSeconds: number = 300): Promise<Buyback | null> {
    return fetchBySlug('buybacks', slug, `fetchBuybackBySlug(${slug})`, revalidateSeconds);
}

export async function fetchAllPublishedBuybackSlugs(revalidateSeconds: number = 86400): Promise<Pick<Buyback, 'slug' | 'updated_at'>[]> {
    return fetchSlugs('buybacks', 'fetchAllPublishedBuybackSlugs', revalidateSeconds);
}
