import { MetadataRoute } from 'next';
import { fetchLatestArticles } from '@/lib/supabaseApi';

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
    const baseUrl = 'https://gpaisa.in';

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
            url: `${baseUrl}/markets`,
            lastModified: new Date(), // Markets change frequently
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/commodities`,
            lastModified: new Date(), // Commodities update daily
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/finance`,
            lastModified: new Date('2026-01-01'), // Finance section - less frequent updates
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/agriculture`,
            lastModified: new Date(), // Agriculture updates daily
            changeFrequency: 'daily',
            priority: 0.7,
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
    ];

    // Bank-specific SIP calculator pages
    const bankSIPCalculators: MetadataRoute.Sitemap = [
        'hdfc', 'icici', 'sbi', 'axis', 'kotak', 'lic', 'nippon',
        'aditya-birla', 'idfc', 'dsp', 'franklin-templeton', 'tata',
        'utm', 'motilal-oswal', 'mirae-asset'
    ].map((bank) => ({
        url: `${baseUrl}/calculator/${bank}-sip-calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
    }));

    // Bank-wise Home Loan calculator pages
    const bankHomeLoanCalculators: MetadataRoute.Sitemap = [
        'sbi', 'hdfc', 'icici', 'axis', 'kotak', 'pnb', 'bank-of-baroda',
        'canara-bank', 'union-bank', 'idbi', 'yes-bank', 'indusind',
        'idfc-first', 'bandhan', 'rbl'
    ].map((bank) => ({
        url: `${baseUrl}/calculator/${bank}-home-loan-calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
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
    // IMPROVED: Increased from 100 to 1000 for better coverage
    let articlePages: MetadataRoute.Sitemap = [];
    try {
        const articles = await fetchLatestArticles(1000); // Increased limit
        articlePages = articles
            .filter(article => article.slug) // Only include articles with slugs
            .map((article) => {
                // IMPROVED: Better lastModified logic without Date.now() fallback
                const lastModified = article.updated_at
                    ? new Date(article.updated_at)
                    : article.published_at
                        ? new Date(article.published_at)
                        : article.publishedAt
                            ? new Date(article.publishedAt)
                            : new Date('2026-01-01'); // Fallback to a fixed date instead of now

                return {
                    url: `${baseUrl}/articles/${article.slug}`,
                    lastModified,
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                };
            });

        console.log(`Sitemap generated with ${articlePages.length} articles`);
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    return [
        ...staticPages,
        ...bankSIPCalculators,
        ...bankHomeLoanCalculators,
        ...goldRateCityPages,
        ...silverRateCityPages,
        ...articlePages,
    ];
}
