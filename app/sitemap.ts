import { MetadataRoute } from 'next';
import { CATEGORIES, DROPPED_CATEGORY_DB_VALUES } from '@/lib/categories';
import { GLOSSARY_TERMS } from '@/lib/glossaryData';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const CITIES = [
    'delhi',
    'chennai',
    'mumbai',
    'pune',
    'hyderabad',
    'bangalore',
    'coimbatore',
    'kolkata',
    'ahmedabad',
    'kerala',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.gpaisa.in';

    // Static pages - use more realistic lastModified dates
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(), // Homepage changes frequently
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(), // News page changes frequently
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gold-rate`,
            lastModified: new Date(), // Gold rates update daily
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/silver-rate`,
            lastModified: new Date(), // Silver rates update daily
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/commodities`,
            lastModified: new Date(), // Commodities update daily
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gold-vs-silver`,
            lastModified: new Date(), // Blog page
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/calculator`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/sip`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/ppf`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/swp`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/epf`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/emi`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/home-loan`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/gst`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/cagr`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/fd`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/nps`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/hra`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/gratuity`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/simple-interest`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/mutual-fund`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/car-loan`,
            lastModified: new Date('2026-05-22'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/income-tax`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/ssy`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/calculator/nsc`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/calculator/scss`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/glossary`,
            lastModified: new Date('2026-07-18'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/gold-affordability-index`,
            lastModified: new Date('2026-07-18'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Glossary term pages
    const glossaryPages: MetadataRoute.Sitemap = GLOSSARY_TERMS.map((t) => ({
        url: `${baseUrl}/glossary/${t.slug}`,
        lastModified: new Date('2026-07-18'),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));


    // City-specific gold rate pages
    const goldRateCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
        url: `${baseUrl}/gold-rate/${city.toLowerCase()}`,
        lastModified: new Date(), // City rates update daily
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    // City-specific silver rate pages
    const silverRateCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
        url: `${baseUrl}/silver-rate/${city.toLowerCase()}`,
        lastModified: new Date(), // City rates update daily
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    // Fetch latest articles for dynamic article pages
    // Uses direct fetch with revalidate (not cache:'no-store') so sitemap can be statically generated
    let articlePages: MetadataRoute.Sitemap = [];
    const categoriesWithArticles = new Set<string>();
    try {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('[SITEMAP] Missing Supabase env vars');
        } else {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/articles?select=slug,published_at,updated_at,category&status=eq.published&category=not.in.(${DROPPED_CATEGORY_DB_VALUES.join(',')})&order=published_at.desc&limit=1000`,
                {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    next: { revalidate: 86400 }, // Revalidate daily — compatible with static generation
                }
            );

            if (!response.ok) {
                console.error(`[SITEMAP] Fetch failed: HTTP ${response.status}`);
            } else {
                const articles = await response.json();
                const publishedArticles = (Array.isArray(articles) ? articles : []).filter((article: any) => article.slug);

                publishedArticles.forEach((article: any) => {
                    if (article.category) categoriesWithArticles.add(article.category);
                });

                articlePages = publishedArticles.map((article: any) => {
                    const lastModified = article.updated_at
                        ? new Date(article.updated_at)
                        : article.published_at
                            ? new Date(article.published_at)
                            : new Date('2026-01-01');

                    return {
                        url: `${baseUrl}/articles/${article.slug}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                    };
                });

                console.log(`Sitemap generated with ${articlePages.length} articles`);
            }
        }
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    // Category hub pages — exclude categories with zero published articles.
    // An empty category hub is a soft-404 (200 status, no content) that we
    // noindex in app/category/[slug]/page.tsx; listing it in the sitemap would
    // be the same noindex-vs-sitemap contradiction fixed elsewhere on this site.
    const categoryPages: MetadataRoute.Sitemap = CATEGORIES
        .filter((c) => categoriesWithArticles.has(c.dbValue))
        .map((c) => ({
            url: `${baseUrl}/category/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        }));

    return [
        ...staticPages,
        ...categoryPages,
        ...glossaryPages,
        ...goldRateCityPages,
        ...silverRateCityPages,
        ...articlePages,
    ];
}
