/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                // /finance rendered the same BUSINESS-category article feed as /category/business
                // under a different title, with no unique content of its own.
                source: '/finance',
                destination: '/category/business',
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
                source: '/:path(favicon.ico|icon-512.png|icon-192.png|manifest.json|robots.txt|BingSiteAuth.xml)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=604800, stale-while-revalidate=86400',
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

