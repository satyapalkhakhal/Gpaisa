import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us - gpaisa.in | Your Trusted Financial Information Portal',
    description: 'Learn about gpaisa.in - India\'s leading financial information portal providing real-time gold rates, silver prices, market updates, and expert financial insights.',
    alternates: {
        canonical: 'https://www.gpaisa.in/about',
    },
    openGraph: {
        title: 'About Us - gpaisa.in',
        description: 'India\'s trusted source for financial information, market updates, and investment insights.',
        type: 'website',
        url: 'https://www.gpaisa.in/about',
    },
};

export const dynamic = 'force-static'; // Fully static page, cached permanently

export default function AboutPage() {
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': 'https://www.gpaisa.in/about#founder',
        name: 'Satyapal Khakhal',
        jobTitle: 'Founder & Financial Content Author',
        url: 'https://www.gpaisa.in/about',
        image: 'https://res.cloudinary.com/dpqtibvzn/image/upload/v1779511268/thinkscope/merzsltgiiep9ebljs6d.png',
        worksFor: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            url: 'https://www.gpaisa.in',
        },
        description: 'Satyapal Khakhal is the founder of gpaisa.in and writes about personal finance, gold prices, investment trends, credit cards, and financial tools for Indian readers.',
    };

    const aboutPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About gpaisa.in',
        url: 'https://www.gpaisa.in/about',
        description: "Learn about gpaisa.in - India's leading financial information portal providing real-time gold rates, silver prices, market updates, and expert financial insights.",
        mainEntity: { '@id': 'https://www.gpaisa.in/about#founder' },
        isPartOf: { '@type': 'WebSite', name: 'gpaisa.in', url: 'https://www.gpaisa.in' },
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        About <span className="text-primary-600">gpaisa.in</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your trusted source for comprehensive financial information, market insights, and investment guidance in India.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <Target className="w-8 h-8 text-primary-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        At gpaisa.in, we are committed to empowering Indian investors and consumers with accurate, timely, and actionable financial information. Our mission is to democratize access to financial knowledge and help individuals make informed decisions about their money.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        We believe that everyone deserves access to reliable financial data, whether you&apos;re tracking gold prices for your next purchase, monitoring stock market trends, or seeking expert advice on personal finance.
                    </p>
                </div>

                {/* What We Offer */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-primary-600 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Market Data</h3>
                            <p className="text-gray-700">
                                Live updates on gold rates, silver prices, stock market indices (Sensex, Nifty), and commodity prices across major Indian cities.
                            </p>
                        </div>
                        <div className="border-l-4 border-primary-600 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Financial Analysis</h3>
                            <p className="text-gray-700">
                                In-depth market analysis, investment insights, and expert commentary to help you understand market trends and opportunities.
                            </p>
                        </div>
                        <div className="border-l-4 border-primary-600 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Finance Guides</h3>
                            <p className="text-gray-700">
                                Comprehensive guides on tax planning, investment strategies, loans, insurance, and wealth management tailored for Indian investors.
                            </p>
                        </div>
                        <div className="border-l-4 border-primary-600 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Financial Calculators</h3>
                            <p className="text-gray-700">
                                19 calculators covering SIP, PPF, EPF, NPS, income tax, home loans, and more — each built to give you an accurate, actionable number in seconds.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <Award className="w-8 h-8 text-primary-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Accuracy</h3>
                            <p className="text-gray-700">
                                We verify all data from reliable sources to ensure you receive accurate and trustworthy information.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                            <p className="text-gray-700">
                                We maintain full transparency in our content, clearly citing sources and providing unbiased analysis.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">User-Centric</h3>
                            <p className="text-gray-700">
                                Every feature and article is designed with our users&apos; needs in mind, making financial information accessible to all.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <Users className="w-8 h-8 text-primary-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        gpaisa.in is powered by a dedicated team of financial analysts, market researchers, and content specialists focused on making financial information accessible and easy to understand for Indian users.
                    </p>

                    {/* Founder / Author */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            <div className="flex-shrink-0">
                                <Image
                                    src="https://res.cloudinary.com/dpqtibvzn/image/upload/v1779511268/thinkscope/merzsltgiiep9ebljs6d.png"
                                    alt="Satyapal Khakhal — Founder, gpaisa.in"
                                    width={120}
                                    height={120}
                                    className="rounded-xl object-cover border-2 border-primary-100 shadow-sm"
                                    priority
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Satyapal Khakhal
                                </h3>

                                <p className="text-primary-600 font-semibold mb-3">
                                    Founder & Financial Content Author
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    Satyapal Khakhal is the founder of gpaisa.in and writes about personal finance, gold prices, investment trends, credit cards, and financial tools for Indian readers. His focus is on simplifying complex financial topics into practical, easy-to-understand insights backed by real market data and research.
                                </p>
                            </div>
                        </div>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span><strong>Financial Analysts:</strong> Experts who monitor markets and provide insightful analysis</span>
                        </li>
                        {/* <li className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span><strong>Content Specialists:</strong> Writers who translate complex financial concepts into easy-to-understand articles</span>
                        </li> */}
                        {/* <li className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span><strong>Data Researchers:</strong> Professionals who ensure accuracy and timeliness of all market data</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary-600 mr-2">•</span>
                            <span><strong>Technology Team:</strong> Developers who maintain our platform and ensure seamless user experience</span>
                        </li> */}
                    </ul>
                </div>

                {/* Why Choose Us */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-6">Why Choose gpaisa.in?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">✓ Comprehensive Coverage</h3>
                            <p className="text-primary-100">
                                From gold rates to stock markets, we cover all aspects of Indian finance in one place.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">✓ Real-Time Updates</h3>
                            <p className="text-primary-100">
                                Get the latest market data and news as it happens, keeping you ahead of the curve.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">✓ Expert Insights</h3>
                            <p className="text-primary-100">
                                Benefit from professional analysis and actionable investment advice from industry experts.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">✓ User-Friendly Platform</h3>
                            <p className="text-primary-100">
                                Navigate easily on any device with our responsive, intuitive design.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Data Sources & Transparency */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-900">Data Sources &amp; Transparency</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        gpaisa.in was established to provide transparent, real-time commodity prices to Indian retail investors. We believe every buyer — whether purchasing gold jewellery or making a financial investment — deserves access to accurate, up-to-date market data without paywalls or jargon.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Our commitment to data accuracy is backed by sourcing from India&apos;s most trusted market institutions:
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border-l-4 border-amber-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Gold &amp; Silver Rates</h3>
                            <p className="text-gray-700">
                                Sourced from <strong>MCX (Multi Commodity Exchange)</strong> and <strong>IBJA (India Bullion and Jewellers Association)</strong> data feeds, updated every market hour on weekdays. International prices are benchmarked against <strong>LBMA (London Bullion Market Association)</strong>.
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Market Indices</h3>
                            <p className="text-gray-700">
                                Sensex, Nifty 50, Nifty Bank, and currency rates are sourced from <strong>BSE</strong>, <strong>NSE</strong>, and public market data providers, refreshed every 60 seconds during trading hours.
                            </p>
                        </div>
                        {/* <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Agricultural Prices</h3>
                            <p className="text-gray-700">
                                Mandi prices are sourced from <strong>Agmarknet</strong> (Government of India) and verified against regional agricultural market committee data.
                            </p>
                        </div> */}
                        <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Editorial Standards</h3>
                            <p className="text-gray-700">
                                All articles and guides are written by domain experts and reviewed for accuracy. We clearly distinguish between informational content and investment advice, and always recommend consulting a SEBI-registered advisor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-700 mb-6">
                        Have questions or feedback? We&apos;d love to hear from you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <p className="text-sm text-gray-700">
                        <strong>Disclaimer:</strong> The information provided on gpaisa.in is for educational and informational purposes only. It should not be considered as financial advice. We recommend consulting with a qualified financial advisor before making any investment decisions. Market data and prices are subject to change and may not reflect real-time values.
                    </p>
                </div>
            </div>
        </div>
    );
}
