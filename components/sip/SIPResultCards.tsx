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
  estimatedReturns: number;
  totalValue: number;
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

export default function SIPResultCards({
  totalInvestment,
  estimatedReturns,
  totalValue,
}: Props) {
  const investedPct =
    totalValue > 0 ? Math.round((totalInvestment / totalValue) * 100) : 0;
  const returnsPct = 100 - investedPct;
  const multiplier = totalInvestment > 0 ? (totalValue / totalInvestment).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Invested */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base shadow-sm">
                💰
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Invested Amount
              </span>
            </div>
            <AnimatedNumber
              value={totalInvestment}
              className="block text-2xl sm:text-[1.65rem] font-extrabold text-gray-900 tracking-tight"
            />
          </div>
        </div>

        {/* Returns */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-base shadow-sm">
                📈
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Est. Returns
              </span>
            </div>
            <AnimatedNumber
              value={estimatedReturns}
              className="block text-2xl sm:text-[1.65rem] font-extrabold text-emerald-600 tracking-tight"
            />
          </div>
        </div>

        {/* Total */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-emerald-50/80 rounded-2xl border-2 border-primary-300/60 p-5 shadow-md hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-primary-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-base shadow-sm">
                🏆
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                  Total Value
                </span>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-100 px-1.5 py-0.5 rounded-md">
                  {multiplier}×
                </span>
              </div>
            </div>
            <AnimatedNumber
              value={totalValue}
              className="block text-2xl sm:text-[1.65rem] font-extrabold text-gray-900 tracking-tight"
            />
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-gray-500 mb-2.5">
          <span className="font-medium">Investment Breakdown</span>
          <span>
            Returns:{' '}
            <span className="font-bold text-emerald-600">{returnsPct}%</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${returnsPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            Invested ({investedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            Returns ({returnsPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
