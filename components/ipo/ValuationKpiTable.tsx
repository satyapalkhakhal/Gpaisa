import type { ValuationKpis } from '@/lib/ipoComputed';

function fmt(n: number | null, opts: { suffix?: string; decimals?: number } = {}): string {
    if (n == null) return '—';
    const { suffix = '', decimals = 2 } = opts;
    return `${n.toFixed(decimals)}${suffix}`;
}

export default function ValuationKpiTable({ kpis }: { kpis: ValuationKpis }) {
    const hasAny = Object.values(kpis).some(v => v != null);
    if (!hasAny) return null;

    const rows: [string, string][] = [
        ['EPS (post-issue)', kpis.eps != null ? `₹${fmt(kpis.eps)}` : '—'],
        ['P/E Ratio', fmt(kpis.peRatio, { suffix: 'x' })],
        ['Return on Net Worth (RoNW)', fmt(kpis.ronwPercent, { suffix: '%' })],
        ['NAV (post-issue)', kpis.nav != null ? `₹${fmt(kpis.nav)}` : '—'],
        ['Debt-to-Equity', fmt(kpis.debtToEquity, { suffix: 'x' })],
        ['EBITDA Margin', fmt(kpis.ebitdaMarginPercent, { suffix: '%' })],
        ['PAT Margin', fmt(kpis.patMarginPercent, { suffix: '%' })],
    ];

    return (
        <div>
            <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                    {rows.filter(([, v]) => v !== '—').map(([label, value]) => (
                        <tr key={label}>
                            <td className="py-2 text-gray-500">{label}</td>
                            <td className="py-2 text-right font-semibold text-gray-900">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-2">Computed from the latest reported financial period, issue price, and post-issue share count — not a stored/static figure.</p>
        </div>
    );
}
