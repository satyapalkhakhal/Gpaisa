'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MutualFundCalculatorClient() {
    const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('sip');
    const [amount, setAmount] = useState(10000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);

    const [investedAmount, setInvestedAmount] = useState(0);
    const [estimatedReturns, setEstimatedReturns] = useState(0);
    const [totalValue, setTotalValue] = useState(0);

    const calculateReturns = () => {
        if (investmentType === 'sip') {
            // SIP calculation
            const monthlyRate = expectedReturn / 12 / 100;
            const months = timePeriod * 12;

            const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            const invested = amount * months;
            const returns = futureValue - invested;

            setInvestedAmount(invested);
            setEstimatedReturns(returns);
            setTotalValue(futureValue);
        } else {
            // Lumpsum calculation
            const futureValue = amount * Math.pow(1 + expectedReturn / 100, timePeriod);
            const returns = futureValue - amount;

            setInvestedAmount(amount);
            setEstimatedReturns(returns);
            setTotalValue(futureValue);
        }
    };

    useEffect(() => {
        calculateReturns();
    }, [investmentType, amount, expectedReturn, timePeriod]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">Mutual Fund Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Mutual Fund Returns Calculator
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate mutual fund returns for SIP and lumpsum investments.
                        Plan your mutual fund investments with accurate return projections.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Details</h2>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block">Investment Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setInvestmentType('sip')}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${investmentType === 'sip'
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    SIP (Monthly)
                                </button>
                                <button
                                    onClick={() => setInvestmentType('lumpsum')}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${investmentType === 'lumpsum'
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Lumpsum
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {investmentType === 'sip' ? 'Monthly Investment' : 'Lumpsum Amount'}
                                </label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(amount)}</span>
                            </div>
                            <input
                                type="range"
                                min={investmentType === 'sip' ? '500' : '10000'}
                                max={investmentType === 'sip' ? '100000' : '10000000'}
                                step={investmentType === 'sip' ? '500' : '10000'}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{investmentType === 'sip' ? '₹500' : '₹10K'}</span>
                                <span>{investmentType === 'sip' ? '₹1L' : '₹1Cr'}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Expected Return (p.a.)</label>
                                <span className="text-lg font-bold text-primary-600">{expectedReturn}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="0.5"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1%</span>
                                <span>30%</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
                                <span className="text-lg font-bold text-primary-600">{timePeriod} Years</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="40"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 Year</span>
                                <span>40 Years</span>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <h3 className="font-semibold text-emerald-900 mb-2">💡 Mutual Fund Returns</h3>
                            <ul className="text-sm text-emerald-800 space-y-1">
                                <li><strong>Equity Funds:</strong> 12-15% p.a.</li>
                                <li><strong>Debt Funds:</strong> 7-9% p.a.</li>
                                <li><strong>Hybrid Funds:</strong> 10-12% p.a.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Returns</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Total Value</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(totalValue)}</div>
                            <div className="text-xs text-gray-500 mt-1">After {timePeriod} years</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Invested Amount</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(investedAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Estimated Returns</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(estimatedReturns)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Total Value</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(totalValue)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Wealth Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(investedAmount / totalValue) * 100}%` }}
                                >
                                    Invested
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(estimatedReturns / totalValue) * 100}%` }}
                                >
                                    Returns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About Mutual Fund Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            Mutual funds are investment vehicles that pool money from multiple investors to invest in stocks,
                            bonds, or other securities. Our calculator helps you estimate returns for both SIP and lumpsum investments.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">Types of Mutual Funds:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Equity Funds:</strong> Invest primarily in stocks, higher risk, higher returns (12-15% p.a.)</li>
                            <li><strong>Debt Funds:</strong> Invest in bonds and fixed income, lower risk (7-9% p.a.)</li>
                            <li><strong>Hybrid Funds:</strong> Mix of equity and debt, balanced risk-return (10-12% p.a.)</li>
                            <li><strong>Index Funds:</strong> Track market indices like Nifty 50, Sensex</li>
                        </ul>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 mt-4">SIP vs Lumpsum:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>SIP:</strong> Regular monthly investments, rupee cost averaging, disciplined investing</li>
                            <li><strong>Lumpsum:</strong> One-time investment, suitable for large amounts, market timing matters</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Investment Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/sip" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📈</div>
                            <div className="font-bold text-gray-900">SIP Calculator</div>
                        </Link>
                        <Link href="/calculator/cagr" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">📊</div>
                            <div className="font-bold text-gray-900">CAGR Calculator</div>
                        </Link>
                        <Link href="/calculator/fd" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">FD Calculator</div>
                        </Link>
                        <Link href="/calculator/ppf" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">PPF Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
