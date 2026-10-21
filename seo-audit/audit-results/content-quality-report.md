# Content quality report — gpaisa.in

**Date:** 2026-10-20

**Sources**
- Live crawl of 210 URLs (server HTML).
- Rendered DOM for 35 pages.
- Read-only `select` of the `articles`, `ipos`, `ncd_issues`, `rights_issues`, `buybacks`, `companies` and `ipo_reviews` tables (public anon key, the same access the browser has).
- Code review of templates.

**Scope note.** These are editorial-quality judgements. They are kept separate from the technical findings. **None of them is proven to be the cause of non-indexing**; they are the most likely quality-related contributors, so treat them as candidates. No arbitrary word-count minimum is applied. "Page-specific shingles" counts 5-word sequences left after removing text that repeats on ≥40% of pages (navigation, footer, disclaimers).

---

## 1. Inventory by page type

| Template | URLs | Median words (main) | Within-template similarity (median / max pair) | Verdict |
|---|---|---|---|---|
| Articles (on-topic) | 39 | 2,760 | 0.03 / 0.25 | **Strongest content on the site — keep** |
| Articles (off-topic, noindex) | 26 | 25 – 3,171 | — | 13 seed stubs to retire; 13 real tech posts to decide on |
| Calculators | 19 | 743 | 0.00 / 0.02 | Distinct and explained — keep and strengthen |
| Bank SIP / home-loan calculators | 30 | 334 | 0.00 / **0.50** | Programmatic; review value per page |
| Gold city | 10 | 1,055 | 0.23 / 0.23 | Distinct; keep |
| Silver city | 13 live (+2 × 404) | 1,003 | 0.26 / **0.75** (Madurai ↔ Mangalore) | Some pairs near-template |
| Glossary terms | 33 | 111 | 0.00 / 0.03 | Short but unique; enrich or consolidate |
| IPO / NCD / rights / buyback hubs | 7 | 26 – 82 | — | **Nearly empty** |
| IPO / NCD / rights / buyback details | 6 | 56 – 1,322 | — | **5 of 6 are fictitious sample data** |
| Category hubs | 3 (+ pagination) | 676 | — | Fine |
| Static info (about, contact, terms…) | 6 | 793 | — | Not in sitemap (fine); see trust section |

---

## 2. Must-fix quality problems

### 2.1 Fictitious investment records published as real — **High**

| URL | Evidence |
|---|---|
| `/ipo/nova-industries-ipo` | DRHP/RHP → `https://example.com/nova-drhp.pdf`; company website → `https://example.com/nova-industries`; status "open" (closed 2026-09-01) |
| `/ipo/bluepeak-textiles-ipo` | DRHP/RHP/BoA → `https://example.com/bluepeak-*.pdf` |
| `/ncd/orient-finance-corp-ncd` | Prospectus → `https://example.com/orient-ncd-prospectus.pdf`; "Stale — updated 51 days ago" on page |
| `/rights-issue/marigold-steels-rights-issue` | Letter of offer → `https://example.com/marigold-loo.pdf` |
| `/buyback/crestview-software-buyback` | Letter of offer → `https://example.com/crestview-loo.pdf` |

All 5 were created 2026-08-30, are `publish_status = published`, and are in the sitemap. The `ipo_reviews` table holds 3 reviews. `priority-jewels-ipo` has no placeholder links; verify it against exchange filings.

**Why it matters.** Invented IPO subscription figures, credit ratings and review verdicts on a finance site can mislead investors. They are also the clearest single low-trust signal on the domain.

**Fix.** Set the 5 records to `draft`. The existing code then sets noindex and drops them from the sitemap. Then the IPO, NCD, rights-issue and buyback hubs have nothing to show, so either populate them with verified real issues or temporarily noindex them and remove them from the navigation (see 2.3).

### 2.2 Seed/placeholder articles still live — **Medium**

