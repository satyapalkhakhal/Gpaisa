'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EPFCalculatorClient() {
    const [basicSalary, setBasicSalary] = useState(50000);
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(58);
    const [currentEPFBalance, setCurrentEPFBalance] = useState(0);
    const [includeVPF, setIncludeVPF] = useState(false);
    const [vpfPercentage, setVpfPercentage] = useState(0);
    const [salaryIncrement, setSalaryIncrement] = useState(5);

    const epfRate = 8.25; // Current EPF interest rate
    const employeeContribution = 12;
    const employerContribution = 12;

    const [maturityAmount, setMaturityAmount] = useState(0);
    const [totalContribution, setTotalContribution] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [pensionAmount, setPensionAmount] = useState(0);

    const calculateEPF = () => {
        const yearsToRetirement = retirementAge - currentAge;
        let balance = currentEPFBalance;
        let salary = basicSalary;
        let totalContrib = 0;

        for (let year = 0; year < yearsToRetirement; year++) {
            // Monthly contributions
            const employeeMonthly = (salary * employeeContribution) / 100;
            const employerMonthly = (salary * employerContribution) / 100;
            const vpfMonthly = includeVPF ? (salary * vpfPercentage) / 100 : 0;
            const totalMonthly = employeeMonthly + employerMonthly + vpfMonthly;

            // Annual contribution
            const annualContribution = totalMonthly * 12;
            totalContrib += annualContribution;

            // Add contribution and calculate interest
            balance += annualContribution;
            const interest = (balance * epfRate) / 100;
            balance += interest;

            // Salary increment for next year
            salary = salary * (1 + salaryIncrement / 100);
        }

        setMaturityAmount(balance);
        setTotalContribution(totalContrib + currentEPFBalance);
        setTotalInterest(balance - totalContrib - currentEPFBalance);

        // Simple pension calculation (EPS)
        const pensionableSalary = Math.min(basicSalary, 15000);
        const pensionableService = yearsToRetirement;
        const monthlyPension = (pensionableSalary * pensionableService) / 70;
        setPensionAmount(monthlyPension);
    };

    useEffect(() => {
        calculateEPF();
    }, [basicSalary, currentAge, retirementAge, currentEPFBalance, includeVPF, vpfPercentage, salaryIncrement]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex text-sm">
                        <ol className="inline-flex items-center space-x-2">
                            <li><Link href="/" className="text-gray-500 hover:text-primary-600">Home</Link></li>
                            <li className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <Link href="/calculator" className="text-gray-500 hover:text-primary-600">Calculator</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-900 font-medium">EPF Calculator</span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your EPF Returns</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Basic Salary (Monthly)</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(basicSalary)}</span>
                            </div>
                            <input
                                type="range"
                                min="10000"
                                max="200000"
                                step="5000"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(Number(e.target.value))}
                                className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹10,000</span>
                                <span>₹2,00,000</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Current Age</label>
                                <input
                                    type="number"
                                    value={currentAge}
                                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Retirement Age</label>
                                <input
                                    type="number"
                                    value={retirementAge}
                                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Current EPF Balance</label>
                            <input
                                type="number"
                                value={currentEPFBalance}
                                onChange={(e) => setCurrentEPFBalance(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="₹0"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Annual Salary Increment (%)</label>
                                <span className="text-lg font-bold text-success-600">{salaryIncrement}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="15"
                                step="0.5"
                                value={salaryIncrement}
                                onChange={(e) => setSalaryIncrement(Number(e.target.value))}
                                className="w-full h-2 bg-success-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeVPF}
                                    onChange={(e) => setIncludeVPF(e.target.checked)}
                                    className="w-5 h-5 text-primary-600 rounded"
                                />
                                <span className="font-semibold text-gray-900">Include VPF (Voluntary Provident Fund)</span>
                            </label>
                            {includeVPF && (
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-semibold text-gray-700">VPF Contribution (%)</label>
                                        <span className="text-lg font-bold text-blue-600">{vpfPercentage}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={vpfPercentage}
                                        onChange={(e) => setVpfPercentage(Number(e.target.value))}
                                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <h3 className="font-bold text-gray-900 mb-2">📊 Contribution Breakdown</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>Employee (12%):</span>
                                    <span className="font-semibold">{formatCurrency((basicSalary * 12) / 100)}/month</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Employer (12%):</span>
                                    <span className="font-semibold">{formatCurrency((basicSalary * 12) / 100)}/month</span>
                                </div>
                                {includeVPF && (
                                    <div className="flex justify-between">
                                        <span>VPF ({vpfPercentage}%):</span>
                                        <span className="font-semibold">{formatCurrency((basicSalary * vpfPercentage) / 100)}/month</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-green-300">
                                    <span className="font-bold">Total Monthly:</span>
                                    <span className="font-bold text-primary-600">
                                        {formatCurrency((basicSalary * (24 + (includeVPF ? vpfPercentage : 0))) / 100)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Retirement Summary</h3>

                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                                    <div className="text-sm text-gray-600 mb-1">Total Contribution</div>
                                    <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalContribution)}</div>
                                </div>

                                <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
                                    <div className="text-sm text-gray-600 mb-1">Total Interest Earned</div>
                                    <div className="text-3xl font-bold text-success-700">{formatCurrency(totalInterest)}</div>
                                    <div className="text-xs text-gray-600 mt-1">@ {epfRate}% p.a.</div>
                                </div>

                                <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-4 border-2 border-gold-300">
                                    <div className="text-sm text-gray-600 mb-1">EPF Maturity Amount</div>
                                    <div className="text-4xl font-bold text-gray-900">{formatCurrency(maturityAmount)}</div>
                                    <div className="text-xs text-gray-600 mt-1">At age {retirementAge}</div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="text-sm text-gray-600 mb-1">Estimated Monthly Pension (EPS)</div>
                                    <div className="text-2xl font-bold text-blue-700">{formatCurrency(pensionAmount)}</div>
                                    <div className="text-xs text-gray-600 mt-1">Approximate calculation</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Calculators */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/sip" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📊</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">SIP Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate SIP returns</div>
                                </div>
                            </div>
                        </Link>
                        <Link href="/calculator/ppf" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">💰</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">PPF Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate PPF returns</div>
                                </div>
                            </div>
                        </Link>
                        <Link href="/calculator/swp" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group">
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

                {/* SEO Content */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What is EPF (Employees&apos; Provident Fund)?</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        <strong>Employees&apos; Provident Fund (EPF)</strong> is a retirement savings scheme for salaried employees in India. Both employee and employer contribute 12% of basic salary monthly. EPF offers guaranteed returns (currently {epfRate}% p.a.) and is completely tax-free at maturity. It&apos;s one of the safest retirement planning tools available to Indian employees.
                    </p>
                </div>
            </div>
        </div>
    );
}
