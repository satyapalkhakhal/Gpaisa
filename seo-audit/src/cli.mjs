#!/usr/bin/env node
// Usage:
//   node src/cli.mjs audit [--config audit.config.json] [--render] [--out runs/<name>] [--max-pages N] [--origin https://...]
//   node src/cli.mjs compare <beforeRunDir> <afterRunDir> [--out diff.md]
import fs from 'node:fs';
import path from 'node:path';
import { runAudit } from './audit.mjs';
import { writeRun } from './report.mjs';
import { compareRuns } from './compare.mjs';

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name, def) => {
    const i = args.indexOf(name);
    if (i < 0) return def;
    const v = args[i + 1];
    return v && !v.startsWith('--') ? v : true;
};

async function main() {
    if (cmd === 'compare') {
        const [before, after] = args.slice(1).filter((a) => !a.startsWith('--'));
        if (!before || !after) throw new Error('compare needs <beforeRunDir> <afterRunDir>');
        const res = compareRuns(before, after);
        const out = flag('--out', path.join(after, 'comparison.md'));
        fs.writeFileSync(out, res.markdown);
        console.log(`New: ${res.added.length}  Resolved: ${res.resolved.length}  Page changes: ${res.changes.length}\n→ ${out}`);
        return;
    }
    if (cmd !== 'audit') {
        console.log('Usage: node src/cli.mjs audit [--config file] [--render] [--out dir] [--max-pages N] [--origin url]\n       node src/cli.mjs compare <beforeRunDir> <afterRunDir>');
        process.exit(cmd ? 1 : 0);
    }
    const configPath = path.resolve(flag('--config', 'audit.config.json'));
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config._configDir = path.dirname(configPath);
    if (flag('--origin')) config.site.canonicalOrigin = flag('--origin');
    if (flag('--max-pages')) config.crawl.maxPages = Number(flag('--max-pages'));
    const render = Boolean(flag('--render', false));

    const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outDir = path.resolve(config._configDir, flag('--out', path.join(config.output.runsDir, stamp)));
    const result = await runAudit(config, { render });
    const { issues, summary } = writeRun(result, config, outDir, { commandLine: 'node src/cli.mjs ' + args.join(' ') });

    console.log(`\nAudited ${summary.counts.urls} URLs with ${summary.meta.requests} requests.`);
    console.log('Issues by severity:', summary.counts.issuesBySeverity);
    for (const i of issues.slice(0, 15)) console.log(`  [${i.severity}] ${i.issue_id} ×${i.affected_count} — ${i.title}`);
    console.log(`\nOutputs → ${outDir}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
