'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { goldHistoryRatePer10g } from '@/lib/goldUnits';
import { fetchGoldHistoryBundleClient, hasCarats, type GoldHistoryBundle } from '@/lib/goldHistoryBundle';
import type { GoldHistoryItem } from '@/types';

interface TrendRow { date: string; rate: number; change: number; }

function fmtINR(v: number) { return '₹' + Math.round(v).toLocaleString('en-IN'); }

function trendRows(history: GoldHistoryItem[], days: number): TrendRow[] {
    const sliced = history.slice(0, days);
    return sliced.map((item, idx) => {
        const rate = goldHistoryRatePer10g(item.rate);
        const prev = idx < sliced.length - 1 ? goldHistoryRatePer10g(sliced[idx + 1].rate) : rate;
        return { date: item.date, rate, change: rate - prev };
    });
}

export default function GoldTrendTable({ days = 7, title, initialHistory }: { days?: number; title?: string; initialHistory?: GoldHistoryBundle }) {
    const hasInitial = hasCarats(initialHistory, ['24k']);
    const [rows, setRows] = useState<TrendRow[]>(() => (hasInitial ? trendRows(initialHistory!['24k']!, days) : []));
    const [loading, setLoading] = useState(!hasInitial);

    useEffect(() => {
        if (hasInitial) return;
        (async () => {
            try {
                const bundle = await fetchGoldHistoryBundleClient('India', ['24k']);
                if (bundle['24k']?.length) setRows(trendRows(bundle['24k'], days));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, [days]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return <div className="card animate-pulse"><div className="h-40 bg-gray-100 rounded" /></div>;
    if (!rows.length) return null;

    const heading = title || (days <= 7 ? '📈 7-Day Gold Price Trend' : '📈 10-Day Gold Price Trend');

    return (
        <section className="mb-8 sm:mb-12">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                {heading}
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[380px]">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-3 sm:px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Date</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs uppercase tracking-wider font-semibold">Price (10g)</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs uppercase tracking-wider font-semibold">Change (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => {
                                const isUp = r.change >= 0;
                                return (
                                    <tr key={r.date} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                                        <td className="px-3 sm:px-4 py-3 font-medium text-gray-900">{r.date}</td>
                                        <td className="px-3 sm:px-4 py-3 text-right font-bold text-gray-900 tabular-nums">{fmtINR(r.rate)}</td>
                                        <td className="px-3 sm:px-4 py-3 text-right">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                {isUp ? '+' : ''}{fmtINR(r.change)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
