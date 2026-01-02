'use client';

import { useState, useEffect } from 'react';
import { IndianCity, GoldCalculatorData } from '@/types';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

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

interface CityRateData {
    city: string;
    rate24k: string;
    rate22k: string;
    rate18k: string;
    change24k: string;
    percentage24k: string;
}

export default function CityWiseGoldRates() {
    const [cityRates, setCityRates] = useState<CityRateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCarat, setSelectedCarat] = useState<'24k' | '22k' | '18k'>('24k');

    useEffect(() => {
        const fetchAllCityRates = async () => {
            setLoading(true);
            const rates: CityRateData[] = [];

            for (const city of INDIAN_CITIES) {
                try {
                    // Fetch rates for all carats
                    const [data24k, data22k, data18k] = await Promise.all([
                        fetch(`/api/gold-calculator?city=${city}&carat=24k&grams=10`).then(r => r.json()),
                        fetch(`/api/gold-calculator?city=${city}&carat=22k&grams=10`).then(r => r.json()),
                        fetch(`/api/gold-calculator?city=${city}&carat=18k&grams=10`).then(r => r.json())
                    ]);

                    if (data24k.success && data22k.success && data18k.success) {
                        rates.push({
                            city: data24k.data.city,
                            rate24k: (parseFloat(data24k.data.price) / 10).toFixed(2),
                            rate22k: (parseFloat(data22k.data.price) / 10).toFixed(2),
                            rate18k: (parseFloat(data18k.data.price) / 10).toFixed(2),
                            change24k: data24k.data.difference,
                            percentage24k: data24k.data.percentage
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching rates for ${city}:`, error);
                }
            }

            setCityRates(rates);
            setLoading(false);
        };

        fetchAllCityRates();
    }, []);

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return numPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getRateForCarat = (cityRate: CityRateData) => {
        switch (selectedCarat) {
            case '24k':
                return cityRate.rate24k;
            case '22k':
                return cityRate.rate22k;
            case '18k':
                return cityRate.rate18k;
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <MapPin className="h-7 w-7 text-primary-600" />
                    <h2 className="text-2xl font-display font-bold text-gray-900">City-Wise Gold Rates</h2>
                </div>

                {/* Carat Selector */}
                <div className="flex space-x-2">
                    {(['24k', '22k', '18k'] as const).map((carat) => (
                        <button
                            key={carat}
                            onClick={() => setSelectedCarat(carat)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCarat === carat
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {carat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-primary-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                City
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Rate (₹/gram)
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Per 10g
                            </th>
                            {selectedCarat === '24k' && (
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Change
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cityRates.map((cityRate) => {
                            const rate = getRateForCarat(cityRate);
                            const isPositive = cityRate.change24k.startsWith('+');

                            return (
                                <tr key={cityRate.city} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{cityRate.city}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                        ₹{formatPrice(rate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-primary-600">
                                        ₹{formatPrice((parseFloat(rate) * 10).toString())}
                                    </td>
                                    {selectedCarat === '24k' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <div className={`inline-flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {isPositive ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4" />
                                                )}
                                                <span className="font-semibold">{cityRate.percentage24k}</span>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> Prices shown are per gram and per 10 grams for {selectedCarat.toUpperCase()} gold. Switch between carats to compare prices.
                </p>
            </div>
        </div>
    );
}
