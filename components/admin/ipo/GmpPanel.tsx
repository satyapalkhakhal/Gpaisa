'use client';

import { useEffect, useState } from 'react';
import type { IpoGmpUpdate } from '@/lib/ipoTypes';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

export default function GmpPanel({ ipoId }: { ipoId: string }) {
    const [updates, setUpdates] = useState<IpoGmpUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [gmpValue, setGmpValue] = useState('');
    const [gmpPercentage, setGmpPercentage] = useState('');
    const [estimatedListingPrice, setEstimatedListingPrice] = useState('');
    const [source, setSource] = useState('');
    const [direction, setDirection] = useState<'up' | 'down' | 'flat'>('flat');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    function load() {
        setLoading(true);
        fetch(`/api/admin/ipos/${ipoId}/gmp`).then(r => r.json()).then(d => {
            setUpdates(d.updates || []);
            setLoading(false);
        });
    }

    useEffect(load, [ipoId]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!gmpValue || !source.trim()) {
            setError('GMP value and source are required.');
            return;
        }
        setSaving(true);
        const res = await fetch(`/api/admin/ipos/${ipoId}/gmp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gmp_value: Number(gmpValue),
                gmp_percentage: gmpPercentage ? Number(gmpPercentage) : null,
                estimated_listing_price: estimatedListingPrice ? Number(estimatedListingPrice) : null,
                source: source.trim(),
                direction,
                notes: notes || null,
            }),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) {
            setError(data.error || 'Failed to add GMP update.');
            return;
        }
        setGmpValue(''); setGmpPercentage(''); setEstimatedListingPrice(''); setSource(''); setNotes('');
        load();
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this GMP entry?')) return;
        await fetch(`/api/admin/ipos/${ipoId}/gmp/${id}`, { method: 'DELETE' });
        load();
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">GMP updates</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 mb-3">
                {error && <p className="col-span-2 text-xs text-red-600">{error}</p>}
                <input type="number" placeholder="GMP (₹)" value={gmpValue} onChange={e => setGmpValue(e.target.value)} className={inputClass} />
                <input type="number" placeholder="GMP %" value={gmpPercentage} onChange={e => setGmpPercentage(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Est. listing price" value={estimatedListingPrice} onChange={e => setEstimatedListingPrice(e.target.value)} className={inputClass} />
                <select value={direction} onChange={e => setDirection(e.target.value as any)} className={inputClass}>
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="flat">Flat</option>
                </select>
                <input type="text" placeholder="Source (e.g. desk tracking)" value={source} onChange={e => setSource(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} />
                <button type="submit" disabled={saving} className="col-span-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-1.5">
                    {saving ? 'Adding…' : 'Add GMP point'}
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
            ) : updates.length === 0 ? (
                <p className="text-sm text-gray-400">No GMP history yet.</p>
            ) : (
                <table className="w-full text-xs">
                    <thead className="text-gray-500 text-left">
                        <tr><th className="py-1">Recorded</th><th>GMP</th><th>Source</th><th></th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {updates.map(u => (
                            <tr key={u.id}>
                                <td className="py-1.5 text-gray-500">{new Date(u.recorded_at).toLocaleString('en-IN')}</td>
                                <td className="font-medium text-gray-900">₹{u.gmp_value} {u.direction === 'up' ? '↑' : u.direction === 'down' ? '↓' : ''}</td>
                                <td className="text-gray-600">{u.source}</td>
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
