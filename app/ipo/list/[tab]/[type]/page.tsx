import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { IpoType } from '@/lib/ipoTypes';
import IpoCard from '@/components/ipo/IpoCard';
import { IPO_HUB_METADATA, TABS, TYPE_FILTERS, fetchForTab, IpoFilterNav, IpoHubHeader, type TabKey, type TypeFilter } from '@/components/ipo/IpoHubFilters';

// Filtered IPO lists. Users reach these as /ipo?tab=&type=, which middleware rewrites here,
// so each of the 12 combinations is a pre-built ISR page instead of a per-request render.

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
    return TABS.flatMap(t => TYPE_FILTERS.map(type => ({ tab: t.key, type })));
}

export const metadata: Metadata = IPO_HUB_METADATA;

export default async function IpoFilteredPage({ params }: { params: Promise<{ tab: string; type: string }> }) {
    const { tab, type } = await params;
    if (!TABS.some(t => t.key === tab) || !TYPE_FILTERS.includes(type as TypeFilter)) notFound();
    const activeTab = tab as TabKey;
    const ipoType = type === 'all' ? undefined : (type as IpoType);

    const ipos = await fetchForTab(activeTab, ipoType);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <IpoHubHeader />
            <IpoFilterNav activeTab={activeTab} ipoType={ipoType} />
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
