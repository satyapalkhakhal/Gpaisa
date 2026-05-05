'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  initialValue: number;
  cagr: number;
  duration: number;
};

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const formatTooltip = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

type TooltipPayloadItem = { dataKey: string; value: number };

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const value = payload.find((p) => p.dataKey === 'value')?.value ?? 0;

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-3 md:p-4 min-w-[150px]">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">
        {label}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          Value
        </span>
        <span className="text-xs font-bold text-emerald-600">{formatTooltip(value)}</span>
      </div>
    </div>
  );
};

export default function CAGRChart({ initialValue, cagr, duration }: Props) {
  const chartData = useMemo(() => {
    const rate = cagr / 100;
    const data = [];

    for (let year = 0; year <= duration; year++) {
      data.push({
        year: year === 0 ? 'Start' : `Yr ${year}`,
        value: Math.round(initialValue * Math.pow(1 + rate, year)),
      });
    }
    return data;
  }, [initialValue, cagr, duration]);

  const finalValue = chartData[chartData.length - 1]?.value ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Investment Growth Curve
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Compounding at {cagr.toFixed(1)}% per year
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-emerald-200">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {formatTooltip(finalValue)}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full px-1 md:px-4 pb-3 md:pb-4 sip-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="cagrFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval={duration <= 10 ? 0 : duration <= 20 ? 1 : 2}
            />
            <YAxis
              tickFormatter={formatLakh}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#D1D5DB', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#cagrFill)"
              animationDuration={600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
