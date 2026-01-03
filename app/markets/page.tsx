'use client';

import { useState, useEffect } from 'react';
import PriceCard from '@/components/PriceCard';
import ChartCard from '@/components/ChartCard';
import LastUpdatedTime from '@/components/LastUpdatedTime';
import { marketIndices as initialIndices, stocks as initialStocks, sensexChartData } from '@/lib/mockData';
import { MarketIndex } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketsPage() {
    const [indices, setIndices] = useState<MarketIndex[]>(initialIndices);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/market-indices');
                const json = await res.json();
                if (json.success && json.data.length > 0) {
                    setIndices(json.data);
                    // Use the first index's update time as reference
                    setLastUpdated(json.data[0].lastUpdated);
                }
            } catch (err) {
                console.error('Failed to fetch market data', err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // 1-minute refresh

        return () => clearInterval(interval);
    }, []);

    // NOTE: Stocks are still static mock data for now because we don't have a reliable free API for individual stock list.
    // If the user wants specific stocks dynamic, I would need a specific list of tickers to scrape.
    // For now, making the INDICES dynamic is the first big step requested.

    return (
        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Stock Markets</h1>
                    <p className="text-lg text-gray-600">Live market indices, stocks, and comprehensive market analysis</p>
                </div>

                {/* Market Indices */}
                <section className="mb-12">
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Market Indices</h2>
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
                </section>

                {/* Chart - Keeping static for now as we don't have historical API, only live price scraping */}
                <section className="mb-12">
                    <ChartCard title="Sensex - 30 Day Performance" data={sensexChartData} height={400} />
                </section>

                {/* Stock List */}
                <section>
                    <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">Top Stocks</h2>
                    <div className="card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Symbol
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Change
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Volume
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Market Cap
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {initialStocks.map((stock) => {
                                        const isPositive = stock.change >= 0;
                                        return (
                                            <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{stock.symbol}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{stock.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className={`inline-flex items-center text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                                                        {isPositive ? (
                                                            <TrendingUp className="h-4 w-4 mr-1" />
                                                        ) : (
                                                            <TrendingDown className="h-4 w-4 mr-1" />
                                                        )}
                                                        {isPositive ? '+' : ''}₹{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm text-gray-600">{stock.volume}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="text-sm text-gray-600">{stock.marketCap}</div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Last Updated */}
                <div className="mt-8 text-center">
                    <LastUpdatedTime />
                    {lastUpdated && (
                        <p className="text-xs text-gray-400 mt-2">
                            Live Data Fetched: {new Date(lastUpdated).toLocaleTimeString('en-IN')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
