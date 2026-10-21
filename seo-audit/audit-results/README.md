# gpaisa.in SEO audit agent

A read-only crawler and analyser that checks whether Google can discover, crawl, render and index the site's pages, and records the evidence for every finding. It lives in `seo-audit/`, separate from the Next.js app. It has its own `package.json`, and the app's TypeScript program does not include it (verified with `tsc --listFilesOnly`).

## What it does

| Step | Checks |
|---|---|
| Host variants | http/https × apex/www, deep paths, redirect type and hops |
| Related domains | `goldrate24.in` redirect chain and path preservation |
| robots.txt | Availability, sitemap declaration, Google longest-match evaluation for every URL and for `/_next/` assets |
| Sitemaps | Recursive (sitemap index), HTTP/content-type, XML validity, host, duplicates, lastmod accuracy ("now" or bulk-identical) |
| Crawl | Sitemap + homepage seeds, then internal links (BFS), with rate limiting, a request budget and robots compliance |
| Per page | Status, redirect chain, X-Robots-Tag, meta robots/googlebot, canonical (count, placement, target health), title, description, H1s, JSON-LD validity, word count, soft-404 wording, placeholder data (`example.com`, lorem ipsum), TTFB, HTML size |
| Probes | Made-up URLs under every dynamic route (soft-404), trailing slash / uppercase / tracking params, legacy paths |
| Googlebot UA | Same URLs with the Googlebot smartphone UA: status, title, canonical, robots, word count. Canonicals found in `<body>` are re-fetched as Googlebot **and** Google-InspectionTool, because Next.js serves them different `<head>`s |
| Site analysis | Duplicate titles/descriptions, near-duplicate content (5-word shingles after removing site-wide boilerplate), within-template similarity, link graph, click depth, orphans, sitemap omissions, broken links, links to redirects |
| `--render` (optional) | Headless Chrome with a mobile viewport: raw vs. rendered title/canonical/robots/words/links, console errors, failed requests, **fetches blocked by robots.txt**, lab LCP/CLS/JS KB |
| Repo routes | Enumerates `app/**/page.tsx` and flags static routes that are neither in the sitemap nor linked |
| Google Discover | For `discover.templates` (default: article): `max-image-preview:large` present, lead image present and ≥1200 px (header bytes only, via a Range request), true `og:image` dimensions, RSS/Atom feed advertised |
| Search Console (optional) | Reads the Page-indexing overview export (`Chart.csv`, `Critical issues.csv`, `Metadata.csv`) for reason totals and trend; joins per-reason URL exports to the live state and flags reasons that disagree with the live status |

**Read-only by design.** It only issues GET requests. It never logs in, never touches `/admin` or `/api/*` (excluded and robots-disallowed), and never changes content, robots, canonicals, redirects or deployments.

## Setup

```bash
cd seo-audit
npm install            # cheerio (HTML/XML parsing) + optional playwright-core (render checks)
```

Requires Node ≥ 20. Render checks use an existing Chrome/Chromium: set `render.executablePath` in `audit.config.json`; the default is `/usr/bin/google-chrome`. No browser is downloaded.

**Dependencies, and why:**
- `cheerio` — a standards-compliant HTML5/XML parser; it places elements in `<head>`/`<body>` the same way browsers and Google do.
- `playwright-core` (optional) — drives the local Chrome for render comparison.

Nothing else.

## Running

```bash
npm run audit                     # crawl + analysis (~5 min, ~280 requests at 3 concurrent, 250 ms spacing)
npm run audit:render              # + headless-Chrome render checks (≈2 pages per template)
node src/cli.mjs audit --out runs/my-label --max-pages 100
node src/cli.mjs audit --origin https://staging.example.com   # point at another deployment
```

Each run writes to `seo-audit/runs/<timestamp>/` (git-ignored).

| File | Contents |
|---|---|
| `report.md` | Run summary: status codes, template table, host/related-domain checks, probes, UA and render comparisons, similarity, issue table |
| `url-inventory.csv` | One row per URL, 43 columns |
| `issues.csv` / `issues.json` | Issues aggregated per (rule, template): severity, confidence, impact class, evidence, why it matters, fix, where to look, how to validate, effort, affected URLs |
| `issue-occurrences.csv` | One row per (rule, URL) with evidence |
| `pages.json` | Full per-page record, including internal links |
| `summary.json` | All run metadata, probes, render results, similarity stats |
| `requests-log.csv` | Every HTTP request made (time, URL, status, ms) — the record of commands and traffic |
| `audit-config.used.json` | The exact config used |

### Search Console exports

