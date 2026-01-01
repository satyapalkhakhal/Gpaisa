'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/types';

interface ChartCardProps {
    title: string;
    data: ChartDataPoint[];
    color?: string;
    height?: number;
}

export default function ChartCard({ title, data, color = '#1E7F43', height = 300 }: ChartCardProps) {
    return (
        <div className="card">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="time"
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) => value.toLocaleString('en-IN')}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
                        formatter={(value: number) => [value.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 'Value']}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
