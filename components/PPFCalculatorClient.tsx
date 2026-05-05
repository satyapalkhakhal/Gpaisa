'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import PPFResultCards from '@/components/ppf/PPFResultCards';
import PPFBreakdownTable from '@/components/ppf/PPFBreakdownTable';
import PPFEducationalContent from '@/components/ppf/PPFEducationalContent';

// Lazy-load the chart to improve initial page load
const PPFChart = dynamic(() => import('@/components/ppf/PPFChart'), {
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

export default function PPFCalculatorClient() {
  // Calculator state
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [timePeriod, setTimePeriod] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);

  // Results state
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);

  // Calculate PPF returns — real-time
  useEffect(() => {
    const rate = interestRate / 100;
    let balance = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const interest = (balance + yearlyInvestment) * rate;
      balance = balance + yearlyInvestment + interest;
    }

    const invested = yearlyInvestment * timePeriod;
    setTotalInvestment(invested);
    setTotalInterest(Math.round(balance - invested));
    setMaturityAmount(Math.round(balance));
  }, [yearlyInvestment, timePeriod, interestRate]);

  const insights = [
    {
      icon: '🛡️',
      color: 'text-emerald-500',
      text: 'PPF offers guaranteed returns backed by government',
    },
    {
      icon: '💰',
      color: 'text-amber-500',
      text: 'Interest is tax-free (EEE benefit)',
    },
    {
      icon: '📈',
      color: 'text-blue-500',
      text: 'Best for long-term wealth creation',
    },
  ];

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
                <span className="text-gray-900 font-semibold">PPF Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ===== SECTION 1: Title / Hero ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">
            🏦
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              PPF Calculator India (2026)
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">
              Plan your Public Provident Fund investments and visualise guaranteed, tax-free wealth growth.
            </p>
          </div>
        </div>
        {/* Live example pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          ₹1.5L/year → ~₹40.7 lakh in 15 years @ 7.1%
        </div>
      </div>

      {/* ===== MAIN CALCULATOR AREA ===== */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">

        {/* Desktop: 2-col split | Mobile: single column stack */}
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* --- LEFT COLUMN: Inputs --- */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">
                Calculate Your PPF Returns
              </h2>

              {/* ===== Sliders ===== */}
              <div className="space-y-5 md:space-y-6">
                <SIPSlider
                  label="Yearly Investment"
                  value={yearlyInvestment}
                  min={500}
                  max={150000}
                  step={500}
                  prefix="₹"
                  color="blue"
                  onChange={setYearlyInvestment}
                  formatDisplay={(v) => formatCurrency(v)}
                />

                <SIPSlider
                  label="Interest Rate (% p.a.)"
                  value={interestRate}
                  min={1}
                  max={15}
                  step={0.1}
                  suffix="%"
                  color="emerald"
                  onChange={setInterestRate}
                  formatDisplay={(v) => `${v}% p.a.`}
                />

                <SIPSlider
                  label="Investment Duration"
                  value={timePeriod}
                  min={15}
                  max={30}
                  step={1}
                  suffix=" yrs"
                  color="amber"
                  onChange={setTimePeriod}
                  formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`}
                />
              </div>

              {/* PPF Rate Notice */}
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-amber-700">Current PPF Rate:</span> 7.1% p.a. (compounded annually). Set by Government of India, reviewed quarterly.
                </p>
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
          <div className="lg:col-span-3 space-y-4 md:space-y-6">

            {/* ===== Result Cards ===== */}
            <PPFResultCards
              totalInvestment={totalInvestment}
              totalInterest={totalInterest}
              maturityAmount={maturityAmount}
              timePeriod={timePeriod}
            />

            {/* ===== Chart ===== */}
            <PPFChart
              yearlyInvestment={yearlyInvestment}
              interestRate={interestRate}
              timePeriod={timePeriod}
            />

            {/* ===== Breakdown Table ===== */}
            <PPFBreakdownTable
              yearlyInvestment={yearlyInvestment}
              interestRate={interestRate}
              timePeriod={timePeriod}
            />

            {/* ===== Insights (mobile only) ===== */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
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

            {/* ===== Trust Block ===== */}
            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    PPF returns are based on current interest rates. Actual returns may change if the government revises rates. This calculator provides estimates for planning purposes only.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Formula Section ===== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
                <h3 className="text-base md:text-lg font-bold text-gray-900">PPF Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind your returns</p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
                    F = P × [(1 + i)<sup>n</sup> – 1] / i
                  </code>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mt-4">
                  {[
                    { var: 'F', desc: 'Maturity amount', color: 'bg-primary-50 text-primary-700 border-primary-200' },
                    { var: 'P', desc: 'Yearly deposit', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: 'i', desc: 'Interest rate', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { var: 'n', desc: 'Total years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  ].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                      <div className="text-lg font-bold font-mono">{item.var}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Real Example CTA ===== */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-emerald-50 rounded-2xl p-4 md:p-6 border border-primary-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real Example</h3>
                  <p className="text-sm text-gray-600">
                    If you invest ₹1.5 lakh per year for 15 years:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Invested</div>
                  <div className="text-lg font-extrabold text-gray-900">₹22.5 Lakh</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Maturity Value</div>
                  <div className="text-lg font-extrabold text-emerald-600">~₹40.7 Lakh+</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                That&apos;s nearly <strong className="text-primary-700">₹18.2 lakh in tax-free interest</strong> — the power of compounding!
              </p>
            </div>
          </div>
        </div>

        {/* ===== Educational Content ===== */}
        <div className="mt-8 md:mt-10">
          <PPFEducationalContent />
        </div>
      </div>
    </div>
  );
}
