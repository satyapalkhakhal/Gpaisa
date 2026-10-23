import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { INDEXABLE_ROBOTS } from '@/lib/seo';
import { AUTHORS, authorNameKey, authorPath, authorPersonId, getAuthorBySlug } from '@/lib/authors';
import { fetchArticlesByAuthor } from '@/lib/articlesApi';
import { SITE_URL, articlePath, toArticleLanguage } from '@/lib/articleLocale';

// Author profile: who writes gpaisa.in articles, and everything they have published.
// Article bylines and Article/NewsArticle markup link here (see lib/authors.ts).

export const revalidate = 3600;
// No `dynamicParams = false`: with it, regenerating this page after revalidateTag('db')
// (every admin article save) served a cached 404. Unknown slugs still 404 via notFound().

export function generateStaticParams() {
    return AUTHORS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const author = getAuthorBySlug(slug);
    if (!author) return { title: 'Author Not Found | gpaisa.in' };

    const url = `${SITE_URL}${authorPath(author)}`;
    const description = `${author.name}, ${author.jobTitle} at gpaisa.in. Background and all articles on gold and silver prices, IPOs, credit cards and personal finance.`;
    return {
        title: `${author.name} — ${author.jobTitle} | gpaisa.in`,
        description,
        alternates: { canonical: url },
        robots: INDEXABLE_ROBOTS,
        openGraph: { title: `${author.name} | gpaisa.in`, description, type: 'profile', url, images: [author.image] },
    };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const author = getAuthorBySlug(slug);
    if (!author) notFound();

    const articles = await fetchArticlesByAuthor(authorNameKey(author));
    const url = `${SITE_URL}${authorPath(author)}`;

    const profileSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url,
        ...(articles[0]?.published_at ? { dateModified: new Date(articles[0].content_updated_at || articles[0].published_at).toISOString() } : {}),
        mainEntity: {
            '@type': 'Person',
            '@id': authorPersonId(author),
            name: author.name,
            jobTitle: author.jobTitle,
            description: author.bio,
            image: author.image,
            url,
            worksFor: { '@type': 'Organization', name: 'gpaisa.in', url: SITE_URL },
            ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
        },
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
            { '@type': 'ListItem', position: 3, name: author.name, item: url },
        ],
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/about" className="hover:text-primary-600">About</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{author.name}</li>
                    </ol>
                </nav>

                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <Image
                            src={author.image}
                            alt={author.name}
                            width={120}
                            height={120}
                            className="rounded-xl object-cover border-2 border-primary-100 shadow-sm flex-shrink-0"
                            priority
                        />
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">{author.name}</h1>
                            <p className="text-primary-600 font-semibold mb-4">{author.jobTitle}, gpaisa.in</p>
                            <p className="text-gray-700 leading-relaxed mb-4">{author.bio}</p>
                            <p className="text-sm text-gray-500">
                                Articles are for information only, not investment advice. Read our{' '}
                                <Link href="/disclaimer" className="text-primary-600 hover:underline">disclaimer</Link> and{' '}
                                <Link href="/about" className="text-primary-600 hover:underline">how gpaisa.in works</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                        Articles by {author.name} ({articles.length})
                    </h2>
                    {articles.length > 0 ? (
                        <ul className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                            {articles.map(article => {
                                const lang = toArticleLanguage(article.language);
                                return (
                                    <li key={article.id} className="p-4 sm:p-5">
                                        <Link
                                            href={articlePath(lang, article.slug)}
                                            hrefLang={lang === 'hi' ? 'hi' : undefined}
                                            className="font-semibold text-gray-900 hover:text-primary-600 leading-snug"
                                        >
                                            {article.title}
                                        </Link>
                                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                                            {article.published_at && (
                                                <time dateTime={new Date(article.published_at).toISOString()}>
                                                    {new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </time>
                                            )}
                                            {article.category && <span>{article.category}</span>}
                                            {lang === 'hi' && <span>हिंदी</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No published articles yet.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
