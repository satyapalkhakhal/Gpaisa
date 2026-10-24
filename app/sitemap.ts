import { MetadataRoute } from 'next';
import { CATEGORIES, DROPPED_CATEGORY_DB_VALUES, categoryLanguageAlternates, categoryPath } from '@/lib/categories';
import { GLOSSARY_TERMS } from '@/lib/glossaryData';
import { fetchArticleSitemapEntries } from '@/lib/articlesApi';
import { HREFLANG, articlePath, toArticleLanguage } from '@/lib/articleLocale';
import { HINDI_CITY_NAMES, isHindiGoldPageReviewed } from '@/lib/cityGoldDataHi';
import { INDEXABLE_SILVER_CITIES } from '@/lib/silverCities';
import { goldRateLanguageAlternates } from '@/lib/goldRateLocale';
import { fetchIndexableIpoSlugs } from '@/lib/ipoApi';
import { AUTHORS, authorNameKey, authorPath } from '@/lib/authors';


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

    // Static pages. lastModified is when the page's content last changed — bump the date
    // when you edit a calculator or guide. new Date() is only used for pages whose data
    // changes daily (rates, IPO boards); the news, credit-card and category hubs use their
    // newest article's date (applied below, once articles are loaded).
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
            lastModified: new Date('2026-07-18'),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/credit-cards`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/calculator`,
            lastModified: new Date('2026-07-18'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/sip`,
            lastModified: new Date('2026-10-22'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/ppf`,
            lastModified: new Date('2026-10-22'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/swp`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/epf`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/emi`,
            lastModified: new Date('2026-10-22'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/home-loan`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/gst`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/cagr`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/fd`,
            lastModified: new Date('2026-10-22'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/nps`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/hra`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/gratuity`,
            lastModified: new Date('2026-07-17'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/simple-interest`,
            lastModified: new Date('2026-10-22'),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculator/mutual-fund`,
            lastModified: new Date('2026-10-22'),
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
        {
            url: `${baseUrl}/ipo`,
            lastModified: new Date(), // IPO statuses change frequently
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ipo/gmp`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/ipo/listing-performance`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.75,
        },
    ];

    // NCD, rights issue and buyback pages (hubs and details) and the IPO calculators are thin
    // and out of the navigation: live, but noindex and not listed here.

    // IPO detail pages — only those that pass isIpoIndexable (published, with core
    // facts and real content); thin ones are live but noindex, so not listed here.
    let ipoPages: MetadataRoute.Sitemap = [];
    try {
        const ipos = await fetchIndexableIpoSlugs();
        ipoPages = ipos.map((ipo) => ({
            url: `${baseUrl}/ipo/${ipo.slug}`,
            lastModified: new Date(ipo.updated_at),
            changeFrequency: 'daily' as const,
            priority: 0.75,
        }));
    } catch (error) {
        console.error('Error fetching IPOs for sitemap:', error);
    }

    // Glossary term pages
    const glossaryPages: MetadataRoute.Sitemap = GLOSSARY_TERMS.map((t) => ({
        url: `${baseUrl}/glossary/${t.slug}`,
        lastModified: new Date('2026-07-18'),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));


    // City-specific gold rate pages
    // hreflang pairs for gold rate pages — only once the Hindi page has passed review
    // (unreviewed Hindi pages are noindex, so they are neither listed nor paired).
    const goldAlternates = (citySlug?: string) => {
        const languages = goldRateLanguageAlternates(citySlug);
        return languages ? { alternates: { languages } } : {};
    };

    const goldRateCityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
        url: `${baseUrl}/gold-rate/${city.toLowerCase()}`,
        lastModified: new Date(), // City rates update daily
        changeFrequency: 'daily',
        priority: 0.8,
        ...goldAlternates(city.toLowerCase()),
    }));

    const hindiGoldRatePages: MetadataRoute.Sitemap = [
        ...(isHindiGoldPageReviewed('hub') ? [{
            url: `${baseUrl}/hi/gold-rate`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
            ...goldAlternates(),
        }] : []),
        ...Object.keys(HINDI_CITY_NAMES).filter((slug) => isHindiGoldPageReviewed(slug)).map((slug) => ({
            url: `${baseUrl}/hi/gold-rate/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
            ...goldAlternates(slug),
        })),
    ];

    // City-specific silver rate pages — only cities with their own content (the rest are
    // live but noindex; see lib/silverCities.ts).
    const silverRateCityPages: MetadataRoute.Sitemap = INDEXABLE_SILVER_CITIES.map((city) => ({
        url: `${baseUrl}/silver-rate/${city.slug}`,
        lastModified: new Date(), // City rates update daily
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    // Fetch latest articles for dynamic article pages
    // Cached for a day (not uncached) so the sitemap can be statically generated
    let articlePages: MetadataRoute.Sitemap = [];
    let hindiHubPages: MetadataRoute.Sitemap = [];
    let authorPages: MetadataRoute.Sitemap = [];
    let newestNewsDate: Date | undefined;
    let newestCreditCardDate: Date | undefined;
    const newestByCategory = new Map<string, Date>();
    const categoriesWithArticles = new Set<string>();
    const hindiCategoriesWithArticles = new Set<string>();
    const newestHindiByCategory = new Map<string, Date>();
    try {
        const articles = await fetchArticleSitemapEntries(DROPPED_CATEGORY_DB_VALUES, 86400);
        const publishedArticles = articles.filter((article) => article.slug);

        // Category hubs are English-only, so only English articles make one non-empty.
        publishedArticles.forEach((article) => {
            if (article.category && toArticleLanguage(article.language) === 'en') categoriesWithArticles.add(article.category);
        });

        // Translation pairs (Hindi article → the English article it translates), both published.
        const englishById = new Map(publishedArticles.filter((a) => toArticleLanguage(a.language) === 'en').map((a) => [a.id, a]));
        const hindiByEnglishId = new Map(
            publishedArticles
                .filter((a) => toArticleLanguage(a.language) === 'hi' && a.translation_of && englishById.has(a.translation_of))
                .map((a) => [a.translation_of as string, a])
        );

        articlePages = publishedArticles.map((article) => {
            const lang = toArticleLanguage(article.language);
            const english = lang === 'en' ? article : article.translation_of ? englishById.get(article.translation_of) : undefined;
            const hindi = lang === 'hi' ? article : hindiByEnglishId.get(article.id);
            // content_updated_at, not updated_at: the latter changes on any row write.
            const lastModified = article.content_updated_at
                ? new Date(article.content_updated_at)
                : article.published_at
                    ? new Date(article.published_at)
                    : new Date('2026-01-01');

            // hreflang alternates only for a published pair; each entry lists both versions.
            const alternates = english && hindi ? {
                languages: {
                    [HREFLANG.en]: `${baseUrl}${articlePath('en', english.slug)}`,
                    [HREFLANG.hi]: `${baseUrl}${articlePath('hi', hindi.slug)}`,
                    'x-default': `${baseUrl}${articlePath('en', english.slug)}`,
                },
            } : undefined;

            return {
                url: `${baseUrl}${articlePath(lang, article.slug)}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.6,
                ...(alternates ? { alternates } : {}),
            };
        });

        // Hub dates follow their newest English article (entries are newest first).
        const english = publishedArticles.filter((a) => toArticleLanguage(a.language) === 'en');
        const dateOf = (a?: { published_at: string; content_updated_at?: string | null }) =>
            a ? new Date(a.content_updated_at || a.published_at) : undefined;
        newestNewsDate = dateOf(english[0]);
        newestCreditCardDate = dateOf(english.find((a) => /credit-card|cibil|credit-score/.test(a.slug)));
        for (const a of english) {
            if (a.category && !newestByCategory.has(a.category)) newestByCategory.set(a.category, dateOf(a)!);
        }

        // Author pages, dated by the author's newest article; authors with none are left out.
        authorPages = AUTHORS.flatMap((author) => {
            const newest = publishedArticles.find((a) => a.author?.trim().replace(/\s+/g, ' ').toLowerCase() === authorNameKey(author));
            return newest ? [{
                url: `${baseUrl}${authorPath(author)}`,
                lastModified: dateOf(newest)!,
                changeFrequency: 'weekly' as const,
                priority: 0.5,
            }] : [];
        });

        // The Hindi hub is noindex while empty (app/hi/page.tsx), so it is only listed once it has articles.
        const hindiArticles = publishedArticles.filter((a) => toArticleLanguage(a.language) === 'hi');
        for (const a of hindiArticles) {
            if (!a.category) continue;
            hindiCategoriesWithArticles.add(a.category);
            if (!newestHindiByCategory.has(a.category)) newestHindiByCategory.set(a.category, dateOf(a)!);
        }
        if (hindiArticles.length) {
            hindiHubPages = [{
                url: `${baseUrl}/hi`,
                lastModified: new Date(hindiArticles[0].published_at),
                changeFrequency: 'daily',
                priority: 0.8,
            }];
        }

        console.log(`Sitemap generated with ${articlePages.length} articles (${hindiArticles.length} Hindi)`);
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }

    // Category hub pages — exclude categories with zero published articles.
    // An empty category hub is a soft-404 (200 status, no content) that we
    // noindex in app/category/[slug]/page.tsx; listing it in the sitemap would
    // be the same noindex-vs-sitemap contradiction fixed elsewhere on this site.
    // English and Hindi hubs, each listed once it has articles in its language; pairs carry hreflang.
    // A category whose English hub is a separate page (credit cards -> /credit-cards) has no English entry here.
    const categoryPages: MetadataRoute.Sitemap = CATEGORIES.flatMap((c) => {
        const hasEnglish = categoriesWithArticles.has(c.dbValue) && categoryPath(c, 'en') === `/category/${c.slug}`;
        const hasHindi = hindiCategoriesWithArticles.has(c.dbValue);
        const languages = categoryLanguageAlternates(c, hasEnglish, hasHindi);
        const entries: MetadataRoute.Sitemap = [];
        if (hasEnglish) entries.push({
            url: `${baseUrl}${categoryPath(c, 'en')}`,
            lastModified: newestByCategory.get(c.dbValue) ?? new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
            ...(languages ? { alternates: { languages } } : {}),
        });
        if (hasHindi) entries.push({
            url: `${baseUrl}${categoryPath(c, 'hi')}`,
            lastModified: newestHindiByCategory.get(c.dbValue) ?? new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
            ...(languages ? { alternates: { languages } } : {}),
        });
        return entries;
    });

    return [
        ...staticPages.map((p) => {
            if (p.url === `${baseUrl}/gold-rate`) return { ...p, ...goldAlternates() };
            if (p.url === `${baseUrl}/news` && newestNewsDate) return { ...p, lastModified: newestNewsDate };
            if (p.url === `${baseUrl}/credit-cards` && newestCreditCardDate) return { ...p, lastModified: newestCreditCardDate };
            return p;
        }),
        ...categoryPages,
        ...hindiHubPages,
        ...authorPages,
        ...glossaryPages,
        ...goldRateCityPages,
        ...hindiGoldRatePages,
        ...silverRateCityPages,
        ...articlePages,
        ...ipoPages,
    ];
}
