'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PPFCalculatorClient() {
    // Calculator state
    const [yearlyInvestment, setYearlyInvestment] = useState(150000);
    const [timePeriod, setTimePeriod] = useState(15);
    const [interestRate] = useState(7.1); // Current PPF rate
    const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

    // Results state
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [maturityAmount, setMaturityAmount] = useState(0);
    const [yearlyData, setYearlyData] = useState<Array<{
        year: number;
        openingBalance: number;
        deposit: number;
        interest: number;
        closingBalance: number;
    }>>([]);

    // Calculate PPF returns
    const calculatePPF = () => {
        const rate = interestRate / 100;
        let balance = 0;
        const data = [];

        for (let year = 1; year <= timePeriod; year++) {
            const openingBalance = balance;
            const deposit = yearlyInvestment;
            // Interest is calculated on opening balance + deposit
            const interest = (openingBalance + deposit) * rate;
            const closingBalance = openingBalance + deposit + interest;

            data.push({
                year,
                openingBalance,
                deposit,
                interest,
                closingBalance
            });

            balance = closingBalance;
        }

        setYearlyData(data);
        setTotalInvestment(yearlyInvestment * timePeriod);
        setTotalInterest(balance - (yearlyInvestment * timePeriod));
        setMaturityAmount(balance);
    };

    useEffect(() => {
        calculatePPF();
    }, [yearlyInvestment, timePeriod]);

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
                                <span className="text-gray-900 font-medium">PPF Calculator</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Calculator Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Calculator */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Calculator Input Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your PPF Returns</h2>

                                {/* Yearly Investment */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Yearly Investment</label>
                                        <span className="text-lg font-bold text-primary-600">{formatCurrency(yearlyInvestment)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="500"
                                        max="150000"
                                        step="500"
                                        value={yearlyInvestment}
                                        onChange={(e) => setYearlyInvestment(Number(e.target.value))}
                                        className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>₹500</span>
                                        <span>₹1,50,000</span>
                                    </div>
                                </div>

                                {/* Time Period */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
                                        <span className="text-lg font-bold text-success-600">{timePeriod} years</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="50"
                                        step="1"
                                        value={timePeriod}
                                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                                        className="w-full h-2 bg-success-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>15 years</span>
                                        <span>50 years</span>
                                    </div>
                                </div>

                                {/* Interest Rate (Fixed) */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Interest Rate (p.a.)</label>
                                        <span className="text-lg font-bold text-gold-600">{interestRate}%</span>
                                    </div>
                                    <div className="bg-gold-50 border border-gold-200 rounded-lg p-3">
                                        <p className="text-xs text-gray-600">
                                            <span className="font-semibold">Current PPF Rate:</span> {interestRate}% per annum (compounded annually). Rate is set by Government of India and reviewed quarterly.
                                        </p>
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
                                            <span>Invest before 5th of month for full month interest</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success-600 mt-0.5">✓</span>
                                            <span>Max ₹1.5L/year for 80C tax deduction</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-success-600 mt-0.5">✓</span>
                                            <span>EEE status - completely tax-free</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Results Card */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Maturity Summary</h3>

                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                                            <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                                            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
                                            <div className="text-sm text-gray-600 mb-1">Total Interest Earned</div>
                                            <div className="text-3xl font-bold text-success-700">{formatCurrency(totalInterest)}</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-4 border-2 border-gold-300">
                                            <div className="text-sm text-gray-600 mb-1">Maturity Amount</div>
                                            <div className="text-4xl font-bold text-gray-900">{formatCurrency(maturityAmount)}</div>
                                            <div className="text-xs text-gray-600 mt-1">After {timePeriod} years</div>
                                        </div>
                                    </div>

                                    {/* Visual Chart */}
                                    <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-sm font-semibold text-gray-700 mb-3">Investment Breakdown</div>
                                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                                            <div
                                                className="bg-primary-500 flex items-center justify-center text-xs font-bold text-white"
                                                style={{ width: `${(totalInvestment / maturityAmount) * 100}%` }}
                                            >
                                                {Math.round((totalInvestment / maturityAmount) * 100)}%
                                            </div>
                                            <div
                                                className="bg-gold-500 flex items-center justify-center text-xs font-bold text-white"
                                                style={{ width: `${(totalInterest / maturityAmount) * 100}%` }}
                                            >
                                                {Math.round((totalInterest / maturityAmount) * 100)}%
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-primary-500 rounded"></span>
                                                Invested
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 bg-gold-500 rounded"></span>
                                                Interest
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
                                                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Deposit</th>
                                                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Interest</th>
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
                                                            <td className="px-3 py-2 text-right text-primary-600 font-medium">
                                                                {formatCurrency(data.deposit)}
                                                            </td>
                                                            <td className="px-3 py-2 text-right text-success-600 font-medium">
                                                                {formatCurrency(data.interest)}
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
                    </div>

                    {/* Right Sidebar - Other Calculators */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/calculator/sip"
                                    className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">📊</div>
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-primary-600">SIP Calculator</div>
                                            <div className="text-xs text-gray-600">Calculate SIP returns</div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">📈</div>
                                        <div>
                                            <div className="font-bold text-gray-700">More Calculators</div>
                                            <div className="text-xs text-gray-500">Coming Soon</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Quick Links</h4>
                                <div className="space-y-2">
                                    <Link href="/gold-rate" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                                        📈 Gold Rate Today
                                    </Link>
                                    <Link href="/markets" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                                        📊 Market Indices
                                    </Link>
                                    <Link href="/finance" className="block text-sm text-gray-600 hover:text-primary-600 transition-colors">
                                        💼 Personal Finance
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Calculators - Below Main Calculator */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link
                            href="/calculator/sip"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📊</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">SIP Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate mutual fund SIP returns</div>
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

                {/* SEO Content Sections */}
                <div className="mt-12 space-y-8">
                    {/* What is PPF */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What is Public Provident Fund (PPF)?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            <strong>Public Provident Fund (PPF)</strong> is a long-term savings scheme backed by the Government of India. It offers attractive interest rates with complete tax benefits under the EEE (Exempt-Exempt-Exempt) category. PPF is one of the safest investment options in India, ideal for building a retirement corpus or achieving long-term financial goals.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            With a lock-in period of 15 years (extendable in blocks of 5 years), PPF encourages disciplined savings while providing guaranteed returns. The scheme is available at all post offices and authorized banks across India, making it easily accessible to every Indian citizen.
                        </p>
                    </div>

                    {/* How PPF Calculator Works */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Does PPF Calculator Work?</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Our PPF calculator uses the compound interest formula to calculate your maturity amount. The formula is:
                        </p>
                        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                            <code className="text-lg text-gray-800">
                                F = P × [((1 + i)^n - 1) / i]
                            </code>
                            <div className="mt-4 text-sm text-gray-600 space-y-1">
                                <p><strong>F</strong> = Maturity amount</p>
                                <p><strong>P</strong> = Yearly investment amount</p>
                                <p><strong>i</strong> = Interest rate (7.1% = 0.071)</p>
                                <p><strong>n</strong> = Number of years</p>
                            </div>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Interest is compounded annually and credited to your account at the end of each financial year. Deposits made before the 5th of any month earn interest for that entire month.
                        </p>
                    </div>

                    {/* Benefits of PPF */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of PPF Investment</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                                <div className="text-3xl mb-3">🛡️</div>
                                <h3 className="font-bold text-gray-900 mb-2">Government Backed</h3>
                                <p className="text-gray-700">100% safe investment backed by Government of India. No market risk, guaranteed returns.</p>
                            </div>
                            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 border border-success-200">
                                <div className="text-3xl mb-3">💰</div>
                                <h3 className="font-bold text-gray-900 mb-2">EEE Tax Benefits</h3>
                                <p className="text-gray-700">Investment, interest, and maturity amount all are completely tax-free under Section 80C.</p>
                            </div>
                            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-6 border border-gold-200">
                                <div className="text-3xl mb-3">📈</div>
                                <h3 className="font-bold text-gray-900 mb-2">Attractive Returns</h3>
                                <p className="text-gray-700">Current rate of 7.1% p.a. compounded annually, higher than most fixed deposits.</p>
                            </div>
                            <div className="bg-gradient-to-br from-agri-50 to-agri-100 rounded-xl p-6 border border-agri-200">
                                <div className="text-3xl mb-3">🔄</div>
                                <h3 className="font-bold text-gray-900 mb-2">Flexible Deposits</h3>
                                <p className="text-gray-700">Deposit in lump sum or installments. Make up to 12 deposits per year at your convenience.</p>
                            </div>
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
                                <div className="text-3xl mb-3">💳</div>
                                <h3 className="font-bold text-gray-900 mb-2">Loan Facility</h3>
                                <p className="text-gray-700">Avail loans from 3rd to 6th year at just 2% above PPF interest rate.</p>
                            </div>
                            <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-6 border border-success-200">
                                <div className="text-3xl mb-3">👨‍👩‍👧</div>
                                <h3 className="font-bold text-gray-900 mb-2">Minor Account</h3>
                                <p className="text-gray-700">Open PPF account for minors. Great way to build wealth for your children&apos;s future.</p>
                            </div>
                        </div>
                    </div>

                    {/* PPF Rules & Regulations */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">PPF Rules & Regulations</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl p-6 border-l-4 border-primary-600">
                                <h3 className="font-bold text-gray-900 mb-2">Investment Limits</h3>
                                <p className="text-gray-700">Minimum: ₹500 per year | Maximum: ₹1,50,000 per year</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-success-600">
                                <h3 className="font-bold text-gray-900 mb-2">Lock-in Period</h3>
                                <p className="text-gray-700">15 years from the end of financial year in which account was opened. Extendable in blocks of 5 years.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-gold-600">
                                <h3 className="font-bold text-gray-900 mb-2">Interest Rate</h3>
                                <p className="text-gray-700">Currently 7.1% p.a. (reviewed quarterly by Government). Compounded annually.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border-l-4 border-agri-600">
                                <h3 className="font-bold text-gray-900 mb-2">Account Opening</h3>
                                <p className="text-gray-700">Available at post offices and authorized banks. Can be opened by individuals and minors (through guardian).</p>
                            </div>
                        </div>
                    </div>

                    {/* Tax Benefits */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">PPF Tax Benefits - EEE Status</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            PPF enjoys the rare <strong>EEE (Exempt-Exempt-Exempt)</strong> tax status, making it one of the best tax-saving investments in India:
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-2xl">1️⃣</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Investment is Exempt (Section 80C)</h3>
                                    <p className="text-gray-700">Investments up to ₹1.5 lakh per year qualify for tax deduction under Section 80C. Save up to ₹46,800 in taxes (at 30% tax bracket).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-2xl">2️⃣</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Interest is Exempt</h3>
                                    <p className="text-gray-700">All interest earned on your PPF account is completely tax-free. No TDS deducted, no tax liability.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-2xl">3️⃣</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Maturity Amount is Exempt</h3>
                                    <p className="text-gray-700">The entire maturity amount (principal + interest) is tax-free. No tax on withdrawal at maturity or extension.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal Rules */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">PPF Withdrawal Rules</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Partial Withdrawal</h3>
                                <p className="text-gray-700 mb-2">Allowed from 7th financial year onwards:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                    <li>Maximum: 50% of balance at end of 4th preceding year</li>
                                    <li>Only one withdrawal per financial year</li>
                                    <li>Completely tax-free</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Premature Closure</h3>
                                <p className="text-gray-700 mb-2">Allowed after 5 years in specific cases:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                    <li>Life-threatening disease of self, spouse, or dependent children</li>
                                    <li>Higher education of account holder or children</li>
                                    <li>Change in residency status (NRI)</li>
                                    <li>Interest rate reduced by 1% on premature closure</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Maturity</h3>
                                <p className="text-gray-700">After 15 years, you can withdraw the entire amount or extend the account in blocks of 5 years (with or without contributions).</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions (FAQs)</h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is the current PPF interest rate?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    The current PPF interest rate is <strong>7.1% per annum</strong> (as of 2024), compounded annually. The rate is reviewed quarterly by the Government of India and is linked to government securities yields.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I have multiple PPF accounts?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    No, an individual can have only <strong>one PPF account</strong> in their name. However, you can open a separate account for your minor child. Multiple accounts opened after December 2019 will be closed, and only the first account will remain active.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What happens if I don&apos;t deposit the minimum amount?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    If you don&apos;t deposit the minimum ₹500 in a financial year, your account becomes <strong>inactive</strong>. You can reactivate it by paying ₹50 penalty per year along with the minimum deposit of ₹500 for each defaulted year.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Can NRIs invest in PPF?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>No</strong>, NRIs (Non-Resident Indians) cannot open new PPF accounts. However, if you opened a PPF account as a resident Indian and later became an NRI, you can continue the account until maturity without making further deposits.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">How is PPF different from EPF?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>PPF (Public Provident Fund)</strong> is a voluntary savings scheme open to all, while <strong>EPF (Employees&apos; Provident Fund)</strong> is mandatory for salaried employees. PPF has a 15-year lock-in with flexible deposits, while EPF is linked to employment. Both offer tax benefits, but EPF has higher contribution limits.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I take a loan against my PPF account?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Yes, you can take a <strong>loan from 3rd to 6th year</strong> of account opening. The loan amount is limited to 25% of the balance at the end of 2nd preceding year. Interest rate is 2% above the PPF rate. The loan must be repaid within 36 months.
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">What is the best time to deposit in PPF?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Deposit <strong>before the 5th of any month</strong> to earn interest for that entire month. For maximum returns, deposit the full ₹1.5 lakh at the beginning of the financial year (April). This way, you earn interest on the entire amount for the full year.
                                </p>
                            </div>

                            <div className="pb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Is PPF better than Fixed Deposit?</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    PPF is generally better than FD for long-term savings because: (1) <strong>Tax-free returns</strong> - PPF offers EEE status while FD interest is taxable, (2) <strong>Higher effective returns</strong> - After tax, PPF gives better returns, (3) <strong>Government backing</strong> - PPF is 100% safe. However, FDs offer more liquidity and shorter lock-in periods.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">PPF Investment Best Practices</h2>
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">1. Start Early for Maximum Compounding</h3>
                            <p>
                                The power of compounding works best over long periods. Starting PPF in your 20s or 30s can create a substantial retirement corpus. Even with minimum deposits, starting early makes a huge difference.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">2. Maximize Annual Contribution</h3>
                            <p>
                                Try to invest the maximum ₹1.5 lakh per year to get full tax benefits under Section 80C and maximize your returns. If not possible initially, gradually increase your contribution each year.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">3. Deposit Early in the Month</h3>
                            <p>
                                Always deposit before the 5th of the month to earn interest for that entire month. Depositing on the 6th means you lose a whole month&apos;s interest. For maximum returns, deposit the annual amount in April itself.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">4. Extend After Maturity</h3>
                            <p>
                                After 15 years, consider extending your PPF account in blocks of 5 years. You can continue earning tax-free interest even without making further deposits. This is especially useful if you don&apos;t need the money immediately.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">5. Open Account for Children</h3>
                            <p>
                                Open a PPF account for your minor children. By the time they turn 18, they&apos;ll have a substantial corpus for higher education or other goals. It&apos;s a great way to teach them about disciplined savings.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">6. Avoid Premature Withdrawal</h3>
                            <p>
                                While partial withdrawals are allowed from the 7th year, avoid them unless absolutely necessary. Every withdrawal reduces your corpus and the compounding effect. Let your money grow for the full 15 years.
                            </p>

                            <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-4">7. Combine with Other Investments</h3>
                            <p>
                                PPF should be part of a diversified portfolio. Combine it with equity mutual funds for higher growth potential, while PPF provides stability and guaranteed returns. Don&apos;t put all your savings in PPF alone.
                            </p>
                        </div>
                    </div>

                    {/* Related Tools */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Financial Tools</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/calculator/sip" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-xl transition-shadow border border-green-200 group">
                                <div className="text-3xl mb-3">📊</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">SIP Calculator</h3>
                                <p className="text-gray-700 text-sm">Calculate mutual fund SIP returns</p>
                            </Link>
                            <Link href="/gold-rate" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-xl transition-shadow border border-green-200 group">
                                <div className="text-3xl mb-3">🏆</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">Gold Rate Today</h3>
                                <p className="text-gray-700 text-sm">Check live gold prices across India</p>
                            </Link>
                            <Link href="/markets" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-xl transition-shadow border border-green-200 group">
                                <div className="text-3xl mb-3">📈</div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600">Market Indices</h3>
                                <p className="text-gray-700 text-sm">Track Sensex, Nifty, and more</p>
                            </Link>
                        </div>
                    </div>

                    {/* Conclusion CTA */}
                    <div className="bg-gradient-to-r from-primary-600 via-success-600 to-primary-700 rounded-2xl shadow-xl p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Start Your PPF Journey Today!</h2>
                        <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
                            PPF is one of the safest and most tax-efficient investment options in India. Use our calculator to plan your investments and build a secure financial future.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/finance" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors">
                                Learn More About PPF
                            </Link>
                            <Link href="/calculator/sip" className="bg-primary-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors border-2 border-white">
                                Try SIP Calculator
                            </Link>
                        </div>
                    </div>

                    {/* SEO Keywords Footer */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            <strong>Popular Searches:</strong> ppf calculator, public provident fund calculator, ppf calculator online, ppf maturity calculator, ppf interest calculator, ppf calculator 2024, ppf calculator india, ppf return calculator, ppf investment calculator, ppf calculator with interest rate, ppf calculator 15 years, ppf calculator sbi, ppf calculator post office, ppf tax benefits, ppf withdrawal rules, ppf vs fd, ppf vs sip, ppf account opening, ppf interest rate 2024, ppf maturity period
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
