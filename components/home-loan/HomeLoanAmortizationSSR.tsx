// Server-rendered amortization table for first 12 months
// This component renders static HTML that appears in View Source
import type { AmortizationRow } from '@/lib/homeLoanCalculations';

type Props = {
  schedule: AmortizationRow[];
  loanTenure: number;
  totalMonths: number;
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

export default function HomeLoanAmortizationSSR({ schedule, loanTenure, totalMonths }: Props) {
  if (schedule.length === 0) return null;

  // Year 1 summary
  let totalPrincipal = 0;
  let totalInterest = 0;
  schedule.forEach((row) => {
    totalPrincipal += row.principal;
    totalInterest += row.interest;
  });
  const lastRow = schedule[schedule.length - 1];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" id="amortization-schedule-ssr">
      {/* Header */}
      <div className="w-full flex justify-between items-center px-4 md:px-6 py-4 md:py-5 text-left">
        <div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            Home Loan Amortization Schedule
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Month-wise payment breakdown for {loanTenure} years ({totalMonths} months) — Showing Year 1</p>
        </div>
      </div>

      <div className="px-4 md:px-6 pb-4 md:pb-6">
        {/* Yearly Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
            <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Principal Paid</div>
            <div className="text-sm md:text-base font-extrabold text-emerald-800 mt-0.5">{fmtLakh(Math.round(totalPrincipal))}</div>
            <div className="text-[10px] text-emerald-500">Year 1</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
            <div className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">Interest Paid</div>
            <div className="text-sm md:text-base font-extrabold text-orange-800 mt-0.5">{fmtLakh(Math.round(totalInterest))}</div>
            <div className="text-[10px] text-orange-500">Year 1</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Outstanding</div>
            <div className="text-sm md:text-base font-extrabold text-gray-800 mt-0.5">{fmtLakh(lastRow ? Math.round(lastRow.balance) : 0)}</div>
            <div className="text-[10px] text-gray-500">End of Year 1</div>
          </div>
        </div>

        {/* Year Tab — Static "Yr 1" selected */}
        <div className="mb-3 -mx-1">
          <div className="flex overflow-x-auto gap-1 pb-1 px-1">
            <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 text-white shadow-sm">
              Yr 1
            </span>
            <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
              Yr 2
            </span>
            <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
              Yr 3
            </span>
            <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">
              …
            </span>
          </div>
        </div>

        {/* Amortization Table — First 12 months */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs md:text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 sticky top-0 z-10">
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">Month</th>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">Date</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 whitespace-nowrap">EMI</th>
                <th className="px-3 py-2.5 text-right font-semibold text-emerald-600 whitespace-nowrap">Principal</th>
                <th className="px-3 py-2.5 text-right font-semibold text-orange-600 whitespace-nowrap">Interest</th>
                <th className="px-3 py-2.5 text-right font-semibold text-gray-600 whitespace-nowrap">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, idx) => (
                <tr
                  key={row.month}
                  className={`border-t border-gray-100 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-3 py-2.5 font-medium text-gray-800">{row.month}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-gray-800">{fmt(row.emi)}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-emerald-600">{fmt(row.principal)}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-orange-600">{fmt(row.interest)}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-gray-900">{fmt(Math.max(0, row.balance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Navigation hint */}
        <div className="flex items-center justify-between mt-3">
          <span className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg opacity-40">
            ← Previous Year
          </span>
          <span className="text-xs text-gray-400">
            Year 1 of {Math.ceil(totalMonths / 12)}
          </span>
          <span className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg">
            Next Year →
          </span>
        </div>
      </div>
    </div>
  );
}
