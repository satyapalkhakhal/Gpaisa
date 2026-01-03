'use client';

import { useEffect, useState } from 'react';
import PriceCard from './PriceCard';
import Link from 'next/link';

interface DynamicSilverRatesProps {
    symbol?: string; // Default 'XAG'
    city?: string;
    simpleView?: boolean;
    displayWeight?: number; // Weight in grams to display in simple view
}

export default function DynamicSilverRates({ symbol = 'XAG', city = 'National', simpleView = false, displayWeight = 1 }: DynamicSilverRatesProps) {
    const [rateData, setRateData] = useState<{ price: number; change: number; changePercent: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                setLoading(true);
                let data = null;

                // Check if it's a city symbol (contains '-')
                // If so, use calculator API which gives today's specific rate stats
                if (symbol.includes('-')) {
                    const res = await fetch(`/api/silver/calculator?symbol=${symbol}`);
                    const json = await res.json();
                    if (json.success) {
                        data = {
                            price: json.data.silver.today,
                            change: json.data.silver.differenceAmount,
                            changePercent: json.data.silver.differencePercentage
                        };
                    }
                } else {
                    // Use history API for generic XAG
                    const res = await fetch(`/api/silver/history?symbol=${symbol}&gram=1`);
                    const json = await res.json();
                    if (json.success && json.data.history.length > 0) {
                        const latest = json.data.history[0];
                        data = {
                            price: parseFloat(latest.price),
                            change: parseFloat(latest.differenceAmount),
                            changePercent: parseFloat(latest.differencePercentage)
                        };
                    }
                }

                if (data) {
                    setRateData(data);
                } else {
                    setError('Failed to fetch silver rates');
                }
            } catch (err) {
                console.error(err);
                setError('Error loading rates');
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, [symbol]);

    if (loading) {
        return (
            <div className={simpleView ? "animate-pulse h-10 bg-gray-100 rounded" : "animate-pulse card h-48 bg-gray-100"}></div>
        );
    }

    if (error || !rateData) {
        return simpleView ? <span className="text-red-500 text-xs">Error</span> : (
            <div className="card bg-red-50 border-red-200">
                <p className="text-red-600 text-center">Unavailable</p>
            </div>
        );
    }

    if (simpleView) {
        const isPositive = rateData.changePercent >= 0;
        const price = rateData.price * displayWeight;
        const unitText = displayWeight >= 1000 ? `${displayWeight / 1000} kg` : `${displayWeight}g`;

        return (
            <div className="flex justify-between items-center py-2">
                <div>
                    <p className="font-semibold text-sm text-gray-900">Silver {city === 'National' ? '' : `(${city})`}</p>
                    <p className="text-xs text-gray-500">per {unitText}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    <p className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{rateData.changePercent.toFixed(2)}%
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceCard
                title={`Silver Rate (${city})`}
                value={`₹${rateData.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change={rateData.change}
                changePercent={rateData.changePercent}
                subtitle="per 1 gram"
                variant="silver"
            />
            {/* We could add 1kg card here by calculating */}
            <PriceCard
                title={`Silver Rate (${city})`}
                value={`₹${(rateData.price * 1000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                change={rateData.change * 1000}
                changePercent={rateData.changePercent}
                subtitle="per 1 kg"
                variant="silver"
            />
        </div>
    );
}
