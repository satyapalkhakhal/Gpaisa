'use client';

import { useEffect, useState } from 'react';
import { SilverHistoryItem } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface SilverHistoryTableProps {
    symbol?: string; // e.g. XAG or XAG-AHME
    gram?: number;
}

export default function SilverHistoryTable({ symbol = 'XAG', gram = 10 }: SilverHistoryTableProps) {
    const [historyData, setHistoryData] = useState<SilverHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [historyGram, setHistoryGram] = useState<number>(1);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/silver/history?symbol=${symbol}&gram=${gram}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setHistoryData(data.data.history);
                    setHistoryGram(data.data.gram);
                } else {
                    setError('Failed to load history');
                }
            } catch (err) {
                setError('Error loading history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [symbol, gram]);

    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
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
        <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Rate (₹/{historyGram}g)
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Change
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {historyData.slice(0, 10).map((item, index) => {
                            const changeValue = parseFloat(item.differencePercentage);
                            const isPositive = changeValue >= 0;
                            const rate = parseFloat(item.price);

                            return (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                        ₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className={`inline-flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPositive ? (
                                                <TrendingUp className="h-4 w-4" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4" />
                                            )}
                                            <span className="font-semibold">
                                                {Math.abs(changeValue).toFixed(2)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
