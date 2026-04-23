'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { banks } from '@/lib/bankData';

type SIPCalculatorClientProps = {
    bankName?: string;
};

export default function SIPCalculatorClient({ bankName }: SIPCalculatorClientProps = {}) {
    // Calculator state
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);
    const [stepUpPercentage, setStepUpPercentage] = useState(0);
    const [calculatorType, setCalculatorType] = useState<'regular' | 'stepup' | 'lumpsum'>('regular');
    const [lumpSumAmount, setLumpSumAmount] = useState(100000);

    // Results state
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [estimatedReturns, setEstimatedReturns] = useState(0);
    const [totalValue, setTotalValue] = useState(0);

    // Calculate SIP returns
    useEffect(() => {
        if (calculatorType === 'lumpsum') {
            calculateLumpSum();
        } else if (calculatorType === 'stepup') {
            calculateStepUpSIP();
        } else {
            calculateRegularSIP();
        }
    }, [monthlyInvestment, expectedReturn, timePeriod, stepUpPercentage, calculatorType, lumpSumAmount]);

    const calculateRegularSIP = () => {
        const monthlyRate = expectedReturn / 12 / 100;
        const months = timePeriod * 12;

        const futureValue = monthlyInvestment *
            (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

        const invested = monthlyInvestment * months;
        const returns = futureValue - invested;

        setTotalInvestment(Math.round(invested));
        setEstimatedReturns(Math.round(returns));
        setTotalValue(Math.round(futureValue));
    };

    const calculateStepUpSIP = () => {
        const monthlyRate = expectedReturn / 12 / 100;
        const months = timePeriod * 12;
        let totalInvested = 0;
        let futureValue = 0;
        let currentSIP = monthlyInvestment;

        for (let year = 0; year < timePeriod; year++) {
            const yearMonths = 12;
            for (let month = 0; month < yearMonths; month++) {
                totalInvested += currentSIP;
                const remainingMonths = months - (year * 12 + month);
                futureValue += currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
            }
            currentSIP = currentSIP * (1 + stepUpPercentage / 100);
        }

        const returns = futureValue - totalInvested;

        setTotalInvestment(Math.round(totalInvested));
        setEstimatedReturns(Math.round(returns));
        setTotalValue(Math.round(futureValue));
    };

    const calculateLumpSum = () => {
        const years = timePeriod;
        const futureValue = lumpSumAmount * Math.pow(1 + expectedReturn / 100, years);
        const returns = futureValue - lumpSumAmount;

        setTotalInvestment(lumpSumAmount);
        setEstimatedReturns(Math.round(returns));
        setTotalValue(Math.round(futureValue));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex text-sm" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-2">
                            <li>
                                <Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <Link href="/calculator" className="text-gray-500 hover:text-primary-600">Calculator</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-900 font-medium">SIP Calculator</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* H1 + Hook Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                SIP Calculator India (2026) – Calculate Returns & Plan Investments
              </h1>

              <p className="text-lg text-gray-700">
                Estimate your SIP returns instantly and plan your wealth growth using our advanced calculator.
              </p>

              <p className="text-md font-semibold text-primary-600 mt-1">
                ₹5,000/month → ₹11.6 lakh in 10 years (12% return)
              </p>
            </div>

            {/* Main Calculator Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calculator Input Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your SIP Returns</h2>

                        {/* Calculator Type Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Calculator Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setCalculatorType('regular')}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${calculatorType === 'regular'
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Regular SIP
                                </button>
                                <button
                                    onClick={() => setCalculatorType('stepup')}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${calculatorType === 'stepup'
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Step-Up SIP
                                </button>
                                <button
                                    onClick={() => setCalculatorType('lumpsum')}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all ${calculatorType === 'lumpsum'
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Lump Sum
                                </button>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-6">
                            {calculatorType === 'lumpsum' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Investment Amount
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="10000"
                                            max="10000000"
                                            step="10000"
                                            value={lumpSumAmount}
                                            onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                                            className="flex-1 h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <input
                                            type="number"
                                            value={lumpSumAmount}
                                            onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mt-1 text-lg font-bold text-primary-600">
                                        {formatCurrency(lumpSumAmount)}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Monthly Investment
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="500"
                                            max="100000"
                                            step="500"
                                            value={monthlyInvestment}
                                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                            className="flex-1 h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <input
                                            type="number"
                                            value={monthlyInvestment}
                                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mt-1 text-lg font-bold text-primary-600">
                                        {formatCurrency(monthlyInvestment)}/month
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expected Return Rate (% p.a.)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        step="0.5"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                        className="flex-1 h-2 bg-success-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="number"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mt-1 text-lg font-bold text-success-600">
                                    {expectedReturn}% per year
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Time Period (Years)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="40"
                                        step="1"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                                        className="flex-1 h-2 bg-gold-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <input
                                        type="number"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mt-1 text-lg font-bold text-gold-600">
                                    {timePeriod} years
                                </div>
                            </div>

                            {calculatorType === 'stepup' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Annual Step-Up (%)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            step="1"
                                            value={stepUpPercentage}
                                            onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                                            className="flex-1 h-2 bg-agri-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <input
                                            type="number"
                                            value={stepUpPercentage}
                                            onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mt-1 text-lg font-bold text-agri-600">
                                        {stepUpPercentage}% yearly increase
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Card */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Summary</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                                    <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</div>
                                </div>

                                <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
                                    <div className="text-sm text-gray-600 mb-1">Estimated Returns</div>
                                    <div className="text-3xl font-bold text-success-700">{formatCurrency(estimatedReturns)}</div>
                                </div>

                                <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-4 border-2 border-gold-300">
                                    <div className="text-sm text-gray-600 mb-1">Total Value</div>
                                    <div className="text-4xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
                                </div>
                            </div>

                            {/* Visual Chart */}
                            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Investment Breakdown</div>
                                <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                                    <div
                                        className="bg-primary-500 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ width: `${(totalInvestment / totalValue) * 100}%` }}
                                    >
                                        {Math.round((totalInvestment / totalValue) * 100)}%
                                    </div>
                                    <div
                                        className="bg-gold-500 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ width: `${(estimatedReturns / totalValue) * 100}%` }}
                                    >
                                        {Math.round((estimatedReturns / totalValue) * 100)}%
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-primary-500 rounded"></span>
                                        Invested
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-gold-500 rounded"></span>
                                        Returns
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Pro Tips</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Start early to maximize the power of compounding</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Consider step-up SIP to align with salary increments</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Equity funds typically offer 12-15% long-term returns</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Stay invested for at least 5-10 years for best results</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                        {/* Monetization Block */}
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            💡 Ready to Start Your SIP?
                          </h3>

                          <p className="text-gray-700 mb-3">
                            Based on your calculation, you can start investing with trusted platforms:
                          </p>

                          <ul className="text-sm text-gray-700 space-y-1 mb-4">
                            <li>✔ Zerodha Coin – Direct mutual funds</li>
                            <li>✔ Groww – Beginner friendly</li>
                            <li>✔ Paytm Money – Easy onboarding</li>
                          </ul>

                          <button className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold">
                            Start Investing Now
                          </button>
                        </div>
                </div>

                {/* Other Calculators - Below Main Calculator */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-3 gap-4">
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

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📈</div>
                                <div>
                                    <div className="font-bold text-gray-700">More Calculators</div>
                                    <div className="text-sm text-gray-500">Coming Soon</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank-wise SIP Calculators - Table Style List */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Bank-wise SIP Calculators</h3>
                    <div className="grid md:grid-cols-2 gap-x-8">
                        {banks.map((bank) => (
                            <Link
                                key={bank.slug}
                                href={`/calculator/${bank.slug}-sip-calculator`}
                                className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors border-b border-gray-100 font-medium"
                            >
                                {bank.name} SIP Calculator
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Educational Content */}
                <div className="mt-12 space-y-8">
                    {/* What is SIP */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What is SIP (Systematic Investment Plan)?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            For most Indian investors, SIP is one of the most practical ways to build long-term wealth without needing to time the market.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            SIP is one of the most popular investment methods in India, with over <strong>6 crore SIP accounts</strong> and monthly inflows exceeding ₹15,000 crores. It&apos;s perfect for salaried individuals, young professionals, and anyone looking to build wealth systematically.
                        </p>
                    </div>

                    {/* How SIP Calculator Works */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Does Our SIP Calculator Work?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Our SIP calculator uses the compound interest formula to calculate your investment returns. Here&apos;s the formula:
                        </p>
                        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                            <code className="text-lg text-gray-800">
                                FV = P × ((1 + r)ⁿ - 1) / r) × (1 + r)
                            </code>
                            <div className="mt-4 text-sm text-gray-600 space-y-1">
                                <div><strong>FV</strong> = Future Value of investment</div>
                                <div><strong>P</strong> = Monthly SIP amount</div>
                                <div><strong>r</strong> = Expected monthly rate of return (Annual rate / 12)</div>
                                <div><strong>n</strong> = Total number of months</div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-3">📊 Example Calculation</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Monthly Investment: ₹5,000</li>
                                    <li>• Expected Return: 12% p.a.</li>
                                    <li>• Time Period: 10 years</li>
                                    <li>• <strong>Total Value: ₹11.6 lakhs</strong></li>
                                    <li>• Total Invested: ₹6 lakhs</li>
                                    <li>• Returns: ₹5.6 lakhs</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-3">🚀 Step-Up SIP Benefit</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>• Starting SIP: ₹5,000</li>
                                    <li>• Annual Increase: 10%</li>
                                    <li>• Time Period: 10 years</li>
                                    <li>• <strong>Total Value: ₹15.2 lakhs</strong></li>
                                    <li>• Extra Returns: ₹3.6 lakhs</li>
                                    <li>• 31% more wealth!</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* SIP Reality Check */}
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        SIP Reality Check (Important)
                      </h2>

                      <ul className="text-gray-700 space-y-2">
                        <li>• Returns are market-linked (not guaranteed)</li>
                        <li>• Short-term losses are possible</li>
                        <li>• 1–3 year performance can be volatile</li>
                      </ul>

                      <p className="mt-3 font-semibold text-gray-800">
                        👉 SIP works best when you stay invested for 7–10+ years.
                      </p>
                    </div>

                    {/* Benefits of SIP */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of SIP Investment</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">💰</div>
                                <h3 className="font-bold text-gray-900 mb-2">Rupee Cost Averaging</h3>
                                <p className="text-gray-700">Buy more units when prices are low and fewer when high, averaging out your cost.</p>
                            </div>
                            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">📈</div>
                                <h3 className="font-bold text-gray-900 mb-2">Power of Compounding</h3>
                                <p className="text-gray-700">Your returns generate more returns, creating exponential wealth growth over time.</p>
                            </div>
                            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">🎯</div>
                                <h3 className="font-bold text-gray-900 mb-2">Disciplined Investing</h3>
                                <p className="text-gray-700">Automated investments ensure you stay committed to your financial goals.</p>
                            </div>
                            <div className="bg-gradient-to-br from-agri-50 to-agri-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">🔄</div>
                                <h3 className="font-bold text-gray-900 mb-2">Flexibility</h3>
                                <p className="text-gray-700">Start with as low as ₹500, pause, or increase your SIP anytime.</p>
                            </div>
                            <div className="bg-gradient-to-br from-primary-50 to-success-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">📊</div>
                                <h3 className="font-bold text-gray-900 mb-2">No Market Timing</h3>
                                <p className="text-gray-700">Invest regularly without worrying about market highs and lows.</p>
                            </div>
                            <div className="bg-gradient-to-br from-success-50 to-gold-100 rounded-xl p-6">
                                <div className="text-3xl mb-3">💎</div>
                                <h3 className="font-bold text-gray-900 mb-2">Wealth Creation</h3>
                                <p className="text-gray-700">Build substantial corpus for retirement, education, or dream goals.</p>
                            </div>
                        </div>
                    </div>

                    {/* Expert Insight */}
                    <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                      <p className="text-gray-800 font-medium">
                        <strong>Expert Insight:</strong> Most investors don&apos;t lose money because SIP fails—
                        they lose because they stop investing during market downturns.
                      </p>

                      <p className="mt-2 text-gray-700">
                        👉 Continuing SIP during market dips often leads to better long-term returns.
                      </p>
                    </div>

                    {/* Types of SIP */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of SIP Calculators</h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 border-l-4 border-primary-600">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Regular SIP Calculator</h3>
                                <p className="text-gray-700">Calculate returns for fixed monthly investments. Best for consistent investors who want to invest the same amount every month.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-success-600">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Step-Up SIP Calculator</h3>
                                <p className="text-gray-700">Plan for increasing SIP amounts annually. Ideal for salaried professionals who expect regular salary increments and want to maximize wealth creation.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-gold-600">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Lump Sum Calculator</h3>
                                <p className="text-gray-700">Calculate returns on one-time investments. Perfect for investors with surplus funds looking to invest a large amount at once.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-agri-600">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">4. SIP with Inflation Calculator</h3>
                                <p className="text-gray-700">Adjust your SIP for inflation to maintain purchasing power. Helps you plan for real returns after accounting for inflation.</p>
                            </div>
                        </div>
                    </div>

                    {/* SIP vs FD vs Gold Comparison */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        SIP vs FD vs Gold
                      </h2>

                      <ul className="text-gray-700 space-y-2">
                        <li>• SIP → Growth (10–14%)</li>
                        <li>• FD → Stable returns (5–7%)</li>
                        <li>• Gold → Inflation hedge</li>
                      </ul>

                      <p className="mt-3 text-gray-800">
                        👉 Smart investors often combine SIP + Gold for balanced portfolios.
                      </p>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions (FAQs)</h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is a SIP Calculator?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    A SIP Calculator is a financial tool that helps you calculate the returns on your Systematic Investment Plan (SIP) investments in mutual funds. It shows you how much wealth you can accumulate over time by investing a fixed amount regularly. Our calculator provides instant results with visual charts to help you plan your investments better.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">How accurate is the SIP Calculator?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    The SIP calculator provides estimates based on the expected rate of return you input. While it uses accurate mathematical formulas, actual returns may vary based on market performance. The calculator assumes a constant rate of return, but mutual fund returns fluctuate. Use it as a planning tool, not a guarantee of returns.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is the expected return rate for SIP?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Expected returns vary by fund type: <strong>Equity funds</strong> typically offer 12-15% returns over the long term (10+ years), <strong>Balanced/Hybrid funds</strong> offer 10-12%, and <strong>Debt funds</strong> offer 7-9%. However, past performance doesn&apos;t guarantee future returns. Always invest based on your risk appetite and financial goals.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is Step-Up SIP?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Step-Up SIP (also called Top-Up SIP) allows you to increase your SIP amount periodically—annually or semi-annually. For example, if you start with ₹5,000/month and set a 10% annual step-up, your SIP will increase to ₹5,500 in year 2, ₹6,050 in year 3, and so on. This helps you align investments with growing income and accelerate wealth creation significantly.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Is SIP better than lump sum investment?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Both have their advantages. <strong>SIP</strong> is ideal for regular investors who want to invest small amounts periodically and benefit from rupee cost averaging. It reduces the risk of market timing. <strong>Lump sum</strong> is suitable when you have a large amount to invest and market conditions are favorable (like during corrections). Many investors use a combination of both strategies.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I stop or pause my SIP?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Yes, SIPs offer complete flexibility. You can pause, stop, or modify your SIP amount anytime without penalties (though some funds may have exit loads if you redeem within a certain period). You can also skip installments if needed. However, staying invested for the long term maximizes the benefits of compounding.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is the minimum SIP amount?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Most mutual funds allow you to start a SIP with as low as <strong>₹500 per month</strong>. Some funds even offer SIPs starting at ₹100. There&apos;s no maximum limit—you can invest as much as you want. The key is to start early and stay consistent, regardless of the amount.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">How is SIP taxed?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Taxation depends on the fund type and holding period. For <strong>Equity funds</strong>: Long-term capital gains (LTCG) above ₹1 lakh are taxed at 10%, and short-term gains (STCG) at 15%. For <strong>Debt funds</strong>: Gains are added to your income and taxed as per your slab. Each SIP installment is treated as a separate investment for tax purposes.
                                </p>
                            </div>

                            <div className="pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Which is the best SIP calculator in India?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Gpaisa&apos;s SIP Calculator is one of the most comprehensive and user-friendly calculators available. It offers regular SIP, step-up SIP, and lump sum calculations with visual charts, all completely free. Unlike many calculators, we provide detailed explanations, examples, and educational content to help you make informed investment decisions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related Tools */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Financial Tools</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/gold-rate" className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow border border-gray-200 group">
                                <div className="text-3xl mb-3">🏆</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">Gold Rate Today</h3>
                                <p className="text-gray-700 text-sm">Check live gold prices across India</p>
                            </Link>
                            <Link href="/silver-rate" className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow border border-gray-200 group">
                                <div className="text-3xl mb-3">⚪</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">Silver Rate Today</h3>
                                <p className="text-gray-700 text-sm">Live silver prices and trends</p>
                            </Link>
                            <Link href="/markets" className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow border border-gray-200 group">
                                <div className="text-3xl mb-3">📊</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">Market Indices</h3>
                                <p className="text-gray-700 text-sm">Track Sensex, Nifty, and more</p>
                            </Link>
                        </div>
                    </div>

                    {/* SEO Content - Best Practices */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">SIP Investment Best Practices</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">1. Start Early, Stay Consistent</h3>
                            <p>
                                The earlier you start your SIP, the more time your money has to grow through compounding. Even a small SIP of ₹2,000/month started at age 25 can create a corpus of over ₹1 crore by age 60 (assuming 12% returns). Don&apos;t wait for the &quot;perfect time&quot;—start now!
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">2. Choose the Right Mutual Fund</h3>
                            <p>
                                Select funds based on your goals and risk appetite. For long-term wealth creation (10+ years), equity funds are ideal. For medium-term goals (3-5 years), consider balanced funds. For short-term goals or low risk tolerance, debt funds are suitable. Research fund performance, expense ratios, and fund manager track records.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">3. Increase SIP with Income</h3>
                            <p>
                                Use step-up SIP to increase your investment amount annually. If you get a 10% salary hike, increase your SIP by 10% too. This ensures your investments keep pace with your growing income and lifestyle inflation, dramatically boosting your final corpus.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">4. Don&apos;t Stop During Market Falls</h3>
                            <p>
                                Market corrections are opportunities, not threats. When markets fall, your SIP buys more units at lower prices (rupee cost averaging). Investors who continue SIPs during downturns often see the best long-term returns. Stay invested and trust the process.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">5. Diversify Across Fund Categories</h3>
                            <p>
                                Don&apos;t put all your eggs in one basket. Spread your SIPs across large-cap, mid-cap, and multi-cap funds. Consider adding international funds for global exposure. Diversification reduces risk and improves overall portfolio stability.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">6. Review Portfolio Annually</h3>
                            <p>
                                While SIP is a long-term strategy, review your portfolio once a year. Check if funds are performing as expected, rebalance if needed, and ensure your asset allocation aligns with your goals. However, avoid frequent changes based on short-term performance.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">7. Set Clear Financial Goals</h3>
                            <p>
                                Define specific goals for each SIP—retirement, children&apos;s education, home down payment, etc. This helps you choose the right funds, investment duration, and amount. Goal-based investing keeps you motivated and disciplined.
                            </p>
                        </div>
                    </div>

                    {/* Conclusion CTA */}
                    <div className="bg-gradient-to-r from-primary-600 via-success-600 to-primary-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Wealth Journey Today!</h2>
                        <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                            Use our free SIP calculator to plan your investments and achieve your financial dreams. Remember, the best time to start was yesterday. The next best time is now!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/finance" className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-colors shadow-lg">
                                Explore More Tools
                            </Link>
                            <Link href="/news" className="bg-primary-500 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-400 transition-colors border-2 border-white/30">
                                Read Finance News
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Schema Markup */}
            <div className="bg-gray-50 border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">
                            <strong>Keywords:</strong> SIP Calculator, Mutual Fund SIP Calculator, SIP Return Calculator, Step Up SIP Calculator, Lump Sum Calculator, SBI SIP Calculator, Groww SIP Calculator, Investment Calculator India
                        </p>
                        <p className="text-xs text-gray-500">
                            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
