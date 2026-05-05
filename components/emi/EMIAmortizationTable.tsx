'use client';

import { useMemo, useState } from 'react';

type Props = {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEMI: number;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export default function EMIAmortizationTable({
  loanAmount,
  interestRate,
  tenureMonths,
  monthlyEMI,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');

  const yearlyRows = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const data = [];
    let balance = loanAmount;

    for (let year = 1; year <= Math.ceil(tenureMonths / 12); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      const monthsInYear = Math.min(12, tenureMonths - (year - 1) * 12);

      for (let month = 1; month <= monthsInYear; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyEMI - interest;

        yearlyInterest += interest;
        yearlyPrincipal += principalPaid;
        balance -= principalPaid;
      }

      data.push({
        period: `Year ${year}`,
        emi: Math.round(monthlyEMI * monthsInYear),
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.max(0, Math.round(balance)),
      });

      if (balance <= 0) break;
    }
    return data;
  }, [loanAmount, interestRate, tenureMonths, monthlyEMI]);

  const monthlyRows = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const data = [];
    let balance = loanAmount;

    for (let month = 1; month <= tenureMonths; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyEMI - interest;
      balance -= principalPaid;

      data.push({
        period: `Month ${month}`,
        emi: Math.round(monthlyEMI),
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      });

      if (balance <= 0) break;
    }
    return data;
  }, [loanAmount, interestRate, tenureMonths, monthlyEMI]);

  const rows = viewMode === 'yearly' ? yearlyRows : monthlyRows;
  const visibleRows = isExpanded ? rows : rows.slice(0, 5);
  const hasMore = rows.length > 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Amortization Schedule
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            How your EMI is distributed
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button
            onClick={() => { setViewMode('yearly'); setIsExpanded(false); }}
            className={`sip-touch-target px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                : 'text-gray-500 active:bg-gray-100/80'
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => { setViewMode('monthly'); setIsExpanded(false); }}
            className={`sip-touch-target px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                : 'text-gray-500 active:bg-gray-100/80'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Table — mobile scroll container */}
      <div className="sip-scroll-container">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="text-left py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Period
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                EMI
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Principal
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Interest
              </th>
              <th className="text-right py-2.5 px-3 md:px-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => (
              <tr
                key={row.period}
                className={`border-t border-gray-100 transition-colors ${
                  idx === visibleRows.length - 1 && !isExpanded && hasMore
                    ? 'opacity-60'
                    : ''
                }`}
              >
                <td className="py-3 px-3 md:px-5">
                  <span className="text-[13px] md:text-sm font-medium text-gray-700">
                    {row.period}
                  </span>
                </td>
                <td className="py-3 px-3 md:px-5 text-right text-gray-700 font-medium tabular-nums text-[13px] md:text-sm">
                  {fmt(row.emi)}
                </td>
                <td className="py-3 px-3 md:px-5 text-right font-semibold text-blue-600 tabular-nums text-[13px] md:text-sm">
                  {fmt(row.principal)}
                </td>
                <td className="py-3 px-3 md:px-5 text-right font-semibold text-orange-600 tabular-nums text-[13px] md:text-sm">
                  {fmt(row.interest)}
                </td>
                <td className="py-3 px-3 md:px-5 text-right font-bold text-gray-900 tabular-nums text-[13px] md:text-sm">
                  {fmt(row.balance)}
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
                Show Full Schedule ({rows.length} {viewMode === 'yearly' ? 'years' : 'months'})
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
