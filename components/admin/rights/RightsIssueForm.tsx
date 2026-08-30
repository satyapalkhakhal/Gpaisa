'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import { validateRightsIssueInput } from '@/lib/otherInvestmentsValidation';
import type { Company, Registrar } from '@/lib/ipoTypes';
import type { RightsIssue, RightsLifecycleStatus } from '@/lib/otherInvestmentsTypes';
import { RIGHTS_LIFECYCLE_LABELS, RIGHTS_LIFECYCLE_ORDER } from '@/lib/otherInvestmentsTypes';

interface RightsIssueFormProps {
    mode: 'create' | 'edit';
    initialIssue?: RightsIssue;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function RightsIssueForm({ mode, initialIssue }: RightsIssueFormProps) {
    const router = useRouter();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [registrars, setRegistrars] = useState<Registrar[]>([]);
    const [companyId, setCompanyId] = useState(initialIssue?.company_id || '');
    const [registrarId, setRegistrarId] = useState(initialIssue?.registrar_id || '');
    const [slug, setSlug] = useState(initialIssue?.slug || '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [status, setStatus] = useState<RightsLifecycleStatus>(initialIssue?.status || 'announced');
    const [recordDate, setRecordDate] = useState(initialIssue?.record_date?.slice(0, 10) || '');
    const [reTradingStart, setReTradingStart] = useState(initialIssue?.re_trading_start?.slice(0, 10) || '');
    const [reTradingEnd, setReTradingEnd] = useState(initialIssue?.re_trading_end?.slice(0, 10) || '');
    const [applicationStart, setApplicationStart] = useState(initialIssue?.application_start?.slice(0, 10) || '');
    const [applicationEnd, setApplicationEnd] = useState(initialIssue?.application_end?.slice(0, 10) || '');
    const [allotmentDate, setAllotmentDate] = useState(initialIssue?.allotment_date?.slice(0, 10) || '');
    const [listingDate, setListingDate] = useState(initialIssue?.listing_date?.slice(0, 10) || '');
    const [rightsRatio, setRightsRatio] = useState(initialIssue?.rights_ratio || '');
    const [issuePrice, setIssuePrice] = useState(initialIssue?.issue_price?.toString() || '');
    const [faceValue, setFaceValue] = useState(initialIssue?.face_value?.toString() || '');
    const [issueSize, setIssueSize] = useState(initialIssue?.issue_size?.toString() || '');
    const [rePrice, setRePrice] = useState(initialIssue?.re_price?.toString() || '');
    const [objectsOfIssue, setObjectsOfIssue] = useState(initialIssue?.objects_of_issue || '');
    const [letterOfOfferUrl, setLetterOfOfferUrl] = useState(initialIssue?.letter_of_offer_url || '');
    const [isFeatured, setIsFeatured] = useState(!!initialIssue?.is_featured);
    const [metaTitle, setMetaTitle] = useState(initialIssue?.meta_title || '');
    const [metaDescription, setMetaDescription] = useState(initialIssue?.meta_description || '');
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(initialIssue?.publish_status || 'draft');

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
        if (!slugTouched && company) setSlug(slugify(`${company.name}-rights-issue`));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSlugError('');

        const payload = { company_id: companyId, status, rights_ratio: rightsRatio, publish_status: publishStatus };
        const validationErrors = validateRightsIssueInput(payload);
        if (validationErrors.length) { setErrors(validationErrors); return; }
        setErrors([]);
        setSaving(true);

        const body = {
            ...payload,
            slug,
            record_date: recordDate || null,
            re_trading_start: reTradingStart || null,
            re_trading_end: reTradingEnd || null,
            application_start: applicationStart || null,
            application_end: applicationEnd || null,
            allotment_date: allotmentDate || null,
            listing_date: listingDate || null,
            issue_price: issuePrice ? Number(issuePrice) : null,
            face_value: faceValue ? Number(faceValue) : null,
            issue_size: issueSize ? Number(issueSize) : null,
            re_price: rePrice ? Number(rePrice) : null,
            registrar_id: registrarId || null,
            objects_of_issue: objectsOfIssue || null,
            letter_of_offer_url: letterOfOfferUrl || null,
            is_featured: isFeatured,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
        };

        const url = mode === 'create' ? '/api/admin/rights-issues' : `/api/admin/rights-issues/${initialIssue!.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        setSaving(false);

        if (res.status === 401) { router.push('/admin/login'); return; }
        if (res.status === 409) { setSlugError(data.error); return; }
        if (!res.ok) { setErrors([data.error || 'Failed to save rights issue.']); return; }

        router.push('/admin/rights-issues');
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

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className={labelClass}>Lifecycle status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as RightsLifecycleStatus)} className={inputClass}>
                        {RIGHTS_LIFECYCLE_ORDER.map(s => <option key={s} value={s}>{RIGHTS_LIFECYCLE_LABELS[s]}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Rights ratio</label>
                    <input type="text" placeholder="e.g. 1:5" value={rightsRatio} onChange={e => setRightsRatio(e.target.value)} className={inputClass} required />
                </div>
                <div>
                    <label className={labelClass}>Issue price (₹)</label>
                    <input type="number" value={issuePrice} onChange={e => setIssuePrice(e.target.value)} className={inputClass} />
                </div>
            </div>

            <fieldset className="border border-gray-200 rounded-lg p-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Lifecycle dates</legend>
                <div className="grid grid-cols-4 gap-3">
                    <div><label className={labelClass}>Record date</label><input type="date" value={recordDate} onChange={e => setRecordDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>RE trading start</label><input type="date" value={reTradingStart} onChange={e => setReTradingStart(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>RE trading end</label><input type="date" value={reTradingEnd} onChange={e => setReTradingEnd(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Application start</label><input type="date" value={applicationStart} onChange={e => setApplicationStart(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Application end</label><input type="date" value={applicationEnd} onChange={e => setApplicationEnd(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Allotment</label><input type="date" value={allotmentDate} onChange={e => setAllotmentDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Listing</label><input type="date" value={listingDate} onChange={e => setListingDate(e.target.value)} className={inputClass} /></div>
                </div>
            </fieldset>

            <div className="grid grid-cols-3 gap-4">
                <div><label className={labelClass}>Face value (₹)</label><input type="number" value={faceValue} onChange={e => setFaceValue(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Issue size (₹ cr)</label><input type="number" value={issueSize} onChange={e => setIssueSize(e.target.value)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>RE price (₹) — current snapshot</label>
                    <input type="number" value={rePrice} onChange={e => setRePrice(e.target.value)} className={inputClass} />
                    <p className="text-xs text-gray-400 mt-1">"Updated" timestamp only advances when this value actually changes.</p>
                </div>
            </div>

            <div>
                <label className={labelClass}>Objects of the issue</label>
                <textarea value={objectsOfIssue} onChange={e => setObjectsOfIssue(e.target.value)} rows={2} className={inputClass} />
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
                {saving ? 'Saving…' : mode === 'create' ? 'Create Rights Issue' : 'Save Changes'}
            </button>
        </form>
    );
}
