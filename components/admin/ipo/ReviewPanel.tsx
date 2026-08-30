'use client';

import { useEffect, useState } from 'react';
import type { IpoRecommendation } from '@/lib/ipoTypes';
import ArticleEditor from '../ArticleEditor';

const inputClass = 'w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';
const labelClass = 'block text-xs font-medium text-gray-700 mb-1';

export default function ReviewPanel({ ipoId }: { ipoId: string }) {
    const [businessQualityScore, setBusinessQualityScore] = useState('');
    const [financialPerformanceScore, setFinancialPerformanceScore] = useState('');
    const [growthScore, setGrowthScore] = useState('');
    const [valuationScore, setValuationScore] = useState('');
    const [industryOutlook, setIndustryOutlook] = useState('');
    const [managementNotes, setManagementNotes] = useState('');
    const [strengths, setStrengths] = useState('');
    const [risks, setRisks] = useState('');
    const [competitivePosition, setCompetitivePosition] = useState('');
    const [overallView, setOverallView] = useState('');
    const [overallScore, setOverallScore] = useState('');
    const [recommendation, setRecommendation] = useState<IpoRecommendation | ''>('');
    const [detailedAnalysisHtml, setDetailedAnalysisHtml] = useState('');
    const [author, setAuthor] = useState('Gpaisa Research Desk');
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('draft');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/ipos/${ipoId}/review`).then(r => r.json()).then((d) => {
            const r = d.review;
            if (r) {
                setBusinessQualityScore(r.business_quality_score?.toString() || '');
                setFinancialPerformanceScore(r.financial_performance_score?.toString() || '');
                setGrowthScore(r.growth_score?.toString() || '');
                setValuationScore(r.valuation_score?.toString() || '');
                setIndustryOutlook(r.industry_outlook || '');
                setManagementNotes(r.management_notes || '');
                setStrengths((r.strengths || []).join('\n'));
                setRisks((r.risks || []).join('\n'));
                setCompetitivePosition(r.competitive_position || '');
                setOverallView(r.overall_view || '');
                setOverallScore(r.overall_score?.toString() || '');
                setRecommendation(r.recommendation || '');
                setDetailedAnalysisHtml(r.detailed_analysis_html || '');
                setAuthor(r.author || 'Gpaisa Research Desk');
                setPublishStatus(r.publish_status || 'draft');
            }
            setLoading(false);
        });
    }, [ipoId]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSaved(false);
        await fetch(`/api/admin/ipos/${ipoId}/review`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business_quality_score: businessQualityScore ? Number(businessQualityScore) : null,
                financial_performance_score: financialPerformanceScore ? Number(financialPerformanceScore) : null,
                growth_score: growthScore ? Number(growthScore) : null,
                valuation_score: valuationScore ? Number(valuationScore) : null,
                industry_outlook: industryOutlook || null,
                management_notes: managementNotes || null,
                strengths: strengths.split('\n').map(s => s.trim()).filter(Boolean),
                risks: risks.split('\n').map(s => s.trim()).filter(Boolean),
                competitive_position: competitivePosition || null,
                overall_view: overallView || null,
                overall_score: overallScore ? Number(overallScore) : null,
                recommendation: recommendation || null,
                detailed_analysis_html: detailedAnalysisHtml || null,
                author: author || null,
                publish_status: publishStatus,
            }),
        });
        setSaving(false);
        setSaved(true);
    }

    if (loading) {
        return <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-400">Loading review…</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Structured review — editorial analysis</h3>
            <p className="text-xs text-gray-400 mb-3">This is clearly labeled to readers as editorial opinion, distinct from official IPO data and unofficial GMP figures.</p>
            <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                    <div><label className={labelClass}>Business quality (1-10)</label><input type="number" min={1} max={10} value={businessQualityScore} onChange={e => setBusinessQualityScore(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Financials (1-10)</label><input type="number" min={1} max={10} value={financialPerformanceScore} onChange={e => setFinancialPerformanceScore(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Growth (1-10)</label><input type="number" min={1} max={10} value={growthScore} onChange={e => setGrowthScore(e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>Valuation (1-10)</label><input type="number" min={1} max={10} value={valuationScore} onChange={e => setValuationScore(e.target.value)} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Industry outlook</label><textarea value={industryOutlook} onChange={e => setIndustryOutlook(e.target.value)} rows={2} className={inputClass} /></div>
                <div><label className={labelClass}>Management notes</label><textarea value={managementNotes} onChange={e => setManagementNotes(e.target.value)} rows={2} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelClass}>Strengths (one per line)</label><textarea value={strengths} onChange={e => setStrengths(e.target.value)} rows={4} className={inputClass} /></div>
                    <div><label className={labelClass}>Risks (one per line)</label><textarea value={risks} onChange={e => setRisks(e.target.value)} rows={4} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Competitive position</label><textarea value={competitivePosition} onChange={e => setCompetitivePosition(e.target.value)} rows={2} className={inputClass} /></div>
                <div><label className={labelClass}>Overall view</label><textarea value={overallView} onChange={e => setOverallView(e.target.value)} rows={2} className={inputClass} /></div>
                <div className="grid grid-cols-3 gap-2">
                    <div><label className={labelClass}>Overall score (1-10)</label><input type="number" min={1} max={10} value={overallScore} onChange={e => setOverallScore(e.target.value)} className={inputClass} /></div>
                    <div>
                        <label className={labelClass}>Recommendation</label>
                        <select value={recommendation} onChange={e => setRecommendation(e.target.value as IpoRecommendation)} className={inputClass}>
                            <option value="">Select…</option>
                            <option value="subscribe">Subscribe</option>
                            <option value="subscribe_long_term">Subscribe for long term</option>
                            <option value="neutral">Neutral</option>
                            <option value="avoid">Avoid</option>
                        </select>
                    </div>
                    <div><label className={labelClass}>Author</label><input type="text" value={author} onChange={e => setAuthor(e.target.value)} className={inputClass} /></div>
                </div>
                <div>
                    <label className={labelClass}>Detailed analysis (optional long-form)</label>
                    <ArticleEditor value={detailedAnalysisHtml} onChange={setDetailedAnalysisHtml} />
                </div>
                <div className="flex items-center justify-between">
                    <select value={publishStatus} onChange={e => setPublishStatus(e.target.value as 'draft' | 'published')} className={`${inputClass} w-auto`}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <div>
                        <button type="submit" disabled={saving} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-4 py-1.5">
                            {saving ? 'Saving…' : 'Save review'}
                        </button>
                        {saved && <span className="ml-2 text-xs text-green-600">Saved.</span>}
                    </div>
                </div>
            </form>
        </div>
    );
}
