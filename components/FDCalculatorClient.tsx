'use client';

import { useState, useEffect, useMemo } from 'react';
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

export default function FDCalculatorClient() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [tenure, setTenure] = useState(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<'quarterly' | 'monthly' | 'yearly'>('quarterly');
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    let n = 4;
    if (compoundingFrequency === 'monthly') n = 12;
    if (compoundingFrequency === 'yearly') n = 1;
    const r = interestRate / 100;
    const amount = principal * Math.pow(1 + r / n, n * tenure);
    setMaturityAmount(amount);
    setTotalInterest(amount - principal);
  }, [principal, interestRate, tenure, compoundingFrequency]);

  const exampleMaturity = useMemo(() => formatCurrency(Math.round(100000 * Math.pow(1 + 0.07 / 4, 4 * 5))), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link>
              </li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-900 font-semibold">FD Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-200 flex-shrink-0">🏦</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">FD Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate Fixed Deposit maturity amount and interest earned with accurate compounding.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-blue-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" /></span>
          ₹1L @ 7% for 5 yrs → {exampleMaturity}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">FD Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Deposit Amount" value={principal} min={10000} max={10000000} step={10000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={(v) => formatLakh(v)} />
                <SIPSlider label="Interest Rate (% p.a.)" value={interestRate} min={3} max={12} step={0.1} suffix="%" color="emerald" onChange={setInterestRate} formatDisplay={(v) => `${v}% p.a.`} />
                <SIPSlider label="Tenure" value={tenure} min={1} max={10} step={1} suffix=" yrs" color="amber" onChange={setTenure} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>
              <div className="mt-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Compounding</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {(['monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                    <button key={freq} onClick={() => setCompoundingFrequency(freq)} className={`sip-touch-target flex-1 px-2.5 py-2 rounded-md text-xs font-bold transition-all capitalize ${compoundingFrequency === freq ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>{freq}</button>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 FD Interest Rates</h4>
                <ul className="space-y-2.5">
                  {[{ icon: '🏦', color: 'text-blue-500', text: 'SBI: 6.5% - 7.5%' }, { icon: '💳', color: 'text-orange-500', text: 'HDFC: 7.0% - 7.75%' }, { icon: '🔒', color: 'text-emerald-500', text: 'Senior Citizens: +0.5% extra' }].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed"><span className={`${item.color} flex-shrink-0 text-sm mt-0.5`}>{item.icon}</span>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Invested Amount</span><span className="text-sm font-bold text-gray-800">{formatCurrency(principal)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Est. Interest</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(totalInterest))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Maturity Value</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(maturityAmount))}</span></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">FD calculations are based on the inputs provided. Actual returns may vary based on bank policies, premature withdrawal penalties, and TDS deductions.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3"><h3 className="text-base md:text-lg font-bold text-gray-900">FD Formula</h3><p className="text-xs text-gray-500 mt-0.5">The math behind your returns</p></div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100"><code className="text-base md:text-lg text-gray-800 font-mono font-semibold">A = P × (1 + r/n)<sup>n×t</sup></code></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
                  {[{ var: 'P', desc: 'Principal', color: 'bg-blue-50 text-blue-700 border-blue-200' }, { var: 'r', desc: 'Annual rate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, { var: 'n', desc: 'Compounds/yr', color: 'bg-amber-50 text-amber-700 border-amber-200' }, { var: 't', desc: 'Years', color: 'bg-purple-50 text-purple-700 border-purple-200' }].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}><div className="text-lg font-bold font-mono">{item.var}</div><div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About FD Calculator</h3>
                <div className="prose max-w-none text-sm text-gray-600 leading-relaxed">
                  <p className="mb-3">A Fixed Deposit (FD) is a safe investment option offered by banks where you deposit a lump sum for a fixed tenure at a predetermined interest rate.</p>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Benefits of Fixed Deposits:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs"><li>Guaranteed returns with no market risk</li><li>Higher interest rates for senior citizens</li><li>Flexible tenure from 7 days to 10 years</li><li>Loan facility against FD</li><li>Tax-saving FDs available under Section 80C</li></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
