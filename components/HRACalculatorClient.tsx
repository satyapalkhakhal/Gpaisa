'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const METRO_CITIES = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'];
const NON_METRO_CITIES = ['Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Chandigarh', 'Other'];
const ALL_CITIES = [...METRO_CITIES.map(c => ({ city: c, metro: true })), ...NON_METRO_CITIES.map(c => ({ city: c, metro: false }))];

function computeHRA(basicMonthly: number, daMonthly: number, hraMonthly: number, rentMonthly: number, isMetro: boolean) {
  const annualBasicDA = (basicMonthly + daMonthly) * 12;
  const annualHRA = hraMonthly * 12;
  const annualRent = rentMonthly * 12;
  const c1 = annualHRA;
  const c2 = Math.max(0, annualRent - 0.1 * annualBasicDA);
  const c3 = (isMetro ? 0.5 : 0.4) * annualBasicDA;
  const exempted = Math.max(0, Math.min(c1, c2, c3));
  return { annualHRA, c1, c2, c3, exempted, taxable: annualHRA - exempted };
}

interface HRAProps {
  initialAnnualHRA?: number;
  initialC1?: number;
  initialC2?: number;
  initialC3?: number;
  initialExempted?: number;
  initialTaxable?: number;
}

export default function HRACalculatorClient({
  initialAnnualHRA = 240000,
  initialC1 = 240000,
  initialC2 = 120000,
  initialC3 = 300000,
  initialExempted = 120000,
  initialTaxable = 120000,
}: HRAProps) {
  // Input mode
  const [inputMode, setInputMode] = useState<'monthly' | 'annual'>('monthly');

  // Monthly inputs (internal calculation always monthly)
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(15000);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [taxSlab, setTaxSlab] = useState<20 | 30>(30);

  // Outputs — seeded with SSR values
  const [annualHRA, setAnnualHRA] = useState(initialAnnualHRA);
  const [c1, setC1] = useState(initialC1);
  const [c2, setC2] = useState(initialC2);
  const [c3, setC3] = useState(initialC3);
  const [exempted, setExempted] = useState(initialExempted);
  const [taxable, setTaxable] = useState(initialTaxable);

  const isMetro = METRO_CITIES.includes(selectedCity);

  useEffect(() => {
    const r = computeHRA(basicSalary, da, hraReceived, rentPaid, isMetro);
    setAnnualHRA(r.annualHRA);
    setC1(r.c1); setC2(r.c2); setC3(r.c3);
    setExempted(r.exempted);
    setTaxable(r.taxable);
  }, [basicSalary, da, hraReceived, rentPaid, isMetro]);

  // When mode toggles, convert values
  const handleModeToggle = (mode: 'monthly' | 'annual') => {
    if (mode === inputMode) return;
    if (mode === 'annual') {
      setBasicSalary(v => v * 12);
      setDa(v => v * 12);
      setHraReceived(v => v * 12);
      setRentPaid(v => v * 12);
    } else {
      setBasicSalary(v => Math.round(v / 12));
      setDa(v => Math.round(v / 12));
      setHraReceived(v => Math.round(v / 12));
      setRentPaid(v => Math.round(v / 12));
    }
    setInputMode(mode);
  };

  // For slider — if annual mode, slider value is annual; divide by 12 for calc
  const toMonthly = (v: number) => inputMode === 'annual' ? Math.round(v / 12) : v;

  const taxSaved = Math.round(exempted * taxSlab / 100);
  const taxSaved20 = Math.round(exempted * 0.20);
  const taxSaved30 = Math.round(exempted * 0.30);

  const leastLabel = [c1, c2, c3].indexOf(Math.min(c1, c2, c3)) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">HRA Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl shadow-lg shadow-sky-200 flex-shrink-0">🏡</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">HRA Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate HRA exemption under Section 10(13A) — metro vs non-metro, old vs new regime.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 ring-sky-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" /></span>
          Section 10(13A) — Old Tax Regime only
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-lg font-bold text-gray-900">Salary &amp; Rent Details</h2>
                {/* Monthly / Annual toggle */}
                <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg text-xs">
                  {(['monthly', 'annual'] as const).map((m) => (
                    <button key={m} onClick={() => handleModeToggle(m)} className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${inputMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <SIPSlider
                  label={`Basic Salary (${inputMode === 'monthly' ? 'Monthly' : 'Annual'})`}
                  value={basicSalary}
                  min={inputMode === 'monthly' ? 10000 : 120000}
                  max={inputMode === 'monthly' ? 300000 : 3600000}
                  step={inputMode === 'monthly' ? 5000 : 60000}
                  prefix="₹" color="blue"
                  onChange={(v) => { setBasicSalary(v); if (inputMode === 'annual') { /* internal stays annual, toMonthly handles it */ } }}
                  formatDisplay={(v) => fmt(v)}
                />
                <SIPSlider label={`Dearness Allowance (${inputMode === 'monthly' ? 'Monthly' : 'Annual'})`} value={da} min={0} max={inputMode === 'monthly' ? 100000 : 1200000} step={inputMode === 'monthly' ? 1000 : 12000} prefix="₹" color="emerald" onChange={setDa} formatDisplay={(v) => v === 0 ? '₹0 (Most private sector)' : fmt(v)} />
                <SIPSlider label={`HRA Received (${inputMode === 'monthly' ? 'Monthly' : 'Annual'})`} value={hraReceived} min={0} max={inputMode === 'monthly' ? 150000 : 1800000} step={inputMode === 'monthly' ? 1000 : 12000} prefix="₹" color="amber" onChange={setHraReceived} formatDisplay={(v) => fmt(v)} />
                <SIPSlider label={`Rent Paid (${inputMode === 'monthly' ? 'Monthly' : 'Annual'})`} value={rentPaid} min={0} max={inputMode === 'monthly' ? 200000 : 2400000} step={inputMode === 'monthly' ? 1000 : 12000} prefix="₹" color="blue" onChange={setRentPaid} formatDisplay={(v) => fmt(v)} />
              </div>

              {/* City selector */}
              <div>
                <label className="text-[13px] font-semibold text-gray-500 block mb-1.5">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <optgroup label="Metro Cities — 50% of Basic+DA">
                    {METRO_CITIES.map(c => <option key={c} value={c}>{c} (Metro — 50%)</option>)}
                  </optgroup>
                  <optgroup label="Non-Metro Cities — 40% of Basic+DA">
                    {NON_METRO_CITIES.map(c => <option key={c} value={c}>{c} (Non-Metro — 40%)</option>)}
                  </optgroup>
                </select>
                {!isMetro && ['Bengaluru', 'Hyderabad', 'Pune'].includes(selectedCity) && (
                  <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                    ⚠️ {selectedCity} is classified as <strong>non-metro</strong> (40%) for HRA purposes despite being a major city.
                  </p>
                )}
              </div>

              {/* Tax slab selector */}
              <div>
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Your Income Tax Slab</span>
                <div className="flex gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                  {([20, 30] as const).map((s) => (
                    <button key={s} onClick={() => setTaxSlab(s)} className={`sip-touch-target flex-1 py-2 rounded-md text-xs font-bold transition-all ${taxSlab === s ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60' : 'text-gray-500'}`}>{s}% Slab</button>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block pt-4 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">💡 Key Rules</h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>🏙️ Metro: Delhi, Mumbai, Kolkata, Chennai only (50%)</li>
                  <li>🏠 Non-metro: Bengaluru, Hyderabad, Pune etc. (40%)</li>
                  <li>📄 Rent &gt; ₹1L/yr → Landlord PAN mandatory</li>
                  <li>❌ Not available under new tax regime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* Main outputs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Annual HRA Received</span><span className="text-sm font-bold text-gray-800">{fmt(annualHRA)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">HRA Exempted (least of 3 components)</span><span className="text-sm font-bold text-emerald-600">{fmt(Math.round(exempted))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Taxable HRA</span><span className="text-sm font-bold text-orange-600">{fmt(Math.round(taxable))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5 bg-emerald-50/50"><span className="text-sm text-gray-600">Tax Saved @ 20% slab</span><span className="text-sm font-bold text-emerald-600">{fmt(taxSaved20)}/yr</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-emerald-50"><span className="text-base font-semibold text-gray-900">Tax Saved @ 30% slab</span><span className="text-lg font-extrabold text-emerald-700">{fmt(taxSaved30)}/yr</span></div>
              </div>
            </div>

            {/* 3-component breakdown */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-5 pt-4 pb-2">
                <h3 className="text-sm font-bold text-gray-900">HRA Exemption Breakdown — 3 Components</h3>
                <p className="text-xs text-gray-400 mt-0.5">The <strong className="text-sky-600">lowest</strong> of the three is your exempt amount</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: '1. Actual HRA received', value: c1 },
                  { label: `2. Rent paid − 10% of Basic+DA`, value: c2 },
                  { label: `3. ${isMetro ? '50%' : '40%'} of Basic+DA (${isMetro ? 'metro' : 'non-metro'})`, value: c3 },
                ].map((item, i) => {
                  const isLeast = i + 1 === leastLabel;
                  return (
                    <div key={i} className={`flex items-center justify-between px-4 md:px-5 py-3 ${isLeast ? 'bg-sky-50' : ''}`}>
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        {item.label}
                        {isLeast && <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded-full">LEAST ✓</span>}
                      </span>
                      <span className={`text-xs font-bold ${isLeast ? 'text-sky-700' : 'text-gray-700'}`}>{fmt(Math.round(item.value))}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tax slab result highlight */}
            <div className="bg-sky-50 rounded-2xl border border-sky-100 p-4 md:p-5">
              <p className="text-sm font-bold text-sky-800 mb-1">Your estimated tax saving ({taxSlab}% slab)</p>
              <p className="text-3xl font-extrabold text-sky-700">{fmt(taxSaved)}<span className="text-base font-medium text-sky-500">/year</span></p>
              <p className="text-xs text-gray-500 mt-1">Based on HRA exempt amount of {fmt(Math.round(exempted))} × {taxSlab}%</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Old Tax Regime Only</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">HRA exemption under Section 10(13A) is available only if you opt for the old tax regime. Under the new tax regime, HRA is fully taxable. Consult a tax advisor for personalised advice.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
