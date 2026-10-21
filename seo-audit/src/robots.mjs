// Minimal robots.txt parser following Google's documented matching rules:
// the most specific (longest) matching group for the user-agent wins, and
// within it the longest matching Allow/Disallow path wins (Allow on ties).

export function parseRobots(text) {
    const groups = [];
    const sitemaps = [];
    let current = null;
    let lastWasAgent = false;
    for (const rawLine of (text || '').split(/\r?\n/)) {
        const line = rawLine.replace(/#.*/, '').trim();
        if (!line) continue;
        const idx = line.indexOf(':');
        if (idx < 0) continue;
        const key = line.slice(0, idx).trim().toLowerCase();
        const value = line.slice(idx + 1).trim();
        if (key === 'user-agent') {
            if (!lastWasAgent || !current) {
                current = { agents: [], rules: [] };
                groups.push(current);
            }
            current.agents.push(value.toLowerCase());
            lastWasAgent = true;
            continue;
        }
        lastWasAgent = false;
        if (key === 'sitemap') sitemaps.push(value);
        else if ((key === 'allow' || key === 'disallow') && current) current.rules.push({ type: key, path: value });
    }
    return { groups, sitemaps };
}

function groupFor(parsed, userAgent) {
    const ua = userAgent.toLowerCase();
    let best = null;
    let bestLen = -1;
    for (const g of parsed.groups) {
        for (const a of g.agents) {
            if (a === '*' && bestLen < 0) { best = g; bestLen = 0; }
            else if (a !== '*' && ua.includes(a) && a.length > bestLen) { best = g; bestLen = a.length; }
        }
    }
    return best;
}

function ruleToRegex(path) {
    const anchored = path.endsWith('$');
    const body = (anchored ? path.slice(0, -1) : path)
        .replace(/[.+?^{}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
    return new RegExp('^' + body + (anchored ? '$' : ''));
}

export function isAllowed(parsed, userAgent, pathWithQuery) {
    const group = groupFor(parsed, userAgent);
    if (!group) return { allowed: true, rule: null };
    let match = null;
    for (const r of group.rules) {
        if (r.path === '' && r.type === 'disallow') continue; // "Disallow:" == allow all
        if (ruleToRegex(r.path).test(pathWithQuery)) {
            if (!match || r.path.length > match.path.length || (r.path.length === match.path.length && r.type === 'allow')) {
                match = r;
            }
        }
    }
    return { allowed: !match || match.type === 'allow', rule: match };
}
