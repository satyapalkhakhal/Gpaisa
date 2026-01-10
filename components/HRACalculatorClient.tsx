'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HRACalculatorClient() {
    const [basicSalary, setBasicSalary] = useState(50000);
    const [hraReceived, setHraReceived] = useState(20000);
    const [rentPaid, setRentPaid] = useState(15000);
    const [isMetro, setIsMetro] = useState(true);

    const [hraExemption, setHraExemption] = useState(0);
    const [taxableHRA, setTaxableHRA] = useState(0);

    const calculateHRA = () => {
        const actualHRA = hraReceived;
        const excessRent = rentPaid - (basicSalary * 0.1);
        const metroPercent = isMetro ? 0.5 : 0.4;
        const salaryPercent = basicSalary * metroPercent;

        const exemption = Math.min(actualHRA, excessRent, salaryPercent);
        const taxable = hraReceived - Math.max(0, exemption);

        setHraExemption(Math.max(0, exemption));
        setTaxableHRA(taxable);
    };

    useEffect(() => {
        calculateHRA();
    }, [basicSalary, hraReceived, rentPaid, isMetro]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">HRA Calculator</li>
                    </ol>
                </nav>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        HRA Calculator - House Rent Allowance Tax Exemption
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Calculate HRA tax exemption as per Income Tax rules. Find out how much HRA is exempt from tax.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary & Rent Details</h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Basic Salary (Monthly)</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(basicSalary)}</span>
                            </div>
                            <input
                                type="number"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">HRA Received (Monthly)</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(hraReceived)}</span>
                            </div>
                            <input
                                type="number"
                                value={hraReceived}
                                onChange={(e) => setHraReceived(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">Rent Paid (Monthly)</label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(rentPaid)}</span>
                            </div>
                            <input
                                type="number"
                                value={rentPaid}
                                onChange={(e) => setRentPaid(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block">City Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsMetro(true)}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${isMetro
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Metro City (50%)
                                </button>
                                <button
                                    onClick={() => setIsMetro(false)}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${!isMetro
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Non-Metro (40%)
                                </button>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-green-900 mb-2">💡 Metro Cities</h3>
                            <p className="text-sm text-green-800">Delhi, Mumbai, Kolkata, Chennai</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">HRA Exemption</h2>

                        <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">HRA Tax Exemption</div>
                            <div className="text-4xl font-bold text-primary-600">{formatCurrency(hraExemption)}</div>
                            <div className="text-xs text-gray-500 mt-1">Per Month</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">HRA Received</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(hraReceived)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <span className="text-gray-700 font-medium">Tax Exempt HRA</span>
                                <span className="text-lg font-bold text-green-600">{formatCurrency(hraExemption)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <span className="text-gray-700 font-medium">Taxable HRA</span>
                                <span className="text-lg font-bold text-orange-600">{formatCurrency(taxableHRA)}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">Annual Tax Savings</h3>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(hraExemption * 12)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About HRA Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            House Rent Allowance (HRA) is a component of salary that provides tax benefits to salaried individuals
                            living in rented accommodation. The HRA exemption is calculated as the minimum of three amounts.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">HRA Exemption Calculation:</h4>
                        <p className="mb-4">The exemption is the minimum of:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Actual HRA received</li>
                            <li>50% of basic salary (metro) or 40% (non-metro)</li>
                            <li>Rent paid minus 10% of basic salary</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Tax Calculators</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/calculator/gst" className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🧾</div>
                            <div className="font-bold text-gray-900">GST Calculator</div>
                        </Link>
                        <Link href="/calculator/gratuity" className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💼</div>
                            <div className="font-bold text-gray-900">Gratuity Calculator</div>
                        </Link>
                        <Link href="/calculator/nps" className="block p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">🏦</div>
                            <div className="font-bold text-gray-900">NPS Calculator</div>
                        </Link>
                        <Link href="/calculator/epf" className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="font-bold text-gray-900">EPF Calculator</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
