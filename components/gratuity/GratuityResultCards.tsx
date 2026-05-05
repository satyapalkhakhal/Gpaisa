'use client';

import { useEffect, useRef } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  gratuityAmount: number;
  eligibleYears: number;
  lastSalary: number;
  isEligible: boolean;
  isCapped: boolean;
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

export default function GratuityResultCards({
  gratuityAmount,
  eligibleYears,
  lastSalary,
  isEligible,
  isCapped,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Eligibility Warning */}
      {!isEligible && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="text-sm font-bold text-red-800 mb-1">Not Eligible for Gratuity</h3>
              <p className="text-xs md:text-sm text-red-700 leading-relaxed">
                Minimum <strong>5 years of continuous service</strong> is required for gratuity eligibility.
                Exception: In case of death or disability, the 5-year rule does not apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Gratuity Amount — Hero card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-emerald-50/80 rounded-2xl border-2 border-primary-300/60 p-4 md:p-5 shadow-md md:col-span-2">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">
              🏆
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-primary-700 uppercase tracking-wider">
                  Estimated Gratuity
                </span>
                {isCapped && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                    CAPPED ₹20L
                  </span>
                )}
              </div>
              <AnimatedNumber
                value={gratuityAmount}
                className="block text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5"
              />
              <span className="text-[11px] text-emerald-600 font-semibold">Tax Free (up to ₹20 lakh)</span>
            </div>
          </div>
        </div>

        {/* Eligible Years */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
              📅
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block">
                Eligible Years
              </span>
              <span className="block text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                {eligibleYears} {eligibleYears === 1 ? 'Year' : 'Years'}
              </span>
              <span className="text-[11px] text-gray-500">After rounding rule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Summary */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Calculation Breakdown</div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-700 font-mono flex-wrap">
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{fmt(lastSalary)}</span>
            <span className="text-gray-400">×</span>
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">15</span>
            <span className="text-gray-400">×</span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">{eligibleYears}</span>
            <span className="text-gray-400">÷</span>
            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">26</span>
            <span className="text-gray-400">=</span>
            <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-bold">{fmt(gratuityAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
