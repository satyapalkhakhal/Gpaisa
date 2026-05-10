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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sip-chart-container flex items-center justify-center">
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

  const typeButtons: { key: typeof calculatorType; label: string }[] = [
    { key: 'regular', label: 'SIP' },
    { key: 'stepup', label: 'Step-Up SIP' },
    { key: 'lumpsum', label: 'Lumpsum' },
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
    <div className="min-h-screen bg-white">

      {/* Breadcrumb — Groww style: subtle, small */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <nav className="flex text-xs" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 text-xs">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link>
              </li>
              <li className="flex items-center">
                <svg className="w-3 h-3 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-700 font-medium">SIP Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ===== SECTION 1: Title — Groww style: clean, left-aligned ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-2">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">
          {bankName ? `${bankName} SIP Calculator` : 'SIP Calculator'}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl">
          Plan your systematic investments and visualise wealth growth with the power of compounding.
        </p>
      </div>

      {/* ===== MAIN CALCULATOR AREA ===== */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">

        {/* Desktop: 2-col split | Mobile: single column stack */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* --- LEFT COLUMN: Inputs --- */}
          <div className="lg:col-span-2 mb-4 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">

              {/* ===== Calculator Type Tabs — Groww style: underline tabs ===== */}
              <div className="mb-5 md:mb-6">
                <div className="flex border-b border-gray-200">
                  {typeButtons.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setCalculatorType(t.key)}
                      className={`sip-touch-target relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        calculatorType === t.key
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ===== Sliders — Groww style spacing ===== */}
              <div className="space-y-5 md:space-y-6">
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
                    label="Monthly investment"
                    value={monthlyInvestment}
                    min={500}
                    max={100000}
                    step={500}
                    prefix="₹"
                    color="blue"
                    onChange={setMonthlyInvestment}
                    formatDisplay={(v) => formatCurrency(v)}
                  />
                )}

                <SIPSlider
                  label="Expected return rate (p.a)"
                  value={expectedReturn}
                  min={1}
                  max={20}
                  step={0.5}
                  suffix="%"
                  color="emerald"
                  onChange={setExpectedReturn}
                  formatDisplay={(v) => `${v}%`}
                />

                <SIPSlider
                  label="Time period"
                  value={timePeriod}
                  min={1}
                  max={30}
                  step={1}
                  suffix="Yr"
                  color="amber"
                  onChange={setTimePeriod}
                  formatDisplay={(v) => `${v}Yr`}
                />

                {calculatorType === 'stepup' && (
                  <SIPSlider
                    label="Annual step-up"
                    value={stepUpPercentage}
                    min={0}
                    max={20}
                    step={1}
                    suffix="%"
                    color="emerald"
                    onChange={setStepUpPercentage}
                    formatDisplay={(v) => `${v}%`}
                  />
                )}
              </div>

              {/* Quick Insights — visible on desktop in sidebar */}
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
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

          {/* --- RIGHT COLUMN: Results, Chart, Table --- */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">

            {/* ===== Result Cards — Groww style ===== */}
            <SIPResultCards
              totalInvestment={totalInvestment}
              estimatedReturns={estimatedReturns}
              totalValue={totalValue}
            />

            {/* ===== Chart ===== */}
            {calculatorType !== 'lumpsum' && (
              <SIPChart
                monthlyInvestment={monthlyInvestment}
                expectedReturn={expectedReturn}
                timePeriod={timePeriod}
              />
            )}

            {/* ===== Breakdown Table ===== */}
            {calculatorType !== 'lumpsum' && (
              <SIPBreakdownTable
                monthlyInvestment={monthlyInvestment}
                expectedReturn={expectedReturn}
                timePeriod={timePeriod}
              />
            )}

            {/* ===== Insights (mobile only) ===== */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                💡 Quick Insights
              </h4>
              <ul className="space-y-3">
                {insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <span className={`${insight.color} flex-shrink-0 text-base mt-0.5`}>{insight.icon}</span>
                    {insight.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Formula Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
                <h3 className="text-sm md:text-base font-bold text-gray-900">SIP Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind your returns</p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100">
                  <code className="text-sm md:text-base text-gray-800 font-mono font-semibold">
                    M = P × [(1 + i)<sup>n</sup> – 1] / i × (1 + i)
                  </code>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-3">
                  {[
                    { var: 'M', desc: 'Maturity amount', color: 'bg-primary-50 text-primary-700 border-primary-200' },
                    { var: 'P', desc: 'Monthly SIP', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: 'i', desc: 'Monthly return', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { var: 'n', desc: 'Total months', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  ].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2 md:p-3 ${item.color}`}>
                      <div className="text-base font-bold font-mono">{item.var}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA — Groww style: single prominent green button */}
            <div className="px-1">
              <button className="sip-touch-target w-full bg-primary-600 text-white px-5 py-3.5 min-h-[48px] rounded-lg font-semibold text-sm active:bg-primary-700 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide">
                Invest in Mutual Funds
              </button>
            </div>
          </div>
        </div>

        {/* ===== Educational Content ===== */}
        <div className="mt-8 md:mt-10">
          <SIPEducationalContent />
        </div>
      </div>
    </div>
  );
}
