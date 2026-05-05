'use client';

import { useEffect, useRef } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  totalInvestment: number;
  totalInterest: number;
  maturityAmount: number;
  timePeriod: number;
};

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = prev.current;
    const end = value;
    prev.current = value;

    if (start === end) {
      el.textContent = fmt(end);
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = fmt(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref} className={className}>{fmt(value)}</span>;
}

export default function PPFResultCards({
  totalInvestment,
  totalInterest,
  maturityAmount,
  timePeriod,
}: Props) {
  const investedPct =
    maturityAmount > 0 ? Math.round((totalInvestment / maturityAmount) * 100) : 0;
  const interestPct = 100 - investedPct;
  const multiplier = totalInvestment > 0 ? (maturityAmount / totalInvestment).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Result Cards — stacked on mobile, 3-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Invested */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
              💰
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Invested
              </span>
              <AnimatedNumber
                value={totalInvestment}
                className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* Interest */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">
              📈
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Interest Earned
              </span>
              <AnimatedNumber
                value={totalInterest}
                className="block text-xl md:text-2xl font-extrabold text-emerald-600 tracking-tight mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* Maturity */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-emerald-50/80 rounded-2xl border-2 border-primary-300/60 p-4 md:p-5 shadow-md">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">
              🏆
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-primary-700 uppercase tracking-wider">
                  Maturity Value
                </span>
                <span className="text-[11px] font-bold text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded-md">
                  {multiplier}×
                </span>
              </div>
              <AnimatedNumber
                value={maturityAmount}
                className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
              <span className="text-[11px] text-gray-500">After {timePeriod} years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-gray-500 mb-2.5">
          <span className="font-medium">Investment Breakdown</span>
          <span>
            Interest:{' '}
            <span className="font-bold text-emerald-600">{interestPct}%</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${interestPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            Invested ({investedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            Interest ({interestPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
