# Google Discover readiness — gpaisa.in

**Date:** 2026-10-21 · **Basis:** live audit run `runs/2026-10-21` (39 on-topic articles checked, lead images measured), Search Console page-indexing export, and Google's published Discover guidance.

---

## The key point first

**Discover only shows pages that are already in Google's index.** There is no separate submission and no special markup that unlocks it. gpaisa.in currently has **1 indexed page** (the homepage), so **Discover traffic is not possible until article pages get indexed in Search.**

So the order can't be "Discover first, then Search". It has to be:

1. **Get indexed in Search.** Fix the metadata regression, remove the untrustworthy content, strengthen trust signals (`fix-roadmap.md` P0–P2).
2. **At the same time, make every article Discover-ready.** These fixes are cheap and also help Search (D1–D6 below).
3. **Then earn Discover** with timely, original, trustworthy finance coverage and a steady publishing rhythm.

Discover uses the same quality systems as Search, with a strong lean towards fresh, engaging content from publishers it trusts. A site Google won't index for Search won't appear in Discover. A site that Search trusts, with good images and timely stories, has a real chance.

---

## Readiness scorecard (articles)

| Discover requirement (Google guidance) | gpaisa.in today | Status |
|---|---|---|
| Page is indexed | 0 of 39 articles appear indexed (Search Console: Indexed = 1 site-wide) | ❌ Blocker |
| Allows large image previews: `max-image-preview:large` (or AMP) | **Missing on 39/39 articles.** Inconsistent elsewhere: present on the homepage, 15/19 calculators and the IPO pages; missing on all gold/silver city pages, glossary terms, category hubs and bank calculators. Each route sets its own `robots` object, and a page-level `robots` replaces the layout default. | ❌ |
| That robots meta is actually in `<head>` for Googlebot | Since the 2026-10-20 hosting move, article metadata (title, canonical, robots, OG) is served in `<body>` to Googlebot (Next.js streaming metadata) | ❌ |
| Large, relevant lead image ≥1200 px wide (not a logo) | 33/39 ≥1200 px (mostly 1536×1024). **6 are too small**: 500×317, 640×480, 750×400, 770×431, 916×640, 1024×683 | ⚠️ |
| Correct image metadata | `og:image:width/height` hard-coded as 1200×630 for every article whatever the real size; JSON-LD `image` is a single URL | ⚠️ |
| RSS/Atom feed for the **Follow** feature | **None**: `/feed.xml`, `/rss.xml`, `/atom.xml`, `/feed` all 404, and no `<link rel="alternate" type="application/rss+xml">` | ❌ |
| Accurate dates | JSON-LD `dateModified` = `datePublished` on every article; 32 articles share one bulk-migration timestamp as their sitemap `lastmod`; no visible "Updated on" | ⚠️ |
| Clear bylines and publisher transparency (Discover content policy) | Byline present but the author name has 3 spellings; no author page or credentials; About page overstates the team; data-source claims don't match the code | ⚠️ |
| Titles that describe the content without clickbait | Mostly fine, question-style. Mildly sensational: "Earliest Ever", "Where Smart Money Is Moving Now", "Hidden Patterns". Average length 94 characters. | ✅/⚠️ |
| No misleading content (Discover content policy) | Fictitious IPO/NCD records with "Should you apply" style reviews are live | ❌ Policy risk |
| Timely, original content | Last article 2026-07-19; several pieces tied to past months ("June 2026", "April 2026") | ⚠️ |
| Article structured data | `Article` with headline, image, dates, author (Person → /about), publisher logo | ✅ (accurate dates and author page needed) |
| Mobile rendering | Server-rendered, mobile viewport, CLS 0 on articles | ✅ |

---

## Discover fixes (code changes, about one day in total)

