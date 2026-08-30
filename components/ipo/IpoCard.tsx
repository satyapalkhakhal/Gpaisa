import Link from 'next/link';
import type { Ipo } from '@/lib/ipoTypes';
import type { GmpBoardEntry } from '@/lib/ipoApi';
import StatusBadge from './StatusBadge';
import DataSourceBadge from './DataSourceBadge';
import CompareCheckbox from './CompareCheckbox';

function formatPriceBand(ipo: Ipo): string {
    if (ipo.price_band_min == null && ipo.price_band_max == null) return 'Price band TBA';
    if (ipo.price_band_min === ipo.price_band_max) return `₹${ipo.price_band_min}`;
    return `₹${ipo.price_band_min} – ₹${ipo.price_band_max}`;
}

function formatDateRange(ipo: Ipo): string {
    if (!ipo.open_date) return 'Dates TBA';
    const open = new Date(ipo.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!ipo.close_date) return `Opens ${open}`;
    const close = new Date(ipo.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${open} – ${close}`;
}

export default function IpoCard({ ipo, latestGmp }: { ipo: Ipo; latestGmp?: GmpBoardEntry['latestGmp'] }) {
    const companyName = ipo.company?.name || ipo.slug;
    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
            <div className="flex justify-end px-4 pt-3">
                <CompareCheckbox slug={ipo.slug} name={`${companyName} IPO`} />
            </div>
            <Link href={`/ipo/${ipo.slug}`} className="block px-4 pb-4 pt-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 leading-snug">
                        {companyName} <span className="font-normal text-gray-500">IPO</span>
                    </h3>
                    <StatusBadge status={ipo.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="uppercase font-medium">{ipo.ipo_type}</span>
                    <span>·</span>
                    <span>{formatDateRange(ipo)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs">Price band</p>
                        <p className="font-semibold text-gray-900">{formatPriceBand(ipo)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs">Lot size</p>
                        <p className="font-semibold text-gray-900">{ipo.lot_size ? `${ipo.lot_size} shares` : 'TBA'}</p>
                    </div>
                </div>
                {latestGmp && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs">Latest GMP</p>
                            <p className="font-semibold text-gray-900">
                                ₹{latestGmp.gmp_value} {latestGmp.direction === 'up' ? '↑' : latestGmp.direction === 'down' ? '↓' : ''}
                            </p>
                        </div>
                        <DataSourceBadge kind="unofficial" />
                    </div>
                )}
            </Link>
        </div>
    );
}
