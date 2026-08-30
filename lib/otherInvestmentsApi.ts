// Public (anon-key) read API for NCD Issues, Rights Issues, and Buybacks.
// Mirrors lib/ipoApi.ts conventions: server-side ISR fetch caching, never throws.
import { Buyback, NcdIssue, RightsIssue } from './otherInvestmentsTypes';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function fetchRows(endpoint: string, tag?: string, revalidateSeconds: number = 300): Promise<any[]> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error(`[OTHER_INVESTMENTS_API] Cannot fetch "${tag || endpoint}" - missing env vars.`);
        return [];
    }
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
            next: { revalidate: revalidateSeconds },
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'unknown');
            console.error(`[OTHER_INVESTMENTS_API] ❌ ${tag || endpoint} failed: HTTP ${response.status} - ${errorText}`);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error(`[OTHER_INVESTMENTS_API] ❌ ${tag || endpoint} threw:`, error);
        return [];
    }
}

const SELECT_WITH_COMPANY = 'select=*,company:companies(*)';

// ── NCD Issues ─────────────────────────────────────────────────────────────

export async function fetchNcdIssues(limit: number = 50, revalidateSeconds: number = 300): Promise<NcdIssue[]> {
    return fetchRows(
        `ncd_issues?${SELECT_WITH_COMPANY}&publish_status=eq.published&order=open_date.desc.nullslast&limit=${limit}`,
        'fetchNcdIssues',
        revalidateSeconds
    );
}

export async function fetchNcdIssueBySlug(slug: string, revalidateSeconds: number = 300): Promise<NcdIssue | null> {
    const rows = await fetchRows(
        `ncd_issues?${SELECT_WITH_COMPANY},registrar:registrars(*)&slug=eq.${encodeURIComponent(slug)}&publish_status=eq.published`,
        `fetchNcdIssueBySlug(${slug})`,
        revalidateSeconds
    );
    return rows[0] ?? null;
}

export async function fetchAllPublishedNcdSlugs(revalidateSeconds: number = 86400): Promise<Pick<NcdIssue, 'slug' | 'updated_at'>[]> {
    return fetchRows(`ncd_issues?select=slug,updated_at&publish_status=eq.published`, 'fetchAllPublishedNcdSlugs', revalidateSeconds);
}

// ── Rights Issues ────────────────────────────────────────────────────────

export async function fetchRightsIssues(limit: number = 50, revalidateSeconds: number = 300): Promise<RightsIssue[]> {
    return fetchRows(
        `rights_issues?${SELECT_WITH_COMPANY}&publish_status=eq.published&order=record_date.desc.nullslast&limit=${limit}`,
        'fetchRightsIssues',
        revalidateSeconds
    );
}

export async function fetchRightsIssueBySlug(slug: string, revalidateSeconds: number = 300): Promise<RightsIssue | null> {
    const rows = await fetchRows(
        `rights_issues?${SELECT_WITH_COMPANY},registrar:registrars(*)&slug=eq.${encodeURIComponent(slug)}&publish_status=eq.published`,
        `fetchRightsIssueBySlug(${slug})`,
        revalidateSeconds
    );
    return rows[0] ?? null;
}

export async function fetchAllPublishedRightsIssueSlugs(revalidateSeconds: number = 86400): Promise<Pick<RightsIssue, 'slug' | 'updated_at'>[]> {
    return fetchRows(`rights_issues?select=slug,updated_at&publish_status=eq.published`, 'fetchAllPublishedRightsIssueSlugs', revalidateSeconds);
}

// ── Buybacks ─────────────────────────────────────────────────────────────

export async function fetchBuybacks(limit: number = 50, revalidateSeconds: number = 300): Promise<Buyback[]> {
    return fetchRows(
        `buybacks?${SELECT_WITH_COMPANY}&publish_status=eq.published&order=record_date.desc.nullslast&limit=${limit}`,
        'fetchBuybacks',
        revalidateSeconds
    );
}

export async function fetchBuybackBySlug(slug: string, revalidateSeconds: number = 300): Promise<Buyback | null> {
    const rows = await fetchRows(
        `buybacks?${SELECT_WITH_COMPANY},registrar:registrars(*)&slug=eq.${encodeURIComponent(slug)}&publish_status=eq.published`,
        `fetchBuybackBySlug(${slug})`,
        revalidateSeconds
    );
    return rows[0] ?? null;
}

export async function fetchAllPublishedBuybackSlugs(revalidateSeconds: number = 86400): Promise<Pick<Buyback, 'slug' | 'updated_at'>[]> {
    return fetchRows(`buybacks?select=slug,updated_at&publish_status=eq.published`, 'fetchAllPublishedBuybackSlugs', revalidateSeconds);
}
