import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import GoldCalculator from '@/components/GoldCalculator';
import GoldHistoryTable from '@/components/GoldHistoryTable';
import DynamicGoldChart from '@/components/DynamicGoldChart';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { IndianCity } from '@/types';
import { Coins, MapPin, Calculator, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const CITIES: IndianCity[] = [
    "Delhi",
    "Chennai",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Bangalore",
    "Coimbatore",
    "Kolkata",
    "Ahmedabad",
    "Kerala"
];

// Generate static params for all cities
export async function generateStaticParams() {
    return CITIES.map((city) => ({
        city: city.toLowerCase(),
    }));
}

// Generate metadata for each city
export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const params = await props.params;
    const cityName = params.city.charAt(0).toUpperCase() + params.city.slice(1);

    // Validate city
    if (!CITIES.map(c => c.toLowerCase()).includes(params.city.toLowerCase())) {
        return {
            title: 'City Not Found | gpaisa.in',
        };
    }

    // Comprehensive SEO keywords for the city
    const keywords = [
        // Primary keywords
        `gold rate today ${params.city}`,
        `gold price in ${params.city} today`,
        `${params.city} gold rate`,
        `today gold rate in ${params.city}`,

        // Purity-specific keywords
        `24k gold rate in ${params.city}`,
        `22k gold rate in ${params.city}`,
        `18k gold rate in ${params.city}`,
        `916 gold rate ${params.city}`,
        `999 gold rate ${params.city}`,

        // Weight-specific keywords
        `1 gram gold rate in ${params.city}`,
        `10 gram gold price ${params.city}`,
        `8 gram gold rate ${params.city}`,

        // Long-tail keywords
        `gold rate today in ${params.city} 22 carat`,
        `gold rate today in ${params.city} 24 carat`,
        `live gold rate ${params.city}`,
        `today gold rate ${params.city} per gram`,

        // Informational keywords
        `gold price calculator ${params.city}`,
        `gold rate history ${params.city}`,
        `gold rate chart ${params.city}`,

        // General keywords
        'gold rate today',
        'gold price today india',
        'live gold rate',
        'gold rate india'
    ];

    return {
        title: `Gold Rate in ${cityName} Today - 24K, 22K, 18K Live Prices | gpaisa.in`,
        description: `Check today's gold rate in ${cityName} for 24K, 22K and 18K. Live gold prices updated daily with calculator, historical data and price trends. Get accurate ${cityName} gold rates per gram.`,
        keywords: keywords.join(', '),
        openGraph: {
            title: `Gold Rate in ${cityName} Today - 24K, 22K, 18K Live Prices`,
            description: `Check today's gold rate in ${cityName} for 24K, 22K and 18K. Live gold and silver prices with daily updates and charts.`,
            type: 'website',
            url: `https://gpaisa.in/gold-rate/${params.city.toLowerCase()}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `Gold Rate in ${cityName} Today - Live Prices`,
            description: `Check today's gold rate in ${cityName} for 24K, 22K and 18K. Live prices with daily updates.`,
        },
        alternates: {
            canonical: `https://gpaisa.in/gold-rate/${params.city.toLowerCase()}`
        }
    };
}

