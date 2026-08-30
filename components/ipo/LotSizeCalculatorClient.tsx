'use client';

import { useState } from 'react';

export default function LotSizeCalculatorClient() {
    const [priceCap, setPriceCap] = useState('100');
    const [lotSize, setLotSize] = useState('150');
    const [budget, setBudget] = useState('200000');

    const price = Number(priceCap) || 0;
    const lot = Number(lotSize) || 0;
    const budgetAmount = Number(budget) || 0;

    const perLotInvestment = price * lot;
    const maxLots = perLotInvestment > 0 ? Math.floor(budgetAmount / perLotInvestment) : 0;
    const totalInvestment = maxLots * perLotInvestment;

    const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price band upper cap (₹)</label>
                    <input type="number" value={priceCap} onChange={e => setPriceCap(e.target.value)} className={inputClass} min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lot size (shares)</label>
                    <input type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} className={inputClass} min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your budget (₹)</label>
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className={inputClass} min={0} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Investment per lot</p>
                    <p className="text-2xl font-bold text-gray-900">₹{perLotInvestment.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Max lots within budget</p>
                    <p className="text-2xl font-bold text-primary-600">{maxLots}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Total investment</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalInvestment.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
                Retail investors can apply for a maximum of ₹2,00,000 worth of shares per application under SEBI rules. This is a
                deterministic calculation based on the numbers you enter — always confirm the actual price band and lot size from the RHP.
            </p>
        </div>
    );
}
