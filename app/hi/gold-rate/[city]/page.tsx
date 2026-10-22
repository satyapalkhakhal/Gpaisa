import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { getTodayISTHindi } from '@/lib/dateUtils';
import { HREFLANG, SITE_URL } from '@/lib/articleLocale';
import { HINDI_CITY_NAMES, getCityGoldDataHi, isHindiGoldPageReviewed } from '@/lib/cityGoldDataHi';
import { getCityGoldData } from '@/lib/cityGoldData';
import { goldRateLanguageAlternates, goldRatePath } from '@/lib/goldRateLocale';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { fetchGoldCityTable, fetchGoldSnapshot, seriesStats } from '@/lib/rates';
import {
    Breadcrumb, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, RateLayout, RateMatrix, RateNote,
    RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import CityGuide, { PurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';

// Hindi gold rate city pages (Hindi counterpart of /gold-rate/[city]), same layout and data
// as the English page. Unreviewed translations stay noindex (see lib/cityGoldDataHi.ts).

const CITY_SLUGS = Object.keys(HINDI_CITY_NAMES);

export async function generateStaticParams() {
    return CITY_SLUGS.map((city) => ({ city }));
}

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const { city } = await props.params;
    const citySlug = city.toLowerCase();
    const data = getCityGoldDataHi(citySlug);
    if (!data) return { title: 'शहर नहीं मिला | gpaisa.in' };

    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi', citySlug)}`;
    const title = `${data.city} में आज सोने का भाव (${today}) — 24K, 22K, 18K रेट | gpaisa.in`;
    const description = `${data.city} में आज ${today} का सोने का भाव: 24 कैरेट, 22 कैरेट और 18 कैरेट प्रति ग्राम और 10 ग्राम। ${data.tagline}। ${data.mainMarkets.join(' और ')} के सोना बाज़ार, ख़रीदारी टिप्स और ज़रूरी सवाल-जवाब।`;
    const reviewed = isHindiGoldPageReviewed(citySlug);

    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url, locale: 'hi_IN', siteName: 'gpaisa.in' },
        alternates: {
            canonical: url,
            languages: goldRateLanguageAlternates(citySlug),
            types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` },
        },
        // Unreviewed machine-assisted translations stay out of the index (see lib/cityGoldDataHi.ts).
        robots: reviewed ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiCityGoldRatePage(props: { params: Promise<{ city: string }> }) {
    const { city } = await props.params;
    const citySlug = city.toLowerCase();
    const data = getCityGoldDataHi(citySlug);
    if (!data || !CITY_SLUGS.includes(citySlug)) notFound();

    // The city's own rate (AngelOne takes the English city name), same as /gold-rate/[city].
    const [snap, cityRowsEn, hindiNews, englishNews] = await Promise.all([
        fetchGoldSnapshot(getCityGoldData(citySlug)?.city ?? 'India'),
        fetchGoldCityTable(),
        fetchMetalNewsCards('gold', 5, 3600, 'hi').catch(() => []),
        fetchMetalNewsCards('gold', 5).catch(() => []),
    ]);
    const cityRows = cityRowsEn.map(r => ({ ...r, city: HINDI_CITY_NAMES[r.slug] ?? r.city }));
    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi', citySlug)}`;
    const {
        city: cityName, state, mainMarkets, tagline, heroDescription, uniqueDescription, goldCulture,
        keyHighlights, buyingTips, popularAreas, faq, priceFactors, investmentInsight, festivalsImpact,
    } = data;
    const r24 = snap['24K'][0];
    const r22 = snap['22K'][0];
    const r18 = snap['18K'][0];
    const stats = seriesStats(snap['24K']);
    const days = snap['24K'].length;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${cityName} में आज सोने का भाव`,
        description: heroDescription,
        url,
        inLanguage: HREFLANG.hi,
        isPartOf: { '@type': 'WebSite', name: 'gpaisa.in', url: SITE_URL },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/android-chrome-512x512.png` },
        },
        dateModified: new Date().toISOString(),
        about: { '@type': 'Thing', name: `${cityName} का सोना बाज़ार`, description: uniqueDescription },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'होम', item: `${SITE_URL}/hi` },
            { '@type': 'ListItem', position: 2, name: 'सोने का भाव', item: `${SITE_URL}${goldRatePath('hi')}` },
            { '@type': 'ListItem', position: 3, name: cityName, item: url },
        ],
    };
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: HREFLANG.hi,
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <RateLayout rail={
                <RateRail
                    lang="hi"
                    cityTitle="दूसरे शहरों में सोने का भाव"
                    cityRows={cityRows}
                    rateKey="22K"
                    grams={10}
                    unitLabel="22 कैरेट, प्रति 10 ग्राम"
                    hrefFor={slug => goldRatePath('hi', slug)}
                    currentSlug={citySlug}
                    tools={[
                        { href: goldRatePath('hi'), label: 'आज भारत में सोने का भाव' },
                        { href: goldRatePath('en', citySlug), label: 'गोल्ड कैलकुलेटर (English)' },
                        { href: '/gold-vs-silver', label: 'सोना बनाम चांदी (English)' },
                        { href: '/hi', label: 'हिंदी खबरें' },
                    ]}
                    newsTitle="सोने से जुड़ी खबरें"
                    news={hindiNews.length > 0 ? hindiNews : englishNews}
                />
            }>
                <Breadcrumb items={[{ label: 'होम', href: '/hi' }, { label: 'सोने का भाव', href: goldRatePath('hi') }, { label: cityName }]} />
                <MetalTabs active="gold" goldHref={goldRatePath('hi', citySlug)} lang="hi" />
                <RateTitle
                    lang="hi"
                    title={`${cityName} में आज सोने का भाव — ${today}`}
                    updated={r24 ? feedDate(r24.date, 'hi') : undefined}
                    summary={r24 && r22 ? (
                        <>
                            {cityName} में आज 24 कैरेट सोने का भाव <strong>{inr(r24.perGram * 10)} प्रति 10 ग्राम</strong> है,{' '}
                            {Math.abs(r24.changePercent) < 0.005 ? 'जो पिछले दिन के बराबर है' : <>जो पिछले दिन से {inr(Math.abs(r24.change * 10))} ({Math.abs(r24.changePercent).toFixed(2)}%) {r24.change > 0 ? 'ज़्यादा' : 'कम'} है</>}।
                            {' '}22 कैरेट (916) सोना <strong>{inr(r22.perGram * 10)}</strong>{r18 ? <> और 18 कैरेट {inr(r18.perGram * 10)}</> : null} प्रति 10 ग्राम है। {tagline}।
                        </>
                    ) : <>{cityName} के आज के भाव फ़िलहाल उपलब्ध नहीं हैं। कृपया थोड़ी देर बाद देखें।</>}
                />

                {r24 && r22 && (
                    <KeyRateCards rates={[
                        { label: '24 कैरेट', sub: '10 ग्राम', value: r24.perGram * 10, change: r24.change * 10, changePercent: r24.changePercent },
                        { label: '22 कैरेट', sub: '10 ग्राम', value: r22.perGram * 10, change: r22.change * 10, changePercent: r22.changePercent },
                        ...(r18 ? [{ label: '18 कैरेट', sub: '10 ग्राम', value: r18.perGram * 10, change: r18.change * 10, changePercent: r18.changePercent }] : []),
                    ]} />
                )}

                {r24 && r22 && (
                    <Section id="today-rates" title={`${cityName} में आज का सोने का भाव`}>
                        <RateMatrix
                            lang="hi"
                            caption={`${cityName} में आज सोने का भाव, शुद्धता और वज़न के हिसाब से`}
                            rows={[
                                { label: '24 कैरेट', sub: '99.9% शुद्ध', perGram: r24.perGram },
                                { label: '22 कैरेट', sub: '91.6% (916)', perGram: r22.perGram },
                                ...(r18 ? [{ label: '18 कैरेट', sub: '75% शुद्ध', perGram: r18.perGram }] : []),
                            ]}
                            weights={[{ label: '1 ग्राम', grams: 1 }, { label: '8 ग्राम', grams: 8 }, { label: '10 ग्राम', grams: 10 }, { label: '100 ग्राम', grams: 100 }]}
                        />
                        <RateNote lang="hi" />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="history" title={`${cityName} में पिछले ${days} दिन का सोने का भाव`}>
                        <HistoryTable
                            lang="hi"
                            caption={`${cityName} में पिछले ${days} दिन का सोने का भाव, प्रति 10 ग्राम`}
                            grams={10}
                            columns={[{ label: '22 कैरेट (10 ग्राम)', series: snap['22K'] }, { label: '24 कैरेट (10 ग्राम)', series: snap['24K'] }]}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="trend" title={`${cityName} में 24 कैरेट सोने का ट्रेंड`}>
                        <PriceLineChart series={snap['24K']} grams={10} lang="hi" label={`${cityName} में 24 कैरेट सोने का भाव, प्रति 10 ग्राम, पिछले ${days} दिन`} />
                        <RangeStats stats={stats} grams={10} lang="hi" days={days} />
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="बड़े शहरों में सोने का भाव">
                        <CityRateTable
                            lang="hi"
                            caption="बड़े शहरों में आज सोने का भाव, प्रति 10 ग्राम"
                            rows={cityRows}
                            columns={[{ key: '22K', label: '22 कैरेट (10 ग्राम)', grams: 10 }, { key: '24K', label: '24 कैरेट (10 ग्राम)', grams: 10 }]}
                            hrefFor={slug => goldRatePath('hi', slug)}
                            currentSlug={citySlug}
                        />
                    </Section>
                )}

                <p className="mt-4 text-sm">
                    <Link href={goldRatePath('en', citySlug)} hrefLang={HREFLANG.en} className="font-semibold text-gw-green hover:underline">
                        मेकिंग चार्ज और GST के साथ कीमत जोड़ने के लिए गोल्ड कैलकुलेटर (English में) →
                    </Link>
                </p>

                <CityGuide
                    lang="hi"
                    metal="gold"
                    info={{ city: cityName, uniqueDescription: `${heroDescription} ${uniqueDescription}`, culture: goldCulture, keyHighlights, popularAreas, buyingTips, priceFactors, investmentInsight, festivalsImpact }}
                />
                <PurityGuide lang="hi" />

                <Section id="faq" title={`${cityName} में सोना: अक्सर पूछे जाने वाले सवाल`}>
                    <FaqList items={faq} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    {cityName} ({state}; प्रमुख बाज़ार: {mainMarkets.join(', ')}) के ये भाव सांकेतिक हैं और थर्ड-पार्टी मार्केट डेटा फ़ीड से लिए गए हैं।
                    जौहरी मेकिंग चार्ज और 3% GST जोड़ते हैं, इसलिए उनके भाव थोड़े अलग हो सकते हैं। BIS हॉलमार्क (HUID) ज़रूर जांचें और पक्का बिल लें।
                    यह जानकारी सिर्फ़ जागरूकता के लिए है, निवेश सलाह नहीं।
                </p>
            </RateLayout>
        </>
    );
}
