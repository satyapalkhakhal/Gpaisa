# Fix roadmap — gpaisa.in

**Status: proposal only. No code, content, robots, canonical or redirect changes have been made.** Implementation starts only after you approve this plan.

Effort scale: **S** < 2 h · **M** ½–2 days · **L** > 2 days. Fixing these items improves crawlability and quality signals; it does **not** guarantee indexing.

---

## Implementation status — batch 3 (2026-10-22)

Done in the working tree; verified on a production build against a test database.

| Item | Change |
|---|---|
| **P1-9** | `isIpoIndexable()` / `fetchIndexableIpoSlugs()` (lib/ipoApi.ts): an IPO page is indexed only with a price band, open/close dates and real content (financials, published review, subscription data or objects of issue). NCD/rights/buyback pages are indexed only with ≥300 characters of editorial text (`objects_of_issue` / `notes`, lib/otherInvestmentsApi.ts). Thin pages stay live, noindex, out of the sitemap. |
| **P1-4** | FD page: removed 6 links to non-existent bank FD calculators; RD → SCSS calculator. Simple-interest and mutual-fund pages: Compound Interest → CAGR calculator. "Explore More Tools" (SIP, EMI) → /calculator; "Learn More About PPF" → the PPF vs ELSS vs tax-saving FD article. |
| **P1-3** | 308 redirects for 2 renamed article slugs (next.config.mjs). Two more old slugs (`gold-falling-silver-slippingsmart-investors-are-doing-this-in-2026`, `gold-rate-buy-or-wait-2026`) have no certain successor: fix the links inside the gold-vs-silver April article in /admin. |
| **P1-7** | Unknown `/articles/<numeric id>` now returns 404 instead of a 301 to /news. |
| **P1-2** | lib/silverCities.ts: owned list of 18 silver cities and symbols, used by the route, /api/silver/cities, the hub, the HTML sitemap and sitemap.xml. Only the 8 cities with their own content are indexable and in the sitemap; Delhi/Kerala (no price symbol) are out of the sitemap. |
| **P1-5** | Sitemap `lastmod`: calculators and static guides use fixed content dates (bump when edited); /news, category hubs and /credit-cards use their newest article; rate pages keep the current date. |

**Still open:** P1-6 (server-render gold/silver data), P1-8 (navigation — needs your decision), the two price-source inconsistencies, D3 (6 small lead images), D6 (author page, NewsArticle), Hindi silver pages.

## Re-review 2026-10-22

- **Confirmed live:** P0-3/D0, D1, D2, D4 (partial), D5, P2-1, P2-2. The audit resolved 165 issue occurrences.
- **Still open:** P1-1. The 5 sample records are still published.

### P1-9 · Index gate for auto-synced IPO / NCD / rights / buyback pages — **new, do next**
- **Root cause:** the Groww/Investorgain/Chittorgarh syncs (`2dff101`, `1298b25`, `f6f3bfa`) auto-publish every complete record. The detail templates mark every published record `index` and list it in the sitemap.
- **Affected:** 114 URLs.
  - 81 `/ipo/*`: median 212 words; 13 are 94-word "TBA" shells, 0.85–0.89 similar.
  - 33 `/ncd|rights-issue|buyback/*`: median 46 words.
- **Change:** add an `isIndexableIssue()` helper, used in both `generateMetadata` (`robots`) and `app/sitemap.ts`, the same pattern as the category-hub noindex.
  - IPO: require a price band, open/close dates, and at least one substantive block (financials, objects of issue, or a review).
  - NCD/rights/buyback: require page-specific explanatory content.
  - Everything else stays live for users with `noindex, follow`.
- **Risk:** low. Pages remain reachable, and indexing is restored automatically once the data fills in.
- **Test:** re-run the audit. `CONTENT-THIN` and `CONTENT-NEAR-DUP` on these templates should appear only on noindex pages, and the sitemap should drop by ~100 URLs.
- **Verify in GSC:** these URLs move to *Excluded by 'noindex' tag*, and the share of *Crawled – currently not indexed* should fall over the following weeks.
- **Effort:** S.

