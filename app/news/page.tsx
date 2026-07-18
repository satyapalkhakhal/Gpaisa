import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Clock, TrendingUp, Star } from 'lucide-react';
import {
    fetchAllArticles,
    fetchFeaturedArticles,
    fetchTrendingArticles,
    Article
} from '@/lib/supabaseApi';

export const revalidate = 86400; // Cache for 1 day (ISR)

export const metadata: Metadata = {
    title: 'Latest Financial News & Market Updates | gpaisa.in',
    description: 'Stay updated with the latest financial news, market trends, policy changes, and economic developments in India.',
    alternates: {
        canonical: 'https://www.gpaisa.in/news'
    }
};

const NewsCard = ({ article }: { article: Article }) => (
    <Link href={`/articles/${article.slug}`} className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full">
        <div className="h-44 bg-gray-100 overflow-hidden">
            {article.image_url ? (
                <div className="relative w-full h-full">
                    <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                    <Newspaper className="w-8 h-8" />
                </div>
            )}
        </div>
        <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    {article.category}
                </span>
                {article.subcategory && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {article.subcategory}
                    </span>
                )}
                {article.read_time && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5 ml-auto">
                        <Clock className="w-2.5 h-2.5" />{article.read_time}
                    </span>
                )}
            </div>
            <h3 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-1.5">
                {article.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-500">{article.author || 'Gpaisa Desk'}</span>
                <span>•</span>
                <span>{article.date || new Date(article.published_at).toLocaleDateString()}</span>
            </div>
        </div>
    </Link>
);

export default async function NewsPage() {
    const [allArticles, featuredArticles, trendingArticles] = await Promise.all([
        fetchAllArticles(30, 86400),
        fetchFeaturedArticles(3, 86400),
        fetchTrendingArticles(6, 86400),
    ]);

    // Get unique categories from articles
    const categories = [...new Set(allArticles.map(a => a.category))];

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'News', item: 'https://www.gpaisa.in/news' },
        ],
    };

    return (
        <div className="bg-gray-50 py-8 sm:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                        <Newspaper className="h-9 w-9 text-primary-600" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Latest News</h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
                        Latest updates on markets, business, and the economy. Stay ahead with our coverage.
                    </p>
                </div>

                {/* Featured Section */}
                {featuredArticles.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
                            <Star className="w-4 h-4 text-amber-500" />
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Featured</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map(article => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Section */}
                {trendingArticles.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Trending</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingArticles.map(article => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Articles */}
                <section>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-gray-500 to-gray-700" />
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">All Articles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allArticles.map(article => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                </section>

                {/* Empty State */}
                {allArticles.length === 0 && (
                    <div className="text-center py-20">
                        <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">Loading latest news...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
