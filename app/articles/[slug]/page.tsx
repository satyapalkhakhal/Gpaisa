import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchLatestArticles, fetchArticlesByCategory } from '@/lib/supabaseApi';
import { DROPPED_CATEGORY_DB_VALUES } from '@/lib/categories';
import { ChevronRight, Clock, User, Calendar, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

function isDroppedCategory(category?: string | null): boolean {
    return !!category && DROPPED_CATEGORY_DB_VALUES.includes(category.toUpperCase());
}

export const revalidate = 86400; // Cache for 1 day (ISR)



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found | gpaisa.in',
        };
    }

    const publishedTime = new Date(article.published_at || Date.now()).toISOString();

    return {
        title: `${article.title} | gpaisa.in`,
        description: article.excerpt || article.title,
        authors: [{ name: article.author || 'Gpaisa Desk' }],
        openGraph: {
            title: article.title,
            description: article.excerpt || article.title,
            type: 'article',
            publishedTime,
            modifiedTime: publishedTime,
            authors: [article.author || 'Gpaisa Desk'],
            images: article.image_url ? [
                {
                    url: article.image_url,
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
            images: article.image_url ? [article.image_url] : [],
        },
        alternates: {
            canonical: `https://www.gpaisa.in/articles/${article.slug}`,
        },
        robots: isDroppedCategory(article.category)
            ? { index: false, follow: true }
            : { index: true, follow: true },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    // Fetch related articles - by same category or latest
    const [latestArticles, categoryArticles] = await Promise.all([
        fetchLatestArticles(6, 86400),
        article.category
            ? fetchArticlesByCategory(article.category, 6, 86400)
            : fetchLatestArticles(6, 86400)
    ]);

    // Filter out current article
    const relatedArticles = categoryArticles
        .filter(a => a.id !== article.id)
        .slice(0, 4);

    const sidebarArticles = latestArticles
        .filter(a => a.id !== article.id)
        .slice(0, 5);

    // Format published date
    const publishedDate = new Date(article.published_at || Date.now());
    const formattedDate = publishedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Prepare JSON-LD structured data
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt || article.title,
        image: article.image_url || 'https://www.gpaisa.in/android-chrome-512x512.png',
        datePublished: publishedDate.toISOString(),
        dateModified: publishedDate.toISOString(),
        author: {
            '@type': 'Person',
            name: article.author || 'Gpaisa Desk',
            url: 'https://www.gpaisa.in/about',
        },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.gpaisa.in/android-chrome-512x512.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.gpaisa.in/articles/${article.slug}`,
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
                item: 'https://www.gpaisa.in',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: article.category || 'News',
                item: `https://www.gpaisa.in/news`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://www.gpaisa.in/articles/${article.slug}`,
            },
        ],
    };

    return (
        <div className="bg-gray-50 py-6 sm:py-8 font-sans min-h-screen">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ══════════════════════════════════════════════════
                        LEFT COLUMN (MAIN ARTICLE)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8">
                        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* Breadcrumbs */}
                            <nav className="flex items-center text-sm text-gray-500 px-5 pt-5 overflow-x-auto">
                                <Link href="/" className="hover:text-primary-600 whitespace-nowrap flex items-center gap-1">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
                                <Link href="/news" className="hover:text-primary-600 whitespace-nowrap">News</Link>
                                {article.category && (
                                    <>
                                        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 text-gray-300" />
                                        <span className="text-gray-400 whitespace-nowrap">{article.category}</span>
                                    </>
                                )}
                            </nav>

                            {/* Article Header */}
                            <div className="px-5 sm:px-6 pt-5 pb-4">
                                {/* Category Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                                        {article.category}
                                    </span>
                                    {article.subcategory && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                            {article.subcategory}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                                    {article.title}
                                </h1>

                                {/* Excerpt */}
                                {article.excerpt && (
                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                                        {article.excerpt}
                                    </p>
                                )}

                                {/* Meta Info Bar */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 pb-4 border-b border-gray-100">
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        <span className="font-medium text-gray-700">{article.author || 'Gpaisa Desk'}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formattedDate}
                                    </span>
                                    {article.read_time && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {article.read_time}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Featured Image */}
                            {article.image_url && (
                                <div className="px-5 sm:px-6 mb-6">
                                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 66vw"
                                            priority
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="px-5 sm:px-6 pb-6">
                                <div className="article-content">
                                    {article.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                    ) : (
                                        <div className="space-y-4">
                                            <p>Detailed content coming soon...</p>
                                            <p>{article.excerpt}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="px-5 sm:px-6 pb-5">
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                        {article.tags.map((tag: string, i: number) => (
                                            <span key={i} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author Footer */}
                            <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                                        {(article.author || 'G')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">{article.author || 'Gpaisa Desk'}</div>
                                        <div className="text-xs text-gray-500">{formattedDate}</div>
                                    </div>
                                </div>
                            </div>

                        </article>

                        {/* ── RELATED ARTICLES ── */}
                        {relatedArticles.length > 0 && (
                            <div className="mt-10">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary-600 to-primary-700" />
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Related Articles</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {relatedArticles.map(news => (
                                        <Link key={news.id} href={`/articles/${news.slug}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                                            <div className="h-40 bg-gray-200 overflow-hidden">
                                                {news.image_url ? (
                                                    <div className="relative w-full h-full">
                                                        <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 50vw" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">IMG</div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                                        {news.category}
                                                    </span>
                                                    {news.read_time && (
                                                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                                            <Clock className="w-2.5 h-2.5" />{news.read_time}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug mb-1">
                                                    {news.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">{news.excerpt}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ══════════════════════════════════════════════════
                        RIGHT COLUMN (SIDEBAR)
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-20 space-y-6">

                            {/* Latest Stories Widget */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Latest Stories</h3>
                                </div>
                                <div className="p-4 space-y-0">
                                    {sidebarArticles.map((story, i) => (
                                        <Link key={story.id} href={`/articles/${story.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
                                            <span className="text-xl font-black text-gray-200 group-hover:text-primary-200 w-6 text-center shrink-0 transition-colors">
                                                {i + 1}
                                            </span>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                                                    {story.title}
                                                </h4>
                                                <div className="flex items-center mt-1 gap-1.5 text-[10px] text-gray-400">
                                                    <span className="uppercase font-bold text-gray-500">
                                                        {story.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {story.date || new Date(story.published_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <NewsletterSubscribe variant="sidebar" />

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
