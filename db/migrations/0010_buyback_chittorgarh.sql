-- Buyback sync (lib/investorgainIssuesSync.ts, source: Chittorgarh) — remembers which
-- Chittorgarh buyback each record was matched to.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE buybacks ADD COLUMN IF NOT EXISTS chittorgarh_id int;
CREATE UNIQUE INDEX IF NOT EXISTS idx_buybacks_chittorgarh_id ON buybacks (chittorgarh_id) WHERE chittorgarh_id IS NOT NULL;
