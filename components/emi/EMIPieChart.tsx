'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

type EMIPieChartProps = {
  loanAmount: number;
  totalInterest: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const COLORS = ['#3B82F6', '#F97316'];

type PiePayloadItem = {
  name: string;
  value: number;
  payload?: { name: string; value: number };
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: PiePayloadItem[];
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = (item.payload?.value ?? 0);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-3 min-w-[140px]">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
        {item.name}
      </div>
      <div className="text-sm font-extrabold text-gray-900">
        {fmt(total)}
      </div>
    </div>
  );
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.08) return null; // Don't render label for tiny slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function EMIPieChart({
  loanAmount,
  totalInterest,
}: EMIPieChartProps) {
  const chartData = useMemo(
    () => [
      { name: 'Principal', value: loanAmount },
      { name: 'Interest', value: totalInterest },
    ],
    [loanAmount, totalInterest]
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Principal vs Interest
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Where your money goes
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-orange-200">
          {fmt(totalInterest)} interest
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full px-2 md:px-4 pb-4 md:pb-5" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              animationDuration={600}
              animationEasing="ease-out"
              label={renderCustomLabel}
              labelLine={false}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs font-semibold text-gray-600">{value}</span>
              )}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 border-t border-gray-100">
        <div className="px-4 md:px-6 py-3 md:py-4 border-r border-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Principal</span>
          </div>
          <div className="text-sm md:text-base font-extrabold text-gray-900">{fmt(loanAmount)}</div>
        </div>
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Interest</span>
          </div>
          <div className="text-sm md:text-base font-extrabold text-orange-600">{fmt(totalInterest)}</div>
        </div>
      </div>
    </div>
  );
}
