import { Metadata } from 'next';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { getTodayISTHindi } from '@/lib/dateUtils';
import { HREFLANG, SITE_URL } from '@/lib/articleLocale';
import { HINDI_CITY_NAMES, isHindiGoldPageReviewed } from '@/lib/cityGoldDataHi';
import { goldRateLanguageAlternates, goldRatePath } from '@/lib/goldRateLocale';
import { fetchMetalNewsCards } from '@/lib/articlesApi';
import { fetchGoldCityTable, fetchGoldSnapshot, seriesStats } from '@/lib/rates';
import {
    Breadcrumb, CityRateTable, FaqList, HistoryTable, KeyRateCards, MetalTabs, Prose, RateLayout, RateMatrix, RateNote,
    RangeStats, RateTitle, Section, feedDate, inr,
} from '@/components/rates/RatesUi';
import PriceLineChart from '@/components/rates/PriceLineChart';
import { PurityGuide } from '@/components/rates/CityGuide';
import RateRail from '@/components/rates/RateRail';

// Hindi gold rate hub (Hindi counterpart of /gold-rate), same layout and data as the English hub.

export const revalidate = 3600;

// General questions only — the facts here match the English pages and the city data.
const FAQ = [
    {
        question: 'भारत में सोने का भाव कैसे तय होता है?',
        answer: 'भारत में सोने का भाव अंतरराष्ट्रीय बाज़ार (लंदन बुलियन मार्केट) के भाव, डॉलर के मुक़ाबले रुपये की चाल और आयात शुल्क से तय होता है। 13 मई 2026 से सोने पर कुल आयात शुल्क 15% है। गहने ख़रीदने पर इसमें जौहरी का मेकिंग चार्ज जुड़ता है, और मेकिंग चार्ज समेत पूरे बिल पर 3% GST लगता है।',
    },
    {
        question: 'क्या हर शहर में सोने का भाव अलग होता है?',
        answer: 'सोने का मूल भाव पूरे देश में लगभग एक जैसा रहता है; शहरों के बीच थोड़ा फ़र्क़ ढुलाई ख़र्च, स्थानीय सर्राफ़ा संघों के भाव और दुकान के मार्जिन से आता है। गहनों की क़ीमत में बड़ा फ़र्क़ मेकिंग चार्ज से पड़ता है, इसलिए ख़रीदने से पहले कई दुकानों के मेकिंग चार्ज की तुलना करें।',
    },
    {
        question: '22 कैरेट और 24 कैरेट सोने में क्या फ़र्क़ है?',
        answer: '24 कैरेट सोना 99.9% शुद्ध होता है और ज़्यादातर सिक्कों और बार में आता है। 22 कैरेट सोना 91.6% शुद्ध होता है, इसलिए इसे 916 गोल्ड भी कहते हैं। इसमें दूसरी धातुएं मिली होने से यह ज़्यादा मज़बूत होता है, इसीलिए गहनों में सबसे ज़्यादा 22 कैरेट ही चलता है।',
    },
    {
        question: 'असली सोने की पहचान कैसे करें?',
        answer: 'हर गहने पर BIS हॉलमार्क और 6 अंकों का HUID नंबर ज़रूर देखें। HUID को BIS Care ऐप में डालकर गहने की शुद्धता और जौहरी की जानकारी जांची जा सकती है। बिल में सोने का वज़न, कैरेट, मेकिंग चार्ज और GST अलग-अलग लिखा होना चाहिए।',
    },
];

