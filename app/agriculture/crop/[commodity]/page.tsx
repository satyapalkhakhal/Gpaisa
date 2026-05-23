import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrendingUp, MapPin } from 'lucide-react';
import { COMMON_COMMODITIES } from '@/lib/constants';
import { fetchMandiPrices, formatStateForUrl } from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';

export async function generateStaticParams() {
    return [...COMMON_COMMODITIES].map(commodity => ({
        commodity: commodity.toLowerCase().replace(/\s+/g, '-')
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ commodity: string }> }): Promise<Metadata> {
    const { commodity: urlCommodity } = await params;
    const commodityName = urlCommodity
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        title: `Rate of ${commodityName} Today - ${commodityName} Kisan Mandi Prices India | Gpaisa`,
        description: `Check rate of ${commodityName} today across all states and mandis in India. Latest wholesale kisan mandi rates for ${commodityName} updated daily.`,
        openGraph: {
            title: `Rate of ${commodityName} Today - Kisan Mandi Prices India`,
            description: `Live rate of ${commodityName} today across Indian kisan mandis`
        },
        robots: {
            index: false,
            follow: false
        }
    };
}

export const revalidate = 86400;

export default async function CommodityPage({ params }: { params: Promise<{ commodity: string }> }) {
    const { commodity: urlCommodity } = await params;
    const commodityName = urlCommodity
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Validate commodity
    const validCommodities = [...COMMON_COMMODITIES].map(c => c.toLowerCase().replace(/\s+/g, '-'));
    if (!validCommodities.includes(urlCommodity)) {
        notFound();
    }

    // Fetch prices for this commodity
    const commodityPrices = await fetchMandiPrices({ commodity: commodityName, limit: 100 });

    // Get unique states where this commodity is traded
    const states = [...new Set(commodityPrices.records.map(r => r.state))].sort();

    // Calculate average price
    const avgPrice = commodityPrices.records.length > 0
        ? Math.round(commodityPrices.records.reduce((sum, r) => sum + parseFloat(r.modal_price || '0'), 0) / commodityPrices.records.length)
        : 0;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb & Header */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="text-sm mb-4">
                        <Link href="/agriculture" className="text-green-600 hover:underline">Agriculture</Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <Link href="/agriculture" className="text-green-600 hover:underline">Crops</Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{commodityName}</span>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <TrendingUp className="w-10 h-10 text-green-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Rate of {commodityName} Today in India</h1>
                            <p className="text-gray-600 mt-1">Latest kisan mandi rates across all states</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Overview Card */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Average Price</div>
                        <div className="text-3xl font-bold text-green-700">₹{avgPrice.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-gray-500 mt-1">per quintal</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Trading States</div>
                        <div className="text-3xl font-bold text-gray-900">{states.length}</div>
                        <div className="text-xs text-gray-500 mt-1">across India</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Active Markets</div>
                        <div className="text-3xl font-bold text-gray-900">{commodityPrices.records.length}</div>
                        <div className="text-xs text-gray-500 mt-1">mandis reporting</div>
                    </div>
                </div>

                {/* States Trading This Commodity */}
                {states.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <MapPin className="w-8 h-8 mr-3 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">
                                States Trading {commodityName}
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {states.map(state => (
                                <Link
                                    key={state}
                                    href={`/agriculture/${formatStateForUrl(state)}`}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all group"
                                >
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 text-sm">
                                        {state}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">View prices →</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Price Table */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Today&apos;s {commodityName} Rate by Market
                    </h2>

                    {commodityPrices.records.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">State</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">District</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Market</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Variety</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Min Price (₹)</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Max Price (₹)</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Modal Price (₹)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {commodityPrices.records.map((price, idx) => (
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
                                                <td className="px-6 py-4 text-sm text-gray-600">{price.variety || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-right text-gray-700">{price.min_price}</td>
                                                <td className="px-6 py-4 text-sm text-right text-gray-700">{price.max_price}</td>
                                                <td className="px-6 py-4 text-sm text-right font-bold text-green-700">
                                                    {price.modal_price}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{price.arrival_date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <p className="text-gray-500">No price data available for {commodityName} at the moment.</p>
                        </div>
                    )}
                </section>

                {/* SEO Content */}
                <section className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Rate of {commodityName} Today – Kisan Mandi Prices
                    </h2>
                    <p className="text-gray-700">
                        Looking for the rate of {commodityName} today? {commodityName} is traded across {states.length} states in India
                        with active kisan mandis in major agricultural regions. The prices shown above reflect today&apos;s
                        {commodityName} rate sourced from Agricultural Produce Market Committees (APMCs) and updated daily.
                        Farmers and traders can use this data to check the latest {commodityName} rate today and make informed
                        decisions about when and where to trade {commodityName}.
                    </p>
                </section>

                {/* Last Updated */}
                <div className="text-center border-t pt-8 mt-8">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-500 mt-2">
                        {commodityName} price data from Government of India
                    </p>
                </div>
            </div>
        </div>
    );
}
