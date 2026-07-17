'use client';

import { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, BarChart3, Calendar, Info } from 'lucide-react';
import {
    SILVER_HISTORICAL_DATA, SILVER_TIME_PERIODS, filterSilverByYears,
    calculateSilverCAGR, calculateSilverAbsoluteReturn,
    type SilverTimePeriodLabel
} from '@/lib/silverHistoricalData';

interface SilverPriceHistoryChartProps {
    cityName?: string;
}

export default function SilverPriceHistoryChart({ cityName }: SilverPriceHistoryChartProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<SilverTimePeriodLabel>('10Y');

    const periodConfig = SILVER_TIME_PERIODS.find(p => p.label === selectedPeriod)!;

    const filteredData = useMemo(
        () => filterSilverByYears(SILVER_HISTORICAL_DATA, periodConfig.years),
        [periodConfig.years]
    );

    const cagr = useMemo(() => calculateSilverCAGR(filteredData), [filteredData]);
    const absoluteReturn = useMemo(() => calculateSilverAbsoluteReturn(filteredData), [filteredData]);

    const firstPrice = filteredData[0]?.price ?? 0;
    const lastPrice = filteredData[filteredData.length - 1]?.price ?? 0;
    const priceChange = lastPrice - firstPrice;

    const chartData = useMemo(() =>
        filteredData.map(d => ({
            year: d.year.toString(),
            price: d.price,
        })),
        [filteredData]
    );

    const minPrice = Math.min(...filteredData.map(d => d.price));
    const maxPrice = Math.max(...filteredData.map(d => d.price));
    const yPadding = (maxPrice - minPrice) * 0.1;

    const locationLabel = cityName ? `in ${cityName}` : 'in India';

    return (
        <section
            className="mb-12"
            aria-labelledby="historical-silver-chart-heading"
            id="silver-price-history"
        >
            <div className="flex items-center justify-center space-x-3 mb-2">
                <BarChart3 className="h-7 w-7 text-gray-600" aria-hidden="true" />
                <h2
                    id="historical-silver-chart-heading"
                    className="text-2xl md:text-3xl font-display font-bold text-gray-900"
                >
                    Silver Price History {locationLabel} (1981–2026)
                </h2>
            </div>
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto text-sm sm:text-base">
                45 years of silver price data sourced from RBI &amp; IBJA archives.
                Track how silver (per Kg) has performed across different time horizons for informed investment decisions.
            </p>

            <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Time Period Selector */}
                <div className="flex flex-wrap items-center gap-2 p-4 sm:p-6 pb-0 border-b border-gray-100 mb-0">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm font-medium text-gray-600 mr-2">Period:</span>
                    {SILVER_TIME_PERIODS.map(period => (
                        <button
                            key={period.label}
                            onClick={() => setSelectedPeriod(period.label)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                selectedPeriod === period.label
                                    ? 'bg-slate-600 text-white shadow-md shadow-slate-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                            }`}
                            aria-label={`Show ${period.label === 'All' ? 'all time' : `last ${period.years} years`} silver price data`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6">
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-3 sm:p-4 border border-slate-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Start Price</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                            ₹{firstPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">{filteredData[0]?.year} · per Kg</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-3 sm:p-4 border border-slate-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Current Price</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                            ₹{lastPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">{filteredData[filteredData.length - 1]?.year} · per Kg</p>
                    </div>
                    <div className={`rounded-xl p-3 sm:p-4 border ${
                        cagr >= 0
                            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'
                            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'
                    }`}>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">CAGR</p>
                        <p className={`text-lg sm:text-xl font-bold flex items-center gap-1 ${
                            cagr >= 0 ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                            <TrendingUp className="h-4 w-4" />
                            {cagr.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">per annum</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Return</p>
                        <p className="text-lg sm:text-xl font-bold text-blue-700">
                            {absoluteReturn >= 1000
                                ? `${(absoluteReturn / 1000).toFixed(0)}x`
                                : `${absoluteReturn.toFixed(0)}%`
                            }
                        </p>
                        <p className="text-xs text-gray-500">
                            +₹{priceChange.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Chart */}
                <div className="px-2 sm:px-4 pb-4 sm:pb-6">
                    <ResponsiveContainer width="100%" height={420}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                                    <stop offset="50%" stopColor="#64748B" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="year"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                                interval={filteredData.length > 20 ? Math.floor(filteredData.length / 8) : 'preserveStartEnd'}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    if (value >= 100000) return `₹${(value / 1000).toFixed(0)}K`;
                                    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                                    return `₹${value}`;
                                }}
                                domain={[Math.max(0, minPrice - yPadding), maxPrice + yPadding]}
                                width={65}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null;
                                    const price = payload[0].value as number;
                                    return (
                                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-xl">
                                            <p className="text-xs text-gray-500 mb-1">Year {label}</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₹{price.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-xs text-gray-500">per Kg (Silver)</p>
                                        </div>
                                    );
                                }}
                            />
                            <ReferenceLine y={lastPrice} stroke="#475569" strokeDasharray="4 4" strokeWidth={1} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#475569"
                                strokeWidth={2.5}
                                fill="url(#silverGradient)"
                                dot={filteredData.length <= 15}
                                activeDot={{ r: 6, fill: '#475569', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="border-t border-gray-100 p-4 sm:p-6">
                    <details className="group">
                        <summary className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors list-none [&::-webkit-details-marker]:hidden">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs group-open:rotate-180 transition-transform">▼</span>
                            View Yearly Silver Price Data Table ({filteredData[0]?.year}–{filteredData[filteredData.length - 1]?.year})
                        </summary>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Year</th>
                                        <th className="px-4 py-3 text-right font-semibold">Price (₹ per Kg)</th>
                                        <th className="px-4 py-3 text-right font-semibold rounded-tr-lg">YoY Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...filteredData].reverse().map((item, idx) => {
                                        const prevItem = SILVER_HISTORICAL_DATA.find(d => d.year === item.year - 1);
                                        const yoyChange = prevItem
                                            ? ((item.price - prevItem.price) / prevItem.price * 100)
                                            : null;
                                        return (
                                            <tr key={item.year} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50 transition-colors`}>
                                                <td className="px-4 py-2.5 font-medium text-gray-900">{item.year}</td>
                                                <td className="px-4 py-2.5 text-right text-gray-700 font-semibold">₹{item.price.toLocaleString('en-IN')}</td>
                                                <td className={`px-4 py-2.5 text-right font-medium ${
                                                    yoyChange === null ? 'text-gray-400' : yoyChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                    {yoyChange === null ? '—' : `${yoyChange >= 0 ? '+' : ''}${yoyChange.toFixed(1)}%`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>

                {/* Source */}
                <div className="border-t border-gray-100 px-4 sm:px-6 py-3 bg-gray-50/50 flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        <strong>Data Source:</strong> RBI Handbook of Statistics, IBJA, and MCX historical records.
                        Prices reflect average annual silver rate per Kg in INR.
                        Past performance is not indicative of future returns. Silver prices are subject to market risks.{' '}
                        <a
                            href="/silver_prices_india_1981_2026.csv"
                            download
                            className="text-slate-700 font-semibold underline hover:text-slate-900"
                        >
                            Download the full 1981–2026 dataset (CSV)
                        </a>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}
