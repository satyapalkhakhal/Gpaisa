-- Article type: 'news' for time-sensitive reporting (RBI decisions, IPO coverage, price
-- moves) is marked up as NewsArticle; 'article' (evergreen guides, reviews) stays Article.
-- Set per article in the admin. Apply with deploy/migrate.sh (or psql -f). Idempotent.

ALTER TABLE articles ADD COLUMN IF NOT EXISTS article_type text NOT NULL DEFAULT 'article';

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_article_type_check') THEN
    ALTER TABLE articles ADD CONSTRAINT articles_article_type_check CHECK (article_type IN ('article', 'news'));
  END IF;
END $$;
