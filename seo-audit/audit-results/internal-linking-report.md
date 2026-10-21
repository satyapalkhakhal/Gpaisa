# Internal linking report — gpaisa.in

**Date:** 2026-10-20 · **Basis:** link graph from the server HTML of 196 crawled 200-status pages. Only links present in the raw HTML are counted — that is what Google uses to discover pages before rendering. Click depth is measured from the homepage.

---

## 1. Summary

| Metric | Value |
|---|---|
| Orphan pages (in sitemap, zero internal inlinks) | **0** |
| Click depth of indexable pages | 0: 1 · 1: 85 · 2: 88 · 3: 5 · deeper: 0 |
| Broken internal links (target 4xx) | **14 target URLs**, linked from 6 source pages |
| Internal links to redirects | 1 target (`/finance` → 308 → `/category/business`), 3 source pages |
| Links only present after JavaScript | `/gold-rate` (16 city links), gold/silver city pages (6 related-article links each), `/silver-rate` (15) |
| Pages linked from every page (header/footer) | 48 URLs, including the 7 near-empty IPO/NCD/rights/buyback/IPO-calculator hubs and the noindex `/ipo/compare` |

**What this means.** The site is shallow and has no orphans, so pages are discoverable and **internal linking is not a site-wide indexing blocker**. The weaknesses are in *contextual* linking: content types barely link to each other, and the strongest links (global navigation) go to some of the weakest pages.

---

## 2. Broken internal links

| Broken target | Status | Linked from | Source of the link | Fix |
|---|---|---|---|---|
| `/calculator/fd/sbi`, `/hdfc`, `/icici`, `/axis`, `/post-office`, `/kotak` | 404 | `/calculator/fd` | `components/fd/FDContent.tsx:285-290` | Remove the links, or build the pages for real. No route exists. |
| `/calculator/rd` | 404 | `/calculator/fd` | `components/fd/FDContent.tsx:300` | Remove the link or build an RD calculator |
| `/calculator/compound-interest` | 404 | `/calculator/simple-interest`, `/calculator/mutual-fund` | `components/si/SIContent.tsx:228`, `components/mf/MFContent.tsx:204` | Remove, or point to an existing calculator |
| `/silver-rate/delhi`, `/silver-rate/kerala` | 404 | `/sitemap-page` (and the XML sitemap) | `app/sitemap-page/page.tsx` + `app/sitemap.ts` (`CITIES`) | Root cause: route existence depends on Angel One's city list (`fetchSilverCities`). Use one owned city list. |
| `/articles/gold-market-weekly-review-june-7-14-2026` | 404 | `/articles/fed-meeting-june-1617-2026-…` | CMS article HTML | 301 → `/articles/gold-market-weekly-review-why-gold-fell-13760-per-10-grams-in-2-weeks-and-what-happens-next`; fix the link in content |
| `/articles/gold-prices-nearly-doubled-from-2024-to-2026` | 404 | `/articles/pm-modi-asks-indians-to-stop-buying-gold-…` | CMS article HTML | 301 → `/articles/gold-prices-nearly-doubled-20242026-why-indian-buyers-are-now-hesitating-before-weddings-festivals`; fix the link |
| `/articles/gold-falling-silver-slippingsmart-investors-are-doing-this-in-2026` | 404 | `/articles/gold-vs-silver-april-2026-…` | CMS article HTML | No published article with this slug exists. Remove the link, or 301 to the closest current gold-vs-silver article if it's the same piece. |
| `/articles/gold-rate-buy-or-wait-2026` | 404 | `/articles/gold-vs-silver-april-2026-…` | CMS article HTML | Same as above — verify, then remove or 301 |

**Other redirect target:** `/finance` (308 → `/category/business`) is linked from the "Explore More Tools" buttons in `components/sip/SIPEducationalContent.tsx:228`, `components/ppf/PPFEducationalContent.tsx:290` and `components/emi/EMIEducationalContent.tsx:233`. The anchor says "tools" but the target is a news category. Point these at `/calculator`.

---

