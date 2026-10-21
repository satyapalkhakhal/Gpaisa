# Search Console analysis — gpaisa.in

**Data:** Page indexing overview export (`Chart.csv`, `Critical issues.csv`, `Non-critical issues.csv`, `Metadata.csv`; filter "All known pages"), covering 2026-07-22 → 2026-10-12. Also two live tests run on 2026-10-21 (`/articles/epfo-credits-8-25-percent-epf-interest` and `/gold-rate/delhi`).
**Stored in:** `seo-audit/gsc-exports/` (git-ignored); the audit reads it automatically.
**Missing:** the URL lists behind each reason. Without them I can see *how many* pages sit in each group, but not *which* pages.

---

## 1. What the numbers say

| Metric | 2026-07-24 | 2026-10-12 |
|---|---|---|
| Indexed | 1 | **1** — unchanged for 81 days |
| Not indexed | 1,773 | 812 |
| Impressions in the whole period | — | 167 total (~2/day) |

| Reason (2026-10-12) | Source | Pages | Share | What it means here |
|---|---|---|---|---|
| **Crawled – currently not indexed** | Google systems | **555** | **68%** | Google fetched the page and chose not to index it. This is a value/quality decision, not a technical error. |
| Not found (404) | Website | 165 | 20% | Mostly removed URLs (the agriculture section returns 410, which Search Console reports as 404), plus old article slugs and IDs. Expected for deliberately removed pages. |
| **Discovered – currently not indexed** | Google systems | **80** | 10% | Google knows the URL but hasn't bothered to crawl it — low crawl priority for the site. |
| Excluded by 'noindex' tag | Website | 5 | 1% | Intentional (`/markets`, `/ipo/compare`, dropped-category articles) |
| Page with redirect | Website | 3 | — | Apex/http variants, `/finance`. Correct. |
| Soft 404 | Website | 3 | — | Unknown without the URL list. Likely `/articles/<id>` → `/news` redirects, or the near-empty `/ncd`, `/rights-issue`, `/buyback` hubs. |
| Redirect error | Website | 1 | — | Validation passed |

The reasons add up to exactly 812, so this export covers every non-indexed URL.

**About 78% of non-indexed URLs (635) are excluded by Google's own decision, not by anything the website does.** The technical reasons (noindex, redirect, 404, soft 404) are either intended or small.

## 2. What this changes in the diagnosis

| Earlier hypothesis | Verdict now |
|---|---|
| **A. Property/sitemap mismatch after the apex→www move** | **Very likely ruled out.** The property reports hundreds of content URLs as *crawled*. An apex-only URL-prefix property would show them as "Page with redirect" (there are only 3). The data starts 2026-07-22, two months after the host change. |
| **B. Site-level quality/trust** | **Now the leading explanation.** Google crawled 555 pages — including 2,000–4,000-word articles and working calculators — and indexed none of them for almost three months, while the homepage stays indexed. That pattern means Google judged the *site*, not each page's markup. |
| C. URL churn | **Confirmed as background.** The drop from 1,773 to 812 not-indexed URLs is Google gradually forgetting removed URLs (agriculture state/district/mandi/crop pages, removed categories). It's happening on its own; no action needed. |
| P0-2: Google's servers blocked at IP level | **Ruled out.** The live tests show "Page fetch: Successful", "Crawl allowed: Yes", "Indexing allowed: Yes". |

**Important caveat about the live tests.** URL Inspection and the Rich Results Test fetch as `Google-InspectionTool`. Since the 2026-10-20 move to the GCP VM, Next.js serves that user-agent a different `<head>` from the one real Googlebot gets. See `CANONICAL-IN-BODY` in `issues.csv`: the canonical, robots, title and OG tags are in `<body>` for Googlebot on all 39 articles, 5 category URLs and 13 `/ipo` URLs, but in `<head>` for the inspection tool. **A passing live test does not prove Googlebot receives the same page.**

## 3. Why Google declines a site like this

Google doesn't publish the details. These are the factors the evidence supports, strongest first:

1. **Trust problems that are visible on the site.**
   - 5 IPO/NCD/rights/buyback pages contain fictitious companies, made-up subscription figures and "apply" style reviews, with documents on `example.com`.
   - Seed articles of 25–175 words are still reachable.
   - Data-source claims don't match the code (MCX/IBJA/LBMA claimed; Angel One used).
   - The About page describes "a dedicated team of financial analysts", but there is one author.

   For finance (YMYL) content, Google's systems weight trust heavily.
2. **History.** In its first seven months the domain published hundreds of programmatic agriculture pages, then sports, travel, tech and movies sections, then a pivot to finance. Google's first impression of the site was formed during that period.
3. **Little evidence of first-hand expertise or original value.** Long articles are not enough on their own. Google looks for information gain beyond existing results, such as original data, real calculations, firsthand product experience, and a named author with relevant credentials.
4. **Low demand signals.** About 2 impressions a day, no evidence of external links or mentions, and 3 months without new content.

**One question for you:** how were the articles written — by hand, AI-assisted, or mostly AI-generated? The repo has a `finance-content-writer` agent (added 2026-07-18) and an `ipo-data-analyst` agent. AI help is not a problem by itself. But if most of the content was generated at scale without substantial expert review and original input, Google's systems often treat it as low added value — and that would be a major factor here.

## 4. Things to stop doing in Search Console

- **Don't "Validate fix" on Not found (404)** for URLs you removed on purpose (agriculture, seed articles). A 404/410 is the correct state; let them drop out.
- **Don't "Validate fix" on Page with redirect.** Redirects aren't errors. The current *Failed* status is harmless.
- **Validating "Crawled – currently not indexed" doesn't make Google index anything.** It only asks Google to recheck. Recheck after you've made real changes (see `fix-roadmap.md`).
- **Don't mass-request indexing.** After fixing the trust problems and the metadata regression, request indexing for 10–20 of your strongest pages, no more.

## 5. Exports still needed

From the Search Console property you used:
1. **Security & Manual actions → Manual actions.** Please confirm it says "No issues detected". A manual action (e.g. *Thin content* or *Scaled content abuse*) would produce exactly this "only homepage indexed" pattern, so this is the most important check left.
2. **The URL lists for each reason.** Open each reason → **Export → CSV** (the "Table" CSV), especially *Crawled – currently not indexed* (555), *Discovered – currently not indexed* (80), *Soft 404* (3) and *Not found (404)* (165). Put them in `seo-audit/gsc-exports/` and run `npm run audit` — the tool joins every URL to its live state and splits the 555 into current pages vs. old ones.
3. **Indexing → Pages → "View data about indexed pages"**, to confirm that the one indexed URL is `https://www.gpaisa.in/`.
4. **Settings → Crawl stats** (last 90 days): requests per day, response breakdown, host status. This matters especially since the move to the GCP VM.
5. **Performance → Search results → Pages and Queries**, last 16 months.
