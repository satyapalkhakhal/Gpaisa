'use client';

import { useState, useEffect } from 'react';
import PriceCard from '@/components/PriceCard';
import { MarketIndex } from '@/types';

interface MarketsIndicesClientProps {
    initialIndices: MarketIndex[];
}

export default function MarketsIndicesClient({ initialIndices }: MarketsIndicesClientProps) {
    const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
    const [lastUpdated, setLastUpdated] = useState<string | null>(initialIndices[0]?.lastUpdated ?? null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/market-indices');
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    setIndices(json.data);
                    setLastUpdated(json.data[0].lastUpdated);
                }
            } catch (err) {
                console.error('Failed to fetch market data', err);
            }
        };

        const interval = setInterval(fetchData, 60000); // 1-minute refresh
        return () => clearInterval(interval);
    }, []);

    if (indices.length === 0) {
        return (
            <p className="text-sm text-gray-500">Live index data is temporarily unavailable. Please check back shortly.</p>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {indices.map((index) => (
                    <PriceCard
                        key={index.symbol}
                        title={index.name}
                        value={index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        change={index.change}
                        changePercent={index.changePercent}
                        subtitle={index.symbol}
                        variant={index.change >= 0 ? 'success' : 'danger'}
                    />
                ))}
            </div>
            {lastUpdated && (
                <p className="text-xs text-gray-400 mt-4 text-right">
                    Live data fetched: {new Date(lastUpdated).toLocaleTimeString('en-IN')} IST
                </p>
            )}
        </>
    );
}
