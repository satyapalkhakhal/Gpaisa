import { Metadata } from 'next';
import Link from 'next/link';
import { fetchUpcomingIpos, fetchOpenIpos, fetchClosedIpos, fetchListedIpos } from '@/lib/ipoApi';
import type { Ipo, IpoType } from '@/lib/ipoTypes';
import IpoCard from '@/components/ipo/IpoCard';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { fetchArticlesByCategory } from '@/lib/articlesApi';

// FAQ for the overview; drives both the visible list and the FAQPage schema.
const IPO_FAQ = [
    { question: 'How do I apply for an IPO in India?', answer: 'Through your broker app or your bank\'s net banking using ASBA: choose the IPO, enter the number of lots at a price within the band (or the cut-off price), and approve the UPI mandate or bank block before the issue closes. The money stays blocked in your account until allotment.' },
    { question: 'What is IPO GMP?', answer: 'GMP (grey market premium) is the unofficial premium at which shares of an IPO are said to trade before listing. It is not regulated or reported by any exchange, changes quickly and often differs from the actual listing price, so treat it only as a sentiment indicator.' },
    { question: 'How is IPO allotment decided for retail investors?', answer: 'When the retail portion is oversubscribed, SEBI rules require that as many retail applicants as possible get the minimum lot, chosen by a computerised lottery. Applying for more lots does not raise your chance of getting one lot; using more PAN-linked applications from family members does.' },
    { question: 'When do shares get credited and when do IPOs list?', answer: 'Under SEBI\'s T+3 timeline, allotment is finalised one working day after the issue closes, shares are credited and blocked funds released on the next working day, and the shares list on the exchanges on the third working day after closing.' },
];

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
    // The canonical /ipo (no filters) is an overview of every stage; ?tab=/&type= show one list.
    const overview = !params.tab && !ipoType;

    const [ipos, upcoming, listed, news] = await Promise.all([
        fetchForTab(activeTab, ipoType),
        overview ? fetchUpcomingIpos({}) : Promise.resolve([] as Ipo[]),
        overview ? fetchListedIpos({}) : Promise.resolve([] as Ipo[]),
        overview ? fetchArticlesByCategory('IPO', 4, 300).catch(() => []) : Promise.resolve([]),
    ]);

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'IPO Watch — Mainboard & SME IPOs in India',
        description: 'Upcoming, open, closed and listed IPOs with price band, lot size, GMP, subscription and allotment tracking.',
        url: 'https://www.gpaisa.in/ipo',
        inLanguage: 'en-IN',
        publisher: { '@type': 'Organization', name: 'gpaisa.in', logo: { '@type': 'ImageObject', url: 'https://www.gpaisa.in/icon-512.png' } },
    };
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: IPO_FAQ.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
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
            {overview && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

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
                                !overview && activeTab === tab.key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
                <nav className="flex gap-1 bg-gray-100 rounded-lg p-1" aria-label="IPO type filter">
                    <Link href={`/ipo?tab=${activeTab}`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${!overview && !ipoType ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>All</Link>
                    <Link href={`/ipo?tab=${activeTab}&type=mainboard`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${ipoType === 'mainboard' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>Mainboard</Link>
                    <Link href={`/ipo?tab=${activeTab}&type=sme`} className={`px-3 py-1.5 rounded-md text-sm font-medium ${ipoType === 'sme' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>SME</Link>
                </nav>
            </div>

            {overview ? (
                <>
                    <IpoSection title="Open for subscription now" ipos={ipos} empty="No IPO is open for bidding right now." more="/ipo?tab=open" />
                    <IpoSection title="Upcoming IPOs" ipos={upcoming.slice(0, 6)} empty="No upcoming IPO has announced its dates yet." more="/ipo?tab=upcoming" />
                    <IpoSection title="Recently listed" ipos={listed.slice(0, 6)} empty="No recent listings." more="/ipo?tab=listed" />

                    {news.length > 0 && (
                        <section className="mt-10">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Latest IPO news and analysis</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                {news.map(a => (
                                    <li key={a.id}>
                                        <Link href={`/articles/${a.slug}`} className="font-semibold text-gray-900 hover:text-primary-600 leading-snug">{a.title}</Link>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/category/ipo" className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:underline">All IPO articles →</Link>
                        </section>
                    )}

                    <div className="mt-10 max-w-3xl">
                        <NewsletterSubscribe variant="inline" source="ipo" title="IPO updates by email"
                            description="New IPOs, subscription status and listing results, straight to your inbox." />
                    </div>

                    <section className="mt-10 max-w-3xl">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">How IPOs work in India</h2>
                        <div className="space-y-3 text-[15px] leading-relaxed text-gray-700">
                            <p>
                                A <strong>mainboard IPO</strong> lists on the main NSE and BSE platforms and usually reserves 35% of the issue for retail investors applying up to ₹2 lakh (10% when a loss-making company issues through the QIB route).
                                An <strong>SME IPO</strong> lists on NSE Emerge or BSE SME, has larger lot sizes and is riskier and less liquid. Each card on this page shows the
                                price band, lot size, dates and, where we track it, the latest subscription and grey market premium.
                            </p>
                            <p>
                                Before applying, read the <strong>objects of the issue</strong> (how much is fresh capital and how much is an offer for sale by existing shareholders),
                                the company&apos;s last three years of revenue and profit, and its valuation against listed peers. Our IPO pages with an editorial analysis
                                cover these points; the subscription figures come from exchange data and the{' '}
                                <Link href="/glossary/ipo-gmp" className="text-primary-600 hover:underline">GMP</Link> is always marked unofficial.
                            </p>
                        </div>
                    </section>

                    <section className="mt-10 max-w-3xl">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">Frequently asked questions</h2>
                        <div className="divide-y divide-gray-100">
                            {IPO_FAQ.map(f => (
                                <div key={f.question} className="py-3">
                                    <h3 className="text-[15px] font-semibold text-gray-900">{f.question}</h3>
                                    <p className="mt-1 text-[15px] leading-relaxed text-gray-700">{f.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            ) : ipos.length === 0 ? (
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

function IpoSection({ title, ipos, empty, more }: { title: string; ipos: Ipo[]; empty: string; more: string }) {
    return (
        <section className="mt-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 mb-4">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <Link href={more} className="text-sm font-semibold text-primary-600 hover:underline">See all →</Link>
            </div>
            {ipos.length === 0 ? (
                <p className="text-gray-500 text-sm">{empty}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ipos.map(ipo => <IpoCard key={ipo.id} ipo={ipo} />)}
                </div>
            )}
        </section>
    );
}
