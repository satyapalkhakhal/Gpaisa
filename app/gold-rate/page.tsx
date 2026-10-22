import { Metadata } from 'next';
import { goldRateLanguageAlternates, goldRatePath } from '@/lib/goldRateLocale';
import { getTodayIST } from '@/lib/dateUtils';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { fetchGoldCityTable, fetchGoldSnapshot, fetchSilverSeries, seriesStats } from '@/lib/rates';
import {
    Breadcrumb, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, Prose, RateLayout, RateMatrix, RateNote,
    RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import { PurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';
import GoldPriceHistoryChart from '@/components/GoldPriceHistoryChart';

export async function generateMetadata(): Promise<Metadata> {
    const todayDate = getTodayIST();

    return {
        title: `Gold Rate Today in India — ${todayDate} | gpaisa.in`,
        description: `Check today's gold rate in India on ${todayDate}. Live 24K, 22K, 18K and 916 gold prices updated daily with calculator, historical data, price trends, and gold vs silver comparison.`,

        openGraph: {
            title: `Gold Rate Today in India — ${todayDate} | 24K, 22K, 18K Prices`,
            description: `Check today's gold rate in India on ${todayDate}. Live 24K, 22K and 18K gold prices with daily updates, market trends, and gold vs silver comparison.`,
            type: 'website',
            url: 'https://www.gpaisa.in/gold-rate',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
            images: [
                {
                    url: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Gold Rate Today in India - Live Gold Prices and Market Trends',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Gold Rate Today in India — ${todayDate} | Live Prices`,
            description: `Check today's gold rate in India on ${todayDate}. Live prices with daily updates, market analysis, and gold vs silver comparison.`,
            images: ['https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg'],
        },
        alternates: {
            canonical: 'https://www.gpaisa.in/gold-rate',
            languages: goldRateLanguageAlternates(),
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    };
}

export const revalidate = 3600;

export default async function GoldRatePage() {
    const todayDate = getTodayIST();
    // Loaded on the server so rates, tables and links are in the HTML.
    const [snap, cityRows, goldNews, silver] = await Promise.all([
        fetchGoldSnapshot('India'),
        fetchGoldCityTable(),
        fetchMetalNewsCards('gold', 6).catch(() => []),
        fetchSilverSeries('XAG'),
    ]);
    const r24 = snap['24K'][0];
    const r22 = snap['22K'][0];
    const r18 = snap['18K'][0];
    const stats = seriesStats(snap['24K']);
    const days = snap['24K'].length;

    // One list drives both the visible FAQ and the FAQPage schema.
    const faq = [
        ...(r24 && r22 ? [{
            question: 'What is the gold rate today in India?',
            answer: `The indicative all-India rate for ${feedDate(r24.date, 'en')} is ${inr(r24.perGram * 10)} per 10 grams for 24 carat gold and ${inr(r22.perGram * 10)} per 10 grams for 22 carat gold, before GST and making charges. City rates differ slightly; see the city table on this page.`,
        }] : []),
        { question: 'Why is the gold rate different in Delhi and Mumbai?', answer: 'The base price follows the international rate converted to rupees plus import duty, so it is close everywhere. Cities differ by local transport and dealer costs and by jewellers’ association rates, which is why each city shows its own rate.' },
        { question: 'What is 916 gold?', answer: '916 gold is 22 carat gold: 91.6% pure (22 ÷ 24 = 0.916). It is the most common purity for Indian jewellery because the alloy makes it harder than 24 carat gold.' },
        { question: 'How much GST is charged on gold jewellery?', answer: 'GST is 3% of the full value of the jewellery: the gold and the making charge, whether or not the making charge is shown separately (CBIC GST FAQ on gems and jewellery). Job work done on gold you supply is taxed separately at 5%.' },
        { question: 'What is the difference between 24K and 22K gold?', answer: '24 carat gold is 99.9% pure and is sold as coins and bars; it is too soft for most jewellery. 22 carat gold is 91.6% pure, alloyed with metals such as copper or silver for strength, and is the standard for Indian jewellery.' },
        { question: 'Should I buy physical gold, a gold ETF or Sovereign Gold Bonds?', answer: 'No new Sovereign Gold Bonds have been issued since February 2024; existing bonds can only be bought on the stock exchange. Gold ETFs and gold mutual funds avoid making charges and are easy to sell. Physical gold suits jewellery and gifting. Check current tax rules before choosing.' },
        { question: 'How many grams are in 1 tola of gold?', answer: 'One tola is about 11.66 grams. It is a traditional unit still used by many jewellers, especially in North India.' },
    ];

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Gold Rate Today in India — ${todayDate}`,
        description: `Check today's gold rate in all major Indian cities on ${todayDate}. Live 24K, 22K, 18K, and 916 gold prices updated in real-time with market trends and analysis.`,
        url: 'https://www.gpaisa.in/gold-rate',
        inLanguage: 'en-IN',
        dateModified: new Date().toISOString().split('T')[0],
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' },
        },
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
        mainEntity: {
            '@type': 'FinancialProduct',
            name: 'Gold',
            description: 'Live gold rates for 24K, 22K, and 18K gold across major Indian cities',
        },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Gold Rate', item: 'https://www.gpaisa.in/gold-rate' },
        ],
    };
    const faqSchema = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faq.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    };

    // Article schema for rich content sections
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Gold Rate Today in India — ${todayDate} | Market Analysis & Investment Guide 2026`,
        description: 'Comprehensive guide to gold prices in India covering market trends, what affects gold prices, city-wise rates, and investment comparison with silver.',
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
        author: { '@type': 'Organization', name: 'gpaisa.in', url: 'https://www.gpaisa.in' },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' },
        },
        datePublished: '2026-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.gpaisa.in/gold-rate' },
        inLanguage: 'en-IN',
    };

    // Dataset schema for historical gold price data (EEAT boost)
    const datasetSchema = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'Gold Price History India (1964–2026)',
        description: 'Annual 24K gold prices per 10 grams in India from 1964 to 2026, sourced from RBI Handbook of Statistics, IBJA, and MCX historical records.',
        url: 'https://www.gpaisa.in/gold-rate#gold-price-history',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            url: 'https://www.gpaisa.in',
        },
        temporalCoverage: '1964/2026',
        variableMeasured: 'Gold price in INR per 10 grams (24K)',
        measurementTechnique: 'Annual average spot price from IBJA and RBI archives',
        distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'text/csv',
            contentUrl: 'https://www.gpaisa.in/gold_prices_india_1964_2026.csv',
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />

            <RateLayout rail={
                <RateRail
                    lang="en"
                    cityTitle="Gold rate in major cities"
                    cityRows={cityRows}
                    rateKey="22K"
                    grams={10}
                    unitLabel="22K, per 10 grams"
                    hrefFor={slug => `/gold-rate/${slug}`}
                    other={silver[0] ? { title: 'Silver rate today', href: '/silver-rate', label: 'India, per kg', value: inr(silver[0].perGram * 1000) } : undefined}
                    tools={[
                        { href: '/gold-vs-silver', label: 'Gold vs silver' },
                        { href: '/gold-affordability-index', label: 'Gold affordability index' },
                        { href: '/commodities', label: 'Commodity prices' },
                        { href: goldRatePath('hi'), label: 'सोने का भाव (हिंदी)' },
                    ]}
                    newsTitle="Gold news"
                    news={goldNews}
                />
            }>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Gold Rate' }]} />
                <MetalTabs active="gold" goldHref="/gold-rate" silverHref="/silver-rate" lang="en" />
                <RateTitle
                    lang="en"
                    title={`Gold Rate Today in India — ${todayDate}`}
                    updated={r24 ? feedDate(r24.date, 'en') : undefined}
                    summary={r24 && r22 ? (
                        <>
                            The indicative price of 24 carat gold in India is <strong>{inr(r24.perGram * 10)} per 10 grams</strong> today,{' '}
                            {Math.abs(r24.changePercent) < 0.005 ? 'unchanged from the previous day' : <>{r24.change > 0 ? 'up' : 'down'} {inr(Math.abs(r24.change * 10))} ({Math.abs(r24.changePercent).toFixed(2)}%) from the previous day</>}.
                            {' '}22 carat (916) gold is <strong>{inr(r22.perGram * 10)}</strong>{r18 ? <> and 18 carat is {inr(r18.perGram * 10)}</> : null} per 10 grams.
                            {stats && days > 1 && <> Over the last {days} days, 24 carat gold has {stats.change >= 0 ? 'gained' : 'lost'} {Math.abs(stats.changePercent).toFixed(2)}%.</>}
                        </>
                    ) : <>Today&apos;s gold rates are temporarily unavailable. Please check again shortly.</>}
                />

                {r24 && r22 && (
                    <KeyRateCards rates={[
                        { label: '24K gold', sub: '10 grams', value: r24.perGram * 10, change: r24.change * 10, changePercent: r24.changePercent },
                        { label: '22K gold', sub: '10 grams', value: r22.perGram * 10, change: r22.change * 10, changePercent: r22.changePercent },
                        ...(r18 ? [{ label: '18K gold', sub: '10 grams', value: r18.perGram * 10, change: r18.change * 10, changePercent: r18.changePercent }] : []),
                    ]} />
                )}

                {r24 && r22 && (
                    <Section id="today-rates" title="Gold price today by purity and weight">
                        <RateMatrix
                            lang="en"
                            caption="Gold price in India today by purity and weight"
                            rows={[
                                { label: '24K', sub: '99.9% pure', perGram: r24.perGram },
                                { label: '22K', sub: '91.6% (916)', perGram: r22.perGram },
                                ...(r18 ? [{ label: '18K', sub: '75% pure', perGram: r18.perGram }] : []),
                            ]}
                            weights={[{ label: '1 gram', grams: 1 }, { label: '8 grams', grams: 8 }, { label: '10 grams', grams: 10 }, { label: '100 grams', grams: 100 }, { label: '1 tola (11.66g)', grams: 11.6638 }]}
                        />
                        <RateNote lang="en" />
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="Gold rate today in major cities">
                        <CityRateTable
                            lang="en"
                            caption="Gold rate today in major Indian cities, per 10 grams"
                            rows={cityRows}
                            columns={[{ key: '22K', label: '22K (10g)', grams: 10 }, { key: '24K', label: '24K (10g)', grams: 10 }]}
                            hrefFor={slug => `/gold-rate/${slug}`}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="history" title={`Gold rate in India: last ${days} days`}>
                        <HistoryTable
                            lang="en"
                            caption={`Gold rate in India over the last ${days} days, per 10 grams`}
                            grams={10}
                            columns={[{ label: '22K (10g)', series: snap['22K'] }, { label: '24K (10g)', series: snap['24K'] }]}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="trend" title="24K gold price trend">
                        <PriceLineChart series={snap['24K']} grams={10} lang="en" label={`24K gold price in India, per 10 grams, last ${days} days`} />
                        <RangeStats stats={stats} grams={10} lang="en" days={days} />
                    </Section>
                )}

                <GoldPriceHistoryChart />

                <Section id="how-priced" title="How the gold rate in India is set">
                    <Prose>
                        <p>Indian gold prices follow the international price of gold, converted to rupees at the day&apos;s exchange rate, plus import duty. A weaker rupee or a higher global price pushes the Indian rate up even when global prices are flat in dollar terms.</p>
                        <p>The rates on this page are indicative: they come from a third-party market data feed and exclude GST and making charges. Jewellers add a making charge (often quoted as a percentage of the gold value or per gram) and 3% GST on the full bill, so the price you pay is higher than the rate shown.</p>
                    </Prose>
                </Section>

                <PurityGuide lang="en" />

                <Section id="faq" title="Frequently asked questions">
                    <FaqList items={faq} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    Gold rates on gpaisa.in are indicative and come from a third-party market data feed. They can differ from jewellers&apos; rates because of making charges, GST (3%) and local costs.
                    This page is for information only and is not investment advice.
                </p>
            </RateLayout>
        </>
    );
}