1. Optional: the overview export from **Indexing → Pages → Export** (the zip has `Chart.csv`, `Critical issues.csv`, `Metadata.csv`) — drop the CSVs in as they are.
2. In Search Console → **Indexing → Pages**, open each reason under *Why pages aren't indexed* → **Export → CSV**. Use the "Table" CSV.
3. Save each file into `seo-audit/gsc-exports/`, named after the reason. Example: `Crawled - currently not indexed.csv`. A CSV with a `Reason` column also works.
4. Optionally, add **Performance → Pages** exports (`Top pages`, `Clicks`, `Impressions` columns).
5. Re-run. The report gains a *Search Console exports* section that groups URLs by reason and shows each URL's live state. `GSC-STATUS-MISMATCH` flags stale reasons.

The module never invents data. If the folder is empty, the report says it did not run.

### Comparing runs (regression checks)

```bash
node src/cli.mjs compare runs/2026-10-20 runs/2026-11-03
# → runs/2026-11-03/comparison.md : new / resolved issue occurrences, per-URL status/indexable/noindex/canonical/sitemap changes
```

Baselines: `runs/2026-10-20` (Vercel hosting) and `runs/2026-10-21` (GCP VM + Caddy, with Search Console data). It's git-ignored, so copy it somewhere safe if you need it long-term.

## Configuration (`audit.config.json`)

| Key | Purpose |
|---|---|
| `site.canonicalOrigin`, `hostVariants`, `relatedDomains`, `sitemaps`, `defaultTitle` | Target site |
| `crawl.*` | UA, `concurrency`, `minDelayMs`, `timeoutMs`, `maxRequests` (hard budget), `maxPages`, `excludePatterns`, `ignoreQueryParams`, Googlebot UA for comparison |
| `probes.*` | Made-up URLs per dynamic route, URL-variant samples, legacy paths |
| `templates[]` | Regex → template name → source file. Drives grouping and "where to look". **Order matters**: the first match wins. |
| `thresholds.*` | Title/description lengths, thin-content heuristics, near-duplicate Jaccard, boilerplate share, deep click depth, slow TTFB |
| `render.*` | Browser path, samples per template, settle time |
| `repo.*` | Path to the Next.js app for route enumeration |
| `gsc.exportsDir` | Where Search Console CSVs go |
| `discover.*` | Templates to check for Discover readiness, whether to measure image sizes, image cap |

Severity, confidence, impact class, fixes and validation steps for each rule are in `src/rules.mjs`.

## Code layout

```
seo-audit/
  audit.config.json
  src/cli.mjs         CLI (audit / compare)
  src/audit.mjs       orchestration + all checks
  src/http.mjs        rate-limited GET client with manual redirect tracing and request budget
  src/robots.mjs      robots.txt parser (Google matching rules)
  src/sitemap.mjs     sitemap / sitemap-index loader
  src/extract.mjs     HTML extraction (metadata, links, content, signals)
  src/similarity.mjs  shingle Jaccard, boilerplate removal, clusters, per-template stats
  src/render.mjs      optional headless-Chrome comparison + lab metrics
  src/repo.mjs        Next.js App Router route enumeration
  src/gsc.mjs         Search Console CSV ingestion (overview + per-reason URL lists)
  src/image.mjs       image dimension sniffing (PNG/JPEG/GIF/WebP/AVIF headers)
  src/rules.mjs       rule catalog
  src/report.mjs      CSV/JSON/Markdown writers
  src/compare.mjs     run-to-run diff
```

## Limitations

- **It does not know what Google has indexed.** Without Search Console data, findings describe what Google *can* see, not what it decided.
- **Requests don't come from Google's IPs.** The Googlebot-UA comparison detects UA-based logic only. IP-verified bot rules (e.g. Vercel Firewall) need URL Inspection → *Test live URL*.
- **Lab performance only.** Render metrics come from unthrottled local Chrome and are directional. Core Web Vitals need CrUX / Search Console field data. TTFB is a single sample per URL.
- **Content heuristics are candidates, not verdicts.** "Thin" and "near-duplicate" flags use shingle statistics; they are prompts for human review, not rules Google applies.
- **Discovery is limited to links and the sitemap.** Pages reachable only through forms, search, or never-linked database rows aren't crawled. Use `repo` route enumeration and database checks for those.
- **Database checks are not part of the tool.** The DB-based findings in this audit's reports — sample investment records, seed articles, bulk `updated_at` — came from manual read-only queries. They're marked `source = manual-review` in `audit-results/issues.csv`.
- **History is not reconstructed.** Legacy URLs (old article IDs, GoldRate24 paths) are probed only for the paths listed in `probes.legacyPaths`. The Wayback Machine was offline during this audit.

## This audit's results

See `executive-summary.md` first, then `indexing-root-cause-report.md` and `fix-roadmap.md`. The CSVs here are copies from `runs/2026-10-21`. `issues.csv` also has 13 manual-review rows covering git history, database, code review and Search Console interpretation. For the 2026-10-21 update, start with `executive-summary.md` (top section), then `search-console-analysis.md` and `google-discover-readiness.md`.
