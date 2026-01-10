'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CalculationType = 'exclusive' | 'inclusive';

export default function GSTCalculatorClient() {
    // Input states
    const [amount, setAmount] = useState(10000);
    const [gstRate, setGstRate] = useState(18);
    const [calculationType, setCalculationType] = useState<CalculationType>('exclusive');

    // Result states
    const [netAmount, setNetAmount] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [igst, setIgst] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(false);

    // GST Rates
    const gstRates = [0, 0.25, 3, 5, 12, 18, 28];

    // Calculate GST
    const calculateGST = () => {
        if (calculationType === 'exclusive') {
            // GST Exclusive: Add GST to the amount
            const gst = (amount * gstRate) / 100;
            const total = amount + gst;

            setNetAmount(amount);
            setGstAmount(gst);
            setTotalAmount(total);
            setCgst(gst / 2);
            setSgst(gst / 2);
            setIgst(gst);
        } else {
            // GST Inclusive: Extract GST from the amount
            const net = amount / (1 + gstRate / 100);
            const gst = amount - net;

            setNetAmount(net);
            setGstAmount(gst);
            setTotalAmount(amount);
            setCgst(gst / 2);
            setSgst(gst / 2);
            setIgst(gst);
        }
    };

    useEffect(() => {
        calculateGST();
    }, [amount, gstRate, calculationType]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/calculator/sip" className="hover:text-primary-600">Calculators</Link></li>
                        <li>/</li>
                        <li className="text-primary-600 font-medium">GST Calculator</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        GST Calculator - Calculate GST Online
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Free online GST calculator to calculate Goods and Services Tax (GST) in India.
                        Add or remove GST from any amount with CGST, SGST, and IGST breakdown.
                    </p>
                </div>

                {/* Main Calculator */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Input Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate GST</h2>

                        {/* Calculation Type Toggle */}
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-gray-700 mb-3 block">Calculation Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setCalculationType('exclusive')}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${calculationType === 'exclusive'
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    GST Exclusive
                                </button>
                                <button
                                    onClick={() => setCalculationType('inclusive')}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all ${calculationType === 'inclusive'
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    GST Inclusive
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {calculationType === 'exclusive'
                                    ? 'Add GST to the amount (Price + GST)'
                                    : 'Remove GST from the amount (Price includes GST)'}
                            </p>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {calculationType === 'exclusive' ? 'Amount (Before GST)' : 'Amount (Including GST)'}
                                </label>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(amount)}</span>
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-lg"
                                placeholder="Enter amount"
                            />
                        </div>

                        {/* GST Rate Selection */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-gray-700">GST Rate</label>
                                <span className="text-lg font-bold text-primary-600">{gstRate}%</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {gstRates.map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => setGstRate(rate)}
                                        className={`py-2 px-3 rounded-lg font-medium transition-all ${gstRate === rate
                                                ? 'bg-primary-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {rate}%
                                    </button>
                                ))}
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="28"
                                step="0.25"
                                value={gstRate}
                                onChange={(e) => setGstRate(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0%</span>
                                <span>28%</span>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <span className="text-xl">ℹ️</span>
                                GST Rates in India
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li><strong>0%:</strong> Essential items (grains, milk, etc.)</li>
                                <li><strong>5%:</strong> Household necessities</li>
                                <li><strong>12%:</strong> Processed foods</li>
                                <li><strong>18%:</strong> Most goods & services</li>
                                <li><strong>28%:</strong> Luxury items</li>
                            </ul>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">GST Summary</h2>

                        {/* Main Result */}
                        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 mb-6 border border-primary-200">
                            <div className="text-sm font-semibold text-gray-600 mb-1">
                                {calculationType === 'exclusive' ? 'Total Amount (Inc. GST)' : 'Net Amount (Exc. GST)'}
                            </div>
                            <div className="text-4xl font-bold text-primary-600">
                                {calculationType === 'exclusive' ? formatCurrency(totalAmount) : formatCurrency(netAmount)}
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-700 font-medium">Net Amount</span>
                                <span className="text-lg font-bold text-gray-900">{formatCurrency(netAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                                <span className="text-gray-700 font-medium">GST Amount ({gstRate}%)</span>
                                <span className="text-lg font-bold text-orange-600">{formatCurrency(gstAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg border border-primary-200">
                                <span className="text-gray-700 font-medium">Total Amount</span>
                                <span className="text-lg font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>

                        {/* Visual Breakdown */}
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-gray-700 mb-3">Amount Breakdown</div>
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                <div
                                    className="bg-primary-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(netAmount / totalAmount) * 100}%` }}
                                >
                                    {((netAmount / totalAmount) * 100).toFixed(1)}%
                                </div>
                                <div
                                    className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: `${(gstAmount / totalAmount) * 100}%` }}
                                >
                                    {((gstAmount / totalAmount) * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-primary-500 rounded"></span>
                                    Net Amount
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-orange-500 rounded"></span>
                                    GST
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GST Component Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="w-full flex justify-between items-center text-left"
                    >
                        <h3 className="text-xl font-bold text-gray-900">GST Component Breakdown (CGST, SGST, IGST)</h3>
                        <span className="text-2xl text-primary-600">{showBreakdown ? '−' : '+'}</span>
                    </button>

                    {showBreakdown && (
                        <div className="mt-6">
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">CGST (Central GST)</div>
                                    <div className="text-2xl font-bold text-green-600">{formatCurrency(cgst)}</div>
                                    <div className="text-xs text-gray-500 mt-1">{(gstRate / 2).toFixed(2)}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">SGST (State GST)</div>
                                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(sgst)}</div>
                                    <div className="text-xs text-gray-500 mt-1">{(gstRate / 2).toFixed(2)}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">IGST (Integrated GST)</div>
                                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(igst)}</div>
                                    <div className="text-xs text-gray-500 mt-1">{gstRate}%</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900">
                                    <strong>Note:</strong> For intra-state transactions, CGST and SGST apply (split equally).
                                    For inter-state transactions, IGST applies (full rate).
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* GST Information */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">About GST Calculator</h3>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-4">
                            Our GST Calculator helps you quickly calculate Goods and Services Tax (GST) in India.
                            Whether you need to add GST to a price or extract GST from a total amount, this tool
                            provides instant, accurate calculations with detailed breakdowns.
                        </p>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">How to Use:</h4>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>GST Exclusive:</strong> Enter the base price (without GST) to calculate the total amount including GST</li>
                            <li><strong>GST Inclusive:</strong> Enter the final price (with GST) to extract the base amount and GST component</li>
                            <li>Select the applicable GST rate (0%, 5%, 12%, 18%, or 28%)</li>
                            <li>View detailed breakdown including CGST, SGST, and IGST components</li>
                        </ul>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">GST Rates in India:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>0% GST:</strong> Essential items like fresh fruits, vegetables, milk, bread, etc.</li>
                            <li><strong>5% GST:</strong> Household necessities, edible oil, sugar, tea, coffee, etc.</li>
                            <li><strong>12% GST:</strong> Processed foods, computers, mobile phones (below ₹25,000)</li>
                            <li><strong>18% GST:</strong> Most goods and services including electronics, restaurants, hotels</li>
                            <li><strong>28% GST:</strong> Luxury items, automobiles, tobacco products, aerated drinks</li>
                        </ul>
                    </div>
                </div>

                {/* Other Calculators */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Other Financial Calculators</h3>
                    <div className="grid md:grid-cols-6 gap-4">
                        <Link
                            href="/calculator/sip"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">📈</div>
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

                        <Link
                            href="/calculator/epf"
                            className="block p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🏦</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">EPF Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate EPF returns</div>
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

                        <Link
                            href="/calculator/emi"
                            className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🧮</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">EMI Calculator</div>
                                    <div className="text-sm text-gray-600">Calculate loan EMI</div>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/calculator/home-loan"
                            className="block p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🏠</div>
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-primary-600">Home Loan</div>
                                    <div className="text-sm text-gray-600">Calculate home loan EMI</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
