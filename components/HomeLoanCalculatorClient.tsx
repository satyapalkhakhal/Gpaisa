'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { homeLoanBanks } from '@/lib/homeLoanBankData';

type HomeLoanCalculatorClientProps = {
    bankName?: string;
    defaultInterestRate?: number;
};

export default function HomeLoanCalculatorClient({
    bankName,
    defaultInterestRate = 8.5
}: HomeLoanCalculatorClientProps = {}) {
    // Input states
    const [loanAmount, setLoanAmount] = useState(2500000); // ₹25 lakhs
    const [interestRate, setInterestRate] = useState(defaultInterestRate);
    const [loanTenure, setLoanTenure] = useState(20); // 20 years

    // Result states
    const [monthlyEMI, setMonthlyEMI] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(false);

    // Calculate EMI
    const calculateEMI = () => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 12 / 100;
        const tenureMonths = loanTenure * 12;

        if (principal > 0 && monthlyRate > 0 && tenureMonths > 0) {
            const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);

            const total = emi * tenureMonths;
            const interest = total - principal;

            setMonthlyEMI(Math.round(emi));
            setTotalInterest(Math.round(interest));
            setTotalAmount(Math.round(total));
        }
    };

    useEffect(() => {
        calculateEMI();
    }, [loanAmount, interestRate, loanTenure]);

    // Generate year-wise breakdown
    const generateBreakdown = () => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 12 / 100;
        const tenureMonths = loanTenure * 12;
        const breakdown = [];
        let balance = principal;

        for (let year = 1; year <= loanTenure; year++) {
            let yearlyPrincipal = 0;
            let yearlyInterest = 0;

            for (let month = 1; month <= 12; month++) {
                const interest = balance * monthlyRate;
                const principalPaid = monthlyEMI - interest;

                yearlyInterest += interest;
                yearlyPrincipal += principalPaid;
                balance -= principalPaid;
            }

            breakdown.push({
                year,
                principal: Math.round(yearlyPrincipal),
                interest: Math.round(yearlyInterest),
                balance: Math.max(0, Math.round(balance)),
            });

            if (balance <= 0) break;
        }

        return breakdown;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const principalPercentage = (loanAmount / totalAmount) * 100;
    const interestPercentage = (totalInterest / totalAmount) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">
                            {bankName ? `${bankName} Home Loan Calculator` : 'Home Loan Calculator'}
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        {bankName ? `${bankName} Home Loan Calculator` : 'Home Loan Calculator'}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate your {bankName ? `${bankName} ` : ''}home loan EMI with our free calculator.
                        Get instant EMI calculation with detailed amortization schedule.
                    </p>
                </div>

                {/* Main Calculator */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Input Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>

                        {/* Loan Amount */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(loanAmount)}</span>
                            </div>
                            <input
                                type="range"
                                min="500000"
                                max="50000000"
                                step="100000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹5L</span>
                                <span>₹5Cr</span>
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                                <span className="text-lg font-bold text-primary-600">{interestRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="6"
                                max="15"
                                step="0.05"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>6%</span>
                                <span>15%</span>
                            </div>
                        </div>

                        {/* Loan Tenure */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Loan Tenure (Years)</label>
                                <span className="text-lg font-bold text-primary-600">{loanTenure} Years</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="30"
                                step="1"
                                value={loanTenure}
                                onChange={(e) => setLoanTenure(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5 Yrs</span>
                                <span>30 Yrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">EMI Summary</h2>

                        {/* Monthly EMI */}
                        <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Monthly EMI</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(monthlyEMI)}</div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Principal Amount</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Total Interest</span>
                                <span className="text-lg font-bold text-orange-600">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Total Amount Payable</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>

                        {/* Visual Breakdown */}
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Payment Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${principalPercentage}%` }}
                                >
                                    {principalPercentage.toFixed(1)}%
                                </div>
                                <div
                                    className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${interestPercentage}%` }}
                                >
                                    {interestPercentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-primary-500 rounded"></span>
                                    Principal
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-orange-500 rounded"></span>
                                    Interest
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year-wise Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="w-full flex justify-between items-center text-left"
                    >
                        <h3 className="text-xl font-bold text-gray-900">Year-wise Payment Breakdown</h3>
                        <span className="text-2xl text-primary-600">{showBreakdown ? '−' : '+'}</span>
                    </button>

                    {showBreakdown && (
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Principal Paid</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Interest Paid</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateBreakdown().map((row) => (
                                        <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{row.year}</td>
                                            <td className="py-3 px-4 text-right text-primary-600">{formatCurrency(row.principal)}</td>
                                            <td className="py-3 px-4 text-right text-orange-600">{formatCurrency(row.interest)}</td>
                                            <td className="py-3 px-4 text-right font-medium">{formatCurrency(row.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Bank-wise Home Loan Calculators - Table Style List */}
                {!bankName && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Bank-wise Home Loan Calculators</h3>
                        <div className="grid md:grid-cols-2 gap-x-8">
                            {homeLoanBanks.map((bank) => (
                                <Link
                                    key={bank.slug}
                                    href={`/calculator/${bank.slug}-home-loan-calculator`}
                                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors border-b border-gray-100 font-medium"
                                >
                                    {bank.name} Home Loan Calculator
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Calculators */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-5 gap-4">
                        <Link
                            href="/calculator/sip"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📈</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">SIP Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate SIP returns</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/calculator/ppf"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">💰</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">PPF Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate PPF returns</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/calculator/swp"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">💸</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">SWP Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate SWP returns</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/calculator/epf"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🏦</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">EPF Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate EPF returns</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/calculator/emi"
                            className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🧮</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">EMI Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate loan EMI</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
