'use client';

import { useEffect, useState } from 'react';
import type { IpoDocument, IpoDocumentType } from '@/lib/ipoTypes';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const DOC_TYPES: IpoDocumentType[] = ['drhp', 'rhp', 'anchor_investors', 'other'];

export default function DocumentsPanel({ ipoId }: { ipoId: string }) {
    const [documents, setDocuments] = useState<IpoDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [docType, setDocType] = useState<IpoDocumentType>('other');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function load() {
        setLoading(true);
        fetch(`/api/admin/ipos/${ipoId}/documents`).then(r => r.json()).then(d => {
            setDocuments(d.documents || []);
            setLoading(false);
        });
    }

    useEffect(load, [ipoId]);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!title.trim() || !url.trim()) {
            setError('Title and URL are required.');
            return;
        }
        setSaving(true);
        const res = await fetch(`/api/admin/ipos/${ipoId}/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doc_type: docType, title: title.trim(), url: url.trim() }),
        });
        const data = await res.json();
        setSaving(false);
        if (!res.ok) {
            setError(data.error || 'Failed to add document.');
            return;
        }
        setTitle(''); setUrl('');
        load();
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Delete this document?')) return;
        await fetch(`/api/admin/ipos/${ipoId}/documents/${id}`, { method: 'DELETE' });
        load();
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">Documents</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-2 mb-3">
                {error && <p className="col-span-2 text-xs text-red-600">{error}</p>}
                <select value={docType} onChange={e => setDocType(e.target.value as IpoDocumentType)} className={inputClass}>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
                <input type="url" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} className={`${inputClass} col-span-2`} />
                <button type="submit" disabled={saving} className="col-span-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg py-1.5">
                    {saving ? 'Adding…' : 'Add document'}
                </button>
            </form>

            {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
            ) : documents.length === 0 ? (
                <p className="text-sm text-gray-400">No documents yet.</p>
            ) : (
                <ul className="text-sm space-y-1.5">
                    {documents.map(d => (
                        <li key={d.id} className="flex items-center justify-between">
                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">
                                {d.title} <span className="text-gray-400 text-xs">({d.doc_type})</span>
                            </a>
                            <button onClick={() => handleDelete(d.id)} className="text-gray-400 hover:text-red-600 shrink-0 ml-2">×</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
