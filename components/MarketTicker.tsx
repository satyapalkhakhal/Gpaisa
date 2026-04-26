'use client';

import { useState, useEffect } from 'react';
import { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketTicker() {
    const [indices, setIndices] = useState<MarketIndex[]>([]);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchIndices = async () => {
            try {
                const res = await fetch('/api/market-indices');
                const json = await res.json();
                if (json.success && mounted && json.data.length > 0) {
                    setIndices(json.data);
                    setIsLive(true);
                }
            } catch (err) {
                console.error('Failed to fetch indices', err);
            }
        };

        fetchIndices();

        // Refresh every 60 seconds
        const interval = setInterval(fetchIndices, 60000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    // Don't render the ticker at all if we have no live data
    // This prevents showing stale mock data which damages credibility
    if (!isLive || indices.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden border-b border-gray-700">
            <div className="relative flex">
                {/* First set of items */}
                <div className="flex items-center space-x-8 px-4 py-3 ticker-scroll whitespace-nowrap">
                    {indices.map((index, i) => (
                        <div key={`ticker-1-${i}`} className="flex items-center space-x-3">
                            <span className="font-semibold text-sm">{index.name}</span>
                            <span className="text-sm font-mono">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className={`flex items-center text-xs font-medium ${index.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                                {index.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                            </span>
                            {index.lastUpdated && (
                                <span className="text-[10px] text-gray-500 hidden md:inline">
                                    • {new Date(index.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            <span className="text-gray-500">|</span>
                        </div>
                    ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-8 px-4 py-3 ticker-scroll whitespace-nowrap" aria-hidden="true">
                    {indices.map((index, i) => (
                        <div key={`ticker-2-${i}`} className="flex items-center space-x-3">
                            <span className="font-semibold text-sm">{index.name}</span>
                            <span className="text-sm font-mono">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className={`flex items-center text-xs font-medium ${index.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                                {index.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                            </span>
                            {index.lastUpdated && (
                                <span className="text-[10px] text-gray-500 hidden md:inline">
                                    • {new Date(index.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                            <span className="text-gray-500">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
