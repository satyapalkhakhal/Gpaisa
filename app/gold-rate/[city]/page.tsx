import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import GoldCalculator from '@/components/GoldCalculator';
import GoldHistoryTable from '@/components/GoldHistoryTable';
import DynamicGoldChart from '@/components/DynamicGoldChart';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { IndianCity } from '@/types';
import { Coins, MapPin, Calculator, TrendingUp, ShoppingBag, Landmark, BookOpen, HelpCircle, Calendar, Lightbulb, Store } from 'lucide-react';
import Link from 'next/link';
import { getCityGoldData, CITY_GOLD_DATA } from '@/lib/cityGoldData';
import { getTodayIST } from '@/lib/dateUtils';
import { fetchGoldRatesAllCarats } from '@/lib/angelOneApi';
import GoldPriceHistoryChart from '@/components/GoldPriceHistoryChart';
import GoldNewsSection from '@/components/GoldNewsSection';

const CITIES: IndianCity[] = [
    "Delhi", "Chennai", "Mumbai", "Pune", "Hyderabad",
    "Bangalore", "Coimbatore", "Kolkata", "Ahmedabad", "Kerala"
];

export async function generateStaticParams() {
    return CITIES.map((city) => ({
        city: city.toLowerCase(),
    }));
}

export const revalidate = 86400;

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
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
        },
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
        },
    };
}

