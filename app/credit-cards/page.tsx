import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCreditCardArticles, Article } from '@/lib/articlesApi';
import { formatArticleDate } from '@/components/home/HomeUi';

export const revalidate = 3600;

const PAGE_URL = 'https://www.gpaisa.in/credit-cards';

type SectionKey = 'best' | 'reviews' | 'comparisons' | 'score';

const SECTIONS: { key: SectionKey; title: string }[] = [
    { key: 'best', title: 'Best credit cards' },
    { key: 'reviews', title: 'Card reviews' },
    { key: 'comparisons', title: 'Comparisons' },
    { key: 'score', title: 'Credit score' },
];

/** Buckets an article by what the reader is trying to do, judged from its title. */
function sectionOf(article: Article): SectionKey {
    const title = article.title;
    if (/cibil|credit score/i.test(title)) return 'score';
    if (/\bvs\.?\b/i.test(title)) return 'comparisons';
    // Only best-of lists ("Best Credit Cards…"), not single-card reviews asking "is this the best…?"
    if (/^best\b|best credit cards|top picks/i.test(title)) return 'best';
    return 'reviews';
}

export async function generateMetadata(): Promise<Metadata> {
    const year = new Date().getFullYear();
    const hasArticles = (await fetchCreditCardArticles(1)).length > 0;
    const title = `Credit Cards in India ${year} — Reviews, Comparisons & Best Cards | gpaisa.in`;
    const description = `Honest credit card reviews, side-by-side comparisons and best-card picks for travel, dining and cashback in India (${year}), plus how to improve your CIBIL score.`;
    return {
        title,
        description,
        alternates: { canonical: PAGE_URL },
        openGraph: { title, description, url: PAGE_URL, siteName: 'gpaisa.in', locale: 'en_IN', type: 'website' },
        // An empty hub is a soft-404 — keep it out of the index until it has content.
        robots: hasArticles
            ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
            : { index: false, follow: true },
    };
}

const ArticleCard = ({ article }: { article: Article }) => (
    <Link
        href={`/articles/${article.slug}`}
        className="group block bg-white rounded-xl border border-gw-border overflow-hidden hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-shadow"
    >
        <div className="relative aspect-[16/9] bg-gw-bg">
            {article.image_url && (
                <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            )}
        </div>
        <div className="p-4">
            <h3 className="text-sm font-medium text-gw-text leading-snug line-clamp-2 group-hover:text-gw-green transition-colors">{article.title}</h3>
            <p className="text-xs text-gw-sub mt-1.5">{formatArticleDate(article)}</p>
        </div>
    </Link>
);

export default async function CreditCardsPage() {
    const articles = await fetchCreditCardArticles(60);
    const grouped = SECTIONS
        .map(section => ({ ...section, articles: articles.filter(a => sectionOf(a) === section.key) }))
        .filter(section => section.articles.length > 0);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${PAGE_URL}#webpage`,
                url: PAGE_URL,
                name: 'Credit Cards in India — Reviews, Comparisons & Best Cards',
                inLanguage: 'en-IN',
                isPartOf: { '@id': 'https://www.gpaisa.in/#website' },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
                    { '@type': 'ListItem', position: 2, name: 'Credit Cards', item: PAGE_URL },
                ],
            },
            {
                '@type': 'ItemList',
                numberOfItems: articles.length,
                itemListElement: articles.map((a, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: `https://www.gpaisa.in/articles/${a.slug}`,
                    name: a.title,
                })),
            },
        ],
    };

    return (
        <div className="bg-white text-gw-text">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <nav aria-label="Breadcrumb" className="text-xs text-gw-sub mb-3">
                    <Link href="/" className="hover:text-gw-green">Home</Link>
                    <span className="mx-1.5">/</span>
                    <span className="text-gw-text">Credit Cards</span>
                </nav>

                <h1 className="text-2xl sm:text-3xl font-medium text-gw-text">Credit Cards</h1>
                <p className="text-sm text-gw-sub mt-1">Reviews, comparisons and the best cards for travel, dining and cashback.</p>

                {grouped.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto mt-5 pb-1 [scrollbar-width:none]">
                        {grouped.map(section => (
                            <a
                                key={section.key}
                                href={`#${section.key}`}
                                className="shrink-0 rounded-full border border-gw-border bg-white px-4 py-1.5 text-sm text-gw-text hover:border-gw-green hover:text-gw-green transition-colors"
                            >
                                {section.title} <span className="opacity-60">({section.articles.length})</span>
                            </a>
                        ))}
                    </div>
                )}

                {grouped.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-gw-sub">Credit card reviews are coming soon.</p>
                ) : (
                    <div className="space-y-10 mt-8">
                        {grouped.map(section => (
                            <section key={section.key} id={section.key} aria-labelledby={`${section.key}-heading`} className="scroll-mt-24">
                                <h2 id={`${section.key}-heading`} className="text-lg sm:text-xl font-medium text-gw-text mb-4">{section.title}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {section.articles.map(article => <ArticleCard key={article.id} article={article} />)}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                <p className="mt-12 pt-6 border-t border-gw-border text-xs text-gw-sub leading-relaxed">
                    Card features, fees and offers change often — confirm the latest terms on the issuer&apos;s website before you apply.{' '}
                    <Link href="/disclaimer" className="text-gw-green font-medium hover:underline">Disclaimer</Link>
                </p>
            </div>
        </div>
    );
}