These 13 articles were published 2026-03-24 with 25–175 words:
- Tech: `future-ai-agents-development`, `web3-decentralized-identity`, `postgresql-performance-tuning`, `complete-guide-rest-apis-nodejs`, `react-server-components-deep-dive`, `typescript-design-patterns`, `getting-started-docker-kubernetes`
- Travel: `exploring-ancient-temples-cambodia`, `backpacking-patagonia-budget`, `solo-travel-japan-guide`, `hidden-gems-southeast-asia`, `hiking-inca-trail-machu-picchu`, `street-food-tour-bangkok`

They are noindex today, but they were indexable for almost four months and still return 200.

**Recommendation.** Return **410** — there is no equivalent page to redirect to. The other 13 TECHNOLOGY articles (330–3,171 words, e.g. system-design guides) are real content in the wrong place: move them to a separate site, or keep them noindex. Do not redirect them into finance pages.

### 2.3 Near-empty hubs linked from every page — **Medium**

| Page | Words in main | In sitemap | Inlinks |
|---|---|---|---|
| `/rights-issue` | 26 | yes | 195 |
| `/buyback` | 26 | yes | 195 |
| `/ncd` | 28 | yes | 195 |
| `/ipo-calculator` | 47 | yes | 195 |
| `/ipo` | 56 | yes | 195 |
| `/ipo/listing-performance` | 59 | yes | 195 |
| `/ipo/gmp` | 82 | yes | 195 |

