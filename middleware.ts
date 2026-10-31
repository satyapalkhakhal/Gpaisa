import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { SITE_URL, acceptsPage, isPagePath, pagePathFromTwin, prefersMarkdown, twinPath } from '@/lib/markdownTwin';

// Placeholder articles (25–175 words of off-topic tech/travel demo text) seeded on
// 2026-03-24 while the site was being set up. They have no finance equivalent to
// redirect to, so they return 410 Gone. The rows stay in the database.
const REMOVED_SEED_ARTICLE_SLUGS = new Set([
    'future-ai-agents-development',
    'web3-decentralized-identity',
    'postgresql-performance-tuning',
    'complete-guide-rest-apis-nodejs',
    'react-server-components-deep-dive',
    'typescript-design-patterns',
    'getting-started-docker-kubernetes',
    'exploring-ancient-temples-cambodia',
    'backpacking-patagonia-budget',
    'solo-travel-japan-guide',
    'hidden-gems-southeast-asia',
    'hiking-inca-trail-machu-picchu',
    'street-food-tour-bangkok',
]);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // ── Admin auth gate ──
    // Protects /admin/** pages and /api/admin/** routes behind a signed session cookie.
    const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';

    if (isAdminPage || isAdminApi) {
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        const session = token ? await verifyAdminSession(token) : null;
        if (!session) {
            if (isAdminApi) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (pathname === '/admin/login') {
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        if (token && (await verifyAdminSession(token))) {
            return NextResponse.redirect(new URL('/admin/articles', request.url));
        }
    }

    // ── Agriculture vertical: permanently removed, not moved ──
    // The agriculture/mandi-prices vertical was deleted 2026-06-14. There is no
    // finance-equivalent page to redirect these URLs to, so we return 410 Gone
    // rather than a plain 404 (or a redirect into unrelated finance content,
    // which search engines treat as a soft-404/quality signal). This restores
    // handling that existed briefly before being dropped along with the pages.
    if (pathname === '/agriculture' || pathname.startsWith('/agriculture/') ||
        pathname === '/api/agriculture' || pathname.startsWith('/api/agriculture/')) {
        return new NextResponse('Gone', {
            status: 410,
            headers: { 'X-Robots-Tag': 'noindex' },
        });
    }

    if (pathname.startsWith('/articles/') && REMOVED_SEED_ARTICLE_SLUGS.has(pathname.slice('/articles/'.length))) {
        return new NextResponse('Gone', {
            status: 410,
            headers: { 'X-Robots-Tag': 'noindex' },
        });
    }

    // ── Non-www → www 301 redirect ──
    // Ensures all traffic uses the canonical www domain for SEO consistency.
    // Exclude /ads.txt so AdSense can verify it on the naked domain.
    if ((host === 'gpaisa.in' || host === 'gpaisa.in:443') && pathname !== '/ads.txt') {
        const url = request.nextUrl.clone();
        url.host = 'www.gpaisa.in';
        url.port = '';
        return NextResponse.redirect(url, { status: 301 });
    }

    // ── Markdown twins (AEO, see lib/markdownTwin.ts) ──
    // /ipo.md, or /ipo with `Accept: text/markdown`, is rendered as markdown by
    // app/api/markdown/route.ts. Only GET/HEAD are negotiated, so server actions are left alone.
    const isRead = request.method === 'GET' || request.method === 'HEAD';
    if (isRead && pathname.endsWith('.md') && isPagePath(pagePathFromTwin(pathname))) {
        return NextResponse.rewrite(new URL('/api/markdown', request.url));
    }
    if (isRead && isPagePath(pathname)) {
        const accept = request.headers.get('accept');
        if (prefersMarkdown(accept)) {
            return NextResponse.rewrite(new URL('/api/markdown', request.url));
        }
        if (!acceptsPage(accept)) {
            return new NextResponse('Not Acceptable: this page is available as text/html or text/markdown.', {
                status: 406,
                headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Vary': 'Accept' },
            });
        }
    }


    // Check if it's an old article ID URL (numeric only)
    const articleIdMatch = pathname.match(/^\/articles\/(\d+)$/);

    if (articleIdMatch) {
        const articleId = articleIdMatch[1];

        try {
            // Fetch article slug from your API
            const response = await fetch(
                `${request.nextUrl.origin}/api/article-redirect?id=${articleId}`,
                {
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.ok) {
                const { slug } = await response.json();
                if (slug) {
                    // 301 permanent redirect to slug-based URL
                    return NextResponse.redirect(
                        new URL(`/articles/${slug}`, request.url),
                        { status: 301 }
                    );
                }
            }
        } catch (error) {
            console.error('Redirect middleware error:', error);
        }

        // Unknown ID: fall through so the article route returns a real 404. Redirecting
        // every unknown ID to /news made Google treat them as soft 404s.
    }

    // ── /ipo filters → pre-built ISR pages ──
    // /ipo?tab=&type= is served from app/ipo/list/[tab]/[type] so /ipo never reads
    // searchParams (which would make it render on every request instead of ISR).
    let response = NextResponse.next();
    if (pathname === '/ipo') {
        const tab = request.nextUrl.searchParams.get('tab');
        const type = request.nextUrl.searchParams.get('type');
        const validType = type === 'mainboard' || type === 'sme';
        if (tab || validType) {
            const validTab = tab === 'open' || tab === 'upcoming' || tab === 'closed' || tab === 'listed';
            const target = new URL(`/ipo/list/${validTab ? tab : 'open'}/${validType ? type : 'all'}`, request.url);
            target.search = '';
            response = NextResponse.rewrite(target);
        }
    }
    if (isPagePath(pathname)) {
        // Advertise the markdown twin (AEO spec §6). `Vary: Accept` is added by deploy/Caddyfile,
        // since Next.js replaces a Vary header set here.
        response.headers.set('Link', `<${SITE_URL}${twinPath(pathname)}>; rel="alternate"; type="text/markdown"`);
    }
    return response;
}

// Run middleware on all routes for www redirect,
// plus specific paths for article redirect logic
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, icons, and other static assets
         */
        '/((?!_next/static|_next/image|favicon\\.ico|icon-.*\\.png|android-chrome-.*\\.png|apple-touch-icon\\.png|manifest\\.json|BingSiteAuth\\.xml).*)',
    ],
};

