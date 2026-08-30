'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slugify';
import { validateIpoInput } from '@/lib/ipoValidation';
import type { Company, Ipo, IpoLifecycleStatus, IpoType, Registrar } from '@/lib/ipoTypes';
import { LIFECYCLE_LABELS, LIFECYCLE_ORDER } from '@/lib/ipoTypes';
import GmpPanel from './GmpPanel';
import SubscriptionPanel from './SubscriptionPanel';
import AllotmentPanel from './AllotmentPanel';
import ReviewPanel from './ReviewPanel';
import DocumentsPanel from './DocumentsPanel';

interface IpoFormProps {
    mode: 'create' | 'edit';
    initialIpo?: Ipo;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function IpoForm({ mode, initialIpo }: IpoFormProps) {
    const router = useRouter();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [registrars, setRegistrars] = useState<Registrar[]>([]);
    const [companyId, setCompanyId] = useState(initialIpo?.company_id || '');
    const [registrarId, setRegistrarId] = useState(initialIpo?.registrar_id || '');

    const [slug, setSlug] = useState(initialIpo?.slug || '');
    const [slugTouched, setSlugTouched] = useState(mode === 'edit');
    const [ipoType, setIpoType] = useState<IpoType>(initialIpo?.ipo_type || 'mainboard');
    const [status, setStatus] = useState<IpoLifecycleStatus>(initialIpo?.status || 'drhp');
    const [openDate, setOpenDate] = useState(initialIpo?.open_date?.slice(0, 10) || '');
    const [closeDate, setCloseDate] = useState(initialIpo?.close_date?.slice(0, 10) || '');
    const [allotmentDate, setAllotmentDate] = useState(initialIpo?.allotment_date?.slice(0, 10) || '');
    const [refundDate, setRefundDate] = useState(initialIpo?.refund_date?.slice(0, 10) || '');
    const [dematDate, setDematDate] = useState(initialIpo?.demat_date?.slice(0, 10) || '');
    const [listingDate, setListingDate] = useState(initialIpo?.listing_date?.slice(0, 10) || '');
    const [priceBandMin, setPriceBandMin] = useState(initialIpo?.price_band_min?.toString() || '');
    const [priceBandMax, setPriceBandMax] = useState(initialIpo?.price_band_max?.toString() || '');
    const [faceValue, setFaceValue] = useState(initialIpo?.face_value?.toString() || '');
    const [lotSize, setLotSize] = useState(initialIpo?.lot_size?.toString() || '');
    const [freshIssueAmount, setFreshIssueAmount] = useState(initialIpo?.fresh_issue_amount?.toString() || '');
    const [ofsAmount, setOfsAmount] = useState(initialIpo?.ofs_amount?.toString() || '');
    const [totalIssueSize, setTotalIssueSize] = useState(initialIpo?.total_issue_size?.toString() || '');
    const [exchange, setExchange] = useState(initialIpo?.exchange || 'nse');
    const [leadManagers, setLeadManagers] = useState((initialIpo?.lead_managers || []).join(', '));
    const [objectsOfIssue, setObjectsOfIssue] = useState(initialIpo?.objects_of_issue || '');
    const [drhpUrl, setDrhpUrl] = useState(initialIpo?.drhp_url || '');
    const [rhpUrl, setRhpUrl] = useState(initialIpo?.rhp_url || '');
    const [isFeatured, setIsFeatured] = useState(!!initialIpo?.is_featured);
    const [metaTitle, setMetaTitle] = useState(initialIpo?.meta_title || '');
    const [metaDescription, setMetaDescription] = useState(initialIpo?.meta_description || '');
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>(initialIpo?.publish_status || 'draft');
    const [listingPrice, setListingPrice] = useState(initialIpo?.listing_price?.toString() || '');
    const [listingDayClosePrice, setListingDayClosePrice] = useState(initialIpo?.listing_day_close_price?.toString() || '');
    const [currentMarketPrice, setCurrentMarketPrice] = useState(initialIpo?.current_market_price?.toString() || '');

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
        if (!slugTouched && company) setSlug(slugify(`${company.name}-ipo`));
    }

