'use client';

import { useEffect, useState } from 'react';
import PriceCard from './PriceCard';
import Link from 'next/link';
import { GoldCalculatorData } from '@/types';

interface DynamicGoldRate {
    purity: '24K' | '22K' | '18K';
    pricePerGram: number;
    pricePerTola: number;
    change: number;
    changePercent: number;
}

interface DynamicGoldRatesProps {
    simpleView?: boolean;
}

export default function DynamicGoldRates({ simpleView = false }: DynamicGoldRatesProps) {
    const [goldRates, setGoldRates] = useState<DynamicGoldRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGoldRates = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch history for all three carats (using India for nationwide rates)
                const [data24k, data22k, data18k] = await Promise.all([
                    fetch('/api/gold-history?city=India&carat=24k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=22k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=18k').then(r => r.json())
                ]);

                if (data24k.success && data22k.success && data18k.success &&
                    data24k.data.length > 0 && data22k.data.length > 0 && data18k.data.length > 0) {

                    // Get the latest rate (first item in the array)
                    const latest24k = data24k.data[0];
                    const latest22k = data22k.data[0];
                    const latest18k = data18k.data[0];

                    const rates: DynamicGoldRate[] = [
                        {
                            purity: '24K',
                            pricePerGram: parseFloat(latest24k.rate) / 10, // Rate is per 10g, divide by 10 for per gram
                            pricePerTola: (parseFloat(latest24k.rate) / 10) * 11.66, // 1 tola = 11.66 grams
                            change: parseFloat(latest24k.change) * (parseFloat(latest24k.rate) / 10) / 100, // Calculate absolute change from percentage
                            changePercent: parseFloat(latest24k.change)
                        },
                        {
                            purity: '22K',
                            pricePerGram: parseFloat(latest22k.rate) / 10,
                            pricePerTola: (parseFloat(latest22k.rate) / 10) * 11.66,
                            change: parseFloat(latest22k.change) * (parseFloat(latest22k.rate) / 10) / 100,
                            changePercent: parseFloat(latest22k.change)
                        },
                        {
                            purity: '18K',
                            pricePerGram: parseFloat(latest18k.rate) / 10,
                            pricePerTola: (parseFloat(latest18k.rate) / 10) * 11.66,
                            change: parseFloat(latest18k.change) * (parseFloat(latest18k.rate) / 10) / 100,
                            changePercent: parseFloat(latest18k.change)
                        }
                    ];

                    setGoldRates(rates);
                } else {
                    setError('Failed to fetch gold rates');
                }
            } catch (err) {
                setError('Error loading gold rates');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGoldRates();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card border-t-4 border-primary-600 animate-pulse bg-white">
                        <div className="relative overflow-hidden p-4">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="card bg-red-50 border-red-200">
                <p className="text-red-600 text-center">{error}</p>
            </div>
        );
    }

    if (simpleView) {
        return (
            <div className="space-y-3">
                {goldRates.map((rate) => (
                    <div key={rate.purity} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{rate.purity} Gold</p>
                            <p className="text-xs text-gray-500">per 10g</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-sm text-gray-900">₹{(rate.pricePerGram * 10).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            <p className={`text-xs font-medium ${rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
                <div className="pt-2">
                    <Link href="/gold-rate" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View Historical Trends →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goldRates.map((rate) => (
                <div key={rate.purity}>
                    <PriceCard
                        title={`Gold ${rate.purity}`}
                        value={`₹${(rate.pricePerGram * 10).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        change={rate.change * 10}
                        changePercent={rate.changePercent}
                        subtitle="per 10 grams"
                        variant="gold"
                    />
                    <div className="mt-2 text-center">
                        <p className="text-sm text-gray-600">
                            Per 1g: <span className="font-semibold">₹{rate.pricePerGram.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Per Tola: <span className="font-semibold">₹{rate.pricePerTola.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
