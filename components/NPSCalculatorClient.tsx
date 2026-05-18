'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// Compute NPS corpus (future value of monthly SIP with employer add-on)
function computeCorpus(monthly: number, employerMonthly: number, rate: number, months: number) {
  const r = rate / 12 / 100;
  const totalMonthly = monthly + employerMonthly;
  return totalMonthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

interface NPSProps {
  initialTotalInvestment?: number;
  initialWealthGained?: number;
  initialMaturityValue?: number;
  initialLumpsum?: number;
  initialAnnuity?: number;
  initialMonthlyPension?: number;
}

export default function NPSCalculatorClient({
  initialTotalInvestment = 1800000,
  initialWealthGained = 9536000,
  initialMaturityValue = 11336000,
  initialLumpsum = 9068800,
  initialAnnuity = 2267200,
  initialMonthlyPension = 11336,
}: NPSProps) {
  // Inputs
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [employerMonthly, setEmployerMonthly] = useState(0);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);
  const [subscriberType, setSubscriberType] = useState<'non-govt' | 'govt'>('non-govt');
  const [showStepUp, setShowStepUp] = useState(false);
  const [stepUpPct, setStepUpPct] = useState(5);

  // Outputs — seeded with SSR values
  const [totalInvestment, setTotalInvestment] = useState(initialTotalInvestment);
  const [wealthGained, setWealthGained] = useState(initialWealthGained);
  const [maturityValue, setMaturityValue] = useState(initialMaturityValue);
  const [annuityAmount, setAnnuityAmount] = useState(initialAnnuity);
  const [lumpsum, setLumpsum] = useState(initialLumpsum);
  const [monthlyPension, setMonthlyPension] = useState(initialMonthlyPension);
  const [stepUpCorpus, setStepUpCorpus] = useState(0);
  const [showTax, setShowTax] = useState(false);

  const lumpPct = subscriberType === 'non-govt' ? 0.80 : 0.60;
  const annuityPct = subscriberType === 'non-govt' ? 0.20 : 0.40;

  useEffect(() => {
    const years = retirementAge - currentAge;
    const months = years * 12;

    // Base corpus
    const fv = computeCorpus(monthlyContribution, employerMonthly, expectedReturn, months);
    const invested = (monthlyContribution + employerMonthly) * months;
    setTotalInvestment(invested);
    setWealthGained(fv - invested);
    setMaturityValue(fv);
    const ann = fv * annuityPct;
    const ls = fv * lumpPct;
    setAnnuityAmount(ann);
    setLumpsum(ls);
    setMonthlyPension((ann * annuityRate) / 100 / 12);

    // Step-up corpus
    if (showStepUp && stepUpPct > 0) {
      let corpus = 0;
      let contrib = monthlyContribution + employerMonthly;
      const r = expectedReturn / 12 / 100;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          corpus = corpus * (1 + r) + contrib;
        }
        contrib = contrib * (1 + stepUpPct / 100);
      }
      setStepUpCorpus(corpus);
    }
  }, [monthlyContribution, employerMonthly, currentAge, retirementAge, expectedReturn, annuityRate, subscriberType, showStepUp, stepUpPct, annuityPct, lumpPct]);

  // Tax calculations
  const annualContrib = monthlyContribution * 12;
  const deduction80CCD1 = Math.min(annualContrib, 150000);
  const deduction80CCD1B = Math.min(Math.max(annualContrib - deduction80CCD1, 0), 50000);
  const totalDeduction = deduction80CCD1 + deduction80CCD1B;
  const taxSaved30 = Math.round(totalDeduction * 0.30);
  const taxSaved20 = Math.round(totalDeduction * 0.20);

  // Static year-wise data (first 5 rows — pre-rendered via SSR-seeded defaults)
  const staticRows = useMemo(() => {
    const rows = [];
    let corpus = 0;
    const r = expectedReturn / 12 / 100;
    for (let y = 1; y <= 5; y++) {
      const openCorpus = corpus;
      for (let m = 0; m < 12; m++) { corpus = corpus * (1 + r) + monthlyContribution + employerMonthly; }
      rows.push({ year: y, age: currentAge + y, invested: (monthlyContribution + employerMonthly) * 12 * y, corpus: Math.round(corpus), gains: Math.round(corpus - (monthlyContribution + employerMonthly) * 12 * y) });
    }
    return rows;
  }, [monthlyContribution, employerMonthly, expectedReturn, currentAge]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">NPS Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200 flex-shrink-0">💼</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">NPS Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate retirement corpus, monthly pension &amp; tax savings. Updated for PFRDA Dec 2025 rules.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-indigo-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" /></span>
          ₹5K/mo for 30 yrs @ 10% → ₹1.13 Cr corpus | Monthly pension: ₹11,336
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Inputs ─────────────────────────────────────── */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <h2 className="text-base md:text-lg font-bold text-gray-900">NPS Details</h2>

              {/* Subscriber type */}
              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Subscriber Type</span>
                <div className="flex gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {([['non-govt', 'Non-Government'], ['govt', 'Government Employee']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setSubscriberType(v)} className={`sip-touch-target flex-1 px-2 py-2 rounded-md text-xs font-bold transition-all ${subscriberType === v ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500'}`}>{l}</button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {subscriberType === 'non-govt' ? `Non-govt: max ${(lumpPct * 100).toFixed(0)}% lump sum, min ${(annuityPct * 100).toFixed(0)}% annuity` : `Govt: max ${(lumpPct * 100).toFixed(0)}% lump sum, min ${(annuityPct * 100).toFixed(0)}% annuity`}
                  {' '}— PFRDA circular, Dec 2025
                </p>
              </div>

              <SIPSlider label="Monthly Contribution (Own)" value={monthlyContribution} min={500} max={50000} step={500} prefix="₹" color="blue" onChange={setMonthlyContribution} formatDisplay={(v) => fmt(v)} />
              <SIPSlider label="Current Age" value={currentAge} min={18} max={59} step={1} suffix=" yrs" color="emerald" onChange={setCurrentAge} formatDisplay={(v) => `${v} years`} />
              <SIPSlider label="Retirement Age" value={retirementAge} min={60} max={75} step={1} suffix=" yrs" color="amber" onChange={setRetirementAge} formatDisplay={(v) => `${v} years`} />
              <SIPSlider label="Expected Return (p.a.)" value={expectedReturn} min={8} max={14} step={0.5} suffix="%" color="blue" onChange={setExpectedReturn} formatDisplay={(v) => `${v}%`} />
              <SIPSlider label="Expected Annuity Rate" value={annuityRate} min={4} max={8} step={0.25} suffix="%" color="emerald" onChange={setAnnuityRate} formatDisplay={(v) => `${v}% p.a.`} />

              {/* Employer contribution */}
              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-1.5">Monthly Employer Contribution (optional)</span>
                <SIPSlider label="" value={employerMonthly} min={0} max={25000} step={500} prefix="₹" color="emerald" onChange={setEmployerMonthly} formatDisplay={(v) => v === 0 ? 'None' : fmt(v)} />
                {employerMonthly > 0 && <p className="text-xs text-emerald-600 mt-1">Employer contribution up to 10% of basic salary deductible under 80CCD(2) — no upper limit</p>}
              </div>

              {/* Step-up toggle */}
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only peer" checked={showStepUp} onChange={(e) => setShowStepUp(e.target.checked)} />
                  <div className="w-10 h-6 bg-gray-200 peer-checked:bg-indigo-500 rounded-full transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-gray-700">Annual Step-Up Contribution</p>
                  {showStepUp && <div className="mt-2"><SIPSlider label="" value={stepUpPct} min={1} max={20} step={1} suffix="% p.a." color="amber" onChange={setStepUpPct} formatDisplay={(v) => `${v}% per year`} /></div>}
                </div>
              </label>

              <div className="hidden lg:block pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Key Benefits</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>🛡️ Extra ₹50,000 deduction under 80CCD(1B)</li>
                  <li>💸 {(lumpPct * 100).toFixed(0)}% lump sum is tax-free at maturity</li>
                  <li>📊 Market-linked returns (8–13% historical)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* Main outputs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Investment</span><span className="text-sm font-bold text-gray-800">{fmt(Math.round(totalInvestment))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Wealth Gained</span><span className="text-sm font-bold text-emerald-600">{fmt(Math.round(wealthGained))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Total Maturity Value</span><span className="text-lg font-extrabold text-gray-900">{fmt(Math.round(maturityValue))}</span></div>
              </div>
            </div>

            {/* Withdrawal split */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 pt-4 pb-1">
                <h3 className="text-sm font-bold text-gray-900">Withdrawal at Maturity</h3>
                <p className="text-xs text-gray-400 mt-0.5">{subscriberType === 'non-govt' ? 'Non-govt: max 80% lump sum, min 20% annuity' : 'Govt: max 60% lump sum, min 40% annuity'} — PFRDA Dec 2025</p>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-sm text-gray-500">Lump Sum ({(lumpPct * 100).toFixed(0)}% — Tax-free)</span><span className="text-sm font-bold text-emerald-600">{fmt(Math.round(lumpsum))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3"><span className="text-sm text-gray-500">Annuity ({(annuityPct * 100).toFixed(0)}% — Mandatory)</span><span className="text-sm font-bold text-blue-600">{fmt(Math.round(annuityAmount))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5 bg-indigo-50/50"><span className="text-sm font-semibold text-gray-900">Est. Monthly Pension</span><span className="text-base font-extrabold text-indigo-700">{fmt(Math.round(monthlyPension))}/mo</span></div>
                <div className="px-4 md:px-5 py-2.5 bg-gray-50/30">
                  <p className="text-xs text-gray-400">Pension = Annuity Corpus × {annuityRate}% ÷ 12 | ₹5L-or-less corpus → 100% lump sum allowed</p>
                </div>
              </div>
            </div>

            {/* Step-up comparison */}
            {showStepUp && stepUpCorpus > 0 && (
              <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
                <p className="text-sm font-bold text-indigo-800 mb-2">📈 Step-Up Impact</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-500 text-xs">Without step-up</p><p className="font-bold text-gray-800">{fmt(Math.round(maturityValue))}</p></div>
                  <div><p className="text-gray-500 text-xs">With {stepUpPct}% step-up</p><p className="font-bold text-indigo-700">{fmt(Math.round(stepUpCorpus))}</p></div>
                </div>
              </div>
            )}

            {/* Tax savings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <button onClick={() => setShowTax(!showTax)} className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 text-left">
                <span className="text-sm font-bold text-gray-900">🧾 Your Tax Savings</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showTax ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showTax && (
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  <div className="flex justify-between px-4 py-2.5 text-sm"><span className="text-gray-500">80CCD(1) deduction</span><span className="font-semibold">{fmt(deduction80CCD1)}</span></div>
                  <div className="flex justify-between px-4 py-2.5 text-sm"><span className="text-gray-500">80CCD(1B) additional</span><span className="font-semibold">{fmt(deduction80CCD1B)}</span></div>
                  <div className="flex justify-between px-4 py-2.5 text-sm"><span className="text-gray-500">Total deduction</span><span className="font-bold">{fmt(totalDeduction)}</span></div>
                  <div className="flex justify-between px-4 py-2.5 text-sm bg-emerald-50/50"><span className="text-gray-500">Tax saved @ 30% slab</span><span className="font-bold text-emerald-700">{fmt(taxSaved30)}/yr</span></div>
                  <div className="flex justify-between px-4 py-2.5 text-sm bg-emerald-50/30"><span className="text-gray-500">Tax saved @ 20% slab</span><span className="font-bold text-emerald-600">{fmt(taxSaved20)}/yr</span></div>
                </div>
              )}
            </div>

            {/* Year-wise table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 py-3.5 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Year-wise Corpus Growth</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    {['Year','Age','Annual Investment','Cumulative','Corpus Value','Gains'].map((h) => <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {staticRows.map((r) => (
                      <tr key={r.year} className="border-b border-gray-50 hover:bg-indigo-50/20">
                        <td className="px-3 py-2.5 font-medium text-gray-700">{r.year}</td>
                        <td className="px-3 py-2.5 text-gray-600">{r.age}</td>
                        <td className="px-3 py-2.5 text-gray-700">{fmt((monthlyContribution + employerMonthly) * 12)}</td>
                        <td className="px-3 py-2.5 text-gray-700">{fmt(r.invested)}</td>
                        <td className="px-3 py-2.5 font-semibold text-indigo-700">{fmt(r.corpus)}</td>
                        <td className="px-3 py-2.5 text-emerald-600">{fmt(r.gains)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><p className="text-xs text-gray-600 leading-relaxed"><strong>Disclaimer:</strong> NPS returns are market-linked and not guaranteed. Annuity rates shown are illustrative. Actual monthly pension depends on the annuity plan and provider chosen at maturity. This calculator is for planning purposes only.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
