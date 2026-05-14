'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type Props = {
  loanAmount: number;
  totalInterest: number;
  prepaymentActive?: boolean;
  prepayTotalInterest?: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtLakh = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return fmt(n);
};

const COLORS = {
  principal: '#10B981',
  interest: '#F97316',
  prepayInterest: '#FB923C',
};

type TooltipPayloadItem = {
  name: string;
  value: number;
  payload: { fill: string };
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-3 min-w-[140px]">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.payload.fill }} />
        <span className="text-xs font-semibold text-gray-700">{item.name}</span>
      </div>
      <div className="text-sm font-bold text-gray-900 mt-1">{fmt(item.value)}</div>
    </div>
  );
};

const CenterLabel = ({ cx, cy, total }: { cx: number; cy: number; total: number }) => (
  <g>
    <text x={cx} y={cy - 8} textAnchor="middle" className="fill-gray-500 text-[10px] font-semibold">
      Total Payment
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-900 text-[15px] font-extrabold">
      {fmtLakh(total)}
    </text>
  </g>
);

export default function HomeLoanDonutChart({
  loanAmount,
  totalInterest,
  prepaymentActive = false,
  prepayTotalInterest = 0,
}: Props) {
  const data = useMemo(() => [
    { name: 'Principal', value: loanAmount, fill: COLORS.principal },
    { name: 'Interest', value: totalInterest, fill: COLORS.interest },
  ], [loanAmount, totalInterest]);

  const prepayData = useMemo(() => [
    { name: 'Principal', value: loanAmount, fill: COLORS.principal },
    { name: 'Interest', value: prepayTotalInterest, fill: COLORS.prepayInterest },
  ], [loanAmount, prepayTotalInterest]);

  const totalAmount = loanAmount + totalInterest;
  const prepayTotal = loanAmount + prepayTotalInterest;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
        <h3 className="text-base md:text-lg font-bold text-gray-900">Payment Breakdown</h3>
        <p className="text-xs text-gray-500 mt-0.5">Principal vs Interest distribution</p>
      </div>

      <div className={`w-full px-2 md:px-4 pb-4 ${prepaymentActive ? 'grid grid-cols-2 gap-2' : ''}`}>
        {/* Main Chart */}
        <div>
          {prepaymentActive && (
            <div className="text-center text-[11px] font-semibold text-gray-500 mb-1">Without Prepayment</div>
          )}
          <div className="h-[200px] md:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={600}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <CenterLabel cx={0} cy={0} total={totalAmount} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prepayment Comparison Chart */}
        {prepaymentActive && (
          <div>
            <div className="text-center text-[11px] font-semibold text-emerald-600 mb-1">With Prepayment</div>
            <div className="h-[200px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepayData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={600}
                    animationEasing="ease-out"
                  >
                    {prepayData.map((entry, index) => (
                      <Cell key={`prep-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <CenterLabel cx={0} cy={0} total={prepayTotal} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 md:px-6 pb-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <div>
            <div className="text-[11px] text-gray-500">Principal</div>
            <div className="text-xs font-bold text-gray-900">{fmtLakh(loanAmount)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <div>
            <div className="text-[11px] text-gray-500">Interest</div>
            <div className="text-xs font-bold text-orange-600">{fmtLakh(totalInterest)}</div>
          </div>
        </div>
        {prepaymentActive && prepayTotalInterest < totalInterest && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-200" />
            <div>
              <div className="text-[11px] text-emerald-600 font-semibold">Saved</div>
              <div className="text-xs font-bold text-emerald-700">{fmtLakh(totalInterest - prepayTotalInterest)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
