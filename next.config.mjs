/** @type {import('next').NextConfig} */
const nextConfig = {
    // Self-contained server bundle (.next/standalone) for the Docker image in deploy/.
    output: 'standalone',
    // Emit generateMetadata output (title, canonical, robots, OG) in <head> for every
    // user-agent. By default Next.js streams it into <body> on dynamic renders unless the
    // UA is on its "HTML-limited bot" list — which matches Google-InspectionTool but not
    // Googlebot, so real Googlebot got canonical/robots in <body> (ignored by Google).
    htmlLimitedBots: /.*/,
    async redirects() {
        return [
            {
                // /finance rendered the same BUSINESS-category article feed as /category/business
                // under a different title, with no unique content of its own.
                source: '/finance',
                destination: '/category/business',
                permanent: true,
            },
            // Article slugs renamed in the CMS without a redirect; the old URLs are still
            // linked from article bodies and were reported as 404s.
            {
                source: '/articles/gold-market-weekly-review-june-7-14-2026',
                destination: '/articles/gold-market-weekly-review-why-gold-fell-13760-per-10-grams-in-2-weeks-and-what-happens-next',
                permanent: true,
            },
            {
                source: '/articles/gold-prices-nearly-doubled-from-2024-to-2026',
                destination: '/articles/gold-prices-nearly-doubled-20242026-why-indian-buyers-are-now-hesitating-before-weddings-festivals',
                permanent: true,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        minimumCacheTTL: 172800,
    },
    async headers() {
        return [
            {
                // Cache static assets (JS, CSS, fonts) for 1 year (immutable)
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Cache images for 30 days
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=2592000, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                // Cache public assets (icons, manifests) for 7 days
                source: '/:path(favicon.ico|icon-512.png|icon-192.png|manifest.json|BingSiteAuth.xml)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                // robots.txt for 1 hour, so rule changes reach crawlers (and the CDN) the same day
                source: '/robots.txt',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, stale-while-revalidate=3600',
                    },
                ],
            },
            {
                // Static pages (about, terms, privacy, contact, disclaimer, gold-vs-silver) - cache for 7 days
                source: '/:path(about|terms|privacy-policy|contact|disclaimer|gold-vs-silver)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                // Calculator pages - static, cache for 7 days
                source: '/calculator/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=604800, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                // Dynamic pages (gold-rate, silver-rate, articles, news, etc.) - cache for 1 day
                source: '/:path(gold-rate|silver-rate|news|commodities|markets|category)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=86400, stale-while-revalidate=3600',
                    },
                ],
            },
            {
                // Dynamic sub-pages - cache for 1 day
                source: '/:section(gold-rate|silver-rate|articles|category)/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=86400, stale-while-revalidate=3600',
                    },
                ],
            },
            {
                // Homepage - cache for 1 day
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=86400, stale-while-revalidate=3600',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

