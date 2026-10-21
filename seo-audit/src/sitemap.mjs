import * as cheerio from 'cheerio';

// Fetches a sitemap (or sitemap index) recursively and records validation facts.
export async function loadSitemaps(fetcher, roots, { maxSitemaps = 50 } = {}) {
    const files = [];
    const entries = [];
    const pending = [...roots];
    const seen = new Set();
    while (pending.length && files.length < maxSitemaps) {
        const url = pending.shift();
        if (seen.has(url)) continue;
        seen.add(url);
        const res = await fetcher.get(url);
        const file = {
            url,
            status: res.status,
            finalUrl: res.finalUrl,
            redirected: res.chain.length > 0,
            contentType: res.headers['content-type'] || '',
            kind: null,
            urlCount: 0,
            parseError: null,
            lastmodValues: [],
            fetchedAt: new Date().toISOString(),
        };
        files.push(file);
        if (res.status !== 200 || !res.body) continue;
        let $;
        try {
            $ = cheerio.load(res.body, { xml: true });
        } catch (e) {
            file.parseError = String(e.message);
            continue;
        }
        if (!/^\s*(<\?xml[^>]*>\s*)?<(urlset|sitemapindex)\b/.test(res.body)) {
            file.parseError = 'Root element is not <urlset> or <sitemapindex>';
        }
        if ($('sitemapindex').length) {
            file.kind = 'index';
            $('sitemap > loc').each((_, el) => pending.push($(el).text().trim()));
            continue;
        }
        file.kind = 'urlset';
        $('url').each((_, el) => {
            const loc = $(el).find('loc').first().text().trim();
            const lastmod = $(el).find('lastmod').first().text().trim() || null;
            entries.push({ loc, lastmod, sitemap: url });
            if (lastmod) file.lastmodValues.push(lastmod);
            file.urlCount++;
        });
    }
    return { files, entries };
}
