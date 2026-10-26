import type { IpoGmpUpdate } from '@/lib/ipoTypes';

type DailyGmp = IpoGmpUpdate & { day: string };

function formatDay(day: string): string {
    return new Date(`${day}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
}

/** Day-wise GMP log (newest first): each day's last reading and its change from the day before. */
export default function GmpDailyTable({ days, issuePrice }: { days: DailyGmp[]; issuePrice: number | null }) {
    if (days.length === 0) return null;
    const showSource = new Set(days.map(d => d.source)).size > 1;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="py-2">Date</th>
                        <th>GMP</th>
                        <th>Change</th>
                        <th>Gain</th>
                        <th>Est. listing</th>
                        <th className="text-right">Last updated</th>
                        {showSource && <th className="text-right pl-3">Source</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {days.map((d, i) => {
                        const previous = days[i + 1];
                        // Rounded: subtracting decimal GMPs leaves float noise (0.2999999999999998).
                        const change = previous ? Math.round((d.gmp_value - previous.gmp_value) * 100) / 100 : null;
                        const gain = d.gmp_percentage ?? (issuePrice ? (d.gmp_value / issuePrice) * 100 : null);
                        const listing = d.estimated_listing_price ?? (issuePrice ? Math.round((issuePrice + d.gmp_value) * 100) / 100 : null);
                        return (
                            <tr key={d.day}>
                                <td className="py-2 font-medium text-gray-900 whitespace-nowrap">{formatDay(d.day)}</td>
                                <td className="font-semibold text-gray-900">₹{d.gmp_value}</td>
                                <td className={change == null || change === 0 ? 'text-gray-400' : change > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {change == null ? '—' : change === 0 ? '0' : `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}`}
                                </td>
                                <td className={gain == null ? 'text-gray-400' : gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {gain == null ? '—' : `${gain >= 0 ? '+' : ''}${gain.toFixed(2)}%`}
                                </td>
                                <td>{listing == null ? '—' : `₹${listing.toLocaleString('en-IN')}`}</td>
                                <td className="text-right text-gray-500 whitespace-nowrap">{formatTime(d.recorded_at)}</td>
                                {showSource && <td className="text-right pl-3 text-gray-500">{d.source}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
