# Indexing root-cause report — gpaisa.in

**Audit date:** 2026-10-20 · **Final crawl:** 13:38–13:48 UTC, 276 HTTP requests, 210 URLs, 35 pages rendered in Chrome
**Type of report:** technical audit. **No Search Console data was available**, so nothing here confirms what Google has or has not indexed. "Only the homepage is indexed" is treated as the reported symptom, not as a verified fact.

---

## 0. Update 2026-10-21 — Search Console data received; site moved to new hosting

Details are in `search-console-analysis.md` and `google-discover-readiness.md`. Sections 1–6 below describe the 2026-10-20 Vercel snapshot and are kept as the baseline.

**Search Console confirms the symptom.**
- Indexed = 1 for every day from 2026-07-24 to 2026-10-12.
- 812 URLs are not indexed. Of those, **555 (68%) are *Crawled – currently not indexed*** and 80 are *Discovered – currently not indexed*, both "Google systems".

**Revised conclusions**

| Candidate | 2026-10-20 | 2026-10-21 |
|---|---|---|
| A. Property/sitemap mismatch | Hypothesis, check first | **Very likely ruled out**: crawled content URLs are reported in the property, and there are only 3 redirects |
| Google IP-level blocking | Unknown | **Ruled out**: live test fetched successfully, indexing allowed |
| B. Site-level quality/trust | Medium | **Leading explanation, High confidence**: Google crawls the pages and declines to index them. Confirm there's no manual action. |
| C. URL churn | Contributing | **Confirmed background**: not-indexed count falling (1,773 → 812) as removed URLs drop out |

