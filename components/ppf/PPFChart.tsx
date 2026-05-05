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

type PPFChartProps = {
  yearlyInvestment: number;
  interestRate: number;
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

type TooltipPayloadItem = { dataKey: string; value: number };

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
  if (!active || !payload?.length) return null;

  const invested = payload.find((p) => p.dataKey === 'invested')?.value ?? 0;
  const totalValue = payload.find((p) => p.dataKey === 'totalValue')?.value ?? 0;
  const interest = totalValue - invested;

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-3 md:p-4 min-w-[160px] md:min-w-[180px]">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 md:mb-3 pb-2 border-b border-gray-100">
        {label}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Invested
          </span>
          <span className="text-xs font-bold text-gray-900">{formatTooltipValue(invested)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Total Value
          </span>
          <span className="text-xs font-bold text-emerald-600">{formatTooltipValue(totalValue)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Interest Earned</span>
          <span className="text-xs font-bold text-emerald-600">+{formatTooltipValue(interest)}</span>
        </div>
      </div>
    </div>
  );
};

export default function PPFChart({
  yearlyInvestment,
  interestRate,
  timePeriod,
}: PPFChartProps) {
  const chartData = useMemo(() => {
    const rate = interestRate / 100;
    const data = [];
    let balance = 0;

    // Start point
    data.push({
      year: 'Start',
      invested: 0,
      totalValue: 0,
    });

    for (let year = 1; year <= timePeriod; year++) {
      const invested = yearlyInvestment * year;
      const interest = (balance + yearlyInvestment) * rate;
      balance = balance + yearlyInvestment + interest;

      data.push({
        year: `Yr ${year}`,
        invested: Math.round(invested),
        totalValue: Math.round(balance),
      });
    }
    return data;
  }, [yearlyInvestment, interestRate, timePeriod]);

  const finalData = chartData[chartData.length - 1];
  const totalInterest = finalData ? finalData.totalValue - finalData.invested : 0;

  // Calculate responsive intervals based on time period
  const xAxisInterval = timePeriod <= 5 ? 0 : timePeriod <= 15 ? 1 : timePeriod <= 25 ? 2 : 4;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Investment Growth
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            PPF compound interest growth
          </p>
        </div>
        {totalInterest > 0 && (
          <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-emerald-200">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatTooltipValue(totalInterest)} interest
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full px-1 md:px-4 pb-3 md:pb-4 sip-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 8, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ppfInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="ppfTotal" x1="0" y1="0" x2="0" y2="1">
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
              interval={xAxisInterval}
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
              cursor={{
                stroke: '#D1D5DB',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              formatter={(value: string) =>
                value === 'invested' ? 'Invested' : 'Total Value'
              }
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#ppfInvested)"
              animationDuration={600}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#ppfTotal)"
              animationDuration={600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
