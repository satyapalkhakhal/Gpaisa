-- IPO Listing Performance — actual outcomes vs. price band and GMP estimates.
-- Run manually in Supabase Dashboard -> SQL Editor. Idempotent -- safe to re-run.

ALTER TABLE ipos ADD COLUMN IF NOT EXISTS listing_price numeric;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS listing_day_close_price numeric;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS current_market_price numeric;
ALTER TABLE ipos ADD COLUMN IF NOT EXISTS current_price_updated_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_ipos_listing_price ON ipos (listing_price) WHERE listing_price IS NOT NULL;
