'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';
import {
  compareRegimes,
  type AgeCategory,
  type IncomeTaxComparison,
} from '@/lib/incomeTaxCalculations';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const AGE_LABELS: Record<AgeCategory, string> = {
  below60: 'Below 60',
  senior: '60–80 (Senior)',
  superSenior: 'Above 80 (Super Senior)',
};

interface IncomeTaxCalculatorClientProps {
  initialGrossIncome?: number;
  initialAgeCategory?: AgeCategory;
  initialComparison?: IncomeTaxComparison;
}

export default function IncomeTaxCalculatorClient({
  initialGrossIncome = 1200000,
  initialAgeCategory = 'below60',
  initialComparison,
}: IncomeTaxCalculatorClientProps) {
  const [grossIncome, setGrossIncome] = useState(initialGrossIncome);
  const [ageCategory, setAgeCategory] = useState<AgeCategory>(initialAgeCategory);
  const [section80C, setSection80C] = useState(150000);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);
  const [nps80CCD1B, setNps80CCD1B] = useState(0);
  const [hraExemption, setHraExemption] = useState(0);

  const [comparison, setComparison] = useState<IncomeTaxComparison | undefined>(initialComparison);

  useEffect(() => {
    setComparison(
      compareRegimes(grossIncome, ageCategory, {
        section80C,
        homeLoanInterest,
        nps80CCD1B,
        hraExemption,
      })
    );
  }, [grossIncome, ageCategory, section80C, homeLoanInterest, nps80CCD1B, hraExemption]);

  if (!comparison) return null;

  const { old, new: newRegime, betterRegime, savings } = comparison;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">Income Tax Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-indigo-200 flex-shrink-0">🧾</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">Income Tax Calculator — Old vs New Regime (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Compare your tax liability under both regimes for FY 2026-27 (AY 2027-28) and find out which one saves you more.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Income Details</h2>

              <SIPSlider label="Gross Annual Income" value={grossIncome} min={300000} max={5000000} step={50000} prefix="₹" color="blue" onChange={setGrossIncome} formatDisplay={(v) => fmt(v)} />

              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Age Category</span>
                <div className="grid grid-cols-1 gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {(Object.keys(AGE_LABELS) as AgeCategory[]).map((cat) => (
                    <button key={cat} onClick={() => setAgeCategory(cat)} className={`sip-touch-target px-3 py-2 rounded-md text-xs font-bold transition-all text-left ${ageCategory === cat ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500 active:bg-gray-100/80'}`}>
                      {AGE_LABELS[cat]}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Age affects the old regime exemption limit only — the new regime is the same for everyone.</p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-5">
                <h3 className="text-sm font-bold text-gray-900">Deductions <span className="text-xs font-normal text-gray-400">(old regime only)</span></h3>

                <SIPSlider label="Section 80C (PPF, ELSS, Insurance, EPF)" value={section80C} min={0} max={150000} step={5000} prefix="₹" color="emerald" onChange={setSection80C} formatDisplay={(v) => fmt(v)} />
                <SIPSlider label="Home Loan Interest (Sec 24b)" value={homeLoanInterest} min={0} max={200000} step={10000} prefix="₹" color="amber" onChange={setHomeLoanInterest} formatDisplay={(v) => fmt(v)} />
                <SIPSlider label="NPS Additional (Sec 80CCD(1B))" value={nps80CCD1B} min={0} max={50000} step={5000} prefix="₹" color="blue" onChange={setNps80CCD1B} formatDisplay={(v) => fmt(v)} />
                <div>
                  <SIPSlider label="HRA Exemption Claimed" value={hraExemption} min={0} max={300000} step={10000} prefix="₹" color="emerald" onChange={setHraExemption} formatDisplay={(v) => fmt(v)} />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Not sure? Use the{' '}
                    <Link href="/calculator/hra" className="text-primary-600 underline hover:text-primary-700">HRA Calculator</Link>
                    {' '}to work out the exact exempt amount.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* Winner banner */}
            <div className={`rounded-2xl p-5 md:p-6 text-white shadow-lg ${betterRegime === 'new' ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Recommended for you</p>
              <p className="text-2xl md:text-3xl font-extrabold mb-1">{betterRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}</p>
              <p className="text-sm opacity-90">Saves you {fmt(savings)}/year compared to the {betterRegime === 'new' ? 'old' : 'new'} regime.</p>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {[
                { key: 'old' as const, label: 'Old Regime', data: old, color: 'border-emerald-200' },
                { key: 'new' as const, label: 'New Regime', data: newRegime, color: 'border-indigo-200' },
              ].map(({ key, label, data, color }) => (
                <div key={key} className={`bg-white rounded-2xl shadow-lg border-2 ${betterRegime === key ? color : 'border-gray-100'} overflow-hidden`}>
                  <div className="px-4 md:px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{label}</span>
                    {betterRegime === key && <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">BETTER</span>}
                  </div>
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5"><span className="text-xs text-gray-500">Taxable Income</span><span className="text-xs font-bold text-gray-800">{fmt(data.taxableIncome)}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5"><span className="text-xs text-gray-500">Rebate (87A)</span><span className="text-xs font-bold text-emerald-600">− {fmt(data.rebate)}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5"><span className="text-xs text-gray-500">Surcharge + Cess</span><span className="text-xs font-bold text-gray-800">{fmt(data.surcharge + data.cess)}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-gray-50"><span className="text-sm font-semibold text-gray-900">Total Tax</span><span className="text-base font-extrabold text-gray-900">{fmt(data.totalTax)}</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5"><span className="text-xs text-gray-500">Effective Rate</span><span className="text-xs font-bold text-gray-700">{data.effectiveRate}%</span></div>
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5"><span className="text-xs text-gray-500">Net Take-Home</span><span className="text-xs font-bold text-emerald-700">{fmt(data.netTakeHome)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Estimate Only</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    This calculator does not apply surcharge marginal relief and assumes salaried income with no other exemptions beyond those listed. For incomes above ₹50 lakh or complex situations (capital gains, business income, multiple deductions), consult a chartered accountant before filing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
