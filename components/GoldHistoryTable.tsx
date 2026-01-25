'use client';

import { useEffect, useState } from 'react';
import { GoldHistoryItem } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface GoldHistoryTableProps {
    city?: string;
    carat?: string;
}

export default function GoldHistoryTable({ city = 'India', carat = '24k' }: GoldHistoryTableProps) {
    const [historyData, setHistoryData] = useState<GoldHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGoldHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/gold-history?city=${city}&carat=${carat}`);
                const data = await response.json();

                if (data.success) {
                    setHistoryData(data.data);
                } else {
                    setError('Failed to load gold history');
                }
            } catch (err) {
                setError('Error fetching gold history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGoldHistory();
    }, [city, carat]);

    if (loading) {
        return (
            <div className="card">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    {[...Array(10)].map((_, i) => (
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
                    <thead className="bg-primary-50">
                        <tr>
                            <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-3 py-3 md:px-6 md:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Rate (₹/10g)
                            </th>
                            <th className="px-3 py-3 md:px-6 md:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Change (%)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {historyData.map((item, index) => {
                            const changeValue = parseFloat(item.change);
                            const isPositive = changeValue >= 0;
                            const rate = parseFloat(item.rate);

                            return (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.date}
                                    </td>
                                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                        ₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-right">
                                        <div className={`inline-flex items-center justify-end space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {isPositive ? (
                                                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />
                                            )}
                                            <span className="font-semibold text-xs md:text-sm">
                                                {isPositive ? '+' : ''}{changeValue}%
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
