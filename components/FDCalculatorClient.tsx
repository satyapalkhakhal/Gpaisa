'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

interface FDCalculatorClientProps {
  initialPrincipal?: number;
  initialInterest?: number;
  initialMaturity?: number;
}

export default function FDCalculatorClient({
  initialPrincipal = 100000,
  initialInterest = 41478,
  initialMaturity = 141478,
}: FDCalculatorClientProps) {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [tenure, setTenure] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'quarterly' | 'monthly' | 'yearly'>('quarterly');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [calculateTDS, setCalculateTDS] = useState(false);
  const [hasPAN, setHasPAN] = useState(true);

  const [maturityAmount, setMaturityAmount] = useState(initialMaturity);
  const [totalInterest, setTotalInterest] = useState(initialInterest);
  const [tdsDeducted, setTdsDeducted] = useState(0);

  useEffect(() => {
    const effectiveRate = interestRate + (isSeniorCitizen ? 0.5 : 0);
    let n = 4;
    if (compoundingFrequency === 'monthly') n = 12;
    if (compoundingFrequency === 'yearly') n = 1;
    const r = effectiveRate / 100;
    const amount = principal * Math.pow(1 + r / n, n * tenure);
    const interest = amount - principal;
    setMaturityAmount(amount);
    setTotalInterest(interest);

    // TDS calculation
    const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
    const annualInterest = interest / tenure;
    if (calculateTDS && annualInterest > tdsThreshold) {
      const tdsRate = hasPAN ? 0.10 : 0.20;
      const tds = interest * tdsRate;
      setTdsDeducted(tds);
    } else {
      setTdsDeducted(0);
    }
  }, [principal, interestRate, tenure, compoundingFrequency, isSeniorCitizen, calculateTDS, hasPAN]);

  const effectiveRate = interestRate + (isSeniorCitizen ? 0.5 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link>
              </li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-900 font-semibold">FD Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-200 flex-shrink-0">🏦</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">FD Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate Fixed Deposit maturity, TDS, and compare bank rates instantly.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-blue-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>
          ₹1L @ 7% for 5 yrs → ₹1,41,478
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* Inputs */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">FD Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Deposit Amount" value={principal} min={10000} max={10000000} step={10000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={(v) => formatLakh(v)} />
                <SIPSlider label={`Interest Rate (% p.a.)${isSeniorCitizen ? ' → Effective: ' + effectiveRate.toFixed(2) + '%' : ''}`} value={interestRate} min={3} max={12} step={0.1} suffix="%" color="emerald" onChange={setInterestRate} formatDisplay={(v) => `${v}% p.a.`} />
                <SIPSlider label="Tenure" value={tenure} min={1} max={10} step={1} suffix=" yrs" color="amber" onChange={setTenure} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>

              {/* Compounding */}
              <div className="mt-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Compounding</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {(['monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                    <button key={freq} onClick={() => setCompoundingFrequency(freq)} className={`sip-touch-target flex-1 px-2.5 py-2 rounded-md text-xs font-bold transition-all capitalize ${compoundingFrequency === freq ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>{freq}</button>
                  ))}
                </div>
              </div>

              {/* Senior Citizen Toggle */}
              <label className="flex items-start gap-3 mt-5 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only peer" checked={isSeniorCitizen} onChange={(e) => setIsSeniorCitizen(e.target.checked)} />
                  <div className="w-10 h-6 bg-gray-200 peer-checked:bg-blue-500 rounded-full transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-700">I am a Senior Citizen (60+)</p>
                  {isSeniorCitizen && <p className="text-xs text-blue-600 mt-0.5">+0.50% senior citizen bonus applied</p>}
                </div>
              </label>

              {/* TDS Toggle */}
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only peer" checked={calculateTDS} onChange={(e) => setCalculateTDS(e.target.checked)} />
                  <div className="w-10 h-6 bg-gray-200 peer-checked:bg-amber-500 rounded-full transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-700">Calculate after TDS deduction</p>
                  <p className="text-xs text-gray-400">TDS applies if annual interest &gt; ₹{isSeniorCitizen ? '50,000' : '40,000'}</p>
                </div>
              </label>

              {calculateTDS && (
                <div className="mt-3 ml-13 pl-13">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={hasPAN} onChange={(e) => setHasPAN(e.target.checked)} className="rounded" />
                    PAN submitted (10% TDS) — uncheck for 20% TDS
                  </label>
                </div>
              )}

              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Quick Rates</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex justify-between"><span>Post Office (5 yr)</span><span className="font-semibold text-blue-600">7.50%</span></li>
                  <li className="flex justify-between"><span>HDFC / ICICI (3 yr)</span><span className="font-semibold">7.25%</span></li>
                  <li className="flex justify-between"><span>SBI (5 yr)</span><span className="font-semibold">6.50%</span></li>
                  <li className="flex justify-between"><span>Senior citizen bonus</span><span className="font-semibold text-emerald-600">+0.50%</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">Invested Amount</span>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(principal)}</span>
                </div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                  <span className="text-sm text-gray-500">Est. Interest Earned</span>
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(totalInterest))}</span>
                </div>
                {calculateTDS && tdsDeducted > 0 && (
                  <>
                    <div className="flex items-center justify-between px-4 md:px-5 py-3.5 bg-amber-50/50">
                      <span className="text-sm text-gray-500">TDS Deducted ({hasPAN ? '10%' : '20%'})</span>
                      <span className="text-sm font-bold text-amber-600">− {formatCurrency(Math.round(tdsDeducted))}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-3.5">
                      <span className="text-sm text-gray-500">Net Interest (after TDS)</span>
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(Math.round(totalInterest - tdsDeducted))}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50">
                  <span className="text-base font-semibold text-gray-900">Maturity Value</span>
                  <span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(maturityAmount))}</span>
                </div>
              </div>
            </div>

            {/* Formula card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2"><h3 className="text-base md:text-lg font-bold text-gray-900">FD Formula</h3><p className="text-xs text-gray-500 mt-0.5">The math behind your returns</p></div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><code className="text-base md:text-lg text-gray-800 font-mono font-semibold">A = P × (1 + r/n)<sup>n×t</sup></code></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
                  {[{ var: 'P', desc: 'Principal', color: 'bg-blue-50 text-blue-700 border-blue-200' }, { var: 'r', desc: 'Annual rate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, { var: 'n', desc: 'Compounds/yr', color: 'bg-amber-50 text-amber-700 border-amber-200' }, { var: 't', desc: 'Years', color: 'bg-purple-50 text-purple-700 border-purple-200' }].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}><div className="text-lg font-bold font-mono">{item.var}</div><div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">FD calculations are based on inputs provided. Actual returns may vary based on bank policies, premature withdrawal penalties, and TDS deductions. Verify rates on respective bank websites before investing.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
