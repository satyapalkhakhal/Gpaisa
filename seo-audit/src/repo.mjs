import fs from 'node:fs';
import path from 'node:path';

// Enumerates Next.js App Router routes from app/**/page.(tsx|ts|jsx|js).
// Route groups "(x)" are dropped; segments with [..] are dynamic.
export function scanRepoRoutes(repoCfg, configDir) {
    if (repoCfg.framework !== 'nextjs-app') return { ran: false, reason: `framework ${repoCfg.framework} not supported` };
    const appDir = path.resolve(configDir, repoCfg.path, repoCfg.appDir || 'app');
    if (!fs.existsSync(appDir)) return { ran: false, reason: `${appDir} not found` };
    const staticRoutes = [];
    const dynamicRoutes = [];
    const byRoute = {};
    const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) { walk(full); continue; }
            if (!/^page\.(tsx|ts|jsx|js)$/.test(ent.name)) continue;
            const rel = path.relative(appDir, path.dirname(full)).split(path.sep).filter(Boolean);
            const segs = rel.filter((s) => !/^\(.*\)$/.test(s));
            const route = '/' + segs.join('/');
            const file = path.relative(path.resolve(configDir, repoCfg.path), full);
            if (/^\/(admin|api)(\/|$)/.test(route)) continue;
            byRoute[route] = file;
            if (segs.some((s) => s.startsWith('['))) dynamicRoutes.push(route);
            else staticRoutes.push(route === '/' ? '/' : route);
        }
    };
    walk(appDir);
    // Optional catch-all [[...x]] also serves its parent path statically.
    for (const r of dynamicRoutes) {
        const m = r.match(/^(.*)\/\[\[\.\.\.[^\]]+\]\]$/);
        if (m && !staticRoutes.includes(m[1] || '/')) { staticRoutes.push(m[1] || '/'); byRoute[m[1] || '/'] = byRoute[r]; }
    }
    return { ran: true, appDir, staticRoutes: staticRoutes.sort(), dynamicRoutes: dynamicRoutes.sort(), byRoute };
}
