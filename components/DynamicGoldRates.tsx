'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DynamicGoldRate {
    purity: '24K' | '22K' | '18K';
    pricePerGram: number;
    change: number;
    changePercent: number;
}

interface DynamicGoldRatesProps {
    simpleView?: boolean;
    initialRates?: DynamicGoldRate[];
    initialLastUpdated?: string | null;
}

/** Format a number as Indian currency without decimals */
function formatINR(value: number): string {
    return '₹' + Math.round(value).toLocaleString('en-IN');
}

/** Format timestamp as "DD MMM YYYY, HH:MM AM/PM IST" */
function formatTimestamp(date: Date): string {
    const day = date.toLocaleString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' });
    const month = date.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = date.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    const time = date.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    });
    return `${day} ${month} ${year}, ${time} IST`;
}

export default function DynamicGoldRates({ simpleView = false, initialRates = [], initialLastUpdated = null }: DynamicGoldRatesProps) {
    const [goldRates, setGoldRates] = useState<DynamicGoldRate[]>(initialRates);
    const [loading, setLoading] = useState(initialRates.length === 0);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(initialLastUpdated ? new Date(initialLastUpdated) : null);

    useEffect(() => {
        const fetchGoldRates = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch history for all three carats (using India for nationwide rates)
                const [data24k, data22k, data18k] = await Promise.all([
                    fetch('/api/gold-history?city=India&carat=24k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=22k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=18k').then(r => r.json())
                ]);

                if (data24k.success && data22k.success && data18k.success &&
                    data24k.data.length > 0 && data22k.data.length > 0 && data18k.data.length > 0) {

                    // Get the latest rate (first item in the array)
                    const latest24k = data24k.data[0];
                    const latest22k = data22k.data[0];
                    const latest18k = data18k.data[0];

                    const rates: DynamicGoldRate[] = [
                        {
                            purity: '24K',
                            pricePerGram: parseFloat(latest24k.rate) / 10, // Rate is per 10g, divide by 10 for per gram
                            change: parseFloat(latest24k.change) * (parseFloat(latest24k.rate) / 10) / 100,
                            changePercent: parseFloat(latest24k.change)
                        },
                        {
                            purity: '22K',
                            pricePerGram: parseFloat(latest22k.rate) / 10,
                            change: parseFloat(latest22k.change) * (parseFloat(latest22k.rate) / 10) / 100,
                            changePercent: parseFloat(latest22k.change)
                        },
                        {
                            purity: '18K',
                            pricePerGram: parseFloat(latest18k.rate) / 10,
                            change: parseFloat(latest18k.change) * (parseFloat(latest18k.rate) / 10) / 100,
                            changePercent: parseFloat(latest18k.change)
                        }
                    ];

                    setGoldRates(rates);
                    setLastUpdated(new Date());
                } else {
                    setError('Failed to fetch gold rates');
                }
            } catch (err) {
                setError('Error loading gold rates');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGoldRates();
    }, []);

    // ── Loading skeleton ──────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="card bg-white overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-4 ml-auto"></div>
                    <div className="h-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-14 bg-gray-100 rounded mb-2"></div>
                    <div className="h-14 bg-gray-200 rounded mb-2"></div>
                    <div className="h-14 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="card bg-red-50 border-red-200">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    // ── Simple view (used in sidebar / homepage widgets) ──────────────────
    if (simpleView) {
        return (
            <div className="space-y-3">
                {goldRates.map((rate) => (
                    <div key={rate.purity} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{rate.purity} Gold</p>
                            <p className="text-xs text-gray-500">per 10g</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm text-gray-900">{formatINR(rate.pricePerGram * 10)}</p>
                            <p className={`text-xs font-medium ${rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
                <div className="pt-2">
                    <Link href="/gold-rate" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View Historical Trends →
                    </Link>
                </div>
            </div>
        );
    }

    // ── Full table view ──────────────────────────────────────────────────
    const WEIGHT_COLUMNS = [
        { label: '1 Gram', multiplier: 1 },
        { label: '8 Grams (1 Tola)', multiplier: 8 },
        { label: '10 Grams', multiplier: 10 },
        { label: '100 Grams', multiplier: 100 },
    ];

    return (
        <div>
            {/* Last updated timestamp */}
            {lastUpdated && (
                <p className="text-right text-xs text-gray-500 mb-2">
                    Last updated: {formatTimestamp(lastUpdated)}
                </p>
            )}

            {/* Gold rate table */}
            <div className="card bg-white overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white">
                                <th className="px-4 py-3 text-left font-semibold text-sm whitespace-nowrap">
                                    Purity
                                </th>
                                {WEIGHT_COLUMNS.map((col) => (
                                    <th key={col.label} className="px-4 py-3 text-right font-semibold text-sm whitespace-nowrap">
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-semibold text-sm whitespace-nowrap">
                                    Daily Change
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {goldRates.map((rate, i) => (
                                <tr
                                    key={rate.purity}
                                    className={`border-b border-gray-100 last:border-0 hover:bg-amber-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                >
                                    <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                            {rate.purity} Gold
                                        </span>
                                        <span className="block text-xs text-gray-500 font-normal mt-0.5 ml-[18px]">
                                            {rate.purity === '24K' ? '99.9% Pure' : rate.purity === '22K' ? '91.6% (916)' : '75% Pure'}
                                        </span>
                                    </td>
                                    {WEIGHT_COLUMNS.map((col) => (
                                        <td key={col.label} className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                                            {formatINR(rate.pricePerGram * col.multiplier)}
                                        </td>
                                    ))}
                                    <td className="px-4 py-4 text-right whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${rate.changePercent >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {rate.changePercent >= 0 ? (
                                                <TrendingUp className="h-3 w-3" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3" />
                                            )}
                                            {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                * Rates shown are indicative and exclude GST (3%) and TCS (1% on purchases above ₹2 lakh).
                Contact your local jeweller for final buyable rates.
            </p>
        </div>
    );
}