export default async function CityGoldRatePage(props: { params: Promise<{ city: string }> }) {
    const params = await props.params;
    const cityName = params.city.charAt(0).toUpperCase() + params.city.slice(1);

    // Validate city
    if (!CITIES.map(c => c.toLowerCase()).includes(params.city.toLowerCase())) {
        notFound();
    }

    // JSON-LD structured data for local SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Gold Rate in ${cityName}`,
        "description": `Current gold rates for ${cityName} including 24K, 22K, and 18K gold prices`,
        "url": `https://gpaisa.in/gold-rate/${params.city.toLowerCase()}`,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://gpaisa.in"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Gold Rates",
                    "item": "https://gpaisa.in/commodities"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": cityName,
                    "item": `https://gpaisa.in/gold-rate/${params.city.toLowerCase()}`
                }
            ]
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": `Gold Rates in ${cityName}`,
            "description": `Current gold rates for different purities in ${cityName}`,
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": `24K Gold Rate in ${cityName}`,
                    "description": "99.9% pure gold rate per 10 grams"
                },
                {
                    "@type": "Offer",
                    "name": `22K Gold Rate in ${cityName}`,
                    "description": "91.67% pure gold rate per 10 grams"
                },
                {
                    "@type": "Offer",
                    "name": `18K Gold Rate in ${cityName}`,
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
                    {/* Breadcrumb */}
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                            <li>/</li>
                            <li><Link href="/commodities" className="hover:text-primary-600">Gold Rates</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium">{cityName}</li>
                        </ol>
                    </nav>

                    {/* Page Header */}
                    <header className="mb-8">
                        <div className="flex items-center space-x-3 mb-3">
                            <MapPin className="h-10 w-10 text-primary-600" />
                            <h1 className="text-4xl font-display font-bold text-gray-900">
                                Gold Rate in {cityName} Today
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            Live 24K, 22K, and 18K gold prices in {cityName}. Updated in real-time with historical data and price calculator.
                        </p>
                    </header>

                    {/* Today's Gold Rates */}
                    <section className="mb-12" aria-labelledby="current-rates-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <Coins className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="current-rates-heading" className="text-2xl font-display font-semibold text-gray-900">
                                Today&apos;s Gold Rates in {cityName}
                            </h2>
                        </div>
                        <DynamicGoldRates />
                    </section>

                    {/* Gold Calculator */}
                    <section className="mb-12" aria-labelledby="calculator-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <Calculator className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="calculator-heading" className="text-2xl font-display font-semibold text-gray-900">
                                Gold Price Calculator for {cityName}
                            </h2>
                        </div>
                        <GoldCalculator />
                    </section>

                    {/* Gold Rate History */}
                    <section className="mb-12" aria-labelledby="history-heading">
                        <div className="flex items-center space-x-3 mb-6">
                            <TrendingUp className="h-7 w-7 text-primary-600" aria-hidden="true" />
                            <h2 id="history-heading" className="text-2xl font-display font-semibold text-gray-900">
                                Gold Rate History in {cityName} (24K)
                            </h2>
                        </div>
                        <GoldHistoryTable city={cityName} carat="24k" />
                    </section>

                    {/* Gold Price Trend Chart */}
                    <section className="mb-12" aria-labelledby="chart-heading">
                        <DynamicGoldChart carat="24k" city={cityName} />
                    </section>

                    {/* SEO Content */}
                    <article className="mb-12 card">
                        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                            About Gold Rates in {cityName}
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 mb-4">
                                The gold rate in {cityName} varies daily based on international market trends, currency exchange rates,
                                and local demand-supply dynamics. Our platform provides real-time updates on 24K, 22K, and 18K gold prices
                                to help you make informed decisions.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                Factors Affecting Gold Prices in {cityName}
                            </h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                                <li>International gold prices and global market trends</li>
                                <li>Currency exchange rates (USD to INR)</li>
                                <li>Local demand during festivals and wedding seasons</li>
                                <li>Import duties and GST (Goods and Services Tax)</li>
                                <li>Making charges and jeweler margins</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                Gold Purity Explained
                            </h3>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong className="text-gray-900">24K Gold (99.9% pure):</strong> The purest form of gold,
                                    ideal for investment purposes. Softer and more expensive than other purities.
                                </p>
                                <p>
                                    <strong className="text-gray-900">22K Gold (91.67% pure):</strong> Most popular for jewelry
                                    in India. Offers a good balance between purity and durability.
                                </p>
                                <p>
                                    <strong className="text-gray-900">18K Gold (75% pure):</strong> Commonly used for modern
                                    and designer jewelry. More durable due to higher alloy content.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                How to Buy Gold in {cityName}
                            </h3>
                            <p className="text-gray-700 mb-4">
                                When purchasing gold in {cityName}, always verify the current market rate, check for hallmark
                                certification (BIS), ask for detailed invoices including making charges and GST, and compare
                                prices from multiple jewelers. Our gold calculator helps you estimate the total cost including
                                all charges.
                            </p>
                        </div>
                    </article>

                    {/* Other Cities */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                            Gold Rates in Other Cities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {CITIES.filter(c => c !== cityName).map((city) => (
                                <Link
                                    key={city}
                                    href={`/gold-rate/${city.toLowerCase()}`}
                                    className="card hover:shadow-lg transition-shadow text-center"
                                >
                                    <MapPin className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                                    <p className="font-medium text-gray-900">{city}</p>
                                    <p className="text-xs text-gray-600">View Rates →</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <aside className="card bg-yellow-50 border-yellow-200">
                        <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">Important Note</h3>
                        <p className="text-sm text-gray-700">
                            The gold rates displayed are indicative and may vary slightly from actual market prices.
                            Prices shown do not include making charges, GST, or other applicable taxes. Always verify
                            the current rate with your local jeweler before making a purchase. We update our rates regularly
                            to ensure accuracy.
                        </p>
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
