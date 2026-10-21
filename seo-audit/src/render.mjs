import { extractPage } from './extract.mjs';

// Optional: compares server HTML with the browser-rendered DOM for a sample of
// pages per template. Requires playwright-core and a local Chrome/Chromium.
export async function renderSample(config, htmlPages, { add, norm, siteHosts, robotsAllows, log }) {
    let chromium;
    try {
        ({ chromium } = await import('playwright-core'));
    } catch {
        return { ran: false, reason: 'playwright-core not installed (npm install in seo-audit/)' };
    }
    const rc = config.render;
    let browser;
    try {
        browser = await chromium.launch({ executablePath: rc.executablePath, headless: true });
    } catch (e) {
        return { ran: false, reason: `Could not launch browser at ${rc.executablePath}: ${e.message.split('\n')[0]}` };
    }
    const perTemplate = new Map();
    for (const p of htmlPages) {
        const list = perTemplate.get(p.template) || [];
        if (list.length < rc.samplePerTemplate) list.push(p);
        perTemplate.set(p.template, list);
    }
    const sample = [...perTemplate.values()].flat();
    const results = [];
    // Fresh context per page so JS transfer sizes are measured with an empty cache.
    const newContext = async () => {
        const context = await browser.newContext({
            userAgent: config.crawl.userAgent + ' HeadlessRender',
            viewport: { width: 412, height: 915 },
            isMobile: true,
        });
        // Lab-only web-vitals observers (no network throttling; not CrUX field data).
        await context.addInitScript(() => {
            window.__lab = { lcp: 0, cls: 0 };
            new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lab.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__lab.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
        });
        return context;
    };
    for (const raw of sample) {
        const context = await newContext();
        const page = await context.newPage();
        const consoleErrors = [];
        const failed = [];
        const blockedForGooglebot = new Set();
        page.on('request', (r) => {
            const u = new URL(r.url());
            if (siteHosts.includes(u.host) && ['fetch', 'xhr'].includes(r.resourceType()) && !robotsAllows(r.url()).allowed) {
                blockedForGooglebot.add(u.pathname);
            }
        });
        page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
        page.on('pageerror', (e) => consoleErrors.push(String(e.message).slice(0, 160)));
        // Ignore aborted Next.js RSC prefetches (cancelled when the page closes).
        page.on('requestfailed', (r) => { if (siteHosts.includes(new URL(r.url()).host) && !r.url().includes('_rsc=')) failed.push(r.url()); });
        page.on('response', (r) => { if (r.status() >= 400 && siteHosts.includes(new URL(r.url()).host)) failed.push(`${r.status()} ${r.url()}`); });
        try {
            await page.goto(raw.url, { waitUntil: 'load', timeout: 45000 });
            await page.waitForTimeout(rc.waitMs);
            const lab = await page.evaluate(() => {
                const res = performance.getEntriesByType('resource');
                const js = res.filter((r) => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name));
                return {
                    lcpMs: Math.round(window.__lab.lcp), cls: Number(window.__lab.cls.toFixed(3)),
                    jsKB: Math.round(js.reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
                    requests: res.length,
                    thirdPartyHosts: [...new Set(res.map((r) => new URL(r.name).host).filter((h) => h !== location.host))].length,
                };
            });
            const html = await page.content();
            const x = extractPage(html, raw.url, siteHosts);
            const rawLinks = new Set(raw.links.filter((l) => l.internal).map((l) => norm(l.href)));
            const renderedOnly = [...new Set(x.links.filter((l) => l.internal).map((l) => norm(l.href)))].filter((h) => !rawLinks.has(h));
            const row = {
                url: raw.url, template: raw.template,
                titleRaw: raw.titles[0] || '', titleRendered: x.titles[0] || '',
                canonicalRaw: raw.canonical || '', canonicalRendered: x.canonicals[0]?.href || '',
                robotsRaw: (raw.robotsMeta || []).join(','), robotsRendered: x.robotsMeta.join(','),
                wordsRaw: raw.wordCount, wordsRendered: x.wordCount,
                linksRaw: rawLinks.size, linksRenderedOnly: renderedOnly.length, renderedOnlySample: renderedOnly.slice(0, 5),
                consoleErrors: consoleErrors.slice(0, 5), failedRequests: failed.slice(0, 5),
                robotsBlockedRequests: [...blockedForGooglebot],
                lab,
            };
            results.push(row);
            const gained = row.wordsRendered - row.wordsRaw;
            if (blockedForGooglebot.size && (gained > 50 || row.linksRenderedOnly > 0)) {
                add('RENDER-DEPENDS-ON-BLOCKED-API', raw.url, `Calls ${[...blockedForGooglebot].join(', ')} (Disallowed for Googlebot); render adds ${gained} words and ${row.linksRenderedOnly} links that Googlebot cannot obtain`, { template: raw.template });
            }
            if (row.titleRaw !== row.titleRendered || norm(row.canonicalRaw || 'x:') !== norm(row.canonicalRendered || 'x:') || row.robotsRaw !== row.robotsRendered) {
                add('RENDER-META-DIFF', raw.url, `title "${row.titleRaw}" → "${row.titleRendered}"; canonical ${row.canonicalRaw} → ${row.canonicalRendered}; robots "${row.robotsRaw}" → "${row.robotsRendered}"`, { template: raw.template });
            }
            if (row.wordsRendered > 150 && row.wordsRaw < row.wordsRendered * 0.5) {
                add('RENDER-CONTENT-CLIENT-ONLY', raw.url, `${row.wordsRaw} words in server HTML vs ${row.wordsRendered} after render`, { template: raw.template });
            }
            if (row.linksRenderedOnly >= 5) {
                add('RENDER-LINKS-CLIENT-ONLY', raw.url, `${row.linksRenderedOnly} internal links only after render, e.g. ${renderedOnly.slice(0, 3).join(', ')}`, { template: raw.template });
            }
            if (lab.cls > 0.25) {
                add('PERF-LAB-CLS', raw.url, `Lab CLS ${lab.cls} (mobile viewport, local Chrome)`, { template: raw.template });
            }
            if (consoleErrors.length || failed.length) {
                add('RENDER-ERROR', raw.url, `console: ${consoleErrors.slice(0, 2).join(' | ')}; failed: ${failed.slice(0, 2).join(' | ')}`, { template: raw.template });
            }
        } catch (e) {
            results.push({ url: raw.url, template: raw.template, error: e.message.split('\n')[0] });
        } finally {
            await page.close();
            await context.close();
        }
        log(`      rendered ${raw.url}`);
    }
    await browser.close();
    return { ran: true, sampled: results.length, results };
}
