-- Hindi articles. Each article has a language; a Hindi article may point at the
-- English article it translates (translation_of), which drives the hreflang pair
-- /articles/<slug> <-> /hi/articles/<slug>. Slugs are unique per language (checked
-- in the admin API), so a translation can reuse its English article's slug.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE articles ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_language_check') THEN
    ALTER TABLE articles ADD CONSTRAINT articles_language_check CHECK (language IN ('en', 'hi'));
  END IF;
END $$;

ALTER TABLE articles ADD COLUMN IF NOT EXISTS translation_of uuid REFERENCES articles(id) ON DELETE SET NULL;

-- At most one translation per English article.
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_translation_of ON articles (translation_of) WHERE translation_of IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_language_published ON articles (language, status, published_at DESC);