| ID | Change | Where | Effort |
|---|---|---|---|
| **D0** | Serve metadata in `<head>` to all user-agents: add `htmlLimitedBots: /.*/` to `next.config.mjs`, rebuild, redeploy and clear the cache. **Required before D1 can work.** | `next.config.mjs` | S |
| **D1** | One shared constant, e.g. `INDEXABLE_ROBOTS = { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }` in `lib/`. Use it in `app/layout.tsx` and in every route that sets `robots` (articles first; keep the noindex branch for dropped categories). | `lib/seo.ts` (new), `app/articles/[slug]/page.tsx`, other `generateMetadata` | S |
| **D2** | RSS feed: `app/feed.xml/route.ts` listing the latest ~50 on-topic articles (title, link, `pubDate`, description, `<media:content>` with the lead image, author). Add `alternates.types['application/rss+xml']` in `app/layout.tsx` so every page links to it. | new route + `app/layout.tsx` | S |
| **D3** | Replace the 6 small lead images with relevant, original images ≥1200 px wide (16:9 works well). Enforce a minimum width at upload in the admin editor. | Supabase `articles.image_url`; admin upload | S |
| **D4** | Store the real image width and height at upload; emit true `og:image:width/height`. In JSON-LD, provide the image in 16:9, 4:3 and 1:1 crops (Cloudinary transformations make this one line). | `app/articles/[slug]/page.tsx` | S |
| **D5** | Real modification dates: add `content_updated_at` (set only when the body or title changes); use it for JSON-LD `dateModified`, OG `modifiedTime`, sitemap `lastmod`, and a visible "Updated on …" line | DB + article template + `app/sitemap.ts` | S–M |
| **D6** | Use `NewsArticle` for time-sensitive news (RBI decisions, IPO coverage, gold moves), keep `Article` for evergreen guides. Author → a real `/author/satyapal-khakhal` page with background and credentials. | article template + new author page | M |

Validation after deploy (the audit checks all of this automatically: `npm run audit`):
- `curl -A "…Googlebot/2.1…" <article>`: the robots meta containing `max-image-preview:large` appears **before `</head>`**.
- `DISCOVER-NO-LARGE-IMAGE-PREVIEW`, `DISCOVER-NO-FEED`, `DISCOVER-IMAGE-SMALL` and `CANONICAL-IN-BODY` all drop to 0.
- `https://www.gpaisa.in/feed.xml` passes the W3C feed validator.

---

## The non-code part: what Discover rewards

Discover recommends stories to people based on their interests. For an Indian personal-finance site, three kinds of story get picked up:

1. **Timely explainers, published within hours.** Examples: RBI policy decisions, EPF/PPF/SSY rate announcements, budget and tax changes, big gold/silver moves, notable IPO openings and listings. Each needs gpaisa's own angle — a worked calculation using your calculators, "what this means for a ₹50 lakh home loan EMI", a chart from your 1964–2026 gold price dataset. Rewritten wire news isn't enough.
2. **Original data.** You hold unique assets: historical gold and silver price CSVs back to 1964/1981, city-level rates, calculators. Stories like "Gold has beaten FDs in X of the last 20 years — city by city" are the kind Discover rewards and others can't copy.
3. **Honest, first-hand product content.** Credit-card reviews written from real use (statement screenshots, actual reward maths) with clear affiliate disclosure.

**What hurts in Discover**
- Clickbait or withholding the answer.
- Sensational or unverifiable claims.
- Stale "2026" headlines kept alive after their date.
- Thin rewrites of other sites.
- Anything misleading about money — which is why the fictitious IPO pages must go first.
- Investment calls ("Should you apply?") without a clear basis, disclosure and accountability. Also check how SEBI's rules on research and investment recommendations apply to IPO "apply/avoid" verdicts.

**Cadence:** consistent beats bursty. A few well-researched, timely pieces a week, sustained for months, gives Google repeated evidence that the site is active and reliable.

---

## How you'll know it's working

1. Search Console → **Pages**: the *Indexed* count starts rising above 1 and the article URLs leave *Crawled – currently not indexed*. This comes first.
2. Search Console → **Performance → Search results**: impressions for article URLs.
3. Search Console → **Performance → Discover**: this report only **appears once the site reaches a minimum number of Discover impressions**. Its appearance is your first proof of Discover traffic.
4. Re-run `npm run audit` after each release; the *Google Discover readiness* section of `report.md` tracks D1–D4.

**Realistic timeline:** fixing the code takes days. Google reconsidering a site it has declined to index usually takes **weeks to months** after the trust problems are fixed and fresh, strong content is coming in. Nothing here guarantees indexing or Discover placement — these steps remove the reasons Google has to say no.
