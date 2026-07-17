import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { GLOSSARY_TERMS, getGlossaryTermsByCategory } from '@/lib/glossaryData';

export const metadata: Metadata = {
    title: 'Financial Glossary — Investing, Tax & Savings Terms Explained | gpaisa.in',
    description: 'Clear, jargon-free definitions of Indian financial terms — CAGR, SIP, XIRR, PPF, HRA, GST, and more. Every term links to a calculator so you can act on it immediately.',
    alternates: {
        canonical: 'https://www.gpaisa.in/glossary',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const dynamic = 'force-static';

const CATEGORY_ORDER = ['Investing', 'Tax', 'Loans', 'Savings', 'Markets'];

export default function GlossaryIndexPage() {
    const grouped = getGlossaryTermsByCategory();

    const definedTermSetSchema = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: 'gpaisa.in Financial Glossary',
        description: 'Definitions of Indian personal finance, investing, and tax terms.',
        url: 'https://www.gpaisa.in/glossary',
        hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            url: `https://www.gpaisa.in/glossary/${t.slug}`,
            description: t.shortDefinition,
        })),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://www.gpaisa.in/glossary' },
        ],
    };

    return (
        <div className="bg-gray-50 py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <header className="mb-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <BookOpen className="h-9 w-9 text-primary-600" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Financial Glossary</h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">
                        Plain-language definitions of {GLOSSARY_TERMS.length} Indian personal finance, investing, and tax terms — each linked to the calculator you need to act on it.
                    </p>
                </header>

                <div className="space-y-10">
                    {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((category) => (
                        <section key={category}>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{category}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {grouped[category].map((t) => (
                                    <Link
                                        key={t.slug}
                                        href={`/glossary/${t.slug}`}
                                        className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                                    >
                                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                                            {t.term}
                                            {t.abbreviation && t.term !== t.abbreviation && <span className="text-gray-400 font-normal"> — {t.abbreviation}</span>}
                                        </h3>
                                        <p className="text-xs text-gray-600 line-clamp-2">{t.shortDefinition}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
