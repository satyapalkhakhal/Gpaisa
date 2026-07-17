import { Metadata } from 'next';
import { fetchSilverCities, fetchSilverRateData } from '@/lib/angelOneApi';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import SilverHistoryTable from '@/components/SilverHistoryTable';
import SilverPriceHistoryChart from '@/components/SilverPriceHistoryChart';
import SilverNewsSection from '@/components/SilverNewsSection';
import CitySilverRatesTable from '@/components/CitySilverRatesTable';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp, Calculator, Globe, BarChart3, ArrowRight, Scale, Calendar } from 'lucide-react';
import { getTodayIST } from '@/lib/dateUtils';

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

export const revalidate = 86400; // Cache for 1 day (ISR)

export default async function SilverRatePage() {
    const cities = await fetchSilverCities();
    const silverRateData = await fetchSilverRateData('XAG');

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
        "mainEntity": [
            { "@type": "Question", "name": "What is the silver rate today in India?", "acceptedAnswer": { "@type": "Answer", "text": "Silver rates in India vary by city. Check our live silver rate table above for current prices per gram and per kg in major Indian cities." } },
            { "@type": "Question", "name": "Why do silver rates differ across cities?", "acceptedAnswer": { "@type": "Answer", "text": "Silver prices differ across Indian cities due to local taxes, transportation costs, demand-supply dynamics, and dealer margins." } },
            { "@type": "Question", "name": "What factors affect silver prices in India?", "acceptedAnswer": { "@type": "Answer", "text": "Silver prices are influenced by international prices, USD/INR exchange rate, industrial demand (electronics, solar panels), inflation, and geopolitical tensions." } },
            { "@type": "Question", "name": "Is silver a good investment in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Silver offers a unique combination of precious metal value and industrial demand. With growing solar panel and electronics production, silver demand is expected to rise, making it an attractive investment option." } },
            { "@type": "Question", "name": "How does silver compare to gold as an investment?", "acceptedAnswer": { "@type": "Answer", "text": "Silver is more volatile than gold but has higher growth potential due to industrial demand. Gold is a safer, more stable investment. Many experts recommend holding both in a diversified portfolio." } },
        ]
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

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                        Silver Rate Today in India — {getTodayIST()}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Check live silver rates across major Indian cities. Updated in real-time with prices per gram and per kg.
                    </p>
                </header>

                {/* 📊 Silver Rate Today in India - SEO Authority Section */}
                <section className="mb-16">
                    <div className="card bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2 p-8 md:p-10">
                                <h2 className="text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    📊 Silver Rate Today in India
                                </h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Silver prices in India are driven by a unique combination of precious metal demand and industrial usage. Unlike gold, silver has significant industrial applications in electronics, solar panels, and medical devices, which heavily influence its pricing.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    In 2026, silver prices have been particularly volatile due to the surge in green energy investments and the growing demand for solar panels worldwide. Understanding these dynamics is key for both investors and jewellery buyers.
                                </p>
                            </div>
                            <div className="md:w-1/2 relative min-h-[280px]">
                                <Image
                                    src="https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg"
                                    alt="Silver Rate Today in India - Live Silver Price Chart and Analysis"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* National Rates */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
                        Current Silver Rates
                    </h2>
                    <DynamicSilverRates initialRateData={silverRateData} initialLastUpdated={silverRateData ? new Date().toISOString() : null} />
                </section>

                {/* 📅 Silver Rate History - Last 10 Days */}
                <section className="mb-16" aria-labelledby="silver-history-heading">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <Calendar className="h-7 w-7 text-gray-600" aria-hidden="true" />
                        <h2 id="silver-history-heading" className="text-2xl md:text-3xl font-display font-bold text-gray-900">
                            Silver Rate History in India — Last 10 Days
                        </h2>
                    </div>
                    <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
                        Track the daily movement of silver prices across India. Historical price data helps identify trends and find the right time to buy silver or invest.
                    </p>
                    <SilverHistoryTable symbol="XAG" gram={10} />
                </section>

                {/* 🪙 Silver News */}
                <SilverNewsSection />

                {/* 📈 Historical Silver Prices — 45 Years of Data */}
                <SilverPriceHistoryChart />

                {/* 🌍 What Affects Silver Prices in India? */}
                <section className="mb-16">
                    <div className="card bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-200 rounded-2xl p-8 md:p-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe className="h-7 w-7 text-gray-600" />
                            What Affects Silver Prices in India?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { icon: '🌐', title: 'International Silver Prices', desc: 'Global benchmark prices on COMEX and London markets directly influence Indian silver rates.' },
                                { icon: '💱', title: 'USD to INR Exchange Rate', desc: 'A weaker rupee makes imported silver more expensive, increasing domestic prices.' },
                                { icon: '🔬', title: 'Industrial Demand', desc: 'Growing demand from electronics, solar panels, and 5G technology significantly drives silver prices.' },
                                { icon: '☀️', title: 'Green Energy Expansion', desc: 'Solar panel manufacturing uses massive amounts of silver, creating sustained upward pressure.' },
                                { icon: '📈', title: 'Inflation & Interest Rates', desc: 'Higher inflation pushes investors toward precious metals including silver as a hedge.' },
                                { icon: '🎉', title: 'Festival & Seasonal Demand', desc: 'Silverware and jewellery purchases spike during festive seasons and weddings in India.' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📈 Current Silver Market Trend */}
                <section className="mb-16">
                    <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 md:p-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <BarChart3 className="h-7 w-7 text-emerald-600" />
                            Current Silver Market Trend
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                Silver prices have seen significant movement in recent months, driven by industrial demand and global market uncertainty. The metal&apos;s dual role as both an investment asset and an industrial commodity continues to make it one of the most dynamic precious metals to track.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                    <p className="text-sm text-gray-500 mb-1">Trend Direction</p>
                                    <p className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                                        <TrendingUp className="h-5 w-5" /> Bullish
                                    </p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                    <p className="text-sm text-gray-500 mb-1">Volatility</p>
                                    <p className="text-xl font-bold text-amber-600">Very High</p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                    <p className="text-sm text-gray-500 mb-1">Key Driver</p>
                                    <p className="text-xl font-bold text-blue-600">Industrial + Solar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ⚖️ Silver vs Gold Comparison */}
                <section className="mb-16">
                    <div className="card bg-gradient-to-r from-gray-50 via-white to-amber-50 border border-gray-200 rounded-2xl p-8 md:p-10">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Scale className="h-7 w-7 text-gray-600" />
                            Silver vs Gold: Quick Comparison
                        </h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            While gold is traditionally the preferred safe-haven asset, silver&apos;s industrial demand gives it a unique investment profile. Understanding the differences helps investors build a balanced precious metals portfolio.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-3 text-left rounded-tl-lg">Factor</th>
                                        <th className="px-4 py-3 text-center">🥈 Silver</th>
                                        <th className="px-4 py-3 text-center rounded-tr-lg">🥇 Gold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Volatility', 'High', 'Low–Medium'],
                                        ['Industrial Use', 'Very High (Solar, Electronics)', 'Limited'],
                                        ['Investment Type', 'Growth + Industrial', 'Safe Haven'],
                                        ['Liquidity', 'High', 'Very High'],
                                        ['Storage', 'Bulky (Lower value per gram)', 'Easy (High value per gram)'],
                                        ['10-Year CAGR (India)', '~10-13%', '~12-14%'],
                                        ['Best For', 'Higher risk-reward', 'Long-term stability'],
                                        ['Green Energy Demand', '🔥 Very Strong', 'Minimal'],
                                    ].map(([factor, silver, gold], i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3 font-medium text-gray-900">{factor}</td>
                                            <td className="px-4 py-3 text-center text-gray-600 font-medium">{silver}</td>
                                            <td className="px-4 py-3 text-center text-amber-700 font-medium">{gold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 items-center">
                            <Link
                                href="/gold-vs-silver"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-900 transition-all shadow-md hover:shadow-lg"
                            >
                                📊 View Full Silver vs Gold Analysis
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/gold-rate"
                                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                            >
                                View Gold Rates →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* City-Wise Silver Rates — Live Table */}
                <CitySilverRatesTable />

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-8 text-center">
                        Why Track Silver Rates on gpaisa.in?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Market Data</h3>
                            <p className="text-gray-600">
                                Real-time silver prices updated directly from market feeds.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">City-Specific Rates</h3>
                            <p className="text-gray-600">
                                Accurate rates for over 15 major Indian cities.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calculator className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Calculator</h3>
                            <p className="text-gray-600">
                                Calculate value for any weight instantly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <article className="card mb-12">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                        Understanding Silver Rates in India
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                        <p>
                            Silver is a popular precious metal in India, used extensively in jewelry, silverware, and industry.
                            Like gold, silver rates in India are influenced by international prices, currency fluctuations, import duties, and local demand.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Factors Impacting Silver Prices</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Industrial Demand:</strong> Silver has massive industrial applications in electronics, solar panels, and medical devices.</li>
                            <li><strong>Investment Demand:</strong> Investors buy silver as a hedge against inflation and currency devaluation.</li>
                            <li><strong>USD/INR Rate:</strong> A weaker Rupee makes imported silver more expensive.</li>
                            <li><strong>Green Energy:</strong> Solar panel manufacturing is one of the fastest-growing sources of silver demand globally.</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Silver Weight Units</h3>
                        <p>
                            Silver is commonly traded in kilograms (kg) in the wholesale market, while retail prices are often quoted per 10 grams or per gram.
                            1 Kg = 1000 Grams.
                        </p>
                    </div>
                </article>

                {/* Silver Investment Guide - Authority Content */}
                <article className="card mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                        💡 Silver Investment Guide for 2026
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                        <p>
                            Silver offers unique investment opportunities due to its dual nature as both a precious metal and an industrial commodity. Here are the key ways to invest in silver in India:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Physical Silver</h3>
                                <p className="text-sm text-gray-600">
                                    Silver bars, coins, and jewellery. Most traditional form but requires secure storage due to bulk.
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Silver ETFs</h3>
                                <p className="text-sm text-gray-600">
                                    Exchange-traded funds that track silver prices. No storage hassle, highly liquid, and trade on stock exchanges.
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Silver Mutual Funds</h3>
                                <p className="text-sm text-gray-600">
                                    Fund-of-funds that invest in Silver ETFs. Available through SIP for systematic investment.
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Silver</h3>
                                <p className="text-sm text-gray-600">
                                    Buy silver online starting from ₹1. Available on investment platforms with easy buy/sell options.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* CTA */}
                <div className="text-center card bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                        Stay Updated with Silver Prices
                    </h3>
                    <p className="text-gray-700 mb-6">Track silver rates across all major cities and make informed buying decisions.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/commodities" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                            View All Commodity Prices
                        </Link>
                        <Link href="/gold-vs-silver" className="inline-block bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                            Silver vs Gold Analysis →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
