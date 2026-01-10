'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CAGRCalculatorClient() {
    const [initialValue, setInitialValue] = useState(100000);
    const [finalValue, setFinalValue] = useState(200000);
    const [duration, setDuration] = useState(5);
    const [cagr, setCagr] = useState(0);
    const [totalGrowth, setTotalGrowth] = useState(0);
    const [absoluteReturn, setAbsoluteReturn] = useState(0);

    const calculateCAGR = () => {
        if (initialValue > 0 && finalValue > 0 && duration > 0) {
            const cagrValue = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
            const growth = ((finalValue - initialValue) / initialValue) * 100;
            const absReturn = finalValue - initialValue;

            setCagr(cagrValue);
            setTotalGrowth(growth);
            setAbsoluteReturn(absReturn);
        }
    };

    useEffect(() => {
        calculateCAGR();
    }, [initialValue, finalValue, duration]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const generateYearlyBreakdown = () => {
        const breakdown = [];
        let currentValue = initialValue;

        for (let year = 0; year <= duration; year++) {
            breakdown.push({
                year,
                value: year === 0 ? initialValue : currentValue,
                growth: year === 0 ? 0 : currentValue - initialValue,
            });
            currentValue = initialValue * Math.pow(1 + cagr / 100, year + 1);
        }

        return breakdown;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">CAGR Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        CAGR Calculator - Compound Annual Growth Rate
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate Compound Annual Growth Rate (CAGR) for your investments.
                        Measure the mean annual growth rate of your investment over a specified period.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Initial Investment</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(initialValue)}</span>
                            </div>
                            <input
                                type="number"
                                value={initialValue}
                                onChange={(e) => setInitialValue(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Final Value</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(finalValue)}</span>
                            </div>
                            <input
                                type="number"
                                value={finalValue}
                                onChange={(e) => setFinalValue(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Duration (Years)</label>
                                <span className="text-lg font-bold text-primary-600">{duration} Years</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>30 Years</span>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">📊 What is CAGR?</h3>
                            <p className="text-sm text-purple-800">
                                CAGR shows the rate at which an investment would have grown if it grew at a steady rate.
                                It&apos;s useful for comparing different investments over time.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">CAGR</div>
                            <div className="text-4xl font-bold text-primary-600">{cagr.toFixed(2)}%</div>
                            <div className="text-xs text-gray-500 mt-1">Per Annum</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Initial Investment</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(initialValue)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Final Value</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(finalValue)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Absolute Return</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(absoluteReturn)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-gray-700 font-medium">Total Growth</span>
                                <span className="text-lg font-bold text-blue-600">{totalGrowth.toFixed(2)}%</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Growth Visualization</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(initialValue / finalValue) * 100}%` }}
                                >
                                    Initial
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(absoluteReturn / finalValue) * 100}%` }}
                                >
                                    Growth
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About CAGR Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            The Compound Annual Growth Rate (CAGR) calculator helps you determine the mean annual growth rate
                            of an investment over a specified time period. CAGR is one of the most accurate ways to calculate
                            returns for individual assets, investment portfolios, and anything that can rise or fall in value over time.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">CAGR Formula:</h4>
                        <p className="mb-4">
                            CAGR = (Final Value / Initial Value)^(1 / Number of Years) - 1
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Why Use CAGR?</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Compare different investments with varying time periods</li>
                            <li>Smooth out volatility to show steady growth rate</li>
                            <li>Evaluate mutual fund performance</li>
                            <li>Assess business revenue growth</li>
                            <li>Track portfolio performance over time</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Financial Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/sip" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="font-bold text-gray-900">SIP Calculator</div>
                        </Link>
                        <Link href="/calculator/fd" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">FD Calculator</div>
                        </Link>
                        <Link href="/calculator/nps" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💼</div>
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
