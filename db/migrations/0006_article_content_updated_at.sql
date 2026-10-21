-- Real "last modified" date for articles. updated_at changes on every row write
-- (and was bulk-set when 0001 added it), so it can't be used as the content's
-- modification date. content_updated_at is set by the admin API only when the
-- title, excerpt or body change, and feeds dateModified, OG modified_time,
-- the sitemap <lastmod> and the visible "Updated on" line.
-- Apply with deploy/migrate.sh (or psql -f). Idempotent -- safe to re-run.

ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_updated_at timestamptz;

-- Existing articles: true edit history is unknown, so fall back to the publish date.
UPDATE articles SET content_updated_at = published_at WHERE content_updated_at IS NULL;
