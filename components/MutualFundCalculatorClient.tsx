'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function MutualFundCalculatorClient() {
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (investmentType === 'sip') {
      const monthlyRate = expectedReturn / 12 / 100;
      const months = timePeriod * 12;
      const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = amount * months;
      setInvestedAmount(invested);
      setEstimatedReturns(futureValue - invested);
      setTotalValue(futureValue);
    } else {
      const futureValue = amount * Math.pow(1 + expectedReturn / 100, timePeriod);
      setInvestedAmount(amount);
      setEstimatedReturns(futureValue - amount);
      setTotalValue(futureValue);
    }
  }, [investmentType, amount, expectedReturn, timePeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Mutual Fund Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">📊</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Mutual Fund Calculator (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate mutual fund returns for SIP and lumpsum investments with accurate projections.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Investment Details</h2>

              {/* Investment Type Toggle */}
              <div className="mb-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Investment Type</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  <button onClick={() => { setInvestmentType('sip'); setAmount(10000); }} className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${investmentType === 'sip' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>SIP (Monthly)</button>
                  <button onClick={() => { setInvestmentType('lumpsum'); setAmount(100000); }} className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${investmentType === 'lumpsum' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>Lumpsum</button>
                </div>
              </div>

              <div className="space-y-5 md:space-y-6">
                <SIPSlider label={investmentType === 'sip' ? 'Monthly Investment' : 'Lumpsum Amount'} value={amount} min={investmentType === 'sip' ? 500 : 10000} max={investmentType === 'sip' ? 100000 : 10000000} step={investmentType === 'sip' ? 500 : 10000} prefix="₹" color="blue" onChange={setAmount} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Expected Return (p.a.)" value={expectedReturn} min={1} max={30} step={0.5} suffix="%" color="emerald" onChange={setExpectedReturn} formatDisplay={(v) => `${v}%`} />
                <SIPSlider label="Time Period" value={timePeriod} min={1} max={40} step={1} suffix=" yrs" color="amber" onChange={setTimePeriod} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>

              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Mutual Fund Returns</h4>
                <ul className="space-y-2.5">
                  {[{ icon: '📈', color: 'text-emerald-500', text: 'Equity Funds: 12-15% p.a.' }, { icon: '📊', color: 'text-blue-500', text: 'Debt Funds: 7-9% p.a.' }, { icon: '⚖️', color: 'text-amber-500', text: 'Hybrid Funds: 10-12% p.a.' }].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed"><span className={`${item.color} flex-shrink-0 text-sm mt-0.5`}>{item.icon}</span>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Invested Amount</span><span className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(investedAmount))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Est. Returns</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(estimatedReturns))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Value</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(totalValue))}</span></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">Mutual fund investments are subject to market risks. Past performance does not guarantee future returns. This calculator provides estimates only.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About Mutual Fund Calculator</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Mutual funds pool money from multiple investors to invest in stocks, bonds, or other securities. Our calculator helps you estimate returns for both SIP and lumpsum investments.</p>
                <h4 className="text-sm font-bold text-gray-900 mb-2">SIP vs Lumpsum:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600"><li><strong>SIP:</strong> Regular monthly investments, rupee cost averaging</li><li><strong>Lumpsum:</strong> One-time investment, suitable for large amounts</li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
