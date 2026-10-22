'use client';

import { useEffect, useState } from 'react';
import { goldHistoryRatePerGram } from '@/lib/goldUnits';
import { fetchGoldHistoryBundleClient, hasCarats, type GoldCarat, type GoldHistoryBundle } from '@/lib/goldHistoryBundle';

interface RateRow {
    purity: string;
    label: string;
    pricePerGram: number;
}

function formatINR(v: number): string {
    return '₹' + Math.round(v).toLocaleString('en-IN');
}

const TOLA_GRAMS = 11.66;

const CARATS: GoldCarat[] = ['24k', '22k', '18k'];

function priceRows(bundle: GoldHistoryBundle): RateRow[] {
    const rows: RateRow[] = [];
    const add = (carat: GoldCarat, purity: string, label: string) => {
        const data = bundle[carat];
        if (data?.length) rows.push({ purity, label, pricePerGram: goldHistoryRatePerGram(data[0].rate) });
    };
    add('24k', '24K', '99.9% Pure');
    add('22k', '22K', '91.6% (916)');
    add('18k', '18K', '75% Pure');
    return rows;
}

export default function GoldPriceTable({ initialHistory }: { initialHistory?: GoldHistoryBundle }) {
    const hasInitial = hasCarats(initialHistory, CARATS);
    const [rates, setRates] = useState<RateRow[]>(() => (hasInitial ? priceRows(initialHistory!) : []));
    const [loading, setLoading] = useState(!hasInitial);

    useEffect(() => {
        if (hasInitial) return;
        (async () => {
            try {
                setRates(priceRows(await fetchGoldHistoryBundleClient('India', CARATS)));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded mb-2" />)}
            </div>
        );
    }

    return (
        <section className="mb-8 sm:mb-12" id="gold-price-table">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                📊 Gold Price Table — All Purities
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[540px]">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                                <th className="px-3 sm:px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">Gold Type</th>
                                <th className="px-3 sm:px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider">1 Gram</th>
                                <th className="px-3 sm:px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider bg-amber-600/20">10 Gram</th>
                                <th className="px-3 sm:px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider">100 Gram</th>
                                <th className="px-3 sm:px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider">1 Tola (11.66g)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rates.map((r, i) => (
                                <tr key={r.purity} className={`border-b border-gray-100 hover:bg-amber-50/40 transition-colors ${i % 2 ? 'bg-gray-50/50' : ''}`}>
                                    <td className="px-3 sm:px-4 py-3.5 font-bold text-gray-900">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                                            {r.purity} Gold
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-normal ml-4">{r.label}</span>
                                    </td>
                                    <td className="px-3 sm:px-4 py-3.5 text-right font-semibold text-gray-800 tabular-nums">{formatINR(r.pricePerGram)}</td>
                                    <td className="px-3 sm:px-4 py-3.5 text-right font-bold text-gray-900 tabular-nums bg-amber-50/60 text-base">{formatINR(r.pricePerGram * 10)}</td>
                                    <td className="px-3 sm:px-4 py-3.5 text-right font-semibold text-gray-800 tabular-nums">{formatINR(r.pricePerGram * 100)}</td>
                                    <td className="px-3 sm:px-4 py-3.5 text-right font-semibold text-gray-800 tabular-nums">{formatINR(r.pricePerGram * TOLA_GRAMS)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">* Rates are indicative. GST (3%) and making charges are extra.</p>
        </section>
    );
}
