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

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gold-rate`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/silver-rate`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/markets`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/commodities`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/finance`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/agriculture`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
    ];

    // City-specific gold rate pages
    const goldRateCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
        url: `${baseUrl}/gold-rate/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    // City-specific silver rate pages
    const silverRateCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
        url: `${baseUrl}/silver-rate/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    // Fetch latest articles for dynamic article pages
    let articlePages: MetadataRoute.Sitemap = [];
    try {
        const articles = await fetchLatestArticles(100); // Fetch up to 100 latest articles
        articlePages = articles.map((article) => ({
            url: `${baseUrl}/articles/${article.id}`,
            lastModified: new Date(article.updated_at || article.published_at || article.publishedAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    return [
        ...staticPages,
        ...goldRateCityPages,
        ...silverRateCityPages,
        ...articlePages,
    ];
}
