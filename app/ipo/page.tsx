import { Metadata } from 'next';
import Link from 'next/link';
import { fetchUpcomingIpos, fetchOpenIpos, fetchClosedIpos, fetchListedIpos } from '@/lib/ipoApi';
import type { Ipo, IpoType } from '@/lib/ipoTypes';
import IpoCard from '@/components/ipo/IpoCard';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'IPO Watch — Mainboard & SME IPO GMP, Subscription, Allotment | gpaisa.in',
        description: 'Track upcoming, open, and recently closed mainboard and SME IPOs in India — price band, lot size, GMP, subscription status, allotment, and listing dates, all in one place.',
        openGraph: {
            title: 'IPO Watch — Mainboard & SME IPOs in India',
            description: 'Upcoming, open, and closed IPOs with price band, lot size, GMP, subscription, and allotment tracking.',
            type: 'website',
            url: 'https://www.gpaisa.in/ipo',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/ipo' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

const TABS = [
    { key: 'open', label: 'Open' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'closed', label: 'Closed' },
    { key: 'listed', label: 'Listed' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

async function fetchForTab(tab: TabKey, ipoType?: IpoType): Promise<Ipo[]> {
    const opts = { ipoType };
    switch (tab) {
        case 'upcoming': return fetchUpcomingIpos(opts);
        case 'open': return fetchOpenIpos(opts);
        case 'closed': return fetchClosedIpos(opts);
        case 'listed': return fetchListedIpos(opts);
    }
}

export default async function IpoHubPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; type?: string }>;
}) {
    const params = await searchParams;
    const activeTab: TabKey = TABS.some(t => t.key === params.tab) ? (params.tab as TabKey) : 'open';
    const ipoType = params.type === 'mainboard' || params.type === 'sme' ? (params.type as IpoType) : undefined;

    const ipos = await fetchForTab(activeTab, ipoType);

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'IPO Watch — Mainboard & SME IPOs in India',
        description: 'Upcoming, open, closed and listed IPOs with price band, lot size, GMP, subscription and allotment tracking.',
        url: 'https://www.gpaisa.in/ipo',
        inLanguage: 'en-IN',
        publisher: { '@type': 'Organization', name: 'gpaisa.in', logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' } },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'IPO', item: 'https://www.gpaisa.in/ipo' },
        ],
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">IPO Watch</h1>
                <p className="text-gray-600 max-w-2xl">
                    Mainboard and SME IPOs with price band, lot size, dates, GMP, subscription, and allotment — clearly labeled by source
                    so you always know what's official, what's unofficial market chatter, and what's editorial opinion.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                    <Link href="/ipo/gmp" className="text-sm font-semibold text-primary-600 hover:underline">Today's IPO GMP →</Link>
                    <Link href="/ipo-calculator/lot-size-calculator" className="text-sm font-semibold text-primary-600 hover:underline">IPO Calculators →</Link>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <nav className="flex gap-1 bg-gray-100 rounded-lg p-1" aria-label="IPO status filter">
                    {TABS.map(tab => (
                        <Link
                            key={tab.key}
                            href={`/ipo?tab=${tab.key}${ipoType ? `&type=${ipoType}` : ''}`}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
                <nav className="flex gap-1 bg-gray-100 rounded-lg p-1" aria-label="IPO type filter">
                    <Link href={`/ipo?tab=${activeTab}`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${!ipoType ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>All</Link>
                    <Link href={`/ipo?tab=${activeTab}&type=mainboard`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${ipoType === 'mainboard' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>Mainboard</Link>
                    <Link href={`/ipo?tab=${activeTab}&type=sme`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${ipoType === 'sme' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>SME</Link>
                </nav>
            </div>

            {ipos.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
                    No {activeTab} IPOs {ipoType ? `(${ipoType})` : ''} right now. Check back soon.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ipos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} />)}
                </div>
            )}
        </div>
    );
}