**New regression from the 2026-10-20 move to the GCP VM.** On 58 URLs (all 39 articles, category hubs, `/ipo`), real Googlebot now receives the title, canonical, robots and OG tags in `<body>`, and they stay there after rendering. Google-InspectionTool still gets them in `<head>`, so URL Inspection won't reveal the problem.
- **Cause:** Next.js streaming metadata (the default `htmlLimitedBots` list doesn't include Googlebot).
- **Fix:** `htmlLimitedBots: /.*/` in `next.config.mjs` (`fix-roadmap.md` P0-3).
- **Not a regression:** status codes, redirects and robots.txt are unchanged by the move, and server response time improved.

---

## 1. Bottom line

1. **I found no site-wide technical blocker in the live site today.** From outside Google's network, every check that could stop a whole site being indexed passes: robots.txt, noindex, canonicals, status codes, host redirects, sitemap validity, server-rendered content, and Googlebot-UA parity. This conclusion has **High confidence** for what an external crawler can see. The one thing it cannot see is IP-based bot filtering, which only Search Console can show.
2. Because nothing site-wide is broken today, the symptom most likely comes from a mix of the factors below. I can't rank them reliably without Search Console data:
   - **A. A reporting/property mismatch caused by the 2026-05-14 host change** from `gpaisa.in` to `www.gpaisa.in`. This is a hypothesis. It is cheap to confirm and it would explain *"only the homepage"* exactly.
   - **B. Weak site-level quality and trust signals on a young YMYL domain.** These include seed/placeholder articles, fictitious IPO/NCD records, off-topic sections, thin hub and glossary pages, inaccurate data-source claims, and three months without new content. This is the usual driver of *"Crawled / Discovered – currently not indexed"*. Confidence is Medium: the problems are confirmed, but their effect on Google's decisions is not.
   - **C. URL churn that reset signals**: the host change, the numeric-ID → slug change, renamed article slugs with no redirects, removed sections, and noindex flips. Confidence is High that the churn happened; its weight is Medium.
3. Some **page-specific defects** are confirmed and should be fixed, but none of them explain a site-wide problem: 2 sitemap 404s, 14 internal links to 404s, 30 indexable pages missing from the sitemap, and content loaded through robots-blocked `/api/` calls.

---

## 2. What was checked, and the result

| Area | What was done | Result | Confidence |
|---|---|---|---|
| robots.txt | Fetched and parsed with Google's longest-match rules; tested 139 sitemap URLs and `/_next/` assets | 200. `Disallow: /api/, /admin/` only. No sitemap URL or rendering asset is blocked. Sitemap declared. | High |
| Meta robots / X-Robots-Tag | Every crawled page; header + meta + googlebot meta | `index, follow` everywhere except `/markets` (noindex, nofollow) and `/ipo/compare` (noindex, follow), both intentional. **0 sitemap URLs are noindex.** | High |
| Canonicals | Every page; self vs other; target status | 137/137 indexable sitemap URLs are self-canonical on `https://www.gpaisa.in`. None point at the homepage or another domain. Parameter URLs (`/ipo?tab=…`, `/category/finance?page=1`) canonicalise to the clean URL, as intended. | High |
| Host/protocol | http/https × apex/www, root and deep path | All variants 308 → `https://www.gpaisa.in/…` with the path kept. `http://gpaisa.in` takes 2 hops (Low). | High |
| GoldRate24.in | Root + deep path, both hosts | 301 → `gpaisa.in` → 308 → www, path kept. **It does not serve duplicate content today.** Its past URL structure could not be checked (Wayback Machine was offline). | High (today) |
| Sitemap | Fetched, parsed, every entry crawled | Valid XML, 200, `application/xml`, 139 URLs, single host. **2 entries return 404** (`/silver-rate/delhi`, `/silver-rate/kerala`). lastmod is unreliable (see §4). | High |
| Status codes | 210 URLs | 195 × 200, 14 × 404 (all reached through internal links or the sitemap), 1 × 308. **No 5xx.** | High |
| Soft-404 behaviour | 10 made-up URLs, one under each dynamic route | All return a real **404** with noindex. Dynamic routes are bounded. | High |
| URL variants | Trailing slash, uppercase, `utm_*`, unknown params on 3 templates | Trailing slash → 308 to the clean URL; uppercase → 404; parameters keep the clean canonical. | High |
| Server-rendered content | Raw HTML vs. rendered DOM (35 pages, mobile Chrome) | Title, canonical and robots are identical before and after JS on all 35. Main content is in the server HTML on every template (median 620 words on indexable pages). | High |
| Googlebot UA | Same URLs with the Googlebot smartphone UA | Same status, title, canonical, robots and word count. No UA-based blocking or cloaking. | Medium (UA only — Google IPs not testable) |
| Search Console | — | **Not available.** | — |

### What this rules out

These are the classic causes of "only the homepage is indexed": a site-wide noindex, `Disallow: /`, all canonicals pointing at the homepage or a wrong host, a JS-only app shell, a sitemap full of redirects or errors, or a bot-blocking WAF answering Googlebot's UA. **None of these are present today.** Git history shows **no** site-wide noindex or Disallow at any point since the first commit (2026-01-02). Commits checked: every version of `app/robots.ts` and `app/layout.tsx`.

---

## 3. Root-cause candidates

### A. Search Console property and sitemap mismatch after the host change — *hypothesis, check first*

**Evidence**

- `git 89af963` (2026-05-14) changed `metadataBase`, every canonical, the sitemap `baseUrl` and the robots `Sitemap:` line from `https://gpaisa.in` to `https://www.gpaisa.in`, and added the apex → www redirect.
- From January to May 2026 the canonical site was the **apex** host. A URL-prefix property created then would be `https://gpaisa.in/`.
- The sitemap was submitted "several months ago", which is close to that change.
- Today `https://gpaisa.in/sitemap.xml` 308s to www and lists only www URLs.

**Why it fits.** In a URL-prefix property for `https://gpaisa.in/`:
- every inner URL is a redirect ("Page with redirect");
- sitemap entries on `www.` are outside the property, so they are reported as errors or ignored;
- only an old apex homepage might still show as indexed.

**How to confirm (5 minutes).** In Search Console:
1. Settings → check the property type.
2. Sitemaps → note the exact sitemap URL submitted.
3. If it's a URL-prefix apex property, add a **Domain property** (`gpaisa.in`, DNS TXT verification) and look at the Page indexing report there.

**If confirmed.** The "only homepage indexed" view is mostly a reporting artefact. The real index state is whatever the Domain property shows.

### B. Site-level quality and trust signals — *confirmed problems, effect unconfirmed*

These are typical reasons for *Crawled/Discovered – currently not indexed* on a young finance (YMYL) site. Each problem below was checked directly:

| Signal | Evidence |
|---|---|
| Seed/placeholder articles | 13 articles from 2026-03-24 with 25–175 words (e.g. `/articles/street-food-tour-bangkok`, `/articles/web3-decentralized-identity`). Indexable from March until 2026-07-17; still live (200, noindex). |
| Off-topic content | 26 of 65 published articles are TECHNOLOGY/TRAVEL. Sports, movies, education and agriculture sections came and went between January and July 2026. |
| Fictitious financial records | 5 of the 6 IPO/NCD/rights/buyback records are sample data whose documents point to `https://example.com/…`. They are published, in the sitemap, and show subscription figures and reviews. IPOs that closed on 2026-09-01 are still shown as "open". |
| Thin template pages | 33 glossary terms (median 111 words, 3 inlinks each). `/ipo` (56 words), `/ipo/gmp` (82), `/ipo/listing-performance` (59), `/ncd` (28), `/rights-issue` (26), `/buyback` (26), `/ipo-calculator` (47) are nearly empty but linked from every page and listed in the sitemap. |
| Programmatic pages | 30 bank SIP / home-loan calculator pages (≈334 words; home-loan pairs up to 0.50 similar). noindexed until 2026-07-12, then made indexable but never added to the sitemap. |
| Trust/E-E-A-T gaps | The site claims "data sourced from MCX, IBJA, LBMA, BSE, and NSE", but the code fetches rates from Angel One endpoints. "Dedicated team of financial analysts" vs. one credited author. No editorial or corrections policy. |
| Inactivity | No new article since 2026-07-19. Investment data untouched since 2026-08-30. |

**What is *not* the problem**
- Article depth: the median article has 2,760 words, and no two articles are near-duplicates (highest pair 0.25).
- Calculators: median 743 words of explanatory content, all distinct.
- City pages: gold city pages are mostly distinct (median pair 0.23).

**Confidence: Medium.** The problems are real. Whether they are *why* Google declined to index specific URLs can only be inferred from the Page-indexing reasons in Search Console, grouped per template.

### C. URL churn — *confirmed history, contributing*

| Date | Change | Lasting effect |
|---|---|---|
| 2026-01-05 | Article URLs moved from numeric IDs to slugs | Unknown IDs 301 → `/news` (soft-404 pattern; `LEGACY-UNKNOWN-REDIRECT`) |
| 2026-05-14 | Canonical host apex → www | All URLs re-processed under a new host |
| 2026-06-14 | Agriculture section removed | 410 + noindex (handled correctly) |
| 2026-07-12 | Bank calculator pages noindex removed | 30 indexable pages with no sitemap entry |
| 2026-07-12 | `ALTER TABLE articles ADD COLUMN updated_at DEFAULT now()` | 32 articles share lastmod `2026-07-12T18:04:21.832Z` |
| 2026-07-17 | Off-topic categories set to noindex | 26 articles dropped out |
| unknown | Article slugs renamed with no redirect | 4 confirmed old slugs are 404 and still linked from article bodies |

Each change forces Google to re-crawl and re-evaluate URLs. On a site with little external signal, recrawling is slow.

---

## 4. Site-wide vs. template-specific vs. page-specific

| Scope | Finding | Directly blocks indexing? |
|---|---|---|
| **Site-wide** | Possible Search Console property mismatch (A) | Reporting only |
| Site-wide | Quality/trust signals (B) | Indirect — affects whether Google chooses to index |
| Site-wide | Sitemap `lastmod` set to "now" for 49 static/hub/city/calculator URLs (ISR build time) and bulk-identical for 32 articles | Indirect — teaches Google to ignore lastmod |
| **Template** | Gold/silver city & hub pages load tables and links from `/api/*`, which robots.txt blocks for Googlebot. `/gold-rate` loses its 16 city links and +182 words. | Indirect (discovery/content), not blocking |
| Template | `calculator-bank-programmatic` (30 URLs) not in sitemap, 1 contextual linker each | Indirect (discovery) |
| Template | Silver city route existence depends on the live Angel One city list | **Direct** for affected cities (404) |
| **Page** | `/silver-rate/delhi`, `/silver-rate/kerala`: in sitemap, 404 | Direct |
| Page | 6 `/calculator/fd/<bank>`, `/calculator/rd`, `/calculator/compound-interest`: linked, 404 | Direct for those links |
| Page | 4 old article slugs: linked, 404 | Direct (signals lost) |

---

## 5. Limitations

- **No Search Console access.** Index status, crawl stats, manual actions and Google-selected canonicals are unknown. I have not stated that any URL is or isn't indexed.
- **Not tested from Google's IP ranges.** Vercel Firewall or bot-protection rules that act on verified-bot IPs would not show up here. URL Inspection → *Test live URL* is the authoritative check.
- **Wayback Machine was unavailable** (HTTP "Temporarily Offline"), so historical URLs for gpaisa.in and GoldRate24.in could not be listed. Old URLs that 404 today may exist beyond the 4 found through internal links.
- **No field Core Web Vitals.** The keyless PageSpeed Insights quota was exhausted. Lab numbers come from local Chrome and are directional only.
- **No backlink data.** External link signals were not assessed, and DA/DR scores are deliberately not used.
- The crawl covers every URL that is linked or in the sitemap. URLs that exist only in the database and are linked from nowhere (e.g. the 26 noindex off-topic articles) were checked through the database, not crawled.

## 6. Evidence needed from Search Console (in priority order)

1. **Property type and submitted sitemap URL** (Settings, Sitemaps). This confirms or rules out A.
2. **Page indexing → "Why pages aren't indexed"**: a CSV export of each reason (drill into the reason → Export). Put the files in `seo-audit/gsc-exports/` and re-run the audit; it will join each reason to the live state.
3. **URL Inspection** (Test live URL + "Google-selected canonical") for: `/calculator/sip`, `/gold-rate/delhi`, `/articles/epfo-credits-8-25-percent-epf-interest`, `/glossary/sip`, `/ipo/priority-jewels-ipo`.
4. **Settings → Crawl stats**: requests per day, response codes, host status (robots.txt/DNS/server availability).
5. **Security & Manual actions**: confirm both are empty.
6. **Performance → Pages** (last 16 months): whether any non-homepage URL ever had impressions, and whether impressions fell after a specific date (e.g. 2026-05-14 or 2026-07-17).
