'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SWPCalculatorClient() {
    // Calculator state
    const [initialInvestment, setInitialInvestment] = useState(1000000);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(10000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(20);
    const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

    // Results state
    const [totalWithdrawal, setTotalWithdrawal] = useState(0);
    const [finalCorpus, setFinalCorpus] = useState(0);
    const [totalMonths, setTotalMonths] = useState(0);
    const [yearlyData, setYearlyData] = useState<Array<{
        year: number;
        openingBalance: number;
        withdrawal: number;
        returns: number;
        closingBalance: number;
    }>>([]);

    // Calculate SWP
    const calculateSWP = () => {
        const monthlyRate = expectedReturn / 12 / 100;
        let balance = initialInvestment;
        const data = [];
        let totalWithdrawn = 0;
        let monthsLasted = 0;

        for (let year = 1; year <= timePeriod; year++) {
            const openingBalance = balance;
            let yearlyWithdrawal = 0;
            let yearlyReturns = 0;

            for (let month = 1; month <= 12; month++) {
                if (balance <= 0) break;

                // Withdraw at beginning of month
                const withdrawal = Math.min(monthlyWithdrawal, balance);
                balance -= withdrawal;
                yearlyWithdrawal += withdrawal;
                totalWithdrawn += withdrawal;
                monthsLasted++;

                if (balance <= 0) break;

                // Calculate returns on remaining balance
                const monthlyReturn = balance * monthlyRate;
                balance += monthlyReturn;
                yearlyReturns += monthlyReturn;
            }

            data.push({
                year,
                openingBalance,
                withdrawal: yearlyWithdrawal,
                returns: yearlyReturns,
                closingBalance: Math.max(0, balance)
            });

            if (balance <= 0) break;
        }

        setYearlyData(data);
        setTotalWithdrawal(totalWithdrawn);
        setFinalCorpus(Math.max(0, balance));
        setTotalMonths(monthsLasted);
    };

    useEffect(() => {
        calculateSWP();
    }, [initialInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
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
                                <span className="text-gray-900 font-medium">SWP Calculator</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Calculator Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calculator Input Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your SWP Returns</h2>

                        {/* Initial Investment */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Initial Investment</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(initialInvestment)}</span>
                            </div>
                            <input
                                type="range"
                                min="100000"
                                max="10000000"
                                step="100000"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹1L</span>
                                <span>₹1Cr</span>
                            </div>
                        </div>

                        {/* Monthly Withdrawal */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Monthly Withdrawal</label>
                                <span className="text-lg font-bold text-success-600">{formatCurrency(monthlyWithdrawal)}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="200000"
                                step="5000"
                                value={monthlyWithdrawal}
                                onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                                className="w-full h-2 bg-success-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹5,000</span>
                                <span>₹2,00,000</span>
                            </div>
                        </div>

                        {/* Expected Return */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Expected Return (p.a.)</label>
                                <span className="text-lg font-bold text-gold-600">{expectedReturn}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={expectedReturn}
                                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                className="w-full h-2 bg-gold-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1%</span>
                                <span>20%</span>
                            </div>
                        </div>

                        {/* Time Period */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
                                <span className="text-lg font-bold text-agri-600">{timePeriod} years</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="40"
                                step="1"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(Number(e.target.value))}
                                className="w-full h-2 bg-agri-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 year</span>
                                <span>40 years</span>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="text-green-600">💡</span>
                                Pro Tips
                            </h3>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Withdraw only returns, keep capital intact</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Consider inflation while planning withdrawals</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-success-600 mt-0.5">✓</span>
                                    <span>Tax-efficient compared to FD interest</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Results Card */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Summary</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                                    <div className="text-sm text-gray-600 mb-1">Initial Investment</div>
                                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(initialInvestment)}</div>
                                </div>

                                <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
                                    <div className="text-sm text-gray-600 mb-1">Total Withdrawal</div>
                                    <div className="text-3xl font-bold text-success-700">{formatCurrency(totalWithdrawal)}</div>
                                    <div className="text-xs text-gray-600 mt-1">Over {Math.floor(totalMonths / 12)} years {totalMonths % 12} months</div>
                                </div>

                                <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-4 border-2 border-gold-300">
                                    <div className="text-sm text-gray-600 mb-1">Final Corpus</div>
                                    <div className="text-4xl font-bold text-gray-900">{formatCurrency(finalCorpus)}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {finalCorpus > 0 ? 'Remaining after withdrawals' : 'Corpus depleted'}
                                    </div>
                                </div>
                            </div>

                            {/* Visual Chart */}
                            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="text-sm font-semibold text-gray-700 mb-3">Corpus Status</div>
                                <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                                    <div
                                        className="bg-success-500 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ width: `${(totalWithdrawal / (initialInvestment + totalWithdrawal)) * 100}%` }}
                                    >
                                        {Math.round((totalWithdrawal / (initialInvestment + totalWithdrawal)) * 100)}%
                                    </div>
                                    <div
                                        className="bg-primary-500 flex items-center justify-center text-xs font-bold text-white"
                                        style={{ width: `${(finalCorpus / (initialInvestment + totalWithdrawal)) * 100}%` }}
                                    >
                                        {Math.round((finalCorpus / (initialInvestment + totalWithdrawal)) * 100)}%
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-success-500 rounded"></span>
                                        Withdrawn
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 bg-primary-500 rounded"></span>
                                        Remaining
                                    </span>
                                </div>
                            </div>

                            {/* Year-wise Breakdown Toggle */}
                            <button
                                onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                                className="mt-4 w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                            >
                                {showYearlyBreakdown ? 'Hide' : 'Show'} Year-wise Breakdown
                            </button>
                        </div>

                        {/* Yearly Breakdown Table */}
                        {showYearlyBreakdown && (
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-h-96 overflow-y-auto">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Year-wise Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold text-gray-700">Year</th>
                                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Opening</th>
                                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Withdrawal</th>
                                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Returns</th>
                                                <th className="px-3 py-2 text-right font-semibold text-gray-700">Closing</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {yearlyData.map((data) => (
                                                <tr key={data.year} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-3 py-2 font-medium">{data.year}</td>
                                                    <td className="px-3 py-2 text-right text-gray-600">
                                                        {formatCurrency(data.openingBalance)}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-success-600 font-medium">
                                                        {formatCurrency(data.withdrawal)}
                                                    </td>
                                                    <td className="px-3 py-2 text-right text-primary-600 font-medium">
                                                        {formatCurrency(data.returns)}
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-bold">
                                                        {formatCurrency(data.closingBalance)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Other Calculators - Below Main Calculator */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link
                            href="/calculator/sip"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📊</div>
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

                {/* SEO Content - Minimal for now, can be expanded */}
                <div className="mt-12 space-y-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What is SWP (Systematic Withdrawal Plan)?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            <strong>Systematic Withdrawal Plan (SWP)</strong> is a facility that allows you to withdraw a fixed amount regularly from your mutual fund investment. It&apos;s the opposite of SIP - instead of investing regularly, you withdraw regularly while your remaining corpus continues to earn returns.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            SWP is ideal for retirees who need regular income, investors looking to book profits systematically, or anyone who wants to create a steady cash flow from their investments. It provides tax-efficient income compared to traditional fixed deposits.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