## 3. Pages with weak discovery paths

| Group | URLs | Inlinks (median) | Linked from | Issue |
|---|---|---|---|---|
| Bank SIP / home-loan calculators | 30 | 1 | `/calculator/sip` (15), `/calculator/home-loan` (15), homepage (4) | Not in the XML sitemap either. Weakest discovery path of any indexable template. |
| Glossary terms | 33 | 3 | other glossary terms (94 links), `/glossary` (33) | Only **1 of 39 articles** links to a glossary term; calculators link to none. |
| Articles | 39 | 6 | homepage/news/category lists, related-article blocks | Fewest inlinks: credit-card articles with 3 (`axis-atlas-credit-card-benefits-…`, `best-credit-cards-for-dining-…`, `the-credit-card-that-gives-you-free-gym-membership-…`). |
| Silver cities not in sitemap | 5 (`chandigarh`, `jaipur`, `lucknow`, `madurai`, `mangalore`) | 12 | other silver city pages | Indexable but missing from the XML sitemap. `/silver-rate/mumbai` and `/silver-rate/pune` have only 1 inlink (city lists on other pages skip them). |
| IPO detail / other investments | 6 | 1–5 | hubs | Mostly sample data — see the content report. |

---

## 4. Links Google can't get from the server HTML

Google discovers links in the raw HTML first and in rendered HTML later.

- **`/gold-rate`**: 16 city links (`/gold-rate/delhi`, `/chennai`, …) appear only after `components/CityWiseGoldRates.tsx` fetches `/api/gold-calculator`. Because `robots.txt` disallows `/api/`, **Googlebot will never get these links from rendering either.** The city pages are still reachable from other pages (median 11 inlinks), so this weakens the hub; it doesn't orphan them.
- **`/silver-rate`**: 15 links depend on `/api/silver/*` (disallowed). The endpoint also returned HTTP 500 in 2 of 3 render runs.
- **Gold/silver city pages**: the 6 "latest articles" links are loaded client-side (`GoldNewsSection` / `SilverNewsSection`).

**Fix.** Render these lists on the server — the pages already receive `initialHeroData` server-side, and the same pattern works for the city list. Don't open `/api/` broadly in robots.txt. If needed, allow specific read-only GET endpoints instead.

---

## 5. Navigation sends equity to weak pages

The header and footer link from every page to 48 URLs. Among them:
- `/ipo`, `/ipo/gmp`, `/ipo/listing-performance`, `/ipo-calculator`, `/ncd`, `/rights-issue`, `/buyback` — 26 to 82 words each, populated mostly with sample data;
- `/ipo/compare` — noindex;
- `/markets` is noindex but is **not** in global navigation (fine).

Until those sections hold real content, move them out of global navigation (one "IPO" entry is enough). Use the space for the pages that should rank: the calculators hub, gold rate, top guides.

---

## 6. Recommended structure for a personal-finance site

```
Home
├── Calculators hub (/calculator) ─┬─ each calculator ── "Related guides" (2-3 articles) + "Key terms" (glossary)
│                                  └─ bank variants (only if bank-specific data is real)
├── Gold & silver (/gold-rate, /silver-rate) ── city pages (server-rendered list) ── gold articles
├── Guides / News (/news, /category/*) ── articles ── "Try the calculator" box + glossary links in text
├── Glossary (/glossary) ── terms ── related calculator + related articles
└── IPO (/ipo) ── only verified, current issues
```

**Linking rules**
1. Each article links to the 1–3 calculators it discusses. These links already exist through navigation, so make them contextual, in the text.
2. On first use in an article, link the term to its glossary entry.
3. Each calculator links back to the 2–3 most relevant articles.
4. Article breadcrumbs should point to the real category hub. Today `BreadcrumbList` level 2 is always `/news`, labelled with the raw DB value (e.g. "BUSINESS") — see `app/articles/[slug]/page.tsx`.
5. Keep pagination crawlable. `/category/finance?page=2` already self-canonicalises, and `?page=1` canonicalises to the base URL — correct.
