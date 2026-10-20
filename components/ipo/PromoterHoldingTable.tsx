export default function PromoterHoldingTable({ prePercent, postPercent }: { prePercent: number | null; postPercent: number | null }) {
    if (prePercent == null && postPercent == null) return null;

    const rows = [
        { label: 'Promoter Group', pre: prePercent, post: postPercent },
        { label: 'Public', pre: prePercent != null ? 100 - prePercent : null, post: postPercent != null ? 100 - postPercent : null },
    ];

    return (
        <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
                <tr><th className="py-2">Shareholder</th><th className="text-right">Pre-Issue</th><th className="text-right">Post-Issue</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {rows.map(row => (
                    <tr key={row.label}>
                        <td className="py-2 text-gray-900">{row.label}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">{row.pre != null ? `${row.pre.toFixed(2)}%` : '—'}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">{row.post != null ? `${row.post.toFixed(2)}%` : '—'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
