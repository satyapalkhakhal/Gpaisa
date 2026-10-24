// Server-only Postgres access. Never import this into a client component or
// middleware (edge runtime) — it holds the database connection.
//
// Replaces the old Supabase REST (PostgREST) layer. Every query's rows are
// serialized by Postgres itself via json_agg — exactly how PostgREST built its
// responses — so callers see identical shapes: numerics as numbers, `date` as
// 'YYYY-MM-DD', timestamptz as ISO strings, jsonb/arrays as JSON.
import { Pool } from 'pg';
import { revalidateTag, unstable_cache } from 'next/cache';

declare global {
    // Survives Next.js dev hot-reloads so we don't leak a pool per reload.
    // eslint-disable-next-line no-var
    var __gpaisaPgPool: Pool | undefined;
}

function getPool(): Pool {
    if (!globalThis.__gpaisaPgPool) {
        if (!process.env.DATABASE_URL) {
            throw new Error('[DB] Missing DATABASE_URL');
        }
        // TLS is configured in the URL itself (e.g. ?sslmode=verify-full&sslrootcert=...).
        // On Cloud Run, use the Cloud SQL unix socket instead, which needs no TLS:
        //   postgresql://USER:PASS@/DB?host=/cloudsql/PROJECT:REGION:INSTANCE
        globalThis.__gpaisaPgPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            // Small per-instance pool: Cloud Run scales out by instances, and Cloud SQL's
            // connection limit is shared across all of them.
            max: Number(process.env.DATABASE_POOL_MAX || 5),
            idleTimeoutMillis: 30_000,
        });
        globalThis.__gpaisaPgPool.on('error', (err) => console.error('[DB] Idle client error:', err));
    }
    return globalThis.__gpaisaPgPool;
}

/**
 * Run a statement (SELECT, or INSERT/UPDATE/DELETE ... RETURNING) and get its rows
 * as plain JSON objects. Throws on error.
 */
export async function queryRows<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    const { rows } = await getPool().query(
        `WITH q AS (${sql}) SELECT coalesce(json_agg(q), '[]'::json) AS rows FROM q`,
        params
    );
    return rows[0].rows;
}

/**
 * Public read path: like queryRows, but cached in the Next.js data cache for
 * `revalidateSeconds` (what `fetch(..., { next: { revalidate } })` used to give us),
 * and never throws — logs and degrades to [] so a DB blip can't take a page down.
 */
export async function cachedRows<T = any>(sql: string, params: unknown[], revalidateSeconds: number, tag: string): Promise<T[]> {
    try {
        return await unstable_cache(
            () => queryRows<T>(sql, params),
            ['db', sql, JSON.stringify(params)],
            { revalidate: revalidateSeconds, tags: ['db'] }
        )();
    } catch (error) {
        console.error(`[DB] ❌ ${tag} failed:`, error);
        return [];
    }
}

// ── Generic row writes ──────────────────────────────────────────────────────
// Values go in as one JSON param and are converted per column type by
// json_populate_record (as PostgREST did), so text[] and jsonb columns both
// accept plain JS arrays/objects without per-column casting.

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/;

function columnList(data: Record<string, unknown>): string {
    const cols = Object.keys(data).filter((k) => data[k] !== undefined);
    for (const c of cols) {
        if (!IDENTIFIER.test(c)) throw new Error(`[DB] Invalid column name: ${c}`);
    }
    if (!cols.length) throw new Error('[DB] No columns to write');
    return cols.map((c) => `"${c}"`).join(', ');
}

/**
 * After any row write, drop the cached public reads (cachedRows, tag 'db') so pages show the
 * change on their next render instead of after their cache TTL. Outside a request (scripts)
 * revalidateTag throws; there is no cache to clear then.
 */
function invalidatePublicCache() {
    try { revalidateTag('db'); } catch { /* not in a Next.js request */ }
}

export async function insertRow<T = any>(table: string, data: Record<string, unknown>): Promise<T> {
    const cols = columnList(data);
    const [row] = await queryRows<T>(
        `INSERT INTO ${table} (${cols}) SELECT ${cols} FROM json_populate_record(null::${table}, $1::json) RETURNING *`,
        [JSON.stringify(data)]
    );
    invalidatePublicCache();
    return row;
}

/** Updates the row with this id; returns [] when no row matched. */
export async function updateRowById<T = any>(table: string, id: string, data: Record<string, unknown>): Promise<T[]> {
    const cols = columnList(data);
    const rows = await queryRows<T>(
        `UPDATE ${table} SET (${cols}) = (SELECT ${cols} FROM json_populate_record(null::${table}, $1::json)) WHERE id = $2 RETURNING *`,
        [JSON.stringify(data), id]
    );
    invalidatePublicCache();
    return rows;
}

export async function deleteRowById(table: string, id: string): Promise<void> {
    await getPool().query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    invalidatePublicCache();
}

/** Lightweight connectivity check for /api/health. */
export async function pingDb(): Promise<void> {
    await getPool().query('SELECT 1');
}
