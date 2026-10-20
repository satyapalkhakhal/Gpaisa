import type { IpoFinancials } from '@/lib/ipoTypes';

export default function FinancialsTable({ financials }: { financials: IpoFinancials[] }) {
    if (financials.length === 0) return null;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="py-2">Period</th>
                        <th className="text-right">Revenue</th>
                        <th className="text-right">Expenses</th>
                        <th className="text-right">PAT</th>
                        <th className="text-right">Total Assets</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {financials.map(f => (
                        <tr key={f.id}>
                            <td className="py-2 font-medium text-gray-900">{f.period_label}</td>
                            <td className="text-right">{f.revenue != null ? `₹${f.revenue} Cr` : '—'}</td>
                            <td className="text-right">{f.expenses != null ? `₹${f.expenses} Cr` : '—'}</td>
                            <td className="text-right font-semibold text-gray-900">{f.profit_after_tax != null ? `₹${f.profit_after_tax} Cr` : '—'}</td>
                            <td className="text-right">{f.total_assets != null ? `₹${f.total_assets} Cr` : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">Figures in ₹ Crore, as reported in the RHP/DRHP.</p>
        </div>
    );
}