### P2-10 · Accurate provenance on synced data
- Replace `DataSourceBadge kind="official"` on values imported from Groww/Investorgain with an accurate label, or verify them against the RHP/exchange filing.
- Review the terms of use for the three data sources (MAN-15, MAN-16).

## Implementation status (2026-10-21)

**Done in the working tree — not committed, not deployed:**

| Item | Change |
|---|---|
| **P0-3 / D0** | `htmlLimitedBots: /.*/` in `next.config.mjs` |
| **D1** | `lib/seo.ts` `INDEXABLE_ROBOTS` (with `max-image-preview:large`) as the root-layout default, and used by articles, category hubs, glossary hub and terms, gold and silver city pages, the gold-affordability index, the EMI calculator and the HTML sitemap |
| **D2** | `app/feed.xml/route.ts` (RSS 2.0, latest 50 on-topic articles, `media:content` lead images) + `<link rel="alternate" type="application/rss+xml">` in `app/layout.tsx`; `fetchFeedArticles()` in `lib/articlesApi.ts` |
| **D4 (partial)** | Article `og:image` no longer declares a hard-coded 1200×630. Multi-ratio JSON-LD images are not done yet. |

**Verified** with a production build against a temporary local Postgres (repo migrations + synthetic articles):
- Googlebot, Chrome and Google-InspectionTool UAs all get title, canonical and robots in `<head>`.
- Article robots = `index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1`.
- Dropped-category article stays `noindex, follow`; `/markets`, `/ipo/compare` and `/admin/login` stay noindex.
- `/feed.xml` is valid RSS, `application/rss+xml`, dropped categories excluded.
- `tsc` and `next lint` are clean.

**Known side effect:** 404 pages now carry the layout's indexable robots tag alongside Next's `noindex`. This is harmless (a 404 status is never indexed), and `not-found.tsx` can't override metadata.

**After deploy:** run `cd seo-audit && npm run audit:render`. Expect `CANONICAL-IN-BODY` = 0, `DISCOVER-NO-LARGE-IMAGE-PREVIEW` = 0 and `DISCOVER-NO-FEED` = 0.

**Second batch (approved 2026-10-21) — also in the working tree, not deployed:**

| Item | Change |
|---|---|
| **P1-1** | `db/oneoff/2026-10-21-unpublish-sample-investment-records.sql`: sets the 5 sample records to `draft`, inside a transaction with before/after checks. **Run it by hand on the VM after `./backup.sh`.** |
| **P2-1** | `middleware.ts` returns 410 + `X-Robots-Tag: noindex` for the 13 seed article slugs (the database rows are kept) |
| **P2-2** | About page: "Who Runs gpaisa.in" with an accurate one-person description; unsupported "Financial Analysts" list removed. Footer (EN + HI), `components/home/TrustBand.tsx` and `components/GoldRatePageClient.tsx` now describe the real data sources instead of MCX/IBJA/LBMA/BSE/NSE feeds. |
| **D5** | Migration `db/migrations/0006_article_content_updated_at.sql` (idempotent; backfills `published_at`). Admin PATCH sets the column only when the title, excerpt or body change; POST sets it on create. The article page uses it for `dateModified`, OG `modified_time` and a visible "Updated <date>" line (shown only for edits made more than a day after publishing); the sitemap uses it for `lastmod`. |

**Verified** against a temporary local Postgres:
- `0006` runs twice cleanly, and the one-off script executes.
- `/articles/street-food-tour-bangkok` → 410 noindex.
- An edited article shows "Updated" and the edit date in JSON-LD, OG and the sitemap; an unedited one doesn't.
- The new wording renders; the old claims are gone.
- `tsc`, `next lint` and `next build` are clean.
- **Not exercised:** the admin PATCH path (needs an admin session). Test it by editing an article body in the admin and checking the "Updated" line.

**Deploy order:** `deploy.sh` → `migrate.sh` (applies 0006) → one-off SQL → `npm run audit:render` → compare with `runs/2026-10-21`.

**Still open:**
- D3: replace 6 lead images under 1200 px — needs new images from you.
- D4: multi-ratio JSON-LD images.
- D6: author page / NewsArticle.
- The historical-chart source notes ("RBI Handbook, IBJA, MCX") — confirm where the 1964–2026 CSVs actually came from.
- P1-2 to P1-8 (silver city list, slug 301s, broken links, sitemap lastmod for static pages, server-rendered rate tables, legacy ID 404, navigation).

