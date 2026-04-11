'use client';

import { MapPin, TrendingUp, Calculator } from 'lucide-react';
import Link from 'next/link';
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

            {/* National Gold Rates */}
            <section className="mb-16">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
                    {t('gold', 'allIndiaGoldRates')}
                </h2>
                <DynamicGoldRates />
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

            {/* CTA */}
            <div className="text-center card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                    {t('gold', 'stayUpdated')}
                </h3>
                <p className="text-gray-700 mb-6">{t('gold', 'stayUpdatedDesc')}</p>
                <Link href="/commodities" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    {t('gold', 'viewAllCommodityPrices')}
                </Link>
            </div>
        </div>
    );
}
