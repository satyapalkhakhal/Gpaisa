import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/lib/mockData';
import ArticleCard from '@/components/ArticleCard';
import { Calendar, Clock, User, Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const article = articles.find(a => a.id === id);

    if (!article) {
        return {
            title: 'Article Not Found | gpaisa.in',
        };
    }

    return {
        title: `${article.title} | gpaisa.in`,
        description: article.excerpt,
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = articles.find(a => a.id === id);

    if (!article) {
        notFound();
    }

    // Get related articles (same category, excluding current)
    const relatedArticles = articles
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article className="card">
                            {/* Article Header */}
                            <div className="mb-6">
                                <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
                                    {article.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                    <span className="flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        {article.author}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {article.readTime}
                                    </span>
                                </div>

                                {article.tags && article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                            >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                <p className="text-xl text-gray-700 font-medium mb-6">
                                    {article.excerpt}
                                </p>

                                {/* Mock content - In real app, this would be rich text from CMS */}
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        This is a detailed article about {article.title.toLowerCase()}. In a production environment,
                                        this content would be fetched from a CMS or database and rendered as rich text with proper
                                        formatting, images, and embedded media.
                                    </p>

                                    <h2 className="text-2xl font-display font-semibold text-gray-900 mt-8 mb-4">
                                        Key Points
                                    </h2>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Comprehensive analysis of the topic</li>
                                        <li>Expert insights and recommendations</li>
                                        <li>Practical tips for implementation</li>
                                        <li>Real-world examples and case studies</li>
                                    </ul>

                                    <h2 className="text-2xl font-display font-semibold text-gray-900 mt-8 mb-4">
                                        Conclusion
                                    </h2>
                                    <p>
                                        Understanding these financial concepts is crucial for making informed decisions about your
                                        money. Always consult with a qualified financial advisor before making major financial decisions.
                                    </p>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Disclaimer:</strong> This article is for informational purposes only and should not be
                                    considered as financial advice. Please consult with a qualified financial advisor before making
                                    any investment decisions.
                                </p>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <div className="card">
                                    <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                                        Related Articles
                                    </h3>
                                    <div className="space-y-4">
                                        {relatedArticles.map(related => (
                                            <ArticleCard key={related.id} article={related} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Links */}
                            <div className="card bg-primary-50 border-primary-200">
                                <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
                                    Quick Links
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="/markets" className="text-primary-700 hover:text-primary-800 font-medium">
                                            → Live Market Updates
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/commodities" className="text-primary-700 hover:text-primary-800 font-medium">
                                            → Gold & Silver Rates
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="/agriculture" className="text-primary-700 hover:text-primary-800 font-medium">
                                            → Agriculture Prices
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="/finance" className="text-primary-700 hover:text-primary-800 font-medium">
                                            → More Finance Articles
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
