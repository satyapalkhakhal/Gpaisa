'use client';

import { useEffect, useState } from 'react';
import type { IpoAllotmentInfo, Registrar } from '@/lib/ipoTypes';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-xs font-medium text-gray-700 mb-1';

export default function AllotmentPanel({ ipoId }: { ipoId: string }) {
    const [registrars, setRegistrars] = useState<Registrar[]>([]);
    const [registrarId, setRegistrarId] = useState('');
    const [basisUrl, setBasisUrl] = useState('');
    const [allotmentDate, setAllotmentDate] = useState('');
    const [refundDate, setRefundDate] = useState('');
    const [dematCreditDate, setDematCreditDate] = useState('');
    const [listingDate, setListingDate] = useState('');
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/admin/registrars').then(r => r.json()).then(d => setRegistrars(d.registrars || []));
        fetch(`/api/admin/ipos/${ipoId}/allotment`).then(r => r.json()).then((d) => {
            const a: IpoAllotmentInfo | null = d.allotment;
            if (a) {
                setRegistrarId(a.registrar_id || '');
                setBasisUrl(a.basis_of_allotment_url || '');
                setAllotmentDate(a.allotment_date?.slice(0, 10) || '');
                setRefundDate(a.refund_date?.slice(0, 10) || '');
                setDematCreditDate(a.demat_credit_date?.slice(0, 10) || '');
                setListingDate(a.listing_date?.slice(0, 10) || '');
                setStatus(a.status || '');
                setNotes(a.notes || '');
            }
            setLoading(false);
        });
    }, [ipoId]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        await fetch(`/api/admin/ipos/${ipoId}/allotment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                registrar_id: registrarId || null,
                basis_of_allotment_url: basisUrl || null,
                allotment_date: allotmentDate || null,
                refund_date: refundDate || null,
                demat_credit_date: dematCreditDate || null,
                listing_date: listingDate || null,
                status: status || null,
                notes: notes || null,
            }),
        });
        setSaving(false);
        setSaved(true);
    }

    if (loading) {
        return <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-400">Loading allotment info…</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Allotment</h3>
            <form onSubmit={handleSave} className="space-y-2">
                <div>
                    <label className={labelClass}>Registrar</label>
                    <select value={registrarId} onChange={e => setRegistrarId(e.target.value)} className={inputClass}>
                        <option value="">Select registrar…</option>
                        {registrars.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div><label className={labelClass}>Basis of allotment URL</label><input type="url" value={basisUrl} onChange={e => setBasisUrl(e.target.value)} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelClass}>Allotment date</label><input type="date" value={allotmentDate} onChange={e => setAllotmentDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Refund date</label><input type="date" value={refundDate} onChange={e => setRefundDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Demat credit date</label><input type="date" value={dematCreditDate} onChange={e => setDematCreditDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Listing date</label><input type="date" value={listingDate} onChange={e => setListingDate(e.target.value)} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Status note</label><input type="text" value={status} onChange={e => setStatus(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} /></div>
                <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-4 py-1.5">
                    {saving ? 'Saving…' : 'Save allotment info'}
                </button>
                {saved && <span className="ml-2 text-xs text-green-600">Saved.</span>}
            </form>
        </div>
    );
}
