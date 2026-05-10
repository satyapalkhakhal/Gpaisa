'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function NPSCalculatorClient() {
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [expectedReturn, setExpectedReturn] = useState(10);

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [wealthGained, setWealthGained] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);
  const [annuityAmount, setAnnuityAmount] = useState(0);
  const [lumpsum, setLumpsum] = useState(0);

  useEffect(() => {
    const years = retirementAge - currentAge;
    const months = years * 12;
    const monthlyRate = expectedReturn / 12 / 100;
    const fv = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const invested = monthlyContribution * months;
    setTotalInvestment(invested);
    setWealthGained(fv - invested);
    setMaturityValue(fv);
    setAnnuityAmount(fv * 0.6);
    setLumpsum(fv * 0.4);
  }, [monthlyContribution, currentAge, retirementAge, expectedReturn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">NPS Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-indigo-200 flex-shrink-0">💼</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">NPS Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your National Pension System returns, retirement corpus, and pension estimates.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-indigo-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" /></span>
          Tax deduction up to ₹2 lakh under 80CCD
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">NPS Investment Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Monthly Contribution" value={monthlyContribution} min={500} max={50000} step={500} prefix="₹" color="blue" onChange={setMonthlyContribution} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Current Age" value={currentAge} min={18} max={60} step={1} suffix=" yrs" color="emerald" onChange={setCurrentAge} formatDisplay={(v) => `${v} years`} />
                <SIPSlider label="Retirement Age" value={retirementAge} min={60} max={70} step={1} suffix=" yrs" color="amber" onChange={setRetirementAge} formatDisplay={(v) => `${v} years`} />
                <SIPSlider label="Expected Return (p.a.)" value={expectedReturn} min={8} max={14} step={0.5} suffix="%" color="blue" onChange={setExpectedReturn} formatDisplay={(v) => `${v}%`} />
              </div>
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 NPS Benefits</h4>
                <ul className="space-y-2.5">
                  {[{ icon: '🛡️', color: 'text-indigo-500', text: 'Tax deduction up to ₹2 lakh under 80CCD' }, { icon: '💰', color: 'text-emerald-500', text: 'Low cost pension scheme' }, { icon: '📊', color: 'text-blue-500', text: 'Flexible investment options' }].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed"><span className={`${item.color} flex-shrink-0 text-sm mt-0.5`}>{item.icon}</span>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Investment</span><span className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(totalInvestment))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Wealth Gained</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(wealthGained))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Maturity Value</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(maturityValue))}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 pt-4 pb-2"><h3 className="text-sm font-bold text-gray-900">Withdrawal Options at Maturity</h3></div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-sm text-gray-500">Annuity (60% - Mandatory)</span><span className="text-sm font-bold text-blue-600">{formatCurrency(Math.round(annuityAmount))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-sm text-gray-500">Lumpsum (40% - Tax-free)</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(lumpsum))}</span></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">NPS returns are market-linked and not guaranteed. Actual returns may vary. This calculator provides estimates for planning purposes only.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About NPS</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">National Pension System (NPS) is a government-sponsored pension scheme that helps you build a retirement corpus with tax benefits and market-linked returns.</p>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Key Features:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600"><li>Tax deduction up to ₹1.5 lakh under Section 80C</li><li>Additional ₹50,000 deduction under Section 80CCD(1B)</li><li>Low fund management charges (0.01% to 0.25%)</li><li>Portable across jobs and locations</li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
