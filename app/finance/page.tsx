import { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import { fetchArticlesByCategorySlug, fetchLatestArticles, Article as SupabaseArticle } from '@/lib/supabaseApi';
import { Article } from '@/types';
import { BookOpen, TrendingUp, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Business & Finance News - Latest Updates | Gpaisa',
    description: 'Stay updated with the latest business and finance news. Get insights on markets, economy, investments, corporate news, and financial trends in India.',
    keywords: 'business news, finance news, market updates, economy news, corporate news, financial news India, business updates, stock market news',
    openGraph: {
        title: 'Business & Finance News - Latest Updates | Gpaisa',
        description: 'Stay updated with the latest business and finance news. Get insights on markets, economy, investments, corporate news, and financial trends in India.',
        type: 'website',
    },
};

export const revalidate = 600; // Revalidate every 10 minutes

// Transform Supabase article to component Article type
function transformArticle(article: SupabaseArticle): Article {
    return {
        ...article,
        readTime: article.read_time,
        publishedAt: article.published_at || article.publishedAt || new Date().toISOString(),
        category: article.category?.slug || 'news',
    };
}

export default async function FinancePage() {
    // Fetch business news from Supabase
    const businessNews = await fetchArticlesByCategorySlug('business', 20);

    // If no business news, fetch latest articles as fallback
    const supabaseArticles = businessNews.length > 0 ? businessNews : await fetchLatestArticles(20);

    // Transform articles to expected format
    const articles = supabaseArticles.map(transformArticle);

    return (
        <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 min-h-screen py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-primary-600 rounded-xl shadow-lg">
                            <Newspaper className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
                                Business & Finance News
                            </h1>
                            <p className="text-lg text-gray-600 mt-1">
                                Latest updates from the world of business and finance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live News Indicator */}
                <div className="mb-8 card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                            <TrendingUp className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="font-display font-semibold text-gray-900">Live Business Updates</h2>
                            <p className="text-sm text-gray-600">
                                Showing {articles.length} latest articles • Updated every 10 minutes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                {articles.length > 0 ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {articles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </section>
                ) : (
                    <div className="card text-center py-12">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                            No articles available
                        </h3>
                        <p className="text-gray-600">
                            Check back soon for the latest business and finance news.
                        </p>
                    </div>
                )}

                {/* Featured Topics */}
                <section className="mt-12">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                        Popular Finance Topics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">
                                Investment Strategies
                            </h3>
                            <p className="text-sm text-gray-600">
                                Learn about mutual funds, stocks, bonds, and portfolio diversification.
                            </p>
                        </div>
                        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">
                                Market Analysis
                            </h3>
                            <p className="text-sm text-gray-600">
                                Stay updated with stock market trends, indices, and expert analysis.
                            </p>
                        </div>
                        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">
                                Corporate News
                            </h3>
                            <p className="text-sm text-gray-600">
                                Latest updates on mergers, acquisitions, and corporate developments.
                            </p>
                        </div>
                        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
                            <h3 className="font-display font-semibold text-gray-900 mb-2">
                                Economic Trends
                            </h3>
                            <p className="text-sm text-gray-600">
                                Insights on GDP, inflation, policy changes, and economic indicators.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
