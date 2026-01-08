import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSilverCities } from '@/lib/angelOneApi';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import SilverCalculator from '@/components/SilverCalculator';
import SilverHistoryTable from '@/components/SilverHistoryTable';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import Link from 'next/link';
import { MapPin, Coins, Calculator, TrendingUp } from 'lucide-react';

export async function generateStaticParams() {
    const cities = await fetchSilverCities();
    return cities.map((city) => ({
        city: city.slug,
    }));
}

export async function generateMetadata(props: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const params = await props.params;
    const cities = await fetchSilverCities();
    const cityData = cities.find(c => c.slug === params.city);

    if (!cityData) {
        return {
            title: 'City Not Found | gpaisa.in',
        };
    }

    const cityName = cityData.city;

    // Comprehensive SEO keywords for the city
    const keywords = [
        // Primary keywords
        `silver rate today ${params.city}`,
        `silver price in ${params.city} today`,
        `${params.city} silver rate`,
        `today silver rate in ${params.city}`,

        // Purity-specific keywords
        `999 silver rate in ${params.city}`,
        `925 silver rate in ${params.city}`,
        `sterling silver price ${params.city}`,
        `fine silver rate ${params.city}`,

        // Weight-specific keywords
        `1 gram silver rate in ${params.city}`,
        `1 kg silver price ${params.city}`,
        `10 gram silver rate ${params.city}`,

        // Long-tail keywords
        `live silver rate ${params.city}`,
        `today silver rate ${params.city} per gram`,
        `silver rate today ${params.city} per kg`,

        // Informational keywords
        `silver price calculator ${params.city}`,
        `silver rate history ${params.city}`,
        `silver rate chart ${params.city}`,

        // General keywords
        'silver rate today',
        'silver price today india',
        'live silver rate',
        'silver rate india'
    ];

    return {
        title: `Silver Rate in ${cityName} Today - Live Price Per Gram/Kg | gpaisa.in`,
        description: `Today's silver price in ${cityName} with live rate updates, historical trends and daily market movements. Check 999 and 925 silver rates per gram and kg.`,
        keywords: keywords.join(', '),
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        openGraph: {
            title: `Silver Rate in ${cityName} Today - Live Prices Per Gram/Kg`,
            description: `Today's silver price in ${cityName} with live rate updates, historical trends and daily market movements.`,
            type: 'website',
            url: `https://gpaisa.in/silver-rate/${params.city}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `Silver Rate in ${cityName} Today`,
            description: `Today's silver price in ${cityName} with live rate updates and historical trends.`,
        },
        alternates: {
            canonical: `https://gpaisa.in/silver-rate/${params.city}`
        }
    };
}

export default async function CitySilverRatePage(props: { params: Promise<{ city: string }> }) {
    const params = await props.params;
    const cities = await fetchSilverCities();
    const cityData = cities.find(c => c.slug === params.city);

    if (!cityData) {
        notFound();
    }

    const cityName = cityData.city;
    const symbol = cityData.symbol;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Silver Rate in ${cityName}`,
        "description": `Current silver rates for ${cityName} per gram and kg`,
        "url": `https://gpaisa.in/silver-rate/${params.city}`,
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
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": cityName,
                    "item": `https://gpaisa.in/silver-rate/${params.city}`
                }
            ]
        },
        "mainEntity": {
            "@type": "Product",
            "name": `Silver Rate in ${cityName}`,
            "description": `Live silver price in ${cityName}`,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "areaServed": {
                    "@type": "City",
                    "name": cityName
                }
            }
        },
        "hasPart": {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `What is the silver rate in ${cityName} today?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Check the latest live silver rates in ${cityName} on gpaisa.in. We provide up-to-date prices per gram and per kg.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `How is silver purity measured in ${cityName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Silver purity is measured in percentage, with 999 (99.9%) being fine silver. In jewelry, 925 (Sterling Silver) is the standard."
                    }
                }
            ]
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/silver-rate" className="hover:text-primary-600">Silver Rates</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{cityName}</li>
                    </ol>
                </nav>

                {/* Page Header */}
                <header className="mb-8">
                    <div className="flex items-center space-x-3 mb-3">
                        <MapPin className="h-10 w-10 text-gray-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">
                            Silver Rate in {cityName} Today
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        Live silver prices in {cityName}. Updated in real-time with historical data and price calculator.
                    </p>
                </header>

                {/* Today's Silver Rates */}
                <section className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <Coins className="h-7 w-7 text-gray-600" />
                        <h2 className="text-2xl font-display font-semibold text-gray-900">
                            Today&apos;s Silver Rates in {cityName}
                        </h2>
                    </div>
                    <DynamicSilverRates symbol={symbol} city={cityName} />
                </section>

                {/* Silver Calculator */}
                <section className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <Calculator className="h-7 w-7 text-gray-600" />
                        <h2 className="text-2xl font-display font-semibold text-gray-900">
                            Silver Price Calculator for {cityName}
                        </h2>
                    </div>
                    {/* Reuse Generic Silver Calculator but auto-select city */}
                    <SilverCalculator initialCitySlug={cityData.slug} />
                </section>

                {/* Silver Rate History */}
                <section className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <TrendingUp className="h-7 w-7 text-gray-600" />
                        <h2 className="text-2xl font-display font-semibold text-gray-900">
                            Silver Rate History in {cityName}
                        </h2>
                    </div>
                    <SilverHistoryTable symbol={symbol} />
                </section>

                {/* SEO Content */}
                <article className="card mb-12">
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                        Buying Silver in {cityName}
                    </h2>
                    <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                        <p>
                            Like other parts of India, {cityName} has a thriving market for silver. It is bought for both jewelry and investment purposes.
                            When buying silver in {cityName}, ensure you are paying the correct market price and always ask for a bill.
                        </p>
                        <h3 className="text-xl font-semibold text-gray-900 mt-6">Things to Check Before Buying</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Purity:</strong> Ensure the silver is of the claimed purity (e.g. 999 for fine silver).</li>
                            <li><strong>Making Charges:</strong> For jewelry, making charges can add significantly to the cost.</li>
                            <li><strong>Buy-back Policy:</strong> Ask the jeweler about their buy-back terms.</li>
                        </ul>
                    </div>
                </article>

                {/* Other Cities */}
                <section className="mb-12">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                        Silver Rates in Other Cities
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {cities.filter(c => c.slug !== params.city).map((city) => (
                            <Link
                                key={city.slug}
                                href={`/silver-rate/${city.slug}`}
                                className="card hover:shadow-lg transition-shadow text-center"
                            >
                                <MapPin className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                                <p className="font-medium text-gray-900">{city.city}</p>
                                <p className="text-xs text-gray-600">View Rates →</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <footer className="mt-8 text-center">
                    <LastUpdatedTime />
                </footer>
            </div>
        </div>
    );
}
