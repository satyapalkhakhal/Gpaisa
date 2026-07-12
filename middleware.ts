import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';

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

    // ── Non-www → www 301 redirect ──
    // Ensures all traffic uses the canonical www domain for SEO consistency.
    // Exclude /ads.txt so AdSense can verify it on the naked domain.
    if ((host === 'gpaisa.in' || host === 'gpaisa.in:443') && pathname !== '/ads.txt') {
        const url = request.nextUrl.clone();
        url.host = 'www.gpaisa.in';
        url.port = '';
        return NextResponse.redirect(url, { status: 301 });
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

        // If slug not found or error occurred, redirect to news page
        return NextResponse.redirect(
            new URL('/news', request.url),
            { status: 301 }
        );
    }

    return NextResponse.next();
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

