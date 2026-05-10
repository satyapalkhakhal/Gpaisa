'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function HRACalculatorClient() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(15000);
  const [isMetro, setIsMetro] = useState(true);

  const [exemptedHRA, setExemptedHRA] = useState(0);
  const [taxableHRA, setTaxableHRA] = useState(0);
  const [annualSaving, setAnnualSaving] = useState(0);

  useEffect(() => {
    const annualBasicDA = (basicSalary + da) * 12;
    const annualHRA = hraReceived * 12;
    const annualRent = rentPaid * 12;

    const option1 = annualHRA;
    const option2 = annualRent - 0.1 * annualBasicDA;
    const option3 = isMetro ? 0.5 * annualBasicDA : 0.4 * annualBasicDA;

    const exempted = Math.max(0, Math.min(option1, option2, option3));
    const taxable = annualHRA - exempted;

    setExemptedHRA(exempted);
    setTaxableHRA(taxable);
    setAnnualSaving(Math.round(exempted * 0.3));
  }, [basicSalary, da, hraReceived, rentPaid, isMetro]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">HRA Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-sky-200 flex-shrink-0">🏡</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">HRA Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your HRA exemption and save tax on rental expenses under Section 10(13A).</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-sky-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" /></span>
          Exemption under Section 10(13A) — Old Tax Regime
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Salary & Rent Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Basic Salary (Monthly)" value={basicSalary} min={10000} max={300000} step={5000} prefix="₹" color="blue" onChange={setBasicSalary} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Dearness Allowance" value={da} min={0} max={100000} step={1000} prefix="₹" color="emerald" onChange={setDa} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="HRA Received (Monthly)" value={hraReceived} min={0} max={150000} step={1000} prefix="₹" color="amber" onChange={setHraReceived} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Rent Paid (Monthly)" value={rentPaid} min={0} max={200000} step={1000} prefix="₹" color="blue" onChange={setRentPaid} formatDisplay={(v) => formatCurrency(v)} />
              </div>

              <div className="mt-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">City Type</span>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  <button onClick={() => setIsMetro(true)} className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${isMetro ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>Metro (50%)</button>
                  <button onClick={() => setIsMetro(false)} className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${!isMetro ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>Non-Metro (40%)</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Annual HRA Received</span><span className="text-sm font-bold text-gray-800">{formatCurrency(hraReceived * 12)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">HRA Exempted</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(exemptedHRA))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Taxable HRA</span><span className="text-sm font-bold text-orange-600">{formatCurrency(Math.round(taxableHRA))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Est. Tax Saved (30% slab)</span><span className="text-lg font-extrabold text-emerald-600">{formatCurrency(annualSaving)}</span></div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 pt-4 pb-2"><h3 className="text-sm font-bold text-gray-900">HRA Exemption Calculation</h3><p className="text-xs text-gray-500 mt-0.5">Least of the following is exempt</p></div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-xs text-gray-500">1. Actual HRA received</span><span className="text-xs font-bold text-gray-800">{formatCurrency(hraReceived * 12)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-xs text-gray-500">2. Rent - 10% of (Basic+DA)</span><span className="text-xs font-bold text-gray-800">{formatCurrency(Math.round(rentPaid * 12 - 0.1 * (basicSalary + da) * 12))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-xs text-gray-500">3. {isMetro ? '50%' : '40%'} of (Basic+DA)</span><span className="text-xs font-bold text-gray-800">{formatCurrency(Math.round((isMetro ? 0.5 : 0.4) * (basicSalary + da) * 12))}</span></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Note</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">HRA exemption is available only under the Old Tax Regime. Under New Tax Regime, HRA is fully taxable. Consult a tax advisor for personalized advice.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">About HRA Exemption</h3>
                <p className="text-sm text-gray-600 leading-relaxed">House Rent Allowance (HRA) is a component of salary paid to employees for rental accommodation. Under Section 10(13A) of the Income Tax Act, a portion of HRA can be exempted from tax. Metro cities (Delhi, Mumbai, Kolkata, Chennai) get 50% of basic salary as the cap, while non-metro cities get 40%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
