import { Metadata } from 'next';
import GoldHistoryTable from '@/components/GoldHistoryTable';
import GoldCalculator from '@/components/GoldCalculator';
import CityWiseGoldRates from '@/components/CityWiseGoldRates';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import DynamicGoldChart from '@/components/DynamicGoldChart';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { fetchGoldRatesAllCarats } from '@/lib/angelOneApi';
import { Coins, History } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Live Gold & Silver Rates, Commodity Prices Today | gpaisa.in',
    description: 'Check today\'s gold rates (24K, 22K, 18K) and silver prices across India. Updated in real-time.',
    openGraph: {
        title: 'Live Gold & Silver Rates, Commodity Prices Today',
        description: 'Check today\'s gold rates (24K, 22K, 18K) and silver prices across India. Updated in real-time.',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/commodities'
    }
};

export const dynamic = 'force-static'; // Static page with client-side data fetching

export default async function CommoditiesPage() {
    const goldRates = await fetchGoldRatesAllCarats();
    // Generate JSON-LD structured data for gold rates
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Gold & Commodity Rates",
        "description": "Live gold rates (24K, 22K, 18K), silver prices, and commodity rates across India",
        "url": "https://www.gpaisa.in/commodities",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Gold Rates in India",
            "description": "Current gold rates for different purities",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "24K Gold Rate",
                    "description": "99.9% pure gold rate per 10 grams"
                },
                {
                    "@type": "Offer",
                    "name": "22K Gold Rate",
                    "description": "91.67% pure gold rate per 10 grams"
                },
                {
                    "@type": "Offer",
                    "name": "18K Gold Rate",
                    "description": "75% pure gold rate per 10 grams"
                }
            ]
        }
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Gold & Commodities</h1>
                        <p className="text-lg text-gray-600">Live gold, silver, and commodity prices across India</p>
                    </header>

                    {/* Gold Rates */}
                    <section className="mb-12" aria-labelledby="gold-rates-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <Coins className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="gold-rates-heading" className="text-2xl font-display font-semibold text-gray-900">Gold Rates</h2>
                        </div>
                        <DynamicGoldRates initialRates={goldRates} initialLastUpdated={goldRates.length ? new Date().toISOString() : null} />
                    </section>

                    {/* Gold Calculator */}
                    <section className="mb-12" aria-labelledby="gold-calculator-heading">
                        <GoldCalculator />
                    </section>

                    {/* Gold History */}
                    <section className="mb-12" aria-labelledby="gold-history-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <History className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="gold-history-heading" className="text-2xl font-display font-semibold text-gray-900">Gold Rate History (24K)</h2>
                        </div>
                        <GoldHistoryTable city="India" carat="24k" />
                    </section>

                    {/* Gold Chart - Powered by History API */}
                    <section className="mb-12" aria-labelledby="gold-chart-heading">
                        <DynamicGoldChart carat="24k" city="India" />
                    </section>

                    {/* City-Wise Gold Rates */}
                    <section className="mb-12" aria-labelledby="city-rates-heading">
                        <CityWiseGoldRates />
                    </section>

                    {/* Information Box */}
                    <aside className="mt-12 card bg-primary-50 border-primary-200">
                        <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">About Gold Rates</h3>
                        <div className="text-sm text-gray-700 space-y-2">
                            <p>
                                <strong>24K Gold:</strong> 99.9% pure gold, also known as 24 carat gold. This is the purest form of gold available.
                            </p>
                            <p>
                                <strong>22K Gold:</strong> 91.67% pure gold, commonly used for making jewelry in India.
                            </p>
                            <p>
                                <strong>18K Gold:</strong> 75% pure gold, often used for modern and designer jewelry.
                            </p>
                            <p className="text-xs text-gray-600 mt-4">
                                Note: Gold prices vary by city and may include making charges and GST. Always verify with local jewelers.
                            </p>
                        </div>
                    </aside>

                    {/* Last Updated */}
                    <footer className="mt-8 text-center">
                        <LastUpdatedTime />
                    </footer>
                </div>
            </div>
        </>
    );
}
