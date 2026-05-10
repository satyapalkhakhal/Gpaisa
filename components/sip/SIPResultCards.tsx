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

  return (
    <div className="space-y-3">
      {/* Groww-style: Clean compact result list in a single card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Invested amount */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <span className="text-sm text-gray-600">Invested amount</span>
          <AnimatedNumber
            value={totalInvestment}
            className="text-sm font-semibold text-gray-900"
          />
        </div>

        {/* Est. returns */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <span className="text-sm text-gray-600">Est. returns</span>
          <AnimatedNumber
            value={estimatedReturns}
            className="text-sm font-semibold text-emerald-600"
          />
        </div>

        {/* Total value — highlighted */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50/70">
          <span className="text-sm font-semibold text-gray-800">Total value</span>
          <AnimatedNumber
            value={totalValue}
            className="text-base font-bold text-gray-900"
          />
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium">Investment Breakdown</span>
          <span>
            Returns:{' '}
            <span className="font-bold text-emerald-600">{returnsPct}%</span>
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${returnsPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            Invested ({investedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            Returns ({returnsPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
