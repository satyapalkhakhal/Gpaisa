'use client';

import { marketIndices } from '@/lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketTicker() {
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden border-b border-gray-700">
            <div className="relative flex">
                {/* First set of items */}
                <div className="flex items-center space-x-8 px-4 py-3 ticker-scroll whitespace-nowrap">
                    {marketIndices.map((index, i) => (
                        <div key={`ticker-1-${i}`} className="flex items-center space-x-3">
                            <span className="font-semibold text-sm">{index.name}</span>
                            <span className="text-sm font-mono">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className={`flex items-center text-xs font-medium ${index.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                                {index.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                            </span>
                            <span className="text-gray-500">|</span>
                        </div>
                    ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-8 px-4 py-3 ticker-scroll whitespace-nowrap" aria-hidden="true">
                    {marketIndices.map((index, i) => (
                        <div key={`ticker-2-${i}`} className="flex items-center space-x-3">
                            <span className="font-semibold text-sm">{index.name}</span>
                            <span className="text-sm font-mono">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className={`flex items-center text-xs font-medium ${index.change >= 0 ? 'text-success-400' : 'text-danger-400'}`}>
                                {index.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                            </span>
                            <span className="text-gray-500">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
