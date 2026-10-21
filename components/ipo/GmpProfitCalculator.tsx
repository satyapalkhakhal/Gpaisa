'use client';

import { useState } from 'react';
import { computeMarketLotTiers } from '@/lib/ipoComputed';

// Lots → investment at the upper price band → estimated value at listing. The GMP is
// prefilled from the latest reading but editable, so it also works before any GMP is reported.
export default function GmpProfitCalculator({ priceBandMax, lotSize, latestGmp }: { priceBandMax: number; lotSize: number; latestGmp: number | null }) {
    const [gmpInput, setGmpInput] = useState(latestGmp != null ? String(latestGmp) : '');
    const gmp = gmpInput.trim() === '' || !Number.isFinite(Number(gmpInput)) ? null : Number(gmpInput);

    const retailMaxLots = computeMarketLotTiers(priceBandMax, lotSize).find(t => t.label === 'Retail (Maximum)')?.lots ?? 1;
    const lotOptions = Array.from(new Set([1, 2, 3, 5, 10, retailMaxLots].filter(n => n <= retailMaxLots))).sort((a, b) => a - b);

    const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
    const returnPercent = gmp != null ? (gmp / priceBandMax) * 100 : null;

    return (
        <div className="mt-5 pt-5 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">GMP Profit Calculator</h3>
            <div className="flex flex-wrap items-end gap-4 mb-3">
                <div>
                    <label htmlFor="gmp-input" className="block text-xs text-gray-400 mb-1">Expected GMP (₹ per share)</label>
                    <input
                        id="gmp-input"
                        type="number"
                        value={gmpInput}
                        onChange={e => setGmpInput(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                {gmp != null && (
                    <p className="text-sm text-gray-600 pb-2">
                        Est. listing price <span className="font-semibold text-gray-900">{fmt(priceBandMax + gmp)}</span>
                        {returnPercent != null && (
                            <span className={`ml-2 font-semibold ${gmp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ({gmp >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)
                            </span>
                        )}
                    </p>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr><th className="py-2">Lots</th><th>Shares</th><th>Investment</th><th className="text-right">Est. profit / loss</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {lotOptions.map(lots => {
                            const shares = lots * lotSize;
                            const profit = gmp != null ? gmp * shares : null;
                            return (
                                <tr key={lots}>
                                    <td className="py-2 font-medium text-gray-900">{lots}</td>
                                    <td>{shares.toLocaleString('en-IN')}</td>
                                    <td>{fmt(shares * priceBandMax)}</td>
                                    <td className={`text-right font-semibold ${profit == null ? 'text-gray-400' : profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profit == null ? '—' : `${profit >= 0 ? '+' : '−'}${fmt(Math.abs(profit))}`}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                At the upper price band, before brokerage and taxes. An estimate from unofficial GMP, not a promise of listing gains.
            </p>
        </div>
    );
}
