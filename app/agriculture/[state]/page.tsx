import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Building2, TrendingUp } from 'lucide-react';
import {
    getStates,
    getDistrictsByState,
    fetchMandiPrices,
    formatStateForUrl,
    formatStateFromUrl
} from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';

export async function generateStaticParams() {
    const states = await getStates();
    return states.map(state => ({
        state: formatStateForUrl(state)
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
    const { state: urlState } = await params;
    const stateName = formatStateFromUrl(urlState);

    return {
        title: `${stateName} Mandi Prices - Agriculture Commodity Rates by District | Gpaisa`,
        description: `Check today's mandi prices for all crops in ${stateName}. District-wise agricultural commodity rates, wholesale market prices updated daily.`,
        keywords: [`${stateName} mandi prices`, `${stateName} agriculture`, `${stateName} crop rates`, 'mandi prices'],
        openGraph: {
            title: `${stateName} Mandi Prices - Live Agriculture Rates`,
            description: `Real-time mandi prices for crops across ${stateName} districts`
        }
    };
}

export const revalidate = 3600;

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
    const { state: urlState } = await params;
    const stateName = formatStateFromUrl(urlState);

    // Fetch data
    const [allStates, districts, statePrices] = await Promise.all([
        getStates(),
        getDistrictsByState(stateName),
        fetchMandiPrices({ state: stateName, limit: 20 })
    ]);

    // Validate state
    if (!allStates.includes(stateName)) {
        notFound();
    }

    // Get top crops in this state
    const topCrops = [...new Set(statePrices.records.map(r => r.commodity))].slice(0, 8);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb & Header */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="text-sm mb-4">
                        <Link href="/agriculture" className="text-green-600 hover:underline">Agriculture</Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{stateName}</span>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <MapPin className="w-10 h-10 text-green-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{stateName} Mandi Prices</h1>
                            <p className="text-gray-600 mt-1">Agriculture commodity prices across {stateName} districts</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Districts Grid */}
                <section className="mb-12">
                    <div className="flex items-center mb-6">
                        <Building2 className="w-8 h-8 mr-3 text-green-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Districts in {stateName}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {districts.map(district => (
                            <Link
                                key={district}
                                href={`/agriculture/${urlState}/${district.toLowerCase().replace(/\s+/g, '-')}`}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                    {district}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">View mandis →</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Top Crops */}
                {topCrops.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Top Crops in {stateName}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {topCrops.map(crop => (
                                <div
                                    key={crop}
                                    className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                                >
                                    <p className="font-semibold text-gray-900">{crop}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Latest Prices Table */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Mandi Prices</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">District</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Market</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Commodity</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Variety</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Min Price</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Max Price</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Modal Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {statePrices.records.map((price, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/agriculture/${urlState}/${price.district.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="text-green-700 hover:underline font-medium"
                                                >
                                                    {price.district}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{price.market}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{price.commodity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{price.variety || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-700">₹{price.min_price}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-700">₹{price.max_price}</td>
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

                {/* State Overview - SEO Content */}
                <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {stateName} Agriculture Markets</h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            {stateName} has {districts.length} major agricultural districts with active mandi systems.
                            The state&apos;s agricultural markets facilitate the trade of various crops including
                            {topCrops.slice(0, 3).join(', ')} and many others. Farmers and traders can access
                            real-time pricing information to make informed trading decisions.
                        </p>
                        <p className="mt-4">
                            Browse by district below to find specific mandi prices in your region, or view the latest
                            commodity prices across all {stateName} markets in the table below.
                        </p>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="text-center border-t pt-8">
                    <LastUpdatedTime />
                </div>
            </div>
        </div>
    );
}
