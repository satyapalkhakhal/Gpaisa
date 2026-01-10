'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FDCalculatorClient() {
    const [principal, setPrincipal] = useState(100000);
    const [interestRate, setInterestRate] = useState(7);
    const [tenure, setTenure] = useState(5);
    const [compoundingFrequency, setCompoundingFrequency] = useState<'quarterly' | 'monthly' | 'yearly'>('quarterly');

    const [maturityAmount, setMaturityAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    const calculateFD = () => {
        let n = 4; // Quarterly by default
        if (compoundingFrequency === 'monthly') n = 12;
        if (compoundingFrequency === 'yearly') n = 1;

        const r = interestRate / 100;
        const t = tenure;

        const amount = principal * Math.pow(1 + r / n, n * t);
        const interest = amount - principal;

        setMaturityAmount(amount);
        setTotalInterest(interest);
    };

    useEffect(() => {
        calculateFD();
    }, [principal, interestRate, tenure, compoundingFrequency]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">FD Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        FD Calculator - Fixed Deposit Calculator
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate Fixed Deposit (FD) maturity amount and interest earned.
                        Plan your FD investments with accurate returns calculation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">FD Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Deposit Amount</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(principal)}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="10000000"
                                step="10000"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹10K</span>
                                <span>₹1Cr</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                                <span className="text-lg font-bold text-primary-600">{interestRate}%</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="12"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>3%</span>
                                <span>12%</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Tenure (Years)</label>
                                <span className="text-lg font-bold text-primary-600">{tenure} Years</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>10 Years</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block">Compounding Frequency</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                                    <button
                                        key={freq}
                                        onClick={() => setCompoundingFrequency(freq)}
                                        className={`py-3 px-4 rounded-lg font-medium transition-all capitalize ${compoundingFrequency === freq
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {freq}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">💡 FD Interest Rates</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li><strong>SBI:</strong> 6.5% - 7.5%</li>
                                <li><strong>HDFC:</strong> 7.0% - 7.75%</li>
                                <li><strong>ICICI:</strong> 7.0% - 7.8%</li>
                                <li><strong>Senior Citizens:</strong> +0.5% extra</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Maturity Details</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Maturity Amount</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(maturityAmount)}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Principal Amount</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(principal)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Total Interest</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Maturity Value</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(maturityAmount)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Amount Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(principal / maturityAmount) * 100}%` }}
                                >
                                    Principal
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(totalInterest / maturityAmount) * 100}%` }}
                                >
                                    Interest
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About FD Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            A Fixed Deposit (FD) is a safe investment option offered by banks where you deposit a lump sum
                            for a fixed tenure at a predetermined interest rate. Our FD calculator helps you calculate the
                            maturity amount and interest earned on your fixed deposit.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">FD Calculation Formula:</h4>
                        <p className="mb-4">
                            Maturity Amount = P × (1 + r/n)^(n×t)
                            <br />Where: P = Principal, r = Interest Rate, n = Compounding Frequency, t = Time in years
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Benefits of Fixed Deposits:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Guaranteed returns with no market risk</li>
                            <li>Higher interest rates for senior citizens</li>
                            <li>Flexible tenure from 7 days to 10 years</li>
                            <li>Loan facility against FD</li>
                            <li>Tax-saving FDs available under Section 80C</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/sip" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="font-bold text-gray-900">SIP Calculator</div>
                        </Link>
                        <Link href="/calculator/ppf" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">PPF Calculator</div>
                        </Link>
                        <Link href="/calculator/nps" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💼</div>
                            <div className="font-bold text-gray-900">NPS Calculator</div>
                        </Link>
                        <Link href="/calculator/cagr" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-bold text-gray-900">CAGR Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
