'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

export type YearRow = {
  year: number;
  openingBalance: number;
  withdrawal: number;
  returns: number;
  closingBalance: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

type Props = {
  initialTotalWithdrawal?: number;
  initialFinalCorpus?: number;
  initialTotalMonths?: number;
  initialYearlyData?: YearRow[];
};

export default function SWPCalculatorClient({
  initialTotalWithdrawal = 0,
  initialFinalCorpus = 0,
  initialTotalMonths = 0,
  initialYearlyData = [],
}: Props = {}) {
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(20);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  // Pre-initialised with server-computed defaults — no ₹0 flash on first render
  const [totalWithdrawal, setTotalWithdrawal] = useState(initialTotalWithdrawal);
  const [finalCorpus, setFinalCorpus] = useState(initialFinalCorpus);
  const [totalMonths, setTotalMonths] = useState(initialTotalMonths);
  const [yearlyData, setYearlyData] = useState<YearRow[]>(initialYearlyData);

  useEffect(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    let balance = initialInvestment;
    const data = [];
    let totalWithdrawn = 0;
    let monthsLasted = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const openingBalance = balance;
      let yearlyWithdrawal = 0;
      let yearlyReturns = 0;
      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;
        const withdrawal = Math.min(monthlyWithdrawal, balance);
        balance -= withdrawal;
        yearlyWithdrawal += withdrawal;
        totalWithdrawn += withdrawal;
        monthsLasted++;
        if (balance <= 0) break;
        const monthlyReturn = balance * monthlyRate;
        balance += monthlyReturn;
        yearlyReturns += monthlyReturn;
      }
      data.push({ year, openingBalance, withdrawal: yearlyWithdrawal, returns: yearlyReturns, closingBalance: Math.max(0, balance) });
      if (balance <= 0) break;
    }
    setYearlyData(data);
    setTotalWithdrawal(totalWithdrawn);
    setFinalCorpus(Math.max(0, balance));
    setTotalMonths(monthsLasted);
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">SWP Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-green-200 flex-shrink-0">💸</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">SWP Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Plan systematic withdrawals from your mutual fund investments while keeping your corpus growing.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          Tax-efficient regular income from investments
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">SWP Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Initial Investment" value={initialInvestment} min={100000} max={10000000} step={100000} prefix="₹" color="blue" onChange={setInitialInvestment} formatDisplay={(v) => formatLakh(v)} />
                <SIPSlider label="Monthly Withdrawal" value={monthlyWithdrawal} min={5000} max={200000} step={5000} prefix="₹" color="emerald" onChange={setMonthlyWithdrawal} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Expected Return (p.a.)" value={expectedReturn} min={1} max={20} step={0.5} suffix="%" color="amber" onChange={setExpectedReturn} formatDisplay={(v) => `${v}%`} />
                <SIPSlider label="Time Period" value={timePeriod} min={1} max={40} step={1} suffix=" yrs" color="blue" onChange={setTimePeriod} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2.5">
                  {[{ icon: '✓', color: 'text-emerald-500', text: 'Withdraw only returns, keep capital intact' }, { icon: '✓', color: 'text-emerald-500', text: 'Consider inflation while planning' }, { icon: '✓', color: 'text-emerald-500', text: 'Tax-efficient compared to FD interest' }].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed"><span className={`${item.color} flex-shrink-0 text-sm mt-0.5 font-bold`}>{item.icon}</span>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Initial Investment</span><span className="text-sm font-bold text-gray-800">{formatCurrency(initialInvestment)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Withdrawal</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(totalWithdrawal))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Duration</span><span className="text-sm font-bold text-gray-800">{Math.floor(totalMonths / 12)} yrs {totalMonths % 12} mo</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Final Corpus</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(finalCorpus))}</span></div>
              </div>
            </div>

            {/* Year-wise Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <button onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)} className="w-full flex justify-between items-center px-4 md:px-5 py-4 text-left">
                <h3 className="text-sm font-bold text-gray-900">Year-wise Breakdown</h3>
                <span className="text-lg text-gray-400">{showYearlyBreakdown ? '−' : '+'}</span>
              </button>
              {showYearlyBreakdown && (
                <div className="px-4 md:px-5 pb-4 max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr><th className="px-2 py-2 text-left font-semibold text-gray-600">Year</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Opening</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Withdrawn</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Closing</th></tr>
                    </thead>
                    <tbody>{yearlyData.map((d) => (
                      <tr key={d.year} className="border-b border-gray-50"><td className="px-2 py-2 font-medium">{d.year}</td><td className="px-2 py-2 text-right text-gray-600">{formatCurrency(Math.round(d.openingBalance))}</td><td className="px-2 py-2 text-right text-emerald-600">{formatCurrency(Math.round(d.withdrawal))}</td><td className="px-2 py-2 text-right font-bold">{formatCurrency(Math.round(d.closingBalance))}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">SWP returns are market-linked. Actual returns may vary. If withdrawal exceeds returns, your corpus will deplete faster.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">What is SWP?</h3>
                <p className="text-sm text-gray-600 leading-relaxed"><strong>Systematic Withdrawal Plan (SWP)</strong> allows you to withdraw a fixed amount regularly from your mutual fund investment. It&apos;s ideal for retirees needing regular income while keeping the remaining corpus invested.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
