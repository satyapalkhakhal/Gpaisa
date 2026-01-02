'use client';

import { useEffect, useState } from 'react';
import PriceCard from './PriceCard';
import { GoldCalculatorData } from '@/types';

interface DynamicGoldRate {
    purity: '24K' | '22K' | '18K';
    pricePerGram: number;
    pricePerTola: number;
    change: number;
    changePercent: number;
}

export default function DynamicGoldRates() {
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
                    <div key={i} className="card animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
