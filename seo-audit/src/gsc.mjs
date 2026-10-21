import fs from 'node:fs';
import path from 'node:path';

export function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let q = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (q) {
            if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (ch === '"') q = false;
            else field += ch;
        } else if (ch === '"') q = true;
        else if (ch === ',') { row.push(field); field = ''; }
        else if (ch === '\n' || ch === '\r') {
            if (ch === '\r' && text[i + 1] === '\n') i++;
            row.push(field); rows.push(row); row = []; field = '';
        } else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim()));
}

// Ingests Search Console CSV exports (Page indexing drill-downs, Performance → Pages).
// Never fabricates data: if no exports are present the module reports ran=false.
export function loadGscExports(gscCfg, configDir, pages, norm, add) {
    if (!gscCfg?.exportsDir) return { ran: false, reason: 'gsc.exportsDir not configured' };
    const dir = path.resolve(configDir, gscCfg.exportsDir);
    if (!fs.existsSync(dir)) return { ran: false, reason: `No exports directory at ${dir}` };
    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.csv'));
    if (!files.length) return { ran: false, reason: `No CSV files in ${dir}` };

    const groups = {};
    const performance = [];
    // Page-indexing overview export (Critical issues.csv / Non-critical issues.csv / Chart.csv / Metadata.csv)
    const overview = { reasons: [], trend: null, metadata: {} };
    for (const f of files) {
        const rows = parseCsv(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^﻿/, ''));
        if (!rows.length) continue;
        const header = rows[0].map((h) => h.trim().toLowerCase());
        if (header.includes('reason') && header.includes('pages')) {
            const col = (n) => header.indexOf(n);
            for (const r of rows.slice(1)) {
                overview.reasons.push({ reason: r[col('reason')], source: r[col('source')] || '', validation: r[col('validation')] || '', pages: Number(r[col('pages')] || 0), file: f });
            }
            continue;
        }
        if (header[0] === 'date' && header.includes('indexed')) {
            const series = rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] === '' ? null : Number.isNaN(Number(r[i])) ? r[i] : Number(r[i])])));
            const withCounts = series.filter((s) => s['not indexed'] !== null && s['not indexed'] !== undefined);
            overview.trend = {
                from: series[0]?.date, to: series.at(-1)?.date,
                first: withCounts[0] || null, last: withCounts.at(-1) || null,
                maxIndexed: Math.max(...withCounts.map((s) => s.indexed || 0)),
                totalImpressions: series.reduce((s, x) => s + (x.impressions || 0), 0),
            };
            continue;
        }
        if (header[0] === 'property' && header[1] === 'value') {
            for (const r of rows.slice(1)) overview.metadata[r[0]] = r[1];
            continue;
        }
        const urlCol = header.findIndex((h) => ['url', 'page', 'top pages', 'pages'].includes(h));
        if (urlCol < 0) continue;
        const reasonCol = header.findIndex((h) => ['reason', 'status', 'coverage', 'issue'].includes(h));
        const clicksCol = header.indexOf('clicks');
        const imprCol = header.indexOf('impressions');
        const lastCrawledCol = header.findIndex((h) => h.startsWith('last crawled'));
        const fileReason = path.basename(f, '.csv');
        for (const r of rows.slice(1)) {
            const url = norm(r[urlCol]);
            if (!url) continue;
            const page = pages.get(url);
            if (clicksCol >= 0 || imprCol >= 0) {
                performance.push({ url, clicks: Number(r[clicksCol] || 0), impressions: Number(r[imprCol] || 0) });
                if (page) { page.gscClicks = Number(r[clicksCol] || 0); page.gscImpressions = Number(r[imprCol] || 0); }
                continue;
            }
            const reason = (reasonCol >= 0 ? r[reasonCol] : fileReason).trim();
            const live = page
                ? `${page.status}${page.redirectHops ? ' redirect' : ''}${page.noindex ? ' noindex' : ''} canonical:${page.canonicalState || '-'}`
                : 'not crawled';
            (groups[reason] ||= []).push({ url, lastCrawled: lastCrawledCol >= 0 ? r[lastCrawledCol] : '', live });
            if (page) {
                page.gscReason = reason;
                const r404 = /not found|404/i.test(reason);
                const rRedirect = /redirect/i.test(reason);
                const rNoindex = /noindex/i.test(reason);
                if ((r404 && page.status === 200) || (rRedirect && !page.redirectHops) || (rNoindex && page.status === 200 && !page.noindex)) {
                    add('GSC-STATUS-MISMATCH', url, `GSC says "${reason}" but live: ${live}`, { template: page.template });
                }
            }
        }
    }
    const summary = Object.fromEntries(Object.entries(groups).map(([k, v]) => {
        const liveStates = v.reduce((m, x) => { m[x.live] = (m[x.live] || 0) + 1; return m; }, {});
        return [k, { count: v.length, liveStates, sample: v.slice(0, 10) }];
    }));
    overview.reasons.sort((a, b) => b.pages - a.pages);
    return { ran: true, files, groups: summary, overview, performanceRows: performance.length };
}
