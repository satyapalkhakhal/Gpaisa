import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { GLOSSARY_TERMS, getGlossaryTermBySlug } from '@/lib/glossaryData';

export async function generateStaticParams() {
    return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const term = getGlossaryTermBySlug(slug);

    if (!term) {
        return { title: 'Term Not Found | gpaisa.in' };
    }

    return {
        title: `What is ${term.term}? Meaning &amp; Definition | gpaisa.in`.replace('&amp;', '&'),
        description: term.shortDefinition,
        alternates: {
            canonical: `https://www.gpaisa.in/glossary/${term.slug}`,
        },
        openGraph: {
            title: `What is ${term.term}?`,
            description: term.shortDefinition,
            type: 'article',
            url: `https://www.gpaisa.in/glossary/${term.slug}`,
            siteName: 'gpaisa.in',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const term = getGlossaryTermBySlug(slug);

    if (!term) {
        notFound();
    }

    const relatedTerms = term.relatedTerms
        .map((s) => getGlossaryTermBySlug(s))
        .filter((t): t is NonNullable<typeof t> => !!t);

    const definedTermSchema = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: term.term,
        alternateName: term.abbreviation,
        description: term.shortDefinition,
        url: `https://www.gpaisa.in/glossary/${term.slug}`,
        inDefinedTermSet: 'https://www.gpaisa.in/glossary',
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://www.gpaisa.in/glossary' },
            { '@type': 'ListItem', position: 3, name: term.term, item: `https://www.gpaisa.in/glossary/${term.slug}` },
        ],
    };

    return (
        <div className="bg-gray-50 py-8 sm:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-primary-600 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" />Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                    <Link href="/glossary" className="hover:text-primary-600">Glossary</Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                    <span className="text-gray-400">{term.term}</span>
                </nav>

                <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full mb-3">{term.category}</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        What is {term.term}?
                    </h1>
                    {term.abbreviation && term.term !== term.abbreviation && (
                        <p className="text-sm text-gray-400 mb-5">{term.abbreviation}</p>
                    )}

                    {/* Direct-answer box */}
                    <div className="bg-primary-50 border-l-4 border-primary-500 rounded-r-lg px-5 py-4 mb-6">
                        <p className="text-gray-800 leading-relaxed">{term.shortDefinition}</p>
                    </div>

                    {term.details.map((para, i) => (
                        <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
                    ))}

                    {term.formula && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 my-5">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Formula</p>
                            <code className="text-base text-gray-800 font-mono font-semibold">{term.formula}</code>
                        </div>
                    )}

                    {term.example && (
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 my-5">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Example</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{term.example}</p>
                        </div>
                    )}

                    {term.relatedCalculator && (
                        <Link
                            href={term.relatedCalculator.href}
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors mt-2"
                        >
                            Try the {term.relatedCalculator.label} →
                        </Link>
                    )}
                </article>

                {relatedTerms.length > 0 && (
                    <div className="mt-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Related Terms</p>
                        <div className="flex flex-wrap gap-2">
                            {relatedTerms.map((rt) => (
                                <Link
                                    key={rt.slug}
                                    href={`/glossary/${rt.slug}`}
                                    className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                                >
                                    {rt.term}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <Link href="/glossary" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        ← Back to full glossary
                    </Link>
                </div>
            </div>
        </div>
    );
}
