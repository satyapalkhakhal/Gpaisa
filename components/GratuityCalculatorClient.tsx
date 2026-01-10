'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GratuityCalculatorClient() {
    const [lastSalary, setLastSalary] = useState(50000);
    const [yearsOfService, setYearsOfService] = useState(10);
    const [isCovered, setIsCovered] = useState(true); // Covered under Gratuity Act

    const [gratuityAmount, setGratuityAmount] = useState(0);

    const calculateGratuity = () => {
        // Formula: (Last Salary × Years of Service × 15) / 26 (for covered employees)
        // Formula: (Last Salary × Years of Service × 15) / 30 (for non-covered employees)
        const divisor = isCovered ? 26 : 30;
        const amount = (lastSalary * yearsOfService * 15) / divisor;

        // Maximum gratuity limit is ₹20 lakhs
        const finalAmount = Math.min(amount, 2000000);

        setGratuityAmount(finalAmount);
    };

    useEffect(() => {
        calculateGratuity();
    }, [lastSalary, yearsOfService, isCovered]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">Gratuity Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Gratuity Calculator - Calculate Gratuity Amount
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate your gratuity amount as per the Payment of Gratuity Act, 1972.
                        Find out how much gratuity you&apos;ll receive on retirement or resignation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Employment Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Last Drawn Salary (Monthly)</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(lastSalary)}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="200000"
                                step="5000"
                                value={lastSalary}
                                onChange={(e) => setLastSalary(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹10K</span>
                                <span>₹2L</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Years of Service</label>
                                <span className="text-lg font-bold text-primary-600">{yearsOfService} Years</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="40"
                                value={yearsOfService}
                                onChange={(e) => setYearsOfService(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5 Years</span>
                                <span>40 Years</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block">Employee Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsCovered(true)}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${isCovered
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Covered (÷26)
                                </button>
                                <button
                                    onClick={() => setIsCovered(false)}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${!isCovered
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Not Covered (÷30)
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Covered: Under Payment of Gratuity Act, 1972
                            </p>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-amber-900 mb-2">📋 Eligibility</h3>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>✓ Minimum 5 years of service required</li>
                                <li>✓ Maximum gratuity: ₹20 lakhs</li>
                                <li>✓ Tax-free up to ₹20 lakhs</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gratuity Amount</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Total Gratuity</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(gratuityAmount)}</div>
                            <div className="text-xs text-gray-500 mt-1">Tax Free</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Last Salary</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(lastSalary)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Years of Service</span>
                                <span className="text-lg font-bold text-gray-900">{yearsOfService} Years</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Gratuity Amount</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(gratuityAmount)}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-green-900 mb-2">💰 Tax Benefit</h3>
                            <p className="text-sm text-amber-800">Gratuity up to ₹20 lakhs is completely tax-free under Income Tax Act.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About Gratuity Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            Gratuity is a lump sum payment made by an employer to an employee as a token of appreciation
                            for services rendered. It is governed by the Payment of Gratuity Act, 1972.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Gratuity Calculation Formula:</h4>
                        <p className="mb-4">
                            <strong>For employees covered under the Act:</strong><br />
                            Gratuity = (Last Salary × Years of Service × 15) / 26
                        </p>
                        <p className="mb-4">
                            <strong>For employees not covered:</strong><br />
                            Gratuity = (Last Salary × Years of Service × 15) / 30
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Key Points:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Minimum 5 years of continuous service required</li>
                            <li>Maximum gratuity amount is ₹20 lakhs</li>
                            <li>Completely tax-free up to ₹20 lakhs</li>
                            <li>Payable on retirement, resignation, death, or disability</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Employment Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/hra" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏠</div>
                            <div className="font-bold text-gray-900">HRA Calculator</div>
                        </Link>
                        <Link href="/calculator/epf" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">EPF Calculator</div>
                        </Link>
                        <Link href="/calculator/nps" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">NPS Calculator</div>
                        </Link>
                        <Link href="/calculator/gst" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🧾</div>
                            <div className="font-bold text-gray-900">GST Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
