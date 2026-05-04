'use client';

import { useMemo, useState } from 'react';

type Props = {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function SIPBreakdownTable({
  monthlyInvestment,
  expectedReturn,
  timePeriod,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rows = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const data = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const invested = monthlyInvestment * months;
      let totalValue = 0;
      if (monthlyRate > 0) {
        totalValue =
          monthlyInvestment *
          (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate));
      } else {
        totalValue = invested;
      }
      const interest = totalValue - invested;
      data.push({
        year,
        invested: Math.round(invested),
        interest: Math.round(interest),
        totalValue: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const visibleRows = isExpanded ? rows : rows.slice(0, 5);
  const hasMore = rows.length > 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Year-wise Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Detailed view of your investment growth each year
          </p>
        </div>
        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
          {timePeriod} {timePeriod === 1 ? 'Year' : 'Years'}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left py-3 px-4 sm:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Year
              </th>
              <th className="text-right py-3 px-4 sm:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Total Invested
              </th>
              <th className="text-right py-3 px-4 sm:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Interest Earned
              </th>
              <th className="text-right py-3 px-4 sm:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Total Value
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => (
              <tr
                key={row.year}
                className={`border-t border-gray-100 hover:bg-primary-50/30 transition-colors ${
                  idx === visibleRows.length - 1 && !isExpanded && hasMore
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <td className="py-3.5 px-4 sm:px-5">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-[11px] font-bold text-gray-600">
                      {row.year}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Year
                    </span>
                  </span>
                </td>
                <td className="py-3.5 px-4 sm:px-5 text-right text-gray-700 font-medium tabular-nums">
                  {fmt(row.invested)}
                </td>
                <td className="py-3.5 px-4 sm:px-5 text-right font-semibold text-emerald-600 tabular-nums">
                  {fmt(row.interest)}
                </td>
                <td className="py-3.5 px-4 sm:px-5 text-right font-bold text-gray-900 tabular-nums">
                  {fmt(row.totalValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More / Less */}
      {hasMore && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50/50 transition-colors flex items-center justify-center gap-1.5"
          >
            {isExpanded ? (
              <>
                Show Less
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                Show All {rows.length} Years
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
