'use client';

import { useMemo, useState } from 'react';

type Props = {
  yearlyInvestment: number;
  interestRate: number;
  timePeriod: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function PPFBreakdownTable({
  yearlyInvestment,
  interestRate,
  timePeriod,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rows = useMemo(() => {
    const rate = interestRate / 100;
    const data = [];
    let balance = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const invested = yearlyInvestment * year;
      const interest = (balance + yearlyInvestment) * rate;
      balance = balance + yearlyInvestment + interest;

      data.push({
        year,
        invested: Math.round(invested),
        interest: Math.round(balance - invested),
        totalValue: Math.round(balance),
      });
    }
    return data;
  }, [yearlyInvestment, interestRate, timePeriod]);

  const visibleRows = isExpanded ? rows : rows.slice(0, 5);
  const hasMore = rows.length > 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Year-wise Breakdown
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            PPF growth each year
          </p>
        </div>
        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
          {timePeriod} {timePeriod === 1 ? 'Year' : 'Years'}
        </span>
      </div>

      {/* Table — mobile scroll container */}
      <div className="sip-scroll-container">
        <table className="w-full min-w-[340px] text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Year
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Invested
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Interest
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => (
              <tr
                key={row.year}
                className={`border-t border-gray-100 transition-colors ${
                  idx === visibleRows.length - 1 && !isExpanded && hasMore
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <td className="py-3 px-3 md:px-5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-[11px] font-bold text-gray-600">
                      {row.year}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-3 md:px-5 text-right text-gray-700 font-medium tabular-nums text-[13px] md:text-sm">
                  {fmt(row.invested)}
                </td>
                <td className="py-3 px-3 md:px-5 text-right font-semibold text-emerald-600 tabular-nums text-[13px] md:text-sm">
                  {fmt(row.interest)}
                </td>
                <td className="py-3 px-3 md:px-5 text-right font-bold text-gray-900 tabular-nums text-[13px] md:text-sm">
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
            className="sip-touch-target w-full py-3.5 min-h-[44px] text-sm font-semibold text-primary-600 active:bg-primary-50/80 transition-colors flex items-center justify-center gap-1.5"
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
