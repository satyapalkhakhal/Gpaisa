-- Groww IPO feed sync (lib/growwIpoSync.ts) — remembers which Groww record an IPO
-- was matched to, so later runs don't depend on slug/company-name heuristics.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE ipos ADD COLUMN IF NOT EXISTS groww_search_id text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ipos_groww_search_id ON ipos (groww_search_id) WHERE groww_search_id IS NOT NULL;
