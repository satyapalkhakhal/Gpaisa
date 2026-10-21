import fs from 'node:fs';
import path from 'node:path';
import { rule, SEVERITY_ORDER } from './rules.mjs';

const csvCell = (v) => {
    if (v === null || v === undefined) return '';
    const s = Array.isArray(v) ? v.join(' | ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows, cols) => [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';

export function aggregateIssues(result, config) {
    const tplPattern = Object.fromEntries(config.templates.map((t) => [t.name, t]));
    const groups = new Map();
    for (const o of result.occurrences) {
        const key = `${o.rule}@${o.template || 'other'}`;
        if (!groups.has(key)) groups.set(key, { key, rule: o.rule, template: o.template || 'other', urls: new Set(), evidence: [] });
        const g = groups.get(key);
        g.urls.add(o.url);
        if (g.evidence.length < 5) g.evidence.push(`${o.url} — ${o.evidence}`);
    }
    const issues = [...groups.values()].map((g) => {
        const r = rule(g.rule);
        const t = tplPattern[g.template];
        return {
            issue_id: g.key,
            rule: g.rule,
            title: r.title,
            category: r.category,
            severity: r.severity,
            confidence: r.confidence,
            impact: r.impact,
            template: g.template,
            affected_pattern: t ? t.pattern : g.template,
            affected_count: g.urls.size,
            affected_urls: [...g.urls].slice(0, 50),
            evidence: g.evidence,
            why_it_matters: r.why,
            recommended_fix: r.fix,
            inspect: t && t.source && !['site-wide', 'sitemap'].includes(g.template) ? `${t.source}; ${r.inspect}` : r.inspect,
            validation: r.validation,
            effort: r.effort,
        };
    });
    issues.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.affected_count - a.affected_count);
    return issues;
}

const PAGE_COLS = [
    'url', 'template', 'source', 'inSitemap', 'sitemapLastmod', 'lastmodIsNow', 'status', 'firstStatus', 'redirectHops', 'finalUrl', 'redirectChain',
    'robotsAllowed', 'robotsRule', 'xRobotsTag', 'robotsMetaJoined', 'noindex', 'indexable', 'canonical', 'canonicalState',
    'title', 'titleLength', 'metaDescription', 'descriptionLength', 'h1', 'h1Count', 'h2Count', 'wordCount', 'uniqueShingles', 'nearDupCluster',
    'jsonLdTypes', 'leadImage', 'leadImageWidth', 'leadImageHeight', 'inlinks', 'inlinksContextual', 'clickDepth', 'outlinksInternal', 'ttfbMs', 'htmlKB', 'cacheStatus', 'soft404Signals', 'gscReason', 'gscClicks', 'gscImpressions', 'error', 'note',
];

function pageRow(p) {
    return {
        ...p,
        robotsMetaJoined: (p.robotsMeta || []).concat(p.googlebotMeta || []).join(' ; '),
        title: p.titles?.[0] || '',
        titleLength: (p.titles?.[0] || '').length || '',
        metaDescription: p.metaDescriptions?.[0] || '',
        descriptionLength: (p.metaDescriptions?.[0] || '').length || '',
        h1: p.h1s?.[0] || '',
        h1Count: p.h1s ? p.h1s.length : '',
        h2Count: p.headingCounts?.h2 ?? '',
        jsonLdTypes: (p.jsonLd || []).map((j) => j.type).join(' ; '),
        outlinksInternal: p.links ? p.links.filter((l) => l.internal).length : '',
        htmlKB: p.htmlBytes ? Math.round(p.htmlBytes / 1024) : '',
        soft404Signals: (p.soft404Signals || []).join(' ; '),
    };
}

export function writeRun(result, config, outDir, { commandLine }) {
    fs.mkdirSync(outDir, { recursive: true });
    const issues = aggregateIssues(result, config);
    const pages = result.pages.map(pageRow);

    fs.writeFileSync(path.join(outDir, 'url-inventory.csv'), toCsv(pages, PAGE_COLS));
    fs.writeFileSync(path.join(outDir, 'issues.csv'), toCsv(issues, [
        'issue_id', 'severity', 'confidence', 'impact', 'category', 'title', 'template', 'affected_pattern', 'affected_count', 'affected_urls',
        'evidence', 'why_it_matters', 'recommended_fix', 'inspect', 'validation', 'effort',
    ]));
    fs.writeFileSync(path.join(outDir, 'issue-occurrences.csv'), toCsv(result.occurrences.map((o) => ({ ...o, severity: rule(o.rule).severity })), ['rule', 'severity', 'template', 'url', 'evidence', 'source']));
    fs.writeFileSync(path.join(outDir, 'issues.json'), JSON.stringify(issues, null, 2));
    const slimPages = result.pages.map(({ mainText, links, ...rest }) => ({ ...rest, internalLinks: (links || []).filter((l) => l.internal).map((l) => l.href) }));
    fs.writeFileSync(path.join(outDir, 'pages.json'), JSON.stringify(slimPages, null, 2));
    fs.writeFileSync(path.join(outDir, 'requests-log.csv'), toCsv(result.requestLog, ['at', 'method', 'url', 'status', 'ms', 'ua', 'error']));
    fs.writeFileSync(path.join(outDir, 'audit-config.used.json'), JSON.stringify(Object.fromEntries(Object.entries(config).filter(([k]) => !k.startsWith('_'))), null, 2));

    const { pages: _p, occurrences: _o, requestLog: _r, ...rest } = result;
    const summary = {
        ...rest,
        commandLine,
        counts: {
            urls: result.pages.length,
            sitemapEntries: result.sitemap.entryCount,
            status: countBy(result.pages, (p) => String(p.redirectHops ? `${p.firstStatus} (redirect)` : p.status)),
            indexable: result.pages.filter((p) => p.indexable).length,
            noindex: result.pages.filter((p) => p.noindex).length,
            byTemplate: countBy(result.pages, (p) => p.template),
            issuesBySeverity: countBy(issues, (i) => i.severity),
        },
        templates: templateSummary(result.pages),
    };
    fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(outDir, 'report.md'), markdownReport(summary, issues));
    return { issues, summary };
}

