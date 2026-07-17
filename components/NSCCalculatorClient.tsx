'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';
import { calculateNSC, NSC_RATE, NSC_MIN_INVESTMENT, NSC_TENURE_YEARS, type NSCResult } from '@/lib/smallSavingsCalculations';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface NSCCalculatorClientProps {
  initialPrincipal?: number;
  initialResult?: NSCResult;
}

export default function NSCCalculatorClient({ initialPrincipal = 100000, initialResult }: NSCCalculatorClientProps) {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [result, setResult] = useState<NSCResult | undefined>(initialResult);

  useEffect(() => {
    setResult(calculateNSC(principal));
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
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">NSC Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-teal-200 flex-shrink-0">📜</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">NSC Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate National Savings Certificate maturity value at {NSC_RATE}% p.a.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Investment Details</h2>
              <SIPSlider label="Investment Amount" value={principal} min={NSC_MIN_INVESTMENT} max={5000000} step={10000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={(v) => fmt(v)} />

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Key Rules</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>📅 Fixed {NSC_TENURE_YEARS}-year tenure, no premature withdrawal (except on death or court order)</li>
                  <li>📈 Interest rate: {NSC_RATE}% p.a. (Q1 FY 2026-27), compounded annually, paid at maturity</li>
                  <li>💵 No maximum investment limit; minimum ₹1,000</li>
                  <li>✅ Principal + reinvested interest (except final year) qualifies for Section 80C, up to ₹1.5 lakh</li>
                  <li>⚠️ Interest is taxable each year as per your income slab (except the final year, taxed on withdrawal)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Investment Amount</span><span className="text-sm font-bold text-gray-800">{fmt(result.totalInvested)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Interest Earned ({NSC_TENURE_YEARS} years)</span><span className="text-sm font-bold text-emerald-600">{fmt(result.totalInterest)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Maturity Value</span><span className="text-lg font-extrabold text-gray-900">{fmt(result.maturityValue)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2"><h3 className="text-base md:text-lg font-bold text-gray-900">NSC Formula</h3><p className="text-xs text-gray-500 mt-0.5">Compounded annually, paid in full at maturity</p></div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><code className="text-base md:text-lg text-gray-800 font-mono font-semibold">A = P × (1 + r)<sup>t</sup></code></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Estimate Only</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">Based on the {NSC_RATE}% rate applicable for accounts opened in the current quarter — this rate is fixed for your certificate's full 5-year tenure regardless of later quarterly revisions. Verify at your nearest post office before investing.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
