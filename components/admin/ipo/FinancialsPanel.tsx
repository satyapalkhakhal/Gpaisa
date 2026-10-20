'use client';

import { useEffect, useState } from 'react';
import type { IpoFinancials } from '@/lib/ipoTypes';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

export default function FinancialsPanel({ ipoId }: { ipoId: string }) {
    const [financials, setFinancials] = useState<IpoFinancials[]>([]);
    const [loading, setLoading] = useState(true);
    const [periodLabel, setPeriodLabel] = useState('');
    const [periodEndDate, setPeriodEndDate] = useState('');
    const [revenue, setRevenue] = useState('');
    const [expenses, setExpenses] = useState('');
    const [profitAfterTax, setProfitAfterTax] = useState('');
    const [totalAssets, setTotalAssets] = useState('');
    const [ebitda, setEbitda] = useState('');
    const [netWorth, setNetWorth] = useState('');
    const [totalDebt, setTotalDebt] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function load() {
        setLoading(true);
        fetch(`/api/admin/ipos/${ipoId}/financials`).then(r => r.json()).then(d => {
            setFinancials(d.financials || []);
            setLoading(false);
        });
    }

    useEffect(load, [ipoId]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!periodLabel.trim()) {
            setError('Period label is required (e.g. "FY26").');
            return;
        }
        setSaving(true);
        const res = await fetch(`/api/admin/ipos/${ipoId}/financials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                period_label: periodLabel.trim(),
                period_end_date: periodEndDate || null,
                revenue: revenue ? Number(revenue) : null,
                expenses: expenses ? Number(expenses) : null,
                profit_after_tax: profitAfterTax ? Number(profitAfterTax) : null,
                total_assets: totalAssets ? Number(totalAssets) : null,
                ebitda: ebitda ? Number(ebitda) : null,
                net_worth: netWorth ? Number(netWorth) : null,
                total_debt: totalDebt ? Number(totalDebt) : null,
            }),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) {
            setError(data.error || 'Failed to add financial period.');
            return;
        }
        setPeriodLabel(''); setPeriodEndDate(''); setRevenue(''); setExpenses(''); setProfitAfterTax(''); setTotalAssets(''); setEbitda(''); setNetWorth(''); setTotalDebt('');
        load();
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this financial period?')) return;
        await fetch(`/api/admin/ipos/${ipoId}/financials/${id}`, { method: 'DELETE' });
        load();
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Financial statements</h3>
            <p className="text-xs text-gray-400 mb-3">All figures in ₹ Crore, as reported in the RHP/DRHP. Also drives the computed Valuation &amp; KPI table (EPS, P/E, RoNW, NAV, D:E) via post-issue shares outstanding above.</p>
            <form onSubmit={handleAdd} className="grid grid-cols-4 gap-2 mb-3">
                {error && <p className="col-span-4 text-xs text-red-600">{error}</p>}
                <input type="text" placeholder="Period (e.g. FY26)" value={periodLabel} onChange={e => setPeriodLabel(e.target.value)} className={inputClass} />
                <input type="date" placeholder="Period end date" value={periodEndDate} onChange={e => setPeriodEndDate(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Revenue" value={revenue} onChange={e => setRevenue(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Expenses" value={expenses} onChange={e => setExpenses(e.target.value)} className={inputClass} />
                <input type="number" placeholder="PAT" value={profitAfterTax} onChange={e => setProfitAfterTax(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Total assets" value={totalAssets} onChange={e => setTotalAssets(e.target.value)} className={inputClass} />
                <input type="number" placeholder="EBITDA" value={ebitda} onChange={e => setEbitda(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Net worth" value={netWorth} onChange={e => setNetWorth(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Total debt" value={totalDebt} onChange={e => setTotalDebt(e.target.value)} className={inputClass} />
                <button type="submit" disabled={saving} className="col-span-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-1.5">
                    {saving ? 'Adding…' : 'Add financial period'}
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
            ) : financials.length === 0 ? (
                <p className="text-sm text-gray-400">No financial periods added yet.</p>
            ) : (
                <table className="w-full text-xs">
                    <thead className="text-gray-500 text-left">
                        <tr><th className="py-1">Period</th><th>Revenue</th><th>PAT</th><th></th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {financials.map(f => (
                            <tr key={f.id}>
                                <td className="py-1.5 font-medium text-gray-900">{f.period_label}</td>
                                <td className="text-gray-600">{f.revenue != null ? `₹${f.revenue}Cr` : '—'}</td>
                                <td className="text-gray-600">{f.profit_after_tax != null ? `₹${f.profit_after_tax}Cr` : '—'}</td>
                                <td className="text-right">
                                    <button onClick={() => handleDelete(f.id)} className="text-gray-400 hover:text-red-600">×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
