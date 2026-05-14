import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // ── Non-www → www 301 redirect ──
    // Ensures all traffic uses the canonical www domain for SEO consistency.
    if (host === 'gpaisa.in' || host === 'gpaisa.in:443') {
        const url = request.nextUrl.clone();
        url.host = 'www.gpaisa.in';
        url.port = '';
        return NextResponse.redirect(url, { status: 301 });
    }

    // ── Agriculture pages: return 410 Gone ──
    // Temporarily hidden — will be re-enabled in the future.
    // 410 tells search engines the content has been intentionally removed.
    if (pathname.startsWith('/agriculture') || pathname.startsWith('/api/agriculture')) {
        return new NextResponse(
            JSON.stringify({
                error: 'Gone',
                message: 'This page is no longer available.',
                statusCode: 410,
            }),
            {
                status: 410,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Robots-Tag': 'noindex',
                },
            }
        );
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
// plus specific paths for article/agriculture logic
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

