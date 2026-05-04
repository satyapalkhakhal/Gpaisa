'use client';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
};

export default function SIPResultCards({
  totalInvestment,
  estimatedReturns,
  totalValue,
}: Props) {
  const investedPct =
    totalValue > 0 ? Math.round((totalInvestment / totalValue) * 100) : 0;
  const returnsPct = 100 - investedPct;

  return (
    <div className="space-y-4">
      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Invested */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base">
              💰
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Invested Amount
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {fmt(totalInvestment)}
          </div>
        </div>

        {/* Returns */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-base">
              📈
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Est. Returns
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
            {fmt(estimatedReturns)}
          </div>
        </div>

        {/* Total */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl border-2 border-primary-300 p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500" />
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-base">
              🏆
            </span>
            <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
              Total Value
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {fmt(totalValue)}
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Investment Breakdown</span>
          <span>
            Returns: <span className="font-bold text-emerald-600">{returnsPct}%</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-blue-500 transition-all duration-500 ease-out rounded-l-full"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="bg-emerald-500 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${returnsPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            Invested ({investedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            Returns ({returnsPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
