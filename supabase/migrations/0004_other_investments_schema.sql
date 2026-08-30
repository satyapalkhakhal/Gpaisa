-- Other Investments — NCD Issues, Rights Issues, Buybacks.
-- Lighter-weight than the IPO schema by design: current-snapshot fields instead of
-- append-only history logs (no GMP-style time series here) since these are secondary
-- to the core IPO product. Run manually in Supabase Dashboard -> SQL Editor. Idempotent.

-- ── ncd_issues ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ncd_issues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES companies (id) ON DELETE RESTRICT,
    slug text NOT NULL,
    status text NOT NULL,
    open_date date,
    close_date date,
    allotment_date date,
    listing_date date,
    issue_size numeric,
    base_issue_size numeric,
    shelf_limit numeric,
    credit_rating text,
    rating_agency text,
    secured boolean NOT NULL DEFAULT true,
    -- Repeatable tenure/coupon options for the issue — structured but light enough
    -- not to need its own table+admin sub-panel: [{name, tenure_months, coupon_rate,
    -- frequency, min_investment}, ...]
    series jsonb NOT NULL DEFAULT '[]',
    registrar_id uuid REFERENCES registrars (id) ON DELETE SET NULL,
    lead_managers text[] NOT NULL DEFAULT '{}',
    objects_of_issue text,
    prospectus_url text,
    subscription_times_overall numeric,
    subscription_updated_at timestamptz,
    is_featured boolean NOT NULL DEFAULT false,
    meta_title text,
    meta_description text,
    publish_status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ncd_issues_status_check') THEN
    ALTER TABLE ncd_issues ADD CONSTRAINT ncd_issues_status_check
      CHECK (status IN ('announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ncd_issues_publish_status_check') THEN
    ALTER TABLE ncd_issues ADD CONSTRAINT ncd_issues_publish_status_check CHECK (publish_status IN ('draft', 'published'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ncd_issues_slug ON ncd_issues (slug);
CREATE INDEX IF NOT EXISTS idx_ncd_issues_status ON ncd_issues (status);
CREATE INDEX IF NOT EXISTS idx_ncd_issues_publish_status ON ncd_issues (publish_status);

-- ── rights_issues ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rights_issues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES companies (id) ON DELETE RESTRICT,
    slug text NOT NULL,
    status text NOT NULL,
    record_date date,
    re_trading_start date,
    re_trading_end date,
    application_start date,
    application_end date,
    allotment_date date,
    listing_date date,
    rights_ratio text,
    issue_price numeric,
    face_value numeric,
    issue_size numeric,
    -- Rights Entitlement (RE) trading price — the closest analog to GMP for this
    -- product, but tracked as a current snapshot rather than a full history log.
    re_price numeric,
    re_price_updated_at timestamptz,
    registrar_id uuid REFERENCES registrars (id) ON DELETE SET NULL,
    objects_of_issue text,
    letter_of_offer_url text,
    is_featured boolean NOT NULL DEFAULT false,
    meta_title text,
    meta_description text,
    publish_status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rights_issues_status_check') THEN
    ALTER TABLE rights_issues ADD CONSTRAINT rights_issues_status_check
      CHECK (status IN ('announced', 'record_date', 're_trading', 'open', 'closed', 'allotment', 'listed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rights_issues_publish_status_check') THEN
    ALTER TABLE rights_issues ADD CONSTRAINT rights_issues_publish_status_check CHECK (publish_status IN ('draft', 'published'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_rights_issues_slug ON rights_issues (slug);
CREATE INDEX IF NOT EXISTS idx_rights_issues_status ON rights_issues (status);
CREATE INDEX IF NOT EXISTS idx_rights_issues_publish_status ON rights_issues (publish_status);

-- ── buybacks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buybacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES companies (id) ON DELETE RESTRICT,
    slug text NOT NULL,
    status text NOT NULL,
    method text NOT NULL,
    buyback_price numeric,
    buyback_price_max numeric,
    record_date date,
    tender_open_date date,
    tender_close_date date,
    buyback_size numeric,
    acceptance_ratio text,
    registrar_id uuid REFERENCES registrars (id) ON DELETE SET NULL,
    notes text,
    letter_of_offer_url text,
    is_featured boolean NOT NULL DEFAULT false,
    meta_title text,
    meta_description text,
    publish_status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buybacks_status_check') THEN
    ALTER TABLE buybacks ADD CONSTRAINT buybacks_status_check
      CHECK (status IN ('announced', 'record_date', 'open', 'closed', 'completed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buybacks_method_check') THEN
    ALTER TABLE buybacks ADD CONSTRAINT buybacks_method_check CHECK (method IN ('tender', 'open_market'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buybacks_publish_status_check') THEN
    ALTER TABLE buybacks ADD CONSTRAINT buybacks_publish_status_check CHECK (publish_status IN ('draft', 'published'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_buybacks_slug ON buybacks (slug);
CREATE INDEX IF NOT EXISTS idx_buybacks_status ON buybacks (status);
CREATE INDEX IF NOT EXISTS idx_buybacks_publish_status ON buybacks (publish_status);
