import { Metadata } from 'next';
import { IndianCity } from '@/types';
import { MapPin, TrendingUp, Calculator } from 'lucide-react';
import Link from 'next/link';
import DynamicGoldRates from '@/components/DynamicGoldRates';

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

export const metadata: Metadata = {
    title: 'Gold Rate Today in India - City Wise 24K, 22K, 18K Prices | gpaisa.in',
    description: 'Check today\'s gold rate in all major Indian cities. Live 24K, 22K, and 18K gold prices for Delhi, Mumbai, Chennai, Bangalore, Hyderabad, and more. Updated in real-time.',
    keywords: ['gold rate today', 'gold price India', 'city wise gold rate', '24k gold rate', '22k gold rate', 'gold rate per gram', 'gold rate 10 gram'],
    openGraph: {
        title: 'Gold Rate Today in India - City Wise Prices',
        description: 'Check today\'s gold rate in all major Indian cities. Live prices updated in real-time.',
        type: 'website',
    },
    alternates: {
        canonical: '/gold-rate'
    }
};

export default function GoldRatePage() {
    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                        Gold Rate Today in India
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Check live gold rates across major Indian cities. Updated in real-time with 24K, 22K, and 18K gold prices.
                    </p>
                </header>

                {/* National Gold Rates */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
                        All India Gold Rates
                    </h2>
                    <DynamicGoldRates />
                </section>

                {/* City-wise Gold Rates */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">
                            City-Wise Gold Rates
                        </h2>
                        <p className="text-gray-600">
                            Select your city to view detailed gold rates, historical data, and use our gold calculator
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CITIES.map((city) => (
                            <Link
                                key={city}
                                href={`/gold-rate/${city.toLowerCase()}`}
                                className="card hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-primary-100 p-3 rounded-full group-hover:bg-primary-600 transition-colors">
                                        <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {city}
                                        </h3>
                                        <p className="text-sm text-gray-600">View live gold rates →</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-8 text-center">
                        Why Choose gpaisa.in for Gold Rates?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                            <p className="text-gray-600">
                                Live gold rates updated throughout the day to reflect current market prices
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">City-Specific Rates</h3>
                            <p className="text-gray-600">
                                Accurate gold prices for 10+ major Indian cities with local variations
                            </p>
                        </div>
                        <div className="card text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calculator className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gold Calculator</h3>
                            <p className="text-gray-600">
                                Calculate total gold price including weight, purity, and making charges
                            </p>
                        </div>
                    </div>
                </section>

                {/* SEO Content */}
                <article className="card mb-12">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                        Understanding Gold Rates in India
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                        <p>
                            Gold rates in India fluctuate daily based on various factors including international gold prices,
                            currency exchange rates, import duties, and local demand. Our platform provides real-time gold
                            rates for major Indian cities, helping you stay informed about current market prices.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Gold Purity Standards</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>24K Gold (99.9% pure):</strong> Purest form, ideal for investment and coins</li>
                            <li><strong>22K Gold (91.67% pure):</strong> Most popular for jewelry in India</li>
                            <li><strong>18K Gold (75% pure):</strong> Used for modern and designer jewelry</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Why Gold Rates Vary by City</h3>
                        <p>
                            Gold prices differ across Indian cities due to factors like local taxes, transportation costs,
                            demand-supply dynamics, and making charges. Metropolitan cities like Mumbai, Delhi, and Bangalore
                            may have different rates compared to smaller cities. Always check your local city&apos;s gold rate
                            before making a purchase.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Best Time to Buy Gold</h3>
                        <p>
                            While gold is traditionally purchased during festivals like Dhanteras, Akshaya Tritiya, and
                            weddings, the best time to buy gold is when prices are favorable. Monitor daily gold rates
                            and historical trends to make informed investment decisions.
                        </p>
                    </div>
                </article>

                {/* CTA */}
                <div className="text-center card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
                        Stay Updated with Daily Gold Rates
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Bookmark this page to check gold rates daily and make informed investment decisions
                    </p>
                    <Link
                        href="/commodities"
                        className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        View All Commodity Prices
                    </Link>
                </div>
            </div>
        </div>
    );
}
