import { createHash } from 'node:crypto';

const SHINGLE = 5;

function shingles(text) {
    const words = (text || '').toLowerCase().replace(/[^\p{L}\p{N}\s₹%.]/gu, ' ').split(/\s+/).filter(Boolean);
    const set = new Set();
    for (let i = 0; i + SHINGLE <= words.length; i++) {
        set.add(createHash('md5').update(words.slice(i, i + SHINGLE).join(' ')).digest('hex').slice(0, 12));
    }
    return set;
}

function jaccard(a, b) {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    const [small, big] = a.size < b.size ? [a, b] : [b, a];
    for (const x of small) if (big.has(x)) inter++;
    return inter / (a.size + b.size - inter);
}

// Removes shingles that recur across a large share of pages (site chrome,
// shared widgets, disclaimers) so similarity reflects page-specific content.
export function nearDuplicateClusters(pages, { threshold = 0.8, boilerplateShare = 0.4, minShingles = 30 } = {}) {
    const sets = pages.map((p) => ({ url: p.url, template: p.template, set: shingles(p.mainText) }));
    const freq = new Map();
    for (const s of sets) for (const sh of s.set) freq.set(sh, (freq.get(sh) || 0) + 1);
    const cutoff = Math.max(3, Math.floor(sets.length * boilerplateShare));
    for (const s of sets) {
        s.unique = new Set([...s.set].filter((sh) => freq.get(sh) < cutoff));
    }
    const pairs = [];
    for (let i = 0; i < sets.length; i++) {
        if (sets[i].unique.size < minShingles) continue;
        for (let j = i + 1; j < sets.length; j++) {
            if (sets[j].unique.size < minShingles) continue;
            const sim = jaccard(sets[i].unique, sets[j].unique);
            if (sim >= threshold) pairs.push({ a: sets[i].url, b: sets[j].url, similarity: Number(sim.toFixed(3)) });
        }
    }
    // Union-find into clusters
    const parent = new Map();
    const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
    for (const p of pairs) {
        if (!parent.has(p.a)) parent.set(p.a, p.a);
        if (!parent.has(p.b)) parent.set(p.b, p.b);
        parent.set(find(p.a), find(p.b));
    }
    const clusters = new Map();
    for (const url of parent.keys()) {
        const root = find(url);
        if (!clusters.has(root)) clusters.set(root, []);
        clusters.get(root).push(url);
    }
    const uniqueShingles = Object.fromEntries(sets.map((s) => [s.url, s.unique.size]));

    // Within-template similarity: how alike pages of the same template are.
    const byTpl = new Map();
    for (const s of sets) (byTpl.get(s.template) || byTpl.set(s.template, []).get(s.template)).push(s);
    const templateSimilarity = {};
    for (const [tpl, list] of byTpl) {
        if (list.length < 2) continue;
        const sims = [];
        let maxPair = null;
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const v = jaccard(list[i].unique, list[j].unique);
                sims.push(v);
                if (!maxPair || v > maxPair.similarity) maxPair = { a: list[i].url, b: list[j].url, similarity: Number(v.toFixed(3)) };
            }
        }
        sims.sort((x, y) => x - y);
        templateSimilarity[tpl] = { pages: list.length, median: Number(sims[Math.floor(sims.length / 2)].toFixed(3)), max: maxPair };
    }
    return { pairs, clusters: [...clusters.values()], uniqueShingles, templateSimilarity };
}

export function pairSimilarity(textA, textB) {
    return Number(jaccard(shingles(textA), shingles(textB)).toFixed(3));
}
