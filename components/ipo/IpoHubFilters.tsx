import { Metadata } from 'next';
import Link from 'next/link';
import { fetchUpcomingIpos, fetchOpenIpos, fetchClosedIpos, fetchListedIpos } from '@/lib/ipoApi';
import type { Ipo, IpoType } from '@/lib/ipoTypes';

// Shared by the /ipo overview and its filtered views (app/ipo/list/[tab]/[type]), which
// middleware serves at /ipo?tab=&type= so /ipo itself never reads searchParams and stays ISR.

export const IPO_HUB_METADATA: Metadata = {
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

export const TABS = [
    { key: 'open', label: 'Open' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'closed', label: 'Closed' },
    { key: 'listed', label: 'Listed' },
] as const;

export type TabKey = (typeof TABS)[number]['key'];

/** `all` is the path segment for "no type filter". */
export const TYPE_FILTERS = ['all', 'mainboard', 'sme'] as const;

export type TypeFilter = (typeof TYPE_FILTERS)[number];

export function fetchForTab(tab: TabKey, ipoType?: IpoType): Promise<Ipo[]> {
    const opts = { ipoType };
    switch (tab) {
        case 'upcoming': return fetchUpcomingIpos(opts);
        case 'open': return fetchOpenIpos(opts);
        case 'closed': return fetchClosedIpos(opts);
        case 'listed': return fetchListedIpos(opts);
    }
}

/** Tab and type pills. `activeTab` is null on the overview, where no pill is highlighted. */
export function IpoFilterNav({ activeTab, ipoType }: { activeTab: TabKey | null; ipoType?: IpoType }) {
    const tab = activeTab ?? 'open';
    const pill = (active: boolean) =>
        `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`;
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <nav className="flex gap-1 bg-gray-100 rounded-lg p-1" aria-label="IPO status filter">
                {TABS.map(t => (
                    <Link key={t.key} href={`/ipo?tab=${t.key}${ipoType ? `&type=${ipoType}` : ''}`} className={pill(activeTab === t.key)}>
                        {t.label}
                    </Link>
                ))}
            </nav>
            <nav className="flex gap-1 bg-gray-100 rounded-lg p-1" aria-label="IPO type filter">
                <Link href={`/ipo?tab=${tab}`} className={pill(activeTab !== null && !ipoType)}>All</Link>
                <Link href={`/ipo?tab=${tab}&type=mainboard`} className={pill(ipoType === 'mainboard')}>Mainboard</Link>
                <Link href={`/ipo?tab=${tab}&type=sme`} className={pill(ipoType === 'sme')}>SME</Link>
            </nav>
        </div>
    );
}

const WEB_PAGE_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IPO Watch — Mainboard & SME IPOs in India',
    description: 'Upcoming, open, closed and listed IPOs with price band, lot size, GMP, subscription and allotment tracking.',
    url: 'https://www.gpaisa.in/ipo',
    inLanguage: 'en-IN',
    publisher: { '@type': 'Organization', name: 'gpaisa.in', logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' } },
};

const BREADCRUMB_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
        { '@type': 'ListItem', position: 2, name: 'IPO', item: 'https://www.gpaisa.in/ipo' },
    ],
};

/** Page schema, H1 and intro shared by the overview and the filtered views. */
export function IpoHubHeader() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_PAGE_SCHEMA) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
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
        </>
    );
}