export async function generateMetadata(): Promise<Metadata> {
    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi')}`;
    const title = `आज सोने का भाव (${today}) — 24K, 22K, 18K गोल्ड रेट | gpaisa.in`;
    const description = `आज ${today} का सोने का भाव: 24 कैरेट, 22 कैरेट और 18 कैरेट प्रति ग्राम और 10 ग्राम। दिल्ली, मुंबई, चेन्नई समेत 10 शहरों के सोना बाज़ार की जानकारी और ख़रीदारी टिप्स।`;
    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url, locale: 'hi_IN', siteName: 'gpaisa.in' },
        alternates: {
            canonical: url,
            languages: goldRateLanguageAlternates(),
            types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` },
        },
        robots: isHindiGoldPageReviewed('hub') ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiGoldRateHubPage() {
    const [snap, cityRowsEn, hindiNews, englishNews] = await Promise.all([
        fetchGoldSnapshot('India'),
        fetchGoldCityTable(),
        fetchMetalNewsCards('gold', 5, 3600, 'hi').catch(() => []),
        fetchMetalNewsCards('gold', 5).catch(() => []),
    ]);
    const cityRows = cityRowsEn.map(r => ({ ...r, city: HINDI_CITY_NAMES[r.slug] ?? r.city }));
    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi')}`;
    const r24 = snap['24K'][0];
    const r22 = snap['22K'][0];
    const r18 = snap['18K'][0];
    const stats = seriesStats(snap['24K']);
    const days = snap['24K'].length;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `आज सोने का भाव — ${today}`,
        url,
        inLanguage: HREFLANG.hi,
        isPartOf: { '@type': 'WebSite', name: 'gpaisa.in', url: SITE_URL },
        dateModified: new Date().toISOString(),
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'होम', item: `${SITE_URL}/hi` },
            { '@type': 'ListItem', position: 2, name: 'सोने का भाव', item: url },
        ],
    };
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: HREFLANG.hi,
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <RateLayout rail={
                <RateRail
                    lang="hi"
                    cityTitle="बड़े शहरों में सोने का भाव"
                    cityRows={cityRows}
                    rateKey="22K"
                    grams={10}
                    unitLabel="22 कैरेट, प्रति 10 ग्राम"
                    hrefFor={slug => goldRatePath('hi', slug)}
                    tools={[
                        { href: goldRatePath('en'), label: 'गोल्ड कैलकुलेटर और 1964 से भाव (English)' },
                        { href: '/silver-rate', label: 'चांदी का भाव (English)' },
                        { href: '/gold-vs-silver', label: 'सोना बनाम चांदी (English)' },
                        { href: '/hi', label: 'हिंदी खबरें' },
                    ]}
                    newsTitle="सोने से जुड़ी खबरें"
                    news={hindiNews.length > 0 ? hindiNews : englishNews}
                />
            }>
                <Breadcrumb items={[{ label: 'होम', href: '/hi' }, { label: 'सोने का भाव' }]} />
                <MetalTabs active="gold" goldHref={goldRatePath('hi')} lang="hi" />
                <RateTitle
                    lang="hi"
                    title={`आज सोने का भाव — ${today}`}
                    updated={r24 ? feedDate(r24.date, 'hi') : undefined}
                    summary={r24 && r22 ? (
                        <>
                            भारत में आज 24 कैरेट सोने का सांकेतिक भाव <strong>{inr(r24.perGram * 10)} प्रति 10 ग्राम</strong> है,{' '}
                            {Math.abs(r24.changePercent) < 0.005 ? 'जो पिछले दिन के बराबर है' : <>जो पिछले दिन से {inr(Math.abs(r24.change * 10))} ({Math.abs(r24.changePercent).toFixed(2)}%) {r24.change > 0 ? 'ज़्यादा' : 'कम'} है</>}।
                            {' '}22 कैरेट (916) सोना <strong>{inr(r22.perGram * 10)}</strong>{r18 ? <> और 18 कैरेट {inr(r18.perGram * 10)}</> : null} प्रति 10 ग्राम है।
                            {stats && days > 1 && <> पिछले {days} दिन में 24 कैरेट सोना {Math.abs(stats.changePercent).toFixed(2)}% {stats.change >= 0 ? 'चढ़ा' : 'गिरा'} है।</>}
                        </>
                    ) : <>आज के भाव फ़िलहाल उपलब्ध नहीं हैं। कृपया थोड़ी देर बाद देखें।</>}
                />

                {r24 && r22 && (
                    <KeyRateCards rates={[
                        { label: '24 कैरेट', sub: '10 ग्राम', value: r24.perGram * 10, change: r24.change * 10, changePercent: r24.changePercent },
                        { label: '22 कैरेट', sub: '10 ग्राम', value: r22.perGram * 10, change: r22.change * 10, changePercent: r22.changePercent },
                        ...(r18 ? [{ label: '18 कैरेट', sub: '10 ग्राम', value: r18.perGram * 10, change: r18.change * 10, changePercent: r18.changePercent }] : []),
                    ]} />
                )}

                {r24 && r22 && (
                    <Section id="today-rates" title="शुद्धता और वज़न के हिसाब से आज का भाव">
                        <RateMatrix
                            lang="hi"
                            caption="भारत में आज सोने का भाव, शुद्धता और वज़न के हिसाब से"
                            rows={[
                                { label: '24 कैरेट', sub: '99.9% शुद्ध', perGram: r24.perGram },
                                { label: '22 कैरेट', sub: '91.6% (916)', perGram: r22.perGram },
                                ...(r18 ? [{ label: '18 कैरेट', sub: '75% शुद्ध', perGram: r18.perGram }] : []),
                            ]}
                            weights={[{ label: '1 ग्राम', grams: 1 }, { label: '8 ग्राम', grams: 8 }, { label: '10 ग्राम', grams: 10 }, { label: '100 ग्राम', grams: 100 }, { label: '1 तोला (11.66 ग्राम)', grams: 11.6638 }]}
                        />
                        <RateNote lang="hi" />
                    </Section>
                )}

                {cityRows.length > 0 && (
                    <Section id="cities" title="बड़े शहरों में आज सोने का भाव">
                        <CityRateTable
                            lang="hi"
                            caption="बड़े शहरों में आज सोने का भाव, प्रति 10 ग्राम"
                            rows={cityRows}
                            columns={[{ key: '22K', label: '22 कैरेट (10 ग्राम)', grams: 10 }, { key: '24K', label: '24 कैरेट (10 ग्राम)', grams: 10 }]}
                            hrefFor={slug => goldRatePath('hi', slug)}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="history" title={`पिछले ${days} दिन का सोने का भाव`}>
                        <HistoryTable
                            lang="hi"
                            caption={`भारत में पिछले ${days} दिन का सोने का भाव, प्रति 10 ग्राम`}
                            grams={10}
                            columns={[{ label: '22 कैरेट (10 ग्राम)', series: snap['22K'] }, { label: '24 कैरेट (10 ग्राम)', series: snap['24K'] }]}
                        />
                    </Section>
                )}

                {days > 1 && (
                    <Section id="trend" title="24 कैरेट सोने का ट्रेंड">
                        <PriceLineChart series={snap['24K']} grams={10} lang="hi" label={`भारत में 24 कैरेट सोने का भाव, प्रति 10 ग्राम, पिछले ${days} दिन`} />
                        <RangeStats stats={stats} grams={10} lang="hi" days={days} />
                    </Section>
                )}

                <Section id="how-priced" title="भारत में सोने का भाव कैसे तय होता है">
                    <Prose>
                        <p>भारत में सोने का भाव अंतरराष्ट्रीय बाज़ार के भाव, उस दिन डॉलर के मुक़ाबले रुपये की चाल और आयात शुल्क (13 मई 2026 से 15%) से तय होता है। रुपया कमज़ोर हो तो डॉलर में भाव स्थिर रहने पर भी यहां सोना महंगा हो जाता है।</p>
                        <p>इस पेज के भाव सांकेतिक हैं और थर्ड-पार्टी मार्केट डेटा फ़ीड से आते हैं। दुकान पर जौहरी इसमें मेकिंग चार्ज जोड़ते हैं और फिर मेकिंग चार्ज समेत पूरे बिल पर 3% GST लगता है, इसलिए दुकान की क़ीमत यहां दिखे भाव से ज़्यादा होती है।</p>
                    </Prose>
                </Section>

                <PurityGuide lang="hi" />

                <Section id="faq" title="अक्सर पूछे जाने वाले सवाल">
                    <FaqList items={FAQ} />
                </Section>

                <p className="mt-8 text-xs leading-relaxed text-gray-500">
                    gpaisa.in पर सोने के भाव सांकेतिक हैं। मेकिंग चार्ज, 3% GST और स्थानीय ख़र्च की वजह से जौहरी के भाव अलग हो सकते हैं। यह जानकारी सिर्फ़ जागरूकता के लिए है, निवेश सलाह नहीं।
                </p>
            </RateLayout>
        </>
    );
}
