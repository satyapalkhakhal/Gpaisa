'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import type { Ipo } from '@/lib/ipoTypes';
import { LIFECYCLE_LABELS, LIFECYCLE_ORDER } from '@/lib/ipoTypes';

const PAGE_SIZE = 20;

export default function AdminIposPage() {
    const router = useRouter();
    const [ipos, setIpos] = useState<Ipo[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [ipoType, setIpoType] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Ipo | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => { setPage(1); }, [debouncedSearch, status, ipoType]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (status) params.set('status', status);
            if (ipoType) params.set('ipoType', ipoType);

            const res = await fetch(`/api/admin/ipos?${params.toString()}`);
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            if (!cancelled) {
                setIpos(data.ipos || []);
                setTotal(data.total || 0);
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [page, debouncedSearch, status, ipoType, router]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        const res = await fetch(`/api/admin/ipos/${deleteTarget.id}`, { method: 'DELETE' });
        if (res.status === 401) {
            router.push('/admin/login');
            return;
        }
        if (res.ok) {
            setIpos(prev => prev.filter(i => i.id !== deleteTarget.id));
            setTotal(t => t - 1);
        }
        setDeleting(false);
        setDeleteTarget(null);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">IPOs</h1>
                <Link
                    href="/admin/ipos/new"
                    className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New IPO
                </Link>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search slug…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">All statuses</option>
                    {LIFECYCLE_ORDER.map(s => <option key={s} value={s}>{LIFECYCLE_LABELS[s]}</option>)}
                </select>
                <select value={ipoType} onChange={(e) => setIpoType(e.target.value)} className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">All types</option>
                    <option value="mainboard">Mainboard</option>
                    <option value="sme">SME</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-400">Loading…</div>
                ) : ipos.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No IPOs found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Lifecycle</th>
                                <th className="px-4 py-3 font-medium">Publish</th>
                                <th className="px-4 py-3 font-medium">Open date</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {ipos.map(ipo => (
                                <tr key={ipo.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{ipo.slug}</td>
                                    <td className="px-4 py-3 text-gray-600 uppercase text-xs">{ipo.ipo_type}</td>
                                    <td className="px-4 py-3 text-gray-600">{LIFECYCLE_LABELS[ipo.status]}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ipo.publish_status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                            {ipo.publish_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {ipo.open_date ? new Date(ipo.open_date).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link href={`/admin/ipos/${ipo.id}/edit`} className="text-gray-500 hover:text-primary-600">
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button onClick={() => setDeleteTarget(ipo)} className="text-gray-500 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
                        <h2 className="font-bold text-gray-900 mb-2">Delete IPO?</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            This will permanently delete "{deleteTarget.slug}" and all its GMP, subscription, allotment, review, and document records. This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                            <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-60">
                                {deleting ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