## Update 2026-10-21 — after the Search Console data and the GCP hosting move

- **P0-1 (property mismatch): very likely ruled out.** The property reports 555 crawled content URLs and only 3 redirects (see `search-console-analysis.md`).
- **P0-2 (Google IP blocking): ruled out.** Live tests show a successful fetch with indexing allowed.
- **New P0-3: metadata regression from the 2026-10-20 move to the GCP VM.** Fix this first.
- **New P0-4: confirm there's no manual action, and export the URL lists behind each reason.**
- **The main cause is now Google's own quality/trust decision** (68% of non-indexed URLs are *Crawled – currently not indexed*). P1-1 (fictitious records), P2-1 (seed articles) and P2-2 (trust statements) therefore move up in practice: do them in week 1.
- **Discover track:** items D0–D6 in `google-discover-readiness.md`. D0 is the same change as P0-3.

### P0-3 · Serve metadata in `<head>` to Googlebot (hosting-migration regression) — **do first**
- **Root cause:** Next.js 15.5 streams `generateMetadata` output into `<body>` on dynamically rendered routes unless the user-agent matches `htmlLimitedBots`. The default list matches `Google-InspectionTool` but not `Googlebot`. Since the move to the Caddy + Next container (`58ceb44`, `8921abb`), the cached HTML for articles, category hubs and `/ipo` contains the streamed version.
- **Affected URLs (58):** all 39 articles, 5 category URLs, 13 `/ipo` URLs, `/category/business` (via `/finance`).
- **Evidence:**
  - Googlebot UA → `<link rel="canonical">` at byte ~73,700, after `</head>` at ~3,700.
  - Google-InspectionTool UA → canonical in `<head>`.
  - After rendering in Chrome, the title, canonical, robots and og:image are still in `<body>`.
  - On 2026-10-20 (Vercel) the Googlebot-UA re-check found them in `<head>`.
