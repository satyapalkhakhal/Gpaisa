# Executive summary — gpaisa.in indexing audit

**Date:** 2026-10-20 · **Scope:**
- Live site: 210 URLs crawled, 276 requests, 35 pages rendered in Chrome.
- Full repository review: Next.js 15.5.9 App Router on Vercel, Supabase content.
- Git history since 2026-01-02.
- Read-only look at the content database.

**Not available:** Google Search Console, which means this is a **technical audit, not a confirmed diagnosis of Google's indexing decisions.**

---

## Update 2026-10-21 — read this first

**Goal:** Google Discover, then Search. **Discover only shows pages that are already indexed in Search**, so Search indexing is the gate for both. Plan: `google-discover-readiness.md`.

**Search Console data** (`search-console-analysis.md`):
- Indexed = 1 for 81 days.
- **555 of 812** non-indexed URLs are *Crawled – currently not indexed* and **80** are *Discovered – currently not indexed*. Both are Google's own quality and priority decisions.
- The property-mismatch theory and Google IP blocking are both effectively ruled out.
- **The cause is Google declining to index the site's pages, not a technical block.** The fictitious IPO/NCD records, seed articles, overstated trust claims and the domain's history are the evidence-backed reasons.

**New regression after yesterday's move to the GCP VM.** Real Googlebot now gets title, canonical, robots and OG metadata in `<body>` on all 39 articles, category hubs and `/ipo`. The URL Inspection tool still sees it in `<head>`, so it hides the problem. One-line fix: `htmlLimitedBots: /.*/` in `next.config.mjs` (P0-3).

**Discover gaps on articles:**
- `max-image-preview:large` missing on 39/39 articles;
- no RSS feed;
- 6 lead images under 1200 px;
- inaccurate `dateModified`.

**Do now:**
1. P0-3 (metadata fix).
2. Check Manual actions and export the URL lists per reason.
3. Unpublish the 5 fictitious investment records.
4. Discover fixes D1–D4.
5. 410 the seed articles.
6. Correct the trust statements.

The 2026-10-20 summary below is kept as the baseline.

---

## Overall finding

**Nothing on the live site today technically prevents Google from crawling or indexing the pages:**
- robots.txt allows everything except `/api/` and `/admin/`;
- 0 sitemap URLs are noindex;
- all 137 indexable sitemap URLs are self-canonical on `https://www.gpaisa.in`;
- host variants 308-redirect correctly;
- made-up URLs return real 404s;
- every template's main content, title and canonical are in the server HTML;
- a Googlebot user-agent gets identical responses.

Git history shows **no site-wide noindex or `Disallow: /` at any time**.

So "only the homepage is indexed" most likely comes from a combination of three things:

1. **The host change on 2026-05-14** (`gpaisa.in` → `www.gpaisa.in`). If the Search Console property or sitemap submission is the old apex URL-prefix property, it **cannot** show www pages as indexed. *Hypothesis — 5-minute check.*
2. **Weak site-level quality and trust signals on a young (Jan 2026) finance domain:**
   - 5 of 6 IPO/NCD/rights/buyback pages are **fictitious sample data** with `example.com` documents, published and in the sitemap;
   - 13 placeholder articles (25–175 words) are still live;
   - sections switched topics repeatedly (sports, travel, tech, agriculture);
   - near-empty IPO/NCD hubs are linked from every page;
   - the stated data sources don't match the code;
   - nothing new has been published since 2026-07-19.

   *Confirmed problems; their weight in Google's decisions is unconfirmed.*
3. **URL churn** that reset signals: the host change, numeric-ID → slug migration, renamed article slugs with no 301, removed sections, noindex on/off flips.

## Most likely indexing blockers (ranked)

| # | Finding | Scope | Confidence |
|---|---|---|---|
| 1 | Possible Search Console property/sitemap mismatch after the apex → www move | site-wide (reporting) | Low until checked |
| 2 | Fictitious investment records + placeholder articles + thin hubs drag down site trust | site-wide (quality) | Medium |
| 3 | Gold/silver content and links load from `/api/*`, which robots.txt blocks for Googlebot | template (≈25 URLs) | High |
| 4 | Sitemap: 2 × 404 silver cities; 35 indexable content pages missing (30 bank calculators, 5 silver cities); `lastmod` = build time or a bulk-migration timestamp | site-wide sitemap signal | High |
| 5 | 14 internally linked URLs return 404 (renamed article slugs, non-existent FD-bank/RD/compound-interest calculators, silver cities) | page-specific | High |

## Strongest evidence

- `git 89af963` (2026-05-14) moved `metadataBase`, all canonicals, the sitemap and robots from `https://gpaisa.in` to `https://www.gpaisa.in`.
- Supabase rows: `drhp_url = https://example.com/nova-drhp.pdf`, `prospectus_url = https://example.com/orient-ncd-prospectus.pdf`, … all `publish_status = published`.
- `/gold-rate` gains 182 words and 16 city links only after JavaScript calls `/api/gold-calculator`, which is `Disallow`ed for Googlebot.
- `/silver-rate/delhi` and `/silver-rate/kerala` are in the sitemap and return 404, because silver routes exist only for cities the Angel One API lists.
- 32 articles share the sitemap lastmod `2026-07-12T18:04:21.832Z` — the time of migration `0001`, which added `updated_at DEFAULT now()`.

## What is in good shape

- **On-topic articles:** 39, median 2,760 words, no near-duplicates.
- **Core calculators:** 19, median 743 words, standard formulas, FAQ schema.
- **Technical basics:** canonicals, robots handling, 404/410 handling, and SSR are correct.
- **GoldRate24.in:** 301s to gpaisa.in with the path kept; it is not a live duplicate.

## Immediate actions (all small; full plan in `fix-roadmap.md`)

1. **Search Console:** add a Domain property (`gpaisa.in`) and submit `https://www.gpaisa.in/sitemap.xml` there. Run URL Inspection → *Test live URL* on 3–5 inner pages. Export the Page-indexing reasons to `seo-audit/gsc-exports/` and re-run the audit.
2. Set the 5 sample IPO/NCD/rights/buyback records to **draft**.
3. 301 the renamed article slugs; remove links to the non-existent calculators.
4. Make silver city routes and the sitemap use one owned city list.
5. Stop stamping sitemap `lastmod` with `new Date()`.

No fixes have been applied. Implementation waits for your approval of `fix-roadmap.md`.

## Deliverables in this folder

| File | Contents |
|---|---|
| `indexing-root-cause-report.md` | Confirmed vs suspected causes, scope, evidence, limitations, what Search Console data is needed |
| `content-quality-report.md` | Thin, placeholder, duplicate and outdated candidates; what to keep; per-template improvements |
| `internal-linking-report.md` | Broken links with source files, weak discovery paths, client-only links, recommended structure |
| `fix-roadmap.md` | P0–P3 fixes with location, risk, tests and Search Console verification |
| `search-console-analysis.md` | *(2026-10-21)* Interpretation of the Page-indexing export, revised diagnosis, what to stop doing, exports still needed |
| `google-discover-readiness.md` | *(2026-10-21)* Discover scorecard, fixes D0–D6, content approach, timeline |
| `issues.csv` | 114 issue rows: 101 from the automated crawl of 2026-10-21 + 13 from manual review (`source` column) |
| `url-inventory.csv` | 210 URLs × 43 attributes (status, canonical, robots, words, inlinks, depth, …) |
| `audit-config.json` | Configuration used for this run |
| `README.md` | How to run, re-run and compare audits |
