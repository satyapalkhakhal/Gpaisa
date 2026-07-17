'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, Clock, ArrowRight } from 'lucide-react';

interface HeroData {
    price24k10g: number;
    change: number;
    changePercent: number;
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    lastUpdated: string;
}

function formatINR(v: number): string {
    return '₹' + Math.round(v).toLocaleString('en-IN');
}

function formatTime(d: Date): string {
    return d.toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'Asia/Kolkata',
    }) + ' IST';
}

interface GoldDashboardHeroProps {
    todayDate: string;
    initialData?: HeroData | null;
}

export default function GoldDashboardHero({ todayDate, initialData = null }: GoldDashboardHeroProps) {
    const [data, setData] = useState<HeroData | null>(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/gold-history?city=India&carat=24k');
                const json = await res.json();
                if (json.success && json.data?.length >= 2) {
                    const today = json.data[0];
                    const yesterday = json.data[1];
                    const rate = parseFloat(today.rate);
                    const prevRate = parseFloat(yesterday.rate);
                    const diff = rate - prevRate;
                    const pct = prevRate > 0 ? (diff / prevRate) * 100 : 0;
                    const trend: 'Bullish' | 'Bearish' | 'Neutral' =
                        pct > 0.1 ? 'Bullish' : pct < -0.1 ? 'Bearish' : 'Neutral';
                    setData({
                        price24k10g: rate,
                        change: diff,
                        changePercent: pct,
                        trend,
                        lastUpdated: formatTime(new Date()),
                    });
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const TrendIcon = data?.trend === 'Bullish' ? TrendingUp : data?.trend === 'Bearish' ? TrendingDown : Minus;
    const trendColor = data?.trend === 'Bullish' ? 'text-emerald-600' : data?.trend === 'Bearish' ? 'text-red-600' : 'text-gray-500';
    const trendBg = data?.trend === 'Bullish' ? 'bg-emerald-50' : data?.trend === 'Bearish' ? 'bg-red-50' : 'bg-gray-100';

    return (
        <section className="mb-8 sm:mb-12">
            {/* H1 Header */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-2 sm:mb-3">
                    Gold Rate Today in India <span className="text-amber-500">(Live)</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                    Latest gold price, trends, and investment insights — {todayDate}
                </p>
            </div>

            {/* Hero Price Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 px-4 sm:px-6 py-3">
                    <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide uppercase">
                        24K Gold — Live Price
                    </p>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-12 bg-gray-200 rounded w-48" />
                            <div className="h-6 bg-gray-100 rounded w-32" />
                        </div>
                    ) : data ? (
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
                            {/* Price Block */}
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price per 10 Grams</p>
                                <p className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-gray-900 tabular-nums leading-none">
                                    {formatINR(data.price24k10g)}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${data.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                        {data.change >= 0 ? '🔼' : '🔽'}
                                        {data.change >= 0 ? '+' : ''}{formatINR(Math.abs(data.change))}
                                    </span>
                                    <span className={`text-sm font-semibold ${data.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
                                    </span>
                                </div>
                            </div>

                            {/* Trend + Updated */}
                            <div className="flex flex-row md:flex-col gap-3 md:gap-2 md:items-end">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${trendBg} ${trendColor}`}>
                                    <TrendIcon className="h-4 w-4" />
                                    {data.trend}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    <span>Updated: {data.lastUpdated}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Unable to load price data</p>
                    )}
                </div>

                {/* CTA Buttons */}
                <div className="border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3 bg-gray-50/50">
                    <Link href="#city-gold-rates" className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                        Check City-wise Gold Rates <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/gold-vs-silver" className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                        Gold vs Silver Comparison <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
