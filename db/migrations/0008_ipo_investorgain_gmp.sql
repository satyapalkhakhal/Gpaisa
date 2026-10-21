-- Investorgain GMP sync (lib/investorgainGmpSync.ts) — remembers which Investorgain IPO
-- an IPO was matched to, so later runs don't depend on name/date heuristics.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE ipos ADD COLUMN IF NOT EXISTS investorgain_id int;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ipos_investorgain_id ON ipos (investorgain_id) WHERE investorgain_id IS NOT NULL;
