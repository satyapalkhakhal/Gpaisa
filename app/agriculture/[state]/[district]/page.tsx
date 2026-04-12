import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building2, TrendingUp } from 'lucide-react';
import {
    getStates,
    getDistrictsByState,
    getMandisByDistrict,
    fetchMandiPrices,
    formatStateForUrl,
    formatStateFromUrl
} from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';

// Force dynamic rendering to avoid build-time API failures
// Cache for 1 hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ state: string; district: string }> }): Promise<Metadata> {
    const { state: urlState, district: urlDistrict } = await params;
    const stateName = formatStateFromUrl(urlState);
    const districtName = urlDistrict
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        title: `${districtName} Mandi Prices ${stateName} - Agriculture Rates by Market | Gpaisa`,
        description: `Today's mandi prices in ${districtName}, ${stateName}. Market-wise agricultural commodity rates updated daily.`,
        openGraph: {
            title: `${districtName} Mandi Prices - ${stateName}`,
            description: `Live mandi prices for crops in ${districtName}, ${stateName}`
        }
    };
}

export default async function DistrictPage({ params }: { params: Promise<{ state: string; district: string }> }) {
    const { state: urlState, district: urlDistrict } = await params;
    const stateName = formatStateFromUrl(urlState);
    const districtName = urlDistrict
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Fetch data
    const [allStates, districts, mandis, districtPrices] = await Promise.all([
        getStates(),
        getDistrictsByState(stateName),
        getMandisByDistrict(stateName, districtName),
        fetchMandiPrices({ state: stateName, district: districtName, limit: 50 })
    ]);

    // Validate state and district
    if (!allStates.includes(stateName)) {
        notFound();
    }

    // Get crops in this district
    const crops = [...new Set(districtPrices.records.map(r => r.commodity))];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb & Header */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="text-sm mb-4">
                        <Link href="/agriculture" className="text-green-600 hover:underline">Agriculture</Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <Link href={`/agriculture/${urlState}`} className="text-green-600 hover:underline">
                            {stateName}
                        </Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{districtName}</span>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <MapPin className="w-10 h-10 text-green-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{districtName} Mandi Prices</h1>
                            <p className="text-gray-600 mt-1">{stateName} - Agriculture commodity prices across {districtName} markets</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Mandis Grid */}
                {mandis.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <Building2 className="w-8 h-8 mr-3 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Markets in {districtName}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {mandis.map(mandi => (
                                <Link
                                    key={mandi}
                                    href={`/agriculture/${urlState}/${urlDistrict}/${mandi.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all group"
                                >
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                        {mandi}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">View prices →</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Crops in District */}
                {crops.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Crops Traded in {districtName}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {crops.map(crop => (
                                <div
                                    key={crop}
                                    className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                                >
                                    <p className="font-semibold text-gray-900 text-sm">{crop}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Comprehensive Price Table */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Latest Mandi Prices in {districtName}
                    </h2>

                    {districtPrices.records.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-700 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Market</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Commodity</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Variety</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Min Price (₹)</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Max Price (₹)</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Modal Price (₹)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {districtPrices.records.map((price, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm">
                                                    <Link
                                                        href={`/agriculture/${urlState}/${urlDistrict}/${price.market.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="text-green-700 hover:underline font-medium"
                                                    >
                                                        {price.market}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{price.commodity}</td>
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
                            <p className="text-gray-500">No price data available for {districtName} at the moment.</p>
                            <p className="text-sm text-gray-400 mt-2">Please check back later or select another district.</p>
                        </div>
                    )}
                </section>

                {/* Price Information */}
                <section className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Understanding Mandi Prices</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                            <span className="font-bold text-gray-900">Min Price:</span>
                            <p>Lowest trading price for the commodity</p>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">Max Price:</span>
                            <p>Highest trading price for the commodity</p>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900">Modal Price:</span>
                            <p>Most common/average trading price</p>
                        </div>
                    </div>
                </section>

                {/* District Overview - SEO Content */}
                <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {districtName} Agricultural Markets</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            {districtName} district in {stateName} has {mandis.length} active agricultural markets (mandis)
                            where farmers and traders trade various commodities. The district is known for growing
                            {crops.slice(0, 3).join(', ')} {crops.length > 3 && 'and other crops'}.
                        </p>
                        <p className="mt-4">
                            Browse the mandis below to find specific market prices, or view the comprehensive price list
                            for all commodities traded in {districtName} markets.
                        </p>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="text-center border-t pt-8 mt-8">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-500 mt-2">
                        Data for {districtName}, {stateName} from Government of India
                    </p>
                </div>
            </div>
        </div>
    );
}
