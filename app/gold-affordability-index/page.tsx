import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingDown, Info } from 'lucide-react';
import {
    GOLD_HISTORICAL_DATA,
    calculateGoldAffordabilityIndex,
    AFFORDABILITY_REFERENCE_AMOUNT,
} from '@/lib/goldHistoricalData';
import GoldAffordabilityChart from '@/components/gold-affordability/GoldAffordabilityChart';

export const metadata: Metadata = {
    title: 'Gold Affordability Index — How Much Gold Does ₹10,000 Buy? (1964–2026) | gpaisa.in',
    description: 'gpaisa.in\'s Gold Affordability Index tracks how many grams of 24K gold a fixed ₹10,000 could buy every year from 1964 to 2026, using 62 years of verified RBI/IBJA price data.',
    alternates: {
        canonical: 'https://www.gpaisa.in/gold-affordability-index',
    },
    openGraph: {
        title: 'Gold Affordability Index — How Much Gold Does ₹10,000 Buy? | gpaisa.in',
        description: 'Track how many grams of 24K gold a fixed ₹10,000 could buy each year from 1964 to 2026.',
        type: 'article',
        url: 'https://www.gpaisa.in/gold-affordability-index',
        siteName: 'gpaisa.in',
    },
    robots: { index: true, follow: true },
};

export const dynamic = 'force-static';

export default function GoldAffordabilityIndexPage() {
    const indexData = calculateGoldAffordabilityIndex();
    const first = indexData[0];
    const last = indexData[indexData.length - 1];
    const declineMultiple = Math.round((first.gramsPerReference / last.gramsPerReference) * 10) / 10;

    const decadeMarkers = indexData.filter((d) => d.year % 10 === 4 || d.year === last.year);

    const datasetSchema = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: 'gpaisa.in Gold Affordability Index (1964–2026)',
        description: `Grams of 24K gold a fixed ₹${AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')} could buy, by year, derived from annual 24K gold prices in India from 1964 to 2026.`,
        url: 'https://www.gpaisa.in/gold-affordability-index',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: { '@type': 'Organization', name: 'gpaisa.in', url: 'https://www.gpaisa.in' },
        temporalCoverage: '1964/2026',
        variableMeasured: 'Grams of 24K gold purchasable with a fixed ₹10,000',
        measurementTechnique: 'Derived from annual average 24K gold spot price per 10 grams (RBI Handbook of Statistics, IBJA, MCX)',
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Gold Affordability Index — How Much Gold Does ₹10,000 Buy? (1964–2026)',
        description: 'A 62-year index tracking how many grams of 24K gold a fixed ₹10,000 could buy in India, year by year.',
        author: { '@type': 'Organization', name: 'gpaisa.in', url: 'https://www.gpaisa.in' },
        publisher: {
            '@type': 'Organization',
            name: 'gpaisa.in',
            logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' },
        },
        datePublished: '2026-07-18',
        dateModified: '2026-07-18',
        mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.gpaisa.in/gold-affordability-index' },
        inLanguage: 'en-IN',
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Gold Affordability Index', item: 'https://www.gpaisa.in/gold-affordability-index' },
        ],
    };

    return (
        <div className="bg-gray-50 py-8 sm:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <TrendingDown className="h-9 w-9 text-amber-600" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">gpaisa.in Gold Affordability Index</h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        How many grams of 24K gold has a fixed ₹{AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')} bought, every year, from 1964 to 2026?
                    </p>
                </header>

                {/* Direct-answer box */}
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg px-5 py-4 mb-8">
                    <p className="text-gray-800 leading-relaxed">
                        In {first.year}, ₹{AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')} could buy <strong>{first.gramsPerReference.toLocaleString('en-IN')} grams</strong> of 24K gold — over 1.5 kg. In {last.year}, the same ₹{AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')} buys just <strong>{last.gramsPerReference.toLocaleString('en-IN')} grams</strong>. A fixed rupee amount's gold-purchasing-power has fallen roughly <strong>{declineMultiple.toLocaleString('en-IN')}×</strong> over 62 years.
                    </p>
                </div>

                <GoldAffordabilityChart data={indexData} />

                {/* Decade markers table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-8">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Decade Markers</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Year</th>
                                    <th className="text-right px-4 py-3 font-semibold text-gray-700">24K Price / 10g</th>
                                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Grams per ₹{AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decadeMarkers.map((d, i) => (
                                    <tr key={d.year} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-4 py-2.5 font-medium text-gray-800">{d.year}</td>
                                        <td className="px-4 py-2.5 text-right text-gray-700">₹{d.price.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-2.5 text-right font-semibold text-amber-700">{d.gramsPerReference.toLocaleString('en-IN')} g</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Methodology disclosure */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Methodology &amp; Scope</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                This index measures only the gold-purchasing-power of a fixed nominal ₹{AFFORDABILITY_REFERENCE_AMOUNT.toLocaleString('en-IN')} — it does <strong>not</strong> adjust for inflation, and it does <strong>not</strong> incorporate wage or income data. We deliberately avoided pairing this with a historical Indian salary series because no reliably verifiable year-by-year income dataset exists for the full 1964–2026 span; publishing an estimated one would risk presenting fabricated figures as fact.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Underlying gold prices are the same annual 24K rates (per 10 grams, INR) used throughout gpaisa.in's{' '}
                                <Link href="/gold-rate#gold-price-history" className="text-amber-700 underline hover:text-amber-800">historical gold price dataset</Link>
                                , sourced from the RBI Handbook of Statistics, IBJA, and MCX historical records.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <Link href="/gold-rate" className="inline-flex items-center px-4 py-2 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors">
                        Live Gold Rate Today
                    </Link>
                    <Link href="/gold-vs-silver" className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-300 transition-colors">
                        Gold vs Silver Comparison
                    </Link>
                    <a href="/gold_prices_india_1964_2026.csv" download className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-300 transition-colors">
                        Download Raw Dataset (CSV)
                    </a>
                </div>
            </div>
        </div>
    );
}
