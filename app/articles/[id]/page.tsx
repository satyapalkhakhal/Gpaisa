import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchArticleById, fetchLatestArticles, fetchArticlesByCategory } from '@/lib/supabaseApi';
import { Calendar, Clock, User, Tag, ChevronRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 600; // Revalidate every 10 minutes

// Helper function to generate keywords from article content
function generateKeywords(article: any): string[] {
    const baseKeywords = [
        'financial news',
        'India finance',
        'gpaisa',
        'market news',
        'investment news',
    ];

    // Extract category-based keywords
    const categoryKeywords: string[] = [];
    if (article.category) {
        const category = typeof article.category === 'string' ? article.category : article.category.name;
        categoryKeywords.push(category, `${category} news`, `${category} India`);
    }

    // Extract keywords from title (simple word extraction)
    const titleWords = article.title
        .toLowerCase()
        .split(/\s+/)
        .filter((word: string) => word.length > 4)
        .slice(0, 5);

    return [...baseKeywords, ...categoryKeywords, ...titleWords];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const article = await fetchArticleById(id);

    if (!article) {
        return {
            title: 'Article Not Found | gpaisa.in',
        };
    }

    const keywords = generateKeywords(article);
    const publishedTime = new Date(article.published_at || article.publishedAt || Date.now()).toISOString();
    const modifiedTime = new Date(article.updated_at || publishedTime).toISOString();

    return {
        title: `${article.title} | gpaisa.in`,
        description: article.excerpt || article.title,
        keywords: keywords.join(', '),
        authors: [{ name: article.author || 'Gpaisa Desk' }],
        openGraph: {
            title: article.title,
            description: article.excerpt || article.title,
            type: 'article',
            publishedTime,
            modifiedTime,
            authors: [article.author || 'Gpaisa Desk'],
            images: article.featured_image_url ? [
                {
                    url: article.featured_image_url,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                }
            ] : [],
            siteName: 'gpaisa.in',
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt || article.title,
            images: article.featured_image_url ? [article.featured_image_url] : [],
        },
        alternates: {
            canonical: `/articles/${id}`,
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await fetchArticleById(id);

    if (!article) {
        notFound();
    }

    // Parallel fetch for other data
    const [topStories, similarNews] = await Promise.all([
        fetchLatestArticles(5), // Fetch 5 latest stories for sidebar
        article.category_id
            ? fetchArticlesByCategory(article.category_id, 4)
            : fetchLatestArticles(4) // Fallback to latest if no category
    ]);

    // Filter out current article from similar news
    const filteredSimilarNews = similarNews
        .filter(a => a.id !== article.id)
        .slice(0, 3);

    // Prepare JSON-LD structured data
    const publishedDate = new Date(article.published_at || article.publishedAt || Date.now()).toISOString();
    const modifiedDate = new Date(article.updated_at || publishedDate).toISOString();

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt || article.title,
        image: article.featured_image_url || 'https://gpaisa.in/icon-512.png',
        datePublished: publishedDate,
        dateModified: modifiedDate,
        author: {
            '@type': 'Person',
            name: article.author || 'Gpaisa Desk',
        },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: {
                '@type': 'ImageObject',
                url: 'https://gpaisa.in/icon-512.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://gpaisa.in/articles/${id}`,
        },
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://gpaisa.in',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'News',
                item: 'https://gpaisa.in/news',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://gpaisa.in/articles/${id}`,
            },
        ],
    };

    return (
        <div className="bg-gray-50 py-8 font-sans">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* === LEFT COLUMN (MAIN ARTICLE) === */}
                    <div className="lg:col-span-8">
                        <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">

                            {/* Breadcrumbs */}
                            <nav className="flex items-center text-sm text-gray-500 mb-6">
                                <Link href="/" className="hover:text-primary-600">Home</Link>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <Link href="/news" className="hover:text-primary-600">News</Link>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="text-gray-900 truncate max-w-[200px]">{article.title}</span>
                            </nav>

                            {/* Title & Metadata */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100 flex-wrap gap-4">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    {article.author || 'Gpaisa Desk'}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(article.published_at || article.publishedAt || Date.now()).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {article.read_time || '3 min read'}
                                </span>
                                {article.updated_at && article.updated_at !== article.published_at && (
                                    <span className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                        Updated: {new Date(article.updated_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>

                            {/* Featured Image */}
                            {article.featured_image_url && (
                                <div className="mb-8 rounded-lg overflow-hidden bg-gray-100 aspect-video">
                                    <img
                                        src={article.featured_image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none text-gray-800">
                                <p className="lead font-medium text-xl text-gray-600 mb-6">
                                    {article.excerpt}
                                </p>

                                {article.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                ) : (
                                    <div className="space-y-4">
                                        <p>Detailed content formatting coming soon...</p>
                                        <p>{article.excerpt}</p>
                                    </div>
                                )}
                            </div>

                        </article>

                        {/* Similar News Section (Below Article) */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                                Similar News
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filteredSimilarNews.map(news => (
                                    <Link key={news.id} href={`/articles/${news.id}`} className="group block bg-white rounded shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                        <div className="h-40 bg-gray-200 overflow-hidden">
                                            {news.featured_image_url ? (
                                                <img src={news.featured_image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">IMG</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 mb-2 leading-snug">
                                                {news.title}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(news.published_at || news.publishedAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* === RIGHT COLUMN (SIDEBAR) === */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 space-y-8">

                            {/* Top Stories Widget */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-gray-100">
                                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                    <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Top Stories</h3>
                                </div>
                                <div className="space-y-4">
                                    {topStories.map((story, i) => (
                                        <Link key={story.id} href={`/articles/${story.id}`} className="flex gap-3 group">
                                            <span className="text-2xl font-bold text-gray-200 group-hover:text-primary-200 font-display -mt-1 w-6 text-center shrink-0">
                                                {i + 1}
                                            </span>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                                                    {story.title}
                                                </h4>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400">
                                                        {typeof story.category === 'string' ? story.category : 'News'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300">•</span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(story.published_at || story.publishedAt || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter / Ad Placeholder */}
                            <div className="bg-primary-50 rounded-lg p-6 text-center border border-primary-100">
                                <h4 className="font-bold text-primary-900 mb-2">Stay Updated</h4>
                                <p className="text-sm text-primary-700 mb-4">Get the latest financial news delivered to your inbox.</p>
                                <input type="email" placeholder="Your email address" className="w-full text-sm p-2 rounded border border-primary-200 mb-2" />
                                <button className="w-full bg-primary-600 text-white font-bold text-xs uppercase py-2.5 rounded hover:bg-primary-700 transition">
                                    Subscribe Now
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
