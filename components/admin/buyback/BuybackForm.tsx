'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import { validateBuybackInput } from '@/lib/otherInvestmentsValidation';
import type { Company, Registrar } from '@/lib/ipoTypes';
import type { Buyback, BuybackLifecycleStatus, BuybackMethod } from '@/lib/otherInvestmentsTypes';
import { BUYBACK_LIFECYCLE_LABELS, BUYBACK_LIFECYCLE_ORDER } from '@/lib/otherInvestmentsTypes';

interface BuybackFormProps {
    mode: 'create' | 'edit';
    initialBuyback?: Buyback;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function BuybackForm({ mode, initialBuyback }: BuybackFormProps) {
    const router = useRouter();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [registrars, setRegistrars] = useState<Registrar[]>([]);
    const [companyId, setCompanyId] = useState(initialBuyback?.company_id || '');
    const [registrarId, setRegistrarId] = useState(initialBuyback?.registrar_id || '');
    const [slug, setSlug] = useState(initialBuyback?.slug || '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [status, setStatus] = useState<BuybackLifecycleStatus>(initialBuyback?.status || 'announced');
    const [method, setMethod] = useState<BuybackMethod>(initialBuyback?.method || 'tender');
    const [buybackPrice, setBuybackPrice] = useState(initialBuyback?.buyback_price?.toString() || '');
    const [buybackPriceMax, setBuybackPriceMax] = useState(initialBuyback?.buyback_price_max?.toString() || '');
    const [recordDate, setRecordDate] = useState(initialBuyback?.record_date?.slice(0, 10) || '');
    const [tenderOpenDate, setTenderOpenDate] = useState(initialBuyback?.tender_open_date?.slice(0, 10) || '');
    const [tenderCloseDate, setTenderCloseDate] = useState(initialBuyback?.tender_close_date?.slice(0, 10) || '');
    const [buybackSize, setBuybackSize] = useState(initialBuyback?.buyback_size?.toString() || '');
    const [acceptanceRatio, setAcceptanceRatio] = useState(initialBuyback?.acceptance_ratio || '');
    const [notes, setNotes] = useState(initialBuyback?.notes || '');
    const [letterOfOfferUrl, setLetterOfOfferUrl] = useState(initialBuyback?.letter_of_offer_url || '');
    const [isFeatured, setIsFeatured] = useState(!!initialBuyback?.is_featured);
    const [metaTitle, setMetaTitle] = useState(initialBuyback?.meta_title || '');
    const [metaDescription, setMetaDescription] = useState(initialBuyback?.meta_description || '');
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(initialBuyback?.publish_status || 'draft');

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [slugError, setSlugError] = useState('');

    useEffect(() => {
        fetch('/api/admin/companies').then(r => r.json()).then(d => setCompanies(d.companies || []));
        fetch('/api/admin/registrars').then(r => r.json()).then(d => setRegistrars(d.registrars || []));
    }, []);

    function handleCompanyChange(value: string) {
        setCompanyId(value);
        const company = companies.find(c => c.id === value);
        if (!slugTouched && company) setSlug(slugify(`${company.name}-buyback`));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSlugError('');

        const payload = {
            company_id: companyId, status, method, publish_status: publishStatus,
            buyback_price: buybackPrice ? Number(buybackPrice) : null,
            buyback_price_max: buybackPriceMax ? Number(buybackPriceMax) : null,
        };
        const validationErrors = validateBuybackInput(payload);
        if (validationErrors.length) { setErrors(validationErrors); return; }
        setErrors([]);
        setSaving(true);

        const body = {
            ...payload,
            slug,
            record_date: recordDate || null,
            tender_open_date: tenderOpenDate || null,
            tender_close_date: tenderCloseDate || null,
            buyback_size: buybackSize ? Number(buybackSize) : null,
            acceptance_ratio: acceptanceRatio || null,
            registrar_id: registrarId || null,
            notes: notes || null,
            letter_of_offer_url: letterOfOfferUrl || null,
            is_featured: isFeatured,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
        };

        const url = mode === 'create' ? '/api/admin/buybacks' : `/api/admin/buybacks/${initialBuyback!.id}`;
        const httpMethod = mode === 'create' ? 'POST' : 'PATCH';
        const res = await fetch(url, { method: httpMethod, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        setSaving(false);

        if (res.status === 401) { router.push('/admin/login'); return; }
        if (res.status === 409) { setSlugError(data.error); return; }
        if (!res.ok) { setErrors([data.error || 'Failed to save buyback.']); return; }

        router.push('/admin/buybacks');
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            {errors.length > 0 && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {errors.map((err, i) => <div key={i}>{err}</div>)}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Company</label>
                    <select value={companyId} onChange={(e) => handleCompanyChange(e.target.value)} className={inputClass} required>
                        <option value="">Select company…</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Slug</label>
                    <input type="text" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} className={inputClass} required />
                    {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Lifecycle status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as BuybackLifecycleStatus)} className={inputClass}>
                        {BUYBACK_LIFECYCLE_ORDER.map(s => <option key={s} value={s}>{BUYBACK_LIFECYCLE_LABELS[s]}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value as BuybackMethod)} className={inputClass}>
                        <option value="tender">Tender offer</option>
                        <option value="open_market">Open market</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>{method === 'tender' ? 'Buyback price (₹)' : 'Price range min (₹)'}</label><input type="number" value={buybackPrice} onChange={e => setBuybackPrice(e.target.value)} className={inputClass} /></div>
                {method === 'open_market' && (
                    <div><label className={labelClass}>Price range max (₹)</label><input type="number" value={buybackPriceMax} onChange={e => setBuybackPriceMax(e.target.value)} className={inputClass} /></div>
                )}
                <div><label className={labelClass}>Buyback size (₹ cr)</label><input type="number" value={buybackSize} onChange={e => setBuybackSize(e.target.value)} className={inputClass} /></div>
            </div>

            <fieldset className="border border-gray-200 rounded-lg p-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Lifecycle dates</legend>
                <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelClass}>Record date</label><input type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Tender open</label><input type="date" value={tenderOpenDate} onChange={e => setTenderOpenDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Tender close</label><input type="date" value={tenderCloseDate} onChange={e => setTenderCloseDate(e.target.value)} className={inputClass} /></div>
                </div>
            </fieldset>

            <div>
                <label className={labelClass}>Acceptance ratio (once known)</label>
                <input type="text" placeholder="e.g. 1 share accepted per 4 tendered" value={acceptanceRatio} onChange={e => setAcceptanceRatio(e.target.value)} className={inputClass} />
            </div>

            <div>
                <label className={labelClass}>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Registrar</label>
                    <select value={registrarId} onChange={(e) => setRegistrarId(e.target.value)} className={inputClass}>
                        <option value="">Select registrar…</option>
                        {registrars.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div><label className={labelClass}>Letter of offer URL</label><input type="url" value={letterOfOfferUrl} onChange={e => setLetterOfOfferUrl(e.target.value)} className={inputClass} /></div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">SEO</h3>
                <div className="grid grid-cols-1 gap-3">
                    <div><label className={labelClass}>Meta title</label><input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Meta description</label><textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} className={inputClass} /></div>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    Featured
                </label>
                <div className="ml-auto flex items-center gap-2">
                    <label className={labelClass + ' mb-0'}>Publish status</label>
                    <select value={publishStatus} onChange={(e) => setPublishStatus(e.target.value as 'draft' | 'published')} className={inputClass + ' w-auto'}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors">
                {saving ? 'Saving…' : mode === 'create' ? 'Create Buyback' : 'Save Changes'}
            </button>
        </form>
    );
}
