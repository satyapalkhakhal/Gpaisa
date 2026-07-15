'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';

interface GoldRates {
    '24K': number;
    '22K': number;
    '18K': number;
}

export default function GoldRateStrip() {
    const [goldRates, setGoldRates] = useState<GoldRates | null>(null);
    const [goldChange, setGoldChange] = useState<number>(0);
    const [loading, setLoading] = useState(true);

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
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 mb-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-40 mb-2"></div>
                <div className="h-5 bg-gray-100 rounded w-full max-w-sm"></div>
            </div>
        );
    }

    if (!goldRates) return null;

    const isUp = goldChange >= 0;

    return (
        <section id="gold-rate-strip" aria-label="Live gold rate India"
            className="flex bg-white rounded-lg border border-gray-200 overflow-hidden mb-5">
            <div className="w-1 bg-gradient-to-b from-amber-500 to-yellow-500 shrink-0" />
            <div className="flex-1 min-w-0 px-3.5 py-2.5">

                {/* Row 1 — identity + change + CTA */}
                <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        Gold Rate Today
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            {isUp ? '▲' : '▼'} ₹{Math.abs(goldChange)}/10g
                        </span>
                        <Link href="/gold-rate" className="text-xs font-bold text-amber-700 hover:text-amber-800">
                            Full Rates →
                        </Link>
                    </div>
                </div>

                {/* Row 2 — the three rates, one clean line */}
                <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                    {([
                        { label: '24K', price: goldRates['24K'] },
                        { label: '22K', price: goldRates['22K'] },
                        { label: '18K', price: goldRates['18K'] },
                    ] as const).map(({ label, price }, i) => (
                        <span key={label} className="flex items-baseline gap-1">
                            {i > 0 && <span className="text-gray-300 mr-2">·</span>}
                            <span className="text-[11px] font-bold text-amber-700">{label}</span>
                            <span className="text-sm font-bold text-gray-900">₹{price?.toLocaleString('en-IN')}</span>
                        </span>
                    ))}
                    <span className="text-[11px] text-gray-400">/gram</span>
                </div>
            </div>
        </section>
    );
}
