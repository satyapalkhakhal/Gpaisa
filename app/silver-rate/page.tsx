import { Metadata } from 'next';
import Link from 'next/link';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { getTodayIST } from '@/lib/dateUtils';
import { fetchGoldSnapshot, fetchSilverCityTable, fetchSilverSeries, seriesStats } from '@/lib/rates';
import {
    Breadcrumb, BulletList, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, Prose, RateLayout, RateMatrix,
    RateNote, RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import { SilverPurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';
import SilverPriceHistoryChart from '@/components/SilverPriceHistoryChart';

export async function generateMetadata(): Promise<Metadata> {
    const todayDate = getTodayIST();

    return {
        title: `Silver Rate Today in India — ${todayDate} | Live Price Per Gram/Kg | gpaisa.in`,
        description: `Check today's silver rate in India on ${todayDate}. Live silver prices per gram and per kg. City-wise rates with historical trends, calculator, market analysis, and silver vs gold comparison.`,

        openGraph: {
            title: `Silver Rate Today in India — ${todayDate} | Live Prices Per Gram/Kg`,
            description: `Check today's silver rate in India on ${todayDate}. Live prices per gram and per kg. City-wise rates with historical trends, market analysis, and silver vs gold comparison.`,
            type: 'website',
            url: 'https://www.gpaisa.in/silver-rate',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
            images: [
                {
                    url: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Silver Rate Today in India - Live Silver Prices and Market Trends',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Silver Rate Today in India — ${todayDate} | Live Prices`,
            description: `Check today's silver rate in India on ${todayDate}. Live prices per gram and per kg. Market trends and silver vs gold comparison.`,
            images: ['https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg'],
        },
        alternates: {
            canonical: 'https://www.gpaisa.in/silver-rate'
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

export default async function SilverRatePage() {
    // Loaded on the server so rates, tables and links are in the HTML.
    const [series, cityRows, silverNews, gold] = await Promise.all([
        fetchSilverSeries('XAG'),
        fetchSilverCityTable(),
        fetchMetalNewsCards('silver', 6).catch(() => []),
        fetchGoldSnapshot('India'),
    ]);
    const latest = series[0];
    const stats = seriesStats(series);
    const days = series.length;

    // One list drives both the visible FAQ and the FAQPage schema.
    const faq = [
        ...(latest ? [{
            question: 'What is the silver rate today in India?',
            answer: `The indicative all-India silver (999) rate for ${feedDate(latest.date, 'en')} is ${inr(latest.perGram * 1000)} per kg, or ${inr(latest.perGram * 10)} per 10 grams, before GST and making charges. City rates differ; see the city table on this page.`,
        }] : []),
        { question: 'Why do silver rates differ across cities?', answer: 'The base price follows the international silver price in rupees plus import duty. Cities differ by transport and dealer costs, local demand and jewellers’ margins.' },
        { question: 'What affects silver prices in India?', answer: 'International silver prices, the dollar–rupee exchange rate, import duty, industrial demand (electronics, solar panels), inflation and festival demand.' },
        { question: 'Is silver a good investment?', answer: 'Silver is more volatile than gold because a large share of demand is industrial, so prices can rise or fall sharply. It can diversify a portfolio but suits investors who can hold through big swings. This is general information, not investment advice.' },
        { question: 'How does silver compare with gold?', answer: 'Gold is steadier and is mainly an investment and jewellery metal. Silver is cheaper per gram, swings more and depends more on industrial demand. Many investors hold both in small proportions.' },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Silver Rate Today in India",
        "description": "Current silver rates per gram and per kg in India, including city-wise prices, market trends, and investment insights.",
        "url": "https://www.gpaisa.in/silver-rate",
        "dateModified": new Date().toISOString().split('T')[0],
        "image": "https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.gpaisa.in" },
                { "@type": "ListItem", "position": 2, "name": "Silver Rates", "item": "https://www.gpaisa.in/silver-rate" }
            ]
        },
        "mainEntity": {
            "@type": "FinancialProduct",
            "name": "Silver",
            "description": "Live silver rates per gram and per kg across major Indian cities"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Silver Rate Today in India - Market Analysis & Investment Guide 2026",
        "description": "Comprehensive guide to silver prices in India covering market trends, what affects silver prices, city-wise rates, and investment comparison with gold.",
        "image": "https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg",
        "author": { "@type": "Organization", "name": "gpaisa.in", "url": "https://www.gpaisa.in" },
        "publisher": {
            "@type": "Organization",
            "name": "gpaisa.in",
            "logo": { "@type": "ImageObject", "url": "https://www.gpaisa.in/icon-512.png" }
        },
        "datePublished": "2026-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.gpaisa.in/silver-rate" },
        "inLanguage": "en-IN",
    };

    const th = 'px-3 py-2 text-left text-xs font-semibold text-gray-600 bg-gray-50';
    const td = 'px-3 py-2.5 text-sm';

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <RateLayout rail={
                <RateRail
                    lang="en"
                    cityTitle="Silver rate in major cities"
                    cityRows={cityRows}
                    rateKey="silver"
                    grams={1000}
                    unitLabel="999 silver, per kg"
                    hrefFor={slug => `/silver-rate/${slug}`}
                    other={gold['22K'][0] ? { title: 'Gold rate today', href: '/gold-rate', label: '22K, per 10 grams', value: inr(gold['22K'][0].perGram * 10) } : undefined}
                    tools={[
                        { href: '/gold-vs-silver', label: 'Gold vs silver' },
                        { href: '/commodities', label: 'Commodity prices' },
                        { href: '/calculator/sip', label: 'SIP calculator' },
                    ]}
                    newsTitle="Silver news"
                    news={silverNews}
                />
            }>
                <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Silver Rate' }]} />
                <MetalTabs active="silver" goldHref="/gold-rate" silverHref="/silver-rate" lang="en" />
                <RateTitle
                    lang="en"
                    title={`Silver Rate Today in India — ${getTodayIST()}`}
                    updated={latest ? feedDate(latest.date, 'en') : undefined}
                    summary={latest ? (
                        <>
                            The indicative price of silver in India is <strong>{inr(latest.perGram * 1000)} per kg</strong> today ({inr(latest.perGram * 10)} per 10 grams),{' '}
                            {Math.abs(latest.changePercent) < 0.005 ? 'unchanged from the previous day' : <>{latest.change > 0 ? 'up' : 'down'} {inr(Math.abs(latest.change * 1000))} per kg ({Math.abs(latest.changePercent).toFixed(2)}%) from the previous day</>}.
                            {stats && days > 1 && <> Over the last {days} days silver has {stats.change >= 0 ? 'gained' : 'lost'} {Math.abs(stats.changePercent).toFixed(2)}%.</>}
                        </>
                    ) : <>Today&apos;s silver rates are temporarily unavailable. Please check again shortly.</>}
                />

                {latest && (
                    <KeyRateCards rates={[
                        { label: 'Silver 999', sub: '1 kg', value: latest.perGram * 1000, change: latest.change * 1000, changePercent: latest.changePercent },
                        { label: 'Silver 999', sub: '10 grams', value: latest.perGram * 10, change: latest.change * 10, changePercent: latest.changePercent, digits: 2 },
                        { label: 'Silver 925', sub: '10 grams', value: latest.perGram * 10 * 0.925, change: latest.change * 10 * 0.925, changePercent: latest.changePercent, digits: 2 },
                    ]} />
                )}

                {latest && (
                    <Section id="today-rates" title="Silver price today by purity and weight">
                        <RateMatrix
                            lang="en"
                            caption="Silver price in India today by purity and weight"
                            rows={[
                                { label: '999 fine', sub: '99.9% pure', perGram: latest.perGram },
                                { label: '925 sterling', sub: '92.5% (jewellery)', perGram: latest.perGram * 0.925 },
                            ]}
                            weights={[{ label: '1 gram', grams: 1 }, { label: '10 grams', grams: 10 }, { label: '100 grams', grams: 100 }, { label: '1 kg', grams: 1000 }]}
                        />
                        <RateNote lang="en">Rates are indicative, before GST (3%) and making charges. 925 is worked out from the 999 rate. Check with your jeweller before buying.</RateNote>
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="Silver rate today in major cities">
                        <CityRateTable
                            lang="en"
                            caption="Silver rate today in major Indian cities"
                            rows={cityRows}
                            columns={[{ key: 'silver', label: '10 grams', grams: 10 }, { key: 'silver', label: '1 kg', grams: 1000 }]}
                            hrefFor={slug => `/silver-rate/${slug}`}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="history" title={`Silver rate in India: last ${days} days`}>
                        <HistoryTable lang="en" caption={`Silver rate in India over the last ${days} days`} grams={1000} columns={[{ label: 'Silver 999 (1 kg)', series }]} />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="trend" title="Silver price trend">
                        <PriceLineChart series={series} grams={1000} lang="en" color="#64748b" label={`Silver price in India, per kg, last ${days} days`} />
                        <RangeStats stats={stats} grams={1000} lang="en" days={days} />
                    </Section>
                )}

                <SilverPriceHistoryChart />

                <Section id="drivers" title="What affects silver prices in India">
                    <Prose>
                        <p>Silver prices in India follow the international price, converted to rupees, plus import duty. Unlike gold, more than half of silver demand is industrial, so factory and green-energy demand moves the price as much as investors do.</p>
                    </Prose>
                    <div className="mt-3">
                        <BulletList items={[
                            'International silver prices (COMEX and London)',
                            'The dollar–rupee exchange rate: a weaker rupee makes imported silver dearer',
                            'Industrial demand from electronics, solar panels and electric vehicles',
                            'Inflation and interest rates, which change investor demand for precious metals',
                            'Festival and wedding season buying of jewellery and silverware',
                        ]} />
                    </div>
                </Section>

                <Section id="silver-vs-gold" title="Silver vs gold at a glance">
                    <div className="overflow-x-auto rounded-xl border border-gw-border">
                        <table className="w-full">
                            <thead><tr><th scope="col" className={th}>Factor</th><th scope="col" className={th}>Silver</th><th scope="col" className={th}>Gold</th></tr></thead>
                            <tbody className="divide-y divide-gw-border">
                                {[
                                    ['Price swings', 'High', 'Lower'],
                                    ['Industrial use', 'Large (electronics, solar)', 'Small'],
                                    ['Main role', 'Industrial metal and investment', 'Investment and jewellery'],
                                    ['Storage', 'Bulky for the same value', 'Compact'],
                                ].map(([f, sv, g]) => (
                                    <tr key={f}><th scope="row" className={`${td} text-left font-semibold`}>{f}</th><td className={td}>{sv}</td><td className={td}>{g}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-sm"><Link href="/gold-vs-silver" className="font-semibold text-gw-green hover:underline">Full gold vs silver comparison →</Link></p>
                </Section>

                <Section id="ways-to-invest" title="Ways to buy silver">
                    <dl className="divide-y divide-gw-border border-y border-gw-border">
                        {[
                            ['Physical silver', 'Bars, coins and jewellery. Needs safe storage; jewellery carries making charges.'],
                            ['Silver ETFs', 'Track the silver price and trade on the stock exchange; no storage and easy to sell.'],
                            ['Silver fund of funds', 'Mutual funds that invest in silver ETFs; can be bought through a SIP.'],
                            ['Digital silver', 'Sold by apps in small amounts. These products are not regulated by SEBI, so check the provider carefully.'],
                        ].map(([k, v]) => (
                            <div key={k} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 py-2.5 text-[15px]">
                                <dt className="font-semibold">{k}</dt><dd className="text-gray-700">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-2 text-xs text-gray-500">Silver is usually quoted per kg in the wholesale market and per 10 grams or per gram in shops (1 kg = 1,000 grams).</p>
                </Section>

                <SilverPurityGuide />

                <Section id="faq" title="Frequently asked questions">
                    <FaqList items={faq} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    Silver rates on gpaisa.in are indicative and come from a third-party market data feed. They can differ from jewellers&apos; rates because of making charges, GST (3%) and local costs.
                    This page is for information only and is not investment advice.
                </p>
            </RateLayout>
        </>
    );
}
