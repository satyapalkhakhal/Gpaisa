import Link from 'next/link';
import { fetchLatestArticles } from '@/lib/supabaseApi';
import { CALCULATORS } from '@/lib/calculatorsList';
import { FileText, TrendingUp, Newspaper, MapPin, Calculator } from 'lucide-react';

const CITIES = [
    'Delhi', 'Chennai', 'Mumbai', 'Pune', 'Hyderabad',
    'Bangalore', 'Coimbatore', 'Kolkata', 'Ahmedabad', 'Kerala'
];

export const metadata = {
    title: 'Sitemap - All Pages | gpaisa.in',
    description: 'Browse all pages on gpaisa.in including gold rates, silver rates, news articles, and financial information.',
    robots: {
        index: true,
        follow: true,
    },
};

export const revalidate = 86400; // Cache for 1 day (ISR)

export default async function SitemapPage() {
    // Fetch latest articles for the sitemap
    let articles: any[] = [];
    try {
        articles = await fetchLatestArticles(50, 86400);
    } catch (error) {
        console.error('Error fetching articles for HTML sitemap:', error);
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
                        Site Map
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse all pages on gpaisa.in. Find gold rates, silver rates, market updates, and financial news.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Main Pages */}
                    <section className="card">
                        <div className="flex items-center space-x-3 mb-6">
                            <FileText className="h-6 w-6 text-primary-600" />
                            <h2 className="text-2xl font-display font-semibold text-gray-900">
                                Main Pages
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    News
                                </Link>
                            </li>
                            {/* Markets temporarily hidden */}
                            <li>
                                <Link href="/commodities" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Commodities
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/business" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Finance
                                </Link>
                            </li>
                            <li>
                                <Link href="/glossary" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Financial Glossary
                                </Link>
                            </li>
                            <li>
                                <Link href="/gold-affordability-index" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Gold Affordability Index
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/disclaimer" className="text-primary-600 hover:text-primary-700 hover:underline">
                                    Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </section>

                    {/* Financial Calculators */}
                    <section className="card">
                        <div className="flex items-center space-x-3 mb-6">
                            <Calculator className="h-6 w-6 text-primary-600" />
                            <h2 className="text-2xl font-display font-semibold text-gray-900">
                                Financial Calculators
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/calculator" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold">
                                    All Calculators
                                </Link>
                            </li>
                            {CALCULATORS.map((calc) => (
                                <li key={calc.href}>
                                    <Link href={calc.href} className="text-primary-600 hover:text-primary-700 hover:underline">
                                        {calc.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Gold Rate Pages */}
                    <section className="card">
                        <div className="flex items-center space-x-3 mb-6">
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                            <h2 className="text-2xl font-display font-semibold text-gray-900">
                                Gold Rates by City
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/gold-rate" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold">
                                    All Gold Rates
                                </Link>
                            </li>
                            {CITIES.map((city) => (
                                <li key={city}>
                                    <Link
                                        href={`/gold-rate/${city.toLowerCase()}`}
                                        className="text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Gold Rate in {city}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Silver Rate Pages */}
                    <section className="card">
                        <div className="flex items-center space-x-3 mb-6">
                            <MapPin className="h-6 w-6 text-gray-600" />
                            <h2 className="text-2xl font-display font-semibold text-gray-900">
                                Silver Rates by City
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/silver-rate" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold">
                                    All Silver Rates
                                </Link>
                            </li>
                            {CITIES.map((city) => (
                                <li key={city}>
                                    <Link
                                        href={`/silver-rate/${city.toLowerCase()}`}
                                        className="text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        Silver Rate in {city}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Recent Articles */}
                    <section className="card">
                        <div className="flex items-center space-x-3 mb-6">
                            <Newspaper className="h-6 w-6 text-primary-600" />
                            <h2 className="text-2xl font-display font-semibold text-gray-900">
                                Recent Articles
                            </h2>
                        </div>
                        {articles.length > 0 ? (
                            <ul className="space-y-3 max-h-96 overflow-y-auto">
                                {articles.map((article) => (
                                    <li key={article.id}>
                                        <Link
                                            href={`/articles/${article.slug}`}
                                            className="text-primary-600 hover:text-primary-700 hover:underline line-clamp-1"
                                        >
                                            {article.title}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-3 border-t">
                                    <Link
                                        href="/news"
                                        className="text-primary-700 hover:text-primary-800 hover:underline font-semibold"
                                    >
                                        View All Articles →
                                    </Link>
                                </li>
                            </ul>
                        ) : (
                            <p className="text-gray-600">Loading articles...</p>
                        )}
                    </section>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-sm text-gray-600">
                    <p>
                        For the XML sitemap used by search engines, visit{' '}
                        <Link href="/sitemap.xml" className="text-primary-600 hover:underline">
                            sitemap.xml
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
