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
      <div className="animate-pulse text-gray-400 text-sm">Loading chart...</div>
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

  const typeButtons: { key: typeof calculatorType; label: string; icon: string }[] = [
    { key: 'regular', label: 'Regular SIP', icon: '📊' },
    { key: 'stepup', label: 'Step-Up SIP', icon: '🚀' },
    { key: 'lumpsum', label: 'Lump Sum', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      {/* Custom slider styles */}
      <style jsx global>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid currentColor;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid currentColor;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }
        input[type='range']::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li><Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link></li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/calculator" className="text-gray-500 hover:text-primary-600">Calculator</Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-900 font-medium">SIP Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          SIP Calculator India (2026) – Monthly SIP Return Calculator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
          Plan your systematic investments and see how your money grows with the power of compounding.
        </p>
        <p className="text-sm font-semibold text-primary-600 mt-1">
          ₹10,000/month → ₹23.2 lakh in 10 years (12% return)
        </p>
      </div>

      {/* Main Calculator */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* --- Left: Inputs (2 cols) --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Calculate Your SIP Returns</h2>

              {/* Calculator Type Selector */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl">
                  {typeButtons.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setCalculatorType(t.key)}
                      className={`px-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        calculatorType === t.key
                          ? 'bg-white text-primary-700 shadow-md'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
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

              {/* Quick Insights */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">💡 Quick Insights</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">●</span>
                    Longer investment duration significantly increases returns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">●</span>
                    Higher returns depend on market performance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">●</span>
                    SIP helps average out market volatility
                  </li>
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

            {/* CTA Buttons */}
            <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-5 border border-primary-200">
              <h3 className="text-base font-bold text-gray-900 mb-2">💡 Ready to Start Your SIP?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Based on your calculation, you can grow your wealth to <strong className="text-primary-700">{formatCurrency(totalValue)}</strong> with trusted platforms.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg">
                  Explore Mutual Funds →
                </button>
                <button className="bg-white text-primary-600 px-5 py-2.5 rounded-xl font-semibold text-sm border border-primary-300 hover:bg-primary-50 transition-colors">
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
