import { Metadata } from 'next';
import Link from 'next/link';
import { fetchIpoBySlug } from '@/lib/ipoApi';
import type { IpoDetail } from '@/lib/ipoTypes';
import { RECOMMENDATION_LABELS } from '@/lib/ipoTypes';
import StatusBadge from '@/components/ipo/StatusBadge';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';

// User-selection-driven page with unbounded query-string combinations — never index it,
// same "avoid low-value duplicate pages" reasoning as any other search/filter-result page.
export const metadata: Metadata = {
    title: 'Compare IPOs | gpaisa.in',
    robots: { index: false, follow: true },
};

function formatDate(d: string | null): string {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function latestOverallSubscription(ipo: IpoDetail) {
    const overall = ipo.subscription_history.filter(u => u.category === 'overall');
    if (overall.length === 0) return null;
    return overall.reduce((latest, u) => (u.day_number > latest.day_number ? u : latest));
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ipos?: string }> }) {
    const params = await searchParams;
    const slugs = (params.ipos || '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);

    const results = await Promise.all(slugs.map(slug => fetchIpoBySlug(slug)));
    const ipos = results.filter((ipo): ipo is IpoDetail => ipo != null);

    if (ipos.length < 2) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Compare IPOs</h1>
                <p className="text-gray-500 mb-6">
                    {slugs.length === 0
                        ? 'Select at least two IPOs to compare using the "Compare" button on any IPO card or detail page.'
                        : 'One or more selected IPOs could not be found. Select at least two valid IPOs to compare.'}
                </p>
                <Link href="/ipo" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg px-5 py-2.5">
                    Browse IPOs
                </Link>
            </div>
        );
    }

    const rows: { label: string; render: (ipo: IpoDetail) => React.ReactNode }[] = [
        { label: 'Type', render: ipo => <span className="uppercase">{ipo.ipo_type}</span> },
        { label: 'Status', render: ipo => <StatusBadge status={ipo.status} /> },
        {
            label: 'Price band',
            render: ipo => (ipo.price_band_min != null ? `₹${ipo.price_band_min} – ₹${ipo.price_band_max}` : 'TBA'),
        },
        { label: 'Lot size', render: ipo => (ipo.lot_size ? `${ipo.lot_size} shares` : 'TBA') },
        {
            label: 'Min. investment (retail)',
            render: ipo => (ipo.price_band_max && ipo.lot_size ? `₹${(ipo.price_band_max * ipo.lot_size).toLocaleString('en-IN')}` : 'TBA'),
        },
        { label: 'Total issue size', render: ipo => (ipo.total_issue_size ? `₹${ipo.total_issue_size} Cr` : 'TBA') },
        { label: 'Open date', render: ipo => formatDate(ipo.open_date) },
        { label: 'Close date', render: ipo => formatDate(ipo.close_date) },
        { label: 'Listing date', render: ipo => formatDate(ipo.listing_date) },
        {
            label: 'Latest GMP',
            render: ipo => {
                const gmp = ipo.gmp_history[0];
                if (!gmp) return <span className="text-gray-400">No data</span>;
                return (
                    <div>
                        <span className="font-semibold">
                            ₹{gmp.gmp_value}{gmp.gmp_percentage != null && ` (${gmp.gmp_percentage > 0 ? '+' : ''}${gmp.gmp_percentage}%)`}
                        </span>
                        <FreshnessBadge timestamp={gmp.recorded_at} staleAfterMinutes={180} className="block mt-0.5" />
                    </div>
                );
            },
        },
        {
            label: 'Latest subscription (overall)',
            render: ipo => {
                const sub = latestOverallSubscription(ipo);
                return sub ? `${sub.subscription_times}x (Day ${sub.day_number})` : <span className="text-gray-400">No data</span>;
            },
        },
        {
            label: 'Listing performance',
            render: ipo =>
                ipo.listing_price != null && ipo.price_band_max != null ? (
                    <span className={ipo.listing_price >= ipo.price_band_max ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {ipo.listing_price >= ipo.price_band_max ? '+' : ''}
                        {(((ipo.listing_price - ipo.price_band_max) / ipo.price_band_max) * 100).toFixed(1)}%
                    </span>
                ) : (
                    <span className="text-gray-400">Not listed yet</span>
                ),
        },
        {
            label: 'gpaisa.in review',
            render: ipo =>
                ipo.review?.recommendation ? (
                    <div>
                        <span className="font-semibold">{RECOMMENDATION_LABELS[ipo.review.recommendation]}</span>
                        {ipo.review.overall_score != null && <span className="text-gray-400"> ({ipo.review.overall_score}/10)</span>}
                    </div>
                ) : (
                    <span className="text-gray-400">No review yet</span>
                ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 pb-28">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Compare IPOs</h1>
            <div className="flex items-center gap-2 mb-6">
                <DataSourceBadge kind="unofficial" />
                <p className="text-sm text-gray-500">GMP figures shown here are unofficial market data — see each IPO's detail page for full source attribution.</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
                <table className="w-full text-sm min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-4 py-3 font-medium text-gray-500 w-48">&nbsp;</th>
                            {ipos.map(ipo => (
                                <th key={ipo.id} className="px-4 py-3">
                                    <Link href={`/ipo/${ipo.slug}`} className="font-bold text-gray-900 hover:text-primary-600">
                                        {ipo.company?.name || ipo.slug}
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.map(row => (
                            <tr key={row.label}>
                                <td className="px-4 py-3 text-gray-500 font-medium align-top">{row.label}</td>
                                {ipos.map(ipo => (
                                    <td key={ipo.id} className="px-4 py-3 text-gray-900 align-top">{row.render(ipo)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
