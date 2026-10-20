import type { Ipo } from '@/lib/ipoTypes';
import { computeMarketLotTiers } from '@/lib/ipoComputed';

export default function MarketLotTable({ ipo }: { ipo: Ipo }) {
    const tiers = computeMarketLotTiers(ipo.price_band_max, ipo.lot_size);
    if (tiers.length === 0) return null;

    return (
        <div>
            <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                    <tr><th className="py-2">Application</th><th>Lots</th><th>Shares</th><th className="text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tiers.map(t => (
                        <tr key={t.label}>
                            <td className="py-2 font-medium text-gray-900">{t.label}</td>
                            <td>{t.lots}</td>
                            <td>{t.shares.toLocaleString('en-IN')}</td>
                            <td className="text-right font-semibold text-gray-900">₹{t.amount.toLocaleString('en-IN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">
                Illustrative tiers based on the standard ₹2,00,000 retail cap and ₹10,00,000 S-HNI/B-HNI convention — confirm exact tiers in the RHP.
            </p>
        </div>
    );
}