function countBy(arr, fn) {
    return arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m; }, {});
}

function templateSummary(pages) {
    const out = {};
    for (const p of pages) {
        const t = (out[p.template] ||= { urls: 0, ok200: 0, indexable: 0, inSitemap: 0, orphans: 0, medianWords: [], medianUnique: [], medianInlinks: [] });
        t.urls++;
        if (p.status === 200 && !p.redirectHops) t.ok200++;
        if (p.indexable) t.indexable++;
        if (p.inSitemap) t.inSitemap++;
        if (p.indexable && p.inlinks === 0 && p.template !== 'home') t.orphans++;
        if (p.wordCount !== undefined) t.medianWords.push(p.wordCount);
        if (p.uniqueShingles !== undefined) t.medianUnique.push(p.uniqueShingles);
        if (p.inlinks !== undefined) t.medianInlinks.push(p.inlinks);
    }
    const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
    for (const t of Object.values(out)) {
        t.medianWords = med(t.medianWords);
        t.medianUnique = med(t.medianUnique);
        t.medianInlinks = med(t.medianInlinks);
    }
    return out;
}

function markdownReport(summary, issues) {
    const L = [];
    L.push(`# Automated SEO audit run — ${summary.meta.origin}`, '');
    L.push(`- Started: ${summary.meta.startedAt}  `, `- Finished: ${summary.meta.finishedAt}  `, `- HTTP requests: ${summary.meta.requests}  `, `- URLs audited: ${summary.counts.urls} (sitemap entries: ${summary.counts.sitemapEntries})  `, `- Command: \`${summary.commandLine}\``, '');
    L.push('> Technical audit only. Indexing status is **not** inferred: only Search Console data (if supplied in gsc-exports/) can confirm Google\'s index decisions.', '');
    L.push('## Status codes', '', '| Status | URLs |', '|---|---|', ...Object.entries(summary.counts.status).map(([k, v]) => `| ${k} | ${v} |`), '');
    L.push('## Templates', '', '| Template | URLs | 200 | Indexable | In sitemap | Orphans | Median words | Median page-specific shingles | Median inlinks |', '|---|---|---|---|---|---|---|---|---|');
    for (const [k, t] of Object.entries(summary.templates)) L.push(`| ${k} | ${t.urls} | ${t.ok200} | ${t.indexable} | ${t.inSitemap} | ${t.orphans} | ${t.medianWords ?? ''} | ${t.medianUnique ?? ''} | ${t.medianInlinks ?? ''} |`);
    L.push('', '## Within-template content similarity', '', 'Jaccard similarity of 5-word shingles after removing site-wide boilerplate (1.0 = identical).', '', '| Template | Pages | Median pair | Most similar pair |', '|---|---|---|---|');
    for (const [k, t] of Object.entries(summary.templateSimilarity || {})) L.push(`| ${k} | ${t.pages} | ${t.median} | ${t.max.similarity} (${new URL(t.max.a).pathname} ↔ ${new URL(t.max.b).pathname}) |`);
    L.push('', '## Host variants', '', '| Variant | Final status | Hops | Chain |', '|---|---|---|---|', ...summary.hostChecks.map((h) => `| ${h.variant} | ${h.status} | ${h.hops} | ${h.chain} |`));
    L.push('', '## Related domains', '', '| Source | Final | Hops | Chain |', '|---|---|---|---|', ...summary.relatedChecks.map((h) => `| ${h.source} | ${h.status} ${h.finalUrl} | ${h.hops} | ${h.chain} |`));
    L.push('', '## Probes', '', '| Kind | URL | Status | Final | Notes |', '|---|---|---|---|---|', ...summary.probes.map((p) => `| ${p.kind} | ${p.url} | ${p.status} | ${p.finalUrl} | ${p.canonical ? 'canonical ' + p.canonical : ''}${p.title ? 'title ' + p.title : ''}${p.chain ? p.chain : ''}${p.xRobotsTag ? ' X-Robots-Tag ' + p.xRobotsTag : ''} |`));
    L.push('', '## Googlebot UA comparison', '', '| URL | Default | Googlebot UA | Same title | Same canonical | Same robots | Words (default/UA) |', '|---|---|---|---|---|---|---|', ...summary.uaChecks.map((u) => `| ${u.url} | ${u.statusDefault} | ${u.statusAlt} | ${u.titleSame} | ${u.canonicalSame} | ${u.robotsSame} | ${u.wordsDefault}/${u.wordsAlt} |`));
    L.push('', '## Render check', '');
    if (!summary.render.ran) L.push(`Not run: ${summary.render.reason}`);
    else {
        L.push('Lab metrics: local headless Chrome, mobile viewport, no throttling — directional only, not Core Web Vitals field data.', '');
        L.push('| URL | Words raw→rendered | Links only after render | Title same | Canonical same | Errors | Robots-blocked API calls | Lab LCP ms | Lab CLS | JS KB | 3rd-party hosts |', '|---|---|---|---|---|---|---|---|---|---|---|');
        for (const r of summary.render.results) L.push(r.error ? `| ${r.url} | error: ${r.error} | | | | | | | | | |` : `| ${r.url} | ${r.wordsRaw}→${r.wordsRendered} | ${r.linksRenderedOnly} | ${r.titleRaw === r.titleRendered} | ${r.canonicalRaw === r.canonicalRendered} | ${r.consoleErrors.length + r.failedRequests.length} | ${r.robotsBlockedRequests.join(' ')} | ${r.lab?.lcpMs ?? ''} | ${r.lab?.cls ?? ''} | ${r.lab?.jsKB ?? ''} | ${r.lab?.thirdPartyHosts ?? ''} |`);
    }
    L.push('', '## Search Console exports', '');
    if (!summary.gsc.ran) L.push(`Not run: ${summary.gsc.reason}`);
    else {
        const ov = summary.gsc.overview || {};
        if (ov.trend) {
            const t = ov.trend;
            L.push(`Page indexing trend ${t.from} → ${t.to}: not indexed ${t.first?.['not indexed']} → ${t.last?.['not indexed']}; indexed ${t.first?.indexed} → ${t.last?.indexed} (max ${t.maxIndexed}); impressions in period ${t.totalImpressions}.`, '');
        }
        if (ov.reasons?.length) {
            const total = ov.reasons.reduce((s, r) => s + r.pages, 0);
            L.push('| Reason | Source | Validation | Pages | Share |', '|---|---|---|---|---|', ...ov.reasons.map((r) => `| ${r.reason} | ${r.source} | ${r.validation} | ${r.pages} | ${total ? Math.round((r.pages / total) * 100) : 0}% |`), '');
        }
        if (Object.keys(ov.metadata || {}).length) L.push(`Export filter: ${JSON.stringify(ov.metadata)}`, '');
        const g = Object.entries(summary.gsc.groups || {});
        L.push(g.length ? g.map(([k, v]) => `- **${k}**: ${v.count} URLs — live now: ${JSON.stringify(v.liveStates)}`).join('\n') : 'No URL-level exports yet (drill into each reason → Export) — needed to join reasons to live URL state.');
    }
    L.push('', '## Google Discover readiness', '');
    if (summary.discover?.pages) {
        const d = summary.discover;
        L.push(`Templates checked: ${d.templates.join(', ')} (${d.pages} indexable pages). Feeds advertised: ${d.feeds.length ? d.feeds.join(', ') : 'none'}.`, '');
        if (d.imageChecks.length) {
            const widths = d.imageChecks.filter((x) => x.width).map((x) => x.width);
            L.push(`Lead images measured: ${d.imageChecks.length}; ≥1200 px wide: ${widths.filter((w) => w >= 1200).length}; <1200 px: ${widths.filter((w) => w < 1200).length}; unreadable: ${d.imageChecks.length - widths.length}.`);
        }
    } else L.push('No Discover templates configured (discover.templates).');
    L.push('', '## Issues', '', '| ID | Severity | Confidence | Impact | Affected | Title |', '|---|---|---|---|---|---|');
    for (const i of issues) L.push(`| ${i.issue_id} | ${i.severity} | ${i.confidence} | ${i.impact} | ${i.affected_count} | ${i.title} |`);
    if (summary.meta.notes.length) L.push('', '## Notes / limitations', '', ...summary.meta.notes.map((n) => `- ${n}`));
    return L.join('\n') + '\n';
}
