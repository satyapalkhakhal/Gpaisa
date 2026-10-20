import { Metadata } from 'next';
import {
    fetchArticlesByCategory,
    fetchAllArticles,
    fetchTrendingArticles,
    fetchCreditCardArticles,
    Article
} from '@/lib/supabaseApi';
import { fetchMarketIndices } from '@/lib/indicesApi';
import { fetchGoldRatesAllCarats, fetchSilverRateData, type GoldCaratRate } from '@/lib/angelOneApi';
import { fetchLatestGmpBoard, fetchLatestIpoReviews, fetchListingPerformanceBoard } from '@/lib/ipoApi';
import { fetchBuybacks, fetchNcdIssues, fetchRightsIssues } from '@/lib/otherInvestmentsApi';
import { CALCULATORS } from '@/lib/calculatorsList';
import IndexStrip from '@/components/home/IndexStrip';
import IpoSection, { ipoTimeline } from '@/components/home/IpoSection';
import BullionSection from '@/components/home/BullionSection';
import NewsSection from '@/components/home/NewsSection';
import CalculatorSection from '@/components/home/CalculatorSection';
import HomeSidebar from '@/components/home/HomeSidebar';
import TrustBand from '@/components/home/TrustBand';
import { todayIsoIST } from '@/components/home/HomeUi';

export const metadata: Metadata = {
    title: "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
    description: "India's trusted financial portal. Live 24K gold rate today, silver price, SIP calculator, FD calculator, home loan calculator, GST calculator, credit card reviews. Updated daily by Satyapal Khakhal.",
    authors: [{ name: "Satyapal Khakhal", url: "https://www.gpaisa.in/about" }],
    alternates: { canonical: "https://www.gpaisa.in" },
    openGraph: {
        title: "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
        description: "Live 24K gold rates, silver prices, SIP/FD/home loan calculators, GST tool, credit card reviews and financial news. India's trusted financial portal.",
        url: "https://www.gpaisa.in",
        siteName: "gpaisa.in",
        locale: "en_IN",
        type: "website",
        images: [{
            url: "https://www.gpaisa.in/og-homepage.jpg",
            width: 1200,
            height: 630,
            alt: "gpaisa.in — India's Financial Portal for Gold Rates, Calculators & Market Data"
        }]
    },
    twitter: {
        card: "summary_large_image",
        title: "gpaisa.in — Live Gold Rates, SIP & FD Calculators, Market Data India",
        description: "Live gold & silver rates, SIP/FD/home loan calculators, credit card reviews. Updated daily.",
        images: ["https://www.gpaisa.in/og-homepage.jpg"],
        creator: "@gpaisa_in",
        site: "@gpaisa_in"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    }
};

export const revalidate = 300; // 5 min — dashboard data should feel reasonably live

