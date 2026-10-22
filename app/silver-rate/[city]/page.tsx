import { Metadata } from 'next';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { SILVER_CITIES, getSilverCity, isSilverCityIndexable } from '@/lib/silverCities';
import SilverCalculator from '@/components/SilverCalculator';
import { getCitySilverData } from '@/lib/citySilverData';
import { getTodayIST } from '@/lib/dateUtils';
import { fetchGoldSnapshot, fetchSilverCityTable, fetchSilverSeries, seriesStats } from '@/lib/rates';
import { getCityGoldData } from '@/lib/cityGoldData';
import {
    Breadcrumb, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, RateLayout, RateMatrix, RateNote,
    RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import CityGuide, { SilverPurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';

export async function generateStaticParams() {
    return SILVER_CITIES.map((city) => ({
        city: city.slug,
    }));
}

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const params = await props.params;
    const cityObj = getSilverCity(params.city);

    if (!cityObj) {
        return { title: 'City Not Found | gpaisa.in' };
    }

    const cityName = cityObj.city;
    const citySlug = params.city;
    const silverInfo = getCitySilverData(citySlug);
    const tagline = silverInfo?.tagline || '';
    const mainMarkets = silverInfo?.mainMarkets || [];
    const state = silverInfo?.state || 'India';
    const todayDate = getTodayIST();


    return {
        title: `Silver Rate in ${cityName} Today — ${todayDate} | gpaisa.in`,
        description: `Check today's silver rate in ${cityName}, ${state} on ${todayDate}. Live 999 & 925 silver prices per gram and kg.${tagline ? ` ${tagline}.` : ''} ${mainMarkets.length ? `Silver markets at ${mainMarkets.join(' & ')}.` : ''} Calculator, history & buying guide.`,
        // Cities without their own content render a near-identical template (see lib/silverCities.ts).
        robots: isSilverCityIndexable(citySlug) ? INDEXABLE_ROBOTS : { index: false, follow: true },
        openGraph: {
            title: `Silver Rate in ${cityName} Today - Live Prices${tagline ? ` | ${tagline}` : ''}`,
            description: `Today's silver price in ${cityName}, ${state}. Live rate updates, historical trends & buying guide.`,
            type: 'article',
            url: `https://www.gpaisa.in/silver-rate/${citySlug}`,
            siteName: 'gpaisa.in',
            locale: 'en_IN',
            images: [{ url: 'https://www.gpaisa.in/android-chrome-512x512.png', width: 512, height: 512, alt: `Silver Rate in ${cityName} Today` }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Silver Rate in ${cityName} Today${tagline ? ` | ${tagline}` : ''}`,
            description: `Today's silver price in ${cityName} with live rate updates and historical trends.`,
        },
        alternates: {
            canonical: `https://www.gpaisa.in/silver-rate/${citySlug}`,
        },
    };
}

export default async function CitySilverRatePage(props: { params: Promise<{ city: string }> }) {
    const params = await props.params;
    const cityObj = getSilverCity(params.city);

    if (!cityObj) {
        notFound();
    }

    const cityName = cityObj.city;
    const symbol = cityObj.symbol;
    const citySlug = params.city;
    const silverInfo = getCitySilverData(citySlug);
    const goldCity = getCityGoldData(citySlug);

    // Loaded on the server so rates, tables and links are in the HTML. One feed (history)
    // drives the summary, cards, table and city list so they always agree.
    const [series, cityRows, silverNews, gold] = await Promise.all([
        fetchSilverSeries(symbol),
        fetchSilverCityTable(),
        fetchMetalNewsCards('silver', 6).catch(() => []),
        goldCity ? fetchGoldSnapshot(goldCity.city) : Promise.resolve(null),
    ]);
    const latest = series[0];
    const stats = seriesStats(series);
    const days = series.length;

    // Visible FAQ and FAQPage schema share one list.
    const faq = silverInfo?.faq ?? [
        ...(latest ? [{
            question: `What is the silver rate in ${cityName} today?`,
            answer: `Silver (999) in ${cityName} is ${inr(latest.perGram * 1000)} per kg, or ${inr(latest.perGram * 10)} per 10 grams, for ${feedDate(latest.date, 'en')}. Rates are indicative and exclude GST and making charges.`,
        }] : []),
        { question: 'What is the difference between 999 and 925 silver?', answer: '999 (fine) silver is 99.9% pure and is used for bars and coins. 925 (sterling) silver is 92.5% pure, alloyed with copper for strength, and is the standard for silver jewellery.' },
    ];

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Silver Rate in ${cityName} Today`,
        description: `Current silver rates for ${cityName}${silverInfo ? `. ${silverInfo.tagline}` : ''}.`,
        url: `https://www.gpaisa.in/silver-rate/${citySlug}`,
        inLanguage: 'en-IN',
        isPartOf: { "@type": "WebSite", name: "gpaisa.in", url: "https://www.gpaisa.in" },
        publisher: {
            "@type": "Organization",
            name: "gpaisa.in",
            url: "https://www.gpaisa.in",
            logo: { "@type": "ImageObject", url: "https://www.gpaisa.in/android-chrome-512x512.png" },
        },
        dateModified: new Date().toISOString(),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gpaisa.in" },
            { "@type": "ListItem", position: 2, name: "Silver Rates", item: "https://www.gpaisa.in/silver-rate" },
            { "@type": "ListItem", position: 3, name: cityName, item: `https://www.gpaisa.in/silver-rate/${citySlug}` },
        ],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `Silver Rate in ${cityName} Today${silverInfo ? ` — ${silverInfo.tagline}` : ''}`,
        description: silverInfo?.heroDescription || `Live silver prices in ${cityName} with calculator and history.`,
        author: { "@type": "Organization", name: "gpaisa.in", url: "https://www.gpaisa.in" },
        publisher: {
            "@type": "Organization",
            name: "gpaisa.in",
            logo: { "@type": "ImageObject", url: "https://www.gpaisa.in/android-chrome-512x512.png" },
        },
        datePublished: "2026-04-20",
        dateModified: new Date().toISOString(),
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.gpaisa.in/silver-rate/${citySlug}` },
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
                    cityTitle="Silver rate in other cities"
                    cityRows={cityRows}
                    rateKey="silver"
                    grams={1000}
                    unitLabel="999 silver, per kg"
                    hrefFor={slug => `/silver-rate/${slug}`}
                    currentSlug={citySlug}
                    other={gold?.['22K'][0] ? { title: `Gold rate in ${cityName}`, href: `/gold-rate/${citySlug}`, label: '22K, per 10 grams', value: inr(gold['22K'][0].perGram * 10) } : undefined}
                    tools={[
                        { href: '/silver-rate', label: 'Silver rate today in India' },
                        { href: '/gold-vs-silver', label: 'Gold vs silver' },
                        { href: '/commodities', label: 'Commodity prices' },
                        { href: '/calculator/sip', label: 'SIP calculator' },
                    ]}
                    newsTitle="Silver news"
                    news={silverNews}
                />
            }>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Silver Rate', href: '/silver-rate' }, { label: cityName }]} />
                <MetalTabs active="silver" goldHref={goldCity ? `/gold-rate/${citySlug}` : '/gold-rate'} silverHref={`/silver-rate/${citySlug}`} lang="en" />
                <RateTitle
                    lang="en"
                    title={`Silver Rate in ${cityName} Today — ${getTodayIST()}`}
                    updated={latest ? feedDate(latest.date, 'en') : undefined}
                    summary={latest ? (
                        <>
                            The price of silver in {cityName} is <strong>{inr(latest.perGram * 1000)} per kg</strong> today ({inr(latest.perGram * 10)} per 10 grams),{' '}
                            {Math.abs(latest.changePercent) < 0.005 ? 'unchanged from the previous day' : <>{latest.change > 0 ? 'up' : 'down'} {inr(Math.abs(latest.change * 1000))} per kg ({Math.abs(latest.changePercent).toFixed(2)}%) from the previous day</>}.
                            {silverInfo?.tagline ? <> {silverInfo.tagline}.</> : null}
                        </>
                    ) : <>Today&apos;s silver rates for {cityName} are temporarily unavailable. Please check again shortly.</>}
                />

                {latest && (
                    <KeyRateCards rates={[
                        { label: 'Silver 999', sub: '1 kg', value: latest.perGram * 1000, change: latest.change * 1000, changePercent: latest.changePercent },
                        { label: 'Silver 999', sub: '10 grams', value: latest.perGram * 10, change: latest.change * 10, changePercent: latest.changePercent, digits: 2 },
                        { label: 'Silver 925', sub: '10 grams', value: latest.perGram * 10 * 0.925, change: latest.change * 10 * 0.925, changePercent: latest.changePercent, digits: 2 },
                    ]} />
                )}

                {latest && (
                    <Section id="today-rates" title={`Silver price in ${cityName} today`}>
                        <RateMatrix
                            lang="en"
                            caption={`Silver price in ${cityName} today by purity and weight`}
                            rows={[
                                { label: '999 fine', sub: '99.9% pure', perGram: latest.perGram },
                                { label: '925 sterling', sub: '92.5% (jewellery)', perGram: latest.perGram * 0.925 },
                            ]}
                            weights={[{ label: '1 gram', grams: 1 }, { label: '10 grams', grams: 10 }, { label: '100 grams', grams: 100 }, { label: '1 kg', grams: 1000 }]}
                        />
                        <RateNote lang="en">Rates are indicative, before GST (3%) and making charges. 925 is worked out from the 999 rate. Check with your jeweller before buying.</RateNote>
                    </Section>
                )}

                {days > 1 && (
                    <Section id="history" title={`Silver rate in ${cityName}: last ${days} days`}>
                        <HistoryTable
                            lang="en"
                            caption={`Silver rate in ${cityName} over the last ${days} days`}
                            grams={1000}
                            columns={[{ label: 'Silver 999 (1 kg)', series }]}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="trend" title={`Silver price trend in ${cityName}`}>
                        <PriceLineChart series={series} grams={1000} lang="en" color="#64748b" label={`Silver price in ${cityName}, per kg, last ${days} days`} />
                        <RangeStats stats={stats} grams={1000} lang="en" days={days} />
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="Silver rate in major cities">
                        <CityRateTable
                            lang="en"
                            caption="Silver rate today in major Indian cities"
                            rows={cityRows}
                            columns={[{ key: 'silver', label: '10 grams', grams: 10 }, { key: 'silver', label: '1 kg', grams: 1000 }]}
                            hrefFor={slug => `/silver-rate/${slug}`}
                            currentSlug={citySlug}
                        />
                    </Section>
                )}

                <Section id="calculator" title={`Silver price calculator for ${cityName}`}>
                    <details className="group rounded-xl border border-gw-border">
                        <summary className="cursor-pointer list-none px-4 py-3 text-[15px] font-semibold flex items-center justify-between [&::-webkit-details-marker]:hidden">
                            Work out the price for any weight
                            <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                        </summary>
                        <div className="px-2 sm:px-4 pb-4"><SilverCalculator initialCitySlug={citySlug} /></div>
                    </details>
                </Section>

                {silverInfo && (
                    <CityGuide
                        lang="en"
                        metal="silver"
                        info={{ city: cityName, uniqueDescription: `${silverInfo.heroDescription} ${silverInfo.uniqueDescription}`, culture: silverInfo.silverCulture, keyHighlights: silverInfo.keyHighlights, popularAreas: silverInfo.popularAreas, buyingTips: silverInfo.buyingTips, priceFactors: silverInfo.priceFactors, investmentInsight: silverInfo.investmentInsight, festivalsImpact: silverInfo.festivalsImpact }}
                    />
                )}
                <SilverPurityGuide />

                <Section id="faq" title={`Silver in ${cityName}: frequently asked questions`}>
                    <FaqList items={faq} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    Silver rates for {cityName} are indicative and come from a third-party market data feed. Jewellers add making charges and 3% GST, and their rates can differ slightly.
                    This page is for information only and is not investment advice.
                </p>
            </RateLayout>
        </>
    );
}
