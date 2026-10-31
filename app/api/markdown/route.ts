import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL, htmlToMarkdownTwin, isPagePath, markdownHeaders, pagePathFromTwin, twinPath } from '@/lib/markdownTwin';

// Markdown twin of a page (see lib/markdownTwin.ts). Reached only through middleware.ts, which
// rewrites /ipo.md, and /ipo with `Accept: text/markdown`, to here.
// It renders the page from this same server and converts the HTML, so every page gets a
// twin with no per-page code.
export const dynamic = 'force-dynamic';

const LOCAL_ORIGIN = `http://127.0.0.1:${process.env.PORT || 3000}`;

// .md URLs are their own cache key, so a CDN can keep them like the page. (next.config.mjs
// cache headers for the page's path, e.g. /calculator/*, also apply to its .md URL.)
// Twins served at the page URL must not be cached by a CDN that ignores `Vary: Accept`
// (Cloudflare does), or browsers could be handed markdown. CDN-Cache-Control is used for
// that because next.config.mjs replaces Cache-Control with the page's public one.
const CACHE_BY_VIA = {
    url: 'public, s-maxage=3600, stale-while-revalidate=3600',
    accept: 'private, no-cache',
};

function markdownResponse(markdown: string, status: number, via: keyof typeof CACHE_BY_VIA) {
    const response = new NextResponse(markdown, { status, headers: markdownHeaders(markdown, CACHE_BY_VIA[via]) });
    if (via === 'accept') {
        response.headers.set('CDN-Cache-Control', 'no-store');
    }
    return response;
}

export async function GET(request: NextRequest) {
    // A rewritten request keeps its original URL: /ipo.md, or /ipo asked for as markdown.
    const { pathname } = request.nextUrl;
    const via = pathname.endsWith('.md') ? 'url' : 'accept';
    const path = via === 'url' ? pagePathFromTwin(pathname) : pathname;

    if (!path.startsWith('/') || path.startsWith('//') || !isPagePath(path)) {
        return markdownResponse('# Not found\n', 404, via);
    }

    let page: Response;
    try {
        page = await fetch(`${LOCAL_ORIGIN}${path}`, {
            headers: { Accept: 'text/html' },
            redirect: 'manual',
            cache: 'no-store',
            signal: AbortSignal.timeout(30_000),
        });
    } catch (error) {
        console.error('Markdown twin fetch failed:', path, error);
        return markdownResponse('# Temporarily unavailable\n', 503, via);
    }

    // Follow the page's redirects as twin redirects, so /old.md lands on /new.md.
    const location = page.headers.get('location');
    if (page.status >= 300 && page.status < 400 && location) {
        const target = new URL(location, SITE_URL);
        if (target.origin === SITE_URL || target.hostname === '127.0.0.1') {
            const targetPath = via === 'url' ? twinPath(target.pathname) : target.pathname;
            return NextResponse.redirect(`${SITE_URL}${targetPath}${target.search}`, page.status);
        }
        return NextResponse.redirect(target, page.status);
    }

    if (!(page.headers.get('content-type') || '').includes('text/html')) {
        // e.g. the plain-text 410 Gone that middleware.ts returns for removed pages
        return markdownResponse('# Not found\n', page.status >= 400 ? page.status : 404, via);
    }

    const markdown = htmlToMarkdownTwin(await page.text(), path);
    return markdownResponse(markdown, page.status, via);
}
