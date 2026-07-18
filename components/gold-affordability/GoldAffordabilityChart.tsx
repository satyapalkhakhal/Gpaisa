'use client';

import { useState, useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { GoldAffordabilityPoint } from '@/lib/goldHistoricalData';

interface GoldAffordabilityChartProps {
    data: GoldAffordabilityPoint[];
}

const PERIODS = [
    { label: '10Y', years: 10 },
    { label: '25Y', years: 25 },
    { label: '50Y', years: 50 },
    { label: 'All', years: 100 },
] as const;

export default function GoldAffordabilityChart({ data }: GoldAffordabilityChartProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<(typeof PERIODS)[number]['label']>('All');

    const filteredData = useMemo(() => {
        const years = PERIODS.find((p) => p.label === selectedPeriod)?.years ?? 100;
        const currentYear = new Date().getFullYear();
        return data.filter((d) => d.year >= currentYear - years);
    }, [data, selectedPeriod]);

    const chartData = useMemo(
        () => filteredData.map((d) => ({ year: d.year.toString(), grams: d.gramsPerReference })),
        [filteredData]
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-bold text-gray-900">Grams of Gold per ₹10,000, Over Time</h2>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                    {PERIODS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => setSelectedPeriod(p.label)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${selectedPeriod === p.label ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 sm:p-6">
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="affordabilityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" stroke="#6b7280" fontSize={12} />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            scale={selectedPeriod === 'All' || selectedPeriod === '50Y' ? 'log' : 'linear'}
                            domain={['auto', 'auto']}
                            tickFormatter={(v) => (v >= 1 ? v.toFixed(0) : v.toFixed(2))}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value.toLocaleString('en-IN')} g`, 'Grams per ₹10,000']}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }}
                        />
                        <Area type="monotone" dataKey="grams" stroke="#d97706" strokeWidth={2} fill="url(#affordabilityGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-3 text-center">
                    Y-axis uses a logarithmic scale for 50Y/All views, since the range spans over 1,500 grams to under 1 gram.
                </p>
            </div>
        </div>
    );
}
