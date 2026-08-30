'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import { validateNcdIssueInput } from '@/lib/otherInvestmentsValidation';
import type { Company, Registrar } from '@/lib/ipoTypes';
import type { NcdIssue, NcdLifecycleStatus, NcdSeries } from '@/lib/otherInvestmentsTypes';
import { NCD_LIFECYCLE_LABELS, NCD_LIFECYCLE_ORDER } from '@/lib/otherInvestmentsTypes';

interface NcdIssueFormProps {
    mode: 'create' | 'edit';
    initialIssue?: NcdIssue;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const EMPTY_SERIES: NcdSeries = { name: '', tenure_months: 12, coupon_rate: 0, frequency: 'annual', min_investment: null };

export default function NcdIssueForm({ mode, initialIssue }: NcdIssueFormProps) {
    const router = useRouter();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [registrars, setRegistrars] = useState<Registrar[]>([]);
    const [companyId, setCompanyId] = useState(initialIssue?.company_id || '');
    const [registrarId, setRegistrarId] = useState(initialIssue?.registrar_id || '');
    const [slug, setSlug] = useState(initialIssue?.slug || '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [status, setStatus] = useState<NcdLifecycleStatus>(initialIssue?.status || 'announced');
    const [openDate, setOpenDate] = useState(initialIssue?.open_date?.slice(0, 10) || '');
    const [closeDate, setCloseDate] = useState(initialIssue?.close_date?.slice(0, 10) || '');
    const [allotmentDate, setAllotmentDate] = useState(initialIssue?.allotment_date?.slice(0, 10) || '');
    const [listingDate, setListingDate] = useState(initialIssue?.listing_date?.slice(0, 10) || '');
    const [issueSize, setIssueSize] = useState(initialIssue?.issue_size?.toString() || '');
    const [baseIssueSize, setBaseIssueSize] = useState(initialIssue?.base_issue_size?.toString() || '');
    const [shelfLimit, setShelfLimit] = useState(initialIssue?.shelf_limit?.toString() || '');
    const [creditRating, setCreditRating] = useState(initialIssue?.credit_rating || '');
    const [ratingAgency, setRatingAgency] = useState(initialIssue?.rating_agency || '');
    const [secured, setSecured] = useState(initialIssue?.secured ?? true);
    const [series, setSeries] = useState<NcdSeries[]>(initialIssue?.series?.length ? initialIssue.series : [EMPTY_SERIES]);
    const [leadManagers, setLeadManagers] = useState((initialIssue?.lead_managers || []).join(', '));
    const [objectsOfIssue, setObjectsOfIssue] = useState(initialIssue?.objects_of_issue || '');
    const [prospectusUrl, setProspectusUrl] = useState(initialIssue?.prospectus_url || '');
    const [subscriptionTimes, setSubscriptionTimes] = useState(initialIssue?.subscription_times_overall?.toString() || '');
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
        if (!slugTouched && company) setSlug(slugify(`${company.name}-ncd`));
    }

    function updateSeriesField(index: number, field: keyof NcdSeries, value: string | number) {
        setSeries(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSlugError('');

        const payload = { company_id: companyId, status, publish_status: publishStatus };
        const validationErrors = validateNcdIssueInput(payload);
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }
        setErrors([]);
        setSaving(true);

        const body = {
            ...payload,
            slug,
            open_date: openDate || null,
            close_date: closeDate || null,
            allotment_date: allotmentDate || null,
            listing_date: listingDate || null,
            issue_size: issueSize ? Number(issueSize) : null,
            base_issue_size: baseIssueSize ? Number(baseIssueSize) : null,
            shelf_limit: shelfLimit ? Number(shelfLimit) : null,
            credit_rating: creditRating || null,
            rating_agency: ratingAgency || null,
            secured,
            series: series.filter(s => s.name.trim()),
            registrar_id: registrarId || null,
            lead_managers: leadManagers.split(',').map(s => s.trim()).filter(Boolean),
            objects_of_issue: objectsOfIssue || null,
            prospectus_url: prospectusUrl || null,
            subscription_times_overall: subscriptionTimes ? Number(subscriptionTimes) : null,
            is_featured: isFeatured,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
        };

        const url = mode === 'create' ? '/api/admin/ncd-issues' : `/api/admin/ncd-issues/${initialIssue!.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        setSaving(false);

        if (res.status === 401) { router.push('/admin/login'); return; }
        if (res.status === 409) { setSlugError(data.error); return; }
        if (!res.ok) { setErrors([data.error || 'Failed to save NCD issue.']); return; }

        router.push('/admin/ncd-issues');
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
                    <label className={labelClass}>Issuer company</label>
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
                    <select value={status} onChange={(e) => setStatus(e.target.value as NcdLifecycleStatus)} className={inputClass}>
                        {NCD_LIFECYCLE_ORDER.map(s => <option key={s} value={s}>{NCD_LIFECYCLE_LABELS[s]}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Credit rating</label>
                    <input type="text" placeholder="e.g. CRISIL AA+" value={creditRating} onChange={e => setCreditRating(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Rating agency</label>
                    <input type="text" placeholder="e.g. CRISIL" value={ratingAgency} onChange={e => setRatingAgency(e.target.value)} className={inputClass} />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={secured} onChange={(e) => setSecured(e.target.checked)} />
                Secured NCD
            </label>

            <fieldset className="border border-gray-200 rounded-lg p-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Lifecycle dates</legend>
                <div className="grid grid-cols-4 gap-3">
                    <div><label className={labelClass}>Open</label><input type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Close</label><input type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Allotment</label><input type="date" value={allotmentDate} onChange={e => setAllotmentDate(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Listing</label><input type="date" value={listingDate} onChange={e => setListingDate(e.target.value)} className={inputClass} /></div>
                </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Issue size</legend>
                <div className="grid grid-cols-3 gap-3">
                    <div><label className={labelClass}>Base issue size (₹ cr)</label><input type="number" value={baseIssueSize} onChange={e => setBaseIssueSize(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Shelf limit (₹ cr)</label><input type="number" value={shelfLimit} onChange={e => setShelfLimit(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Total issue size (₹ cr)</label><input type="number" value={issueSize} onChange={e => setIssueSize(e.target.value)} className={inputClass} /></div>
                </div>
            </fieldset>

            <fieldset className="border border-gray-200 rounded-lg p-3">
                <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Series (tenure / coupon options)</legend>
                <div className="space-y-2">
                    {series.map((s, i) => (
                        <div key={i} className="grid grid-cols-5 gap-2 items-end">
                            <div><label className={labelClass}>Name</label><input type="text" placeholder="Series I" value={s.name} onChange={e => updateSeriesField(i, 'name', e.target.value)} className={inputClass} /></div>
                            <div><label className={labelClass}>Tenure (months)</label><input type="number" value={s.tenure_months} onChange={e => updateSeriesField(i, 'tenure_months', Number(e.target.value))} className={inputClass} /></div>
                            <div><label className={labelClass}>Coupon rate (%)</label><input type="number" step="0.01" value={s.coupon_rate} onChange={e => updateSeriesField(i, 'coupon_rate', Number(e.target.value))} className={inputClass} /></div>
                            <div>
                                <label className={labelClass}>Frequency</label>
                                <select value={s.frequency} onChange={e => updateSeriesField(i, 'frequency', e.target.value)} className={inputClass}>
                                    <option value="monthly">Monthly</option>
                                    <option value="annual">Annual</option>
                                    <option value="cumulative">Cumulative</option>
                                </select>
                            </div>
                            <button type="button" onClick={() => setSeries(prev => prev.filter((_, idx) => idx !== i))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setSeries(prev => [...prev, { ...EMPTY_SERIES }])} className="text-sm font-semibold text-primary-600 hover:underline">
                        + Add series
                    </button>
                </div>
            </fieldset>

            <div>
                <label className={labelClass}>Objects of the issue</label>
                <textarea value={objectsOfIssue} onChange={e => setObjectsOfIssue(e.target.value)} rows={2} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Lead managers (comma-separated)</label><input type="text" value={leadManagers} onChange={e => setLeadManagers(e.target.value)} className={inputClass} /></div>
                <div>
                    <label className={labelClass}>Registrar</label>
                    <select value={registrarId} onChange={(e) => setRegistrarId(e.target.value)} className={inputClass}>
                        <option value="">Select registrar…</option>
                        {registrars.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Prospectus URL</label><input type="url" value={prospectusUrl} onChange={e => setProspectusUrl(e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Overall subscription (times) — current snapshot</label><input type="number" step="0.01" value={subscriptionTimes} onChange={e => setSubscriptionTimes(e.target.value)} className={inputClass} /></div>
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
                {saving ? 'Saving…' : mode === 'create' ? 'Create NCD Issue' : 'Save Changes'}
            </button>
        </form>
    );
}
