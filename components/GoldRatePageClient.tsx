'use client';

import { MapPin, TrendingUp, Calculator, Globe, BarChart3, ArrowRight, Scale } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import { useLanguage } from '@/lib/i18n';

const CITIES = ["Delhi", "Chennai", "Mumbai", "Pune", "Hyderabad", "Bangalore", "Coimbatore", "Kolkata", "Ahmedabad", "Kerala"];

export default function GoldRatePageClient() {
    const { t } = useLanguage();

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                    {t('gold', 'goldRateTodayIndia')}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {t('gold', 'goldRateSubtitle')}
                </p>
            </header>

            {/* 📊 Gold Rate Today in India - SEO Authority Section */}
            <section className="mb-16">
                <div className="card bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-8 md:p-10">
                            <h2 className="text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
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
            <section className="mb-16">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
                    {t('gold', 'allIndiaGoldRates')}
                </h2>
                <DynamicGoldRates />
            </section>

            {/* 🌍 What Affects Gold Prices in India? */}
            <section className="mb-16">
                <div className="card bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-8 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Globe className="h-7 w-7 text-amber-600" />
                        What Affects Gold Prices in India?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <section className="mb-16">
                <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <BarChart3 className="h-7 w-7 text-emerald-600" />
                        Current Gold Market Trend
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Gold prices have shown strong upward movement in recent months, supported by global uncertainty and weakening currency trends. However, short-term volatility remains high, making it important for buyers to track trends rather than react to daily changes.
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
            <section className="mb-16">
                <div className="card bg-gradient-to-r from-amber-50 via-white to-gray-100 border border-gray-200 rounded-2xl p-8 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <Scale className="h-7 w-7 text-amber-600" />
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

            {/* City-wise Gold Rates */}
            <section className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                        {t('gold', 'cityWiseGoldRates')}
                    </h2>
                    <p className="text-gray-600">
                        {t('gold', 'cityWiseSubtitle')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CITIES.map((city) => (
                        <Link key={city} href={`/gold-rate/${city.toLowerCase()}`} className="card hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary-100 p-3 rounded-full group-hover:bg-primary-600 transition-colors">
                                    <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{city}</h3>
                                    <p className="text-sm text-gray-600">{t('gold', 'viewLiveGoldRates')}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="mb-16">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-8 text-center">
                    {t('gold', 'whyChoose')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <article className="card mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💡 Gold Investment Guide for 2026
                </h2>
                <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                    <p>
                        Whether you&apos;re buying gold for jewellery, investment, or hedging against inflation, understanding the different ways to invest in gold is essential for maximizing returns.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

            {/* CTA */}
            <div className="text-center card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                    {t('gold', 'stayUpdated')}
                </h3>
                <p className="text-gray-700 mb-6">{t('gold', 'stayUpdatedDesc')}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/commodities" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        {t('gold', 'viewAllCommodityPrices')}
                    </Link>
                    <Link href="/gold-vs-silver" className="inline-block bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                        Gold vs Silver Analysis →
                    </Link>
                </div>
            </div>
        </div>
    );
}
