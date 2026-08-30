'use client';

import { useEffect, useState } from 'react';
import type { IpoSubscriptionUpdate, SubscriptionCategory } from '@/lib/ipoTypes';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const CATEGORIES: SubscriptionCategory[] = ['overall', 'retail', 'nii', 'qib', 'employee', 'shareholder'];

export default function SubscriptionPanel({ ipoId }: { ipoId: string }) {
    const [updates, setUpdates] = useState<IpoSubscriptionUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [dayNumber, setDayNumber] = useState('1');
    const [category, setCategory] = useState<SubscriptionCategory>('overall');
    const [subscriptionTimes, setSubscriptionTimes] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function load() {
        setLoading(true);
        fetch(`/api/admin/ipos/${ipoId}/subscription`).then(r => r.json()).then(d => {
            setUpdates(d.updates || []);
            setLoading(false);
        });
    }

    useEffect(load, [ipoId]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!subscriptionTimes) {
            setError('Subscription times is required.');
            return;
        }
        setSaving(true);
        const res = await fetch(`/api/admin/ipos/${ipoId}/subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                day_number: Number(dayNumber),
                category,
                subscription_times: Number(subscriptionTimes),
            }),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) {
            setError(data.error || 'Failed to add update.');
            return;
        }
        setSubscriptionTimes('');
        load();
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this subscription entry?')) return;
        await fetch(`/api/admin/ipos/${ipoId}/subscription/${id}`, { method: 'DELETE' });
        load();
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Subscription updates</h3>
            <p className="text-xs text-gray-400 mb-2">Entered manually, day-end data only — never labeled as live.</p>
            <form onSubmit={handleAdd} className="grid grid-cols-3 gap-2 mb-3">
                {error && <p className="col-span-3 text-xs text-red-600">{error}</p>}
                <input type="number" min={1} placeholder="Day" value={dayNumber} onChange={e => setDayNumber(e.target.value)} className={inputClass} />
                <select value={category} onChange={e => setCategory(e.target.value as SubscriptionCategory)} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" step="0.01" placeholder="Times (x)" value={subscriptionTimes} onChange={e => setSubscriptionTimes(e.target.value)} className={inputClass} />
                <button type="submit" disabled={saving} className="col-span-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-1.5">
                    {saving ? 'Adding…' : 'Add subscription entry'}
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
            ) : updates.length === 0 ? (
                <p className="text-sm text-gray-400">No subscription data yet.</p>
            ) : (
                <table className="w-full text-xs">
                    <thead className="text-gray-500 text-left">
                        <tr><th className="py-1">Day</th><th>Category</th><th>Times</th><th></th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {updates.map(u => (
                            <tr key={u.id}>
                                <td className="py-1.5 text-gray-600">Day {u.day_number}</td>
                                <td className="text-gray-600 capitalize">{u.category}</td>
                                <td className="font-medium text-gray-900">{u.subscription_times}x</td>
                                <td className="text-right">
                                    <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-600">×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
