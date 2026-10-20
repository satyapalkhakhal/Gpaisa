import type { ReservationPercentages } from '@/lib/ipoTypes';

const LABELS: Record<string, string> = {
    qib: 'Qualified Institutional Buyers (QIB)',
    nii: 'Non-Institutional Investors (NII)',
    retail: 'Retail Individual Investors',
    employee: 'Employee Reservation',
    shareholder: 'Shareholder Reservation',
};

export default function ReservationTable({ reservation }: { reservation: ReservationPercentages }) {
    const entries = Object.entries(reservation).filter(([, v]) => v != null);
    if (entries.length === 0) return null;

    return (
        <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
                {entries.map(([category, percent]) => (
                    <tr key={category}>
                        <td className="py-2 text-gray-500">{LABELS[category] || category}</td>
                        <td className="py-2 text-right font-semibold text-gray-900">{percent}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
