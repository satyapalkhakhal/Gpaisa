#!/usr/bin/env bash
# Copies the Supabase database (public schema: tables, data, indexes, functions) into
# the VM's Postgres, then verifies row counts table-by-table. Safe to re-run — each run
# REPLACES everything in the VM database, so run it once for a trial and once more at
# cutover (after pausing admin edits).
#
# Usage (on the VM, from this directory):
#   SUPABASE_DB_URL='postgresql://postgres.<ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres' \
#     ./migrate-from-supabase.sh
# Get the URL from Supabase Dashboard → Connect → "Session pooler" (IPv4-reachable;
# the "Direct connection" host is IPv6-only and GCP VMs are IPv4 by default).
set -euo pipefail
cd "$(dirname "$0")"

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL (see header comment)}"
# deploy/.env is in Docker env-file format (values may contain spaces), so read the
# few values needed here instead of sourcing it.
env_get() { grep -E "^$1=" .env | tail -n 1 | cut -d= -f2- | sed -E "s/^'(.*)'$/\\1/; s/^\"(.*)\"$/\\1/"; }
POSTGRES_PASSWORD=$(env_get POSTGRES_PASSWORD)
TARGET_URL="postgresql://gpaisa:${POSTGRES_PASSWORD}@127.0.0.1:5432/gpaisa"

mkdir -p backups
# Postgres 17 client tools: pg_dump must be at least as new as the Supabase server.
PG=(docker run --rm -i --network host -e "PGOPTIONS=-c client_min_messages=warning"
    -v "$PWD/backups:/backups" -v "$PWD/../db/migrations:/migrations:ro" postgres:17-alpine)
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DUMP=/backups/supabase-$STAMP.dump

COUNT_SQL="SELECT table_name || ' ' || (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM public.%I', table_name), false, true, '')))[1]::text
FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1"

read -r -p "This REPLACES all data in the VM database with Supabase's. Type 'yes' to continue: " answer
[ "$answer" = "yes" ] || { echo "Aborted."; exit 1; }

docker compose up -d postgres
until docker compose exec -T postgres pg_isready -U gpaisa -d gpaisa >/dev/null 2>&1; do sleep 1; done

echo "1/6 Dumping Supabase public schema → backups/supabase-$STAMP.dump"
"${PG[@]}" pg_dump "$SUPABASE_DB_URL" --schema=public --no-owner --no-privileges -Fc -f "$DUMP"

echo "2/6 Resetting VM database"
"${PG[@]}" psql "$TARGET_URL" -v ON_ERROR_STOP=1 -q <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
-- Supabase keeps extensions in their own schema; some column defaults reference it.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
SQL

echo "3/6 Restoring (skipping row-level-security policies — only the app connects now)"
"${PG[@]}" sh -c "pg_restore -l '$DUMP' | grep -vE ' (POLICY|ROW SECURITY) | SCHEMA - public |COMMENT - SCHEMA public' > /backups/restore-$STAMP.list"
if ! "${PG[@]}" pg_restore --no-owner --no-privileges -L "/backups/restore-$STAMP.list" -d "$TARGET_URL" "$DUMP" 2> "backups/restore-$STAMP.log"; then
    echo "   ⚠️  pg_restore reported errors (full log: deploy/backups/restore-$STAMP.log):"
    grep -E '^pg_restore: error' "backups/restore-$STAMP.log" | head -20
    echo "   Errors on legacy tables the site doesn't use (products, users) are expected to be"
    echo "   harmless; the row-count check below is what matters."
fi

echo "4/6 Applying db/migrations (idempotent — adds any indexes missing in production)"
for f in ../db/migrations/*.sql; do
    "${PG[@]}" psql "$TARGET_URL" -v ON_ERROR_STOP=1 -q -f "/migrations/$(basename "$f")"
done

echo "5/6 Resetting ID sequences and refreshing planner stats"
"${PG[@]}" psql "$TARGET_URL" -v ON_ERROR_STOP=1 -q <<'SQL'
DO $$
DECLARE r record;
BEGIN
    FOR r IN
        SELECT c.table_name, c.column_name, pg_get_serial_sequence(format('public.%I', c.table_name), c.column_name) AS seq
        FROM information_schema.columns c
        JOIN information_schema.tables t ON t.table_name = c.table_name AND t.table_schema = c.table_schema
        WHERE c.table_schema = 'public' AND t.table_type = 'BASE TABLE'
    LOOP
        IF r.seq IS NOT NULL THEN
            EXECUTE format('SELECT setval(%L, COALESCE((SELECT max(%I) FROM public.%I), 0) + 1, false)', r.seq, r.column_name, r.table_name);
        END IF;
    END LOOP;
END $$;
ANALYZE;
SQL

echo "6/6 Verifying row counts (Supabase vs VM)"
"${PG[@]}" psql "$SUPABASE_DB_URL" -At -c "$COUNT_SQL" > "backups/counts-source-$STAMP.txt"
"${PG[@]}" psql "$TARGET_URL" -At -c "$COUNT_SQL" > "backups/counts-target-$STAMP.txt"
if diff "backups/counts-source-$STAMP.txt" "backups/counts-target-$STAMP.txt"; then
    column -t "backups/counts-target-$STAMP.txt"
    echo "✅ All tables match. Next: ./deploy.sh (rebuilds the app so prerendered pages use this data)."
else
    echo "❌ Row counts differ (< Supabase, > VM). Check deploy/backups/restore-$STAMP.log before cutover."
    exit 1
fi
