'use client';

import { useEffect, useState } from 'react';
import ChartCard from './ChartCard';
import { ChartDataPoint, GoldHistoryItem } from '@/types';

interface DynamicGoldChartProps {
    carat?: '24k' | '22k' | '18k';
    city?: string;
}

export default function DynamicGoldChart({ carat = '24k', city = 'India' }: DynamicGoldChartProps) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/gold-history?city=${city}&carat=${carat}`);
                const data = await response.json();

                if (data.success && data.data.length > 0) {
                    // Convert history data to chart format
                    // Reverse the array so oldest date is first (for chart display)
                    const chartPoints: ChartDataPoint[] = data.data
                        .reverse()
                        .map((item: GoldHistoryItem) => ({
                            time: formatDateForChart(item.date),
                            value: parseFloat(item.rate) // Keep as per 10g price (API native format)
                        }));

                    setChartData(chartPoints);
                } else {
                    setError('Failed to load chart data');
                }
            } catch (err) {
                setError('Error loading chart data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [carat, city]);

    // Convert "1 January 2026" to "2026-01-01" format for chart
    const formatDateForChart = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-96 bg-gray-100 rounded"></div>
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
        <ChartCard
            title={`Gold Price Trend (${carat.toUpperCase()}) - Last ${chartData.length} Days`}
            data={chartData}
            color="#D4AF37"
            height={400}
        />
    );
}
