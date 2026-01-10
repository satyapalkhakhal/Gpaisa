'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SimpleInterestCalculatorClient() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(8);
    const [time, setTime] = useState(3);

    const [simpleInterest, setSimpleInterest] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const calculateSI = () => {
        const si = (principal * rate * time) / 100;
        const total = principal + si;

        setSimpleInterest(si);
        setTotalAmount(total);
    };

    useEffect(() => {
        calculateSI();
    }, [principal, rate, time]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">Simple Interest Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Simple Interest Calculator - Calculate SI Online
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate simple interest on loans and deposits. Find out interest amount and total payable with our free SI calculator.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan/Deposit Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Principal Amount</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(principal)}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="1000000"
                                step="10000"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹10K</span>
                                <span>₹10L</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                                <span className="text-lg font-bold text-primary-600">{rate}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1%</span>
                                <span>20%</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
                                <span className="text-lg font-bold text-primary-600">{time} Years</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={time}
                                onChange={(e) => setTime(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>30 Years</span>
                            </div>
                        </div>

                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                            <h3 className="font-semibold text-teal-900 mb-2">📐 Formula</h3>
                            <p className="text-sm text-teal-800 font-mono">
                                SI = (P × R × T) / 100
                            </p>
                            <p className="text-xs text-teal-700 mt-2">
                                P = Principal, R = Rate, T = Time
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Interest Calculation</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Simple Interest</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(simpleInterest)}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Principal Amount</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(principal)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Interest Earned</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(simpleInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Total Amount</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Amount Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(principal / totalAmount) * 100}%` }}
                                >
                                    Principal
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(simpleInterest / totalAmount) * 100}%` }}
                                >
                                    Interest
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About Simple Interest Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            Simple Interest (SI) is a quick method of calculating interest on a loan or deposit.
                            Unlike compound interest, simple interest is calculated only on the principal amount.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Simple Interest Formula:</h4>
                        <p className="mb-4">
                            SI = (Principal × Rate × Time) / 100<br />
                            Total Amount = Principal + Simple Interest
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">When is Simple Interest Used?</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Personal loans and car loans</li>
                            <li>Short-term deposits</li>
                            <li>Government bonds</li>
                            <li>Certificate of deposits (CDs)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Interest Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/fd" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">FD Calculator</div>
                        </Link>
                        <Link href="/calculator/home-loan" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏠</div>
                            <div className="font-bold text-gray-900">Home Loan</div>
                        </Link>
                        <Link href="/calculator/emi" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🧮</div>
                            <div className="font-bold text-gray-900">EMI Calculator</div>
                        </Link>
                        <Link href="/calculator/ppf" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">PPF Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
