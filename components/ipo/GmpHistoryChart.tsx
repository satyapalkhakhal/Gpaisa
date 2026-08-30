'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { IpoGmpUpdate } from '@/lib/ipoTypes';

export default function GmpHistoryChart({ history }: { history: IpoGmpUpdate[] }) {
    if (history.length < 2) {
        return <p className="text-sm text-gray-400 py-6 text-center">Not enough GMP history yet to chart a trend.</p>;
    }

    // history is newest-first from the API; charts read left-to-right chronologically.
    const chartData = [...history].reverse().map(u => ({
        time: new Date(u.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        gmp: u.gmp_value,
    }));

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="gmpFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={40} />
                <Tooltip formatter={(value: number) => [`₹${value}`, 'GMP']} />
                <Area type="monotone" dataKey="gmp" stroke="#4f46e5" strokeWidth={2} fill="url(#gmpFill)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
