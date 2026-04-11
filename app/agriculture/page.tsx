import { Metadata } from 'next';
import Link from 'next/link';
import { Wheat, MapPin, TrendingUp } from 'lucide-react';
import { INDIA_STATES, COMMON_COMMODITIES } from '@/lib/constants';
import { fetchMandiPrices, formatStateForUrl } from '@/lib/agriApi';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import AgricultureFilters from '@/components/AgricultureFilters';

export const metadata: Metadata = {
    title: 'Kisan Mandi Prices India - Live Crop Rates by State & District | Gpaisa',
    description: 'Check rate of wheat today and all crop mandi prices across India. State-wise, district-wise kisan mandi rates updated daily from government sources.',
    keywords: ['mandi prices', 'rate of wheat today', 'kisan mandi', 'crop rates today', 'wheat rate today', 'agriculture prices', 'farmer prices', 'wholesale market prices', 'India agriculture'],
    openGraph: {
        title: 'Live Kisan Mandi Prices - India',
        description: 'Check rate of wheat today & real-time kisan mandi prices for crops across all states and districts in India',
        type: 'website',
    },
    alternates: {
        canonical: 'https://gpaisa.in/agriculture'
    }
};

export const revalidate = 86400; // Revalidate every 24 hours

export default async function AgriculturePage() {
    // Fetch latest prices for display
    const latestPrices = await fetchMandiPrices({ limit: 20 });

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Wheat className="w-12 h-12" />
                        <h1 className="text-4xl md:text-5xl font-bold">Kisan Mandi Prices</h1>
                    </div>
                    <p className="text-xl text-green-100 max-w-3xl">
                        Check rate of wheat today and access real-time kisan mandi prices for all agricultural commodities across India.
                        Updated daily from official government sources.
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
                            Browse by State
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...INDIA_STATES].map(state => (
                            <Link
                                key={state}
                                href={`/agriculture/${formatStateForUrl(state)}`}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all group"
                            >
                                <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                    {state}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">View all mandis →</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* SEO: Browse by Commodity */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                            Browse by Crop/Commodity
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...COMMON_COMMODITIES].map(crop => (
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Mandi Prices</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-700 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">State</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">District</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Market</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Commodity</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold">Modal Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {latestPrices.records.map((price, idx) => (
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate of Wheat Today &amp; Kisan Mandi Prices in India</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                        <p>
                            Looking for the rate of wheat today? Our kisan mandi platform provides live wholesale prices
                            for wheat, rice, onion, potato, cotton, and all major agricultural commodities across India.
                            Mandi prices (APMC rates) represent the wholesale rates at which farmers and traders buy and
                            sell crops in government-regulated markets.
                        </p>
                        <p>
                            Whether you want to check today&apos;s wheat rate, rice price, or any other crop rate today,
                            simply browse by state or search by commodity to compare kisan mandi prices across different
                            states and districts. All data is sourced from the Government of India&apos;s Open Data Portal and updated daily.
                        </p>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="text-center border-t pt-8">
                    <LastUpdatedTime />
                    <p className="text-xs text-gray-500 mt-2">
                        Data Source: Government of India Open Data Platform
                    </p>
                </div>
            </div>
        </div>
    );
}
