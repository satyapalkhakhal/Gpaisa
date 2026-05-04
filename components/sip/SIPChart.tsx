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
  Legend,
} from 'recharts';

type SIPChartProps = {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
};

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const formatTooltipValue = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const invested = payload.find((p: { dataKey: string }) => p.dataKey === 'invested')?.value ?? 0;
  const totalValue = payload.find((p: { dataKey: string }) => p.dataKey === 'totalValue')?.value ?? 0;
  const returns = totalValue - invested;

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-4 min-w-[180px]">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
        {label}
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Invested
          </span>
          <span className="text-xs font-bold text-gray-900">{formatTooltipValue(invested)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Total Value
          </span>
          <span className="text-xs font-bold text-emerald-600">{formatTooltipValue(totalValue)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Returns</span>
          <span className="text-xs font-bold text-emerald-600">+{formatTooltipValue(returns)}</span>
        </div>
      </div>
    </div>
  );
};

export default function SIPChart({
  monthlyInvestment,
  expectedReturn,
  timePeriod,
}: SIPChartProps) {
  const chartData = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const data = [];

    for (let year = 0; year <= timePeriod; year++) {
      const months = year * 12;
      const invested = monthlyInvestment * months;
      let totalValue = 0;
      if (months > 0 && monthlyRate > 0) {
        totalValue =
          monthlyInvestment *
          (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate));
      }
      data.push({
        year: year === 0 ? 'Start' : `Year ${year}`,
        invested: Math.round(invested),
        totalValue: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const finalData = chartData[chartData.length - 1];
  const totalReturns = finalData ? finalData.totalValue - finalData.invested : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Investment Growth Over Time
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Visualising the power of compounding
          </p>
        </div>
        {totalReturns > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-emerald-200">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatTooltipValue(totalReturns)} returns
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full px-2 sm:px-4 pb-4" style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="sipInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="sipTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval={timePeriod <= 10 ? 0 : timePeriod <= 20 ? 1 : 2}
            />
            <YAxis
              tickFormatter={formatLakh}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#D1D5DB',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) =>
                value === 'invested' ? 'Amount Invested' : 'Total Value'
              }
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#sipInvested)"
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#sipTotal)"
              animationDuration={600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
