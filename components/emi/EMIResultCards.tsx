'use client';

import { useEffect, useRef } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  loanAmount: number;
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
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = fmt(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span ref={ref} className={className}>{fmt(value)}</span>;
}

export default function EMIResultCards({
  monthlyEMI,
  totalInterest,
  totalPayment,
  loanAmount,
}: Props) {
  const principalPct =
    totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 0;
  const interestPct = 100 - principalPct;

  return (
    <div className="space-y-4">
      {/* Result Cards — stacked on mobile, 3-col on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Monthly EMI — Hero card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-blue-50/80 rounded-2xl border-2 border-primary-300/60 p-4 md:p-5 shadow-md">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-blue-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">
              💳
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-primary-700 uppercase tracking-wider block">
                Your EMI
              </span>
              <AnimatedNumber
                value={monthlyEMI}
                className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
              <span className="text-[11px] text-gray-500">per month</span>
            </div>
          </div>
        </div>

        {/* Total Interest */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-orange-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg flex-shrink-0">
              📊
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Interest
              </span>
              <AnimatedNumber
                value={totalInterest}
                className="block text-xl md:text-2xl font-extrabold text-orange-600 tracking-tight mt-0.5"
              />
            </div>
          </div>
        </div>

        {/* Total Payment */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
              🏦
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Cost
              </span>
              <AnimatedNumber
                value={totalPayment}
                className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-gray-500 mb-2.5">
          <span className="font-medium">Payment Breakdown</span>
          <span>
            Interest:{' '}
            <span className="font-bold text-orange-600">{interestPct}%</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${principalPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${interestPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            Principal ({principalPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />
            Interest ({interestPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