These pages render a list shell with almost nothing in it (and what's there is the sample data above). Google sees them as thin, and they get the site's strongest internal links. Either give each hub real, explanatory content — what an NCD is, how to read GMP, live verified listings — or noindex them and take them out of global navigation until they do.

### 2.4 Inaccurate trust claims — **Medium**

- The footer text (`lib/i18n/translations.ts:78`, and `components/home/TrustBand.tsx`) says data is "sourced from MCX, IBJA, LBMA, BSE, and NSE". The code (`lib/angelOneApi.ts`, `app/api/gold-calculator/route.ts`) fetches rates from Angel One's `kp-hl-httpapi-prod.angelone.in`. Name the real source, describe how rates are derived (making charges, GST, purity), and confirm the provider allows this use.
- The About page (`app/about/page.tsx:153`) mentions "a dedicated team of financial analysts, market researchers, and content specialists". All 65 articles credit one author, under three spellings (`SATYAPAL KHAKHAL` ×44, `Satyapal khakhal` ×11, `Satyapal Khakhal` ×11). Describe the team accurately.
- Missing: author page with relevant background, editorial policy, corrections policy, an affiliate/advertising disclosure covering credit-card content, and "last verified" dates on rate-dependent pages.

---

## 3. Review candidates (judgement calls)

### Glossary terms (33) — **enrich or merge**

The 33 terms (CAGR, XIRR, SIP, NAV, Sensex…) are unique — the most similar pair is 0.03 — but short (median 111 words). Each gets about 3 inlinks, almost all from other glossary pages. Only **1 of 39 articles** links to any glossary term.

Options:
- Expand each term with an Indian example, the formula where relevant, and a link to the related calculator and articles.
- Or fold the weakest terms into the `/glossary` hub as anchored sections.

Don't mass-generate text to hit a length.

### Bank programmatic calculators (30)

These are `/calculator/<bank>-sip-calculator` and `/calculator/<bank>-home-loan-calculator`:
- noindexed until 2026-07-12 (`git ddaebe3`), then indexable, but not in the sitemap;
- reachable mainly from `/calculator/sip` and `/calculator/home-loan`;
- the home-loan variants are up to 0.50 similar to each other (e.g. IDFC First ↔ Bandhan).

Keep a page indexable only if it holds bank-specific facts a user can't get from the generic calculator (current rate card with source and date, fees, eligibility). If not, consolidate into the generic calculator with a bank selector, or noindex. Whichever you choose, the sitemap and the robots directive must agree.

### Silver city pages

Most silver city pairs are distinct, but Madurai ↔ Mangalore is 0.75 similar. Those cities' extra content in `lib/citySilverData.ts` is thin compared with the main metros. Add real local information (main markets, local price factors) or drop the weakest cities from indexing.

### Articles

Articles are long (median 2,760 words) and distinct from each other. Specific fixes:
- **Every article body contains its own `<h1>`**: 35 of the 39 crawled have two H1s. 6 articles were pasted as full HTML documents including `<title>`/`<meta>` (e.g. `why-silver-prices-are-rising-faster-than-gold-in-2026` has two `<title>` elements). Strip document-level tags in the CMS on save.
- **Dates:** JSON-LD `dateModified` and OG `modifiedTime` are set to `published_at` (`app/articles/[slug]/page.tsx`), while the sitemap uses `updated_at`. Because of migration `0001_admin_cms_fields.sql` (`ADD COLUMN updated_at … DEFAULT now()`), 32 articles carry the identical timestamp `2026-07-12T18:04:21.832Z`. Add a real content-modified timestamp and show "Updated on" in the page.
- **Freshness:** many titles are tied to dates ("June 2026", "Fed meeting June 16–17", "best FD rates June 2026"). Either update them with current figures and a visible "last verified" date, or leave them as dated news. Don't present them as current guides.
- **Sources:** rate, tax and fee claims (repo rate, EPF 8.25%, FD rates, card fees) should cite the primary source (RBI, EPFO, bank fee schedules) inline.
- **Broken internal references:** 4 links point to old slugs (see the internal linking report).

### Calculators

Static review only; inputs were not exercised in a browser.
- **Formulas are standard and correct:**
  - SIP future value as an annuity due: `P·((1+i)^n−1)/i·(1+i)`
  - EMI: `P·r·(1+r)^n/((1+r)^n−1)`
  - FD: `P(1+r/n)^(nt)`
- All 19 pages render without errors, carry FAQ schema, and have a median of 743 words.
- No "formula" explanation was found on `/calculator/nps`, `/calculator/ssy` or `/calculator/income-tax` (income tax is slab-based, which is fine). Add the method and assumptions to NPS and SSY.
- **No "last verified" date** on `/calculator/fd`, `/calculator/nps`, `/calculator/hra`, `/calculator/swp`, `/calculator/gst`, `/calculator/simple-interest`. Rate-dependent pages (PPF, SSY, NSC, SCSS, EPF, FD) need the current rate, its source and an as-of date.
- Calculators link to **zero** articles or glossary terms. Adding contextual "learn more" links is the cheapest content-discovery win on the site (see the linking report).

---

## 4. Content to preserve

- **All 39 on-topic articles.** They have the most depth and are not duplicates. Credit-card reviews and comparisons, FD/RBI rate explainers, SSY/PPF/80C guides and EPF interest coverage are the core of a finance site.
- **The 19 core calculators.** They have distinct explanatory content and FAQs.
- **Gold city pages** and the gold/silver hubs. They have real per-city content (median about 1,000 words in the server HTML).
- **The gold/silver historical CSV datasets** in `public/`. These are a unique asset; consider an indexable, documented historical-data page.

---

## 5. Improvements by page type

| Page type | Improvement | Effort |
|---|---|---|
| Article | Single H1; real `dateModified`; visible "Updated on"; primary-source citations; link to 1–3 relevant calculators and glossary terms; author box linking to an author page | M |
| Calculator | Assumptions and formula section where missing; rate source with as-of date; "Related guides" block linking to articles | S each |
| Glossary | Indian worked example; related calculator link; related articles; merge the weakest terms | M |
| Gold/silver city | Server-render the rate table and related links (currently fetched from `/api/*`, which Googlebot cannot call); local market specifics | M |
| IPO/NCD/etc. | Only verified records with real documents; explanatory hub content; remove or noindex until populated | M |
| Site trust | Accurate About; author page; editorial and corrections policy; affiliate disclosure; correct data-source statement | M |