export default async function CityGoldRatePage(props: { params: Promise<{ city: string }> }) {
    const params = await props.params;
    const citySlug = params.city.toLowerCase();
    const cityData = getCityGoldData(citySlug);

    if (!cityData || !CITIES.map(c => c.toLowerCase()).includes(citySlug)) {
        notFound();
    }

    const goldRates = await fetchGoldRatesAllCarats();

    const {
        city: cityName, state, mainMarkets, tagline, heroDescription,
        uniqueDescription, goldCulture, keyHighlights, buyingTips,
        popularAreas, faq, priceFactors, investmentInsight, festivalsImpact,
    } = cityData;

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

            <div className="bg-gray-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ── Breadcrumb ─────────────────────────────────────────── */}
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/gold-rate" className="hover:text-primary-600">Gold Rates</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium">{cityName}</li>
                        </ol>
                    </nav>

                    {/* ── Hero Header ────────────────────────────────────────── */}
                    <header className="mb-10">
                        <div className="flex items-start gap-3 mb-3">
                            <MapPin className="h-9 w-9 sm:h-10 sm:w-10 text-primary-600 flex-shrink-0 mt-1" />
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                                    Gold Rate in {cityName} Today — {getTodayIST()}
                                </h1>
                                <p className="text-sm sm:text-base text-primary-700 font-semibold mt-1">{tagline}</p>
                            </div>
                        </div>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl">
                            {heroDescription}
                        </p>
                        {/* Key markets badge */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {mainMarkets.map(market => (
                                <span key={market} className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-amber-200">
                                    <Store className="h-3.5 w-3.5" /> {market}
                                </span>
                            ))}
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border border-gray-200">
                                📍 {state}
                            </span>
                        </div>
                    </header>

                    {/* ── Key Highlights Cards ──────────────────────────────── */}
                    <section className="mb-10" aria-labelledby="highlights-heading">
                        <h2 id="highlights-heading" className="sr-only">Key Highlights of {cityName} Gold Market</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {keyHighlights.map((h, i) => (
                                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-2xl mb-2">{h.icon}</div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{h.label}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{h.detail}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Today's Gold Rates ─────────────────────────────────── */}
                    <section className="mb-12" aria-labelledby="current-rates-heading">
                        <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                            <Coins className="h-6 w-6 md:h-7 md:w-7 text-primary-600 flex-shrink-0" aria-hidden="true" />
                            <h2 id="current-rates-heading" className="text-xl md:text-2xl font-display font-semibold text-gray-900">
                                Today&apos;s Gold Rates in {cityName}
                            </h2>
                        </div>
                        <DynamicGoldRates initialRates={goldRates} initialLastUpdated={goldRates.length ? new Date().toISOString() : null} />
                    </section>

                    {/* ── Gold Calculator ────────────────────────────────────── */}
                    <section className="mb-12" aria-labelledby="calculator-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <Calculator className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="calculator-heading" className="text-2xl font-display font-semibold text-gray-900">
                                Gold Price Calculator for {cityName}
                            </h2>
                        </div>
                        <GoldCalculator />
                    </section>

                    {/* ── Gold Rate History ──────────────────────────────────── */}
                    <section className="mb-12" aria-labelledby="history-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <TrendingUp className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="history-heading" className="text-2xl font-display font-semibold text-gray-900">
                                Gold Rate History in {cityName} (24K)
                            </h2>
                        </div>
                        <GoldHistoryTable city={cityName} carat="24k" />
                    </section>

                    {/* ── Gold News ─────────────────────────────────────────── */}
                    <GoldNewsSection />

                    {/* ── Gold Price Trend Chart ─────────────────────────────── */}
                    <section className="mb-12" aria-labelledby="chart-heading">
                        <DynamicGoldChart carat="24k" city={cityName} />
                    </section>

                    {/* ── Historical Gold Prices — 62 Years ─────────────────── */}
                    <GoldPriceHistoryChart cityName={cityName} />

                    {/* ═══════════════════════════════════════════════════════════
                         UNIQUE CITY CONTENT — E-E-A-T SECTIONS
                         ═══════════════════════════════════════════════════════════ */}

                    {/* ── About the Gold Market ─────────────────────────────── */}
                    <article className="mb-10 card" id="about-gold-market">
                        <div className="flex items-center space-x-3 mb-4">
                            <Landmark className="h-7 w-7 text-primary-600" />
                            <h2 className="text-2xl font-display font-bold text-gray-900">
                                About the Gold Market in {cityName}
                            </h2>
                        </div>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed text-base">{uniqueDescription}</p>
                        </div>
                    </article>

                    {/* ── Gold Culture & Heritage ───────────────────────────── */}
                    <article className="mb-10 card" id="gold-culture">
                        <div className="flex items-center space-x-3 mb-4">
                            <BookOpen className="h-7 w-7 text-primary-600" />
                            <h2 className="text-2xl font-display font-bold text-gray-900">
                                Gold Culture & Heritage in {cityName}
                            </h2>
                        </div>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed text-base">{goldCulture}</p>
                        </div>
                    </article>

                    {/* ── Popular Gold Markets / Areas ──────────────────────── */}
                    <section className="mb-10 card" id="popular-markets" aria-labelledby="popular-markets-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <ShoppingBag className="h-7 w-7 text-primary-600" />
                            <h2 id="popular-markets-heading" className="text-2xl font-display font-bold text-gray-900">
                                Best Gold Markets & Shopping Areas in {cityName}
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

                    {/* ── Buying Tips ────────────────────────────────────────── */}
                    <section className="mb-10 card" id="buying-tips" aria-labelledby="buying-tips-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <Lightbulb className="h-7 w-7 text-amber-500" />
                            <h2 id="buying-tips-heading" className="text-2xl font-display font-bold text-gray-900">
                                Gold Buying Tips for {cityName}
                            </h2>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Expert guidance to help you get the best deal when buying gold in {cityName}.</p>
                        <ol className="space-y-3">
                            {buyingTips.map((tip, i) => (
                                <li key={i} className="flex gap-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* ── Factors Affecting Price ────────────────────────────── */}
                    <section className="mb-10 card" id="price-factors" aria-labelledby="price-factors-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="h-7 w-7 text-primary-600" />
                            <h2 id="price-factors-heading" className="text-2xl font-display font-bold text-gray-900">
                                Factors Affecting Gold Prices in {cityName}
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

                    {/* ── Investment Insight ─────────────────────────────────── */}
                    <section className="mb-10 card bg-gradient-to-br from-amber-50 to-white border-amber-200" id="investment-insight" aria-labelledby="investment-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Lightbulb className="h-7 w-7 text-amber-600" />
                            <h2 id="investment-heading" className="text-2xl font-display font-bold text-gray-900">
                                Gold Investment Outlook in {cityName}
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{investmentInsight}</p>
                    </section>

                    {/* ── Festivals & Seasonal Impact ────────────────────────── */}
                    <section className="mb-10 card" id="festivals-impact" aria-labelledby="festivals-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Calendar className="h-7 w-7 text-primary-600" />
                            <h2 id="festivals-heading" className="text-2xl font-display font-bold text-gray-900">
                                Festival & Seasonal Gold Demand in {cityName}
                            </h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-base">{festivalsImpact}</p>
                    </section>

                    {/* ── Gold Purity Explained ──────────────────────────────── */}
                    <section className="mb-10 card" id="purity-guide" aria-labelledby="purity-heading">
                        <div className="flex items-center space-x-3 mb-4">
                            <Coins className="h-7 w-7 text-primary-600" />
                            <h2 id="purity-heading" className="text-2xl font-display font-bold text-gray-900">
                                Gold Purity Guide — 24K vs 22K vs 18K
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <h3 className="font-bold text-gray-900 text-base mb-2">24K Gold (99.9% pure)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    The purest form of gold, ideal for investment. Too soft for daily-wear jewellery.
                                    Available as bars and coins from certified dealers in {cityName}.
                                </p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                <h3 className="font-bold text-gray-900 text-base mb-2">22K Gold (91.67% pure)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    The most popular purity for jewellery in India. Also called 916 gold.
                                    Perfect balance of purity and durability for everyday wear.
                                </p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                <h3 className="font-bold text-gray-900 text-base mb-2">18K Gold (75% pure)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Used for modern designer jewellery. More durable due to higher alloy content.
                                    Popular for contemporary and western-style designs in {cityName}.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── FAQ Section ────────────────────────────────────────── */}
                    <section className="mb-10 card" id="faq" aria-labelledby="faq-heading">
                        <div className="flex items-center space-x-3 mb-5">
                            <HelpCircle className="h-7 w-7 text-primary-600" />
                            <h2 id="faq-heading" className="text-2xl font-display font-bold text-gray-900">
                                Frequently Asked Questions — Gold in {cityName}
                            </h2>
                        </div>
                        <div className="space-y-5">
                            {faq.map((item, i) => (
                                <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" open={i === 0}>
                                    <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">Q</span>
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

                    {/* ── Other Cities ─────────────────────────────────────── */}
                    <section className="mb-10 card" aria-labelledby="other-cities-heading">
                        <h2 id="other-cities-heading" className="text-xl font-display font-semibold text-gray-900 mb-4">
                            Gold Rates in Other Cities
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
                                    {CITIES.filter(c => c.toLowerCase() !== citySlug).map((c) => (
                                        <tr key={c} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{c}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/gold-rate/${c.toLowerCase()}`} className="text-primary-600 hover:underline">View Rate →</Link>
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
                            The gold rates displayed for {cityName} are indicative and sourced from market data aggregators.
                            Actual prices may vary slightly at individual jewellery stores due to making charges, GST (3%),
                            and dealer-specific margins. Always verify the current rate, check for BIS hallmark (HUID number),
                            and ask for a detailed invoice before making a purchase. The information provided here is for
                            educational purposes and does not constitute financial or investment advice.
                        </p>
                    </aside>

                    {/* ── Last Updated ───────────────────────────────────────── */}
                    <footer className="text-center">
                        <LastUpdatedTime />
                        <p className="text-xs text-gray-400 mt-2">
                            Written by the gpaisa.in editorial team · {cityName} gold market expert guide
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}
