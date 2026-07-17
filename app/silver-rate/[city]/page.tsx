import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSilverCities, fetchSilverCalculator } from '@/lib/angelOneApi';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import SilverCalculator from '@/components/SilverCalculator';
import SilverHistoryTable from '@/components/SilverHistoryTable';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import Link from 'next/link';
import { MapPin, Coins, Calculator, TrendingUp, ShoppingBag, Landmark, BookOpen, HelpCircle, Calendar, Lightbulb, Store } from 'lucide-react';
import { getCitySilverData } from '@/lib/citySilverData';
import { getTodayIST } from '@/lib/dateUtils';
import SilverPriceHistoryChart from '@/components/SilverPriceHistoryChart';
import SilverNewsSection from '@/components/SilverNewsSection';

export async function generateStaticParams() {
    const cities = await fetchSilverCities();
    return cities.map((city) => ({
        city: city.slug,
    }));
}

export const revalidate = 86400;

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const params = await props.params;
    const cities = await fetchSilverCities();
    const cityObj = cities.find(c => c.slug === params.city);

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
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
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
    const cities = await fetchSilverCities();
    const cityObj = cities.find(c => c.slug === params.city);

    if (!cityObj) {
        notFound();
    }

    const cityName = cityObj.city;
    const symbol = cityObj.symbol;
    const citySlug = params.city;
    const silverInfo = getCitySilverData(citySlug);

    const calculatorData = await fetchSilverCalculator(symbol);
    const currentPrice = calculatorData?.data?.silver?.today || 0;
    const silverRateData = calculatorData?.data?.silver
        ? {
            price: calculatorData.data.silver.today,
            change: calculatorData.data.silver.differenceAmount,
            changePercent: calculatorData.data.silver.differencePercentage,
        }
        : null;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 1);
    const priceValidUntil = validUntil.toISOString().split('T')[0];

    // ─── Structured Data ─────────────────────────────────────────────────
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

    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `Silver Rate in ${cityName}`,
        description: `Live silver price in ${cityName}`,
        sku: `SILVER-${symbol}`,
        offers: {
            "@type": "Offer",
            price: currentPrice,
            priceCurrency: "INR",
            priceValidUntil: priceValidUntil,
            availability: "https://schema.org/InStock",
            areaServed: { "@type": "City", name: cityName },
            hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "IN",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 7,
                returnMethod: "https://schema.org/ReturnInStore",
            },
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
                deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
                },
            },
        },
    };

    const faqSchemaItems = silverInfo
        ? silverInfo.faq.map(f => ({
            "@type": "Question" as const,
            name: f.question,
            acceptedAnswer: { "@type": "Answer" as const, text: f.answer },
        }))
        : [
            {
                "@type": "Question" as const,
                name: `What is the silver rate in ${cityName} today?`,
                acceptedAnswer: { "@type": "Answer" as const, text: `Check the latest live silver rates in ${cityName} on gpaisa.in. We provide up-to-date prices per gram and per kg.` },
            },
            {
                "@type": "Question" as const,
                name: `How is silver purity measured in ${cityName}?`,
                acceptedAnswer: { "@type": "Answer" as const, text: 'Silver purity is measured in percentage, with 999 (99.9%) being fine silver. In jewelry, 925 (Sterling Silver) is the standard.' },
            },
        ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSchemaItems,
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
        <div className="bg-gray-50 py-8 sm:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ── Breadcrumb ─────────────────────────────────────────── */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/silver-rate" className="hover:text-primary-600">Silver Rates</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{cityName}</li>
                    </ol>
                </nav>

                {/* ── Hero Header ────────────────────────────────────────── */}
                <header className="mb-10">
                    <div className="flex items-start gap-3 mb-3">
                        <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-gray-500 flex-shrink-0 mt-1" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                                Silver Rate in {cityName} Today — {getTodayIST()}
                            </h1>
                            {silverInfo && (
                                <p className="text-sm sm:text-base text-gray-600 font-semibold mt-1">{silverInfo.tagline}</p>
                            )}
                        </div>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl">
                        {silverInfo?.heroDescription || `Live silver prices in ${cityName}. Updated in real-time with historical data and price calculator.`}
                    </p>
                    {/* Key markets badge */}
                    {silverInfo && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {silverInfo.mainMarkets.map(market => (
                                <span key={market} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                    <Store className="h-3.5 w-3.5" /> {market}
                                </span>
                            ))}
                            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200">
                                📍 {silverInfo.state}
                            </span>
                        </div>
                    )}
                </header>

                {/* ── Key Highlights Cards ──────────────────────────────── */}
                {silverInfo && (
                    <section className="mb-10" aria-labelledby="highlights-heading">
                        <h2 id="highlights-heading" className="sr-only">Key Highlights of {cityName} Silver Market</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {silverInfo.keyHighlights.map((h, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-2xl mb-2">{h.icon}</div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{h.label}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{h.detail}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Today's Silver Rates ─────────────────────────────── */}
                <section className="mb-12" aria-labelledby="current-rates-heading">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                        <Coins className="h-6 w-6 md:h-7 md:w-7 text-gray-500 flex-shrink-0" aria-hidden="true" />
                        <h2 id="current-rates-heading" className="text-xl md:text-2xl font-display font-semibold text-gray-900">
                            Today&apos;s Silver Rates in {cityName}
                        </h2>
                    </div>
                    <DynamicSilverRates symbol={symbol} city={cityName} initialRateData={silverRateData} initialLastUpdated={silverRateData ? new Date().toISOString() : null} />
                </section>

                {/* ── Silver Calculator ──────────────────────────────────── */}
                <section className="mb-12" aria-labelledby="calculator-heading">
                    <div className="flex items-center space-x-3 mb-6">
                        <Calculator className="h-7 w-7 text-gray-500" aria-hidden="true" />
                        <h2 id="calculator-heading" className="text-2xl font-display font-semibold text-gray-900">
                            Silver Price Calculator for {cityName}
                        </h2>
                    </div>
                    <SilverCalculator initialCitySlug={cityObj.slug} />
                </section>

                {/* ── Silver Rate History ────────────────────────────────── */}
                <section className="mb-12" aria-labelledby="history-heading">
                    <div className="flex items-center space-x-3 mb-6">
                        <TrendingUp className="h-7 w-7 text-gray-500" aria-hidden="true" />
                        <h2 id="history-heading" className="text-2xl font-display font-semibold text-gray-900">
                            Silver Rate History in {cityName}
                        </h2>
                    </div>
                    <SilverHistoryTable symbol={symbol} />
                </section>

                {/* ── Historical Silver Price Chart ─────────────────── */}
                <SilverPriceHistoryChart cityName={cityName} />

                {/* ═══════════════════════════════════════════════════════════
                     UNIQUE CITY CONTENT — E-E-A-T SECTIONS
                     ═══════════════════════════════════════════════════════════ */}

                {silverInfo && (
                    <>
                        {/* ── About the Silver Market ──────────────────────── */}
                        <article className="mb-10 card" id="about-silver-market">
                            <div className="flex items-center space-x-3 mb-4">
                                <Landmark className="h-7 w-7 text-gray-500" />
                                <h2 className="text-2xl font-display font-bold text-gray-900">
                                    About the Silver Market in {cityName}
                                </h2>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed text-base">{silverInfo.uniqueDescription}</p>
                            </div>
                        </article>

                        {/* ── Silver Culture & Heritage ─────────────────────── */}
                        <article className="mb-10 card" id="silver-culture">
                            <div className="flex items-center space-x-3 mb-4">
                                <BookOpen className="h-7 w-7 text-gray-500" />
                                <h2 className="text-2xl font-display font-bold text-gray-900">
                                    Silver Culture & Traditions in {cityName}
                                </h2>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed text-base">{silverInfo.silverCulture}</p>
                            </div>
                        </article>

                        {/* ── Popular Silver Markets / Areas ────────────────── */}
                        <section className="mb-10 card" id="popular-markets" aria-labelledby="popular-markets-heading">
                            <div className="flex items-center space-x-3 mb-5">
                                <ShoppingBag className="h-7 w-7 text-gray-500" />
                                <h2 id="popular-markets-heading" className="text-2xl font-display font-bold text-gray-900">
                                    Best Silver Markets & Shopping Areas in {cityName}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {silverInfo.popularAreas.map((area, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 text-base mb-1.5 flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">{i + 1}</span>
                                            {area.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{area.specialty}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── Buying Tips ────────────────────────────────────── */}
                        <section className="mb-10 card" id="buying-tips" aria-labelledby="buying-tips-heading">
                            <div className="flex items-center space-x-3 mb-5">
                                <Lightbulb className="h-7 w-7 text-gray-500" />
                                <h2 id="buying-tips-heading" className="text-2xl font-display font-bold text-gray-900">
                                    Silver Buying Tips for {cityName}
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">Expert guidance to help you get the best deal when buying silver in {cityName}.</p>
                            <ol className="space-y-3">
                                {silverInfo.buyingTips.map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {/* ── Factors Affecting Price ──────────────────────── */}
                        <section className="mb-10 card" id="price-factors" aria-labelledby="price-factors-heading">
                            <div className="flex items-center space-x-3 mb-4">
                                <TrendingUp className="h-7 w-7 text-gray-500" />
                                <h2 id="price-factors-heading" className="text-2xl font-display font-bold text-gray-900">
                                    Factors Affecting Silver Prices in {cityName}
                                </h2>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {silverInfo.priceFactors.map((factor, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                                        <span className="text-gray-400 mt-1 flex-shrink-0">●</span>
                                        <span>{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* ── Investment Insight ─────────────────────────────── */}
                        <section className="mb-10 card bg-gradient-to-br from-slate-50 to-white border-slate-200" id="investment-insight" aria-labelledby="investment-heading">
                            <div className="flex items-center space-x-3 mb-4">
                                <Lightbulb className="h-7 w-7 text-gray-600" />
                                <h2 id="investment-heading" className="text-2xl font-display font-bold text-gray-900">
                                    Silver Investment Outlook in {cityName}
                                </h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-base">{silverInfo.investmentInsight}</p>
                        </section>

                        {/* ── Festivals & Seasonal Impact ────────────────────── */}
                        <section className="mb-10 card" id="festivals-impact" aria-labelledby="festivals-heading">
                            <div className="flex items-center space-x-3 mb-4">
                                <Calendar className="h-7 w-7 text-gray-500" />
                                <h2 id="festivals-heading" className="text-2xl font-display font-bold text-gray-900">
                                    Festival & Seasonal Silver Demand in {cityName}
                                </h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-base">{silverInfo.festivalsImpact}</p>
                        </section>
                    </>
                )}

                {/* ── Silver Purity Guide ────────────────────────────────── */}
                <section className="mb-10 card" id="purity-guide" aria-labelledby="purity-heading">
                    <div className="flex items-center space-x-3 mb-4">
                        <Coins className="h-7 w-7 text-gray-500" />
                        <h2 id="purity-heading" className="text-2xl font-display font-bold text-gray-900">
                            Silver Purity Guide — 999 vs 925 vs 800
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h3 className="font-bold text-gray-900 text-base mb-2">999 Fine Silver (99.9%)</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The purest form of silver, used for investment bars, coins, and bullion.
                                Too soft for jewellery. Available from certified dealers in {cityName}.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h3 className="font-bold text-gray-900 text-base mb-2">925 Sterling Silver (92.5%)</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                The standard for silver jewellery worldwide. Alloyed with copper for durability.
                                Look for the &quot;925&quot; hallmark on all silver jewellery purchases.
                            </p>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                            <h3 className="font-bold text-gray-900 text-base mb-2">800 Silver (80%)</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Used for silverware, utensils, and decorative items. More durable for daily use.
                                Common in traditional silver vessels and household items across India.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── FAQ Section ────────────────────────────────────────── */}
                {silverInfo && (
                    <section className="mb-10 card" id="faq" aria-labelledby="faq-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <HelpCircle className="h-7 w-7 text-gray-500" />
                            <h2 id="faq-heading" className="text-2xl font-display font-bold text-gray-900">
                                Frequently Asked Questions — Silver in {cityName}
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {silverInfo.faq.map((item, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" open={i === 0}>
                                    <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mt-0.5">Q</span>
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
                )}

                {/* ── Silver News ───────────────────────────────────────── */}
                <SilverNewsSection />

                {/* ── Other Cities ───────────────────────────────────────── */}
                <section className="mb-10 card" aria-labelledby="other-cities-heading">
                    <h2 id="other-cities-heading" className="text-xl font-display font-semibold text-gray-900 mb-4">
                        Silver Rates in Other Cities
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">City</th>
                                    <th className="px-4 py-3 text-right">View Rates</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cities.filter(c => c.slug !== params.city).slice(0, 10).map((city) => (
                                    <tr key={city.slug} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{city.city}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/silver-rate/${city.slug}`} className="text-primary-600 hover:underline">View Rate →</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── Disclaimer ─────────────────────────────────────────── */}
                <aside className="card bg-yellow-50 border-yellow-200 mb-8">
                    <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">Important Disclaimer</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        The silver rates displayed for {cityName} are indicative and sourced from market data aggregators.
                        Actual prices may vary based on purity, making charges, GST (3%), and dealer margins.
                        Always verify the current rate, check for BIS hallmark on silver jewellery, and ask for a
                        detailed invoice before making a purchase. The information provided here is for educational
                        purposes and does not constitute financial or investment advice.
                    </p>
                </aside>

                {/* ── Last Updated ───────────────────────────────────────── */}
                <footer className="text-center">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-400 mt-2">
                        Written by the gpaisa.in editorial team · {cityName} silver market expert guide
                    </p>
                </footer>
            </div>
        </div>
    );
}
