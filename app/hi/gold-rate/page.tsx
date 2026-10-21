import { Metadata } from 'next';
import Link from 'next/link';
import { Coins, MapPin, HelpCircle, TrendingUp, Languages } from 'lucide-react';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { fetchGoldRatesAllCarats } from '@/lib/angelOneApi';
import { getTodayISTHindi } from '@/lib/dateUtils';
import { HREFLANG, SITE_URL } from '@/lib/articleLocale';
import { CITY_GOLD_DATA_HI, HINDI_CITY_NAMES, isHindiGoldPageReviewed } from '@/lib/cityGoldDataHi';
import { goldRateLanguageAlternates, goldRatePath } from '@/lib/goldRateLocale';
import HindiGoldRateTable from '@/components/gold/HindiGoldRateTable';
import { HindiGoldDisclaimer, HindiPurityGuide } from '@/components/gold/HindiGoldSections';

// Hindi gold rate hub (Hindi counterpart of /gold-rate).

export const revalidate = 86400;

// General questions only — the facts here match the English pages and the city data.
const FAQ = [
    {
        question: 'भारत में सोने का भाव कैसे तय होता है?',
        answer: 'भारत में सोने का भाव अंतरराष्ट्रीय भाव (लंदन बुलियन मार्केट), डॉलर/रुपया विनिमय दर, आयात शुल्क और 3% GST से तय होता है। गहनों की अंतिम क़ीमत में जौहरी का मेकिंग चार्ज भी जुड़ता है, जो डिज़ाइन के हिसाब से अलग-अलग होता है।',
    },
    {
        question: 'क्या हर शहर में सोने का भाव अलग होता है?',
        answer: 'सोने का मूल भाव पूरे देश में लगभग एक जैसा रहता है। शहरों के बीच फ़र्क ज़्यादातर मेकिंग चार्ज, स्थानीय प्रतिस्पर्धा और दुकान के मार्जिन से आता है। इसलिए ख़रीदने से पहले कई दुकानों के मेकिंग चार्ज की तुलना करें।',
    },
    {
        question: '22 कैरेट और 24 कैरेट सोने में क्या फ़र्क है?',
        answer: '24 कैरेट सोना 99.9% शुद्ध होता है और निवेश (बार, सिक्के) के लिए इस्तेमाल होता है। 22 कैरेट सोना 91.6% शुद्ध होता है (916 गोल्ड) और गहनों के लिए सबसे लोकप्रिय है, क्योंकि यह ज़्यादा मज़बूत होता है।',
    },
    {
        question: 'असली सोने की पहचान कैसे करें?',
        answer: 'हर गहने पर BIS हॉलमार्क और 6 अंकों का HUID नंबर ज़रूर देखें। बिल में सोने का वज़न, शुद्धता, मेकिंग चार्ज और GST अलग-अलग लिखा होना चाहिए।',
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
    const rates = await fetchGoldRatesAllCarats();
    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi')}`;

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

            <div className="bg-gray-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="mb-6" aria-label="ब्रेडक्रम्ब">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li><Link href="/hi" className="hover:text-primary-600">होम</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium">सोने का भाव</li>
                        </ol>
                    </nav>

                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">आज सोने का भाव — {today}</h1>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl">
                            24 कैरेट, 22 कैरेट और 18 कैरेट सोने का आज का सांकेतिक भाव, प्रति ग्राम और 10 ग्राम में। अपने शहर के
                            सोना बाज़ार, मेकिंग चार्ज और ख़रीदारी के टिप्स के लिए नीचे शहर चुनें।
                        </p>
                    </header>

                    <section className="mb-12" aria-labelledby="rates-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Coins className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="rates-heading" className="text-xl md:text-2xl font-display font-semibold text-gray-900">भारत में आज का सोने का भाव</h2>
                        </div>
                        <HindiGoldRateTable rates={rates} placeLabel="आपके शहर" />
                        <Link
                            href={goldRatePath('en')}
                            hrefLang={HREFLANG.en}
                            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            <Languages className="h-4 w-4" />
                            गोल्ड कैलकुलेटर, पिछले भाव और चार्ट (English में) देखें →
                        </Link>
                    </section>

                    <section className="mb-12" aria-labelledby="cities-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <MapPin className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="cities-heading" className="text-xl md:text-2xl font-display font-semibold text-gray-900">शहर के हिसाब से सोने का भाव</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(HINDI_CITY_NAMES).map((slug) => (
                                <Link
                                    key={slug}
                                    href={goldRatePath('hi', slug)}
                                    className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="font-bold text-gray-900">{HINDI_CITY_NAMES[slug]} में सोने का भाव</h3>
                                    <p className="text-sm text-gray-600 mt-1">{CITY_GOLD_DATA_HI[slug].tagline}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10 card" aria-labelledby="factors-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="h-7 w-7 text-primary-600" />
                            <h2 id="factors-heading" className="text-2xl font-display font-bold text-gray-900">सोने का भाव किन बातों से बदलता है</h2>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm sm:text-base">
                            <li className="flex gap-2"><span className="text-primary-500">●</span>अंतरराष्ट्रीय स्पॉट गोल्ड भाव और MCX फ्यूचर्स भाव</li>
                            <li className="flex gap-2"><span className="text-primary-500">●</span>डॉलर/रुपया विनिमय दर — कमज़ोर रुपया सोने को महंगा करता है</li>
                            <li className="flex gap-2"><span className="text-primary-500">●</span>सोने पर आयात शुल्क और 3% GST</li>
                            <li className="flex gap-2"><span className="text-primary-500">●</span>त्योहारों और शादी के सीज़न की मांग</li>
                        </ul>
                    </section>

                    <HindiPurityGuide placeLabel="आपके शहर" />

                    <section className="mb-10 card" aria-labelledby="faq-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <HelpCircle className="h-7 w-7 text-primary-600" />
                            <h2 id="faq-heading" className="text-2xl font-display font-bold text-gray-900">अक्सर पूछे जाने वाले सवाल</h2>
                        </div>
                        <div className="space-y-5">
                            {FAQ.map((item, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" open={i === 0}>
                                    <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base list-none [&::-webkit-details-marker]:hidden">
                                        {item.question}
                                    </summary>
                                    <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>

                    <HindiGoldDisclaimer placeLabel="सभी शहरों" />
                </div>
            </div>
        </>
    );
}
