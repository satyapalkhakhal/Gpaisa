-- One-off data fix (NOT a migration — run once, by hand).
-- Unpublishes the five sample IPO / NCD / rights-issue / buyback records created on
-- 2026-08-30. They contain invented companies and figures, with offer documents
-- pointing at https://example.com/…. As drafts, their pages become noindex and drop out
-- of the sitemap through the existing publish_status checks. Rows are kept, not deleted.
--
-- Run on the VM, from deploy/ (take a backup first with ./backup.sh):
--   docker compose exec -T postgres psql -U gpaisa -d gpaisa -v ON_ERROR_STOP=1 \
--     < ../db/oneoff/2026-10-21-unpublish-sample-investment-records.sql
--
-- priority-jewels-ipo is deliberately excluded: it has no placeholder links. Verify it
-- against the exchange filings / RHP separately before deciding whether to keep it.

BEGIN;

-- Before: what will change
SELECT 'ipos' AS tbl, slug, publish_status FROM ipos WHERE slug IN ('nova-industries-ipo', 'bluepeak-textiles-ipo')
UNION ALL SELECT 'ncd_issues', slug, publish_status FROM ncd_issues WHERE slug = 'orient-finance-corp-ncd'
UNION ALL SELECT 'rights_issues', slug, publish_status FROM rights_issues WHERE slug = 'marigold-steels-rights-issue'
UNION ALL SELECT 'buybacks', slug, publish_status FROM buybacks WHERE slug = 'crestview-software-buyback';

UPDATE ipos          SET publish_status = 'draft', updated_at = now() WHERE slug IN ('nova-industries-ipo', 'bluepeak-textiles-ipo');
UPDATE ncd_issues    SET publish_status = 'draft', updated_at = now() WHERE slug = 'orient-finance-corp-ncd';
UPDATE rights_issues SET publish_status = 'draft', updated_at = now() WHERE slug = 'marigold-steels-rights-issue';
UPDATE buybacks      SET publish_status = 'draft', updated_at = now() WHERE slug = 'crestview-software-buyback';

-- After: anything still published that links to a placeholder host
SELECT 'still-published placeholder' AS check, slug FROM ipos
 WHERE publish_status = 'published' AND (coalesce(drhp_url, '') ILIKE '%example.com%' OR coalesce(rhp_url, '') ILIKE '%example.com%');

COMMIT;
