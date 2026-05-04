'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import SIPResultCards from '@/components/sip/SIPResultCards';
import SIPBreakdownTable from '@/components/sip/SIPBreakdownTable';
import SIPEducationalContent from '@/components/sip/SIPEducationalContent';

// Lazy-load the chart to improve initial page load
const SIPChart = dynamic(() => import('@/components/sip/SIPChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <div className="text-gray-400 text-sm">Loading chart...</div>
      </div>
    </div>
  ),
});

type SIPCalculatorClientProps = {
  bankName?: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export default function SIPCalculatorClient({ bankName }: SIPCalculatorClientProps = {}) {
  // Calculator state
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [stepUpPercentage, setStepUpPercentage] = useState(0);
  const [calculatorType, setCalculatorType] = useState<'regular' | 'stepup' | 'lumpsum'>('regular');
  const [lumpSumAmount, setLumpSumAmount] = useState(100000);

  // Results state
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Calculate SIP returns — same formulas as before
  useEffect(() => {
    if (calculatorType === 'lumpsum') {
      const years = timePeriod;
      const futureValue = lumpSumAmount * Math.pow(1 + expectedReturn / 100, years);
      const returns = futureValue - lumpSumAmount;
      setTotalInvestment(lumpSumAmount);
      setEstimatedReturns(Math.round(returns));
      setTotalValue(Math.round(futureValue));
    } else if (calculatorType === 'stepup') {
      const monthlyRate = expectedReturn / 12 / 100;
      const months = timePeriod * 12;
      let totalInvested = 0;
      let futureValue = 0;
      let currentSIP = monthlyInvestment;
      for (let year = 0; year < timePeriod; year++) {
        for (let month = 0; month < 12; month++) {
          totalInvested += currentSIP;
          const remainingMonths = months - (year * 12 + month);
          futureValue += currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
        }
        currentSIP = currentSIP * (1 + stepUpPercentage / 100);
      }
      setTotalInvestment(Math.round(totalInvested));
      setEstimatedReturns(Math.round(futureValue - totalInvested));
      setTotalValue(Math.round(futureValue));
    } else {
      const monthlyRate = expectedReturn / 12 / 100;
      const months = timePeriod * 12;
      const futureValue =
        monthlyInvestment *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const invested = monthlyInvestment * months;
      setTotalInvestment(Math.round(invested));
      setEstimatedReturns(Math.round(futureValue - invested));
      setTotalValue(Math.round(futureValue));
    }
  }, [monthlyInvestment, expectedReturn, timePeriod, stepUpPercentage, calculatorType, lumpSumAmount]);

  const typeButtons: { key: typeof calculatorType; label: string; icon: string; desc: string }[] = [
    { key: 'regular', label: 'Regular SIP', icon: '📊', desc: 'Fixed monthly' },
    { key: 'stepup', label: 'Step-Up SIP', icon: '🚀', desc: 'Growing yearly' },
    { key: 'lumpsum', label: 'Lump Sum', icon: '💰', desc: 'One-time invest' },
  ];

  const insights = [
    {
      icon: '🌱',
      color: 'text-emerald-500',
      text: 'SIP benefits from compounding over time',
    },
    {
      icon: '📈',
      color: 'text-amber-500',
      text: 'Longer duration increases returns significantly',
    },
    {
      icon: '⚠️',
      color: 'text-blue-500',
      text: 'Market returns may vary — past performance ≠ future',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Premium Slider Styles */}
      <style jsx global>{`
        /* === Slider Thumb — WebKit === */
        .sip-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--thumb-border, #2563EB);
          box-shadow: 0 1px 4px rgba(0,0,0,0.12), 0 0 0 4px rgba(37,99,235,0.08);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sip-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 0 6px rgba(37,99,235,0.12);
        }
        .sip-slider::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        .sip-slider::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 3px;
          background: transparent;
        }

        /* === Slider Thumb — Firefox === */
        .sip-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid var(--thumb-border, #2563EB);
          box-shadow: 0 1px 4px rgba(0,0,0,0.12), 0 0 0 4px rgba(37,99,235,0.08);
          cursor: pointer;
        }
        .sip-slider::-moz-range-track {
          height: 6px;
          border-radius: 3px;
          background: transparent;
        }

        /* Focus ring */
        .sip-slider:focus {
          outline: none;
        }
        .sip-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 0 6px rgba(37,99,235,0.15);
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs sm:text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <Link href="/calculator" className="text-gray-400 hover:text-primary-600 transition-colors">Calculator</Link>
              </li>
              <li className="flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-900 font-semibold">SIP Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-2">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white text-lg sm:text-xl shadow-lg shadow-primary-200 flex-shrink-0">
            📊
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {bankName ? `${bankName} SIP Calculator` : 'SIP Calculator India (2026)'}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 max-w-2xl">
              Plan your systematic investments and visualise wealth growth with the power of compounding.
            </p>
          </div>
        </div>
        {/* Live example pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          ₹10,000/month → ₹23.2 lakh in 10 years (12% return)
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* --- Left: Inputs (2 cols) --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-gray-100 sticky top-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5">
                Calculate Your SIP Returns
              </h2>

              {/* Calculator Type Selector */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  {typeButtons.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setCalculatorType(t.key)}
                      className={`relative px-2 py-3 rounded-lg text-center transition-all duration-200 ${
                        calculatorType === t.key
                          ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-200/60'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/60'
                      }`}
                    >
                      <span className="block text-lg mb-0.5">{t.icon}</span>
                      <span className="block text-[11px] font-bold leading-tight">{t.label}</span>
                      <span className="block text-[9px] text-gray-400 mt-0.5 leading-tight">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                {calculatorType === 'lumpsum' ? (
                  <SIPSlider
                    label="Investment Amount"
                    value={lumpSumAmount}
                    min={10000}
                    max={10000000}
                    step={10000}
                    prefix="₹"
                    color="blue"
                    onChange={setLumpSumAmount}
                    formatDisplay={(v) => formatCurrency(v)}
                  />
                ) : (
                  <SIPSlider
                    label="Monthly Investment"
                    value={monthlyInvestment}
                    min={500}
                    max={100000}
                    step={500}
                    prefix="₹"
                    color="blue"
                    onChange={setMonthlyInvestment}
                    formatDisplay={(v) => `${formatCurrency(v)}/mo`}
                  />
                )}

                <SIPSlider
                  label="Expected Return Rate (% p.a.)"
                  value={expectedReturn}
                  min={1}
                  max={20}
                  step={0.5}
                  suffix="%"
                  color="emerald"
                  onChange={setExpectedReturn}
                  formatDisplay={(v) => `${v}% p.a.`}
                />

                <SIPSlider
                  label="Investment Duration"
                  value={timePeriod}
                  min={1}
                  max={30}
                  step={1}
                  suffix=" yrs"
                  color="amber"
                  onChange={setTimePeriod}
                  formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`}
                />

                {calculatorType === 'stepup' && (
                  <SIPSlider
                    label="Annual Step-Up (%)"
                    value={stepUpPercentage}
                    min={0}
                    max={20}
                    step={1}
                    suffix="%"
                    color="emerald"
                    onChange={setStepUpPercentage}
                    formatDisplay={(v) => `${v}% yearly`}
                  />
                )}
              </div>

              {/* Divider */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                  💡 Quick Insights
                </h4>
                <ul className="space-y-2.5">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                      <span className={`${insight.color} flex-shrink-0 text-sm mt-0.5`}>{insight.icon}</span>
                      {insight.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* --- Right: Results (3 cols) --- */}
          <div className="lg:col-span-3 space-y-6">
            {/* Result Cards */}
            <SIPResultCards
              totalInvestment={totalInvestment}
              estimatedReturns={estimatedReturns}
              totalValue={totalValue}
            />

            {/* Chart */}
            {calculatorType !== 'lumpsum' && (
              <SIPChart
                monthlyInvestment={monthlyInvestment}
                expectedReturn={expectedReturn}
                timePeriod={timePeriod}
              />
            )}

            {/* Year-wise Table */}
            {calculatorType !== 'lumpsum' && (
              <SIPBreakdownTable
                monthlyInvestment={monthlyInvestment}
                expectedReturn={expectedReturn}
                timePeriod={timePeriod}
              />
            )}

            {/* Formula Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-5 sm:px-6 pt-5 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">SIP Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind your returns</p>
              </div>
              <div className="px-5 sm:px-6 pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <code className="text-base sm:text-lg text-gray-800 font-mono font-semibold">
                    M = P × [(1 + i)<sup>n</sup> – 1] / i × (1 + i)
                  </code>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { var: 'M', desc: 'Maturity amount', color: 'bg-primary-50 text-primary-700 border-primary-200' },
                    { var: 'P', desc: 'Monthly SIP', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: 'i', desc: 'Monthly return', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { var: 'n', desc: 'Total months', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  ].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-3 ${item.color}`}>
                      <div className="text-lg font-bold font-mono">{item.var}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 rounded-2xl p-5 sm:p-6 border border-primary-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Ready to Start Your SIP?</h3>
                  <p className="text-sm text-gray-600">
                    Grow your wealth to <strong className="text-primary-700">{formatCurrency(totalValue)}</strong> with trusted platforms.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button className="flex-1 bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2">
                  Explore Mutual Funds
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                <button className="flex-1 bg-white text-primary-600 px-5 py-3 rounded-xl font-semibold text-sm border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all active:scale-[0.98]">
                  Start SIP Investment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-10">
          <SIPEducationalContent />
        </div>
      </div>
    </div>
  );
}
