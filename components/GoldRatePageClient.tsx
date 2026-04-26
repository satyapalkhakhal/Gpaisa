'use client';

import { MapPin, TrendingUp, Calculator, Globe, BarChart3, ArrowRight, Scale, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import GoldHistoryTable from '@/components/GoldHistoryTable';
import DynamicGoldChart from '@/components/DynamicGoldChart';
import GoldPriceHistoryChart from '@/components/GoldPriceHistoryChart';
import CityGoldRatesTable from '@/components/CityGoldRatesTable';
import GoldNewsSection from '@/components/GoldNewsSection';
import { useLanguage } from '@/lib/i18n';

export default function GoldRatePageClient({ todayDate }: { todayDate: string }) {
    const { t } = useLanguage();

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="mb-8 sm:mb-12 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
                    Gold Rate Today in India — {todayDate}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('gold', 'goldRateSubtitle')}
                </p>
            </header>

            {/* 📊 Gold Rate Today in India - SEO Authority Section */}
            <section className="mb-10 sm:mb-16">
                <div className="card bg-white rounded-2xl shadow-lg overflow-hidden p-0">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-5 sm:p-8 md:p-10">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
                                📊 Gold Rate Today in India
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Gold prices in India are influenced by global market trends, currency fluctuations, and domestic demand. As one of the most preferred investment options, gold continues to play a crucial role in both jewellery purchases and financial planning.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                In 2026, gold prices have become more volatile due to global uncertainty, geopolitical tensions, and changes in currency strength. Tracking gold rates across major cities helps buyers and investors make informed decisions.
                            </p>
                        </div>
                        <div className="md:w-1/2 relative min-h-[280px]">
                            <Image
                                src="https://res.cloudinary.com/dpqtibvzn/image/upload/v1776489180/thinkscope/rfjxaypw68ncjyc5plbz.jpg"
                                alt="Gold Rate Today in India - Live Gold Price Chart and Analysis"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* National Gold Rates */}
            <section className="mb-10 sm:mb-16">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                    {t('gold', 'allIndiaGoldRates')}
                </h2>
                <DynamicGoldRates />
            </section>

            {/* 📅 Gold Rate History - Last 10 Days */}
            <section className="mb-10 sm:mb-16" aria-labelledby="gold-history-heading">
                <div className="flex items-start sm:items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                    <h2 id="gold-history-heading" className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-gray-900">
                        Gold Rate History in India (24K) — Last 10 Days
                    </h2>
                </div>
                <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                    Track the daily movement of 24 Karat gold prices across India. Historical data helps identify trends and pick the right time to buy or invest.
                </p>
                <GoldHistoryTable city="India" carat="24k" />
            </section>

            {/* 🪙 Gold News */}
            <GoldNewsSection />

            {/* 📈 Gold Price Trend Chart */}
            <section className="mb-10 sm:mb-16" aria-labelledby="gold-chart-heading">
                <div className="flex items-start sm:items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                    <h2 id="gold-chart-heading" className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-gray-900">
                        Gold Price Trend Chart (24K)
                    </h2>
                </div>
                <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                    Visual representation of gold price movement over recent days. Use this chart to identify buying opportunities and understand market direction.
                </p>
                <DynamicGoldChart carat="24k" city="India" />
            </section>

            {/* 📈 Historical Gold Prices — 62 Years of Data */}
            <GoldPriceHistoryChart />

            {/* 🌍 What Affects Gold Prices in India? */}
            <section className="mb-10 sm:mb-16">
                <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 sm:p-6 md:p-10">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 sm:mb-6 flex items-start sm:items-center gap-2">
                        <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        What Affects Gold Prices in India?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {[
                            { icon: '🌐', title: 'International Gold Prices', desc: 'Global benchmark prices on COMEX and London markets directly influence Indian gold rates.' },
                            { icon: '💱', title: 'USD to INR Exchange Rate', desc: 'A weaker rupee makes imported gold more expensive, pushing domestic prices higher.' },
                            { icon: '📈', title: 'Inflation & Interest Rates', desc: 'Higher inflation often drives investors toward gold as a hedge, increasing demand.' },
                            { icon: '⚔️', title: 'Geopolitical Tensions', desc: 'Wars, trade conflicts, and political instability push gold prices up as a safe haven.' },
                            { icon: '🎉', title: 'Festival & Wedding Demand', desc: 'Seasonal spikes during Dhanteras, Akshaya Tritiya, and wedding season impact prices.' },
                            { icon: '🏦', title: 'RBI & Central Bank Policies', desc: 'Reserve Bank gold purchases and monetary policy adjustments affect domestic rates.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-amber-100 hover:shadow-md transition-shadow">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 📈 Current Gold Market Trend */}
            <section className="mb-10 sm:mb-16">
                <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 md:p-10">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 sm:mb-5 flex items-start sm:items-center gap-2">
                        <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        Current Gold Market Trend
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                            Gold prices have shown strong upward movement in recent months, supported by global uncertainty and weakening currency trends. However, short-term volatility remains high, making it important for buyers to track trends rather than react to daily changes.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                            <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                <p className="text-sm text-gray-500 mb-1">Trend Direction</p>
                                <p className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                                    <TrendingUp className="h-5 w-5" /> Bullish
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                <p className="text-sm text-gray-500 mb-1">Volatility</p>
                                <p className="text-xl font-bold text-amber-600">High</p>
                            </div>
                            <div className="bg-white/80 rounded-xl p-5 text-center border border-emerald-100">
                                <p className="text-sm text-gray-500 mb-1">Outlook</p>
                                <p className="text-xl font-bold text-blue-600">Track Before Buying</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ⚖️ Gold vs Silver Comparison */}
            <section className="mb-10 sm:mb-16">
                <div className="card bg-gradient-to-r from-amber-50 via-white to-gray-100 border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-10">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4 sm:mb-5 flex items-start sm:items-center gap-2">
                        <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        Gold vs Silver: Quick Comparison
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Gold and silver are both popular precious metal investments in India, but they serve different purposes. While gold is a traditional safe-haven asset, silver has significant industrial demand that affects its pricing differently.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="px-4 py-3 text-left rounded-tl-lg">Factor</th>
                                    <th className="px-4 py-3 text-center">🥇 Gold</th>
                                    <th className="px-4 py-3 text-center rounded-tr-lg">🥈 Silver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Volatility', 'Low–Medium', 'High'],
                                    ['Industrial Use', 'Limited', 'Very High (Solar, Electronics)'],
                                    ['Investment Type', 'Safe Haven', 'Growth + Industrial'],
                                    ['Liquidity', 'Very High', 'High'],
                                    ['Storage', 'Easy (High value per gram)', 'Bulky (Lower value per gram)'],
                                    ['10-Year CAGR (India)', '~12-14%', '~10-13%'],
                                    ['Best For', 'Long-term stability', 'Higher risk-reward'],
                                ].map(([factor, gold, silver], i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 font-medium text-gray-900">{factor}</td>
                                        <td className="px-4 py-3 text-center text-amber-700 font-medium">{gold}</td>
                                        <td className="px-4 py-3 text-center text-gray-600 font-medium">{silver}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4 items-center">
                        <Link
                            href="/gold-vs-silver"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg"
                        >
                            📊 View Full Gold vs Silver Analysis
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/silver-rate"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            View Silver Rates →
                        </Link>
                    </div>
                </div>
            </section>

            {/* City-wise Gold Rates — Live Table */}
            <CityGoldRatesTable />

            {/* Features */}
            <section className="mb-10 sm:mb-16">
                <h2 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                    {t('gold', 'whyChoose')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    <div className="card text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('gold', 'realTimeUpdates')}</h3>
                        <p className="text-gray-600">{t('gold', 'realTimeUpdatesDesc')}</p>
                    </div>
                    <div className="card text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('gold', 'citySpecificRates')}</h3>
                        <p className="text-gray-600">{t('gold', 'citySpecificRatesDesc')}</p>
                    </div>
                    <div className="card text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calculator className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('gold', 'goldCalculator')}</h3>
                        <p className="text-gray-600">{t('gold', 'goldCalculatorDesc')}</p>
                    </div>
                </div>
            </section>

            {/* SEO Content */}
            <article className="card mb-12">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                    {t('gold', 'understandingGoldRates')}
                </h2>
                <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                    <p>{t('gold', 'goldRatesIntro')}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-6">{t('gold', 'goldPurityStandards')}</h3>
                    <ul className="list-disc list-inside space-y-2">
                        <li>{t('gold', 'gold24k')}</li>
                        <li>{t('gold', 'gold22k')}</li>
                        <li>{t('gold', 'gold18k')}</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-900 mt-6">{t('gold', 'whyGoldRatesVary')}</h3>
                    <p>{t('gold', 'goldRatesVaryDesc')}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-6">{t('gold', 'bestTimeToBuy')}</h3>
                    <p>{t('gold', 'bestTimeToBuyDesc')}</p>
                </div>
            </article>

            {/* Investment Guide - Additional Authority Content */}
            <article className="card mb-8 sm:mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    💡 Gold Investment Guide for 2026
                </h2>
                <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                    <p>
                        Whether you&apos;re buying gold for jewellery, investment, or hedging against inflation, understanding the different ways to invest in gold is essential for maximizing returns.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                        <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Physical Gold</h3>
                            <p className="text-sm text-gray-600">
                                Traditional gold coins, bars, and jewellery. Most popular in India but includes making charges and storage costs.
                            </p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gold ETFs</h3>
                            <p className="text-sm text-gray-600">
                                Exchange-traded funds that track gold prices. No storage hassle, highly liquid, and available on stock exchanges.
                            </p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sovereign Gold Bonds (SGB)</h3>
                            <p className="text-sm text-gray-600">
                                Government-backed bonds offering 2.5% annual interest plus gold price appreciation. Best for long-term investors.
                            </p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-5 border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Gold</h3>
                            <p className="text-sm text-gray-600">
                                Buy gold online starting from ₹1. Available through platforms like Google Pay, PhonePe, and Paytm.
                            </p>
                        </div>
                    </div>
                </div>
            </article>

            {/* 📋 About Our Data */}
            <aside className="card mb-12 bg-amber-50/50 border-amber-200">
                <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">📋</span>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">About Our Data</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Gold rates on gpaisa.in are sourced from MCX (Multi Commodity Exchange) and IBJA (India Bullion and Jewellers Association) data feeds, updated every market hour on weekdays. Rates reflect the spot price and may vary from retail jeweller prices due to making charges and local taxes.
                        </p>
                    </div>
                </div>
            </aside>

            {/* ❓ Frequently Asked Questions */}
            <section className="card mb-12" id="faq" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                    ❓ Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {[
                        {
                            q: 'Why is gold rate different in Delhi vs Mumbai?',
                            a: 'Gold prices vary by city due to local state taxes, transportation costs, and jeweller association rates. The base price (MCX) is the same nationally, but making charges and local levies differ.'
                        },
                        {
                            q: 'What is 916 gold?',
                            a: '916 gold means 91.6% purity — this is 22 Karat gold. The number 916 comes from 22/24 × 1000 = 916.6. It is the most common purity used in Indian jewellery.'
                        },
                        {
                            q: 'How is GST charged on gold purchases?',
                            a: 'GST on gold is 3% on the value of gold plus making charges. An additional 5% GST applies on making charges separately.'
                        },
                        {
                            q: 'What is the best time to buy gold in India?',
                            a: 'Historically, gold prices dip slightly after major festivals like Dhanteras and Akshaya Tritiya when demand falls. However, tracking global USD/gold trends matters more than seasonal patterns for investment buying.'
                        },
                        {
                            q: 'What is the difference between 24K and 22K gold?',
                            a: '24K gold is 99.9% pure and is used for coins and bars — not jewellery as it is too soft. 22K gold is 91.6% pure, alloyed with copper or silver for hardness, and is the standard for Indian jewellery.'
                        },
                        {
                            q: 'Where do gold rates in India come from?',
                            a: 'Indian gold rates are benchmarked to the London Bullion Market Association (LBMA) international price, converted to INR using the USD/INR rate, then adjusted for import duty (15%) and GST.'
                        },
                        {
                            q: 'Is it better to buy physical gold, Gold ETF, or Sovereign Gold Bond?',
                            a: 'For long-term investors, SGBs are best — they offer 2.5% annual interest plus gold price appreciation with no capital gains tax on maturity. Gold ETFs suit liquidity-focused investors. Physical gold is best for jewellery or gifting purposes.'
                        },
                    ].map((item, i) => (
                        <details key={i} className="group bg-gray-50 rounded-xl border border-gray-100 overflow-hidden" open={i === 0}>
                            <summary className="cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 text-sm sm:text-base flex items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">Q</span>
                                <span className="flex-1">{item.q}</span>
                                <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform text-lg">▼</span>
                            </summary>
                            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-9">{item.a}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </section>


            {/* CTA */}
            <div className="text-center card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3">
                    {t('gold', 'stayUpdated')}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">{t('gold', 'stayUpdatedDesc')}</p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                    <Link href="/commodities" className="inline-block bg-primary-600 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base">
                        {t('gold', 'viewAllCommodityPrices')}
                    </Link>
                    <Link href="/gold-vs-silver" className="inline-block bg-amber-500 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors text-sm sm:text-base">
                        Gold vs Silver Analysis →
                    </Link>
                </div>
            </div>
        </div>
    );
}
