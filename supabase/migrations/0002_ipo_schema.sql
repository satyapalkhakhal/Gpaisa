-- IPO Intelligence Platform — Phase 1 schema.
-- Run manually in Supabase Dashboard -> SQL Editor. Idempotent -- safe to re-run.

-- ── companies ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    logo_url text,
    sector text,
    industry text,
    about text,
    website text,
    incorporated_year int,
    registered_office text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);

-- ── registrars ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrars (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text NOT NULL,
    website text,
    allotment_status_check_url text,
    logo_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrars_slug ON registrars (slug);

-- ── ipos ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ipos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES companies (id) ON DELETE RESTRICT,
    slug text NOT NULL,
    ipo_type text NOT NULL,
    status text NOT NULL,
    open_date date,
    close_date date,
    allotment_date date,
    refund_date date,
    demat_date date,
    listing_date date,
    price_band_min numeric,
    price_band_max numeric,
    face_value numeric,
    lot_size int,
    fresh_issue_amount numeric,
    ofs_amount numeric,
    total_issue_size numeric,
    exchange text,
    registrar_id uuid REFERENCES registrars (id) ON DELETE SET NULL,
    lead_managers text[] NOT NULL DEFAULT '{}',
    objects_of_issue text,
    drhp_url text,
    rhp_url text,
    is_featured boolean NOT NULL DEFAULT false,
    meta_title text,
    meta_description text,
    publish_status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipos_ipo_type_check') THEN
    ALTER TABLE ipos ADD CONSTRAINT ipos_ipo_type_check CHECK (ipo_type IN ('mainboard', 'sme'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipos_status_check') THEN
    ALTER TABLE ipos ADD CONSTRAINT ipos_status_check
      CHECK (status IN ('drhp', 'rhp', 'announced', 'upcoming', 'open', 'closed', 'allotment', 'listed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipos_publish_status_check') THEN
    ALTER TABLE ipos ADD CONSTRAINT ipos_publish_status_check CHECK (publish_status IN ('draft', 'published'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipos_price_band_check') THEN
    ALTER TABLE ipos ADD CONSTRAINT ipos_price_band_check
      CHECK (price_band_min IS NULL OR price_band_max IS NULL OR price_band_min <= price_band_max);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ipos_slug ON ipos (slug);
CREATE INDEX IF NOT EXISTS idx_ipos_status ON ipos (status);
CREATE INDEX IF NOT EXISTS idx_ipos_publish_status ON ipos (publish_status);
CREATE INDEX IF NOT EXISTS idx_ipos_ipo_type ON ipos (ipo_type);
CREATE INDEX IF NOT EXISTS idx_ipos_company_id ON ipos (company_id);

-- ── ipo_gmp_updates (append-only log; history comes from querying this) ────
CREATE TABLE IF NOT EXISTS ipo_gmp_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    gmp_value numeric NOT NULL,
    gmp_percentage numeric,
    estimated_listing_price numeric,
    kostak_rate numeric,
    subject_to_sauda numeric,
    source text NOT NULL,
    direction text,
    notes text,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_gmp_updates_direction_check') THEN
    ALTER TABLE ipo_gmp_updates ADD CONSTRAINT ipo_gmp_updates_direction_check
      CHECK (direction IS NULL OR direction IN ('up', 'down', 'flat'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ipo_gmp_updates_ipo_id ON ipo_gmp_updates (ipo_id, recorded_at DESC);

-- ── ipo_subscription_updates ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ipo_subscription_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    day_number int NOT NULL,
    category text NOT NULL,
    subscription_times numeric NOT NULL,
    shares_offered bigint,
    shares_bid bigint,
    data_granularity text NOT NULL DEFAULT 'day_end',
    as_of timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_subscription_updates_category_check') THEN
    ALTER TABLE ipo_subscription_updates ADD CONSTRAINT ipo_subscription_updates_category_check
      CHECK (category IN ('retail', 'nii', 'qib', 'employee', 'shareholder', 'overall'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_subscription_updates_granularity_check') THEN
    ALTER TABLE ipo_subscription_updates ADD CONSTRAINT ipo_subscription_updates_granularity_check
      CHECK (data_granularity IN ('day_end', 'intraday'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ipo_subscription_updates_ipo_id ON ipo_subscription_updates (ipo_id, day_number, category);

-- ── ipo_allotment_info (1:1 with ipos) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS ipo_allotment_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    registrar_id uuid REFERENCES registrars (id) ON DELETE SET NULL,
    basis_of_allotment_url text,
    allotment_date date,
    refund_date date,
    demat_credit_date date,
    listing_date date,
    status text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ipo_allotment_info_ipo_id ON ipo_allotment_info (ipo_id);

-- ── ipo_reviews (1:1 with ipos; structured editorial analysis) ──────────────
CREATE TABLE IF NOT EXISTS ipo_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    business_quality_score int,
    financial_performance_score int,
    growth_score int,
    valuation_score int,
    industry_outlook text,
    management_notes text,
    strengths text[] NOT NULL DEFAULT '{}',
    risks text[] NOT NULL DEFAULT '{}',
    competitive_position text,
    overall_view text,
    overall_score numeric,
    recommendation text,
    detailed_analysis_html text,
    author text,
    publish_status text NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_reviews_recommendation_check') THEN
    ALTER TABLE ipo_reviews ADD CONSTRAINT ipo_reviews_recommendation_check
      CHECK (recommendation IS NULL OR recommendation IN ('subscribe', 'subscribe_long_term', 'neutral', 'avoid'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_reviews_publish_status_check') THEN
    ALTER TABLE ipo_reviews ADD CONSTRAINT ipo_reviews_publish_status_check CHECK (publish_status IN ('draft', 'published'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ipo_reviews_ipo_id ON ipo_reviews (ipo_id);

-- ── ipo_documents ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ipo_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id uuid NOT NULL REFERENCES ipos (id) ON DELETE CASCADE,
    doc_type text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ipo_documents_doc_type_check') THEN
    ALTER TABLE ipo_documents ADD CONSTRAINT ipo_documents_doc_type_check
      CHECK (doc_type IN ('drhp', 'rhp', 'anchor_investors', 'other'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ipo_documents_ipo_id ON ipo_documents (ipo_id);

-- ── articles: optional link to a specific IPO for "related news" ───────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ipo_id uuid REFERENCES ipos (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_articles_ipo_id ON articles (ipo_id);
