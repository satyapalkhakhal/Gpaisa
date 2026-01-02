import { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import { Newspaper } from 'lucide-react';
import { fetchArticlesByCategorySlug, fetchLatestArticles } from '@/lib/supabaseApi';

export const revalidate = 0; // Instant revalidation for debugging

export const metadata: Metadata = {
    title: 'Latest Financial News & Market Updates | gpaisa.in',
    description: 'Stay updated with the latest financial news, market trends, policy changes, and economic developments in India.',
};

export default async function NewsPage() {
    // Parallel fetch: Breaking News vs General Content
    const [breakingNews, latestArticles] = await Promise.all([
        fetchArticlesByCategorySlug('news', 6), // Top 6 breaking news
        fetchLatestArticles(15) // Top 15 articles overall
    ]);

    // Filter out breaking news from latest articles to avoid duplicates
    const breakingIds = new Set(breakingNews.map(a => a.id));
    const moreArticles = latestArticles.filter(a => !breakingIds.has(a.id));

    // Helper map function to adapt Supabase data to ArticleCard expectations
    const mapToComponentArticle = (a: any) => ({
        ...a,
        readTime: a.read_time || '3 min read', // Map snake_case to camelCase
        publishedAt: a.published_at || a.publishedAt || new Date().toISOString(),
        category: typeof a.category === 'string' ? a.category : (a.category?.name || 'news')
    });

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                        <Newspaper className="h-10 w-10 text-primary-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">Financial News</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Latest updates on markets, economy, and financial policies. Stay ahead with our real-time coverage.
                    </p>
                </div>

                {/* Section 1: Breaking News (Grid of 3) */}
                {breakingNews.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center mb-6">
                            <span className="w-1.5 h-8 bg-red-600 rounded-full mr-3"></span>
                            <h2 className="text-2xl font-display font-bold text-gray-900">Breaking News</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {breakingNews.map(article => (
                                <ArticleCard key={article.id} article={mapToComponentArticle(article)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Section 2: More Articles */}
                {moreArticles.length > 0 && (
                    <section>
                        <div className="flex items-center mb-6">
                            <span className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></span>
                            <h2 className="text-2xl font-display font-bold text-gray-900">More Financial Articles</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {moreArticles.map(article => (
                                <ArticleCard key={article.id} article={mapToComponentArticle(article)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Loading / Empty State Fallback (if no data) */}
                {breakingNews.length === 0 && moreArticles.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Loading latest news...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
