'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';
import { calculateSCSS, SCSS_RATE, SCSS_MIN_INVESTMENT, SCSS_MAX_INVESTMENT, SCSS_TENURE_YEARS, type SCSSResult } from '@/lib/smallSavingsCalculations';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface SCSSCalculatorClientProps {
  initialPrincipal?: number;
  initialResult?: SCSSResult;
}

export default function SCSSCalculatorClient({ initialPrincipal = 1500000, initialResult }: SCSSCalculatorClientProps) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [result, setResult] = useState<SCSSResult | undefined>(initialResult);

  useEffect(() => {
    setResult(calculateSCSS(principal));
  }, [principal]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">SCSS Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-amber-200 flex-shrink-0">👴</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Senior Citizens Savings Scheme (SCSS) Calculator</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your SCSS quarterly payout and maturity value at {SCSS_RATE}% p.a.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Investment Details</h2>
              <SIPSlider label="Investment Amount" value={principal} min={SCSS_MIN_INVESTMENT} max={SCSS_MAX_INVESTMENT} step={50000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={(v) => fmt(v)} />

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Key Rules</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>👤 For individuals 60+ (55+ for retired defence personnel, 50+ for civilian VRS/superannuation)</li>
                  <li>📅 {SCSS_TENURE_YEARS}-year tenure, extendable once by 3 years</li>
                  <li>📈 Interest rate: {SCSS_RATE}% p.a. (Q1 FY 2026-27), paid quarterly, not compounded</li>
                  <li>💵 Maximum investment: ₹30,00,000 (raised from ₹15,00,000 in 2023)</li>
                  <li>✅ Principal qualifies for Section 80C; interest is fully taxable</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Investment Amount</span><span className="text-sm font-bold text-gray-800">{fmt(result.totalInvested)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5 bg-emerald-50/50"><span className="text-sm text-gray-600">Quarterly Payout</span><span className="text-sm font-bold text-emerald-600">{fmt(result.quarterlyPayout)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Annual Payout</span><span className="text-sm font-bold text-gray-800">{fmt(result.annualPayout)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Interest ({SCSS_TENURE_YEARS} years)</span><span className="text-sm font-bold text-emerald-600">{fmt(result.totalInterest)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Payout at Maturity</span><span className="text-lg font-extrabold text-gray-900">{fmt(result.maturityValue)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2"><h3 className="text-base md:text-lg font-bold text-gray-900">SCSS Formula</h3><p className="text-xs text-gray-500 mt-0.5">Simple interest, paid out every quarter — not reinvested</p></div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><code className="text-base md:text-lg text-gray-800 font-mono font-semibold">Quarterly Payout = P × r ÷ 4</code></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Estimate Only</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">The {SCSS_RATE}% rate applicable when you open the account is locked in for the full 5-year tenure, regardless of later quarterly revisions. This calculator assumes the quarterly payout is withdrawn, not reinvested. Verify at your nearest bank or post office before investing.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
