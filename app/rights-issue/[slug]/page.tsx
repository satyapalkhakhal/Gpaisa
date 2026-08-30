import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAllPublishedRightsIssueSlugs, fetchRightsIssueBySlug } from '@/lib/otherInvestmentsApi';
import { RIGHTS_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';

export const revalidate = 300;

export async function generateStaticParams() {
    const issues = await fetchAllPublishedRightsIssueSlugs();
    return issues.map(issue => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const issue = await fetchRightsIssueBySlug(slug);
    if (!issue) return { title: 'Rights Issue Not Found | gpaisa.in' };
    const companyName = issue.company?.name || issue.slug;
    const title = issue.meta_title || `${companyName} Rights Issue — Ratio, Price, Record Date | gpaisa.in`;
    const description = issue.meta_description || `${companyName} rights issue: ratio ${issue.rights_ratio || 'TBA'}, issue price ₹${issue.issue_price ?? 'TBA'}.`;
    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url: `https://www.gpaisa.in/rights-issue/${issue.slug}`, siteName: 'gpaisa.in', locale: 'en_IN' },
        alternates: { canonical: `https://www.gpaisa.in/rights-issue/${issue.slug}` },
        robots: { index: issue.publish_status === 'published', follow: true },
    };
}

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

export default async function RightsIssueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const issue = await fetchRightsIssueBySlug(slug);
    if (!issue) notFound();
    const companyName = issue.company?.name || issue.slug;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${companyName} Rights Issue`,
        description: `${companyName} rights issue: ratio, issue price, record date, and application dates.`,
        url: `https://www.gpaisa.in/rights-issue/${issue.slug}`,
        inLanguage: 'en-IN',
        dateModified: issue.updated_at,
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{companyName} Rights Issue</h1>
                    <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-purple-100 text-purple-700">{RIGHTS_LIFECYCLE_LABELS[issue.status]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div><p className="text-xs text-gray-400">Rights ratio</p><p className="font-bold text-gray-900">{issue.rights_ratio || 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Issue price</p><p className="font-bold text-gray-900">{issue.issue_price ? `₹${issue.issue_price}` : 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Face value</p><p className="font-bold text-gray-900">{issue.face_value ? `₹${issue.face_value}` : 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Issue size</p><p className="font-bold text-gray-900">{issue.issue_size ? `₹${issue.issue_size} Cr` : 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Record date</p><p className="font-bold text-gray-900">{formatDate(issue.record_date)}</p></div>
                    <div><p className="text-xs text-gray-400">RE trading window</p><p className="font-bold text-gray-900">{formatDate(issue.re_trading_start)} – {formatDate(issue.re_trading_end)}</p></div>
                    <div><p className="text-xs text-gray-400">Application window</p><p className="font-bold text-gray-900">{formatDate(issue.application_start)} – {formatDate(issue.application_end)}</p></div>
                    <div><p className="text-xs text-gray-400">Listing date</p><p className="font-bold text-gray-900">{formatDate(issue.listing_date)}</p></div>
                </div>
            </div>

            {issue.re_price != null && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900">Rights Entitlement (RE) Price</h2>
                        <DataSourceBadge kind="unofficial" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{issue.re_price}</p>
                    {issue.re_price_updated_at && <FreshnessBadge timestamp={issue.re_price_updated_at} staleAfterMinutes={1440} />}
                    <p className="text-xs text-gray-400 mt-2">RE trading price reflects market sentiment on the value of the entitlement, not a guaranteed value.</p>
                </section>
            )}

            <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Issue Details</h2>
                {issue.objects_of_issue && <p className="text-sm text-gray-700 mb-3">{issue.objects_of_issue}</p>}
                {issue.letter_of_offer_url && (
                    <a href={issue.letter_of_offer_url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary-600 hover:underline">
                        Letter of Offer →
                    </a>
                )}
            </section>
        </div>
    );
}
