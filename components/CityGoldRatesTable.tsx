'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CITIES = [
    "Delhi", "Chennai", "Mumbai", "Pune", "Hyderabad",
    "Bangalore", "Coimbatore", "Kolkata", "Ahmedabad", "Kerala"
];

interface CityRate {
    city: string;
    slug: string;
    rate24k: number;
    rate22k: number;
    rate18k: number;
    change: number;
    changePercent: string;
    loaded: boolean;
}

export default function CityGoldRatesTable() {
    const [cityRates, setCityRates] = useState<CityRate[]>(
        CITIES.map(city => ({
            city,
            slug: city.toLowerCase(),
            rate24k: 0,
            rate22k: 0,
            rate18k: 0,
            change: 0,
            changePercent: '0%',
            loaded: false,
        }))
    );
    const [loading, setLoading] = useState(true);
    const [selectedCarat, setSelectedCarat] = useState<'24k' | '22k' | '18k'>('24k');

    useEffect(() => {
        const fetchCityRates = async () => {
            // Fetch all cities in parallel
            const results = await Promise.allSettled(
                CITIES.map(async (city) => {
                    const [res24k, res22k, res18k] = await Promise.all([
                        fetch(`/api/gold-calculator?city=${city}&carat=24k&grams=10`).then(r => r.json()),
                        fetch(`/api/gold-calculator?city=${city}&carat=22k&grams=10`).then(r => r.json()),
                        fetch(`/api/gold-calculator?city=${city}&carat=18k&grams=10`).then(r => r.json()),
                    ]);

                    return {
                        city,
                        slug: city.toLowerCase(),
                        rate24k: res24k.success ? parseFloat(res24k.data.price) : 0,
                        rate22k: res22k.success ? parseFloat(res22k.data.price) : 0,
                        rate18k: res18k.success ? parseFloat(res18k.data.price) : 0,
                        change: res24k.success ? parseFloat(res24k.data.difference) : 0,
                        changePercent: res24k.success ? res24k.data.percentage : '0%',
                        loaded: true,
                    };
                })
            );

            const rates = results.map((result, idx) => {
                if (result.status === 'fulfilled') return result.value;
                return { ...cityRates[idx], loaded: true };
            });

            setCityRates(rates);
            setLoading(false);
        };

        fetchCityRates();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getRate = (r: CityRate) => {
        const raw = selectedCarat === '24k' ? r.rate24k : selectedCarat === '22k' ? r.rate22k : r.rate18k;
        return raw; // per 10g
    };

    const formatINR = (n: number) =>
        n > 0 ? '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—';

    return (
        <section className="mb-16" aria-labelledby="city-rates-table-heading" id="city-gold-rates">
            {/* Header */}
            <div className="text-center mb-6">
                <h2
                    id="city-rates-table-heading"
                    className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2"
                >
                    City-Wise Gold Rate Today
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                    Compare live gold prices across India&apos;s top 10 cities. Click any city to see detailed rates, history, calculator &amp; buying guide.
                </p>
            </div>

            <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Carat Selector */}
                <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-600 mr-1">Purity:</span>
                    {(['24k', '22k', '18k'] as const).map(carat => (
                        <button
                            key={carat}
                            onClick={() => setSelectedCarat(carat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                selectedCarat === carat
                                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {carat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">City</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Per Gram</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Per 10g</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold hidden sm:table-cell">Per 8g</th>
                                {selectedCarat === '24k' && (
                                    <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Change</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cityRates.map((cityRate, idx) => {
                                const per10g = getRate(cityRate);
                                const perGram = per10g / 10;
                                const per8g = perGram * 8;
                                const isPositive = cityRate.change > 0;
                                const isNegative = cityRate.change < 0;
                                const isZero = cityRate.change === 0;

                                return (
                                    <tr
                                        key={cityRate.city}
                                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-amber-50 transition-colors group`}
                                    >
                                        <td className="px-4 sm:px-6 py-3.5">
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/gold-rate/${cityRate.slug}`}
                                                    className="flex items-center gap-2 group/link"
                                                >
                                                    <MapPin className="h-4 w-4 text-amber-500 group-hover/link:text-amber-600 transition-colors flex-shrink-0" />
                                                    <span className="font-semibold text-gray-900 group-hover/link:text-amber-700 transition-colors whitespace-nowrap">
                                                        {cityRate.city}
                                                    </span>
                                                    <span className="text-xs text-amber-600 opacity-0 group-hover/link:opacity-100 transition-opacity hidden sm:inline">
                                                        →
                                                    </span>
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                                            {loading ? (
                                                <div className="h-4 bg-gray-200 rounded w-16 ml-auto animate-pulse"></div>
                                            ) : (
                                                formatINR(Math.round(perGram))
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-gray-900 whitespace-nowrap">
                                            {loading ? (
                                                <div className="h-4 bg-gray-200 rounded w-20 ml-auto animate-pulse"></div>
                                            ) : (
                                                formatINR(Math.round(per10g))
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap hidden sm:table-cell">
                                            {loading ? (
                                                <div className="h-4 bg-gray-200 rounded w-18 ml-auto animate-pulse"></div>
                                            ) : (
                                                formatINR(Math.round(per8g))
                                            )}
                                        </td>
                                        {selectedCarat === '24k' && (
                                            <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                                                {loading ? (
                                                    <div className="h-4 bg-gray-200 rounded w-14 ml-auto animate-pulse"></div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                                                        isPositive ? 'text-emerald-600' :
                                                        isNegative ? 'text-red-600' :
                                                        'text-gray-400'
                                                    }`}>
                                                        {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                                                        {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                                                        {isZero && <Minus className="h-3.5 w-3.5" />}
                                                        {cityRate.changePercent}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer note */}
                <div className="px-4 sm:px-6 py-3 bg-amber-50/50 border-t border-amber-100 text-xs text-gray-500">
                    <strong>Note:</strong> Prices shown are for {selectedCarat.toUpperCase()} gold per gram, 8 grams, and 10 grams. Rates may vary slightly at individual jewellers due to making charges and GST.
                    Click on any city name to view detailed rates, calculator, and buying guide.
                </div>
            </div>
        </section>
    );
}
