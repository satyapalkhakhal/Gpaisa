'use client';

import { useState, useEffect, useCallback } from 'react';
import { IndianCity, GoldCalculatorData } from '@/types';
import { Calculator, TrendingUp, TrendingDown, MapPin, Weight, Coins, Percent, IndianRupee } from 'lucide-react';

const INDIAN_CITIES: IndianCity[] = [
    "Delhi",
    "Chennai",
    "Mumbai",
    "Pune",
    "Hyderabad",
    "Bangalore",
    "Coimbatore",
    "Kolkata",
    "Ahmedabad",
    "Kerala"
];

const CARAT_OPTIONS = [
    { value: '24k', label: '24 Karat (99.9% Pure)' },
    { value: '22k', label: '22 Karat (91.67% Pure)' },
    { value: '18k', label: '18 Karat (75% Pure)' }
];

const WEIGHT_PRESETS = [1, 5, 10, 50, 100];

export default function GoldCalculator() {
    const [city, setCity] = useState<IndianCity>('Mumbai');
    const [carat, setCarat] = useState('24k');
    const [grams, setGrams] = useState(10);
    const [customGrams, setCustomGrams] = useState('10');
    const [makingChargeType, setMakingChargeType] = useState<'percentage' | 'fixed'>('percentage');
    const [makingChargePercentage, setMakingChargePercentage] = useState(10);
    const [makingChargeFixed, setMakingChargeFixed] = useState(0);
    const [includeGST, setIncludeGST] = useState(true);

    // Manual rate input states
    const [useManualRate, setUseManualRate] = useState(false);
    const [manualRate24k, setManualRate24k] = useState('');
    const [manualRate22k, setManualRate22k] = useState('');
    const [manualRate18k, setManualRate18k] = useState('');

    const [calculatorData, setCalculatorData] = useState<GoldCalculatorData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGoldPrice = useCallback(async () => {
        if (useManualRate) {
            // Use manual rates for calculation
            const ratePerGram = carat === '24k' ? parseFloat(manualRate24k) :
                carat === '22k' ? parseFloat(manualRate22k) :
                    parseFloat(manualRate18k);

            if (isNaN(ratePerGram) || ratePerGram <= 0) {
                setError('Please enter a valid gold rate per gram');
                return;
            }

            const totalPrice = ratePerGram * grams;

            setCalculatorData({
                city: city,
                carat: carat,
                grams: grams,
                price: totalPrice.toFixed(2),
                difference: '+0.00',
                percentage: '0.00%'
            });
            setError(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `/api/gold-calculator?city=${city}&carat=${carat}&grams=${grams}`
            );
            const data = await response.json();

            if (data.success) {
                setCalculatorData(data.data);
                // Update manual rate fields with API rates for reference
                const pricePerGram = parseFloat(data.data.price) / grams;
                if (carat === '24k') setManualRate24k(pricePerGram.toFixed(2));
                if (carat === '22k') setManualRate22k(pricePerGram.toFixed(2));
                if (carat === '18k') setManualRate18k(pricePerGram.toFixed(2));
            } else {
                setError('Failed to calculate gold price');
            }
        } catch (err) {
            setError('Error calculating gold price');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [city, carat, grams, useManualRate, manualRate24k, manualRate22k, manualRate18k]);

    useEffect(() => {
        fetchGoldPrice();
    }, [fetchGoldPrice]);

    const handleCustomGramsChange = (value: string) => {
        setCustomGrams(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setGrams(numValue);
        }
    };

    const handlePresetWeight = (weight: number) => {
        setGrams(weight);
        setCustomGrams(weight.toString());
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate total with making charges and GST
    const calculateTotal = () => {
        if (!calculatorData) return null;

        const basePrice = parseFloat(calculatorData.price);

        // Calculate making charges
        let makingCharges = 0;
        if (makingChargeType === 'percentage') {
            makingCharges = (basePrice * makingChargePercentage) / 100;
        } else {
            makingCharges = makingChargeFixed;
        }

        // Calculate subtotal (base + making charges)
        const subtotal = basePrice + makingCharges;

        // Calculate GST (3% on subtotal)
        const gst = includeGST ? (subtotal * 3) / 100 : 0;

        // Calculate final total
        const total = subtotal + gst;

        return {
            basePrice,
            makingCharges,
            subtotal,
            gst,
            total
        };
    };

    const isPositiveChange = calculatorData?.difference.startsWith('+');
    const calculations = calculateTotal();

    return (
        <div className="card">
            <div className="flex items-center space-x-3 mb-6">
                <Calculator className="h-8 w-8 text-primary-600" />
                <h2 className="text-2xl font-display font-bold text-gray-900">Gold Price Calculator</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {/* City Selection */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Select City</span>
                        </label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value as IndianCity)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            {INDIAN_CITIES.map((cityName) => (
                                <option key={cityName} value={cityName}>
                                    {cityName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Carat Selection */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <Coins className="h-4 w-4" />
                            <span>Gold Purity</span>
                        </label>
                        <div className="space-y-2">
                            {CARAT_OPTIONS.map((option) => (
                                <label
                                    key={option.value}
                                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${carat === option.value
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="carat"
                                        value={option.value}
                                        checked={carat === option.value}
                                        onChange={(e) => setCarat(e.target.value)}
                                        className="mr-3 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="font-medium text-gray-900">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Weight Selection */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <Weight className="h-4 w-4" />
                            <span>Weight (Grams)</span>
                        </label>

                        {/* Preset Buttons */}
                        <div className="grid grid-cols-5 gap-2 mb-3">
                            {WEIGHT_PRESETS.map((weight) => (
                                <button
                                    key={weight}
                                    onClick={() => handlePresetWeight(weight)}
                                    className={`px-3 py-2 rounded-lg font-medium transition-all ${grams === weight
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {weight}g
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <input
                            type="number"
                            value={customGrams}
                            onChange={(e) => handleCustomGramsChange(e.target.value)}
                            min="0.1"
                            step="0.1"
                            placeholder="Enter custom weight"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Manual Rate Input Toggle */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                                <IndianRupee className="h-4 w-4" />
                                <span>Gold Rate Source</span>
                            </label>
                            <button
                                onClick={() => setUseManualRate(!useManualRate)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${useManualRate
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {useManualRate ? 'Manual Rate' : 'Live Rate'}
                            </button>
                        </div>

                        {useManualRate && (
                            <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-800 mb-3">
                                    <strong>Enter custom rates per gram:</strong> Input your local jeweler&apos;s rates for accurate calculations.
                                </p>

                                {/* 24K Rate Input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        24K Gold Rate (per gram)
                                    </label>
                                    <input
                                        type="number"
                                        value={manualRate24k}
                                        onChange={(e) => setManualRate24k(e.target.value)}
                                        placeholder="e.g., 7500"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* 22K Rate Input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        22K Gold Rate (per gram)
                                    </label>
                                    <input
                                        type="number"
                                        value={manualRate22k}
                                        onChange={(e) => setManualRate22k(e.target.value)}
                                        placeholder="e.g., 6875"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* 18K Rate Input */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        18K Gold Rate (per gram)
                                    </label>
                                    <input
                                        type="number"
                                        value={manualRate18k}
                                        onChange={(e) => setManualRate18k(e.target.value)}
                                        placeholder="e.g., 5625"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Making Charges */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <Percent className="h-4 w-4" />
                            <span>Making Charges</span>
                        </label>

                        {/* Making Charge Type Toggle */}
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => setMakingChargeType('percentage')}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${makingChargeType === 'percentage'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Percentage
                            </button>
                            <button
                                onClick={() => setMakingChargeType('fixed')}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${makingChargeType === 'fixed'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Fixed Amount
                            </button>
                        </div>

                        {makingChargeType === 'percentage' ? (
                            <div>
                                <input
                                    type="number"
                                    value={makingChargePercentage}
                                    onChange={(e) => setMakingChargePercentage(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    placeholder="Enter percentage"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-600 mt-1">Typical range: 6-15%</p>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="number"
                                    value={makingChargeFixed}
                                    onChange={(e) => setMakingChargeFixed(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="100"
                                    placeholder="Enter fixed amount"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-600 mt-1">Enter amount in ₹</p>
                            </div>
                        )}
                    </div>

                    {/* GST Toggle */}
                    <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeGST}
                                onChange={(e) => setIncludeGST(e.target.checked)}
                                className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                            />
                            <div>
                                <span className="text-sm font-semibold text-gray-700">Include GST (3%)</span>
                                <p className="text-xs text-gray-600">GST is calculated on gold price + making charges</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border-2 border-primary-200">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse space-y-4 w-full">
                                <div className="h-8 bg-primary-200 rounded w-3/4"></div>
                                <div className="h-12 bg-primary-200 rounded"></div>
                                <div className="h-6 bg-primary-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-red-600 text-center">{error}</p>
                        </div>
                    ) : calculatorData && calculations ? (
                        <div className="space-y-4">
                            {/* Price Breakdown */}
                            <div className="bg-white rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Gold Price ({calculatorData.carat.toUpperCase()})</span>
                                    <span className="font-semibold text-gray-900">₹{formatPrice(calculations.basePrice)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Making Charges</span>
                                    <span className="font-semibold text-gray-900">₹{formatPrice(calculations.makingCharges)}</span>
                                </div>

                                {includeGST && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">GST (3%)</span>
                                        <span className="font-semibold text-gray-900">₹{formatPrice(calculations.gst)}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary-600">₹{formatPrice(calculations.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">City</p>
                                    <p className="text-sm font-semibold text-gray-900">{calculatorData.city}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-600 mb-1">Weight</p>
                                    <p className="text-sm font-semibold text-gray-900">{calculatorData.grams}g</p>
                                </div>
                            </div>

                            {/* Price Change */}
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 mb-2">Price Change (Base Gold)</p>
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center space-x-2 ${isPositiveChange ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {isPositiveChange ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span className="text-sm font-bold">
                                            {calculatorData.difference}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold ${isPositiveChange ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {calculatorData.percentage}
                                    </span>
                                </div>
                            </div>

                            {/* Price per gram */}
                            <div className="bg-primary-600 text-white rounded-lg p-4">
                                <p className="text-xs opacity-90 mb-1">Price per gram ({calculatorData.carat.toUpperCase()})</p>
                                <p className="text-xl font-bold">
                                    ₹{formatPrice(parseFloat(calculatorData.price) / calculatorData.grams)}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Prices are indicative and may vary. Making charges vary by jeweler and design complexity (typically 6-15% or fixed per gram). GST is 3% on gold + making charges. Please verify with local jewelers before making any purchase decisions.
                </p>
            </div>
        </div>
    );
}
