'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SIPSlider from '@/components/sip/SIPSlider';
import EMIResultCards from '@/components/emi/EMIResultCards';
import EMIAmortizationTable from '@/components/emi/EMIAmortizationTable';
import EMISmartInsights from '@/components/emi/EMISmartInsights';
import EMIEducationalContent from '@/components/emi/EMIEducationalContent';

// Lazy-load the pie chart to improve initial page load
const EMIPieChart = dynamic(() => import('@/components/emi/EMIPieChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center justify-center" style={{ height: 340 }}>
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

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

export default function EMICalculatorClient() {
  // Calculator state
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // Results state
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const tenureMonths = useMemo(
    () => (tenureType === 'years' ? loanTenure * 12 : loanTenure),
    [loanTenure, tenureType]
  );

  // Calculate EMI — real-time
  useEffect(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureMonths;

    if (principal > 0 && monthlyRate > 0 && months > 0) {
      const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      const total = emi * months;
      const interest = total - principal;

      setMonthlyEMI(Math.round(emi));
      setTotalInterest(Math.round(interest));
      setTotalPayment(Math.round(total));
    }
  }, [loanAmount, interestRate, tenureMonths]);

  // Real example values for the pill
  const exampleEMI = useMemo(() => {
    const P = 1000000;
    const R = 10 / 12 / 100;
    const N = 60;
    return Math.round(
      (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
    );
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
                <span className="text-gray-900 font-semibold">EMI Calculator</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ===== Title / Hero ===== */}
      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-blue-200 flex-shrink-0">
            💳
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              EMI Calculator India (2026)
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">
              Calculate loan EMI for home loan, car loan, personal loan & education loan with instant amortization schedule.
            </p>
          </div>
        </div>
        {/* Live example pill */}
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-blue-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          ₹10L loan @ 10% for 5 yrs → EMI {formatCurrency(exampleEMI)}
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
                Loan Details
              </h2>

              {/* ===== Sliders ===== */}
              <div className="space-y-5 md:space-y-6">
                <SIPSlider
                  label="Loan Amount"
                  value={loanAmount}
                  min={100000}
                  max={50000000}
                  step={100000}
                  prefix="₹"
                  color="blue"
                  onChange={setLoanAmount}
                  formatDisplay={(v) => formatLakh(v)}
                />

                <SIPSlider
                  label="Interest Rate (% p.a.)"
                  value={interestRate}
                  min={5}
                  max={20}
                  step={0.1}
                  suffix="%"
                  color="amber"
                  onChange={setInterestRate}
                  formatDisplay={(v) => `${v}% p.a.`}
                />

                {/* Tenure with type toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-gray-500">Loan Tenure</span>
                    <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-lg border border-gray-100">
                      <button
                        onClick={() => {
                          if (tenureType === 'months') {
                            setTenureType('years');
                            setLoanTenure(Math.max(1, Math.round(loanTenure / 12)));
                          }
                        }}
                        className={`sip-touch-target px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          tenureType === 'years'
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                            : 'text-gray-400 active:bg-gray-100/80'
                        }`}
                      >
                        Years
                      </button>
                      <button
                        onClick={() => {
                          if (tenureType === 'years') {
                            setTenureType('months');
                            setLoanTenure(Math.min(360, loanTenure * 12));
                          }
                        }}
                        className={`sip-touch-target px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          tenureType === 'months'
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60'
                            : 'text-gray-400 active:bg-gray-100/80'
                        }`}
                      >
                        Months
                      </button>
                    </div>
                  </div>
                  <SIPSlider
                    label=""
                    value={loanTenure}
                    min={tenureType === 'years' ? 1 : 12}
                    max={tenureType === 'years' ? 30 : 360}
                    step={tenureType === 'years' ? 1 : 6}
                    suffix={tenureType === 'years' ? ' yrs' : ' mo'}
                    color="emerald"
                    onChange={setLoanTenure}
                    formatDisplay={(v) =>
                      tenureType === 'years'
                        ? `${v} year${v > 1 ? 's' : ''}`
                        : `${v} months`
                    }
                  />
                </div>
              </div>

              {/* Quick education — visible on desktop */}
              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                  📚 Quick Guide
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { icon: '💳', color: 'text-blue-500', text: 'EMI is a fixed monthly payment' },
                    { icon: '📊', color: 'text-orange-500', text: 'Early payments go mostly toward interest' },
                    { icon: '💡', color: 'text-emerald-500', text: 'Later payments reduce principal faster' },
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

          {/* --- RIGHT COLUMN: Results, Chart, Insights, Table --- */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">

            {/* ===== Result Cards ===== */}
            <EMIResultCards
              monthlyEMI={monthlyEMI}
              totalInterest={totalInterest}
              totalPayment={totalPayment}
              loanAmount={loanAmount}
            />

            {/* ===== Pie Chart ===== */}
            <EMIPieChart
              loanAmount={loanAmount}
              totalInterest={totalInterest}
            />

            {/* ===== Smart Insights ===== */}
            <EMISmartInsights
              loanAmount={loanAmount}
              interestRate={interestRate}
              tenureMonths={tenureMonths}
              monthlyEMI={monthlyEMI}
              totalInterest={totalInterest}
            />

            {/* ===== Amortization Table ===== */}
            <EMIAmortizationTable
              loanAmount={loanAmount}
              interestRate={interestRate}
              tenureMonths={tenureMonths}
              monthlyEMI={monthlyEMI}
            />

            {/* ===== Quick education (mobile only) ===== */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">
                📚 Quick Guide
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: '💳', color: 'text-blue-500', text: 'EMI is a fixed monthly payment' },
                  { icon: '📊', color: 'text-orange-500', text: 'Early payments go mostly toward interest' },
                  { icon: '💡', color: 'text-emerald-500', text: 'Later payments reduce principal faster' },
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
                    EMI calculations are based on the inputs provided and assume a fixed interest rate. Actual EMI may vary based on processing fees, floating rate changes, and lender terms.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Real Example ===== */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 rounded-2xl p-4 md:p-6 border border-blue-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real Example</h3>
                  <p className="text-sm text-gray-600">
                    For a ₹10 lakh loan at 10% interest for 5 years:
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white rounded-xl p-3 border border-gray-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Monthly EMI</div>
                  <div className="text-lg font-extrabold text-gray-900">₹21,247</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-orange-200">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Interest</div>
                  <div className="text-lg font-extrabold text-orange-600">~₹2.7 Lakh</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                You pay <strong className="text-orange-700">₹2.7 lakh in interest</strong> on a ₹10 lakh loan — nearly 27% of the principal!
              </p>
            </div>

            {/* ===== Formula Section ===== */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3">
                <h3 className="text-base md:text-lg font-bold text-gray-900">EMI Formula</h3>
                <p className="text-xs text-gray-500 mt-0.5">The math behind your payments</p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-5">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <code className="text-base md:text-lg text-gray-800 font-mono font-semibold">
                    EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> – 1]
                  </code>
                </div>
                <div className="grid grid-cols-3 gap-2.5 md:gap-3 mt-4">
                  {[
                    { var: 'P', desc: 'Loan amount', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { var: 'R', desc: 'Monthly rate', color: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { var: 'N', desc: 'Total months', color: 'bg-amber-50 text-amber-700 border-amber-200' },
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
          <EMIEducationalContent />
        </div>
      </div>
    </div>
  );
}
