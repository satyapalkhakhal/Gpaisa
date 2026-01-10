'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NPSCalculatorClient() {
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [expectedReturn, setExpectedReturn] = useState(10);

    const [totalInvestment, setTotalInvestment] = useState(0);
    const [wealthGained, setWealthGained] = useState(0);
    const [maturityValue, setMaturityValue] = useState(0);
    const [annuityAmount, setAnnuityAmount] = useState(0);
    const [lumpsum, setLumpsum] = useState(0);

    const calculateNPS = () => {
        const years = retirementAge - currentAge;
        const months = years * 12;
        const monthlyRate = expectedReturn / 12 / 100;

        // Future value of annuity
        const fv = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const invested = monthlyContribution * months;
        const wealth = fv - invested;

        // At maturity, 60% must be used for annuity, 40% can be withdrawn
        const annuity = fv * 0.6;
        const lump = fv * 0.4;

        setTotalInvestment(invested);
        setWealthGained(wealth);
        setMaturityValue(fv);
        setAnnuityAmount(annuity);
        setLumpsum(lump);
    };

    useEffect(() => {
        calculateNPS();
    }, [monthlyContribution, currentAge, retirementAge, expectedReturn]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">NPS Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        NPS Calculator - National Pension System Calculator
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate your National Pension System (NPS) returns and retirement corpus.
                        Plan your retirement with NPS investment calculator.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">NPS Investment Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Monthly Contribution</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(monthlyContribution)}</span>
                            </div>
                            <input
                                type="range"
                                min="500"
                                max="50000"
                                step="500"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹500</span>
                                <span>₹50,000</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Current Age</label>
                                <span className="text-lg font-bold text-primary-600">{currentAge} Years</span>
                            </div>
                            <input
                                type="range"
                                min="18"
                                max="60"
                                value={currentAge}
                                onChange={(e) => setCurrentAge(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>18</span>
                                <span>60</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Retirement Age</label>
                                <span className="text-lg font-bold text-primary-600">{retirementAge} Years</span>
                            </div>
                            <input
                                type="range"
                                min="60"
                                max="70"
                                value={retirementAge}
                                onChange={(e) => setRetirementAge(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>60</span>
                                <span>70</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Expected Return (p.a.)</label>
                                <span className="text-lg font-bold text-primary-600">{expectedReturn}%</span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="14"
                                step="0.5"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>8%</span>
                                <span>14%</span>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <h3 className="font-semibold text-indigo-900 mb-2">💡 NPS Benefits</h3>
                            <ul className="text-sm text-indigo-800 space-y-1">
                                <li>✓ Tax deduction up to ₹2 lakh under 80CCD</li>
                                <li>✓ Low cost pension scheme</li>
                                <li>✓ Regulated by PFRDA</li>
                                <li>✓ Flexible investment options</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Retirement Corpus</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Total Maturity Value</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(maturityValue)}</div>
                            <div className="text-xs text-gray-500 mt-1">At age {retirementAge}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Total Investment</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(totalInvestment)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Wealth Gained</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(wealthGained)}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-3">Withdrawal Options at Maturity</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-800">Annuity (60% - Mandatory)</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(annuityAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-800">Lumpsum (40% - Optional)</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(lumpsum)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Corpus Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(totalInvestment / maturityValue) * 100}%` }}
                                >
                                    Investment
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(wealthGained / maturityValue) * 100}%` }}
                                >
                                    Returns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About NPS Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            National Pension System (NPS) is a government-sponsored pension scheme that helps you build a
                            retirement corpus. It offers tax benefits and market-linked returns, making it an attractive
                            long-term investment option.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Key Features of NPS:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Tax deduction up to ₹1.5 lakh under Section 80C</li>
                            <li>Additional ₹50,000 deduction under Section 80CCD(1B)</li>
                            <li>Low fund management charges (0.01% to 0.25%)</li>
                            <li>Choice between Active and Auto mode</li>
                            <li>Portable across jobs and locations</li>
                            <li>Regulated by PFRDA for safety</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Retirement Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/ppf" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">PPF Calculator</div>
                        </Link>
                        <Link href="/calculator/epf" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">EPF Calculator</div>
                        </Link>
                        <Link href="/calculator/fd" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-bold text-gray-900">FD Calculator</div>
                        </Link>
                        <Link href="/calculator/sip" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="font-bold text-gray-900">SIP Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
