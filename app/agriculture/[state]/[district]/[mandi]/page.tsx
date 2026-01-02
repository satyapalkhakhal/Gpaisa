import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, TrendingUp } from 'lucide-react';
import { getMandisByDistrict, fetchMandiPrices, formatStateForUrl, formatStateFromUrl } from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';

export async function generateStaticParams() {
    // Generate params for a limited set for build performance
    // In production, you might want to generate all or use ISR
    return [];
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; district: string; mandi: string }> }): Promise<Metadata> {
    const { state: urlState, district: urlDistrict, mandi: urlMandi } = await params;
    const stateName = formatStateFromUrl(urlState);
    const districtName = urlDistrict.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const mandiName = urlMandi.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        title: `${mandiName} Mandi Prices - ${districtName}, ${stateName} | Gpaisa`,
        description: `Live mandi prices from ${mandiName} market in ${districtName}, ${stateName}. Today's wholesale agricultural commodity rates updated daily.`,
        keywords: [`${mandiName} mandi prices`, `${districtName} agriculture`, `${stateName} crop rates`],
        openGraph: {
            title: `${mandiName} Mandi Prices - ${districtName}, ${stateName}`,
            description: `Live agricultural commodity prices from ${mandiName} market`
        }
    };
}

export const revalidate = 86400;
export const dynamicParams = true; // Allow dynamic params for ISR

export default async function MandiPage({ params }: { params: Promise<{ state: string; district: string; mandi: string }> }) {
    const { state: urlState, district: urlDistrict, mandi: urlMandi } = await params;
    const stateName = formatStateFromUrl(urlState);
    const districtName = urlDistrict.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const mandiName = urlMandi.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Fetch prices for this specific mandi
    const mandiPrices = await fetchMandiPrices({
        state: stateName,
        district: districtName,
        market: mandiName,
        limit: 100
    });

    // If no data found, show 404
    if (mandiPrices.records.length === 0) {
        notFound();
    }

    // Get unique commodities traded in this mandi
    const commodities = [...new Set(mandiPrices.records.map(r => r.commodity))].sort();

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
                        <Link href={`/agriculture/${urlState}/${urlDistrict}`} className="text-green-600 hover:underline">
                            {districtName}
                        </Link>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-gray-900 font-medium">{mandiName}</span>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Building2 className="w-10 h-10 text-green-600" />
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{mandiName} Mandi</h1>
                            <p className="text-gray-600 mt-1">{districtName}, {stateName} - Agricultural Market Prices</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Market Overview */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Commodities Traded</div>
                        <div className="text-3xl font-bold text-gray-900">{commodities.length}</div>
                        <div className="text-xs text-gray-500 mt-1">different crops</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Active Listings</div>
                        <div className="text-3xl font-bold text-gray-900">{mandiPrices.records.length}</div>
                        <div className="text-xs text-gray-500 mt-1">price records</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-sm text-gray-600 mb-1">Location</div>
                        <div className="text-lg font-bold text-gray-900">{districtName}</div>
                        <div className="text-xs text-gray-500 mt-1">{stateName}</div>
                    </div>
                </div>

                {/* Commodities Traded */}
                {commodities.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                            <h2 className="text-3xl font-bold text-gray-900">Commodities Traded</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {commodities.map(commodity => (
                                <Link
                                    key={commodity}
                                    href={`/agriculture/crop/${commodity.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="bg-green-50 border border-green-200 rounded-lg p-3 text-center hover:bg-green-100 transition-colors group"
                                >
                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700">{commodity}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Current Prices */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Current Prices at {mandiName}
                    </h2>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Commodity</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Variety</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Min Price (₹)</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Max Price (₹)</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Modal Price (₹)</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {mandiPrices.records.map((price, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={`/agriculture/crop/${price.commodity.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="font-medium text-gray-900 hover:text-green-700 hover:underline"
                                                >
                                                    {price.commodity}
                                                </Link>
                                            </td>
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
                </section>

                {/* Market Information */}
                <section className="bg-blue-50 rounded-lg p-6 mb-12">
                    <h3 className="font-bold text-gray-900 mb-3">About {mandiName} Market</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p>
                            {mandiName} is an agricultural market (mandi) located in {districtName} district, {stateName}.
                            The market facilitates trade of {commodities.length} different commodities and serves as an important
                            marketplace for farmers and traders in the region.
                        </p>
                        <p>
                            All prices are sourced from the Government of India&apos;s APMC data and are updated daily.
                            The modal price represents the most common trading price for each commodity.
                        </p>
                    </div>
                </section>

                {/* Price Information */}
                <section className="bg-white rounded-lg p-6">
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

                {/* Last Updated */}
                <div className="text-center border-t pt-8 mt-8">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-500 mt-2">
                        Market data from {mandiName}, {districtName}, {stateName}
                    </p>
                </div>
            </div>
        </div>
    );
}