- **Change:** in `next.config.mjs` add `htmlLimitedBots: /.*/` (turns off streaming metadata for all UAs). Rebuild and redeploy with `deploy/deploy.sh`. The ISR cache lives inside the container (the `Dockerfile` copies `.next/standalone` and there's no cache volume in `deploy/docker-compose.yml`), so the new container starts with an empty cache and no stale streamed HTML.
- **Risk:** low. Slightly later first byte on uncached dynamic renders; the content is the same.
- **Test:** `curl -s -A "Mozilla/5.0 … Googlebot/2.1 …" https://www.gpaisa.in/articles/epfo-credits-8-25-percent-epf-interest` → canonical appears before `</head>`. Re-run the audit → `CANONICAL-IN-BODY` = 0.
- **Verify in GSC:** not visible in URL Inspection (it already sees `<head>`). Use the audit and curl instead.
- **Effort:** S.

### P0-4 · Manual actions + per-reason URL exports
- **Why:** a manual action would explain "only homepage indexed" on its own, and the 555 *Crawled – currently not indexed* URLs need splitting into current pages vs. old URLs.
- **Change:** none (read-only). Search Console → Security & Manual actions → Manual actions. Then each Page-indexing reason → Export → put the CSVs in `seo-audit/gsc-exports/` → `npm run audit`.
- **Test:** `report.md` → "Search Console exports" lists each reason with the live state of every URL.

### P0-1 · Confirm the Search Console property and sitemap submission *(very likely ruled out — see update above)*
- **Root cause (hypothesis):** the canonical host moved apex → www on 2026-05-14 (`git 89af963`). A URL-prefix property for `https://gpaisa.in/` would show inner pages only as redirects, and would ignore www sitemap URLs.
- **Affected URLs:** potentially all.
- **Evidence:** git history; live 308 apex → www; sitemap URLs are www-only.
- **Change:** add a **Domain property** `gpaisa.in` (DNS TXT record). Submit `https://www.gpaisa.in/sitemap.xml` there. Remove or ignore sitemap submissions in the apex property.
- **Location:** Search Console; DNS provider.
- **Risk:** none (read-only reporting change).
- **Test:** the Sitemaps report in the Domain property shows *Success* with ~139 discovered URLs.
- **Verify in GSC:** Page indexing in the Domain property. Compare the indexed count with what you see today.

### P0-2 · Rule out Google-IP-level blocking *(ruled out 2026-10-21: live tests fetched successfully)*
- **Root cause (to rule out):** Vercel Firewall / bot protection / Attack Challenge Mode acting on verified-bot IPs. This can't be seen from outside Google's network.
- **Change:** none expected. Check Vercel → Firewall for custom rules, bot protection or challenge mode on production.
- **Test / verify in GSC:** URL Inspection → *Test live URL* on `/calculator/sip`, `/gold-rate/delhi` and one article. You expect "URL is available to Google", a rendered screenshot showing content, and no blocked resources except `/api/*`. Also check Settings → Crawl stats → *Host status* is green, and the *By response* breakdown is mostly 200.

---

## P1 — Important technical and discovery issues

### P1-1 · Unpublish fictitious IPO / NCD / rights / buyback records
- **Root cause:** sample records created 2026-08-30 were published.
- **Affected URLs (5):** `/ipo/nova-industries-ipo`, `/ipo/bluepeak-textiles-ipo`, `/ncd/orient-finance-corp-ncd`, `/rights-issue/marigold-steels-rights-issue`, `/buyback/crestview-software-buyback`.
- **Evidence:** document links go to `https://example.com/*.pdf`; company websites are `https://example.com/…`; all `publish_status = published`; all listed in the sitemap.
- **Change:** set `publish_status = 'draft'` on these 5 rows (admin CMS). Existing code (`app/ipo/[slug]/page.tsx`, `app/ncd/[slug]/page.tsx`, …) then sets noindex, and `app/sitemap.ts` drops them. Verify `priority-jewels-ipo` against the exchange/RHP before keeping it. The related `ipo_reviews` rows stay hidden along with them.
- **Risk:** low. The hubs become empty (handled in P1-8).
- **Test:** re-run the audit → `CONTENT-PLACEHOLDER` = 0; the 5 URLs are absent from `/sitemap.xml`.
- **Verify in GSC:** the URLs move to *Excluded by 'noindex' tag*.
- **Effort:** S. *(This is a content problem, but it's placed in P1 because it's severe and nearly free to fix.)*

### P1-2 · One owned city list for silver routes, sitemap and HTML sitemap
- **Root cause:** `app/silver-rate/[city]/page.tsx` derives `generateStaticParams` and its 404 check from `fetchSilverCities()` (live Angel One API). `app/sitemap.ts` hardcodes `CITIES`, a list shared with gold. Gold is fine today — `app/gold-rate/[city]/page.tsx` has its own local `CITIES` — but that's a second copy that can drift from the sitemap.
- **Affected URLs:**
  - in sitemap but 404: `/silver-rate/delhi`, `/silver-rate/kerala`;
  - live but not in sitemap: `/silver-rate/chandigarh`, `/jaipur`, `/lucknow`, `/madurai`, `/mangalore`.
- **Evidence:** `SITEMAP-NON200@silver-rate-city`; `SITEMAP-OMISSION@silver-rate-city`; `lib/citySilverData.ts` has content for delhi and kerala.
- **Change:** export one canonical city list per metal (from `lib/citySilverData.ts` / `lib/cityGoldData.ts`). Use it in `generateStaticParams`, the `notFound()` check, `app/sitemap.ts` and `app/sitemap-page/page.tsx`. For gold, this means replacing the duplicate `CITIES` arrays. Use the API only for prices. If a price is missing, render the page with a "rate temporarily unavailable" message instead of a 404.
- **Risk:** low–medium. Decide what an indexable page shows when upstream data is missing.
- **Test:** re-run the audit → no `SITEMAP-NON200`; every listed city returns 200; sitemap city count matches the data file.
- **Verify in GSC:** the *Not found (404)* group loses those URLs (use *Validate fix*).
- **Effort:** M.

### P1-3 · 301 renamed article slugs and fix links in article bodies
- **Root cause:** slugs were edited in the CMS with no redirect and no slug history.
- **Affected URLs (confirmed 4):**
  - `/articles/gold-market-weekly-review-june-7-14-2026` → `/articles/gold-market-weekly-review-why-gold-fell-13760-per-10-grams-in-2-weeks-and-what-happens-next`
  - `/articles/gold-prices-nearly-doubled-from-2024-to-2026` → `/articles/gold-prices-nearly-doubled-20242026-why-indian-buyers-are-now-hesitating-before-weddings-festivals`
  - `/articles/gold-falling-silver-slippingsmart-investors-are-doing-this-in-2026` and `/articles/gold-rate-buy-or-wait-2026`: **verify the successor first**; if there isn't one, remove the links and let them 404.
- **Change:** add `redirects()` entries in `next.config.mjs` (or a `slug_history` table read in `middleware.ts`). Make the admin editor record the old slug whenever a slug changes. Update the 3 source articles' HTML.
- **Risk:** low.
- **Test:** `curl -sI` each old URL → one 301 to the new slug; re-run the audit → `LINK-BROKEN@article` = 0.
- **Verify in GSC:** URL Inspection of the old URLs shows *Page with redirect*; the 404 group shrinks.
- **Effort:** S.

### P1-4 · Remove links to pages that don't exist
- **Root cause:** template content links to calculators that were never built, and to a legacy redirect.
- **Affected:**
  - `components/fd/FDContent.tsx:285-290` → `/calculator/fd/{sbi,hdfc,icici,axis,post-office,kotak}` (404)
  - `components/fd/FDContent.tsx:300` → `/calculator/rd` (404)
  - `components/si/SIContent.tsx:228` and `components/mf/MFContent.tsx:204` → `/calculator/compound-interest` (404)
  - `components/{sip/SIPEducationalContent.tsx:228, ppf/PPFEducationalContent.tsx:290, emi/EMIEducationalContent.tsx:233}` → `/finance` (308 to a news category, under the anchor "Explore More Tools")
- **Change:** remove or retarget the links (e.g. to `/calculator`). Build the RD / compound-interest calculators only if you want them as real products.
- **Risk:** none.
- **Test:** re-run the audit → `LINK-BROKEN` = 0 and `LINK-TO-REDIRECT` = 0.
- **Verify in GSC:** the 404 group stops gaining these URLs.
- **Effort:** S.

### P1-5 · Make the sitemap truthful: lastmod and coverage
- **Root cause:**
  - `app/sitemap.ts` sets `lastModified: new Date()` for 49 static/hub/city/calculator URLs, so the value changes on every ISR regeneration.
  - Article `updated_at` was mass-set by migration `0001_admin_cms_fields.sql` (`ADD COLUMN updated_at … DEFAULT now()`), giving 32 articles the identical lastmod `2026-07-12T18:04:21.832Z`.
  - 30 indexable bank calculator pages and 5 silver cities are missing.
- **Change:**
  1. Use fixed, real dates for static pages (bump them when the page content changes). For rate pages, use the date the rate data last changed, or omit lastmod.
  2. Add a `content_updated_at` column that is written only when title or body change; use it for the sitemap, JSON-LD `dateModified` and OG `modifiedTime` (`app/articles/[slug]/page.tsx` currently uses `published_at` for both).
  3. Add the bank calculators to the sitemap **only if P2-3 keeps them indexable**; otherwise noindex them.
  4. Silver cities come from P1-2.
- **Risk:** low.
- **Test:** fetch the sitemap twice, an hour apart → lastmod values are unchanged. The sitemap's URL set equals the set of indexable, self-canonical URLs found by the crawl.
- **Verify in GSC:** Sitemaps → discovered URLs matches.
- **Effort:** S–M.

### P1-6 · Server-render the gold/silver data that Googlebot can't fetch
- **Root cause:** client components (`CityWiseGoldRates.tsx`, `CitySilverRatesTable.tsx`, `DynamicGoldRates.tsx`, `DynamicSilverRates.tsx`, `GoldHistoryTable.tsx`, `MarketTicker.tsx`, …) fetch `/api/*`, which `app/robots.ts` disallows. Googlebot obeys robots for these fetches.
- **Affected:**
  - `/gold-rate` (+182 words and 16 city links only after JS);
  - `/silver-rate` (+106 words, 15 links);
  - all gold and silver city pages (+~120 words each).
- **Evidence:** `RENDER-DEPENDS-ON-BLOCKED-API`; lab CLS 0.37–0.59 on these templates, caused by the late-loading tables.
- **Change:** fetch the rates on the server in the page component (as `/gold-rate` already does for `initialHeroData`) and pass them as props. Keep the client refresh as an enhancement. Don't remove `/api/` from robots.txt wholesale.
- **Risk:** medium. ISR freshness must match how often the data needs to update. `revalidate` is 86400 today, which may be too slow for "today's rate". Consider 1–3 h.
- **Test:** `curl` a city page → the rate table and city links are in the raw HTML. Re-run with `--render` → no `RENDER-DEPENDS-ON-BLOCKED-API`; lab CLS < 0.1.
- **Verify in GSC:** URL Inspection → *View tested page* → the HTML contains the table.
- **Effort:** M.

### P1-7 · Unknown legacy article IDs should 404, not redirect to `/news`
- **Root cause:** `middleware.ts` (`articleIdMatch` branch) 301s any `/articles/<digits>` without a slug match to `/news`.
- **Evidence:** `/articles/999999999` → 301 → `/news` (`LEGACY-UNKNOWN-REDIRECT`).
- **Change:** keep the 301 when `/api/article-redirect` returns a slug; otherwise `return NextResponse.next()` and let the route 404, or return 410.
- **Risk:** low. Legitimate IDs still redirect.
- **Test:** `curl -sI /articles/999999999` → 404; `curl -sI /articles/<real-id>` → 301 to the slug.
- **Verify in GSC:** fewer *Soft 404* / *Page with redirect* entries for numeric URLs.
- **Effort:** S.

### P1-8 · Stop pointing global navigation at near-empty sections
- **Root cause:** the header/footer link every page to `/ncd`, `/rights-issue`, `/buyback`, `/ipo-calculator`, `/ipo/gmp`, `/ipo/listing-performance` (26–82 words each) and to the noindex `/ipo/compare`.
- **Change:** until the sections hold verified content, keep one "IPO" nav entry and remove the rest from global navigation. Add explanatory content to `/ipo` or noindex it. Keep `/ipo/compare` out of global navigation.
- **Risk:** low.
- **Test:** re-run the audit → `PAGE-NOINDEX-LINKED-PROMINENTLY` = 0; hub inlinks fall.
- **Verify in GSC:** n/a (internal signal).
- **Effort:** S.

---

## P2 — Content quality and page-level improvements

| ID | Change | Affected | Location | Effort |
|---|---|---|---|---|
| P2-1 | Return **410** for the 13 seed/placeholder articles (list in `content-quality-report.md` §2.2). Decide the 13 substantive tech articles: separate site, or keep noindex. | 26 off-topic URLs | `middleware.ts` (410 list), Supabase | S |
| P2-2 | Fix site trust statements: actual data source and method for gold/silver rates; accurate About/team; author page; editorial and corrections policy; affiliate/advertising disclosure; normalise the author name | site-wide | `lib/i18n/translations.ts:78`, `components/home/TrustBand.tsx`, `app/about/page.tsx`, new pages | M |
| P2-3 | Decide the 30 bank calculator pages: keep only those with real bank-specific data (current rate card + source + date); otherwise consolidate with a bank selector or noindex | 30 URLs | `app/calculator/[[...slug]]/page.tsx`, `lib/bankData.ts`, `lib/homeLoanBankData.ts` | M |
| P2-4 | Glossary: add an Indian example, formula, related calculator and article links to each term; merge the weakest | 33 URLs | `lib/glossaryData.ts`, `app/glossary/[slug]/page.tsx` | M |
| P2-5 | Articles: one H1 (strip the `<h1>` from body HTML, or render the body's heading as H2); strip `<title>`/`<meta>` pasted into content; visible "Updated on"; primary-source citations for rates, taxes and fees; refresh or retire month-specific "2026" pieces | 39 URLs | CMS sanitiser, `app/articles/[slug]/page.tsx` | M |
| P2-6 | Calculators: add a formula/assumptions section to NPS and SSY; add the rate source and "last verified" date to FD, NPS, HRA, SWP, GST, PPF, SSY, NSC, SCSS, EPF | 10–12 URLs | `components/<calc>/…Content.tsx` | S each |
| P2-7 | Contextual links: article → calculator(s) + glossary terms; calculator → 2–3 guides; glossary → calculator + articles | all content | content components | M |
| P2-8 | Silver city pages with near-template content (e.g. Madurai ↔ Mangalore 0.75): add local specifics or drop them from indexing | ~5 URLs | `lib/citySilverData.ts` | S |
| P2-9 | Resume a sustainable publishing cadence; refresh stale time-sensitive pages | — | editorial | L |

---

## P3 — Enhancements

| ID | Change | Location | Effort |
|---|---|---|---|
| P3-1 | Shorten titles over ~65 chars (articles, calculators, bank pages) and tune meta descriptions (lengths outside 70–165) | `generateMetadata` | S |
| P3-2 | Article `BreadcrumbList`: level 2 should be the real category hub (`/category/<slug>`, readable name), not always `/news` | `app/articles/[slug]/page.tsx` | S |
| P3-3 | Collapse the `http://gpaisa.in` 2-hop chain and point GoldRate24.in straight at `https://www.gpaisa.in` (1 hop) | Vercel → Domains | S |
| P3-4 | Caching: 30% of crawl responses were cache MISS; TTFB median 544 ms, p90 2.5 s (31 of 196 > 1.5 s, single samples). Review routes with dynamic data fetching and `revalidate` windows. | route files, `lib/supabaseApi.ts` | M |
| P3-5 | `htmlLimitedBots` in `next.config.mjs`, so non-Google crawlers also get metadata in `<head>` (Next 15.5 streams it into `<body>` on slow renders for non-bot UAs) | `next.config.mjs` | S |
| P3-6 | Add a canonical to `/ipo/compare` and `/sitemap-page` | page metadata | S |
| P3-7 | Investigate intermittent 500s from `/api/silver/calculator` (2 of 3 render runs) | `app/api/silver/calculator/route.ts`, Vercel logs | S |
| P3-8 | Measure field Core Web Vitals (Search Console CWV / CrUX) once traffic allows; lab LCP was noisy (0.3–13 s, unthrottled) | — | S |

---

## Discover track (details in `google-discover-readiness.md`)

| ID | Change | Depends on | Effort |
|---|---|---|---|
| D0 | = P0-3 (metadata in `<head>`) | — | S |
| D1 | Shared `INDEXABLE_ROBOTS` with `max-image-preview:large`, used on all indexable routes | D0 | S |
| D2 | `/feed.xml` RSS + `<link rel="alternate">` in the layout | — | S |
| D3 | Replace 6 lead images under 1200 px; minimum width on upload | — | S |
| D4 | Real `og:image` dimensions; multi-ratio JSON-LD images | — | S |
| D5 | `content_updated_at` → dateModified / lastmod / visible "Updated on" (overlaps P1-5) | — | S–M |
| D6 | `NewsArticle` for news pieces; real author page | P2-2 | M |

## Order and dependencies

0. **Today:** P0-3 / D0 (metadata regression), P0-4 (manual actions + exports).
1. **Week 1:** P1-1 (fictitious records), P2-1 (410 seed articles), P2-2 (trust statements), D1–D4, P1-3, P1-4, P1-7 (all small and independent).
2. **Week 1–2:** P1-2 → P1-5 (the sitemap depends on the city list and on the P2-3 decision) → P1-6 → P1-8.
3. **Weeks 2–6:** P2 items. Do P2-2 (trust) and P2-1 (410s) first; they're cheap.
4. **Ongoing:** P3.

After each batch: deploy → `cd seo-audit && npm run audit:render` → `node src/cli.mjs compare runs/2026-10-20 runs/<new>` → resubmit the sitemap in the Domain property → *Validate fix* on the affected Page-indexing reason groups.

## How to measure the outcome in Search Console

- **Pages indexed** (Domain property) per template, tracked weekly. Expect changes over weeks, not days.
- The *Crawled – currently not indexed* and *Discovered – currently not indexed* counts per template, from the CSV exports (drop them into `seo-audit/gsc-exports/`).
- Crawl stats: requests per day and the share of 200 responses.
- Performance → Pages: non-homepage impressions.
