import type { Ipo } from '@/lib/ipoTypes';

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

export default function DatesTimelineTable({ ipo }: { ipo: Ipo }) {
    const rows: [string, string | null][] = [
        ['IPO Open Date', ipo.open_date],
        ['IPO Close Date', ipo.close_date],
        ['Basis of Allotment', ipo.allotment_date],
        ['Refund Initiation', ipo.refund_date],
        ['Demat Credit', ipo.demat_date],
        ['Listing Date', ipo.listing_date],
    ];
    const withData = rows.filter(([, d]) => d != null);
    if (withData.length === 0) return null;

    return (
        <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
                {rows.map(([label, date]) => (
                    <tr key={label}>
                        <td className="py-2 text-gray-500">{label}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">{formatDate(date)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
