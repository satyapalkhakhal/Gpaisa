import { Fetcher } from './http.mjs';
import { parseRobots, isAllowed } from './robots.mjs';
import { loadSitemaps } from './sitemap.mjs';
import { extractPage, robotsFlags } from './extract.mjs';
import { nearDuplicateClusters } from './similarity.mjs';
import { scanRepoRoutes } from './repo.mjs';
import { loadGscExports } from './gsc.mjs';
import { renderSample } from './render.mjs';
import { imageDimensions } from './image.mjs';

export function normalizeUrl(input, base, ignoreParams = []) {
    let u;
    try { u = new URL(input, base); } catch { return null; }
    u.hash = '';
    for (const p of ignoreParams) u.searchParams.delete(p);
    u.searchParams.sort();
    return u.toString();
}

export function templateFor(pathname, templates) {
    for (const t of templates) {
        if (new RegExp(t.pattern).test(pathname)) return t;
    }
    return { name: 'other', pattern: '.*', source: 'app/' };
}

export async function runAudit(config, { render = false, log = console.log } = {}) {
    const startedAt = new Date();
    const c = config.crawl;
    const fetcher = new Fetcher(c);
    const origin = new URL(config.site.canonicalOrigin);
    const apexHost = origin.host.replace(/^www\./, '');
    const siteHosts = [origin.host, apexHost];
    const ignore = c.ignoreQueryParams || [];
    const norm = (u, base = origin.href) => normalizeUrl(u, base, ignore);
    const excludes = (c.excludePatterns || []).map((p) => new RegExp(p, 'i'));
    const T = config.thresholds;

    const occurrences = [];
    const add = (rule, url, evidence, extra = {}) => occurrences.push({ rule, url, evidence, ...extra });
    const notes = [];

    // ── 1. Host / protocol variants ──
    log('[1/9] Host and protocol variants');
    const hostChecks = [];
    const canonicalHome = norm(origin.href);
    for (const v of config.site.hostVariants) {
        const res = await fetcher.get(v + '/');
        const finalNorm = norm(res.finalUrl);
        const row = {
            variant: v + '/', status: res.status, finalUrl: res.finalUrl, finalStatus: res.status,
            hops: res.chain.length, chain: res.chain.map((h) => `${h.status} ${h.url} -> ${h.location}`).join(' | '),
        };
        hostChecks.push(row);
        if (finalNorm !== canonicalHome) {
            if (res.status === 200) add('HOST-SERVES-200', v + '/', `Served 200 at ${res.finalUrl} without redirecting to ${canonicalHome}`, { template: 'site-wide' });
        } else {
            if (res.chain.some((h) => h.status === 302 || h.status === 307)) add('HOST-TEMP-REDIRECT', v + '/', row.chain, { template: 'site-wide' });
            if (res.chain.length > 1) add('HOST-REDIRECT-CHAIN', v + '/', row.chain, { template: 'site-wide' });
        }
    }
    // Deep-path host check (path preservation)
    for (const v of config.site.hostVariants.filter((x) => new URL(x).host !== origin.host)) {
        const probePath = (config.probes.urlVariantSamples || ['/'])[0];
        const res = await fetcher.get(v + probePath);
        hostChecks.push({ variant: v + probePath, status: res.status, finalUrl: res.finalUrl, hops: res.chain.length, chain: res.chain.map((h) => `${h.status} ${h.url} -> ${h.location}`).join(' | ') });
        if (res.chain.length > 1) add('HOST-REDIRECT-CHAIN', v + probePath, res.chain.map((h) => `${h.status} ${h.url} -> ${h.location}`).join(' | '), { template: 'site-wide' });
    }

    // ── 2. Related domains ──
    log('[2/9] Related domains');
    const relatedChecks = [];
    for (const d of config.site.relatedDomains || []) {
        for (const path of ['/', (config.probes.urlVariantSamples || ['/'])[1] || '/gold-rate']) {
            const res = await fetcher.get(d + path);
            const chain = res.chain.map((h) => `${h.status} ${h.url} -> ${h.location}`).join(' | ');
            relatedChecks.push({ source: d + path, status: res.status, finalUrl: res.finalUrl, hops: res.chain.length, chain, error: res.error || null });
            const finalHost = res.finalUrl ? new URL(res.finalUrl).host : null;
            if (res.status === 200 && finalHost && !siteHosts.includes(finalHost)) {
                add('RELATED-DOMAIN-SERVES-CONTENT', d + path, `Served 200 on ${finalHost}`, { template: 'site-wide' });
            } else if (res.chain.length > 1) {
                add('RELATED-DOMAIN-CHAIN', d + path, chain, { template: 'site-wide' });
            }
            if (res.chain.length && new URL(res.finalUrl).pathname !== path && path !== '/') {
                add('RELATED-DOMAIN-CHAIN', d + path, `Path not preserved: ${chain}`, { template: 'site-wide' });
            }
        }
    }

    // ── 3. robots.txt ──
    log('[3/9] robots.txt');
    const robotsRes = await fetcher.get(origin.origin + '/robots.txt');
    const robots = parseRobots(robotsRes.status === 200 ? robotsRes.body : '');
    const robotsInfo = { status: robotsRes.status, contentType: robotsRes.headers['content-type'], sitemaps: robots.sitemaps, body: robotsRes.body?.slice(0, 4000) };
    if (robotsRes.status !== 200 && robotsRes.status !== 404) add('ROBOTS-UNAVAILABLE', origin.origin + '/robots.txt', `HTTP ${robotsRes.status} ${robotsRes.error || ''}`, { template: 'site-wide' });
    if (robotsRes.status === 200 && !robots.sitemaps.length) add('ROBOTS-NO-SITEMAP', origin.origin + '/robots.txt', 'No Sitemap: directive', { template: 'site-wide' });
    for (const asset of ['/_next/static/chunks/main.js', '/_next/static/css/app.css', '/_next/image?url=x']) {
        for (const ua of ['Googlebot', '*']) {
            const r = isAllowed(robots, ua, asset);
            if (!r.allowed) add('ROBOTS-BLOCKS-RESOURCES', origin.origin + asset, `Blocked for ${ua} by "${r.rule.type}: ${r.rule.path}"`, { template: 'site-wide' });
        }
    }
    const robotsAllows = (url) => {
        const u = new URL(url);
        return isAllowed(robots, 'Googlebot', u.pathname + u.search);
    };

    // ── 4. Sitemaps ──
    log('[4/9] Sitemaps');
    const sitemapRoots = [...new Set([...(config.site.sitemaps || []), ...robots.sitemaps])];
    const sm = await loadSitemaps(fetcher, sitemapRoots);
    const sitemapFetchTimes = sm.files.map((f) => new Date(f.fetchedAt).getTime());
    for (const f of sm.files) {
        if (f.status !== 200) add('SITEMAP-HTTP', f.url, `HTTP ${f.status}`, { template: 'sitemap' });
        if (f.parseError) add('SITEMAP-PARSE', f.url, f.parseError, { template: 'sitemap' });
    }
    const sitemapMap = new Map();
    const dupLocs = new Set();
    for (const e of sm.entries) {
        const n = norm(e.loc);
        if (!n) continue;
        if (sitemapMap.has(n)) dupLocs.add(n);
        sitemapMap.set(n, e);
        const u = new URL(n);
        if (u.origin !== origin.origin) add('SITEMAP-HOST-MISMATCH', e.loc, `Host ${u.origin} ≠ ${origin.origin}`, { template: 'sitemap' });
    }
    for (const d of dupLocs) add('SITEMAP-DUPLICATE-ENTRY', d, 'Listed more than once', { template: 'sitemap' });
    // lastmod == generation time: either within minutes of the fetch, or many
    // entries sharing one identical millisecond-precision timestamp (stamped by
    // `new Date()` when the sitemap was built/revalidated).
    const lastmodGroups = sm.entries.reduce((m, e) => { if (e.lastmod) (m[e.lastmod] ||= []).push(e); return m; }, {});
    const fetchedAt = Math.max(...sitemapFetchTimes, 0);
    const nowish = sm.entries.filter((e) => {
        if (!e.lastmod) return false;
        const t = new Date(e.lastmod).getTime();
        const shared = lastmodGroups[e.lastmod].length >= 5;
        return shared && fetchedAt - t < 48 * 3600e3; // regenerated daily by ISR
    });
    const lastmodNowUrls = new Set(nowish.map((e) => norm(e.loc)));
    // Many rows sharing one sub-second timestamp from the past = one bulk DB update.
    for (const [lm, group] of Object.entries(lastmodGroups)) {
        if (group.length >= 10 && !/T00:00:00(\.000)?Z$/.test(lm) && fetchedAt - new Date(lm).getTime() >= 48 * 3600e3) {
            for (const e of group) add('SITEMAP-LASTMOD-BULK', e.loc, `lastmod ${lm} shared by ${group.length} entries`, { template: templateFor(new URL(e.loc).pathname, config.templates).name });
        }
    }

    // ── 5. Crawl ──
    log(`[5/9] Crawl (≤${c.maxPages} pages, ≤${c.maxRequests} requests, concurrency ${c.concurrency}, ${c.minDelayMs}ms spacing)`);
    const pages = new Map(); // normalized requested URL -> record
    const queue = [];
    const queued = new Set();
    const enqueue = (url, source, depthHint) => {
        const n = norm(url);
        if (!n || queued.has(n)) return;
        const u = new URL(n);
        if (!siteHosts.includes(u.host)) return;
        if (excludes.some((re) => re.test(u.pathname))) return;
        queued.add(n);
        queue.push({ url: n, source, depthHint });
    };
    enqueue(origin.href, 'seed', 0);
    for (const n of sitemapMap.keys()) enqueue(n, 'sitemap');

    const crawlOne = async ({ url, source }) => {
        const u = new URL(url);
        const rb = robotsAllows(url);
        const tpl = templateFor(u.pathname, config.templates);
        const rec = {
            url, path: u.pathname + u.search, template: tpl.name, templateSource: tpl.source, source,
            inSitemap: sitemapMap.has(url), sitemapLastmod: sitemapMap.get(url)?.lastmod || null,
            robotsAllowed: rb.allowed, robotsRule: rb.rule ? `${rb.rule.type}: ${rb.rule.path}` : '',
        };
        pages.set(url, rec);
        if (!rb.allowed && c.respectRobots) { rec.status = null; rec.note = 'Not fetched: blocked by robots.txt'; return; }
        const res = await fetcher.get(url);
        rec.status = res.status;
        rec.error = res.error || '';
        rec.finalUrl = res.finalUrl;
        rec.redirectHops = res.chain.length;
        rec.redirectChain = res.chain.map((h) => `${h.status}→${h.location}`).join(' | ');
        rec.firstStatus = res.chain.length ? res.chain[0].status : res.status;
        rec.contentType = res.headers['content-type'] || '';
        rec.xRobotsTag = res.headers['x-robots-tag'] || '';
        rec.cacheStatus = res.headers['x-vercel-cache'] || '';
        rec.ttfbMs = res.ttfbMs;
        rec.htmlBytes = res.bodyBytes || 0;
        if (res.status === 200 && /html/.test(rec.contentType) && res.body) {
            const x = extractPage(res.body, res.finalUrl, siteHosts);
            Object.assign(rec, x);
            if (c.crawlDiscoveredLinks && pages.size + queue.length < c.maxPages) {
                for (const l of x.links) if (l.internal) enqueue(l.href, 'link');
            }
        }
        // Make sure the final URL of a redirect gets audited as well
        if (res.chain.length && res.finalUrl) enqueue(res.finalUrl, 'redirect-target');
    };

    let inFlight = 0;
    const workers = Array.from({ length: c.concurrency }, async () => {
        while ((queue.length || inFlight) && fetcher.budgetLeft() > 50 && pages.size < c.maxPages) {
            if (!queue.length) { await new Promise((r) => setTimeout(r, 50)); continue; }
            const item = queue.shift();
            inFlight++;
            try { await crawlOne(item); } finally { inFlight--; }
        }
    });
    await Promise.all(workers);
    // Canonical targets that were not crawled yet
    for (const rec of [...pages.values()]) {
        for (const cn of rec.canonicals || []) {
            const n = norm(cn.href);
            if (n && !pages.has(n) && siteHosts.includes(new URL(n).host) && fetcher.budgetLeft() > 50) await crawlOne({ url: n, source: 'canonical-target' });
        }
    }
    if (queue.length) notes.push(`Crawl stopped with ${queue.length} URLs still queued (limits: maxPages=${c.maxPages}, budget=${c.maxRequests}).`);
    log(`      crawled ${pages.size} URLs using ${fetcher.requestCount} requests`);

    // ── 6. Probes: soft 404, URL variants, legacy ──
    log('[6/9] Probes (soft-404, URL variants, legacy paths)');
    const probes = [];
    for (const p of config.probes.softNotFound || []) {
        const res = await fetcher.get(origin.origin + p);
        let title = '';
        let robotsMeta = '';
        if (res.body) {
            const x = extractPage(res.body, res.finalUrl, siteHosts);
            title = x.titles[0] || '';
            robotsMeta = x.robotsMeta.join(',');
        }
        probes.push({ kind: 'soft-404', url: origin.origin + p, status: res.status, finalUrl: res.finalUrl, hops: res.chain.length, title, robotsMeta });
        if (res.status === 200) {
            add('SOFT404-PROBE', origin.origin + p, `Made-up URL returned 200 (final ${res.finalUrl}); title "${title}"; robots "${robotsMeta}"`, { template: templateFor(p, config.templates).name });
        }
    }
    for (const p of config.probes.urlVariantSamples || []) {
        const clean = norm(origin.origin + p);
        const variants = [
            ['trailing-slash', origin.origin + p + '/'],
            ['uppercase', origin.origin + p.toUpperCase()],
            ['tracking-param', origin.origin + p + '?utm_source=seo-audit'],
            ['unknown-param', origin.origin + p + '?ref=seo-audit-test'],
        ];
        for (const [kind, v] of variants) {
            const res = await fetcher.get(v);
            let canonical = '';
            if (res.status === 200 && res.body) canonical = extractPage(res.body, res.finalUrl, siteHosts).canonicals.map((x) => x.href).join(' ');
            const consolidated = res.status === 404 || (res.chain.length > 0 && norm(res.finalUrl) === clean) || (res.status === 200 && norm(canonical) === clean);
            probes.push({ kind, url: v, status: res.status, finalUrl: res.finalUrl, hops: res.chain.length, canonical, consolidated });
            if (!consolidated) add('URL-VARIANT-NOT-CONSOLIDATED', v, `${kind}: HTTP ${res.status}, final ${res.finalUrl}, canonical "${canonical}"`, { template: templateFor(p, config.templates).name });
        }
    }
    for (const p of config.probes.legacyPaths || []) {
        const res = await fetcher.get(origin.origin + p);
        probes.push({ kind: 'legacy', url: origin.origin + p, status: res.status, finalUrl: res.finalUrl, hops: res.chain.length, chain: res.chain.map((h) => `${h.status}→${h.location}`).join(' | '), xRobotsTag: res.headers['x-robots-tag'] || '' });
        if (res.status >= 500 || res.status === 0) add('PAGE-5XX', origin.origin + p, `Legacy path: HTTP ${res.status} ${res.error || ''}`, { template: 'legacy' });
        // A made-up legacy ID should 404/410; redirecting it to a hub is a soft-404 pattern.
        if (/\/9{6,}$/.test(p) && res.chain.length && res.status === 200) {
            add('LEGACY-UNKNOWN-REDIRECT', origin.origin + p, `Non-existent legacy ID redirected: ${res.chain.map((h) => `${h.status}→${h.location}`).join(' | ')}`, { template: 'legacy' });
        }
    }

    // ── 7. User-agent comparison ──
    log('[7/9] Googlebot user-agent comparison');
    const uaChecks = [];
    const byTemplate = new Map();
    for (const r of pages.values()) if (r.status === 200 && !byTemplate.has(r.template)) byTemplate.set(r.template, r);
    const uaSample = [...byTemplate.values()].slice(0, c.uaCompareSample || 6);
    for (const [uaName, uaString] of Object.entries(c.compareUserAgents || {})) {
        for (const base of uaSample) {
            const res = await fetcher.get(base.url, { userAgent: uaString });
            const x = res.status === 200 && res.body ? extractPage(res.body, res.finalUrl, siteHosts) : null;
            const row = {
                ua: uaName, url: base.url, statusDefault: base.status, statusAlt: res.status,
                titleSame: x ? (x.titles[0] || '') === (base.titles?.[0] || '') : false,
                canonicalSame: x ? (x.canonicals[0]?.href || '') === (base.canonicals?.[0]?.href || '') : false,
                robotsSame: x ? x.robotsMeta.join() === (base.robotsMeta || []).join() : false,
                wordsDefault: base.wordCount, wordsAlt: x?.wordCount ?? 0,
            };
            uaChecks.push(row);
            const wordsOff = base.wordCount > 50 && Math.abs((row.wordsAlt - base.wordCount) / base.wordCount) > 0.3;
            if (res.status !== base.status || !row.canonicalSame || !row.robotsSame || wordsOff) {
                add('UA-DIFFERENCE', base.url, `${uaName}: status ${res.status} vs ${base.status}; canonicalSame=${row.canonicalSame}; robotsSame=${row.robotsSame}; words ${row.wordsAlt} vs ${base.wordCount}`, { template: base.template });
            }
        }
    }
    notes.push('UA comparison spoofs the Googlebot user-agent string from a non-Google IP. It detects UA-based logic, not IP-based bot verification (e.g. Vercel Firewall). Use Search Console URL Inspection → Test live URL for the authoritative check.');

    // ── 8. Analysis ──
    log('[8/9] Analysis');
    const all = [...pages.values()];
    const htmlPages = all.filter((r) => r.status === 200 && r.titles);

    // resolve redirects: requested -> final normalized
    const finalOf = new Map(all.map((r) => [r.url, r.finalUrl ? norm(r.finalUrl) : r.url]));

    for (const r of htmlPages) {
        const flags = robotsFlags([...(r.robotsMeta || []), ...(r.googlebotMeta || []), r.xRobotsTag || '']);
        r.noindex = flags.noindex;
        r.nofollow = flags.nofollow;
        const cans = (r.canonicals || []).filter((x) => x.href);
        r.canonical = cans[0]?.href || '';
        const self = norm(r.finalUrl);
        if (!cans.length) { r.canonicalState = 'missing'; }
        else if (new Set(cans.map((x) => norm(x.href))).size > 1) { r.canonicalState = 'multiple'; }
        else if (norm(cans[0].href) === self) { r.canonicalState = 'self'; }
        else { r.canonicalState = 'other'; }
        r.indexable = r.robotsAllowed && !r.noindex && (r.canonicalState === 'self' || r.canonicalState === 'missing');
    }
    for (const r of all) {
        if (r.status !== 200 && r.redirectHops === 0) r.indexable = false;
        if (r.redirectHops > 0) r.indexable = false;
    }
    const recByFinal = new Map(htmlPages.map((r) => [norm(r.finalUrl), r]));

    // Per-page checks
    const bodyCanonicalCandidates = [];
    for (const r of all) {
        const tpl = r.template;
        if (r.status === 0 || r.status >= 500) add('PAGE-5XX', r.url, `HTTP ${r.status} ${r.error}`, { template: tpl });
        else if (r.status >= 400) add('PAGE-4XX', r.url, `HTTP ${r.status}; discovered via ${r.source}`, { template: tpl });
        if (r.inSitemap) {
            if (r.redirectHops > 0) add('SITEMAP-REDIRECT', r.url, `${r.redirectChain}`, { template: tpl });
            else if (r.status !== 200) add('SITEMAP-NON200', r.url, `HTTP ${r.status}`, { template: tpl });
            if (!r.robotsAllowed) add('ROBOTS-BLOCKS-URL', r.url, `Sitemap URL blocked by "${r.robotsRule}"`, { template: tpl });
            if (lastmodNowUrls.has(r.url)) r.lastmodIsNow = true;
        }
    }
    for (const r of htmlPages) {
        const tpl = r.template;
        if (r.noindex) {
            if (r.inSitemap) add('SITEMAP-NOINDEX', r.url, `robots meta "${(r.robotsMeta || []).join(',')}" X-Robots-Tag "${r.xRobotsTag}"`, { template: tpl });
            else add('PAGE-NOINDEX', r.url, `robots meta "${(r.robotsMeta || []).join(',')}" X-Robots-Tag "${r.xRobotsTag}"`, { template: tpl });
        }
        if (r.canonicalState === 'missing') add('CANONICAL-MISSING', r.url, 'No <link rel=canonical>', { template: tpl });
        if (r.canonicalState === 'multiple') add('CANONICAL-MULTIPLE', r.url, r.canonicals.map((x) => x.href).join(' , '), { template: tpl });
        if ((r.canonicals || []).some((x) => !x.inHead)) bodyCanonicalCandidates.push(r);
        if (r.canonicalState === 'other') {
            const target = norm(r.canonical);
            const tHost = new URL(target).host;
            if (!siteHosts.includes(tHost)) add('CANONICAL-CROSS-DOMAIN', r.url, `canonical → ${r.canonical}`, { template: tpl });
            else if (target === canonicalHome && r.template !== 'home') add('CANONICAL-TO-HOMEPAGE', r.url, `canonical → ${r.canonical}`, { template: tpl });
            else if (tHost !== origin.host) add('CANONICAL-CROSS-DOMAIN', r.url, `canonical host ${tHost} ≠ ${origin.host}: ${r.canonical}`, { template: tpl });
            else add('CANONICAL-TO-OTHER', r.url, `canonical → ${r.canonical}`, { template: tpl });
            if (r.inSitemap) add('SITEMAP-CANONICAL-MISMATCH', r.url, `canonical → ${r.canonical}`, { template: tpl });
        }
        if (r.canonical && r.canonicalState === 'other') {
            const t = pages.get(norm(r.canonical));
            if (t && (t.redirectHops > 0 || t.status !== 200 || (recByFinal.get(norm(t.finalUrl))?.noindex))) {
                add('CANONICAL-TARGET-BAD', r.url, `canonical ${r.canonical} → HTTP ${t.status}, hops ${t.redirectHops}, noindex ${!!recByFinal.get(norm(t.finalUrl))?.noindex}`, { template: tpl });
            }
        }
        if (!r.titles.length || !r.titles[0]) add('TITLE-MISSING', r.url, 'No title', { template: tpl });
        if (r.titles.length > 1) add('TITLE-MULTIPLE', r.url, r.titles.join(' || '), { template: tpl });
        if (config.site.defaultTitle && r.titles[0] === config.site.defaultTitle && r.template !== 'home') add('TITLE-DEFAULT', r.url, r.titles[0], { template: tpl });
        if ((r.titles[0] || '').length > T.titleMaxChars) add('TITLE-LONG', r.url, `${r.titles[0].length} chars: ${r.titles[0]}`, { template: tpl });
        const d = r.metaDescriptions[0] || '';
        if (!d) add('DESC-MISSING', r.url, 'No meta description', { template: tpl });
        else if (d.length < T.descriptionMinChars || d.length > T.descriptionMaxChars) add('DESC-LENGTH', r.url, `${d.length} chars`, { template: tpl });
        if (!r.h1s.length) add('H1-MISSING', r.url, 'No <h1> in server HTML', { template: tpl });
        if (r.h1s.length > 1) add('H1-MULTIPLE', r.url, r.h1s.slice(0, 4).join(' || '), { template: tpl });
        if (!r.viewport) add('VIEWPORT-MISSING', r.url, 'No meta viewport', { template: tpl });
        for (const j of r.jsonLd) {
            if (j.type === 'PARSE_ERROR') add('JSONLD-PARSE-ERROR', r.url, j.error, { template: tpl });
            if (j.hasAggregateRating) add('JSONLD-RATING-CHECK', r.url, `${j.type} includes aggregateRating`, { template: tpl });
        }
        const art = r.jsonLd.find((j) => /Article/.test(j.type));
        if (art && art.dateModified && art.datePublished && art.dateModified === art.datePublished && r.sitemapLastmod) {
            const lm = new Date(r.sitemapLastmod).getTime();
            const dp = new Date(art.datePublished).getTime();
            if (lm - dp > 24 * 3600e3) add('JSONLD-DATEMODIFIED-STALE', r.url, `datePublished=dateModified=${art.datePublished}; sitemap lastmod ${r.sitemapLastmod}`, { template: tpl });
        }
        if (r.soft404Signals.length && r.wordCount < 400) add('SOFT404-SIGNAL', r.url, `Phrases: ${r.soft404Signals.join(', ')}; ${r.wordCount} words`, { template: tpl });
        if (r.placeholderSignals.length) add('CONTENT-PLACEHOLDER', r.url, r.placeholderSignals.slice(0, 4).join('; '), { template: tpl });
        if (r.ttfbMs > T.slowTtfbMs) add('PERF-SLOW-TTFB', r.url, `TTFB ${r.ttfbMs}ms (cache ${r.cacheStatus})`, { template: tpl });
        if (r.htmlBytes > 500000) add('PERF-HEAVY-HTML', r.url, `${Math.round(r.htmlBytes / 1024)} KB HTML`, { template: tpl });
    }

    // Next.js >=15.2 streams generateMetadata output into <body> for non-bot
    // user-agents when it resolves late, but blocks and emits it in <head> for
    // bots (htmlLimitedBots). Re-check with the Googlebot UA before reporting.
    // Also re-check with Google-InspectionTool: Next's default bot list matches it but
    // not plain Googlebot, so URL Inspection can see a different <head> than Googlebot.
    const gbUa = (c.compareUserAgents || {})['googlebot-smartphone'];
    const itUa = (c.compareUserAgents || {})['google-inspectiontool'];
    const canonicalPlacement = async (url, ua) => {
        if (!ua) return 'n/a';
        const res = await fetcher.get(url, { userAgent: ua });
        const x = res.status === 200 && res.body ? extractPage(res.body, res.finalUrl, siteHosts) : null;
        if (!x || !x.canonicals.length) return 'unavailable';
        return x.canonicals.every((cn) => cn.inHead) ? 'head' : 'body';
    };
    for (const r of bodyCanonicalCandidates) {
        const forBot = await canonicalPlacement(r.url, gbUa);
        if (forBot === 'head') {
            add('METADATA-STREAMED-NONBOT', r.url, `Canonical in <body> for audit UA (cache ${r.cacheStatus}, TTFB ${r.ttfbMs}ms) but in <head> for Googlebot UA`, { template: r.template });
            continue;
        }
        const forInspection = await canonicalPlacement(r.url, itUa);
        add('CANONICAL-IN-BODY', r.url, `rel=canonical in <body> for audit UA and Googlebot UA (${forBot}); Google-InspectionTool UA: ${forInspection}${forInspection === 'head' ? ' — URL Inspection will NOT show this problem' : ''}`, { template: r.template });
    }

    // Duplicate titles / descriptions among indexable pages
    const indexable = htmlPages.filter((r) => r.indexable);
    const groupBy = (arr, keyFn) => arr.reduce((m, x) => { const k = keyFn(x); if (k) (m[k] ||= []).push(x); return m; }, {});
    for (const [title, group] of Object.entries(groupBy(indexable, (r) => r.titles[0]))) {
        if (group.length > 1) for (const r of group) add('TITLE-DUPLICATE', r.url, `"${title}" shared by ${group.length} URLs: ${group.map((g) => g.path).slice(0, 5).join(', ')}`, { template: r.template });
    }
    for (const [desc, group] of Object.entries(groupBy(indexable, (r) => r.metaDescriptions[0]))) {
        if (group.length > 1) for (const r of group) add('DESC-DUPLICATE', r.url, `Shared by ${group.length} URLs: ${group.map((g) => g.path).slice(0, 5).join(', ')} — "${desc.slice(0, 80)}"`, { template: r.template });
    }

    // Near-duplicate content + thin content
    const dup = nearDuplicateClusters(indexable, { threshold: T.nearDuplicateJaccard, boilerplateShare: T.boilerplateShingleShare });
    for (const r of indexable) r.uniqueShingles = dup.uniqueShingles[r.url] ?? 0;
    for (const cl of dup.clusters) {
        const rel = dup.pairs.filter((p) => cl.includes(p.a));
        for (const url of cl) {
            const r = pages.get(url);
            const peers = rel.filter((p) => p.a === url || p.b === url).map((p) => `${new URL(p.a === url ? p.b : p.a).pathname} (${p.similarity})`);
            add('CONTENT-NEAR-DUP', url, `Cluster of ${cl.length}; similar to ${peers.slice(0, 4).join(', ')}`, { template: r?.template });
            if (r) r.nearDupCluster = cl.length;
        }
    }
    for (const r of indexable) {
        if (r.template === 'home') continue;
        if (r.wordCount < T.thinContentWords || r.uniqueShingles < T.thinUniqueShingles) {
            add('CONTENT-THIN', r.url, `${r.wordCount} words in <main>, ${r.uniqueShingles} page-specific 5-word shingles (after removing site-wide boilerplate)`, { template: r.template });
        }
    }

    // Link graph
    const inbound = new Map();
    const inboundNonNav = new Map();
    const inboundDirect = new Map(); // links to the URL as written (before following redirects)
    const edges = new Map();
    for (const r of htmlPages) {
        const from = norm(r.finalUrl);
        const targets = new Set();
        for (const l of r.links) {
            if (!l.internal) continue;
            const n = norm(l.href);
            if (!n || n === from) continue;
            targets.add(n);
            const t = pages.get(n);
            if (t) {
                if (t.status >= 400 || t.status === 0) add('LINK-BROKEN', n, `Linked from ${r.path} (anchor "${l.anchor}") → HTTP ${t.status}`, { template: t.template, source: r.url });
                else if (t.redirectHops > 0) add('LINK-TO-REDIRECT', n, `Linked from ${r.path} → ${t.redirectChain}`, { template: t.template, source: r.url });
            }
        }
        for (const t of targets) inboundDirect.set(t, (inboundDirect.get(t) || 0) + 1);
        const finals = new Set([...targets].map((t) => finalOf.get(t) || t));
        edges.set(from, finals);
        for (const t of finals) {
            inbound.set(t, (inbound.get(t) || 0) + 1);
        }
        const nonNav = new Set(r.links.filter((l) => l.internal && !l.inNav).map((l) => finalOf.get(norm(l.href)) || norm(l.href)));
        for (const t of nonNav) if (t !== from) inboundNonNav.set(t, (inboundNonNav.get(t) || 0) + 1);
    }
    // Click depth (BFS from homepage)
    const depth = new Map([[canonicalHome, 0]]);
    const bfs = [canonicalHome];
    while (bfs.length) {
        const cur = bfs.shift();
        for (const t of edges.get(cur) || []) if (!depth.has(t)) { depth.set(t, depth.get(cur) + 1); bfs.push(t); }
    }
    for (const r of all) {
        const f = finalOf.get(r.url) || r.url;
        // A redirecting URL reports links pointing at it, not at its target.
        r.inlinks = r.redirectHops > 0 ? (inboundDirect.get(r.url) || 0) : (inbound.get(f) || 0);
        r.inlinksContextual = inboundNonNav.get(f) || 0;
        r.clickDepth = depth.has(f) ? depth.get(f) : null;
    }
    for (const r of indexable) {
        if (r.template === 'home') continue;
        if (r.inSitemap && r.inlinks === 0) add('ORPHAN-SITEMAP-ONLY', r.url, 'No crawled page links here; known only from sitemap', { template: r.template });
        else if (r.inlinks === 1) add('WEAK-INBOUND', r.url, 'Linked from exactly 1 crawled page', { template: r.template });
        if (r.clickDepth !== null && r.clickDepth >= T.deepClickDepth) add('DEEP-PAGE', r.url, `Click depth ${r.clickDepth}`, { template: r.template });
        if (!r.inSitemap && r.source !== 'canonical-target') add('SITEMAP-OMISSION', r.url, `Indexable 200, self-canonical, discovered via ${r.source}; ${r.inlinks} inlinks`, { template: r.template });
    }
    for (const r of htmlPages.filter((x) => x.noindex && x.inlinks >= 10)) {
        add('PAGE-NOINDEX-LINKED-PROMINENTLY', r.url, `noindex but linked from ${r.inlinks} pages`, { template: r.template });
    }
    const lastmodNow = all.filter((r) => r.lastmodIsNow);
    for (const r of lastmodNow) add('SITEMAP-LASTMOD-NOW', r.url, `lastmod ${r.sitemapLastmod} ≈ sitemap fetch time`, { template: r.template });

    // ── Google Discover readiness (for templates that should earn Discover cards) ──
    const dc = config.discover || {};
    const discoverPages = indexable.filter((r) => (dc.templates || []).includes(r.template));
    const imageChecks = [];
    for (const r of discoverPages) {
        const directives = [...(r.robotsMeta || []), ...(r.googlebotMeta || [])].join(',');
        if (!/max-image-preview\s*:\s*large/i.test(directives)) {
            add('DISCOVER-NO-LARGE-IMAGE-PREVIEW', r.url, `robots "${(r.robotsMeta || []).join(',')}" googlebot "${(r.googlebotMeta || []).join(',')}"`, { template: r.template });
        }
        const lead = r.og?.image || r.jsonLd.find((j) => /Article/.test(j.type))?.image || null;
        r.leadImage = lead;
        if (!lead || /android-chrome|logo|favicon/i.test(lead)) {
            add('DISCOVER-NO-ARTICLE-IMAGE', r.url, `Lead image: ${lead || 'none'}`, { template: r.template });
            continue;
        }
        if (dc.checkImageSize && imageChecks.length < (dc.maxImages || 100)) {
            const res = await fetcher.fetchBytes(new URL(lead, r.url).toString());
            const d = res.bytes ? imageDimensions(res.bytes) : null;
            imageChecks.push({ url: r.url, image: lead, status: res.status, ...(d || {}) });
            if (d) {
                r.leadImageWidth = d.width;
                r.leadImageHeight = d.height;
                if (d.width < 1200) add('DISCOVER-IMAGE-SMALL', r.url, `${d.width}×${d.height} ${d.format}: ${lead}`, { template: r.template });
                if (r.og?.imageWidth && (r.og.imageWidth !== d.width || r.og.imageHeight !== d.height)) {
                    add('DISCOVER-OG-SIZE-MISMATCH', r.url, `declared ${r.og.imageWidth}×${r.og.imageHeight}, actual ${d.width}×${d.height}`, { template: r.template });
                }
            }
        }
    }
    const home = pages.get(canonicalHome);
    const feedLinks = new Set(htmlPages.flatMap((r) => r.feeds || []));
    if (discoverPages.length && !feedLinks.size) {
        add('DISCOVER-NO-FEED', canonicalHome, `No <link rel="alternate" type="application/rss+xml|atom+xml"> on any of ${htmlPages.length} crawled pages (homepage feeds: ${(home?.feeds || []).length})`, { template: 'site-wide' });
    }
    const discover = { templates: dc.templates || [], pages: discoverPages.length, feeds: [...feedLinks], imageChecks };

    // ── 9. Optional: render, repo, GSC ──
    log('[9/9] Optional modules (render, repo routes, Search Console exports)');
    let renderResults = { ran: false, reason: 'not requested (use --render)' };
    if (render || config.render.enabled) {
        renderResults = await renderSample(config, htmlPages, { add, norm, siteHosts, robotsAllows, log });
    }
    let repoRoutes = { ran: false };
    if (config.repo?.path) {
        repoRoutes = scanRepoRoutes(config.repo, config._configDir);
        if (repoRoutes.ran) {
            for (const route of repoRoutes.staticRoutes) {
                const n = norm(origin.origin + route);
                if (!pages.has(n) && !sitemapMap.has(n)) {
                    add('REPO-ROUTE-UNLISTED', origin.origin + route, `Static route in ${repoRoutes.byRoute[route]} — not in sitemap, not reached by crawl`, { template: templateFor(route, config.templates).name });
                }
            }
        }
    }
    const gsc = loadGscExports(config.gsc, config._configDir, pages, norm, add);

    return {
        meta: {
            startedAt: startedAt.toISOString(), finishedAt: new Date().toISOString(),
            origin: origin.origin, requests: fetcher.requestCount, pagesCrawled: pages.size, notes,
            userAgent: c.userAgent,
        },
        hostChecks, relatedChecks, robots: robotsInfo, sitemap: { files: sm.files.map(({ lastmodValues, ...f }) => ({ ...f, distinctLastmods: new Set(lastmodValues).size })), entryCount: sm.entries.length, lastmodNowCount: lastmodNowUrls.size },
        probes, uaChecks, render: renderResults, repoRoutes, gsc, discover,
        duplicates: dup.pairs, templateSimilarity: dup.templateSimilarity,
        pages: all, occurrences, requestLog: fetcher.log,
    };
}
