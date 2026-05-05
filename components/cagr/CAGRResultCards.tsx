'use client';

import { useEffect, useRef } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  cagr: number;
  totalGrowth: number;
  absoluteReturn: number;
  initialValue: number;
  finalValue: number;
  duration: number;
};

function AnimatedNumber({ value, className, format }: { value: number; className?: string; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = prev.current;
    const end = value;
    prev.current = value;

    if (start === end) {
      el.textContent = format(end);
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * eased;
      el.textContent = format(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, format]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}

export default function CAGRResultCards({
  cagr,
  totalGrowth,
  absoluteReturn,
  initialValue,
  finalValue,
  duration,
}: Props) {
  const investedPct = finalValue > 0 ? Math.round((initialValue / finalValue) * 100) : 0;
  const growthPct = 100 - investedPct;
  // Rule of 72
  const doublingYears = cagr > 0 ? (72 / cagr).toFixed(1) : '∞';

  return (
    <div className="space-y-4">
      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* CAGR — Hero card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 via-white to-green-50/80 rounded-2xl border-2 border-emerald-300/60 p-4 md:p-5 shadow-md">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">
              📈
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-emerald-700 uppercase tracking-wider block">
                CAGR
              </span>
              <AnimatedNumber
                value={cagr}
                format={(v) => `${v.toFixed(2)}%`}
                className="block text-2xl md:text-3xl font-extrabold text-emerald-600 tracking-tight mt-0.5"
              />
              <span className="text-[11px] text-gray-500">per annum</span>
            </div>
          </div>
        </div>

        {/* Total Growth */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-blue-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
              📊
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Growth
              </span>
              <AnimatedNumber
                value={totalGrowth}
                format={(v) => `${v.toFixed(1)}%`}
                className="block text-xl md:text-2xl font-extrabold text-blue-600 tracking-tight mt-0.5"
              />
              <span className="text-[11px] text-gray-500">over {duration} years</span>
            </div>
          </div>
        </div>

        {/* Absolute Profit */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-lg flex-shrink-0">
              💰
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Absolute Profit
              </span>
              <AnimatedNumber
                value={absoluteReturn}
                format={(v) => fmt(Math.round(v))}
                className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
        <div className="flex justify-between text-xs text-gray-500 mb-2.5">
          <span className="font-medium">Investment Breakdown</span>
          <span>
            Doubles in <span className="font-bold text-emerald-600">{doublingYears} yrs</span>
            <span className="text-gray-400 ml-1">(Rule of 72)</span>
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${investedPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${growthPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            Initial ({investedPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
            Growth ({growthPct}%)
          </span>
        </div>
      </div>
    </div>
  );
}
