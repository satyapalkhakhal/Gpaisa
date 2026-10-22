import { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticlesByLanguage } from '@/lib/articlesApi';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { SITE_URL } from '@/lib/articleLocale';
import { CATEGORIES, categoryPath } from '@/lib/categories';
import { fetchMarketIndices } from '@/lib/indicesApi';
import { fetchGoldRatesAllCarats, fetchSilverRateData, type GoldCaratRate } from '@/lib/angelOneApi';
import { SILVER_CITIES } from '@/lib/silverCityList';
import { HINDI_CITY_NAMES } from '@/lib/cityGoldDataHi';
import IndexStrip from '@/components/home/IndexStrip';
import { CategoryBlock, PillLinks, SectionHeader, StoryCard, TopStories, pickArticles } from '@/components/news/NewsBlocks';

// Hindi home, laid out like a business-news front page: rates ticker, lead story with a
// latest rail, one block per category that has Hindi articles, gold rates, English picks.

const SILVER_CITY = SILVER_CITIES.find(c => c.slug === 'mumbai')!;

const CALCULATORS_HI = [
    { href: '/calculator/sip', label: 'SIP कैलकुलेटर' },
    { href: '/calculator/emi', label: 'EMI कैलकुलेटर' },
    { href: '/calculator/home-loan', label: 'होम लोन कैलकुलेटर' },
    { href: '/calculator/income-tax', label: 'इनकम टैक्स कैलकुलेटर' },
    { href: '/calculator/fd', label: 'FD कैलकुलेटर' },
    { href: '/calculator/ppf', label: 'PPF कैलकुलेटर' },
    { href: '/calculator/ssy', label: 'सुकन्या (SSY) कैलकुलेटर' },
    { href: '/calculator/nps', label: 'NPS कैलकुलेटर' },
];

const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export const revalidate = 900; // rates ticker + news

const TITLE = 'हिंदी में पर्सनल फाइनेंस, सोने का भाव और निवेश की खबरें | gpaisa.in';
const DESCRIPTION = 'gpaisa.in पर हिंदी में पढ़ें सोने-चांदी के भाव, आईपीओ, बचत योजनाओं, लोन और निवेश से जुड़े लेख और गाइड।';

export async function generateMetadata(): Promise<Metadata> {
    // An empty hub would be a soft 404, so it stays noindex until a Hindi article is published.
    const hasArticles = (await fetchArticlesByLanguage('hi', 1, 3600)).length > 0;
    return {
        title: TITLE,
        description: DESCRIPTION,
        openGraph: {
            title: TITLE,
            description: DESCRIPTION,
            type: 'website',
            url: `${SITE_URL}/hi`,
            locale: 'hi_IN',
            siteName: 'gpaisa.in',
        },
        alternates: {
            canonical: `${SITE_URL}/hi`,
            types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` },
        },
        robots: hasArticles ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiHomePage() {
    const [articles, englishArticles, indices, gold, silver] = await Promise.all([
        fetchArticlesByLanguage('hi', 500, 900),
        fetchArticlesByLanguage('en', 3, 900),
        fetchMarketIndices().catch(() => []),
        fetchGoldRatesAllCarats().catch(() => [] as GoldCaratRate[]),
        fetchSilverRateData(SILVER_CITY.symbol).catch(() => null),
    ]);

    const shown = new Set<string>();
    const [lead, ...secondary] = pickArticles(articles.filter(a => a.image_url).concat(articles.filter(a => !a.image_url)), shown, 3);
    const latest = pickArticles(articles, shown, 6, false);
    // One block per category with Hindi articles, in the site's category order.
    const desks = CATEGORIES
        .map(category => ({ category, all: articles.filter(a => (a.category || '').toUpperCase() === category.dbValue) }))
        .filter(d => d.all.length > 0)
        .map(d => ({ category: d.category, articles: pickArticles(d.all, shown, 4) }));

    const pills = [
        ...desks.map(d => ({ href: categoryPath(d.category, 'hi'), label: d.category.hiName })),
        { href: '/hi/gold-rate', label: 'आज सोने का भाव' },
        { href: '/ipo/gmp', label: 'IPO GMP' },
        { href: '/news', label: 'Read in English' },
    ];
    const gold24 = gold.find(g => g.purity === '24K');
    const gold22 = gold.find(g => g.purity === '22K');

    return (
        <div className="bg-white text-gw-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                <h1 className="sr-only">हिंदी में पर्सनल फाइनेंस, आईपीओ, बिज़नेस खबरें और सोने का भाव</h1>

                <IndexStrip indices={indices} gold={gold} silver={silver} silverCityHi="मुंबई" lang="hi" />
                <div className="mt-4"><PillLinks links={pills} label="श्रेणियां" /></div>

                {!lead ? (
                    <p className="mt-8 text-gray-500 bg-white rounded-xl border border-gray-100 p-8 text-center">
                        हिंदी लेख जल्द आ रहे हैं।{' '}
                        <Link href="/news" className="text-primary-600 hover:underline">English articles पढ़ें</Link>
                    </p>
                ) : (
                    <div className="mt-6">
                        <TopStories lead={lead} secondary={secondary} latest={latest} lang="hi" />
                    </div>
                )}

                {desks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-12">
                        {desks.map(d => <CategoryBlock key={d.category.slug} category={d.category} articles={d.articles} lang="hi" />)}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mt-12">
                    <section aria-labelledby="gold-heading" className="lg:col-span-1">
                        <SectionHeader id="gold-heading" title="आज सोने का भाव" href="/hi/gold-rate" lang="hi" />
                        {(gold24 || gold22) && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[{ label: '24 कैरेट', rate: gold24 }, { label: '22 कैरेट', rate: gold22 }].filter(x => x.rate).map(x => (
                                    <Link key={x.label} href="/hi/gold-rate" className="rounded-lg border border-gw-border p-3 hover:border-gw-green">
                                        <p className="text-xs text-gray-500">{x.label} · 10 ग्राम</p>
                                        <p className="text-lg font-extrabold tabular-nums">{inr(x.rate!.pricePerGram * 10)}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mb-2">शहर के हिसाब से भाव</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(HINDI_CITY_NAMES).map(([slug, name]) => (
                                <Link key={slug} href={`/hi/gold-rate/${slug}`} className="rounded-full border border-gw-border px-3 py-1 text-sm hover:border-gw-green hover:text-gw-green">{name}</Link>
                            ))}
                        </div>
                    </section>

                    {englishArticles.length > 0 && (
                        <section aria-labelledby="english-heading" className="lg:col-span-2">
                            <SectionHeader id="english-heading" title="Read in English" href="/news" lang="en" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {englishArticles.map(a => <StoryCard key={a.id} article={a} lang="en" />)}
                            </div>
                        </section>
                    )}
                </div>

                <section aria-labelledby="calc-heading" className="mt-12">
                    <SectionHeader id="calc-heading" title="लोकप्रिय कैलकुलेटर" href="/calculator" lang="hi" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {CALCULATORS_HI.map(c => (
                            <Link key={c.href} href={c.href} className="rounded-lg border border-gw-border px-4 py-3 text-sm font-semibold hover:border-gw-green hover:text-gw-green">{c.label}</Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
