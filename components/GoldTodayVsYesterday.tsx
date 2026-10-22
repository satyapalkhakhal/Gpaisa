'use client';

import { useEffect, useState } from 'react';
import { goldHistoryRatePer10g } from '@/lib/goldUnits';
import { fetchGoldHistoryBundleClient, hasCarats, type GoldCarat, type GoldHistoryBundle } from '@/lib/goldHistoryBundle';

interface CompRow { metric: string; today: number; yesterday: number; }

function fmtINR(v: number) { return '₹' + Math.round(v).toLocaleString('en-IN'); }

const CARATS: GoldCarat[] = ['24k', '22k', '18k'];
const LABELS: Record<GoldCarat, string> = { '24k': '24K Gold (10g)', '22k': '22K Gold (10g)', '18k': '18K Gold (10g)' };

function compRows(bundle: GoldHistoryBundle): CompRow[] {
    return CARATS.flatMap((carat) => {
        const data = bundle[carat];
        return data && data.length >= 2
            ? [{ metric: LABELS[carat], today: goldHistoryRatePer10g(data[0].rate), yesterday: goldHistoryRatePer10g(data[1].rate) }]
            : [];
    });
}

export default function GoldTodayVsYesterday({ initialHistory }: { initialHistory?: GoldHistoryBundle }) {
    const hasInitial = hasCarats(initialHistory, CARATS, 2);
    const [rows, setRows] = useState<CompRow[]>(() => (hasInitial ? compRows(initialHistory!) : []));
    const [loading, setLoading] = useState(!hasInitial);

    useEffect(() => {
        if (hasInitial) return;
        (async () => {
            try {
                setRows(compRows(await fetchGoldHistoryBundleClient('India', CARATS)));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return <div className="card animate-pulse"><div className="h-40 bg-gray-100 rounded" /></div>;
    if (!rows.length) return null;

    return (
        <section className="mb-8 sm:mb-12" id="today-vs-yesterday">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                📅 Today vs Yesterday
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[420px]">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-3 sm:px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Metric</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs uppercase tracking-wider font-semibold">Today</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs uppercase tracking-wider font-semibold">Yesterday</th>
                                <th className="px-3 sm:px-4 py-3 text-right text-xs uppercase tracking-wider font-semibold">Change (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => {
                                const diff = r.today - r.yesterday;
                                const isUp = diff >= 0;
                                return (
                                    <tr key={r.metric} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                                        <td className="px-3 sm:px-4 py-3 font-semibold text-gray-900">{r.metric}</td>
                                        <td className="px-3 sm:px-4 py-3 text-right font-bold text-gray-900 tabular-nums">{fmtINR(r.today)}</td>
                                        <td className="px-3 sm:px-4 py-3 text-right font-medium text-gray-600 tabular-nums">{fmtINR(r.yesterday)}</td>
                                        <td className="px-3 sm:px-4 py-3 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                {isUp ? '🔼' : '🔽'} {isUp ? '+' : ''}{fmtINR(diff)}
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
