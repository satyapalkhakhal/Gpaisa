'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GoldRates {
    '24K': number;
    '22K': number;
    '18K': number;
}

export default function GoldRateStrip() {
    const [goldRates, setGoldRates] = useState<GoldRates | null>(null);
    const [goldChange, setGoldChange] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const todayDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    useEffect(() => {
        const fetchGoldData = async () => {
            try {
                const [data24k, data22k, data18k] = await Promise.all([
                    fetch('/api/gold-history?city=India&carat=24k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=22k').then(r => r.json()),
                    fetch('/api/gold-history?city=India&carat=18k').then(r => r.json()),
                ]);

                if (data24k.success && data22k.success && data18k.success &&
                    data24k.data.length > 0 && data22k.data.length > 0 && data18k.data.length > 0) {

                    const rate24k = parseFloat(data24k.data[0].rate) / 10; // per gram
                    const rate22k = parseFloat(data22k.data[0].rate) / 10;
                    const rate18k = parseFloat(data18k.data[0].rate) / 10;

                    setGoldRates({
                        '24K': Math.round(rate24k),
                        '22K': Math.round(rate22k),
                        '18K': Math.round(rate18k),
                    });

                    // Calculate change for 10g
                    if (data24k.data.length > 1) {
                        const todayRate = parseFloat(data24k.data[0].rate);
                        const yesterdayRate = parseFloat(data24k.data[1].rate);
                        setGoldChange(Math.round(todayRate - yesterdayRate));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch gold rates for strip:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGoldData();
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200/70 px-4 py-3 mb-6 animate-pulse">
                <div className="flex items-center justify-between gap-3">
                    <div className="h-8 bg-amber-200/40 rounded w-32"></div>
                    <div className="flex gap-6">
                        <div className="h-8 bg-amber-200/40 rounded w-20"></div>
                        <div className="h-8 bg-amber-200/40 rounded w-20"></div>
                        <div className="h-8 bg-amber-200/40 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-amber-200/40 rounded w-28"></div>
                </div>
            </div>
        );
    }

    if (!goldRates) return null;

    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

    return (
        <section id="gold-rate-strip" aria-label="Live gold rate India"
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200/70 px-4 py-3 mb-6">

            <div className="flex flex-wrap items-center justify-between gap-3">

                {/* Left — label */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-lg">🪙</span>
                    <div>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Gold Rate Today</p>
                        <p className="text-[10px] text-amber-600">{todayDate} • India</p>
                    </div>
                </div>

                {/* Middle — 3 purity prices */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {([
                        { label: '24K', price: goldRates['24K'], unit: '/gram' },
                        { label: '22K', price: goldRates['22K'], unit: '/gram' },
                        { label: '18K', price: goldRates['18K'], unit: '/gram' },
                    ] as const).map(({ label, price, unit }) => (
                        <div key={label} className="text-center">
                            <p className="text-[10px] font-bold text-amber-700 uppercase">{label}</p>
                            <p className="text-sm font-bold text-gray-900">
                                ₹{price?.toLocaleString('en-IN')}
                                <span className="text-[9px] font-normal text-gray-400 ml-0.5">{unit}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right — change + CTA */}
                <div className="flex items-center gap-3">
                    {goldChange >= 0 ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                            ▲ ₹{goldChange}/10g today
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                            ▼ ₹{Math.abs(goldChange)}/10g today
                        </span>
                    )}
                    <Link href="/gold-rate"
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors border border-amber-200 flex-shrink-0">
                        Full Rates →
                    </Link>
                </div>

            </div>

            {/* City pills — quick access */}
            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-amber-200/50">
                {cities.map(city => (
                    <Link key={city}
                        href={`/gold-rate/${city.toLowerCase()}`}
                        className="text-[10px] font-medium text-amber-700 bg-white/70 hover:bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full transition-colors">
                        {city}
                    </Link>
                ))}
            </div>

        </section>
    );
}
