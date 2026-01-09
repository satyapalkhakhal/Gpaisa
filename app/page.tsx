import { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/mockData';
import { TrendingUp, ArrowRight, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { fetchArticlesByCategorySlug, fetchLatestArticles } from '@/lib/supabaseApi';

export const metadata: Metadata = {
    title: 'Gpaisa - Gold Rates, Silver Price, Fuel Price, Currency & Business News',
    description: 'India\'s leading financial portal for live gold rates, silver prices, petrol/diesel prices, currency exchange rates, and business news.',
    alternates: {
        canonical: 'https://gpaisa.in'
    }
};

export const revalidate = 0; // Instant revalidation for debugging

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
        <Link href={`/articles/${article.slug}`} className="flex gap-3">
            <div className="w-20 h-16 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
                {article.featured_image_url ? (
                    <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-400 flex items-center justify-center h-full">IMG</span>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : article.publishedAt}
                </p>
            </div>
        </Link>
    </div>
);

export default async function HomePage() {
    // Fetch articles from Supabase
    const [topNewsArticles, businessNewsArticles, worldAffairsArticles, sportsArticles, educationArticles] = await Promise.all([
        fetchArticlesByCategorySlug('news', 6),  // Latest news across all categories
        fetchArticlesByCategorySlug('business', 3),   // Business category
        fetchArticlesByCategorySlug('world-affairs', 4), // World Affairs category
        fetchArticlesByCategorySlug('sports', 4), // Sports category
        fetchArticlesByCategorySlug('education', 4), // Education category
    ]);

    console.log('📰 Homepage Data:', {
        topNews: topNewsArticles.length,
        business: businessNewsArticles.length,
        world: worldAffairsArticles.length,
        sports: sportsArticles.length,
        education: educationArticles.length
    });

    // Fallback to mock data if API fails
    const topStories = topNewsArticles.length > 0 ? topNewsArticles : articles.slice(0, 6);
    const businessNews = businessNewsArticles.length > 0 ? businessNewsArticles : articles.slice(2, 5);
    const internationalNews = worldAffairsArticles.length > 0 ? worldAffairsArticles : articles.slice().reverse().slice(0, 4);
    const sportsNews = sportsArticles.length > 0 ? sportsArticles : articles.slice(0, 4);
    const educationNews = educationArticles.length > 0 ? educationArticles : articles.slice(0, 4);
    const featuredStory = topStories[0] || articles[0];

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
                                <Link href={`/articles/${featuredStory.slug}`} className="group block h-full">
                                    <div className="aspect-video bg-gray-200 w-full rounded mb-3 overflow-hidden">
                                        {featuredStory.featured_image_url ? (
                                            <img
                                                src={featuredStory.featured_image_url}
                                                alt={featuredStory.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="font-medium">Featured Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary-700 transition-colors">
                                        {featuredStory.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                        {featuredStory.excerpt}
                                    </p>
                                    <div className="flex items-center text-xs font-bold text-primary-600 uppercase tracking-wider mt-3">
                                        <span>{typeof featuredStory.category === 'string' ? featuredStory.category : 'Breaking News'}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-gray-500 font-medium normal-case">
                                            {featuredStory.published_at
                                                ? new Date(featuredStory.published_at).toLocaleDateString()
                                                : featuredStory.publishedAt}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Top Stories List */}
                            <div className="md:col-span-5 border-l border-gray-200 pl-0 md:pl-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                    <h3 className="font-bold text-gray-900 uppercase text-sm">Top Stories</h3>
                                </div>
                                <div className="space-y-0">
                                    {topStories.slice(1).map(article => (
                                        <NewsListItem key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BUSINESS NEWS SECTION */}
                        <div className="mb-10">
                            <SectionHeading title="Business News" color="gray" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {businessNews.map(article => (
                                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                                        <div className="h-40 bg-gray-100 rounded mb-3 overflow-hidden">
                                            {article.featured_image_url ? (
                                                <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100"></div>
                                            )}
                                        </div>
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
                            <SectionHeading title="International News" color="gray" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {internationalNews.map(article => (
                                    <div key={article.id} className="flex gap-4 group">
                                        <div className="w-24 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                                            {article.featured_image_url ? (
                                                <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 mb-1 line-clamp-2">
                                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                                {article.excerpt}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {article.published_at
                                                    ? new Date(article.published_at).toLocaleDateString()
                                                    : article.publishedAt}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SPORTS NEWS */}
                        <div className="mb-10">
                            <SectionHeading title="Sports News" color="gray" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sportsNews.map(article => (
                                    <div key={article.id} className="flex gap-4 group">
                                        <div className="w-24 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                                            {article.featured_image_url ? (
                                                <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 mb-1 line-clamp-2">
                                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                                {article.excerpt}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {article.published_at
                                                    ? new Date(article.published_at).toLocaleDateString()
                                                    : article.publishedAt}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* EDUCATION NEWS */}
                        <div className="mb-10">
                            <SectionHeading title="Education News" color="gray" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {educationNews.map(article => (
                                    <div key={article.id} className="flex gap-4 group">
                                        <div className="w-24 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                                            {article.featured_image_url ? (
                                                <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 mb-1 line-clamp-2">
                                                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                                {article.excerpt}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {article.published_at
                                                    ? new Date(article.published_at).toLocaleDateString()
                                                    : article.publishedAt}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QUICK LINKS TO GOLD & SILVER RATES */}
                        <div className="mb-8 bg-gradient-to-br from-yellow-50 to-gray-50 p-6 rounded-lg border border-yellow-200">
                            <h2 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                                Gold & Silver Rates by City
                            </h2>

                            {/* Gold Rates */}
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-yellow-800 mb-2 uppercase tracking-wide">Gold Rates</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map((city) => (
                                        <Link
                                            key={city}
                                            href={`/gold-rate/${city.toLowerCase()}`}
                                            className="text-xs bg-white hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-400 rounded px-3 py-2 text-center font-medium text-gray-700 hover:text-yellow-800 transition-colors"
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Silver Rates */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Silver Rates</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map((city) => (
                                        <Link
                                            key={city}
                                            href={`/silver-rate/${city.toLowerCase()}`}
                                            className="text-xs bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-400 rounded px-3 py-2 text-center font-medium text-gray-700 hover:text-gray-800 transition-colors"
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* === RIGHT COLUMN (SIDEBAR) === */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* GOLD RATE WIDGET (Hero style) */}
                        <div className="bg-white rounded shadow-sm border border-primary-100 overflow-hidden">
                            <div className="bg-primary-600 px-4 py-3 flex justify-between items-center">
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Gold Rate Today</h3>
                                <span className="bg-white text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded">LIVE</span>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Select City</label>
                                    <select className="w-full text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
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
                                <DynamicSilverRates simpleView={true} displayWeight={1000} />
                                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center mt-3 -mx-4 -mb-4">
                                    <Link href="/silver-rate" className="text-xs font-bold text-gray-600 uppercase hover:underline">
                                        Check detailed rates &raquo;
                                    </Link>
                                </div>
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
