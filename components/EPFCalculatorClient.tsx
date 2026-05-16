'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SIPSlider from '@/components/sip/SIPSlider';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export type EPFYearRow = {
  year: number;
  age: number;
  basicSalary: number;
  employeeContrib: number;
  employerContrib: number;
  interest: number;
  closingBalance: number;
};

type Props = {
  initialMaturity?: number;
  initialTotalContrib?: number;
  initialTotalInterest?: number;
  initialPension?: number;
};

export default function EPFCalculatorClient({
  initialMaturity = 0,
  initialTotalContrib = 0,
  initialTotalInterest = 0,
  initialPension = 0,
}: Props = {}) {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentEPFBalance, setCurrentEPFBalance] = useState(0);
  const [salaryIncrement, setSalaryIncrement] = useState(5);

  const epfRate = 8.25;
  const employeeContribution = 12;
  const employerContribution = 12;

  // Pre-initialised with server-computed defaults — no ₹0 flash on first render
  const [maturityAmount, setMaturityAmount] = useState(initialMaturity);
  const [totalContribution, setTotalContribution] = useState(initialTotalContrib);
  const [totalInterest, setTotalInterest] = useState(initialTotalInterest);
  const [pensionAmount, setPensionAmount] = useState(initialPension);

  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    let balance = currentEPFBalance;
    let salary = basicSalary;
    let totalContrib = 0;

    for (let year = 0; year < yearsToRetirement; year++) {
      const employeeMonthly = (salary * employeeContribution) / 100;
      const employerMonthly = (salary * employerContribution) / 100;
      const totalMonthly = employeeMonthly + employerMonthly;
      const annualContribution = totalMonthly * 12;
      totalContrib += annualContribution;
      balance += annualContribution;
      balance += (balance * epfRate) / 100;
      salary = salary * (1 + salaryIncrement / 100);
    }

    setMaturityAmount(balance);
    setTotalContribution(totalContrib + currentEPFBalance);
    setTotalInterest(balance - totalContrib - currentEPFBalance);
    const pensionableSalary = Math.min(basicSalary, 15000);
    setPensionAmount((pensionableSalary * yearsToRetirement) / 70);
  }, [basicSalary, currentAge, retirementAge, currentEPFBalance, salaryIncrement]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3">
          <nav className="flex text-sm" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1.5 text-xs md:text-sm">
              <li><Link href="/" className="text-gray-400 active:text-primary-600 transition-colors">Home</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><Link href="/calculator" className="text-gray-400 active:text-primary-600 transition-colors">Calculator</Link></li>
              <li className="flex items-center"><svg className="w-3.5 h-3.5 text-gray-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg><span className="text-gray-900 font-semibold">EPF Calculator</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 md:pt-8 pb-1">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-lg md:text-xl shadow-lg shadow-emerald-200 flex-shrink-0">🏛️</div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">EPF Calculator India (2026)</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 max-w-2xl">Calculate your EPF maturity amount, interest earned, and estimated pension at retirement.</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded-full ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          Current EPF Rate: {epfRate}% p.a. (guaranteed)
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-6">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-2 mb-5 lg:mb-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-5">Calculate Your EPF Returns</h2>
              <div className="space-y-5 md:space-y-6">
                <SIPSlider label="Basic Salary (Monthly)" value={basicSalary} min={10000} max={200000} step={5000} prefix="₹" color="blue" onChange={setBasicSalary} formatDisplay={(v) => formatCurrency(v)} />
                <SIPSlider label="Current Age" value={currentAge} min={18} max={55} step={1} suffix=" yrs" color="emerald" onChange={setCurrentAge} formatDisplay={(v) => `${v} years`} />
                <SIPSlider label="Retirement Age" value={retirementAge} min={55} max={65} step={1} suffix=" yrs" color="amber" onChange={setRetirementAge} formatDisplay={(v) => `${v} years`} />
                <SIPSlider label="Annual Salary Increment" value={salaryIncrement} min={0} max={15} step={0.5} suffix="%" color="blue" onChange={setSalaryIncrement} formatDisplay={(v) => `${v}%`} />
              </div>

              <div className="mt-5">
                <label className="text-[13px] font-semibold text-gray-500 block mb-1.5">Current EPF Balance</label>
                <input type="number" value={currentEPFBalance} onChange={(e) => setCurrentEPFBalance(Number(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none" placeholder="₹0" />
              </div>

              <div className="hidden lg:block mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-3">📊 Contribution Breakdown</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between"><span>Employee (12%):</span><span className="font-semibold">{formatCurrency((basicSalary * 12) / 100)}/mo</span></div>
                  <div className="flex justify-between"><span>Employer (12%):</span><span className="font-semibold">{formatCurrency((basicSalary * 12) / 100)}/mo</span></div>
                  <div className="flex justify-between pt-2 border-t border-gray-100"><span className="font-bold">Total Monthly:</span><span className="font-bold text-emerald-600">{formatCurrency((basicSalary * 24) / 100)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Total Contribution</span><span className="text-sm font-bold text-gray-800">{formatCurrency(Math.round(totalContribution))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Interest Earned @ {epfRate}%</span><span className="text-sm font-bold text-emerald-600">{formatCurrency(Math.round(totalInterest))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-4 bg-gray-50/50"><span className="text-base font-semibold text-gray-900">EPF Maturity</span><span className="text-lg font-extrabold text-gray-900">{formatCurrency(Math.round(maturityAmount))}</span></div>
                <div className="flex items-center justify-between px-4 md:px-5 py-3.5"><span className="text-sm text-gray-500">Est. Monthly Pension (EPS)</span><span className="text-sm font-bold text-blue-600">{formatCurrency(Math.round(pensionAmount))}</span></div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 md:p-5 border border-amber-200">
              <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><h3 className="text-sm font-bold text-gray-900 mb-1">Important Disclaimer</h3><p className="text-xs md:text-sm text-gray-600 leading-relaxed">EPF calculations assume consistent contributions and current interest rate ({epfRate}% p.a.). Actual returns may vary based on rate revisions by EPFO.</p></div></div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-4 md:px-6 py-4 md:py-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">What is EPF?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong>Employees&apos; Provident Fund (EPF)</strong> is a retirement savings scheme for salaried employees in India. Both employee and employer contribute 12% of basic salary monthly. EPF offers guaranteed returns (currently {epfRate}% p.a.) and is completely tax-free at maturity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
