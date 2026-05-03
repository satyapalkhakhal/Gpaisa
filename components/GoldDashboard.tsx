'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react';

interface GoldHistoryItem {
    date: string;
    rate: string;
    change: string;
}

interface GoldRateRow {
    purity: string;
    label: string;
    pricePerGram: number;
    change: number;
    changePercent: number;
}

/** Format a number as Indian currency without decimals */
function formatINR(value: number): string {
    return '₹' + Math.round(value).toLocaleString('en-IN');
}

/** Format timestamp as "DD MMM YYYY, HH:MM AM/PM IST" */
function formatTimestamp(date: Date): string {
    return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    }) + ' IST';
}

function formatDateShort(dateStr: string): string {
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }
        return dateStr;
    } catch (_e) {
        return dateStr;
    }
}

export default function GoldDashboard() {
    const [rates, setRates] = useState<GoldRateRow[]>([]);
    const [history24k, setHistory24k] = useState<GoldHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [data24k, data22k, data18k] = await Promise.all([
                    fetch('/api/gold-history?city=India&carat=24k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=22k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=18k').then(r => r.json()),
                ]);

                if (
                    data24k.success && data22k.success && data18k.success &&
                    data24k.data.length > 0 && data22k.data.length > 0 && data18k.data.length > 0
                ) {
                    const latest24k = data24k.data[0];
                    const latest22k = data22k.data[0];
                    const latest18k = data18k.data[0];

                    const goldRates: GoldRateRow[] = [
                        {
                            purity: '24K',
                            label: '99.9% Pure',
                            pricePerGram: parseFloat(latest24k.rate) / 10,
                            change: parseFloat(latest24k.change) * (parseFloat(latest24k.rate) / 10) / 100,
                            changePercent: parseFloat(latest24k.change),
                        },
                        {
                            purity: '22K',
                            label: '91.6% (916)',
                            pricePerGram: parseFloat(latest22k.rate) / 10,
                            change: parseFloat(latest22k.change) * (parseFloat(latest22k.rate) / 10) / 100,
                            changePercent: parseFloat(latest22k.change),
                        },
                        {
                            purity: '18K',
                            label: '75% Pure',
                            pricePerGram: parseFloat(latest18k.rate) / 10,
                            change: parseFloat(latest18k.change) * (parseFloat(latest18k.rate) / 10) / 100,
                            changePercent: parseFloat(latest18k.change),
                        },
                    ];

                    setRates(goldRates);
                    setHistory24k(data24k.data);
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

        fetchData();
    }, []);

    // ── Loading State ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                {/* Hero skeleton */}
                <div className="animate-pulse rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 border border-amber-100">
                    <div className="h-6 bg-amber-200/50 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-amber-100/50 rounded w-1/2 mb-6"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-white/60 rounded-xl"></div>
                        ))}
                    </div>
                </div>
                {/* Table skeleton */}
                <div className="animate-pulse bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="h-12 bg-gray-100"></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-14 border-t border-gray-100 bg-gray-50/50"></div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Error State ────────────────────────────────────────────────────────
    if (error || rates.length === 0) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{error || 'No data available'}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-800"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    const gold24k = rates[0];
    const priceFor10g = gold24k.pricePerGram * 10;
    const isPositive = gold24k.changePercent >= 0;
    const trend = isPositive ? 'Bullish' : 'Bearish';

    // Today vs Yesterday
    const todayRate = history24k.length > 0 ? parseFloat(history24k[0].rate) : 0;
    const yesterdayRate = history24k.length > 1 ? parseFloat(history24k[1].rate) : 0;
    const todayVsYesterday = todayRate - yesterdayRate;

    // 7-day + 10-day data
    const sevenDayData = history24k.slice(0, 7);
    const tenDayData = history24k.slice(0, 10);

    return (
        <div className="space-y-8">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: HERO DATA CARD
            ═══════════════════════════════════════════════════════════════ */}
            <section id="gold-hero" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-tr-full" />

                <div className="relative p-5 sm:p-6">
                    {/* Live badge + timestamp */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Live</span>
                        </div>
                        {lastUpdated && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimestamp(lastUpdated)}</span>
                            </div>
                        )}
                    </div>

                    {/* Main price display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">24K Gold (10g)</p>
                            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{formatINR(priceFor10g)}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {isPositive ? '+' : ''}{formatINR(Math.abs(gold24k.change * 10))}
                                    <span className="text-xs font-medium ml-0.5">({isPositive ? '+' : ''}{gold24k.changePercent.toFixed(2)}%)</span>
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {trend}
                                </span>
                            </div>
                        </div>

                        {/* Quick stats grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {rates.map(rate => (
                                <div key={rate.purity} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-amber-100/60">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{rate.purity} Gold</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{formatINR(rate.pricePerGram * 10)}</p>
                                    <p className={`text-[10px] font-semibold mt-0.5 ${rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {rate.changePercent >= 0 ? '▲' : '▼'} {Math.abs(rate.changePercent).toFixed(2)}%
                                    </p>
                                </div>
                            ))}
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-amber-100/60 flex flex-col justify-center items-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Per Gram</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">{formatINR(gold24k.pricePerGram)}</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/gold-rate"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-amber-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-300/50"
                        >
                            Check Full Gold Rate
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/gold-vs-silver"
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:border-gray-300"
                        >
                            Compare Gold vs Silver
                        </Link>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: GOLD PRICE TABLE
            ═══════════════════════════════════════════════════════════════ */}
            <section id="gold-price-table">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-yellow-500" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Gold Price Today – All Purities</h2>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white">
                                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap">Type</th>
                                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap">1 Gram</th>
                                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap">10 Gram</th>
                                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider whitespace-nowrap">100 Gram</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rates.map((rate, i) => (
                                    <tr key={rate.purity} className={`hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                                                {rate.purity} Gold
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-normal ml-4">{rate.label}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatINR(rate.pricePerGram)}</td>
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatINR(rate.pricePerGram * 10)}</td>
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatINR(rate.pricePerGram * 100)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: TODAY VS YESTERDAY (24K)
            ═══════════════════════════════════════════════════════════════ */}
            {history24k.length >= 2 && (
                <section id="today-vs-yesterday">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500" />
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">Today vs Yesterday (24K Gold)</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Metric</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Today</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Yesterday</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3.5 font-semibold text-gray-900">24K Gold (10g)</td>
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums">{formatINR(todayRate)}</td>
                                        <td className="px-4 py-3.5 text-right font-medium text-gray-600 tabular-nums">{formatINR(yesterdayRate)}</td>
                                        <td className="px-4 py-3.5 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${todayVsYesterday >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {todayVsYesterday >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {todayVsYesterday >= 0 ? '+' : ''}{formatINR(todayVsYesterday)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3.5 font-semibold text-gray-900">24K Gold (1g)</td>
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-900 tabular-nums">{formatINR(todayRate / 10)}</td>
                                        <td className="px-4 py-3.5 text-right font-medium text-gray-600 tabular-nums">{formatINR(yesterdayRate / 10)}</td>
                                        <td className="px-4 py-3.5 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${todayVsYesterday >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {todayVsYesterday >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {todayVsYesterday >= 0 ? '+' : ''}{formatINR(todayVsYesterday / 10)}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: 7-DAY TREND
            ═══════════════════════════════════════════════════════════════ */}
            {sevenDayData.length > 1 && (
                <section id="seven-day-trend">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-green-500" />
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">7-Day Gold Price Trend (24K, 10g)</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Date</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Price (10g)</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sevenDayData.map((item, i) => {
                                        const changeVal = parseFloat(item.change);
                                        const isUp = changeVal >= 0;
                                        return (
                                            <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{formatDateShort(item.date)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatINR(parseFloat(item.rate))}</td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        {isUp ? '+' : ''}{changeVal.toFixed(2)}%
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
            )}


            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5: 10-DAY TREND
            ═══════════════════════════════════════════════════════════════ */}
            {tenDayData.length > 7 && (
                <section id="ten-day-trend">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-violet-500" />
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">10-Day Gold Price Trend (24K, 10g)</h2>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Date</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Price (10g)</th>
                                        <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap">Change</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tenDayData.map((item, i) => {
                                        const changeVal = parseFloat(item.change);
                                        const isUp = changeVal >= 0;
                                        return (
                                            <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{formatDateShort(item.date)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">{formatINR(parseFloat(item.rate))}</td>
                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        {isUp ? '+' : ''}{changeVal.toFixed(2)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                        * Rates shown are indicative and exclude GST (3%) and TCS (1% on purchases above ₹2 lakh).
                    </p>
                </section>
            )}
        </div>
    );
}
