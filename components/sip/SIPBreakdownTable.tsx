'use client';

import { useMemo } from 'react';

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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Year-wise Breakdown
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Detailed view of your investment growth each year
      </p>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-600">
                Year
              </th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">
                Total Invested
              </th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">
                Interest Earned
              </th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">
                Total Value
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.year}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-3 font-medium text-gray-900">
                  {row.year}
                </td>
                <td className="py-3 px-3 text-right text-gray-700">
                  {fmt(row.invested)}
                </td>
                <td className="py-3 px-3 text-right font-medium text-emerald-600">
                  {fmt(row.interest)}
                </td>
                <td className="py-3 px-3 text-right font-bold text-gray-900">
                  {fmt(row.totalValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
