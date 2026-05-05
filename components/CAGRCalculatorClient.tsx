'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import CAGRResultCards from '@/components/cagr/CAGRResultCards';
import CAGRSmartInsights from '@/components/cagr/CAGRSmartInsights';
import CAGREducationalContent from '@/components/cagr/CAGREducationalContent';

// Lazy-load chart
const CAGRChart = dynamic(() => import('@/components/cagr/CAGRChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sip-chart-container flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
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

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

export default function CAGRCalculatorClient() {
  // Input state
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(200000);
  const [duration, setDuration] = useState(5);

  // Result state
  const [cagr, setCagr] = useState(0);
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [absoluteReturn, setAbsoluteReturn] = useState(0);

  // Calculate CAGR — real-time
  useEffect(() => {
    if (initialValue > 0 && finalValue > 0 && duration > 0) {
      const cagrValue = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
      const growth = ((finalValue - initialValue) / initialValue) * 100;
      const absReturn = finalValue - initialValue;

      setCagr(cagrValue);
      setTotalGrowth(growth);
      setAbsoluteReturn(absReturn);
    }
  }, [initialValue, finalValue, duration]);

  // Precomputed example
  const exampleCagr = useMemo(() => {
    return ((Math.pow(200000 / 100000, 1 / 5) - 1) * 100).toFixed(2);
  }, []);

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
                <span className="text-gray-900 font-semibold">CAGR Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ===== Title / Hero ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">
            📈
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              CAGR Calculator India (2026)
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">
              Calculate Compound Annual Growth Rate for stocks, mutual funds, and any investment. Compare performance instantly.
            </p>
          </div>
        </div>
        {/* Live example pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          ₹1L → ₹2L in 5 yrs = {exampleCagr}% CAGR
        </div>
      </div>

      {/* ===== MAIN CALCULATOR AREA ===== */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">

        <div className="lg:grid lg:grid-cols-5 lg:gap-6">

          {/* --- LEFT COLUMN: Inputs --- */}
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">
                Investment Details
              </h2>

              <div className="space-y-5 md:space-y-6">
                <SIPSlider
                  label="Initial Investment"
                  value={initialValue}
                  min={10000}
                  max={10000000}
                  step={10000}
                  prefix="₹"
                  color="blue"
                  onChange={setInitialValue}
                  formatDisplay={(v) => formatLakh(v)}
                />

                <SIPSlider
                  label="Final Value"
                  value={finalValue}
                  min={10000}
                  max={100000000}
                  step={10000}
                  prefix="₹"
                  color="emerald"
                  onChange={setFinalValue}
                  formatDisplay={(v) => formatLakh(v)}
                />

                <SIPSlider
                  label="Duration (Years)"
                  value={duration}
                  min={1}
                  max={30}
                  step={1}
                  suffix=" yrs"
                  color="amber"
                  onChange={setDuration}
                  formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`}
                />
              </div>

              {/* Comparison Mode — desktop sidebar */}
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                  📊 Benchmark Comparison
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'FD', rate: '6–7%', icon: '🏦' },
                    { name: 'Gold', rate: '8–10%', icon: '🥇' },
                    { name: 'Nifty 50', rate: '12–15%', icon: '📈' },
                  ].map((b) => {
                    const midRate = b.name === 'FD' ? 6.5 : b.name === 'Gold' ? 9 : 13.5;
                    const beats = cagr >= midRate;
                    return (
                      <div key={b.name} className="flex items-center justify-between text-xs text-gray-600 py-1.5">
                        <span className="flex items-center gap-2">
                          <span>{b.icon}</span>
                          <span>{b.name} ({b.rate})</span>
                        </span>
                        <span className={`font-bold ${beats ? 'text-emerald-600' : 'text-red-500'}`}>
                          {beats ? '✓ Beats' : '✗ Trails'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Results, Chart, Insights --- */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">

            {/* ===== Result Cards ===== */}
            <CAGRResultCards
              cagr={cagr}
              totalGrowth={totalGrowth}
              absoluteReturn={absoluteReturn}
              initialValue={initialValue}
              finalValue={finalValue}
              duration={duration}
            />

            {/* ===== Chart ===== */}
            <CAGRChart
              initialValue={initialValue}
              cagr={cagr}
              duration={duration}
            />

            {/* ===== Smart Insights ===== */}
            <CAGRSmartInsights
              initialValue={initialValue}
              finalValue={finalValue}
              cagr={cagr}
              duration={duration}
            />

            {/* ===== Comparison Mode — mobile ===== */}
            <div className="lg:hidden bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-base font-bold text-gray-900">📊 Benchmark Comparison</h3>
                <p className="text-xs text-gray-500 mt-0.5">How your CAGR compares</p>
              </div>
              <div className="px-4 pb-4 space-y-2">
                {[
                  { name: 'Fixed Deposit', rate: '6–7%', mid: 6.5, icon: '🏦' },
                  { name: 'Gold', rate: '8–10%', mid: 9, icon: '🥇' },
                  { name: 'Nifty 50', rate: '12–15%', mid: 13.5, icon: '📈' },
                ].map((b) => {
                  const beats = cagr >= b.mid;
                  return (
                    <div key={b.name} className={`flex items-center justify-between p-3 rounded-xl border ${beats ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                      <span className="flex items-center gap-2 text-sm text-gray-700">
                        <span>{b.icon}</span>
                        <span className="font-medium">{b.name}</span>
                        <span className="text-xs text-gray-500">({b.rate})</span>
                      </span>
                      <span className={`text-xs font-bold ${beats ? 'text-emerald-600' : 'text-red-500'}`}>
                        {beats ? '✓ Beats' : '✗ Trails'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===== Disclaimer ===== */}
            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    CAGR represents historical growth and does not guarantee future returns. Past performance is not indicative of future results. Always consider risk factors before investing.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Real Example ===== */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 rounded-2xl p-4 md:p-6 border border-emerald-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real Example</h3>
                  <p className="text-sm text-gray-600">
                    If ₹1,00,000 grows to ₹2,00,000 in 5 years:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Initial</div>
                  <div className="text-base md:text-lg font-extrabold text-gray-900">₹1,00,000</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Final</div>
                  <div className="text-base md:text-lg font-extrabold text-gray-900">₹2,00,000</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">CAGR</div>
                  <div className="text-base md:text-lg font-extrabold text-emerald-600">14.87%</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Your money doubled at a compounded rate of <strong className="text-emerald-700">14.87% per year</strong> — beating most FDs and gold returns!
              </p>
            </div>

            {/* ===== Formula Section ===== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
                <h3 className="text-base md:text-lg font-bold text-gray-900">CAGR Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind the metric</p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
                    CAGR = (FV / IV)<sup>1/N</sup> – 1
                  </code>
                </div>
                <div className="grid grid-cols-3 gap-2.5 md:gap-3 mt-4">
                  {[
                    { var: 'FV', desc: 'Final Value', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { var: 'IV', desc: 'Initial Value', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: 'N', desc: 'Years', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  ].map((item) => (
                    <div key={item.var} className={`rounded-lg border p-2.5 md:p-3 ${item.color}`}>
                      <div className="text-lg font-bold font-mono">{item.var}</div>
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
          <CAGREducationalContent />
        </div>
      </div>
    </div>
  );
}
