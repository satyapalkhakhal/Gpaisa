import type { PeerComparisonItem } from '@/lib/ipoTypes';

export default function PeerComparisonTable({ peers, companyName, ownRow }: {
    peers: PeerComparisonItem[];
    companyName: string;
    ownRow?: PeerComparisonItem | null;
}) {
    const rows = ownRow ? [{ ...ownRow, name: `${companyName} (this IPO)` }, ...peers] : peers;
    if (rows.length === 0) return null;

    // Computed ratios carry float noise (e.g. 58.92000000000001); show at most 2 decimals.
    const fmt = (n: number | null) => (n != null ? Number(n.toFixed(2)).toString() : '—');

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="py-2">Company</th>
                        <th className="text-right">EPS</th>
                        <th className="text-right">P/E</th>
                        <th className="text-right">RoNW %</th>
                        <th className="text-right">NAV</th>
                        <th className="text-right">Income (₹ Cr)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rows.map((peer, i) => (
                        <tr key={i} className={i === 0 && ownRow ? 'bg-primary-50/50' : ''}>
                            <td className="py-2 font-medium text-gray-900">{peer.name}</td>
                            <td className="text-right">{fmt(peer.eps)}</td>
                            <td className="text-right">{fmt(peer.pe_ratio)}</td>
                            <td className="text-right">{fmt(peer.ronw_percent)}</td>
                            <td className="text-right">{fmt(peer.nav)}</td>
                            <td className="text-right">{fmt(peer.income)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
