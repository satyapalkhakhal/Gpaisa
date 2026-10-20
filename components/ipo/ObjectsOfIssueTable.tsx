import type { ObjectsOfIssueItem } from '@/lib/ipoTypes';

export default function ObjectsOfIssueTable({ breakdown, fallbackText }: { breakdown: ObjectsOfIssueItem[]; fallbackText: string | null }) {
    if (breakdown.length === 0) {
        return fallbackText ? <p className="text-sm text-gray-700">{fallbackText}</p> : null;
    }

    const total = breakdown.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
                <tr><th className="py-2">Purpose</th><th className="text-right">Amount (₹ Cr)</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {breakdown.map((item, i) => (
                    <tr key={i}>
                        <td className="py-2 text-gray-900">{item.purpose}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">₹{item.amount}</td>
                    </tr>
                ))}
                <tr>
                    <td className="py-2 font-bold text-gray-900">Total</td>
                    <td className="py-2 text-right font-bold text-gray-900">₹{total}</td>
                </tr>
            </tbody>
        </table>
    );
}
