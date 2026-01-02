import { Metadata } from 'next';
import Link from 'next/link';
import { articles, marketIndices, commodities } from '@/lib/mockData';
import { TrendingUp, ArrowRight, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import LastUpdatedTime from '@/components/LastUpdatedTime';

export const metadata: Metadata = {
    title: 'Gpaisa - Gold Rates, Silver Price, Fuel Price, Currency & Business News',
    description: 'India\'s leading financial portal for live gold rates, silver prices, petrol/diesel prices, currency exchange rates, and business news.',
};

// Helper Components
const SectionHeading = ({ title, color = 'blue' }: { title: string, color?: string }) => {
    const colorClasses = {
        blue: 'border-blue-600 text-blue-900',
        red: 'border-red-600 text-red-900',
        green: 'border-green-600 text-green-900',
        orange: 'border-orange-600 text-orange-900',
        purple: 'border-purple-600 text-purple-900',
    }[color] || 'border-gray-800 text-gray-900';

    return (
        <div className="flex items-center justify-between border-b border-gray-200 mb-4 pb-2">
            <h2 className={`text-lg font-bold uppercase border-l-4 pl-3 ${colorClasses}`}>
                {title}
            </h2>
            <Link href="#" className="text-xs font-semibold text-gray-500 hover:text-primary-600 flex items-center">
                View All <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
        </div>
    );
};

const NewsListItem = ({ article }: { article: any }) => (
    <div className="group mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
        <Link href={`/articles/${article.id}`} className="flex gap-3">
            <div className="w-20 h-16 bg-gray-200 flex-shrink-0 rounded flex items-center justify-center">
                {/* Placeholder for image */}
                <span className="text-xs text-gray-400">IMG</span>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{article.publishedAt}</p>
            </div>
        </Link>
    </div>
);

export default function HomePage() {
    const featuredStory = articles[0];
    const topStories = articles.slice(1, 6);
    const businessNews = articles.slice(2, 5); // Mock different set
    const internationalNews = articles.slice().reverse().slice(0, 4);
    const financeNews = articles.slice(0, 4);

    return (
        <div className="bg-white text-gray-800 font-sans min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* === LEFT COLUMN (MAIN CONTENT) === */}
                    <div className="lg:col-span-8">

                        {/* HERO SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 pb-8 border-b border-gray-200">
                            {/* Big Story */}
                            <div className="md:col-span-7">
                                <Link href={`/articles/${featuredStory.id}`} className="group block h-full">
                                    <div className="aspect-video bg-gray-200 w-full rounded mb-3 flex items-center justify-center text-gray-400">
                                        <span className="font-medium">Featured Image</span>
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary-700 transition-colors">
                                        {featuredStory.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                        {featuredStory.excerpt}
                                    </p>
                                    <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                                        {featuredStory.category}
                                    </span>
                                </Link>
                            </div>

                            {/* Top Stories List */}
                            <div className="md:col-span-5 border-l border-gray-200 pl-0 md:pl-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                    <h3 className="font-bold text-gray-900 uppercase text-sm">Top Stories</h3>
                                </div>
                                <div className="space-y-0">
                                    {topStories.map(article => (
                                        <NewsListItem key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BUSINESS NEWS SECTION */}
                        <div className="mb-10">
                            <SectionHeading title="Business News" color="blue" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {businessNews.map(article => (
                                    <Link key={article.id} href={`/articles/${article.id}`} className="group block">
                                        <div className="h-40 bg-gray-100 rounded mb-3"></div>
                                        <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-blue-700 mb-1">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* INTERNATIONAL NEWS */}
                        <div className="mb-10">
                            <SectionHeading title="International News" color="purple" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {internationalNews.map(article => (
                                    <div key={article.id} className="flex gap-4 group">
                                        <div className="w-24 h-20 bg-gray-200 rounded shrink-0 flex items-center justify-center text-xs text-gray-400">
                                            IMG
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-purple-700 mb-1 line-clamp-2">
                                                <Link href={`/articles/${article.id}`}>{article.title}</Link>
                                            </h3>
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Global</span>
                                            <span className="text-xs text-gray-400 ml-2">{article.publishedAt}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MUTUAL FUNDS / FINANCE SECTION */}
                        <div className="mb-8">
                            <SectionHeading title="Personal Finance" color="green" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 p-4 rounded border border-green-100">
                                    <h3 className="font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Investment Tips</h3>
                                    <ul className="space-y-3">
                                        {financeNews.map(a => (
                                            <li key={a.id}>
                                                <Link href={`/articles/${a.id}`} className="text-sm text-gray-700 hover:text-green-700 font-medium block truncate">
                                                    • {a.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                    <h3 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2">Tax Planning</h3>
                                    <ul className="space-y-3">
                                        {financeNews.slice().reverse().map(a => (
                                            <li key={a.id}>
                                                <Link href={`/articles/${a.id}`} className="text-sm text-gray-700 hover:text-blue-700 font-medium block truncate">
                                                    • {a.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* === RIGHT COLUMN (SIDEBAR) === */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* GOLD RATE WIDGET (Hero style) */}
                        <div className="bg-white rounded shadow-sm border border-yellow-400 overflow-hidden">
                            <div className="bg-yellow-500 px-4 py-3 flex justify-between items-center">
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Gold Rate Today</h3>
                                <span className="bg-white text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded">LIVE</span>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Select City</label>
                                    <select className="w-full text-sm border-gray-300 rounded focus:ring-yellow-500 focus:border-yellow-500">
                                        <option>India (Composite)</option>
                                        <option>Delhi</option>
                                        <option>Mumbai</option>
                                        <option>Chennai</option>
                                        <option>Bangalore</option>
                                    </select>
                                </div>
                                <DynamicGoldRates simpleView={true} />
                            </div>
                            <div className="bg-yellow-50 px-4 py-2 border-t border-yellow-100 text-center">
                                <Link href="/gold-rate" className="text-xs font-bold text-yellow-700 uppercase hover:underline">
                                    Check 10 Days History &raquo;
                                </Link>
                            </div>
                        </div>

                        {/* SILVER WIDGET */}
                        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wide">Silver Rates</h3>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm font-medium text-gray-600">Silver (1 Kg)</span>
                                    <span className="text-xl font-bold text-gray-900">₹{(commodities[1].price * 1000).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-right mb-3">
                                    <span className={`text-xs font-bold ${commodities[1].changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {commodities[1].changePercent >= 0 ? '+' : ''}{commodities[1].changePercent}% Today
                                    </span>
                                </div>
                                <Link href="/commodities" className="block w-full text-center bg-gray-600 text-white text-xs font-bold py-2 rounded hover:bg-gray-700 transition">
                                    VIEW HISTORY
                                </Link>
                            </div>
                        </div>

                        {/* FUEL PRICE WIDGET */}
                        <div className="bg-white rounded shadow-sm border border-blue-200 overflow-hidden">
                            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center">
                                <Zap className="w-4 h-4 text-blue-600 mr-2" />
                                <h3 className="font-bold text-blue-900 uppercase text-sm tracking-wide">Today&apos;s Fuel Price</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Petrol</div>
                                        <div className="text-xs text-gray-400">Delhi</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">₹94.72</div>
                                        <div className="text-[10px] text-gray-400">unchanged</div>
                                    </div>
                                </div>
                                <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Diesel</div>
                                        <div className="text-xs text-gray-400">Delhi</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">₹87.62</div>
                                        <div className="text-[10px] text-gray-400">unchanged</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CURRENCY / TOOLS */}
                        <div className="border border-gray-200 rounded p-4 bg-gray-50">
                            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase">Market Tools</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/finance" className="bg-white border p-2 text-center rounded hover:shadow-sm">
                                    <span className="block text-xs font-bold text-gray-600">SIP Calc</span>
                                </Link>
                                <Link href="/gold-rate" className="bg-white border p-2 text-center rounded hover:shadow-sm">
                                    <span className="block text-xs font-bold text-gray-600">Gold Calc</span>
                                </Link>
                            </div>
                        </div>

                        {/* ADS PLACEHOLDER */}
                        <div className="bg-gray-100 h-64 flex items-center justify-center border border-dashed border-gray-300 rounded">
                            <span className="text-gray-400 text-sm font-medium">Ad Space</span>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}
