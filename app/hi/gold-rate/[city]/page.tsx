import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Coins, MapPin, TrendingUp, ShoppingBag, Landmark, BookOpen, HelpCircle, Calendar, Lightbulb, Store, Languages } from 'lucide-react';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { fetchGoldRatesAllCarats } from '@/lib/angelOneApi';
import { getTodayISTHindi } from '@/lib/dateUtils';
import { HREFLANG, SITE_URL } from '@/lib/articleLocale';
import { HINDI_CITY_NAMES, getCityGoldDataHi, isHindiGoldPageReviewed } from '@/lib/cityGoldDataHi';
import { getCityGoldData } from '@/lib/cityGoldData';
import { goldRateLanguageAlternates, goldRatePath } from '@/lib/goldRateLocale';
import HindiGoldRateTable from '@/components/gold/HindiGoldRateTable';
import { HindiGoldDisclaimer, HindiPurityGuide } from '@/components/gold/HindiGoldSections';

// Hindi gold rate city pages (Hindi counterpart of /gold-rate/[city]). Rates are server-
// rendered; the calculator, history and charts stay on the English page, linked below.

const CITY_SLUGS = Object.keys(HINDI_CITY_NAMES);

export async function generateStaticParams() {
    return CITY_SLUGS.map((city) => ({ city }));
}

