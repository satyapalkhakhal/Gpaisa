-- IPO content depth — financial statements, valuation inputs, peer comparison,
-- anchor investors, promoter holding, structured objects-of-issue, and contact
-- details. Closes the gap vs. reference IPO sites that show far more per-IPO
-- content than price band/GMP/subscription alone.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

-- ── contact details ──────────────────────────────────────────────────────
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE registrars ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE registrars ADD COLUMN IF NOT EXISTS email text;

-- ── ipos: structured fields that don't warrant their own table ────────────
-- reservation_percentages: {"qib": 50, "nii": 15, "retail": 35, "employee": 5}
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS reservation_percentages jsonb NOT NULL DEFAULT '{}';
-- objects_of_issue_breakdown: [{"purpose": "...", "amount": N}, ...] — amounts in ₹ Cr.
-- Supplements (not replaces) the existing free-text objects_of_issue field.
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS objects_of_issue_breakdown jsonb NOT NULL DEFAULT '[]';
-- peer_comparison: [{"name": "...", "eps": N, "pe_ratio": N, "ronw_percent": N, "nav": N, "income": N}, ...]
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS peer_comparison jsonb NOT NULL DEFAULT '[]';

ALTER TABLE ipos ADD COLUMN IF NOT EXISTS promoter_holding_pre_percent numeric;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS promoter_holding_post_percent numeric;

ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_bidding_date date;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_shares bigint;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_allocation_amount numeric;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_lock_in_50pct_date date;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_lock_in_remaining_date date;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS anchor_list_url text;

-- post_issue_shares_outstanding drives EPS/NAV/P-E computed at render time from the
-- latest ipo_financials row — stored as a raw input, not a precomputed ratio, so the
-- numbers can never drift out of sync with each other.
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS post_issue_shares_outstanding bigint;

-- ── ipo_financials (append-only per-period statements) ──────────────────
CREATE TABLE IF NOT EXISTS ipo_financials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    period_label text NOT NULL,
    period_end_date date,
    revenue numeric,
    expenses numeric,
    profit_after_tax numeric,
    total_assets numeric,
    ebitda numeric,
    net_worth numeric,
    total_debt numeric,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ipo_financials_ipo_id ON ipo_financials (ipo_id, period_end_date);
