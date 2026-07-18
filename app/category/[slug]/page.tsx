import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchArticlesByCategorySlug } from '@/lib/supabaseApi';
import { getCategoryBySlug } from '@/lib/categories';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

export const revalidate = 86400; // Cache for 1 day (ISR)

export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;
    const currentPage = parseInt(pageParam || '1', 10);
    const category = getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Category Not Found | gpaisa.in',
        };
    }

    const canonicalUrl = currentPage > 1
        ? `https://www.gpaisa.in/category/${slug}?page=${currentPage}`
        : `https://www.gpaisa.in/category/${slug}`;

    // A category hub with zero published articles is a soft-404 — Google penalizes
    // thin/empty pages that return 200. Noindex it until it has real content.
    const hasArticles = (await fetchArticlesByCategorySlug(slug, 1)).length > 0;

    return {
        title: currentPage > 1 ? `${category.name} — Page ${currentPage} | gpaisa.in` : `${category.name} | gpaisa.in`,
        description: category.description,
        alternates: {
            canonical: canonicalUrl
        },
        robots: hasArticles
            ? { index: true, follow: true }
            : { index: false, follow: true },
    };
}

export default async function CategoryPage({ params, searchParams }: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { slug } = await params;
    const { page: pageParam } = await searchParams;
    const currentPage = parseInt(pageParam || '1', 10);

    const category = getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    // Fetch all articles for this category
    const allArticles = await fetchArticlesByCategorySlug(slug, 1000);

    // Calculate pagination
    const totalArticles = allArticles.length;
    const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const articles = allArticles.slice(startIndex, endIndex);

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: category.name, item: `https://www.gpaisa.in/category/${slug}` },
        ],
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{category.name}</li>
                    </ol>
                </nav>

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <Newspaper className="h-10 w-10 text-primary-600" />
                        <h1 className="text-4xl font-display font-bold text-gray-900">{category.name}</h1>
                    </div>
                    <p className="text-lg text-gray-600">{category.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Showing {startIndex + 1}-{Math.min(endIndex, totalArticles)} of {totalArticles} articles
                    </p>
                </div>

                {/* Articles Grid */}
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {articles.map(article => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                            >
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    {article.featured_image_url ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={article.featured_image_url}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Newspaper className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h2 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 mb-2 leading-snug">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            {article.published_at
                                                ? new Date(article.published_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : 'Recent'}
                                        </span>
                                        <span className="text-primary-600 font-semibold group-hover:underline">
                                            Read more →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No articles found in this category.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {/* Previous Button */}
                        {currentPage > 1 ? (
                            <Link
                                href={`/category/${slug}?page=${currentPage - 1}`}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </button>
                        )}

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                // Show first page, last page, current page, and pages around current
                                const showPage =
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                                if (!showPage) {
                                    // Show ellipsis
                                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                }

                                return (
                                    <Link
                                        key={pageNum}
                                        href={`/category/${slug}?page=${pageNum}`}
                                        className={`px-4 py-2 rounded-lg border transition ${pageNum === currentPage
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        {currentPage < totalPages ? (
                            <Link
                                href={`/category/${slug}?page=${currentPage + 1}`}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="flex items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
