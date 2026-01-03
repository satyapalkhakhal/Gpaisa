import { Metadata } from 'next';
import { fetchSilverCities } from '@/lib/angelOneApi';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import Link from 'next/link';
import { MapPin, TrendingUp, Calculator } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Silver Rate Today in India - Live Silver Price Per Gram/Kg | gpaisa.in',
    description: 'Check today\'s silver rate in India. Live silver price per gram and per kg. View city-wise silver rates for Mumbai, Delhi, Chennai, Bangalore and more.',
    keywords: ['silver rate today', 'silver price india', 'silver rate per kg', 'silver rate per gram', 'live silver price'],
    openGraph: {
        title: 'Silver Rate Today in India - Live Prices',
        description: 'Check today\'s silver rate in India. Live silver price per gram and per kg.',
        type: 'website',
    },
    alternates: {
        canonical: '/silver-rate'
    }
};

export default async function SilverRatePage() {
    const cities = await fetchSilverCities();

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Silver Rate Today in India",
        "description": "Current silver rates per gram and per kg in India, including city-wise prices.",
        "url": "https://gpaisa.in/silver-rate",
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
                    "name": "Silver Rates",
                    "item": "https://gpaisa.in/silver-rate"
                }
            ]
        },
        "mainEntity": {
            "@type": "Product",
            "name": "Silver",
            "description": "Real-time silver prices in India",
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
            }
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                        Silver Rate Today in India
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Check live silver rates across major Indian cities. Updated in real-time with prices per gram and per kg.
                    </p>
                </header>

                {/* National Rates */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
                        Current Silver Rates
                    </h2>
                    <DynamicSilverRates />
                </section>

                {/* City List */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                            City-Wise Silver Rates
                        </h2>
                        <p className="text-gray-600">
                            Select your city to view detailed silver rates
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cities.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/silver-rate/${city.slug}`}
                                className="card hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full group-hover:bg-primary-600 transition-colors">
                                        <MapPin className="h-6 w-6 text-gray-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {city.city}
                                        </h3>
                                        <p className="text-sm text-gray-600">View live rates →</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-8 text-center">
                        Why Track Silver Rates on gpaisa.in?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Market Data</h3>
                            <p className="text-gray-600">
                                Real-time silver prices updated directly from market feeds.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">City-Specific Rates</h3>
                            <p className="text-gray-600">
                                Accurate rates for over 15 major Indian cities.
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calculator className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Calculator</h3>
                            <p className="text-gray-600">
                                Calculate value for any weight instantly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <article className="card mb-12">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                        Understanding Silver Rates in India
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                        <p>
                            Silver is a popular precious metal in India, used extensively in jewelry, silverware, and industry.
                            Like gold, silver rates in India are influenced by international prices, currency fluctuations, import duties, and local demand.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Factors Impacting Silver Prices</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Industrial Demand:</strong> Silver has massive industrial applications in electronics, solar panels, and medical devices.</li>
                            <li><strong>Investment Demand:</strong> Investors buy silver as a hedge against inflation and currency devaluation.</li>
                            <li><strong>USD/INR Rate:</strong> A weaker Rupee makes imported silver more expensive.</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Silver Weight Units</h3>
                        <p>
                            Silver is commonly traded in kilograms (kg) in the wholesale market, while retail prices are often quoted per 10 grams or per gram.
                            1 Kg = 1000 Grams.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}
