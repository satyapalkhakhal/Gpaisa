'use client';

import Link from 'next/link';
import { Wheat, MapPin, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { formatStateForUrl } from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import AgricultureFilters from '@/components/AgricultureFilters';

interface MandiPrice {
    state: string;
    district: string;
    market: string;
    commodity: string;
    modal_price: string;
    arrival_date: string;
}

interface AgriculturePageClientProps {
    states: string[];
    commodities: string[];
    records: MandiPrice[];
}

export default function AgriculturePageClient({ states, commodities, records }: AgriculturePageClientProps) {
    const { t } = useLanguage();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Wheat className="w-12 h-12" />
                        <h1 className="text-4xl md:text-5xl font-bold">{t('agriculture', 'kisanMandiPrices')}</h1>
                    </div>
                    <p className="text-xl text-green-100 max-w-3xl">
                        {t('agriculture', 'heroSubtitle')}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Interactive Filters Component */}
                <section className="mb-12">
                    <AgricultureFilters />
                </section>

                {/* SEO: Browse by State */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <MapPin className="w-8 h-8 mr-3 text-green-600" />
                            {t('agriculture', 'browseByState')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {states.map(state => (
                            <Link
                                key={state}
                                href={`/agriculture/${formatStateForUrl(state)}`}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                    {state}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{t('agriculture', 'viewAllMandis')}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* SEO: Browse by Commodity */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                            {t('agriculture', 'browseByCommCrop')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {commodities.map(crop => (
                            <Link
                                key={crop}
                                href={`/agriculture/crop/${crop.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100 transition-colors group"
                            >
                                <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700">{crop}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Latest Mandi Prices */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('agriculture', 'latestMandiPrices')}</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('agriculture', 'state')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('agriculture', 'district')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('agriculture', 'market')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('agriculture', 'commodity')}</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">{t('agriculture', 'modalPrice')}</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">{t('agriculture', 'date')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {records.map((price, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/agriculture/${formatStateForUrl(price.state)}`}
                                                    className="text-green-700 hover:underline font-medium"
                                                >
                                                    {price.state}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/agriculture/${formatStateForUrl(price.state)}/${price.district.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="text-gray-700 hover:text-green-700 hover:underline"
                                                >
                                                    {price.district}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{price.market}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/agriculture/crop/${price.commodity.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="font-medium text-gray-900 hover:text-green-700 hover:underline"
                                                >
                                                    {price.commodity}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right font-bold text-green-700">
                                                ₹{price.modal_price}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{price.arrival_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('agriculture', 'seoHeading')}</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                        <p>{t('agriculture', 'seoContent1')}</p>
                        <p>{t('agriculture', 'seoContent2')}</p>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="text-center border-t pt-8">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-500 mt-2">
                        {t('agriculture', 'dataSource')}
                    </p>
                </div>
            </div>
        </div>
    );
}
