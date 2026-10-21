-- NCD / rights issue sync (lib/investorgainIssuesSync.ts) — remembers which Investorgain
-- issue each record was matched to, so later runs don't depend on name/date heuristics.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE ncd_issues ADD COLUMN IF NOT EXISTS investorgain_id int;
CREATE UNIQUE INDEX IF NOT EXISTS idx_ncd_issues_investorgain_id ON ncd_issues (investorgain_id) WHERE investorgain_id IS NOT NULL;

ALTER TABLE rights_issues ADD COLUMN IF NOT EXISTS investorgain_id int;
CREATE UNIQUE INDEX IF NOT EXISTS idx_rights_issues_investorgain_id ON rights_issues (investorgain_id) WHERE investorgain_id IS NOT NULL;
