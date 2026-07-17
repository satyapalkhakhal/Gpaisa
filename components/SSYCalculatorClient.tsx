'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';
import { calculateSSY, SSY_RATE, SSY_MIN_DEPOSIT, SSY_MAX_DEPOSIT, type SSYResult } from '@/lib/smallSavingsCalculations';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface SSYCalculatorClientProps {
  initialAnnualDeposit?: number;
  initialResult?: SSYResult;
}

export default function SSYCalculatorClient({ initialAnnualDeposit = 50000, initialResult }: SSYCalculatorClientProps) {
  const [annualDeposit, setAnnualDeposit] = useState(initialAnnualDeposit);
  const [result, setResult] = useState<SSYResult | undefined>(initialResult);

  useEffect(() => {
    setResult(calculateSSY(annualDeposit));
  }, [annualDeposit]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Sukanya Samriddhi Yojana Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-pink-200 flex-shrink-0">👧</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Sukanya Samriddhi Yojana (SSY) Calculator</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your SSY maturity value at {SSY_RATE}% p.a. — tax-free under Section 80C.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Deposit Details</h2>
              <SIPSlider label="Annual Deposit" value={annualDeposit} min={SSY_MIN_DEPOSIT} max={SSY_MAX_DEPOSIT} step={5000} prefix="₹" color="blue" onChange={setAnnualDeposit} formatDisplay={(v) => fmt(v)} />

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Key Rules</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>👧 Open for a girl child before she turns 10</li>
                  <li>💰 Deposit for 15 years, matures in 21 years</li>
                  <li>📈 Interest rate: {SSY_RATE}% p.a. (Q2 FY 2026-27), reviewed quarterly</li>
                  <li>🎓 Partial (50%) withdrawal allowed after age 18 for education</li>
                  <li>✅ Fully tax-free (EEE) — deposit, interest, and maturity</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Invested (15 years)</span><span className="text-sm font-bold text-gray-800">{fmt(result.totalInvested)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Interest Earned</span><span className="text-sm font-bold text-emerald-600">{fmt(result.totalInterest)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Maturity Value (Year 21)</span><span className="text-lg font-extrabold text-gray-900">{fmt(result.maturityValue)}</span></div>
              </div>
            </div>

            <details className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <summary className="px-4 md:px-6 py-4 cursor-pointer font-bold text-gray-900 text-sm md:text-base select-none">Year-wise Growth Table</summary>
              <div className="overflow-x-auto border-t border-gray-100">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-3 md:px-4 py-2.5 font-semibold text-gray-700">Year</th>
                      <th className="text-right px-3 md:px-4 py-2.5 font-semibold text-gray-700">Deposit</th>
                      <th className="text-right px-3 md:px-4 py-2.5 font-semibold text-gray-700">Interest</th>
                      <th className="text-right px-3 md:px-4 py-2.5 font-semibold text-gray-700">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyData.map((row, i) => (
                      <tr key={row.year} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-3 md:px-4 py-2 font-medium text-gray-800">{row.year}</td>
                        <td className="px-3 md:px-4 py-2 text-right text-gray-700">{fmt(row.deposit)}</td>
                        <td className="px-3 md:px-4 py-2 text-right text-emerald-600">{fmt(row.interest)}</td>
                        <td className="px-3 md:px-4 py-2 text-right font-semibold text-gray-900">{fmt(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Estimate Only</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">This assumes the current {SSY_RATE}% rate stays constant for all 21 years and that the same deposit is made every year for 15 years. The real SSY rate is reviewed every quarter by the Ministry of Finance and can change.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
