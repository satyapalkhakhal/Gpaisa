-- Admin CMS fields for articles table
-- Run manually in Supabase Dashboard -> SQL Editor. Idempotent -- safe to re-run.

ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS focus_keyword text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- NOT NULL + DEFAULT on a new column backfills existing rows to 'published'
-- automatically (Postgres 11+ metadata-only default, no table rewrite).
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';

-- Guarded so re-running the script doesn't error on "constraint already exists".
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_status_check') THEN
    ALTER TABLE articles ADD CONSTRAINT articles_status_check CHECK (status IN ('draft', 'published'));
  END IF;
END $$;

-- Recommended indexes for the admin listing filters and public read path.
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
