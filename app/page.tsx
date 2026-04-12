import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, ArrowRight, ChevronRight, Zap, Flame, Star, Clock, Sparkles } from 'lucide-react';
import DynamicGoldRates from '@/components/DynamicGoldRates';
import DynamicSilverRates from '@/components/DynamicSilverRates';
import {
    fetchAllArticles,
    fetchFeaturedArticles,
    fetchTrendingArticles,
    fetchEditorsPickArticles,
    fetchArticlesByCategory,
    fetchGoldNews,
    fetchSilverNews,
    Article
} from '@/lib/supabaseApi';

export const metadata: Metadata = {
    title: 'Gpaisa - Gold Rates, Silver Price, Fuel Price, Currency & Business News',
    description: 'India\'s leading financial portal for live gold rates, silver prices, petrol/diesel prices, currency exchange rates, and business news.',
    alternates: {
        canonical: 'https://gpaisa.in'
    }
};

export const revalidate = 86400; // Cache for 1 day (ISR)

// ─── Helper Components ───────────────────────────────────────────────

const SectionHeader = ({
    title,
    icon,
    accentColor = 'from-primary-600 to-primary-700',
    href,
}: {
    title: string;
    icon?: React.ReactNode;
    accentColor?: string;
    href?: string;
}) => (
    <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
            <div className={`w-1 h-7 rounded-full bg-gradient-to-b ${accentColor}`} />
            {icon}
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
        </div>
        {href && (
            <Link href={href} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
        )}
    </div>
);

const HeroArticleCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group block relative overflow-hidden rounded-xl">
        <div className="aspect-[16/10] w-full bg-gray-200 overflow-hidden">
            {article.image_url ? (
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-primary-400 font-medium">Gpaisa</span>
                </div>
            )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2.5">
                {article.category}{article.subcategory ? ` · ${article.subcategory}` : ''}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-1.5 group-hover:text-primary-200 transition-colors line-clamp-3">
                {article.title}
            </h2>
            <p className="text-white/70 text-xs line-clamp-2 hidden sm:block">{article.excerpt}</p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-white/60">
                <span>{article.author}</span>
                <span>•</span>
                <span>{article.date || new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                {article.read_time && <><span>•</span><span>{article.read_time}</span></>}
            </div>
        </div>
    </Link>
);

const CompactArticleCard = ({ article, index }: { article: Article; index?: number }) => (
    <Link href={`/articles/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
        {index !== undefined && (
            <span className="text-2xl font-black text-gray-200 group-hover:text-primary-200 w-7 flex-shrink-0 transition-colors">
                {String(index + 1).padStart(2, '0')}
            </span>
        )}
        <div className="w-16 h-14 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
            {article.image_url ? (
                <img src={article.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-100" />
            )}
        </div>
        <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                {article.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                <span className="font-medium text-gray-500 uppercase">{article.category}</span>
                <span>•</span>
                <span>{article.date || new Date(article.published_at).toLocaleDateString()}</span>
            </div>
        </div>
    </Link>
);

const ArticleGridCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
        <div className="h-40 bg-gray-100 overflow-hidden">
            {article.image_url ? (
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
            )}
        </div>
        <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    {article.category}
                </span>
                {article.read_time && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{article.read_time}
                    </span>
                )}
            </div>
            <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-1.5">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
        </div>
    </Link>
);

const ArticleRowCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group flex gap-4 py-3 border-b border-gray-100 last:border-0">
        <div className="w-28 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
            {article.image_url ? (
                <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                <div className="w-full h-full bg-gray-100" />
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{article.excerpt}</p>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500 uppercase">{article.category}</span>
                <span>•</span>
                <span>{article.date || new Date(article.published_at).toLocaleDateString()}</span>
            </div>
        </div>
    </Link>
);

// ─── Main Page Component ─────────────────────────────────────────────

export default async function HomePage() {
    // Fetch all data in parallel
    const [
        allArticles,
        featuredArticles,
        trendingArticles,
        businessArticles,
        technologyArticles,
        travelArticles,
        goldNews,
        silverNews,
    ] = await Promise.all([
        fetchAllArticles(30),
        fetchFeaturedArticles(5),
        fetchTrendingArticles(8),
        fetchArticlesByCategory('BUSINESS', 6),
        fetchArticlesByCategory('TECHNOLOGY', 6),
        fetchArticlesByCategory('TRAVEL', 4),
        fetchGoldNews(6),
        fetchSilverNews(6),
    ]);

    // Hero: first featured or first overall
    const heroArticle = featuredArticles[0] || allArticles[0];
    const topStories = (featuredArticles.length > 1 ? featuredArticles.slice(1) : allArticles.slice(1)).slice(0, 5);

    return (
        <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ══════════════════════════════════════════════════
                        LEFT COLUMN (MAIN CONTENT)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8">

                        {/* ── HERO SECTION ── */}
                        {heroArticle && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10 pb-8 border-b border-gray-200">
                                {/* Big Featured Story */}
                                <div className="md:col-span-7">
                                    <HeroArticleCard article={heroArticle} />
                                </div>

                                {/* Top Stories Sidebar */}
                                <div className="md:col-span-5 md:border-l md:border-gray-200 md:pl-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Flame className="w-4 h-4 text-red-500" />
                                        <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Top Stories</h3>
                                    </div>
                                    <div>
                                        {topStories.map((article, i) => (
                                            <CompactArticleCard key={article.id} article={article} index={i} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── TRENDING NOW ── */}
                        {trendingArticles.length > 0 && (
                            <div className="mb-10">
                                <SectionHeader
                                    title="Trending Now"
                                    icon={<TrendingUp className="w-4 h-4 text-red-500" />}
                                    accentColor="from-red-500 to-orange-500"
                                    href="/news"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                    {trendingArticles.slice(0, 3).map(article => (
                                        <ArticleGridCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── BUSINESS NEWS ── */}
                        {businessArticles.length > 0 && (
                            <div className="mb-10">
                                <SectionHeader
                                    title="Business & Finance"
                                    accentColor="from-blue-600 to-blue-700"
                                    href="/category/business"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {businessArticles.slice(0, 3).map(article => (
                                        <ArticleGridCard key={article.id} article={article} />
                                    ))}
                                </div>
                                {businessArticles.length > 3 && (
                                    <div className="mt-4 space-y-0">
                                        {businessArticles.slice(3, 6).map(article => (
                                            <ArticleRowCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TECHNOLOGY NEWS ── */}
                        {technologyArticles.length > 0 && (
                            <div className="mb-10">
                                <SectionHeader
                                    title="Technology"
                                    icon={<Sparkles className="w-4 h-4 text-purple-500" />}
                                    accentColor="from-purple-600 to-purple-700"
                                    href="/category/technology"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {technologyArticles.slice(0, 4).map(article => (
                                        <ArticleRowCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── GOLD NEWS SECTION ── */}
                        {goldNews.length > 0 && (
                            <div className="mb-10 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-yellow-200/60">
                                <SectionHeader
                                    title="Gold News"
                                    icon={<span className="text-lg">🪙</span>}
                                    accentColor="from-yellow-500 to-amber-600"
                                    href="/gold-rate"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {goldNews.map(article => (
                                        <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-yellow-100 hover:border-yellow-300 hover:shadow-md transition-all duration-300">
                                            <div className="w-20 h-16 bg-yellow-100 rounded-lg shrink-0 overflow-hidden">
                                                {article.image_url ? (
                                                    <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-amber-200 flex items-center justify-center text-yellow-600 text-xs font-bold">GOLD</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                                                    <span>{article.date || new Date(article.published_at).toLocaleDateString()}</span>
                                                    {article.read_time && <><span>•</span><span>{article.read_time}</span></>}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── SILVER NEWS SECTION ── */}
                        {silverNews.length > 0 && (
                            <div className="mb-10 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl p-5 border border-gray-200/60">
                                <SectionHeader
                                    title="Silver News"
                                    icon={<span className="text-lg">🥈</span>}
                                    accentColor="from-slate-500 to-gray-600"
                                    href="/silver-rate"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {silverNews.map(article => (
                                        <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                                            <div className="w-20 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                                {article.image_url ? (
                                                    <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-slate-300 flex items-center justify-center text-gray-500 text-xs font-bold">SILVER</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors">
                                                    {article.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                                                    <span>{article.date || new Date(article.published_at).toLocaleDateString()}</span>
                                                    {article.read_time && <><span>•</span><span>{article.read_time}</span></>}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── TRAVEL ── */}
                        {travelArticles.length > 0 && (
                            <div className="mb-10">
                                <SectionHeader
                                    title="Travel"
                                    accentColor="from-emerald-500 to-green-600"
                                    href="/category/travel"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {travelArticles.map(article => (
                                        <ArticleRowCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── QUICK LINKS TO GOLD & SILVER RATES ── */}
                        <div className="mb-8 bg-gradient-to-br from-yellow-50 to-gray-50 p-6 rounded-xl border border-yellow-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-yellow-600" />
                                Gold & Silver Rates by City
                            </h2>

                            {/* Gold Rates */}
                            <div className="mb-4">
                                <h3 className="text-xs font-bold text-yellow-800 mb-2 uppercase tracking-wide">Gold Rates</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map((city) => (
                                        <Link
                                            key={city}
                                            href={`/gold-rate/${city.toLowerCase()}`}
                                            className="text-xs bg-white hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-400 rounded-lg px-3 py-2 text-center font-medium text-gray-700 hover:text-yellow-800 transition-all duration-200"
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Silver Rates */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Silver Rates</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Coimbatore', 'Kerala'].map((city) => (
                                        <Link
                                            key={city}
                                            href={`/silver-rate/${city.toLowerCase()}`}
                                            className="text-xs bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-2 text-center font-medium text-gray-700 hover:text-gray-800 transition-all duration-200"
                                        >
                                            {city}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* ══════════════════════════════════════════════════
                        RIGHT COLUMN (SIDEBAR)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* ── GOLD RATE WIDGET ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex justify-between items-center">
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Gold Rate Today</h3>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">LIVE</span>
                            </div>
                            <div className="p-4">
                                <DynamicGoldRates simpleView={true} />
                            </div>
                            <div className="bg-yellow-50 px-4 py-2.5 border-t border-yellow-100 text-center">
                                <Link href="/gold-rate" className="text-xs font-bold text-yellow-700 uppercase hover:underline">
                                    Check 10 Days History &raquo;
                                </Link>
                            </div>
                        </div>

                        {/* ── SILVER RATE WIDGET ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3">
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Silver Rates</h3>
                            </div>
                            <div className="p-4">
                                <DynamicSilverRates simpleView={true} displayWeight={1000} />
                                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 text-center mt-3 -mx-4 -mb-4">
                                    <Link href="/silver-rate" className="text-xs font-bold text-gray-600 uppercase hover:underline">
                                        Check detailed rates &raquo;
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ── EDITORS' PICK ── */}
                        {trendingArticles.length > 3 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Must Read</h3>
                                </div>
                                <div className="p-4 space-y-0">
                                    {trendingArticles.slice(3, 8).map((article, i) => (
                                        <CompactArticleCard key={article.id} article={article} index={i} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── FUEL PRICE WIDGET ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-200" />
                                <h3 className="font-bold text-white uppercase text-sm tracking-wide">Today&apos;s Fuel Price</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div className="p-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Petrol</div>
                                        <div className="text-xs text-gray-400">Delhi</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">₹94.72</div>
                                        <div className="text-[10px] text-gray-400">unchanged</div>
                                    </div>
                                </div>
                                <div className="p-3.5 flex justify-between items-center hover:bg-gray-50 transition-colors">
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

                        {/* ── MARKET TOOLS ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Market Tools</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/finance" className="bg-gray-50 border border-gray-200 p-3 text-center rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-all">
                                    <span className="block text-xs font-bold text-gray-600">SIP Calc</span>
                                </Link>
                                <Link href="/gold-rate" className="bg-gray-50 border border-gray-200 p-3 text-center rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-all">
                                    <span className="block text-xs font-bold text-gray-600">Gold Calc</span>
                                </Link>
                                <Link href="/calculator/emi" className="bg-gray-50 border border-gray-200 p-3 text-center rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all">
                                    <span className="block text-xs font-bold text-gray-600">EMI Calc</span>
                                </Link>
                                <Link href="/calculator/fd" className="bg-gray-50 border border-gray-200 p-3 text-center rounded-lg hover:bg-green-50 hover:border-green-200 transition-all">
                                    <span className="block text-xs font-bold text-gray-600">FD Calc</span>
                                </Link>
                            </div>
                        </div>

                        {/* ── AD SPACE ── */}
                        <div className="bg-gray-100 h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-xl">
                            <span className="text-gray-400 text-sm font-medium">Ad Space</span>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
