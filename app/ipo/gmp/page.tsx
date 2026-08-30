import { Metadata } from 'next';
import Link from 'next/link';
import { fetchLatestGmpBoard, type GmpBoardEntry } from '@/lib/ipoApi';
import { getTodayIST } from '@/lib/dateUtils';
import StatusBadge from '@/components/ipo/StatusBadge';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const todayDate = getTodayIST();
    return {
        title: `IPO GMP Today — Grey Market Premium — ${todayDate} | gpaisa.in`,
        description: `Today's IPO GMP (Grey Market Premium) for open and upcoming mainboard & SME IPOs, updated ${todayDate}. Unofficial market data — clearly labeled, never guaranteed.`,
        openGraph: {
            title: `IPO GMP Today — ${todayDate}`,
            description: "Today's IPO Grey Market Premium for open and upcoming IPOs, with estimated listing gains.",
            type: 'website',
            url: 'https://www.gpaisa.in/ipo/gmp',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/ipo/gmp' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

function GmpTable({ board }: { board: GmpBoardEntry[] }) {
    if (board.length === 0) {
        return <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-100">No active IPOs with GMP data right now.</div>;
    }
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                    <tr>
                        <th className="px-4 py-3 font-medium">IPO</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">GMP</th>
                        <th className="px-4 py-3 font-medium">Est. Listing</th>
                        <th className="px-4 py-3 font-medium">Updated</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {board.map(({ ipo, latestGmp }) => (
                        <tr key={ipo.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <Link href={`/ipo/${ipo.slug}`} className="font-semibold text-gray-900 hover:text-primary-600">
                                    {ipo.company?.name || ipo.slug}
                                </Link>
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={ipo.status} /></td>
                            <td className="px-4 py-3 text-gray-700">
                                {ipo.price_band_max ? `₹${ipo.price_band_min ?? ipo.price_band_max}–${ipo.price_band_max}` : '—'}
                            </td>
                            <td className="px-4 py-3">
                                {latestGmp ? (
                                    <span className="font-semibold text-gray-900">
                                        ₹{latestGmp.gmp_value}
                                        {latestGmp.gmp_percentage != null && <span className="text-gray-400 font-normal"> ({latestGmp.gmp_percentage > 0 ? '+' : ''}{latestGmp.gmp_percentage}%)</span>}
                                        {' '}{latestGmp.direction === 'up' ? '↑' : latestGmp.direction === 'down' ? '↓' : ''}
                                    </span>
                                ) : <span className="text-gray-400">No data</span>}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{latestGmp?.estimated_listing_price ? `₹${latestGmp.estimated_listing_price}` : '—'}</td>
                            <td className="px-4 py-3">{latestGmp ? <FreshnessBadge timestamp={latestGmp.recorded_at} staleAfterMinutes={180} /> : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function IpoGmpPage() {
    const todayDate = getTodayIST();
    const board = await fetchLatestGmpBoard();
    const mainboardBoard = board.filter(e => e.ipo.ipo_type === 'mainboard');
    const smeBoard = board.filter(e => e.ipo.ipo_type === 'sme');

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `IPO GMP Today — ${todayDate}`,
        description: "Today's IPO Grey Market Premium for open and upcoming IPOs. Unofficial market data, not official exchange information.",
        url: 'https://www.gpaisa.in/ipo/gmp',
        inLanguage: 'en-IN',
        dateModified: new Date().toISOString().split('T')[0],
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">IPO GMP Today — {todayDate}</h1>
            <div className="flex items-center gap-2 mb-6">
                <DataSourceBadge kind="unofficial" />
                <p className="text-sm text-gray-500">
                    Grey Market Premium is unofficial, unregulated market chatter — not a guaranteed listing price. It can change rapidly.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Mainboard IPO GMP</h2>
                <GmpTable board={mainboardBoard} />
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">SME IPO GMP</h2>
                <GmpTable board={smeBoard} />
            </section>

            <p className="text-xs text-gray-400 mt-4">
                GMP figures are sourced from the gpaisa.in research desk's own market tracking and are not sourced from NSE/BSE.
                They reflect unofficial grey market sentiment and can differ significantly from the actual listing price.
            </p>
        </div>
    );
}