export default async function HomePage() {
    const [
        allArticles,
        trendingArticles,
        ipoArticles,
        businessArticles,
        financeArticles,
        creditCardArticles,
        marketIndices,
        goldRates,
        silverRateData,
        gmpBoard,
        listingBoard,
        ipoReviews,
        ncdIssues,
        buybacks,
        rightsIssues,
    ] = await Promise.all([
        fetchAllArticles(6),
        fetchTrendingArticles(8),
        fetchArticlesByCategory('IPO', 6),
        fetchArticlesByCategory('BUSINESS', 6),
        fetchArticlesByCategory('FINANCE', 6),
        fetchCreditCardArticles(6),
        fetchMarketIndices().catch(() => []),
        fetchGoldRatesAllCarats().catch(() => [] as GoldCaratRate[]),
        fetchSilverRateData('XAG').catch(() => null),
        fetchLatestGmpBoard().catch(() => []),
        fetchListingPerformanceBoard().catch(() => []),
        fetchLatestIpoReviews(3).catch(() => []),
        fetchNcdIssues(10).catch(() => []),
        fetchBuybacks(10).catch(() => []),
        fetchRightsIssues(10).catch(() => []),
    ]);

    // AngelOne's goldhistory `rate` is per GRAM (24K ≈ ₹13,700 vs silver ≈ ₹171/g — a ~80 gold–silver
    // ratio), but fetchGoldRatesAllCarats divides it by 10 as if it were per 10g. Undo that here so the
    // homepage shows real per-gram/per-10g prices. TODO: fix the shared helper + DynamicGoldRates site-wide.
    const goldPerGram = goldRates.map(r => ({ ...r, pricePerGram: r.pricePerGram * 10, change: r.change * 10 }));

    const today = todayIsoIST();

    // News tabs: "Latest" across everything, then one tab per desk. The trending rail skips
    // whatever the Latest tab already shows so the two never list the same headline.
    const latest = allArticles.slice(0, 6);
    const latestIds = new Set(latest.map(a => a.id));
    const trending = trendingArticles.filter(a => !latestIds.has(a.id)).slice(0, 5);
    const newsTabs = [
        { key: 'latest', label: 'Latest', href: '/news', articles: latest },
        { key: 'ipo', label: 'IPO', href: '/category/ipo', articles: ipoArticles.slice(0, 6) },
        { key: 'gold', label: 'Gold & commodities', href: '/category/business', articles: businessArticles.slice(0, 6) },
        { key: 'finance', label: 'Personal finance', href: '/category/finance', articles: financeArticles.slice(0, 6) },
        { key: 'cards', label: 'Credit cards', href: '/credit-cards', articles: creditCardArticles },
    ];

    // Same date-based rules as the IPO table, so the sidebar's "n open" badges agree with it.
    const openIpoCount = gmpBoard.filter(e => ipoTimeline(e.ipo, today)?.phase === 'open').length;
    const notPast = (end: string | null) => !end || end >= today;
    const liveIssueCounts = {
        ncd: ncdIssues.filter(n => ['announced', 'upcoming', 'open'].includes(n.status) && notPast(n.close_date)).length,
        buyback: buybacks.filter(b => ['announced', 'record_date', 'open'].includes(b.status) && notPast(b.tender_close_date)).length,
        rights: rightsIssues.filter(r => ['announced', 'record_date', 're_trading', 'open'].includes(r.status) && notPast(r.application_end)).length,
    };

    const jsonLdSchemas = {
        '@context': 'https://schema.org',
        '@graph': [
        {
            '@type': 'WebSite',
            '@id': 'https://www.gpaisa.in/#website',
            'url': 'https://www.gpaisa.in',
            'name': 'gpaisa.in',
            'description': "India's trusted financial portal for live gold rates, silver prices, financial calculators, and market data.",
            'inLanguage': 'en-IN',
            'publisher': {
                '@type': 'Organization',
                '@id': 'https://www.gpaisa.in/#organization',
                'name': 'gpaisa.in',
                'url': 'https://www.gpaisa.in',
                'logo': { '@type': 'ImageObject', 'url': 'https://www.gpaisa.in/android-chrome-512x512.png', 'width': 512, 'height': 512 },
                'founder': { '@type': 'Person', 'name': 'Satyapal Khakhal', 'url': 'https://www.gpaisa.in/about' },
                'contactPoint': { '@type': 'ContactPoint', 'email': 'contact@gpaisa.in', 'contactType': 'customer support' },
                'sameAs': ['https://twitter.com/gpaisa_in']
            },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://www.gpaisa.in/search?q={search_term_string}' },
                'query-input': 'required name=search_term_string'
            }
        },
        {
            '@type': 'WebPage',
            '@id': 'https://www.gpaisa.in/#webpage',
            'url': 'https://www.gpaisa.in',
            'name': "gpaisa.in — Live Gold Rates, Financial Calculators & Market Data India",
            'description': "India's trusted financial portal for live gold rates, silver prices, IPO GMP, SIP/FD/home loan calculators, and market news.",
            'isPartOf': { '@id': 'https://www.gpaisa.in/#website' },
            'about': { '@id': 'https://www.gpaisa.in/#organization' },
            'author': { '@type': 'Person', 'name': 'Satyapal Khakhal', 'url': 'https://www.gpaisa.in/about' },
            'inLanguage': 'en-IN',
            'dateModified': today
        },
        {
            '@type': 'ItemList',
            'name': 'Financial Calculators — gpaisa.in',
            'description': 'Free financial calculators for Indian investors',
            'numberOfItems': CALCULATORS.length,
            'itemListElement': CALCULATORS.map((calc, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'name': calc.name,
                'url': `https://www.gpaisa.in${calc.href}`,
            })),
        }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
            />

            <div className="bg-white text-gw-text">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                    {/* Kept for SEO (matches the page title) but not shown */}
                    <h1 className="sr-only">Live Gold Rates, Financial Calculators &amp; Market Data for India</h1>

                    <IndexStrip indices={marketIndices} gold={goldPerGram} silver={silverRateData} />

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-10 mt-8">
                        <div className="space-y-10 min-w-0">
                            <IpoSection board={gmpBoard} listings={listingBoard} today={today} />
                            <BullionSection gold={goldPerGram} silver={silverRateData} />
                            <NewsSection tabs={newsTabs} />
                            <CalculatorSection />
                        </div>
                        <HomeSidebar
                            openIpoCount={openIpoCount}
                            liveIssueCounts={liveIssueCounts}
                            reviews={ipoReviews}
                            trending={trending}
                        />
                    </div>

                    <div className="mt-12">
                        <TrustBand />
                    </div>
                </div>
            </div>
        </>
    );
}
