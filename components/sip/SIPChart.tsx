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

const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
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
        year: `Yr ${year}`,
        invested: Math.round(invested),
        totalValue: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Investment Growth Over Time
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        See how your wealth grows with the power of compounding
      </p>
      <div className="w-full" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatLakh}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              formatter={(value, name) => [
                formatTooltipValue(Number(value)),
                name === 'invested' ? 'Amount Invested' : 'Total Value',
              ]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) =>
                value === 'invested' ? 'Amount Invested' : 'Total Value'
              }
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="invested"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorInvested)"
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#colorTotal)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
