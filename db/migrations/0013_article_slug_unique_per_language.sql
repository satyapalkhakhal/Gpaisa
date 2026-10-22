-- Slugs are unique per language, not globally: a Hindi translation reuses its English
-- article's slug (/articles/x <-> /hi/articles/x, see 0011). Databases imported from the
-- old Supabase project still carry a global UNIQUE (slug) constraint that blocks this, so
-- drop any single-column unique constraint/index on articles.slug and enforce
-- (language, slug) instead. Idempotent -- safe to re-run.

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attname = 'slug'
    WHERE con.conrelid = 'articles'::regclass AND con.contype = 'u' AND con.conkey = ARRAY[att.attnum]
  LOOP
    EXECUTE format('ALTER TABLE articles DROP CONSTRAINT %I', r.conname);
  END LOOP;

  FOR r IN
    SELECT idx.relname
    FROM pg_index ix
    JOIN pg_class idx ON idx.oid = ix.indexrelid
    JOIN pg_attribute att ON att.attrelid = ix.indrelid AND att.attname = 'slug'
    WHERE ix.indrelid = 'articles'::regclass AND ix.indisunique AND NOT ix.indisprimary
      AND ix.indnatts = 1 AND ix.indkey[0] = att.attnum
  LOOP
    EXECUTE format('DROP INDEX %I', r.relname);
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_language_slug ON articles (language, slug);
