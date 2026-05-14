'use client';

import { useEffect, useRef } from 'react';

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

type Props = {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  loanAmount: number;
  payoffDate: string; // e.g. "Aug 2046"
  // Prepayment comparison (optional)
  prepaymentActive?: boolean;
  prepayEMI?: number;
  prepayTotalInterest?: number;
  prepayTotalAmount?: number;
  prepayPayoffDate?: string;
  prepayTenureMonths?: number;
  originalTenureMonths?: number;
};

function AnimatedNumber({ value, className, formatter = fmt }: { value: number; className?: string; formatter?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = prev.current;
    const end = value;
    prev.current = value;
    if (start === end) { el.textContent = formatter(end); return; }
    const duration = 400;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = formatter(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, formatter]);

  return <span ref={ref} className={className}>{formatter(value)}</span>;
}

export default function HomeLoanResultCards({
  monthlyEMI,
  totalInterest,
  totalAmount,
  loanAmount,
  payoffDate,
  prepaymentActive = false,
  prepayEMI = 0,
  prepayTotalInterest = 0,
  prepayTotalAmount = 0,
  prepayPayoffDate = '',
  prepayTenureMonths = 0,
  originalTenureMonths = 0,
}: Props) {
  const interestSaved = prepaymentActive ? totalInterest - prepayTotalInterest : 0;
  const tenureSaved = prepaymentActive ? originalTenureMonths - prepayTenureMonths : 0;

  return (
    <div className="space-y-4">
      {/* Main Result Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Monthly EMI — Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-emerald-50/80 rounded-2xl border-2 border-primary-300/60 p-4 md:p-5 shadow-md col-span-2">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500" />
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg flex-shrink-0">💰</span>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-primary-700 uppercase tracking-wider">Monthly EMI</span>
              <AnimatedNumber value={monthlyEMI} className="block text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5" />
              {prepaymentActive && prepayEMI !== monthlyEMI && (
                <span className="text-[11px] text-emerald-600 font-semibold">
                  After prepayment: {fmt(prepayEMI)} (save {fmt(monthlyEMI - prepayEMI)}/mo)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Interest */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Interest</span>
            <AnimatedNumber value={totalInterest} className="text-lg md:text-xl font-extrabold text-orange-600 tracking-tight" formatter={fmtLakh} />
            <span className="text-[10px] text-gray-400">{((totalInterest / loanAmount) * 100).toFixed(0)}% of principal</span>
          </div>
        </div>

        {/* Total Payment */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600" />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Payment</span>
            <AnimatedNumber value={totalAmount} className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight" formatter={fmtLakh} />
            <span className="text-[10px] text-gray-400">Principal + Interest</span>
          </div>
        </div>

        {/* Payoff Date */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm col-span-2 md:col-span-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">📅</span>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Loan Payoff</span>
              <span className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight block mt-0.5">{payoffDate}</span>
              {prepaymentActive && prepayPayoffDate && prepayPayoffDate !== payoffDate && (
                <span className="text-[10px] text-emerald-600 font-semibold">With prepayment: {prepayPayoffDate}</span>
              )}
            </div>
          </div>
        </div>

        {/* Interest Ratio Bar */}
        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-gray-200/80 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Principal vs Interest</span>
            <span className="text-[11px] text-gray-400">{((loanAmount / totalAmount) * 100).toFixed(0)}% : {((totalInterest / totalAmount) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-l-full transition-all duration-500"
              style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-r-full transition-all duration-500"
              style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Principal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" />Interest</span>
          </div>
        </div>
      </div>

      {/* Prepayment Savings Banner */}
      {prepaymentActive && interestSaved > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">🎉</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-emerald-800">Prepayment Savings</div>
              <div className="text-xs text-emerald-700 mt-0.5">
                You save <strong className="text-emerald-900">{fmtLakh(interestSaved)}</strong> in interest
                {tenureSaved > 0 && (
                  <> and <strong className="text-emerald-900">{Math.floor(tenureSaved / 12)} yr {tenureSaved % 12} mo</strong> in tenure</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
