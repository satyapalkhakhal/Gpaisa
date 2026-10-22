import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { CATEGORIES, categoryLanguageAlternates, categoryPath, getCategoryBySlug } from '@/lib/categories';
import { fetchArticlesByCategory, fetchArticlesByLanguage } from '@/lib/articlesApi';
import { SITE_URL } from '@/lib/articleLocale';
import HindiArticleGrid from '@/components/article/HindiArticleGrid';
import HindiCategoryTabs from '@/components/article/HindiCategoryTabs';

// Hindi category hubs (/hi/category/<slug>): the Hindi articles of one category, newest first.
// Same slugs as the English hubs, so the two are paired by hreflang once both have articles.

const ITEMS_PER_PAGE = 15;

export const revalidate = 3600;

export function generateStaticParams() {
    return CATEGORIES.map(c => ({ slug: c.slug }));
}

const pageNumber = (value?: string) => Math.max(1, parseInt(value || '1', 10) || 1);

export async function generateMetadata({ params, searchParams }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) return { title: 'श्रेणी नहीं मिली | gpaisa.in' };

    const page = pageNumber((await searchParams).page);
    const path = categoryPath(category, 'hi');
    const canonical = `${SITE_URL}${path}${page > 1 ? `?page=${page}` : ''}`;
    const [hindi, english] = await Promise.all([
        fetchArticlesByCategory(category.dbValue, 1, 3600, 'hi'),
        fetchArticlesByCategory(category.dbValue, 1, 3600, 'en'),
    ]);
    const title = `${category.hiName} की खबरें हिंदी में${page > 1 ? ` — पेज ${page}` : ''} | gpaisa.in`;
    const languages = page === 1 ? categoryLanguageAlternates(category, english.length > 0, hindi.length > 0) : undefined;

    return {
        title,
        description: category.hiDescription,
        alternates: { canonical, ...(languages ? { languages } : {}) },
        openGraph: { title, description: category.hiDescription, type: 'website', url: canonical, locale: 'hi_IN', siteName: 'gpaisa.in' },
        // An empty hub is a soft 404, so it stays noindex until its first Hindi article.
        robots: hindi.length > 0 ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiCategoryPage({ params, searchParams }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) notFound();

    const page = pageNumber((await searchParams).page);
    const [all, allHindi] = await Promise.all([
        fetchArticlesByCategory(category.dbValue, 1000, 3600, 'hi'),
        fetchArticlesByLanguage('hi', 500, 3600),
    ]);
    const totalPages = Math.max(1, Math.ceil(all.length / ITEMS_PER_PAGE));
    if (page > totalPages) notFound();
    const articles = all.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const path = categoryPath(category, 'hi');

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'होम', item: `${SITE_URL}/hi` },
            { '@type': 'ListItem', position: 2, name: category.hiName, item: `${SITE_URL}${path}` },
        ],
    };

    return (
        <div className="bg-gray-50 py-6 sm:py-8 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <nav className="mb-5" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-sm text-gray-600">
                        <li><Link href="/hi" className="hover:text-primary-600">होम</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{category.hiName}</li>
                    </ol>
                </nav>

                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{category.hiName} की खबरें</h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">{category.hiDescription}</p>
                </header>

                <HindiCategoryTabs current={category.slug} articles={allHindi} />

                {articles.length === 0 ? (
                    <p className="text-gray-500 bg-white rounded-xl border border-gray-100 p-8 text-center">
                        इस श्रेणी में हिंदी लेख जल्द आ रहे हैं।{' '}
                        <Link href="/hi" className="text-primary-600 hover:underline">बाकी हिंदी लेख पढ़ें</Link>
                    </p>
                ) : (
                    <HindiArticleGrid articles={articles} />
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                        {page > 1 && (
                            <Link href={page === 2 ? path : `${path}?page=${page - 1}`} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <ChevronLeft className="w-4 h-4 mr-1" />पिछला
                            </Link>
                        )}
                        <span className="text-sm text-gray-600">पेज {page} / {totalPages}</span>
                        {page < totalPages && (
                            <Link href={`${path}?page=${page + 1}`} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                अगला<ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
