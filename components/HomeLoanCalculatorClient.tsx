'use client';

import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import { homeLoanBanks } from '@/lib/homeLoanBankData';
import HomeLoanResultCards from '@/components/home-loan/HomeLoanResultCards';
import HomeLoanPrepayment, { type PrepaymentConfig } from '@/components/home-loan/HomeLoanPrepayment';
import HomeLoanFormula from '@/components/home-loan/HomeLoanFormula';
import HomeLoanReportDownload from '@/components/home-loan/HomeLoanReportDownload';
import type { AmortizationRow } from '@/lib/homeLoanCalculations';
import { generateSchedule, getDateString, getPayoffDate } from '@/lib/homeLoanCalculations';

// Lazy-load heavy components — no loading placeholder needed, SSR fallbacks handle it
const HomeLoanDonutChart = dynamic(() => import('@/components/home-loan/HomeLoanDonutChart'), {
  ssr: false,
});

const HomeLoanAmortization = dynamic(() => import('@/components/home-loan/HomeLoanAmortization'), {
  ssr: false,
});

type Props = {
  bankName?: string;
  defaultInterestRate?: number;
  ssrChartFallback?: ReactNode;
  ssrAmortizationFallback?: ReactNode;
  ssrBankContent?: ReactNode;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HomeLoanCalculatorClient({ bankName, defaultInterestRate = 8.5, ssrChartFallback, ssrAmortizationFallback, ssrBankContent }: Props = {}) {
  // Track whether client-side JS has loaded to swap SSR fallbacks with interactive components
  const [clientReady, setClientReady] = useState(false);
  // Core inputs
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(defaultInterestRate);
  const [loanTenure, setLoanTenure] = useState(20);

  // Start date — use stable initial values to avoid hydration mismatch
  const [startMonth, setStartMonth] = useState(5); // June (0-indexed)
  const [startYear, setStartYear] = useState(2026);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      const now = new Date();
      const nextMonth = (now.getMonth() + 1) % 12;
      setStartMonth(nextMonth);
      setStartYear(nextMonth === 0 ? now.getFullYear() + 1 : now.getFullYear());
      setMounted(true);
    }
    // Mark client as ready to replace SSR fallbacks with interactive components
    setClientReady(true);
  }, [mounted]);

  // Prepayment config
  const [prepayConfig, setPrepayConfig] = useState<PrepaymentConfig>({
    enabled: false,
    amount: 500000,
    type: 'tenure-cut',
    startMonth: 13,
    frequency: 'one-time',
  });

  // Core calculations
  const monthlyRate = interestRate / 12 / 100;
  const tenureMonths = loanTenure * 12;

  const monthlyEMI = useMemo(() => {
    if (loanAmount <= 0 || monthlyRate <= 0 || tenureMonths <= 0) return 0;
    return Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  }, [loanAmount, monthlyRate, tenureMonths]);

  // Normal schedule (no prepayment)
  const normalResult = useMemo(() => {
    if (monthlyEMI <= 0) return { schedule: [], totalInterest: 0, actualMonths: 0, newEMI: 0 };
    return generateSchedule(loanAmount, monthlyRate, monthlyEMI, tenureMonths, startMonth, startYear, null);
  }, [loanAmount, monthlyRate, monthlyEMI, tenureMonths, startMonth, startYear]);

  // Prepayment schedule
  const prepayResult = useMemo(() => {
    if (!prepayConfig.enabled || monthlyEMI <= 0) return normalResult;
    return generateSchedule(loanAmount, monthlyRate, monthlyEMI, tenureMonths * 2, startMonth, startYear, prepayConfig);
  }, [loanAmount, monthlyRate, monthlyEMI, tenureMonths, startMonth, startYear, prepayConfig, normalResult]);

  const totalInterest = normalResult.totalInterest;
  const totalAmount = loanAmount + totalInterest;
  const payoffDate = getPayoffDate(startMonth, startYear, normalResult.actualMonths);

  const prepayTotalInterest = prepayResult.totalInterest;
  const prepayTotalAmount = loanAmount + prepayTotalInterest;
  const prepayPayoffDate = getPayoffDate(startMonth, startYear, prepayResult.actualMonths);

  // Active schedule for amortization table
  const activeSchedule = prepayConfig.enabled ? prepayResult.schedule : normalResult.schedule;

  const title = bankName ? `${bankName} Home Loan Calculator` : 'Home Loan Calculator';

  // Start date handler
  const handleStartMonth = useCallback((m: number) => {
    setStartMonth(m);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">{title}</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Title / Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-orange-200 flex-shrink-0">🏠</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">{title} (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">
              Calculate your {bankName ? `${bankName} ` : ''}home loan EMI with amortization schedule, prepayment analysis, and complete repayment timeline.
            </p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-orange-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" /></span>
          ₹25L @ {interestRate}% for {loanTenure} yrs → EMI {formatCurrency(monthlyEMI)}
        </div>
      </div>

      {/* Main Calculator Area */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-6">
              <div>
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Loan Details</h2>
                <div className="space-y-5 md:space-y-6">
                  <SIPSlider label="Loan Amount" value={loanAmount} min={500000} max={50000000} step={100000} prefix="₹" color="blue" onChange={setLoanAmount} formatDisplay={(v) => formatLakh(v)} />
                  <SIPSlider label="Interest Rate (p.a.)" value={interestRate} min={6} max={15} step={0.05} suffix="%" color="amber" onChange={setInterestRate} formatDisplay={(v) => `${v}%`} />
                  <SIPSlider label="Loan Tenure" value={loanTenure} min={5} max={30} step={1} suffix=" yrs" color="emerald" onChange={setLoanTenure} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
                </div>
              </div>

              {/* Start Date Picker */}
              <div className="border-t border-gray-100 pt-4">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">EMI Start Date</span>
                <div className="flex gap-2">
                  <select
                    value={startMonth}
                    onChange={(e) => handleStartMonth(Number(e.target.value))}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
                    ))}
                  </select>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    {Array.from({ length: 5 }, (_, i) => startYear + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prepayment Config */}
              <div className="border-t border-gray-100 pt-4">
                <HomeLoanPrepayment
                  config={prepayConfig}
                  onChange={setPrepayConfig}
                  maxTenureMonths={tenureMonths}
                  originalInterest={totalInterest}
                  originalTenureMonths={normalResult.actualMonths}
                  prepayInterest={prepayTotalInterest}
                  prepayTenureMonths={prepayResult.actualMonths}
                  originalEMI={monthlyEMI}
                  prepayEMI={prepayResult.newEMI}
                />
              </div>

              {/* Quick Info — desktop only */}
              <div className="hidden lg:block border-t border-gray-100 pt-5">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">📋 Quick Info</h4>
                <ul className="space-y-2.5">
                  {[
                    { icon: '🏦', color: 'text-blue-500', text: 'Compare rates across banks' },
                    { icon: '💡', color: 'text-amber-500', text: 'Prepay early to save lakhs' },
                    { icon: '🛡️', color: 'text-emerald-500', text: 'Tax benefit up to ₹3.5L/yr' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                      <span className={`${item.color} flex-shrink-0 text-sm mt-0.5`}>{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">

            {/* Result Cards */}
            <HomeLoanResultCards
              monthlyEMI={monthlyEMI}
              totalInterest={totalInterest}
              totalAmount={totalAmount}
              loanAmount={loanAmount}
              payoffDate={payoffDate}
              prepaymentActive={prepayConfig.enabled}
              prepayEMI={prepayResult.newEMI}
              prepayTotalInterest={prepayTotalInterest}
              prepayTotalAmount={prepayTotalAmount}
              prepayPayoffDate={prepayPayoffDate}
              prepayTenureMonths={prepayResult.actualMonths}
              originalTenureMonths={normalResult.actualMonths}
            />

            {/* Donut Chart — show SSR fallback until client loads */}
            {clientReady ? (
              <HomeLoanDonutChart
                loanAmount={loanAmount}
                totalInterest={totalInterest}
                prepaymentActive={prepayConfig.enabled}
                prepayTotalInterest={prepayTotalInterest}
              />
            ) : (
              ssrChartFallback || (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-[280px] flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Loading chart...</div>
                </div>
              )
            )}

            {/* Download Buttons */}
            <HomeLoanReportDownload
              schedule={activeSchedule}
              loanAmount={loanAmount}
              interestRate={interestRate}
              loanTenure={loanTenure}
              monthlyEMI={monthlyEMI}
              totalInterest={prepayConfig.enabled ? prepayTotalInterest : totalInterest}
              totalAmount={prepayConfig.enabled ? prepayTotalAmount : totalAmount}
              prepaymentActive={prepayConfig.enabled}
            />

            {/* Amortization Schedule — show SSR fallback until client loads */}
            {clientReady ? (
              <HomeLoanAmortization
                schedule={activeSchedule}
                loanTenure={loanTenure}
                prepaymentActive={prepayConfig.enabled}
              />
            ) : (
              ssrAmortizationFallback || (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center justify-center min-h-[80px]">
                  <div className="text-gray-400 text-sm">Loading schedule...</div>
                </div>
              )
            )}

            {/* Bank-wise Links (only on generic page) */}
            {!bankName && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-4 md:px-5 pt-4 pb-2"><h3 className="text-sm font-bold text-gray-900">Bank-wise Home Loan Calculators</h3></div>
                <div className="grid grid-cols-2 gap-x-4 px-4 md:px-5 pb-4">
                  {homeLoanBanks.map((bank) => (
                    <Link key={bank.slug} href={`/calculator/${bank.slug}-home-loan-calculator`} className="block py-2.5 text-xs text-gray-600 hover:text-emerald-600 border-b border-gray-50 font-medium transition-colors">{bank.name}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* Formula Section — receives live slider values, must stay in client */}
            <HomeLoanFormula
              loanAmount={loanAmount}
              interestRate={interestRate}
              loanTenure={loanTenure}
              monthlyEMI={monthlyEMI}
            />

            {/* Quick Info (mobile only) */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">📋 Quick Info</h4>
              <ul className="space-y-3">
                {[
                  { icon: '🏦', color: 'text-blue-500', text: 'Compare rates across banks for best deal' },
                  { icon: '💡', color: 'text-amber-500', text: 'Prepay early to save lakhs in interest' },
                  { icon: '🛡️', color: 'text-emerald-500', text: 'Tax benefit up to ₹3.5L/yr (80C + 24b)' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className={`${item.color} flex-shrink-0 text-base mt-0.5`}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bank-specific SEO Content */}
            {ssrBankContent}

            {/* Disclaimer */}
            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">EMI calculations assume a fixed interest rate throughout the tenure. Actual EMI may vary based on floating rate changes, processing fees, and lender terms. This tool is for educational purposes only.</p></div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
