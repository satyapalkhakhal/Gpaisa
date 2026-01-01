import { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import { articles } from '@/lib/mockData';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Latest Financial News & Market Updates | gpaisa.in',
    description: 'Stay updated with the latest financial news, market trends, policy changes, and economic developments in India.',
};

export default function NewsPage() {
    const newsArticles = articles.filter(article => article.category === 'news');
    const otherArticles = articles.filter(article => article.category !== 'news');

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <Newspaper className="h-10 w-10 text-primary-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">Financial News</h1>
                    </div>
                    <p className="text-lg text-gray-600">Latest updates on markets, economy, and financial policies</p>
                </div>

                {/* Breaking News */}
                {newsArticles.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Breaking News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newsArticles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}

                {/* More Articles */}
                <section>
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">More Financial Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherArticles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
