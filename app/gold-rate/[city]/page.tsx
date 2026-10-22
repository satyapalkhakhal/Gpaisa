import { Metadata } from 'next';
import { goldRateLanguageAlternates } from '@/lib/goldRateLocale';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { notFound } from 'next/navigation';
import GoldCalculator from '@/components/GoldCalculator';
import { getCityGoldData } from '@/lib/cityGoldData';
import { getTodayIST } from '@/lib/dateUtils';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { GOLD_CITIES, fetchGoldCityTable, fetchGoldSnapshot, fetchSilverSeries, seriesStats } from '@/lib/rates';
import { getSilverCity } from '@/lib/silverCities';
import {
    Breadcrumb, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, RateLayout, RateMatrix, RateNote,
    RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import CityGuide, { PurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';

export async function generateStaticParams() {
    return GOLD_CITIES.map(({ slug }) => ({ city: slug }));
}

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const params = await props.params;
    const citySlug = params.city.toLowerCase();
    const cityData = getCityGoldData(citySlug);

    if (!cityData) {
        return { title: 'City Not Found | gpaisa.in' };
    }

    const { city: cityName, mainMarkets, tagline, state } = cityData;
    const todayDate = getTodayIST();


    return {
        title: `Gold Rate in ${cityName} Today — ${todayDate} | gpaisa.in`,
        description: `Check today's gold rate in ${cityName}, ${state} on ${todayDate}. Live 24K, 22K & 18K gold prices. ${tagline}. Gold markets at ${mainMarkets.join(' & ')}. Calculator, price history, buying tips & expert guide.`,
        robots: INDEXABLE_ROBOTS,
        openGraph: {
            title: `Gold Rate in ${cityName} Today - 24K, 22K, 18K Live Prices | ${tagline}`,
            description: `Today's gold rate in ${cityName}, ${state}. ${tagline}. Live prices for 24K, 22K & 18K gold with calculator, history & buying guide.`,
            type: 'article',
            url: `https://www.gpaisa.in/gold-rate/${citySlug}`,
            siteName: 'gpaisa.in',
            locale: 'en_IN',
            images: [{ url: 'https://www.gpaisa.in/android-chrome-512x512.png', width: 512, height: 512, alt: `Gold Rate in ${cityName} Today` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Gold Rate in ${cityName} Today - Live Prices | ${tagline}`,
            description: `Today's gold rate in ${cityName} for 24K, 22K & 18K. ${tagline}. Live prices with buying tips.`,
        },
        alternates: {
            canonical: `https://www.gpaisa.in/gold-rate/${citySlug}`,
            languages: goldRateLanguageAlternates(citySlug),
        },
    };
}

export default async function CityGoldRatePage(props: { params: Promise<{ city: string }> }) {
    const params = await props.params;
    const citySlug = params.city.toLowerCase();
    const cityData = getCityGoldData(citySlug);

    if (!cityData || !GOLD_CITIES.some(c => c.slug === citySlug)) {
        notFound();
    }

    // Everything is loaded on the server so rates, tables and links are in the HTML.
    const silverCity = getSilverCity(citySlug);
    const [snap, cityRows, goldNews, silverSeries] = await Promise.all([
        fetchGoldSnapshot(cityData.city), // the city's own rate
        fetchGoldCityTable(),
        fetchMetalNewsCards('gold', 6).catch(() => []),
        silverCity ? fetchSilverSeries(silverCity.symbol) : Promise.resolve([]),
    ]);

    const {
        city: cityName, state, mainMarkets, tagline, heroDescription,
        uniqueDescription, goldCulture, keyHighlights, buyingTips,
        popularAreas, faq, priceFactors, investmentInsight, festivalsImpact,
    } = cityData;
    const r24 = snap['24K'][0];
    const r22 = snap['22K'][0];
    const r18 = snap['18K'][0];
    const stats = seriesStats(snap['24K']);

    // ─── Structured Data ─────────────────────────────────────────────────
    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Gold Rate in ${cityName} Today`,
        description: `Current gold rates for ${cityName}, ${state} including 24K, 22K, and 18K gold prices. ${tagline}.`,
        url: `https://www.gpaisa.in/gold-rate/${citySlug}`,
        inLanguage: 'en-IN',
        isPartOf: { "@type": "WebSite", name: "gpaisa.in", url: "https://www.gpaisa.in" },
        publisher: {
            "@type": "Organization",
            name: "gpaisa.in",
            url: "https://www.gpaisa.in",
            logo: { "@type": "ImageObject", url: "https://www.gpaisa.in/android-chrome-512x512.png" },
        },
        dateModified: new Date().toISOString(),
        about: {
            "@type": "Thing",
            name: `Gold Market in ${cityName}`,
            description: uniqueDescription,
        },
        mentions: mainMarkets.map(market => ({
            "@type": "Place",
            name: `${market}, ${cityName}`,
        })),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gpaisa.in" },
            { "@type": "ListItem", position: 2, name: "Gold Rates", item: "https://www.gpaisa.in/gold-rate" },
            { "@type": "ListItem", position: 3, name: cityName, item: `https://www.gpaisa.in/gold-rate/${citySlug}` },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `Gold Rate in ${cityName} Today — ${tagline}`,
        description: heroDescription,
        author: { "@type": "Organization", name: "gpaisa.in", url: "https://www.gpaisa.in" },
        publisher: {
            "@type": "Organization",
            name: "gpaisa.in",
            logo: { "@type": "ImageObject", url: "https://www.gpaisa.in/android-chrome-512x512.png" },
        },
        datePublished: "2026-04-20",
        dateModified: new Date().toISOString(),
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.gpaisa.in/gold-rate/${citySlug}` },
        inLanguage: "en-IN",
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <RateLayout rail={
                <RateRail
                    lang="en"
                    cityTitle="Gold rate in other cities"
                    cityRows={cityRows}
                    rateKey="22K"
                    grams={10}
                    unitLabel="22K, per 10 grams"
                    hrefFor={slug => `/gold-rate/${slug}`}
                    currentSlug={citySlug}
                    other={silverSeries[0] ? { title: `Silver rate in ${cityName}`, href: `/silver-rate/${citySlug}`, label: 'Per kg', value: inr(silverSeries[0].perGram * 1000) } : undefined}
                    tools={[
                        { href: '/gold-rate', label: 'Gold rate today in India' },
                        { href: '/gold-vs-silver', label: 'Gold vs silver' },
                        { href: '/gold-affordability-index', label: 'Gold affordability index' },
                        { href: '/calculator/sip', label: 'SIP calculator' },
                    ]}
                    newsTitle="Gold news"
                    news={goldNews}
                />
            }>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Gold Rate', href: '/gold-rate' }, { label: cityName }]} />
                <MetalTabs active="gold" goldHref={`/gold-rate/${citySlug}`} silverHref={silverCity ? `/silver-rate/${citySlug}` : '/silver-rate'} lang="en" />
                <RateTitle
                    lang="en"
                    title={`Gold Rate in ${cityName} Today — ${getTodayIST()}`}
                    updated={r24 ? feedDate(r24.date, 'en') : undefined}
                    summary={r24 && r22 ? (
                        <>
                            The price of 24 carat gold in {cityName} is <strong>{inr(r24.perGram * 10)} per 10 grams</strong> today,{' '}
                            {Math.abs(r24.changePercent) < 0.005 ? 'unchanged from the previous day' : <>{r24.change > 0 ? 'up' : 'down'} {inr(Math.abs(r24.change * 10))} ({Math.abs(r24.changePercent).toFixed(2)}%) from the previous day</>}.
                            {' '}22 carat (916) gold is <strong>{inr(r22.perGram * 10)}</strong>{r18 ? <> and 18 carat is {inr(r18.perGram * 10)}</> : null} per 10 grams. {tagline}.
                        </>
                    ) : <>Today&apos;s gold rates for {cityName} are temporarily unavailable. Please check again shortly.</>}
                />

                {r24 && r22 && (
                    <KeyRateCards rates={[
                        { label: '24K gold', sub: '10 grams', value: r24.perGram * 10, change: r24.change * 10, changePercent: r24.changePercent },
                        { label: '22K gold', sub: '10 grams', value: r22.perGram * 10, change: r22.change * 10, changePercent: r22.changePercent },
                        ...(r18 ? [{ label: '18K gold', sub: '10 grams', value: r18.perGram * 10, change: r18.change * 10, changePercent: r18.changePercent }] : []),
                    ]} />
                )}

                {r24 && r22 && (
                    <Section id="today-rates" title={`Gold price in ${cityName} today`}>
                        <RateMatrix
                            lang="en"
                            caption={`Gold price in ${cityName} today by purity and weight`}
                            rows={[
                                { label: '24K', sub: '99.9% pure', perGram: r24.perGram },
                                { label: '22K', sub: '91.6% (916)', perGram: r22.perGram },
                                ...(r18 ? [{ label: '18K', sub: '75% pure', perGram: r18.perGram }] : []),
                            ]}
                            weights={[{ label: '1 gram', grams: 1 }, { label: '8 grams', grams: 8 }, { label: '10 grams', grams: 10 }, { label: '100 grams', grams: 100 }]}
                        />
                        <RateNote lang="en" />
                    </Section>
                )}

                {snap['24K'].length > 1 && (
                    <Section id="history" title={`Gold rate in ${cityName}: last ${snap['24K'].length} days`}>
                        <HistoryTable
                            lang="en"
                            caption={`Gold rate in ${cityName} over the last ${snap['24K'].length} days, per 10 grams`}
                            grams={10}
                            columns={[{ label: '22K (10g)', series: snap['22K'] }, { label: '24K (10g)', series: snap['24K'] }]}
                        />
                    </Section>
                )}

                {snap['24K'].length > 1 && (
                    <Section id="trend" title={`24K gold price trend in ${cityName}`}>
                        <PriceLineChart series={snap['24K']} grams={10} lang="en" label={`24K gold price in ${cityName}, per 10 grams, last ${snap['24K'].length} days`} />
                        <RangeStats stats={stats} grams={10} lang="en" days={snap['24K'].length} />
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="Gold rate in major cities">
                        <CityRateTable
                            lang="en"
                            caption="Gold rate today in major Indian cities, per 10 grams"
                            rows={cityRows}
                            columns={[{ key: '22K', label: '22K (10g)', grams: 10 }, { key: '24K', label: '24K (10g)', grams: 10 }]}
                            hrefFor={slug => `/gold-rate/${slug}`}
                            currentSlug={citySlug}
                        />
                    </Section>
                )}

                <Section id="calculator" title={`Gold price calculator for ${cityName}`}>
                    <details className="group rounded-xl border border-gw-border">
                        <summary className="cursor-pointer list-none px-4 py-3 text-[15px] font-semibold flex items-center justify-between [&::-webkit-details-marker]:hidden">
                            Work out the price with making charges and GST
                            <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                        </summary>
                        <div className="px-2 sm:px-4 pb-4"><GoldCalculator /></div>
                    </details>
                </Section>

                <CityGuide
                    lang="en"
                    metal="gold"
                    info={{ city: cityName, uniqueDescription: `${heroDescription} ${uniqueDescription}`, culture: goldCulture, keyHighlights, popularAreas, buyingTips, priceFactors, investmentInsight, festivalsImpact }}
                />
                <PurityGuide lang="en" />

                <Section id="faq" title={`Gold in ${cityName}: frequently asked questions`}>
                    <FaqList items={faq} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    Gold rates for {cityName} ({state}; main markets: {mainMarkets.join(', ')}) are indicative and come from a third-party market data feed.
                    Jewellers add making charges and 3% GST, and their rates can differ slightly. Check the BIS hallmark (HUID) and ask for an itemised bill.
                    This page is for information only and is not investment advice.
                </p>
            </RateLayout>
        </>
    );
}