export const revalidate = 86400;

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
    const rates = await fetchGoldRatesAllCarats(getCityGoldData(citySlug)?.city ?? 'India');
    const today = getTodayISTHindi();
    const url = `${SITE_URL}${goldRatePath('hi', citySlug)}`;
    const {
        city: cityName, state, mainMarkets, tagline, heroDescription, uniqueDescription, goldCulture,
        keyHighlights, buyingTips, popularAreas, faq, priceFactors, investmentInsight, festivalsImpact,
    } = data;

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

            <div className="bg-gray-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <nav className="mb-6" aria-label="ब्रेडक्रम्ब">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li><Link href="/hi" className="hover:text-primary-600">होम</Link></li>
                            <li>/</li>
                            <li><Link href={goldRatePath('hi')} className="hover:text-primary-600">सोने का भाव</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium">{cityName}</li>
                        </ol>
                    </nav>

                    <header className="mb-10">
                        <div className="flex items-start gap-3 mb-3">
                            <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-primary-600 flex-shrink-0 mt-1" />
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                                    {cityName} में आज सोने का भाव — {today}
                                </h1>
                                <p className="text-sm sm:text-base text-primary-700 font-semibold mt-1">{tagline}</p>
                            </div>
                        </div>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl">{heroDescription}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {mainMarkets.map((market) => (
                                <span key={market} className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-amber-200">
                                    <Store className="h-3.5 w-3.5" /> {market}
                                </span>
                            ))}
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                📍 {state}
                            </span>
                        </div>
                    </header>

                    <section className="mb-12" aria-labelledby="current-rates-heading">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                            <Coins className="h-6 w-6 md:h-7 md:w-7 text-primary-600 flex-shrink-0" aria-hidden="true" />
                            <h2 id="current-rates-heading" className="text-xl md:text-2xl font-display font-semibold text-gray-900">
                                {cityName} में आज का सोने का भाव
                            </h2>
                        </div>
                        <HindiGoldRateTable rates={rates} placeLabel={cityName} scope="city" />
                        <Link
                            href={goldRatePath('en', citySlug)}
                            hrefLang={HREFLANG.en}
                            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            <Languages className="h-4 w-4" />
                            गोल्ड कैलकुलेटर, पिछले भाव और चार्ट (English में) देखें →
                        </Link>
                    </section>

                    <section className="mb-10" aria-labelledby="highlights-heading">
                        <h2 id="highlights-heading" className="sr-only">{cityName} के सोना बाज़ार की ख़ास बातें</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {keyHighlights.map((h, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                    <div className="text-2xl mb-2">{h.icon}</div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{h.label}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{h.detail}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <article className="mb-10 card" id="about-gold-market">
                        <div className="flex items-center space-x-3 mb-4">
                            <Landmark className="h-7 w-7 text-primary-600" />
                            <h2 className="text-2xl font-display font-bold text-gray-900">{cityName} का सोना बाज़ार</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{uniqueDescription}</p>
                    </article>

                    <article className="mb-10 card" id="gold-culture">
                        <div className="flex items-center space-x-3 mb-4">
                            <BookOpen className="h-7 w-7 text-primary-600" />
                            <h2 className="text-2xl font-display font-bold text-gray-900">{cityName} की गोल्ड संस्कृति और विरासत</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{goldCulture}</p>
                    </article>

                    <section className="mb-10 card" id="popular-markets" aria-labelledby="popular-markets-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <ShoppingBag className="h-7 w-7 text-primary-600" />
                            <h2 id="popular-markets-heading" className="text-2xl font-display font-bold text-gray-900">
                                {cityName} के प्रमुख सोना बाज़ार
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {popularAreas.map((area, i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <h3 className="font-bold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">{i + 1}</span>
                                        {area.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{area.specialty}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10 card" id="buying-tips" aria-labelledby="buying-tips-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <Lightbulb className="h-7 w-7 text-amber-500" />
                            <h2 id="buying-tips-heading" className="text-2xl font-display font-bold text-gray-900">
                                {cityName} में सोना ख़रीदने के टिप्स
                            </h2>
                        </div>
                        <ol className="space-y-3">
                            {buyingTips.map((tip, i) => (
                                <li key={i} className="flex gap-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="mb-10 card" id="price-factors" aria-labelledby="price-factors-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="h-7 w-7 text-primary-600" />
                            <h2 id="price-factors-heading" className="text-2xl font-display font-bold text-gray-900">
                                {cityName} में सोने के भाव पर असर डालने वाले कारण
                            </h2>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {priceFactors.map((factor, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                                    <span className="text-primary-500 mt-1 flex-shrink-0">●</span>
                                    <span>{factor}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-10 card bg-gradient-to-br from-amber-50 to-white border-amber-200" id="investment-insight" aria-labelledby="investment-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Lightbulb className="h-7 w-7 text-amber-600" />
                            <h2 id="investment-heading" className="text-2xl font-display font-bold text-gray-900">{cityName} में सोने में निवेश</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{investmentInsight}</p>
                    </section>

                    <section className="mb-10 card" id="festivals-impact" aria-labelledby="festivals-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Calendar className="h-7 w-7 text-primary-600" />
                            <h2 id="festivals-heading" className="text-2xl font-display font-bold text-gray-900">
                                {cityName} में त्योहार और मौसमी मांग
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{festivalsImpact}</p>
                    </section>

                    <HindiPurityGuide placeLabel={cityName} />

                    <section className="mb-10 card" id="faq" aria-labelledby="faq-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <HelpCircle className="h-7 w-7 text-primary-600" />
                            <h2 id="faq-heading" className="text-2xl font-display font-bold text-gray-900">
                                अक्सर पूछे जाने वाले सवाल — {cityName} में सोना
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {faq.map((item, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" open={i === 0}>
                                    <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">प्र</span>
                                        <span className="flex-1">{item.question}</span>
                                        <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-lg">▼</span>
                                    </summary>
                                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-9">{item.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    <section className="mb-10 card" aria-labelledby="other-cities-heading">
                        <h2 id="other-cities-heading" className="text-xl font-display font-semibold text-gray-900 mb-4">
                            दूसरे शहरों में सोने का भाव
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {CITY_SLUGS.filter((c) => c !== citySlug).map((c) => (
                                <Link
                                    key={c}
                                    href={goldRatePath('hi', c)}
                                    className="block bg-gray-50 hover:bg-amber-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:text-primary-700"
                                >
                                    {HINDI_CITY_NAMES[c]} में सोने का भाव
                                </Link>
                            ))}
                        </div>
                    </section>

                    <HindiGoldDisclaimer placeLabel={cityName} />

                    <footer className="text-center text-xs text-gray-400">
                        भाव अपडेट: {today} · gpaisa.in
                    </footer>
                </div>
            </div>
        </>
    );
}
