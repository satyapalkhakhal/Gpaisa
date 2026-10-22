import { Metadata } from 'next';
import Link from 'next/link';
import { fetchArticlesByLanguage, type Article } from '@/lib/articlesApi';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { SITE_URL } from '@/lib/articleLocale';
import { CATEGORIES, categoryPath } from '@/lib/categories';
import HindiArticleGrid from '@/components/article/HindiArticleGrid';
import HindiCategoryTabs from '@/components/article/HindiCategoryTabs';

// Hindi home: published Hindi articles grouped by category (newest category first), each
// section linking to its /hi/category hub.

const PER_SECTION = 6;

export const revalidate = 3600;

const TITLE = 'हिंदी में पर्सनल फाइनेंस, सोने का भाव और निवेश की खबरें | gpaisa.in';
const DESCRIPTION = 'gpaisa.in पर हिंदी में पढ़ें सोने-चांदी के भाव, आईपीओ, बचत योजनाओं, लोन और निवेश से जुड़े लेख और गाइड।';

export async function generateMetadata(): Promise<Metadata> {
    // An empty hub would be a soft 404, so it stays noindex until a Hindi article is published.
    const hasArticles = (await fetchArticlesByLanguage('hi', 1, 3600)).length > 0;
    return {
        title: TITLE,
        description: DESCRIPTION,
        openGraph: {
            title: TITLE,
            description: DESCRIPTION,
            type: 'website',
            url: `${SITE_URL}/hi`,
            locale: 'hi_IN',
            siteName: 'gpaisa.in',
        },
        alternates: {
            canonical: `${SITE_URL}/hi`,
            types: { 'application/rss+xml': `${SITE_URL}/hi/feed.xml` },
        },
        robots: hasArticles ? INDEXABLE_ROBOTS : { index: false, follow: true },
    };
}

export default async function HindiHomePage() {
    const articles = await fetchArticlesByLanguage('hi', 500, 3600);
    // Articles are newest first, so sections are ordered by each category's latest article.
    const sections: { slug: string; name: string; href: string; items: Article[]; total: number }[] = [];
    for (const article of articles) {
        const category = CATEGORIES.find(c => c.dbValue === (article.category || '').toUpperCase());
        if (!category) continue;
        let section = sections.find(s => s.slug === category.slug);
        if (!section) {
            section = { slug: category.slug, name: category.hiName, href: categoryPath(category, 'hi'), items: [], total: 0 };
            sections.push(section);
        }
        section.total += 1;
        if (section.items.length < PER_SECTION) section.items.push(article);
    }

    return (
        <div className="bg-gray-50 py-6 sm:py-8 min-h-screen">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        हिंदी में पर्सनल फाइनेंस
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
                        सोने-चांदी के भाव, आईपीओ, बचत योजनाएं, लोन और निवेश — आसान हिंदी में, ताकि आप अपने पैसों से जुड़े
                        फैसले समझदारी से ले सकें।
                    </p>
                    <Link
                        href="/hi/gold-rate"
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold hover:bg-amber-100 transition-colors"
                    >
                        🪙 आज सोने का भाव — 24K, 22K, 18K और शहरवार भाव →
                    </Link>
                </header>

                {articles.length === 0 ? (
                    <p className="text-gray-500 bg-white rounded-xl border border-gray-100 p-8 text-center">
                        हिंदी लेख जल्द आ रहे हैं।{' '}
                        <Link href="/news" className="text-primary-600 hover:underline">English articles पढ़ें</Link>
                    </p>
                ) : (
                    <>
                        <HindiCategoryTabs articles={articles} />
                        {sections.map((section, i) => (
                            <section key={section.slug} className="mb-10">
                                <div className="flex items-baseline justify-between mb-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        <Link href={section.href} className="hover:text-primary-600">{section.name}</Link>
                                    </h2>
                                    <Link href={section.href} className="text-sm font-semibold text-primary-600 hover:underline whitespace-nowrap">
                                        सभी देखें ({section.total}) →
                                    </Link>
                                </div>
                                <HindiArticleGrid articles={section.items} priorityCount={i === 0 ? 3 : 0} />
                            </section>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
