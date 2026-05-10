'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatLakh = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

export default function SimpleInterestCalculatorClient() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(3);
  const [simpleInterest, setSimpleInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const si = (principal * rate * time) / 100;
    setSimpleInterest(si);
    setTotalAmount(principal + si);
  }, [principal, rate, time]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Simple Interest Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-teal-200 flex-shrink-0">📐</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Simple Interest Calculator (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate simple interest on loans and deposits instantly.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-teal-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" /></span>
          SI = (P × R × T) / 100
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Loan/Deposit Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Principal Amount" value={principal} min={10000} max={1000000} step={10000} prefix="₹" color="blue" onChange={setPrincipal} formatDisplay={(v) => formatLakh(v)} />
                <SIPSlider label="Interest Rate (p.a.)" value={rate} min={1} max={20} step={0.5} suffix="%" color="emerald" onChange={setRate} formatDisplay={(v) => `${v}%`} />
                <SIPSlider label="Time Period" value={time} min={1} max={30} step={1} suffix=" yrs" color="amber" onChange={setTime} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">📐 Formula</h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100"><code className="text-sm text-gray-800 font-mono font-semibold">SI = (P × R × T) / 100</code></div>
                <p className="text-[11px] text-gray-400 mt-2">P = Principal, R = Rate, T = Time</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Principal Amount</span><span className="text-sm font-bold text-gray-800">{formatCurrency(principal)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Interest Earned</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(simpleInterest))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Amount</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(totalAmount))}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About Simple Interest</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">Simple Interest (SI) is calculated only on the principal amount. Unlike compound interest, it does not account for interest on interest.</p>
                <h4 className="text-sm font-bold text-gray-900 mb-2">When is SI Used?</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600"><li>Personal loans and car loans</li><li>Short-term deposits</li><li>Government bonds</li><li>Certificate of deposits (CDs)</li></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