    async function handleNewCompany() {
        const name = window.prompt('New company name');
        if (!name?.trim()) return;
        const res = await fetch('/api/admin/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim() }),
        });
        const data = await res.json();
        if (res.ok) {
            setCompanies(prev => [...prev, data.company].sort((a, b) => a.name.localeCompare(b.name)));
            handleCompanyChange(data.company.id);
        } else {
            setErrors([data.error || 'Failed to create company.']);
        }
    }

    async function handleNewRegistrar() {
        const name = window.prompt('New registrar name');
        if (!name?.trim()) return;
        const res = await fetch('/api/admin/registrars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim() }),
        });
        const data = await res.json();
        if (res.ok) {
            setRegistrars(prev => [...prev, data.registrar].sort((a, b) => a.name.localeCompare(b.name)));
            setRegistrarId(data.registrar.id);
        } else {
            setErrors([data.error || 'Failed to create registrar.']);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSlugError('');

        const payload = {
            company_id: companyId,
            ipo_type: ipoType,
            status,
            open_date: openDate || null,
            close_date: closeDate || null,
            allotment_date: allotmentDate || null,
            refund_date: refundDate || null,
            demat_date: dematDate || null,
            listing_date: listingDate || null,
            price_band_min: priceBandMin ? Number(priceBandMin) : null,
            price_band_max: priceBandMax ? Number(priceBandMax) : null,
            lot_size: lotSize ? Number(lotSize) : null,
            publish_status: publishStatus,
        };
        const validationErrors = validateIpoInput(payload);
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }
        setErrors([]);
        setSaving(true);

        const body = {
            ...payload,
            slug,
            face_value: faceValue ? Number(faceValue) : null,
            fresh_issue_amount: freshIssueAmount ? Number(freshIssueAmount) : null,
            ofs_amount: ofsAmount ? Number(ofsAmount) : null,
            total_issue_size: totalIssueSize ? Number(totalIssueSize) : null,
            exchange,
            registrar_id: registrarId || null,
            lead_managers: leadManagers.split(',').map(s => s.trim()).filter(Boolean),
            objects_of_issue: objectsOfIssue || null,
            drhp_url: drhpUrl || null,
            rhp_url: rhpUrl || null,
            is_featured: isFeatured,
            meta_title: metaTitle || null,
            meta_description: metaDescription || null,
            listing_price: listingPrice ? Number(listingPrice) : null,
            listing_day_close_price: listingDayClosePrice ? Number(listingDayClosePrice) : null,
            current_market_price: currentMarketPrice ? Number(currentMarketPrice) : null,
        };

        const url = mode === 'create' ? '/api/admin/ipos' : `/api/admin/ipos/${initialIpo!.id}`;
        const method = mode === 'create' ? 'POST' : 'PATCH';
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        setSaving(false);

        if (res.status === 401) {
            router.push('/admin/login');
            return;
        }
        if (res.status === 409) {
            setSlugError(data.error);
            return;
        }
        if (!res.ok) {
            setErrors([data.error || 'Failed to save IPO.']);
            return;
        }

        if (mode === 'create') {
            router.push(`/admin/ipos/${data.ipo.id}/edit`);
        } else {
            router.push('/admin/ipos');
        }
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                {errors.length > 0 && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {errors.map((err, i) => <div key={i}>{err}</div>)}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Company</label>
                        <div className="flex gap-2">
                            <select value={companyId} onChange={(e) => handleCompanyChange(e.target.value)} className={inputClass} required>
                                <option value="">Select company…</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="button" onClick={handleNewCompany} className="px-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">+ New</button>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Slug</label>
                        <input type="text" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} className={inputClass} required />
                        {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>IPO type</label>
                        <select value={ipoType} onChange={(e) => setIpoType(e.target.value as IpoType)} className={inputClass}>
                            <option value="mainboard">Mainboard</option>
                            <option value="sme">SME</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Lifecycle status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as IpoLifecycleStatus)} className={inputClass}>
                            {LIFECYCLE_ORDER.map(s => <option key={s} value={s}>{LIFECYCLE_LABELS[s]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Exchange</label>
                        <select value={exchange} onChange={(e) => setExchange(e.target.value)} className={inputClass}>
                            <option value="nse">NSE</option>
                            <option value="bse">BSE</option>
                            <option value="both">NSE + BSE</option>
                        </select>
                    </div>
                </div>

                <fieldset className="border border-gray-200 rounded-lg p-3">
                    <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Lifecycle dates</legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelClass}>Open</label><input type="date" value={openDate} onChange={e => setOpenDate(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Close</label><input type="date" value={closeDate} onChange={e => setCloseDate(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Allotment</label><input type="date" value={allotmentDate} onChange={e => setAllotmentDate(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Refund</label><input type="date" value={refundDate} onChange={e => setRefundDate(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Demat credit</label><input type="date" value={dematDate} onChange={e => setDematDate(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Listing</label><input type="date" value={listingDate} onChange={e => setListingDate(e.target.value)} className={inputClass} /></div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-3">
                    <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Price &amp; lot</legend>
                    <div className="grid grid-cols-4 gap-3">
                        <div><label className={labelClass}>Price band min (₹)</label><input type="number" value={priceBandMin} onChange={e => setPriceBandMin(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Price band max (₹)</label><input type="number" value={priceBandMax} onChange={e => setPriceBandMax(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Face value (₹)</label><input type="number" value={faceValue} onChange={e => setFaceValue(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Lot size (shares)</label><input type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} className={inputClass} /></div>
                    </div>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-3">
                    <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Listing performance (fill in once listed)</legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelClass}>Listing day open (₹)</label><input type="number" value={listingPrice} onChange={e => setListingPrice(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Listing day close (₹)</label><input type="number" value={listingDayClosePrice} onChange={e => setListingDayClosePrice(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Current market price (₹)</label><input type="number" value={currentMarketPrice} onChange={e => setCurrentMarketPrice(e.target.value)} className={inputClass} /></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                        Current market price should be refreshed periodically — its "last updated" timestamp only advances when this value actually changes.
                    </p>
                </fieldset>

                <fieldset className="border border-gray-200 rounded-lg p-3">
                    <legend className="text-xs font-semibold text-gray-500 uppercase px-1">Issue size</legend>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelClass}>Fresh issue (₹ cr)</label><input type="number" value={freshIssueAmount} onChange={e => setFreshIssueAmount(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Offer for sale (₹ cr)</label><input type="number" value={ofsAmount} onChange={e => setOfsAmount(e.target.value)} className={inputClass} /></div>
                        <div><label className={labelClass}>Total issue size (₹ cr)</label><input type="number" value={totalIssueSize} onChange={e => setTotalIssueSize(e.target.value)} className={inputClass} /></div>
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
                        <div className="flex gap-2">
                            <select value={registrarId} onChange={(e) => setRegistrarId(e.target.value)} className={inputClass}>
                                <option value="">Select registrar…</option>
                                {registrars.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <button type="button" onClick={handleNewRegistrar} className="px-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">+ New</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>DRHP URL</label><input type="url" value={drhpUrl} onChange={e => setDrhpUrl(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>RHP URL</label><input type="url" value={rhpUrl} onChange={e => setRhpUrl(e.target.value)} className={inputClass} /></div>
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

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold rounded-lg px-6 py-2.5 transition-colors"
                >
                    {saving ? 'Saving…' : mode === 'create' ? 'Create IPO' : 'Save Changes'}
                </button>
            </form>

            {mode === 'edit' && initialIpo ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GmpPanel ipoId={initialIpo.id} />
                    <SubscriptionPanel ipoId={initialIpo.id} />
                    <AllotmentPanel ipoId={initialIpo.id} />
                    <DocumentsPanel ipoId={initialIpo.id} />
                    <div className="lg:col-span-2">
                        <ReviewPanel ipoId={initialIpo.id} />
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-lg px-4 py-3">
                    Save the IPO first — GMP, subscription, allotment, documents, and the structured review can be added once the record exists.
                </div>
            )}
        </div>
    );
}
