import * as cheerio from 'cheerio';

const SOFT_404_PATTERNS = [
    /\bpage not found\b/i,
    /\barticle not found\b/i,
    /\bno (articles|results|data|records|ipos?) (found|available)\b/i,
    /\bnothing (here|found)\b/i,
    /\bcoming soon\b/i,
    /\bsomething went wrong\b/i,
    /\bfailed to (load|fetch)\b/i,
    /\bdata (is )?(currently )?unavailable\b/i,
];

function text($el) {
    return $el.text().replace(/\s+/g, ' ').trim();
}

export function extractPage(html, pageUrl, siteHosts) {
    const $ = cheerio.load(html);
    const head = $('head');
    const out = {};

    out.lang = $('html').attr('lang') || null;
    out.titles = $('title').map((_, el) => text($(el))).get();
    out.titlesInBody = $('body title').filter((_, el) => !$(el).closest('svg').length).length;
    out.metaDescriptions = $('meta[name="description"]').map((_, el) => ($(el).attr('content') || '').trim()).get();
    out.robotsMeta = $('meta[name="robots"]').map((_, el) => ($(el).attr('content') || '').toLowerCase()).get();
    out.googlebotMeta = $('meta[name="googlebot"]').map((_, el) => ($(el).attr('content') || '').toLowerCase()).get();
    out.canonicals = $('link[rel="canonical"]').map((_, el) => ({
        href: $(el).attr('href') ? new URL($(el).attr('href'), pageUrl).toString() : '',
        raw: $(el).attr('href') || '',
        inHead: $(el).closest('head').length > 0,
    })).get();
    out.hreflang = $('link[rel="alternate"][hreflang]').map((_, el) => ({ lang: $(el).attr('hreflang'), href: $(el).attr('href') })).get();
    out.og = {
        title: head.find('meta[property="og:title"]').attr('content') || null,
        url: head.find('meta[property="og:url"]').attr('content') || null,
        type: head.find('meta[property="og:type"]').attr('content') || null,
        image: head.find('meta[property="og:image"]').attr('content') || null,
        description: head.find('meta[property="og:description"]').attr('content') || null,
        imageWidth: Number(head.find('meta[property="og:image:width"]').attr('content')) || null,
        imageHeight: Number(head.find('meta[property="og:image:height"]').attr('content')) || null,
    };
    out.feeds = $('link[rel="alternate"]').filter((_, el) => /(rss|atom)\+xml/i.test($(el).attr('type') || '')).map((_, el) => $(el).attr('href')).get();
    out.articlePublished = head.find('meta[property="article:published_time"]').attr('content') || null;
    out.articleModified = head.find('meta[property="article:modified_time"]').attr('content') || null;
    out.authorMeta = head.find('meta[name="author"]').map((_, el) => $(el).attr('content')).get();

    out.h1s = $('body h1').map((_, el) => text($(el))).get();
    out.headingCounts = { h2: $('body h2').length, h3: $('body h3').length };

    out.jsonLd = [];
    $('script[type="application/ld+json"]').each((_, el) => {
        const raw = $(el).contents().text();
        try {
            const data = JSON.parse(raw);
            const nodes = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
            for (const n of nodes) {
                const img = [].concat(n.image || [])[0];
                out.jsonLd.push({
                    type: [].concat(n['@type'] || 'unknown').join(','),
                    image: typeof img === 'string' ? img : img?.url || null,
                    hasAggregateRating: JSON.stringify(n).includes('aggregateRating'),
                    datePublished: n.datePublished || null,
                    dateModified: n.dateModified || null,
                    author: n.author ? [].concat(n.author).map((a) => a.name || a).join('; ') : null,
                });
            }
        } catch (e) {
            out.jsonLd.push({ type: 'PARSE_ERROR', error: String(e.message).slice(0, 120) });
        }
    });

    // Links
    const links = [];
    let anchorsWithoutHref = 0;
    $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) { anchorsWithoutHref++; return; }
        if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;
        let abs;
        try { abs = new URL(href, pageUrl); } catch { return; }
        if (!/^https?:$/.test(abs.protocol)) return;
        abs.hash = '';
        const internal = siteHosts.includes(abs.host);
        const rel = ($(el).attr('rel') || '').toLowerCase();
        links.push({
            href: abs.toString(),
            internal,
            nofollow: rel.includes('nofollow'),
            anchor: text($(el)).slice(0, 80),
            inNav: $(el).closest('header, nav, footer').length > 0,
        });
    });
    out.links = links;
    out.anchorsWithoutHref = anchorsWithoutHref;

    const imgs = $('body img');
    out.images = imgs.length;
    out.imagesMissingAlt = imgs.filter((_, el) => $(el).attr('alt') === undefined).length;

    // Primary content: <main> minus chrome. Falls back to <body>.
    const scope = $('main').length ? $('main').first().clone() : $('body').clone();
    scope.find('script, style, noscript, svg, template, iframe, header, nav, footer').remove();
    const mainText = text(scope);
    out.mainText = mainText;
    out.wordCount = mainText ? mainText.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0;
    const bodyClone = $('body').clone();
    bodyClone.find('script, style, noscript, svg, template').remove();
    out.bodyWordCount = text(bodyClone).split(/\s+/).filter(Boolean).length;

    out.soft404Signals = SOFT_404_PATTERNS.filter((re) => re.test(mainText.slice(0, 4000))).map(String);
    // Sample/seed data leaking into production: placeholder hosts or filler text.
    const placeholderLinks = [...new Set(links.map((l) => l.href).filter((h) => /^https?:\/\/([a-z0-9-]+\.)?example\.(com|org|net)\b/i.test(h)))];
    out.placeholderSignals = [
        ...placeholderLinks.map((h) => `link → ${h}`),
        ...(/\blorem ipsum\b/i.test(mainText) ? ['"lorem ipsum" text'] : []),
    ];
    out.bodyHasDocumentTags = (scope.html() || '').match(/<(title|meta)\b/gi)?.length || 0;
    out.hasRscPayload = html.includes('self.__next_f');
    out.htmlBytes = Buffer.byteLength(html);
    out.scriptCount = $('script[src]').length;
    out.externalScriptHosts = [...new Set($('script[src]').map((_, el) => {
        try { return new URL($(el).attr('src'), pageUrl).host; } catch { return null; }
    }).get().filter((h) => h && !siteHosts.includes(h)))];
    out.viewport = $('meta[name="viewport"]').attr('content') || null;
    out.visibleDates = (mainText.match(/(last updated|updated on|published on|last verified)[^.|]{0,40}/gi) || []).slice(0, 3);

    return out;
}

// Parses a robots directive string list (meta + X-Robots-Tag) into flags.
export function robotsFlags(values) {
    const all = values.join(',').toLowerCase();
    return {
        noindex: /\b(noindex|none)\b/.test(all),
        nofollow: /\b(nofollow|none)\b/.test(all),
    };
}
