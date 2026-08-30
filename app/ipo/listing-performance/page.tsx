import { Metadata } from 'next';
import Link from 'next/link';
import { fetchListingPerformanceBoard } from '@/lib/ipoApi';
import { getTodayIST } from '@/lib/dateUtils';
import StatusBadge from '@/components/ipo/StatusBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const todayDate = getTodayIST();
    return {
        title: `IPO Listing Performance Tracker — Best & Worst Performers — ${todayDate} | gpaisa.in`,
        description: 'Track how recently listed IPOs actually performed vs. their issue price — listing-day gains and current market price, so you can see how pre-listing GMP estimates played out.',
        openGraph: {
            title: 'IPO Listing Performance Tracker',
            description: 'Listing-day and current gains for recently listed IPOs, compared against issue price.',
            type: 'website',
            url: 'https://www.gpaisa.in/ipo/listing-performance',
            siteName: 'gpaisa.in',
            locale: 'en_IN',
        },
        alternates: { canonical: 'https://www.gpaisa.in/ipo/listing-performance' },
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    };
}

function formatPercent(n: number | null): string {
    if (n == null) return '—';
    return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function gainColor(n: number | null): string {
    if (n == null) return 'text-gray-400';
    return n > 0 ? 'text-green-600' : n < 0 ? 'text-red-600' : 'text-gray-600';
}

export default async function ListingPerformancePage() {
    const todayDate = getTodayIST();
    const board = await fetchListingPerformanceBoard();

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `IPO Listing Performance Tracker — ${todayDate}`,
        description: 'Actual listing-day and current market performance of recently listed IPOs vs. issue price.',
        url: 'https://www.gpaisa.in/ipo/listing-performance',
        inLanguage: 'en-IN',
        dateModified: new Date().toISOString().split('T')[0],
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">IPO Listing Performance</h1>
            <div className="flex items-center gap-2 mb-6">
                <DataSourceBadge kind="official" />
                <p className="text-sm text-gray-500">
                    Actual listing-day and current prices vs. issue price — see how pre-listing GMP estimates actually played out.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {board.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No listing performance data available yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">IPO</th>
                                <th className="px-4 py-3 font-medium">Issue price</th>
                                <th className="px-4 py-3 font-medium">Listing day</th>
                                <th className="px-4 py-3 font-medium">Current price</th>
                                <th className="px-4 py-3 font-medium">Current gain</th>
                                <th className="px-4 py-3 font-medium">Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {board.map(({ ipo, listingGainPercent, currentGainPercent }) => (
                                <tr key={ipo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <Link href={`/ipo/${ipo.slug}`} className="font-semibold text-gray-900 hover:text-primary-600">
                                            {ipo.company?.name || ipo.slug}
                                        </Link>
                                        <span className="block text-xs text-gray-400 uppercase">{ipo.ipo_type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">₹{ipo.price_band_max}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-gray-900 font-medium">₹{ipo.listing_price}</span>
                                        <span className={`block text-xs ${gainColor(listingGainPercent)}`}>{formatPercent(listingGainPercent)}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">{ipo.current_market_price != null ? `₹${ipo.current_market_price}` : '—'}</td>
                                    <td className={`px-4 py-3 font-semibold ${gainColor(currentGainPercent)}`}>{formatPercent(currentGainPercent)}</td>
                                    <td className="px-4 py-3">
                                        {ipo.current_price_updated_at ? <FreshnessBadge timestamp={ipo.current_price_updated_at} staleAfterMinutes={1440} /> : <StatusBadge status={ipo.status} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
                Current market price is refreshed periodically by the gpaisa.in desk and may lag the live exchange price — check the
                "Updated" column, and always confirm the live price on your broker/exchange terminal before trading.
            </p>
        </div>
    );
}
