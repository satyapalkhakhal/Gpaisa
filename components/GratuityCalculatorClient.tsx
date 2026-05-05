'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import GratuityResultCards from '@/components/gratuity/GratuityResultCards';
import GratuitySmartInsights from '@/components/gratuity/GratuitySmartInsights';
import GratuityEducationalContent from '@/components/gratuity/GratuityEducationalContent';

// Lazy-load chart for performance
const GratuityChart = dynamic(() => import('@/components/gratuity/GratuityChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sip-chart-container flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <div className="text-gray-400 text-sm">Loading chart...</div>
      </div>
    </div>
  ),
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export default function GratuityCalculatorClient() {
  // Input state
  const [lastSalary, setLastSalary] = useState(50000);
  const [yearsOfService, setYearsOfService] = useState(10);
  const [extraMonths, setExtraMonths] = useState(0);
  const [isCovered, setIsCovered] = useState(true);

  // Result state
  const [gratuityAmount, setGratuityAmount] = useState(0);

  // Apply rounding rule: >6 months → round up
  const eligibleYears = useMemo(() => {
    return extraMonths > 6 ? yearsOfService + 1 : yearsOfService;
  }, [yearsOfService, extraMonths]);

  const isEligible = eligibleYears >= 5;

  // Calculate gratuity — real-time
  useEffect(() => {
    const divisor = isCovered ? 26 : 30;
    const raw = (lastSalary * 15 * eligibleYears) / divisor;
    const capped = Math.min(raw, 2000000);
    setGratuityAmount(Math.round(capped));
  }, [lastSalary, eligibleYears, isCovered]);

  const isCapped = useMemo(() => {
    const divisor = isCovered ? 26 : 30;
    return (lastSalary * 15 * eligibleYears) / divisor > 2000000;
  }, [lastSalary, eligibleYears, isCovered]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* Breadcrumb */}
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
                <span className="text-gray-900 font-semibold">Gratuity Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ===== Title / Hero ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-amber-200 flex-shrink-0">
            🏆
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Gratuity Calculator India (2026)
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">
              Calculate your gratuity amount as per Payment of Gratuity Act, 1972. Tax-free retirement benefit.
            </p>
          </div>
        </div>
        {/* Live example pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-amber-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          ₹50K salary × 10 yrs → ₹2.88 lakh gratuity (tax-free)
        </div>
      </div>

      {/* ===== MAIN CALCULATOR AREA ===== */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">

        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* --- LEFT COLUMN: Inputs --- */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">
                Employment Details
              </h2>

              {/* ===== Sliders ===== */}
              <div className="space-y-5 md:space-y-6">
                <SIPSlider
                  label="Last Drawn Salary (Basic + DA)"
                  value={lastSalary}
                  min={10000}
                  max={500000}
                  step={5000}
                  prefix="₹"
                  color="blue"
                  onChange={setLastSalary}
                  formatDisplay={(v) => formatCurrency(v)}
                />

                <SIPSlider
                  label="Years of Service"
                  value={yearsOfService}
                  min={1}
                  max={40}
                  step={1}
                  suffix=" yrs"
                  color="emerald"
                  onChange={setYearsOfService}
                  formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`}
                />

                <SIPSlider
                  label="Extra Months (for rounding)"
                  value={extraMonths}
                  min={0}
                  max={11}
                  step={1}
                  suffix=" mo"
                  color="amber"
                  onChange={setExtraMonths}
                  formatDisplay={(v) =>
                    v === 0
                      ? '0 months'
                      : `${v} month${v > 1 ? 's' : ''} ${v > 6 ? '→ rounds up' : '→ ignored'}`
                  }
                />
              </div>

              {/* Employee Type Toggle */}
              <div className="mt-5">
                <span className="text-[13px] font-semibold text-gray-500 block mb-2">Employee Type</span>
                <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
                  <button
                    onClick={() => setIsCovered(true)}
                    className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                      isCovered
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                        : 'text-gray-500 active:bg-gray-100/80'
                    }`}
                  >
                    Covered (÷26)
                  </button>
                  <button
                    onClick={() => setIsCovered(false)}
                    className={`sip-touch-target flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all ${
                      !isCovered
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                        : 'text-gray-500 active:bg-gray-100/80'
                    }`}
                  >
                    Not Covered (÷30)
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Covered: Under Payment of Gratuity Act (10+ employees)
                </p>
              </div>

              {/* Quick Info — desktop only */}
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                  📋 Quick Info
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { icon: '⏰', color: 'text-blue-500', text: 'Minimum 5 years required' },
                    { icon: '💰', color: 'text-amber-500', text: 'Maximum gratuity ₹20 lakh' },
                    { icon: '🛡️', color: 'text-emerald-500', text: 'Tax-free up to ₹20 lakh' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                      <span className={`${item.color} flex-shrink-0 text-sm mt-0.5`}>{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Results, Chart, Insights --- */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">

            {/* ===== Result Cards ===== */}
            <GratuityResultCards
              gratuityAmount={gratuityAmount}
              eligibleYears={eligibleYears}
              lastSalary={lastSalary}
              isEligible={isEligible}
              isCapped={isCapped}
            />

            {/* ===== Chart ===== */}
            <GratuityChart
              lastSalary={lastSalary}
              isCovered={isCovered}
            />

            {/* ===== Smart Insights ===== */}
            <GratuitySmartInsights
              lastSalary={lastSalary}
              yearsOfService={eligibleYears}
              gratuityAmount={gratuityAmount}
              isCovered={isCovered}
            />

            {/* ===== Quick Info (mobile only) ===== */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                📋 Quick Info
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: '⏰', color: 'text-blue-500', text: 'Minimum 5 years required' },
                  { icon: '💰', color: 'text-amber-500', text: 'Maximum gratuity ₹20 lakh' },
                  { icon: '🛡️', color: 'text-emerald-500', text: 'Tax-free up to ₹20 lakh' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className={`${item.color} flex-shrink-0 text-base mt-0.5`}>{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* ===== Disclaimer ===== */}
            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    This calculator provides estimates based on the Payment of Gratuity Act, 1972. Actual gratuity may vary based on employer policies and applicable rules. Consult your HR department for exact figures.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Real Example ===== */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl p-4 md:p-6 border border-amber-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real Example</h3>
                  <p className="text-sm text-gray-600">
                    For a salary of ₹50,000 and 10 years of service:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Salary</div>
                  <div className="text-base md:text-lg font-extrabold text-gray-900">₹50,000</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Service</div>
                  <div className="text-base md:text-lg font-extrabold text-gray-900">10 Years</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Gratuity</div>
                  <div className="text-base md:text-lg font-extrabold text-emerald-600">₹2.88L</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mt-3 border border-gray-100">
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm text-gray-600 font-mono flex-wrap">
                  <span className="font-bold text-gray-800">₹50,000</span>
                  <span className="text-gray-400">×</span>
                  <span className="font-bold text-gray-800">15</span>
                  <span className="text-gray-400">×</span>
                  <span className="font-bold text-gray-800">10</span>
                  <span className="text-gray-400">÷</span>
                  <span className="font-bold text-gray-800">26</span>
                  <span className="text-gray-400">=</span>
                  <span className="font-bold text-emerald-600">₹2,88,462</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This <strong className="text-emerald-700">₹2.88 lakh is completely tax-free</strong> — a significant retirement benefit!
              </p>
            </div>

            {/* ===== Formula Section ===== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
                <h3 className="text-base md:text-lg font-bold text-gray-900">Gratuity Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind your benefit</p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
                    Gratuity = (Salary × 15 × Years) / 26
                  </code>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
                  {[
                    { var: 'Salary', desc: 'Basic + DA', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: '15', desc: 'Days / month', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { var: 'Years', desc: 'Completed years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { var: '26', desc: 'Working days', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                  ].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                      <div className="text-base md:text-lg font-bold font-mono">{item.var}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Educational Content ===== */}
        <div className="mt-8 md:mt-10">
          <GratuityEducationalContent />
        </div>
      </div>
    </div>
  );
}
