'use client';

import { useState, useMemo } from 'react';
import type { AmortizationRow } from '@/lib/homeLoanCalculations';

export type { AmortizationRow };

type Props = {
  schedule: AmortizationRow[];
  loanTenure: number;
  prepaymentActive?: boolean;
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtLakh = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return fmt(n);
};

export default function HomeLoanAmortization({ schedule, loanTenure, prepaymentActive = false }: Props) {
  const totalYears = Math.ceil(schedule.length / 12);
  const [selectedYear, setSelectedYear] = useState(1);
  const [showTable, setShowTable] = useState(false);

  // Get rows for selected year
  const yearRows = useMemo(() => {
    const startIdx = (selectedYear - 1) * 12;
    return schedule.slice(startIdx, startIdx + 12);
  }, [schedule, selectedYear]);

  // Yearly summary for selected year
  const yearlySummary = useMemo(() => {
    let totalPrincipal = 0;
    let totalInterest = 0;
    let totalPrepayment = 0;
    yearRows.forEach((row) => {
      totalPrincipal += row.principal;
      totalInterest += row.interest;
      totalPrepayment += row.prepayment;
    });
    const lastRow = yearRows[yearRows.length - 1];
    return {
      totalPrincipal: Math.round(totalPrincipal),
      totalInterest: Math.round(totalInterest),
      totalPrepayment: Math.round(totalPrepayment),
      outstandingBalance: lastRow ? Math.round(lastRow.balance) : 0,
    };
  }, [yearRows]);

  // Year tab ranges for the scrollable tabs
  const yearTabs = useMemo(() => {
    const tabs = [];
    for (let i = 1; i <= totalYears; i++) {
      tabs.push(i);
    }
    return tabs;
  }, [totalYears]);

  if (schedule.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setShowTable(!showTable)}
        className="w-full flex justify-between items-center px-4 md:px-6 py-4 md:py-5 text-left"
      >
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Home Loan Amortization Schedule
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Month-wise payment breakdown for {loanTenure} years ({schedule.length} months)</p>
        </div>
        <span className="text-xl text-gray-400 flex-shrink-0 ml-3">{showTable ? '−' : '+'}</span>
      </button>

      {showTable && (
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          {/* Yearly Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Principal Paid</div>
              <div className="text-sm md:text-base font-extrabold text-emerald-800 mt-0.5">{fmtLakh(yearlySummary.totalPrincipal)}</div>
              <div className="text-[10px] text-emerald-500">Year {selectedYear}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
              <div className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">Interest Paid</div>
              <div className="text-sm md:text-base font-extrabold text-orange-800 mt-0.5">{fmtLakh(yearlySummary.totalInterest)}</div>
              <div className="text-[10px] text-orange-500">Year {selectedYear}</div>
            </div>
            {prepaymentActive && yearlySummary.totalPrepayment > 0 && (
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Prepayment</div>
                <div className="text-sm md:text-base font-extrabold text-blue-800 mt-0.5">{fmtLakh(yearlySummary.totalPrepayment)}</div>
                <div className="text-[10px] text-blue-500">Year {selectedYear}</div>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Outstanding</div>
              <div className="text-sm md:text-base font-extrabold text-gray-800 mt-0.5">{fmtLakh(yearlySummary.outstandingBalance)}</div>
              <div className="text-[10px] text-gray-500">End of Year {selectedYear}</div>
            </div>
          </div>

          {/* Year Tabs — Scrollable */}
          <div className="mb-3 -mx-1">
            <div className="flex overflow-x-auto gap-1 pb-1 px-1 scrollbar-hide">
              {yearTabs.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedYear === year
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                >
                  Yr {year}
                </button>
              ))}
            </div>
          </div>

          {/* Amortization Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs md:text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 sticky top-0 z-10">
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">Month</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-gray-600 whitespace-nowrap">EMI</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-emerald-600 whitespace-nowrap">Principal</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-orange-600 whitespace-nowrap">Interest</th>
                  {prepaymentActive && (
                    <th className="px-3 py-2.5 text-right font-semibold text-blue-600 whitespace-nowrap">Prepayment</th>
                  )}
                  <th className="px-3 py-2.5 text-right font-semibold text-gray-600 whitespace-nowrap">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearRows.map((row, idx) => (
                  <tr
                    key={row.month}
                    className={`border-t border-gray-100 transition-colors hover:bg-blue-50/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      } ${row.balance <= 0 ? 'bg-emerald-50/50' : ''}`}
                  >
                    <td className="px-3 py-2.5 font-medium text-gray-800">{row.month}</td>
                    <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-gray-800">{fmt(row.emi)}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-emerald-600">{fmt(row.principal)}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-orange-600">{fmt(row.interest)}</td>
                    {prepaymentActive && (
                      <td className="px-3 py-2.5 text-right font-medium text-blue-600">
                        {row.prepayment > 0 ? fmt(row.prepayment) : '—'}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-right font-bold text-gray-900">{fmt(Math.max(0, row.balance))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation hint */}
          <div className="flex items-center justify-between mt-3">
            <button
              disabled={selectedYear <= 1}
              onClick={() => setSelectedYear((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg disabled:opacity-40 active:bg-gray-200 transition-all"
            >
              ← Previous Year
            </button>
            <span className="text-xs text-gray-400">
              Year {selectedYear} of {totalYears}
            </span>
            <button
              disabled={selectedYear >= totalYears}
              onClick={() => setSelectedYear((p) => Math.min(totalYears, p + 1))}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg disabled:opacity-40 active:bg-gray-200 transition-all"
            >
              Next Year →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
