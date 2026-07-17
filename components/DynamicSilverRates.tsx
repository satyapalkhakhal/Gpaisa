'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SilverRateData {
    price: number;
    change: number;
    changePercent: number;
}

interface DynamicSilverRatesProps {
    symbol?: string; // Default 'XAG'
    city?: string;
    simpleView?: boolean;
    displayWeight?: number; // Weight in grams to display in simple view
    initialRateData?: SilverRateData | null;
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

export default function DynamicSilverRates({
    symbol = 'XAG',
    city = 'National',
    simpleView = false,
    displayWeight = 1,
    initialRateData = null,
    initialLastUpdated = null,
}: DynamicSilverRatesProps) {
    const [rateData, setRateData] = useState<SilverRateData | null>(initialRateData);
    const [loading, setLoading] = useState(!initialRateData);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(initialLastUpdated ? new Date(initialLastUpdated) : null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                setLoading(true);
                let data = null;

                // Check if it's a city symbol (contains '-')
                // If so, use calculator API which gives today's specific rate stats
                if (symbol.includes('-')) {
                    const res = await fetch(`/api/silver/calculator?symbol=${symbol}`);
                    const json = await res.json();
                    if (json.success) {
                        data = {
                            price: json.data.silver.today,
                            change: json.data.silver.differenceAmount,
                            changePercent: json.data.silver.differencePercentage
                        };
                    }
                } else {
                    // Use history API for generic XAG
                    const res = await fetch(`/api/silver/history?symbol=${symbol}&gram=1`);
                    const json = await res.json();
                    if (json.success && json.data.history.length > 0) {
                        const latest = json.data.history[0];
                        data = {
                            price: parseFloat(latest.price),
                            change: parseFloat(latest.differenceAmount),
                            changePercent: parseFloat(latest.differencePercentage)
                        };
                    }
                }

                if (data) {
                    setRateData(data);
                    setLastUpdated(new Date());
                } else {
                    setError('Failed to fetch silver rates');
                }
            } catch (err) {
                console.error(err);
                setError('Error loading rates');
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, [symbol]);

    // ── Loading skeleton ──────────────────────────────────────────────────
    if (loading) {
        if (simpleView) {
            return <div className="animate-pulse h-10 bg-gray-100 rounded"></div>;
        }
        return (
            <div className="card bg-white overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-4 ml-auto"></div>
                    <div className="h-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-14 bg-gray-100 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────
    if (error || !rateData) {
        if (simpleView) return <span className="text-red-500 text-xs">Error</span>;
        return (
            <div className="card bg-red-50 border-red-200">
                <p className="text-red-600 text-center">Unavailable</p>
            </div>
        );
    }

    // ── Simple view (used in sidebar / homepage widgets) ──────────────────
    if (simpleView) {
        const isPositive = rateData.changePercent >= 0;
        const price = rateData.price * displayWeight;
        const unitText = displayWeight >= 1000 ? `${displayWeight / 1000} kg` : `${displayWeight}g`;

        return (
            <div className="flex justify-between items-center py-2">
                <div>
                    <p className="font-semibold text-sm text-gray-900">Silver {city === 'National' ? '' : `(${city})`}</p>
                    <p className="text-xs text-gray-500">per {unitText}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    <p className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{rateData.changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
        );
    }

    // ── Full table view ──────────────────────────────────────────────────
    const WEIGHT_COLUMNS = [
        { label: '1 Gram', multiplier: 1 },
        { label: '10 Grams', multiplier: 10 },
        { label: '100 Grams', multiplier: 100 },
        { label: '1 Kg', multiplier: 1000 },
    ];

    const isPositive = rateData.changePercent >= 0;
    const cityLabel = city === 'National' ? 'India' : city;

    return (
        <div>
            {/* Last updated timestamp */}
            {lastUpdated && (
                <p className="text-right text-xs text-gray-500 mb-2">
                    Last updated: {formatTimestamp(lastUpdated)}
                </p>
            )}

            {/* Silver rate table */}
            <div className="card bg-white overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-600 to-gray-500 text-white">
                                <th className="px-4 py-3 text-left font-semibold text-sm whitespace-nowrap">
                                    Silver Rate ({cityLabel})
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
                            {/* 999 Fine Silver row */}
                            <tr className="bg-white border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                                        999 Fine Silver
                                    </span>
                                    <span className="block text-xs text-gray-500 font-normal mt-0.5 ml-[18px]">
                                        99.9% Pure
                                    </span>
                                </td>
                                {WEIGHT_COLUMNS.map((col) => (
                                    <td key={col.label} className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                                        {formatINR(rateData.price * col.multiplier)}
                                    </td>
                                ))}
                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {isPositive ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        {isPositive ? '+' : ''}{rateData.changePercent.toFixed(2)}%
                                    </span>
                                </td>
                            </tr>
                            {/* 925 Sterling Silver row */}
                            <tr className="bg-gray-50/50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400 flex-shrink-0"></span>
                                        925 Sterling Silver
                                    </span>
                                    <span className="block text-xs text-gray-500 font-normal mt-0.5 ml-[18px]">
                                        92.5% Pure (Jewellery)
                                    </span>
                                </td>
                                {WEIGHT_COLUMNS.map((col) => (
                                    <td key={col.label} className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                                        {formatINR(rateData.price * 0.925 * col.multiplier)}
                                    </td>
                                ))}
                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {isPositive ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        {isPositive ? '+' : ''}{rateData.changePercent.toFixed(2)}%
                                    </span>
                                </td>
                            </tr>
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
