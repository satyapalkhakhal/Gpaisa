'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IpoSubscriptionUpdate } from '@/lib/ipoTypes';

const CATEGORY_COLORS: Record<string, string> = {
    retail: '#4f46e5',
    nii: '#0891b2',
    qib: '#16a34a',
    employee: '#d97706',
    shareholder: '#9333ea',
    overall: '#6b7280',
};

export default function SubscriptionChart({ history }: { history: IpoSubscriptionUpdate[] }) {
    if (history.length === 0) {
        return <p className="text-sm text-gray-400 py-6 text-center">No subscription data yet.</p>;
    }

    const days = Array.from(new Set(history.map(u => u.day_number))).sort();
    const categories = Array.from(new Set(history.map(u => u.category))).filter(c => c !== 'overall');

    const chartData = days.map(day => {
        const row: Record<string, number | string> = { day: `Day ${day}` };
        for (const cat of categories) {
            const entry = history.find(u => u.day_number === day && u.category === cat);
            row[cat] = entry?.subscription_times ?? 0;
        }
        return row;
    });

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={40} unit="x" />
                <Tooltip formatter={(value: number) => [`${value}x`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {categories.map(cat => (
                    <Bar key={cat} dataKey={cat} name={cat.toUpperCase()} fill={CATEGORY_COLORS[cat] || '#6b7280'} radius={[3, 3, 0, 0]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
