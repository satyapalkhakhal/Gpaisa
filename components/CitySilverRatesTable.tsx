'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CityRate {
    city: string;
    slug: string;
    symbol: string;
    pricePerKg: number;
    pricePerGram: number;
    change: number;
    changePercent: number;
    loaded: boolean;
}

const SILVER_CITIES = [
    // { city: 'Delhi', slug: 'delhi', symbol: 'SILVER_Delhi' },
    { city: 'Mumbai', slug: 'mumbai', symbol: 'SILVER_Mumbai' },
    { city: 'Chennai', slug: 'chennai', symbol: 'SILVER_Chennai' },
    { city: 'Bangalore', slug: 'bangalore', symbol: 'SILVER_Bangalore' },
    { city: 'Hyderabad', slug: 'hyderabad', symbol: 'SILVER_Hyderabad' },
    { city: 'Kolkata', slug: 'kolkata', symbol: 'SILVER_Kolkata' },
    { city: 'Pune', slug: 'pune', symbol: 'SILVER_Pune' },
    { city: 'Ahmedabad', slug: 'ahmedabad', symbol: 'SILVER_Ahmedabad' },
    { city: 'Jaipur', slug: 'jaipur', symbol: 'SILVER_Jaipur' },
    { city: 'Lucknow', slug: 'lucknow', symbol: 'SILVER_Lucknow' },
];

export default function CitySilverRatesTable() {
    const [cityRates, setCityRates] = useState<CityRate[]>(
        SILVER_CITIES.map(c => ({
            ...c,
            pricePerKg: 0,
            pricePerGram: 0,
            change: 0,
            changePercent: 0,
            loaded: false,
        }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            const results = await Promise.allSettled(
                SILVER_CITIES.map(async (cityObj) => {
                    const res = await fetch(`/api/silver/calculator?symbol=${cityObj.symbol}`);
                    const data = await res.json();

                    if (data.success && data.data?.silver) {
                        const s = data.data.silver;
                        return {
                            ...cityObj,
                            pricePerKg: s.today || 0,
                            pricePerGram: (s.today || 0) / 1000,
                            change: s.differenceAmount || 0,
                            changePercent: s.differencePercentage || 0,
                            loaded: true,
                        };
                    }
                    return { ...cityObj, pricePerKg: 0, pricePerGram: 0, change: 0, changePercent: 0, loaded: true };
                })
            );

            const rates = results.map((r, idx) =>
                r.status === 'fulfilled' ? r.value : { ...cityRates[idx], loaded: true }
            );
            setCityRates(rates);
            setLoading(false);
        };

        fetchRates();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatINR = (n: number) =>
        n > 0 ? '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—';

    return (
        <section className="mb-16" aria-labelledby="city-silver-rates-heading" id="city-silver-rates">
            <div className="text-center mb-6">
                <h2
                    id="city-silver-rates-heading"
                    className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2"
                >
                    City-Wise Silver Rate Today
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                    Compare live silver prices across India&apos;s major cities. Click any city for detailed rates, history &amp; buying guide.
                </p>
            </div>

            <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 sm:px-6 py-3.5 text-left font-semibold">City</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Per Gram</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Per 100g</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Per Kg</th>
                                <th className="px-4 sm:px-6 py-3.5 text-right font-semibold">Change</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cityRates.map((r, idx) => {
                                const isPositive = r.change > 0;
                                const isNegative = r.change < 0;

                                return (
                                    <tr
                                        key={r.slug}
                                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-slate-50 transition-colors group`}
                                    >
                                        <td className="px-4 sm:px-6 py-3.5">
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                                                </div>
                                            ) : (
                                                <Link href={`/silver-rate/${r.slug}`} className="flex items-center gap-2 group/link">
                                                    <MapPin className="h-4 w-4 text-slate-400 group-hover/link:text-slate-600 transition-colors flex-shrink-0" />
                                                    <span className="font-semibold text-gray-900 group-hover/link:text-slate-700 transition-colors whitespace-nowrap">
                                                        {r.city}
                                                    </span>
                                                    <span className="text-xs text-slate-500 opacity-0 group-hover/link:opacity-100 transition-opacity hidden sm:inline">→</span>
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                                            {loading ? <div className="h-4 bg-gray-200 rounded w-14 ml-auto animate-pulse" /> : formatINR(Math.round(r.pricePerGram))}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                                            {loading ? <div className="h-4 bg-gray-200 rounded w-18 ml-auto animate-pulse" /> : formatINR(Math.round(r.pricePerGram * 100))}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-gray-900 whitespace-nowrap">
                                            {loading ? <div className="h-4 bg-gray-200 rounded w-20 ml-auto animate-pulse" /> : formatINR(Math.round(r.pricePerKg))}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                                            {loading ? (
                                                <div className="h-4 bg-gray-200 rounded w-14 ml-auto animate-pulse" />
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600' : isNegative ? 'text-red-600' : 'text-gray-400'
                                                    }`}>
                                                    {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                                                    {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                                                    {!isPositive && !isNegative && <Minus className="h-3.5 w-3.5" />}
                                                    {r.changePercent !== 0 ? `${r.changePercent > 0 ? '+' : ''}${r.changePercent.toFixed(2)}%` : '0%'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 sm:px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-gray-500">
                    <strong>Note:</strong> Prices shown are for 999 fine silver. Rates may vary at jewellers due to making charges and GST.
                    Click on any city name for detailed rates, calculator, and buying guide.
                </div>
            </div>
        </section>
    );
}
