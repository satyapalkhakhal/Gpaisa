'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';
import { homeLoanBanks } from '@/lib/homeLoanBankData';

type HomeLoanCalculatorClientProps = { bankName?: string; defaultInterestRate?: number };

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatLakh = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

export default function HomeLoanCalculatorClient({ bankName, defaultInterestRate = 8.5 }: HomeLoanCalculatorClientProps = {}) {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(defaultInterestRate);
  const [loanTenure, setLoanTenure] = useState(20);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const tenureMonths = loanTenure * 12;
    if (principal > 0 && monthlyRate > 0 && tenureMonths > 0) {
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      const total = emi * tenureMonths;
      setMonthlyEMI(Math.round(emi));
      setTotalInterest(Math.round(total - principal));
      setTotalAmount(Math.round(total));
    }
  }, [loanAmount, interestRate, loanTenure]);

  const generateBreakdown = () => {
    const monthlyRate = interestRate / 12 / 100;
    const breakdown = [];
    let balance = loanAmount;
    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0, yearlyInterest = 0;
      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyEMI - interest;
        yearlyInterest += interest;
        yearlyPrincipal += principalPaid;
        balance -= principalPaid;
      }
      breakdown.push({ year, principal: Math.round(yearlyPrincipal), interest: Math.round(yearlyInterest), balance: Math.max(0, Math.round(balance)) });
      if (balance <= 0) break;
    }
    return breakdown;
  };

  const title = bankName ? `${bankName} Home Loan Calculator` : 'Home Loan Calculator';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">{title}</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-orange-200 flex-shrink-0">🏠</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">{title} (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your {bankName ? `${bankName} ` : ''}home loan EMI with detailed amortization schedule.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-orange-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" /></span>
          ₹25L @ 8.5% for 20 yrs → EMI {formatCurrency(monthlyEMI)}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Loan Details</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Loan Amount" value={loanAmount} min={500000} max={50000000} step={100000} prefix="₹" color="blue" onChange={setLoanAmount} formatDisplay={(v) => formatLakh(v)} />
                <SIPSlider label="Interest Rate (p.a.)" value={interestRate} min={6} max={15} step={0.05} suffix="%" color="amber" onChange={setInterestRate} formatDisplay={(v) => `${v}%`} />
                <SIPSlider label="Loan Tenure" value={loanTenure} min={5} max={30} step={1} suffix=" yrs" color="emerald" onChange={setLoanTenure} formatDisplay={(v) => `${v} year${v > 1 ? 's' : ''}`} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">Monthly EMI</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(monthlyEMI)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Principal Amount</span><span className="text-sm font-bold text-gray-800">{formatCurrency(loanAmount)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Interest</span><span className="text-sm font-bold text-orange-600">{formatCurrency(totalInterest)}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Amount Payable</span><span className="text-sm font-bold text-gray-800">{formatCurrency(totalAmount)}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <button onClick={() => setShowBreakdown(!showBreakdown)} className="w-full flex justify-between items-center px-4 md:px-5 py-4 text-left">
                <h3 className="text-sm font-bold text-gray-900">Year-wise Payment Breakdown</h3>
                <span className="text-lg text-gray-400">{showBreakdown ? '−' : '+'}</span>
              </button>
              {showBreakdown && (
                <div className="px-4 md:px-5 pb-4 max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0"><tr><th className="px-2 py-2 text-left font-semibold text-gray-600">Year</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Principal</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Interest</th><th className="px-2 py-2 text-right font-semibold text-gray-600">Balance</th></tr></thead>
                    <tbody>{generateBreakdown().map((row) => (
                      <tr key={row.year} className="border-b border-gray-50"><td className="px-2 py-2 font-medium">{row.year}</td><td className="px-2 py-2 text-right text-emerald-600">{formatCurrency(row.principal)}</td><td className="px-2 py-2 text-right text-orange-600">{formatCurrency(row.interest)}</td><td className="px-2 py-2 text-right font-bold">{formatCurrency(row.balance)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>

            {!bankName && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-4 md:px-5 pt-4 pb-2"><h3 className="text-sm font-bold text-gray-900">Bank-wise Home Loan Calculators</h3></div>
                <div className="grid grid-cols-2 gap-x-4 px-4 md:px-5 pb-4">
                  {homeLoanBanks.map((bank) => (
                    <Link key={bank.slug} href={`/calculator/${bank.slug}-home-loan-calculator`} className="block py-2.5 text-xs text-gray-600 hover:text-emerald-600 border-b border-gray-50 font-medium transition-colors">{bank.name}</Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">EMI calculations assume a fixed interest rate. Actual EMI may vary based on floating rate changes, processing fees, and lender terms.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
