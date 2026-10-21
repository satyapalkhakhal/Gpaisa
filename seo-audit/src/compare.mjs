import fs from 'node:fs';
import path from 'node:path';

// Regression diff between two run directories (issue occurrences + page state).
export function compareRuns(beforeDir, afterDir) {
    const load = (d, f) => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    const occ = (d) => {
        const issues = load(d, 'issues.json');
        const set = new Map();
        for (const i of issues) for (const u of i.affected_urls) set.set(`${i.rule}|${u}`, i);
        return set;
    };
    const [a, b] = [occ(beforeDir), occ(afterDir)];
    const added = [...b.keys()].filter((k) => !a.has(k));
    const resolved = [...a.keys()].filter((k) => !b.has(k));
    const pa = new Map(load(beforeDir, 'pages.json').map((p) => [p.url, p]));
    const pb = new Map(load(afterDir, 'pages.json').map((p) => [p.url, p]));
    const changes = [];
    for (const [url, after] of pb) {
        const before = pa.get(url);
        if (!before) { changes.push({ url, change: 'new URL', after: `${after.status} indexable=${after.indexable}` }); continue; }
        for (const f of ['status', 'indexable', 'noindex', 'canonicalState', 'inSitemap']) {
            if (String(before[f]) !== String(after[f])) changes.push({ url, change: f, before: before[f], after: after[f] });
        }
    }
    for (const url of pa.keys()) if (!pb.has(url)) changes.push({ url, change: 'URL no longer seen' });

    const L = [`# Audit comparison`, '', `- Before: ${beforeDir}`, `- After: ${afterDir}`, '',
        `## New issue occurrences (${added.length})`, '', ...added.slice(0, 300).map((k) => `- ${k.replace('|', ' — ')}`), '',
        `## Resolved issue occurrences (${resolved.length})`, '', ...resolved.slice(0, 300).map((k) => `- ${k.replace('|', ' — ')}`), '',
        `## Page state changes (${changes.length})`, '', '| URL | Field | Before | After |', '|---|---|---|---|',
        ...changes.slice(0, 500).map((c) => `| ${c.url} | ${c.change} | ${c.before ?? ''} | ${c.after ?? ''} |`)];
    return { added, resolved, changes, markdown: L.join('\n') + '\n' };
}
