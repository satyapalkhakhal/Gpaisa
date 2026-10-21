// Rule catalog. Each detected occurrence references a rule code; the report
// aggregates occurrences per (rule, template) into one issue row.
//
// impact:
//   direct-indexability  — can by itself stop a URL being crawled/indexed
//   indirect-indexing    — affects discovery, canonical selection or crawl priority
//   ranking-quality      — mainly a ranking / snippet / quality concern

const GSC_VERIFY = 'Search Console → URL Inspection on 2-3 affected URLs (Test live URL), then Page indexing report for the URL group after recrawl.';

export const RULES = {
    // ── Host / protocol ──
    'HOST-SERVES-200': {
        title: 'Non-canonical host variant serves content without redirect',
        category: 'canonicalization', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Two hosts serving the same pages split signals and force Google to pick a canonical itself.',
        fix: 'Redirect every non-canonical host/protocol variant to the canonical origin with a single 301/308.',
        inspect: 'Vercel → Project → Domains; vercel.json; middleware.ts', effort: 'S',
        validation: 'curl -sI each host variant; expect one 301/308 hop to https://www.gpaisa.in/.',
    },
    'HOST-TEMP-REDIRECT': {
        title: 'Host variant uses a temporary redirect',
        category: 'canonicalization', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: '302/307 redirects signal the move is temporary, so Google may keep the source URL as canonical.',
        fix: 'Use 301/308 for host and protocol consolidation.',
        inspect: 'Vercel → Domains redirect setting; vercel.json', effort: 'S',
        validation: 'curl -sI the variant and confirm 301 or 308.',
    },
    'HOST-REDIRECT-CHAIN': {
        title: 'Redirect chain (more than one hop) to canonical URL',
        category: 'redirects', severity: 'Low', confidence: 'High', impact: 'indirect-indexing',
        why: 'Each extra hop costs a crawl fetch and delays consolidation; Google follows up to ~10 hops, so short chains are not blocking.',
        fix: 'Point the first redirect straight at the final canonical URL.',
        inspect: 'Vercel Domains (redirect target for the domain); vercel.json', effort: 'S',
        validation: 'curl -sIL the source; expect exactly one 3xx before the 200.',
    },
    'RELATED-DOMAIN-CHAIN': {
        title: 'Related domain redirects via an intermediate host',
        category: 'redirects', severity: 'Low', confidence: 'High', impact: 'indirect-indexing',
        why: 'A related/legacy domain that hops through the apex before reaching www adds latency to signal consolidation.',
        fix: 'Set the related domain\'s Vercel redirect destination to https://www.gpaisa.in (path preserved).',
        inspect: 'Vercel project that owns the related domain → Domains → Redirect to', effort: 'S',
        validation: 'curl -sIL https://goldrate24.in/gold-rate/delhi → one hop to https://www.gpaisa.in/gold-rate/delhi.',
    },
    'RELATED-DOMAIN-SERVES-CONTENT': {
        title: 'Related domain serves its own content (possible cross-domain duplicate)',
        category: 'duplicate-content', severity: 'High', confidence: 'Medium', impact: 'indirect-indexing',
        why: 'If the same content is available on two domains Google picks one canonical and may index only one.',
        fix: 'Decide domain ownership; 301 the duplicate domain or make content genuinely distinct with correct canonicals.',
        inspect: 'Related domain hosting project', effort: 'M',
        validation: 'curl the related domain; confirm redirect or distinct content.',
    },

    // ── robots.txt ──
    'ROBOTS-UNAVAILABLE': {
        title: 'robots.txt not reachable (non-200/404)',
        category: 'crawl-access', severity: 'Critical', confidence: 'High', impact: 'direct-indexability',
        why: 'A 5xx/timeout on robots.txt makes Google pause crawling the whole site.',
        fix: 'Serve robots.txt with 200 (or 404 if you want no rules).',
        inspect: 'app/robots.ts', effort: 'S', validation: 'curl -sI https://www.gpaisa.in/robots.txt',
    },
    'ROBOTS-NO-SITEMAP': {
        title: 'robots.txt does not declare a sitemap',
        category: 'crawl-access', severity: 'Low', confidence: 'High', impact: 'indirect-indexing',
        why: 'The Sitemap directive helps all crawlers find the sitemap without Search Console.',
        fix: 'Add a Sitemap: line.', inspect: 'app/robots.ts', effort: 'S', validation: 'Fetch robots.txt.',
    },
    'ROBOTS-BLOCKS-URL': {
        title: 'robots.txt blocks a URL that is in the sitemap or linked internally',
        category: 'crawl-access', severity: 'Critical', confidence: 'High', impact: 'direct-indexability',
        why: 'Blocked URLs cannot be crawled; they may appear URL-only or not at all, and their content is never read.',
        fix: 'Remove the Disallow rule or remove the URL from sitemap/internal links if exclusion is intended.',
        inspect: 'app/robots.ts', effort: 'S', validation: 'Search Console robots.txt report; URL Inspection.',
    },
    'ROBOTS-BLOCKS-RESOURCES': {
        title: 'robots.txt blocks rendering resources (JS/CSS)',
        category: 'rendering', severity: 'High', confidence: 'High', impact: 'direct-indexability',
        why: 'Google renders pages; blocked /_next/ assets can leave the rendered page empty or broken.',
        fix: 'Allow /_next/static/ and other asset paths.', inspect: 'app/robots.ts', effort: 'S',
        validation: 'URL Inspection → View crawled page → Page resources.',
    },

    // ── Sitemap ──
    'SITEMAP-HTTP': {
        title: 'Sitemap not served with HTTP 200',
        category: 'sitemap', severity: 'Critical', confidence: 'High', impact: 'indirect-indexing',
        why: 'An unreachable sitemap removes the main discovery path for deep pages.',
        fix: 'Make the sitemap return 200 XML.', inspect: 'app/sitemap.ts', effort: 'S', validation: 'Search Console → Sitemaps status = Success.',
    },
    'SITEMAP-PARSE': {
        title: 'Sitemap XML invalid or unexpected root element',
        category: 'sitemap', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Unparseable sitemaps are rejected.', fix: 'Fix the XML generator.', inspect: 'app/sitemap.ts', effort: 'S',
        validation: 'Validate XML; Search Console Sitemaps report.',
    },
    'SITEMAP-NON200': {
        title: 'Sitemap lists URLs that do not return 200',
        category: 'sitemap', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Error URLs in a sitemap waste crawl and reduce trust in the sitemap as a signal.',
        fix: 'Only emit URLs that resolve 200; fix or drop broken entries.', inspect: 'app/sitemap.ts', effort: 'S',
        validation: 'Re-run audit; sitemap entries all 200.',
    },
    'SITEMAP-REDIRECT': {
        title: 'Sitemap lists URLs that redirect',
        category: 'sitemap', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Sitemaps should list final canonical URLs; redirecting entries are reported as "Page with redirect".',
        fix: 'Emit the redirect target instead.', inspect: 'app/sitemap.ts', effort: 'S', validation: 'Re-run audit.',
    },
    'SITEMAP-NOINDEX': {
        title: 'Sitemap lists noindex URLs',
        category: 'sitemap', severity: 'High', confidence: 'High', impact: 'direct-indexability',
        why: 'Contradictory signals: the sitemap asks for indexing while the page forbids it ("Submitted URL marked noindex").',
        fix: 'Either remove noindex or drop the URL from the sitemap.', inspect: 'app/sitemap.ts + page generateMetadata', effort: 'S',
        validation: GSC_VERIFY,
    },
    'SITEMAP-CANONICAL-MISMATCH': {
        title: 'Sitemap URL declares a different canonical',
        category: 'sitemap', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Google treats the sitemap URL as a duplicate of the canonical target and will usually not index it.',
        fix: 'List only self-canonical URLs, or fix the canonical tag.', inspect: 'app/sitemap.ts + page alternates.canonical', effort: 'S',
        validation: GSC_VERIFY,
    },
    'SITEMAP-DUPLICATE-ENTRY': {
        title: 'Duplicate <loc> entries in sitemap',
        category: 'sitemap', severity: 'Low', confidence: 'High', impact: 'indirect-indexing',
        why: 'Harmless but indicates generator bugs.', fix: 'De-duplicate entries.', inspect: 'app/sitemap.ts', effort: 'S', validation: 'Re-run audit.',
    },
    'SITEMAP-HOST-MISMATCH': {
        title: 'Sitemap URL host/protocol differs from canonical origin',
        category: 'sitemap', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'URLs outside the property/host are ignored or reported as redirects.',
        fix: 'Emit canonical-origin URLs only.', inspect: 'app/sitemap.ts', effort: 'S', validation: 'Re-run audit.',
    },
    'SITEMAP-LASTMOD-NOW': {
        title: 'Sitemap lastmod is set to generation time instead of real modification date',
        category: 'sitemap', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Google uses lastmod only if it is consistently accurate. Stamping "now" on every request teaches Google to ignore lastmod for the whole sitemap, removing a recrawl signal for genuinely updated pages.',
        fix: 'Use the content\'s real updated_at (DB) or a build/content hash date; omit lastmod where unknown.',
        inspect: 'app/sitemap.ts (lastModified: new Date())', effort: 'S',
        validation: 'Fetch sitemap twice minutes apart; lastmod values must not change unless content changed.',
    },
    'SITEMAP-LASTMOD-BULK': {
        title: 'Many sitemap entries share one lastmod from a bulk database update',
        category: 'sitemap', severity: 'Low', confidence: 'Medium', impact: 'indirect-indexing',
        why: 'A schema migration or bulk UPDATE touched updated_at on every row, so lastmod no longer reflects real content edits.',
        fix: 'Track a content-specific modified date (e.g. content_updated_at set only when title/body change) and use it for lastmod and dateModified.',
        inspect: 'supabase/migrations (bulk UPDATE), app/sitemap.ts', effort: 'S',
        validation: 'Sitemap lastmod values differ per article and match visible "updated" dates.',
    },
    'SITEMAP-OMISSION': {
        title: 'Indexable, self-canonical page missing from sitemap',
        category: 'sitemap', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Pages reachable only via links are discovered later and given lower crawl priority; omission also suggests the page is not considered important.',
        fix: 'Add the URL to the sitemap if it should be indexed; otherwise noindex or consolidate it.',
        inspect: 'app/sitemap.ts', effort: 'S', validation: 'Re-run audit; Search Console Sitemaps → discovered URL count.',
    },

    // ── Status codes ──
    'PAGE-4XX': {
        title: 'Internally linked/sitemap URL returns 4xx',
        category: 'http-status', severity: 'High', confidence: 'High', impact: 'direct-indexability',
        why: '4xx URLs are dropped from the index; internal links to them waste crawl and frustrate users.',
        fix: 'Fix the link target, restore the page, or 301 to the closest equivalent page.', inspect: 'Linking component / route', effort: 'S',
        validation: 'Re-run audit; Search Console "Not found (404)" group shrinks after recrawl.',
    },
    'PAGE-5XX': {
        title: 'URL returns 5xx or fails to fetch',
        category: 'http-status', severity: 'Critical', confidence: 'High', impact: 'direct-indexability',
        why: 'Server errors stop indexing of the URL and, if widespread, reduce crawl rate for the whole host.',
        fix: 'Fix the server error (check Vercel function logs for the route).', inspect: 'Vercel → Logs; route file', effort: 'M',
        validation: 'curl the URL repeatedly; Search Console Crawl stats → by response.',
    },
    'SOFT404-PROBE': {
        title: 'Non-existent URL under this route returns HTTP 200 (soft 404)',
        category: 'http-status', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Unbounded dynamic routes that answer 200 for anything create infinite low-value URLs and "Soft 404" reports.',
        fix: 'Call notFound() when the slug/param is unknown so the route returns 404.', inspect: 'Dynamic route page.tsx', effort: 'S',
        validation: 'curl -sI a made-up slug; expect 404.',
    },
    'LEGACY-UNKNOWN-REDIRECT': {
        title: 'Unknown legacy URLs redirect to an unrelated hub instead of 404/410',
        category: 'redirects', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Google treats mass redirects of unrelated URLs to a hub/homepage as soft 404s; it also keeps re-crawling them. Legacy URLs whose content no longer exists should return 404/410; ones that map to a real page should 301 to that page.',
        fix: 'Return 404 (or 410) when the legacy ID has no slug; keep 301 only for IDs that resolve.',
        inspect: 'middleware.ts (articleIdMatch fallback → /news)', effort: 'S',
        validation: 'curl -sI https://www.gpaisa.in/articles/999999999 → 404/410.',
    },
    'SOFT404-SIGNAL': {
        title: 'HTTP 200 page shows empty/error-state wording',
        category: 'http-status', severity: 'Medium', confidence: 'Low', impact: 'indirect-indexing',
        why: 'Google may classify 200 pages that look empty or errored as soft 404s and exclude them.',
        fix: 'Render real content, or return 404 / noindex while the page has no data.', inspect: 'Template', effort: 'S',
        validation: 'URL Inspection → View crawled page screenshot.',
    },

    // ── Robots directives ──
    'PAGE-NOINDEX': {
        title: 'Page carries noindex (verify intentional)',
        category: 'robots-directives', severity: 'Low', confidence: 'High', impact: 'direct-indexability',
        why: 'noindex removes the page from the index. Fine if intentional; harmful if applied to important pages.',
        fix: 'Confirm intent. Remove noindex from pages that should rank.', inspect: 'generateMetadata robots', effort: 'S', validation: GSC_VERIFY,
    },
    'PAGE-NOINDEX-LINKED-PROMINENTLY': {
        title: 'noindex page is linked from many pages (navigation)',
        category: 'robots-directives', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Site-wide links to a noindex page spend crawl on a page that will never rank. Usually a sign the page should either be indexable or not in navigation.',
        fix: 'Decide: make the page indexable with real content, or remove it from global navigation.', inspect: 'components/Header.tsx / Footer.tsx', effort: 'S', validation: 'Re-run audit.',
    },

    // ── Canonical ──
    'CANONICAL-MISSING': {
        title: 'No canonical tag',
        category: 'canonicalization', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Without a canonical Google chooses one itself; parameter/variant URLs may be picked instead.',
        fix: 'Add alternates.canonical in generateMetadata.', inspect: 'Template page.tsx', effort: 'S', validation: 'View source; re-run audit.',
    },
    'CANONICAL-MULTIPLE': {
        title: 'Multiple canonical tags',
        category: 'canonicalization', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Google ignores all canonicals when several conflicting ones are present.',
        fix: 'Emit exactly one canonical.', inspect: 'Template + layout metadata', effort: 'S', validation: 'View source.',
    },
    'CANONICAL-IN-BODY': {
        title: 'Canonical/robots/title/OG metadata served in <body> to Googlebot',
        category: 'canonicalization', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'Google ignores rel=canonical outside <head>, and robots meta (noindex, max-image-preview) belongs in <head>. In Next.js ≥15.2 dynamic routes stream generateMetadata output into <body> unless the user-agent matches htmlLimitedBots; the default list matches Google-InspectionTool but not Googlebot, so URL Inspection shows a correct page while Googlebot gets the streamed one.',
        fix: 'Disable streaming metadata: set htmlLimitedBots: /.*/ in next.config.mjs (or a regex that includes Googlebot), rebuild, redeploy, and purge the ISR/page cache so previously cached HTML is regenerated.',
        inspect: 'next.config.mjs; dynamic routes with generateMetadata (articles, category, ipo)', effort: 'S',
        validation: 'curl -A "…Googlebot/2.1…" <article URL> → <link rel="canonical"> appears before </head>. Re-run audit → CANONICAL-IN-BODY = 0.',
    },
    'METADATA-STREAMED-NONBOT': {
        title: 'Metadata streamed into <body> for non-bot user-agents (Next.js streaming metadata)',
        category: 'canonicalization', severity: 'Low', confidence: 'High', impact: 'indirect-indexing',
        why: 'Googlebot receives metadata in <head> (Next.js treats it as an HTML-limited bot), so Google is unaffected. Crawlers missing from Next\'s bot list (some SEO tools, social/LLM bots) may see canonical/robots in <body>, where they are ignored.',
        fix: 'Optional: make the route cacheable (ISR) so generateMetadata resolves before flush, or set htmlLimitedBots in next.config to cover additional crawlers.',
        inspect: 'next.config.mjs (htmlLimitedBots); route data fetching (cache: no-store makes the route dynamic)', effort: 'S',
        validation: 'curl with a non-bot UA on a cache MISS: canonical should be in <head>.',
    },
    'CANONICAL-TO-OTHER': {
        title: 'Canonical points to a different URL',
        category: 'canonicalization', severity: 'Medium', confidence: 'Medium', impact: 'indirect-indexing',
        why: 'The page asks Google to index another URL instead; it will usually be reported as "Alternate page with proper canonical".',
        fix: 'Confirm this consolidation is intended; otherwise make the canonical self-referencing.', inspect: 'generateMetadata alternates', effort: 'S', validation: GSC_VERIFY,
    },
    'CANONICAL-TO-HOMEPAGE': {
        title: 'Inner page canonicalises to the homepage',
        category: 'canonicalization', severity: 'Critical', confidence: 'High', impact: 'direct-indexability',
        why: 'All such pages are treated as duplicates of the homepage — a classic cause of "only homepage indexed".',
        fix: 'Self-referencing canonicals on every indexable page.', inspect: 'generateMetadata / layout metadataBase', effort: 'S', validation: GSC_VERIFY,
    },
    'CANONICAL-CROSS-DOMAIN': {
        title: 'Canonical points to another domain/host',
        category: 'canonicalization', severity: 'High', confidence: 'High', impact: 'direct-indexability',
        why: 'The page defers indexing to another host.', fix: 'Point canonical at the canonical origin.', inspect: 'generateMetadata', effort: 'S', validation: GSC_VERIFY,
    },
    'CANONICAL-TARGET-BAD': {
        title: 'Canonical target redirects, errors, or is noindex',
        category: 'canonicalization', severity: 'High', confidence: 'High', impact: 'indirect-indexing',
        why: 'A canonical must point to a 200, indexable URL; otherwise Google ignores it or drops both URLs.',
        fix: 'Point the canonical at the final 200 URL.', inspect: 'generateMetadata', effort: 'S', validation: 'Re-run audit.',
    },
    'URL-VARIANT-NOT-CONSOLIDATED': {
        title: 'URL variant (trailing slash / case / tracking params) not consolidated',
        category: 'canonicalization', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing',
        why: 'Variant URLs that serve 200 without redirect or a clean canonical create duplicates.',
        fix: 'Redirect the variant or ensure canonical points to the clean URL.', inspect: 'next.config.mjs (trailingSlash) / middleware.ts', effort: 'S',
        validation: 'curl variant URLs.',
    },

    // ── Metadata ──
    'TITLE-MISSING': { title: 'Missing <title>', category: 'metadata', severity: 'High', confidence: 'High', impact: 'ranking-quality', why: 'Titles are a primary relevance and snippet signal.', fix: 'Add a unique title.', inspect: 'generateMetadata', effort: 'S', validation: 'View source.' },
    'TITLE-MULTIPLE': { title: 'Multiple <title> elements', category: 'metadata', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Conflicting titles; Google picks one or rewrites.', fix: 'Emit one title.', inspect: 'Template', effort: 'S', validation: 'View source.' },
    'TITLE-DEFAULT': { title: 'Page uses the site-wide default title', category: 'metadata', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Default titles make pages look like duplicates of the homepage.', fix: 'Give the route its own metadata.', inspect: 'Template generateMetadata', effort: 'S', validation: 'View source.' },
    'TITLE-DUPLICATE': { title: 'Duplicate title across URLs', category: 'metadata', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Duplicate titles hint at duplicate pages and weaken relevance.', fix: 'Make titles unique per page.', inspect: 'Template generateMetadata', effort: 'S', validation: 'Re-run audit.' },
    'TITLE-LONG': { title: 'Title longer than recommended', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Long titles get truncated or rewritten in results; not an indexing issue.', fix: 'Front-load the key topic; trim brand suffix duplication.', inspect: 'generateMetadata', effort: 'S', validation: 'Re-run audit.' },
    'DESC-MISSING': { title: 'Missing meta description', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Snippet quality only.', fix: 'Add a descriptive summary.', inspect: 'generateMetadata', effort: 'S', validation: 'View source.' },
    'DESC-DUPLICATE': { title: 'Duplicate meta description across URLs', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Snippet quality; weak duplicate hint.', fix: 'Write page-specific descriptions.', inspect: 'generateMetadata', effort: 'S', validation: 'Re-run audit.' },
    'DESC-LENGTH': { title: 'Meta description too short or too long', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Snippet quality only.', fix: 'Aim for ~120-160 chars.', inspect: 'generateMetadata', effort: 'S', validation: 'Re-run audit.' },
    'H1-MISSING': { title: 'No <h1>', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Heading clarity aids understanding; not an indexing blocker.', fix: 'Add one descriptive H1.', inspect: 'Template', effort: 'S', validation: 'Re-run audit.' },
    'H1-MULTIPLE': { title: 'Multiple <h1>', category: 'metadata', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Minor structural issue.', fix: 'Keep one primary H1.', inspect: 'Template', effort: 'S', validation: 'Re-run audit.' },
    'VIEWPORT-MISSING': { title: 'No viewport meta tag', category: 'mobile', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Mobile-first indexing renders with a mobile viewport.', fix: 'Add viewport (Next.js adds it by default).', inspect: 'app/layout.tsx', effort: 'S', validation: 'View source.' },

    // ── Structured data ──
    'JSONLD-PARSE-ERROR': { title: 'Invalid JSON-LD block', category: 'structured-data', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Invalid structured data is ignored.', fix: 'Fix JSON serialisation.', inspect: 'Template JSON-LD', effort: 'S', validation: 'Rich Results Test.' },
    'JSONLD-DATEMODIFIED-STALE': { title: 'Article dateModified equals datePublished while content was updated later', category: 'structured-data', severity: 'Low', confidence: 'Medium', impact: 'ranking-quality', why: 'Inconsistent freshness signals between sitemap lastmod and on-page dates.', fix: 'Use updated_at for dateModified / article:modified_time.', inspect: 'app/articles/[slug]/page.tsx', effort: 'S', validation: 'Rich Results Test; compare with sitemap lastmod.' },
    'JSONLD-RATING-CHECK': { title: 'aggregateRating present — verify it is genuine and visible', category: 'structured-data', severity: 'Medium', confidence: 'Low', impact: 'ranking-quality', why: 'Ratings not backed by real visible reviews violate structured-data policy and can earn a manual action.', fix: 'Remove unless backed by real, visible user reviews.', inspect: 'Template JSON-LD', effort: 'S', validation: 'Rich Results Test; manual review.' },

    // ── Content ──
    'CONTENT-THIN': { title: 'Low page-specific text in initial HTML (candidate for review)', category: 'content-quality', severity: 'Medium', confidence: 'Low', impact: 'ranking-quality', why: 'Not a hard rule — but pages with little unique text beyond the site template are frequent "Crawled/Discovered – currently not indexed" candidates.', fix: 'Add genuinely useful, page-specific content, or consolidate/noindex pages that cannot be made distinct.', inspect: 'Template + content source', effort: 'M', validation: 'Manual review; URL Inspection after recrawl.' },
    'CONTENT-PLACEHOLDER': { title: 'Page shows placeholder/sample data (example.com links, filler text)', category: 'content-quality', severity: 'High', confidence: 'High', impact: 'ranking-quality', why: 'Sample records presented as real financial information mislead users and are a strong low-quality / trust signal on a YMYL site; they can drag down how Google assesses the whole site.', fix: 'Unpublish sample records (publish_status = draft → page becomes noindex and drops out of the sitemap) and replace with verified real data before re-publishing.', inspect: 'Supabase rows behind the page (publish_status); admin CMS', effort: 'S', validation: 'Re-run audit: CONTENT-PLACEHOLDER count = 0; URL no longer in sitemap.' },
    'CONTENT-NEAR-DUP': { title: 'Near-duplicate page-specific content across URLs', category: 'duplicate-content', severity: 'Medium', confidence: 'Medium', impact: 'indirect-indexing', why: 'Google clusters near-duplicates and indexes one representative ("Duplicate without user-selected canonical").', fix: 'Differentiate the pages materially or consolidate with redirects/canonical.', inspect: 'Template + data source', effort: 'M', validation: 'Re-run audit; Search Console duplicate groups.' },

    // ── Internal links ──
    'LINK-BROKEN': { title: 'Internal link to a 4xx/5xx URL', category: 'internal-linking', severity: 'High', confidence: 'High', impact: 'indirect-indexing', why: 'Broken internal links waste crawl and leak link equity.', fix: 'Fix or remove the link.', inspect: 'Linking component', effort: 'S', validation: 'Re-run audit.' },
    'LINK-TO-REDIRECT': { title: 'Internal link points to a redirecting URL', category: 'internal-linking', severity: 'Low', confidence: 'High', impact: 'indirect-indexing', why: 'Extra hop per crawl; mixed canonical signals.', fix: 'Link directly to the final URL.', inspect: 'Linking component', effort: 'S', validation: 'Re-run audit.' },
    'ORPHAN-SITEMAP-ONLY': { title: 'Sitemap URL with no internal links from crawled pages (orphan)', category: 'internal-linking', severity: 'High', confidence: 'High', impact: 'indirect-indexing', why: 'Pages known only from the sitemap get little crawl priority and no internal PageRank — a common pattern behind "Discovered – currently not indexed".', fix: 'Link the page from relevant hubs, categories and related content.', inspect: 'Hub/category templates, Header/Footer', effort: 'M', validation: 'Re-run audit; inbound link count > 0.' },
    'WEAK-INBOUND': { title: 'Only one internal page links here', category: 'internal-linking', severity: 'Low', confidence: 'High', impact: 'indirect-indexing', why: 'Weak discovery path.', fix: 'Add contextual links from related pages.', inspect: 'Related-content components', effort: 'S', validation: 'Re-run audit.' },
    'DEEP-PAGE': { title: 'Page is deep in click-depth from the homepage', category: 'internal-linking', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing', why: 'Deep pages are crawled less often.', fix: 'Surface via hubs/related links.', inspect: 'Hub templates', effort: 'S', validation: 'Re-run audit.' },

    // ── Rendering / UA ──
    'UA-DIFFERENCE': { title: 'Response differs for Googlebot user-agent', category: 'crawl-access', severity: 'Critical', confidence: 'Medium', impact: 'direct-indexability', why: 'Bot protection or UA-based logic may block/alter content for Googlebot.', fix: 'Remove UA-specific behaviour; allow verified bots in Vercel Firewall.', inspect: 'Vercel Firewall / middleware.ts', effort: 'M', validation: 'URL Inspection → Test live URL.' },
    'RENDER-META-DIFF': { title: 'Rendered DOM metadata differs from server HTML', category: 'rendering', severity: 'High', confidence: 'High', impact: 'indirect-indexing', why: 'Conflicting raw vs rendered title/canonical/robots confuse canonical and index decisions.', fix: 'Keep metadata server-rendered only.', inspect: 'Client components touching document.head', effort: 'M', validation: 'URL Inspection → rendered HTML.' },
    'RENDER-CONTENT-CLIENT-ONLY': { title: 'Most primary content appears only after JavaScript', category: 'rendering', severity: 'High', confidence: 'Medium', impact: 'indirect-indexing', why: 'Google renders JS, but rendering is deferred and fragile; content missing from HTML is a risk.', fix: 'Server-render primary content.', inspect: 'Template client components', effort: 'L', validation: 'URL Inspection → View crawled page.' },
    'RENDER-LINKS-CLIENT-ONLY': { title: 'Internal links present only after JavaScript', category: 'rendering', severity: 'Medium', confidence: 'Medium', impact: 'indirect-indexing', why: 'Links injected by JS are discovered later (after render), slowing discovery.', fix: 'Render navigation/related links as <a href> on the server.', inspect: 'Client components', effort: 'M', validation: 'Re-run audit with --render.' },
    'RENDER-DEPENDS-ON-BLOCKED-API': { title: 'Rendered content depends on API requests that robots.txt blocks for Googlebot', category: 'rendering', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing', why: 'Googlebot obeys robots.txt for XHR/fetch too: content and links that client components load from /api/* never appear in Google\'s rendered page.', fix: 'Server-render that data (pass it as props from the server component), or allow the specific read-only GET endpoints in robots.txt.', inspect: 'Client components calling /api/* ; app/robots.ts', effort: 'M', validation: 'URL Inspection → View tested page → More info → Page resources (blocked) and rendered HTML.' },
    'RENDER-ERROR': { title: 'Browser console errors / failed requests during render', category: 'rendering', severity: 'Low', confidence: 'Medium', impact: 'indirect-indexing', why: 'Errors can break hydration and client-only content.', fix: 'Fix the failing script/request.', inspect: 'Browser console', effort: 'S', validation: 'Re-run audit with --render.' },

    // ── Performance (observational only) ──
    'PERF-SLOW-TTFB': { title: 'Slow server response (time to first byte)', category: 'performance', severity: 'Low', confidence: 'Medium', impact: 'indirect-indexing', why: 'Sustained slow responses reduce Google\'s crawl rate; single slow samples prove little.', fix: 'Check caching (ISR/static) for the route.', inspect: 'Route revalidate / Vercel cache headers', effort: 'M', validation: 'Search Console Crawl stats → average response time.' },
    'PERF-LAB-CLS': { title: 'High layout shift in lab render (CLS > 0.25)', category: 'performance', severity: 'Low', confidence: 'Medium', impact: 'ranking-quality', why: 'Content injected after client-side fetches shifts the layout; poor CLS hurts UX and the page-experience signal. Lab values are directional — confirm with CrUX/Search Console Core Web Vitals.', fix: 'Server-render the data, or reserve space (fixed-height skeletons) for client-loaded tables and widgets.', inspect: 'Client components that fetch on mount (gold/silver tables, ticker)', effort: 'M', validation: 'Re-run audit with --render; Search Console → Core Web Vitals.' },
    'PERF-HEAVY-HTML': { title: 'Very large HTML document', category: 'performance', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Large inline RSC payloads slow parsing on mobile; Google only indexes the first 15MB.', fix: 'Reduce serialized props / inline data.', inspect: 'Template data passed to client components', effort: 'M', validation: 'Re-run audit.' },

    // ── Google Discover (eligibility needs indexing first; these govern card size and Follow) ──
    'DISCOVER-NO-LARGE-IMAGE-PREVIEW': { title: 'Discover-target page lacks max-image-preview:large', category: 'discover', severity: 'High', confidence: 'High', impact: 'ranking-quality', why: 'Google shows large Discover cards only when the page allows large previews (max-image-preview:large) or is AMP. Without it, Discover can show only a small thumbnail, which gets far fewer clicks.', fix: 'Add max-image-preview:large (plus max-snippet:-1, max-video-preview:-1) to robots metadata for article pages.', inspect: 'app/articles/[slug]/page.tsx generateMetadata → robots', effort: 'S', validation: 'View source: <meta name="robots" content="index, follow, max-image-preview:large, …">.' },
    'DISCOVER-IMAGE-SMALL': { title: 'Lead image narrower than 1200 px', category: 'discover', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Google recommends lead images at least 1200 px wide for large Discover cards (16:9 or 4:3 crops work best). Smaller images get thumbnail-only treatment.', fix: 'Upload a relevant, original lead image ≥1200 px wide (no logos or text-heavy banners).', inspect: 'Supabase articles.image_url; admin article editor', effort: 'S', validation: 'Re-run audit; image width ≥ 1200.' },
    'DISCOVER-OG-SIZE-MISMATCH': { title: 'og:image:width/height do not match the real image', category: 'discover', severity: 'Low', confidence: 'High', impact: 'ranking-quality', why: 'Declared dimensions are hard-coded; wrong values can make platforms crop or skip the image.', fix: 'Store the real width/height on upload and emit those values (or omit the dimension tags).', inspect: 'app/articles/[slug]/page.tsx openGraph.images', effort: 'S', validation: 'Re-run audit.' },
    'DISCOVER-NO-FEED': { title: 'No RSS/Atom feed advertised', category: 'discover', severity: 'Medium', confidence: 'High', impact: 'indirect-indexing', why: 'Discover\'s Follow feature (Chrome/Google app) uses RSS/Atom feeds linked from the page head; feeds also help Google find fresh articles quickly.', fix: 'Publish /feed.xml (latest on-topic articles, full titles, dates, lead image) and add <link rel="alternate" type="application/rss+xml"> to the root layout and hub pages.', inspect: 'new app/feed.xml/route.ts; app/layout.tsx metadata.alternates.types', effort: 'S', validation: 'curl /feed.xml → 200 valid RSS; homepage head contains the alternate link.' },
    'DISCOVER-NO-ARTICLE-IMAGE': { title: 'Article has no lead image (falls back to logo)', category: 'discover', severity: 'Medium', confidence: 'High', impact: 'ranking-quality', why: 'Discover cards need a compelling, relevant image; a site logo is not eligible as a large image.', fix: 'Add a real lead image.', inspect: 'Supabase articles.image_url', effort: 'S', validation: 'Re-run audit.' },

    // ── Repo ──
    'REPO-ROUTE-UNLISTED': { title: 'Static route exists in code but is neither in sitemap nor linked', category: 'discovery', severity: 'Low', confidence: 'Medium', impact: 'indirect-indexing', why: 'Pages Google cannot discover will not be indexed.', fix: 'Add to sitemap + hubs if it should rank; else noindex/remove.', inspect: 'app/<route>/page.tsx, app/sitemap.ts', effort: 'S', validation: 'Re-run audit.' },

    // ── GSC ──
    'GSC-STATUS-MISMATCH': { title: 'Search Console reason disagrees with current live state', category: 'search-console', severity: 'Medium', confidence: 'Medium', impact: 'indirect-indexing', why: 'Stale GSC status after a fix; request recrawl / validate fix.', fix: 'Use "Validate fix" in Page indexing for this reason group.', inspect: 'Search Console', effort: 'S', validation: GSC_VERIFY },
};

export function rule(code) {
    const r = RULES[code];
    if (!r) throw new Error(`Unknown rule ${code}`);
    return r;
}

export const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };
