import Link from 'next/link';
import type { Ipo } from '@/lib/ipoTypes';

function shortDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}

function currentLabel(ipo: Ipo): string {
    if (ipo.status === 'open') return ipo.close_date ? `Open · closes ${shortDate(ipo.close_date)}` : 'Open now';
    return ipo.open_date ? `Opens ${shortDate(ipo.open_date)}` : 'Dates to be announced';
}

function listingGain(ipo: Ipo): number | null {
    if (ipo.listing_price == null || !ipo.price_band_max) return null;
    return ((ipo.listing_price - ipo.price_band_max) / ipo.price_band_max) * 100;
}

const Row = ({ ipo, right, rightClass = 'text-gray-500' }: { ipo: Ipo; right: string; rightClass?: string }) => (
    <li>
        <Link href={`/ipo/${ipo.slug}`} className="flex items-center justify-between gap-3 py-2 text-sm hover:text-primary-600">
            <span className="font-medium text-gray-900 truncate">
                {ipo.company?.name || ipo.slug} <span className="text-xs font-normal uppercase text-gray-400">{ipo.ipo_type}</span>
            </span>
            <span className={`text-xs whitespace-nowrap ${rightClass}`}>{right}</span>
        </Link>
    </li>
);

/** Internal links to the other IPOs a reader is likely comparing: live/upcoming issues and recent listings. */
export default function RelatedIpos({ current, listed }: { current: Ipo[]; listed: Ipo[] }) {
    if (current.length === 0 && listed.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {current.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Open &amp; Upcoming IPOs</h3>
                    <ul className="divide-y divide-gray-100">
                        {current.map(ipo => <Row key={ipo.id} ipo={ipo} right={currentLabel(ipo)} />)}
                    </ul>
                </div>
            )}
            {listed.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Recently Listed IPOs</h3>
                    <ul className="divide-y divide-gray-100">
                        {listed.map(ipo => {
                            const gain = listingGain(ipo);
                            return (
                                <Row
                                    key={ipo.id}
                                    ipo={ipo}
                                    right={gain == null ? (ipo.listing_date ? `Listed ${shortDate(ipo.listing_date)}` : 'Listed') : `${gain >= 0 ? '+' : ''}${gain.toFixed(2)}% on listing`}
                                    rightClass={gain == null ? 'text-gray-500' : gain >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
                                />
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
