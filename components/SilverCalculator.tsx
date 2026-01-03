'use client';

import { useState, useEffect, useCallback } from 'react';
import { SilverCity, SilverCalculatorData } from '@/types';
import { Calculator, TrendingUp, TrendingDown, MapPin, Weight } from 'lucide-react';

interface SilverCalculatorProps {
    initialCitySlug?: string;
}

const WEIGHT_PRESETS = [10, 50, 100, 250, 500, 1000];

export default function SilverCalculator({ initialCitySlug }: SilverCalculatorProps) {
    const [cities, setCities] = useState<SilverCity[]>([]);
    const [selectedCity, setSelectedCity] = useState<SilverCity | null>(null);
    const [weight, setWeight] = useState(10);
    const [customWeight, setCustomWeight] = useState('10');
    const [calculatorData, setCalculatorData] = useState<SilverCalculatorData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('/api/silver/cities');
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setCities(data.data);
                    // Try to finding 'Ahmedabad' or default to first
                    let defaultCity;
                    if (initialCitySlug) {
                        defaultCity = data.data.find((c: SilverCity) => c.slug === initialCitySlug);
                    }
                    if (!defaultCity) {
                        defaultCity = data.data.find((c: SilverCity) => c.slug === 'ahmedabad') || data.data[0];
                    }
                    setSelectedCity(defaultCity);
                }
            } catch (err) {
                console.error('Failed to fetch cities', err);
            }
        };
        fetchCities();
    }, [initialCitySlug]);

    const fetchPice = useCallback(async () => {
        if (!selectedCity) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/silver/calculator?symbol=${selectedCity.symbol}`);
            const data = await response.json();

            if (data.success) {
                setCalculatorData(data.data);
            } else {
                setError('Failed to fetch silver rate');
            }
        } catch (err) {
            setError('Error calculating silver price');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedCity]);

    useEffect(() => {
        fetchPice();
    }, [fetchPice]);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityIndex = e.target.selectedIndex;
        if (cities[cityIndex]) {
            setSelectedCity(cities[cityIndex]);
        }
    };

    const handleCustomWeightChange = (value: string) => {
        setCustomWeight(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setWeight(numValue);
        }
    };

    const handlePresetWeight = (w: number) => {
        setWeight(w);
        setCustomWeight(w.toString());
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="card">
            <div className="flex items-center space-x-3 mb-6">
                <Calculator className="h-8 w-8 text-gray-600" />
                <h2 className="text-2xl font-display font-bold text-gray-900">Silver Price Calculator</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    {/* City Select */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>Select City</span>
                        </label>
                        <select
                            value={selectedCity?.slug || ''}
                            onChange={(e) => {
                                const city = cities.find(c => c.slug === e.target.value);
                                if (city) setSelectedCity(city);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                            disabled={cities.length === 0}
                        >
                            {cities.map((city) => (
                                <option key={city.slug} value={city.slug}>
                                    {city.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Weight Input */}
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <Weight className="h-4 w-4" />
                            <span>Weight (Grams)</span>
                        </label>

                        {/* Presets */}
                        <div className="grid grid-cols-6 gap-2 mb-3">
                            {WEIGHT_PRESETS.map((w) => (
                                <button
                                    key={w}
                                    onClick={() => handlePresetWeight(w)}
                                    className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${weight === w
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {w}g
                                </button>
                            ))}
                        </div>

                        <input
                            type="number"
                            value={customWeight}
                            onChange={(e) => handleCustomWeightChange(e.target.value)}
                            min="1"
                            placeholder="Enter weight in grams"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse space-y-4 w-full">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : calculatorData ? (
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Price</p>
                                <p className="text-4xl font-bold text-gray-900">
                                    ₹{formatPrice(calculatorData.silver.today * weight)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">City</p>
                                    <p className="text-lg font-semibold text-gray-900">{selectedCity?.city}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                                    <p className="text-lg font-semibold text-gray-900">{weight}g</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-xs text-gray-500 mb-2">Price Change (Today)</p>
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center space-x-2 ${calculatorData.silver.differenceAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {calculatorData.silver.differenceAmount >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                        <span className="text-lg font-bold">₹{Math.abs(calculatorData.silver.differenceAmount).toFixed(2)}</span>
                                    </div>
                                    <span className={`text-lg font-bold ${calculatorData.silver.differencePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {calculatorData.silver.differencePercentage.toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-800 text-white rounded-lg p-4">
                                <p className="text-xs opacity-90 mb-1">Rate per Gram</p>
                                <p className="text-2xl font-bold">
                                    ₹{formatPrice(calculatorData.silver.today)}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Prices are indicative and exclude taxes/making charges.
                </p>
            </div>
        </div>
    );
}
