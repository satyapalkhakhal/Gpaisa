import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAllPublishedNcdSlugs, fetchNcdIssueBySlug } from '@/lib/otherInvestmentsApi';
import { NCD_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';
import DataSourceBadge from '@/components/ipo/DataSourceBadge';
import FreshnessBadge from '@/components/ipo/FreshnessBadge';

export const revalidate = 300;

export async function generateStaticParams() {
    const issues = await fetchAllPublishedNcdSlugs();
    return issues.map(issue => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const issue = await fetchNcdIssueBySlug(slug);
    if (!issue) return { title: 'NCD Issue Not Found | gpaisa.in' };
    const companyName = issue.company?.name || issue.slug;
    const title = issue.meta_title || `${companyName} NCD — Coupon Rate, Credit Rating, Dates | gpaisa.in`;
    const description = issue.meta_description || `${companyName} NCD issue: credit rating ${issue.credit_rating || 'TBA'}, coupon rates across tenure options.`;
    return {
        title,
        description,
        openGraph: { title, description, type: 'website', url: `https://www.gpaisa.in/ncd/${issue.slug}`, siteName: 'gpaisa.in', locale: 'en_IN' },
        alternates: { canonical: `https://www.gpaisa.in/ncd/${issue.slug}` },
        robots: { index: issue.publish_status === 'published', follow: true },
    };
}

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

export default async function NcdDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const issue = await fetchNcdIssueBySlug(slug);
    if (!issue) notFound();
    const companyName = issue.company?.name || issue.slug;

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${companyName} NCD`,
        description: `${companyName} NCD issue with credit rating, coupon rates, and tenure options.`,
        url: `https://www.gpaisa.in/ncd/${issue.slug}`,
        inLanguage: 'en-IN',
        dateModified: issue.updated_at,
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{companyName} NCD</h1>
                        <p className="text-sm text-gray-500">{issue.secured ? 'Secured' : 'Unsecured'} · {issue.credit_rating || 'Rating TBA'}{issue.rating_agency ? ` (${issue.rating_agency})` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">{NCD_LIFECYCLE_LABELS[issue.status]}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div><p className="text-xs text-gray-400">Open date</p><p className="font-bold text-gray-900">{formatDate(issue.open_date)}</p></div>
                    <div><p className="text-xs text-gray-400">Close date</p><p className="font-bold text-gray-900">{formatDate(issue.close_date)}</p></div>
                    <div><p className="text-xs text-gray-400">Allotment date</p><p className="font-bold text-gray-900">{formatDate(issue.allotment_date)}</p></div>
                    <div><p className="text-xs text-gray-400">Listing date</p><p className="font-bold text-gray-900">{formatDate(issue.listing_date)}</p></div>
                    <div><p className="text-xs text-gray-400">Base issue size</p><p className="font-bold text-gray-900">{issue.base_issue_size ? `₹${issue.base_issue_size} Cr` : 'TBA'}</p></div>
                    <div><p className="text-xs text-gray-400">Shelf limit</p><p className="font-bold text-gray-900">{issue.shelf_limit ? `₹${issue.shelf_limit} Cr` : 'TBA'}</p></div>
                </div>
            </div>

            {issue.series.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 overflow-x-auto">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Series (Tenure &amp; Coupon Options)</h2>
                    <table className="w-full text-sm min-w-[500px]">
                        <thead className="text-left text-gray-500">
                            <tr><th className="py-2">Series</th><th>Tenure</th><th>Coupon</th><th>Frequency</th><th>Min. investment</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {issue.series.map((s, i) => (
                                <tr key={i}>
                                    <td className="py-2 font-medium text-gray-900">{s.name}</td>
                                    <td>{s.tenure_months} months</td>
                                    <td className="font-semibold text-gray-900">{s.coupon_rate}% p.a.</td>
                                    <td className="capitalize">{s.frequency}</td>
                                    <td>{s.min_investment ? `₹${s.min_investment.toLocaleString('en-IN')}` : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {issue.subscription_times_overall != null && (
                <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
                        <DataSourceBadge kind="official" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{issue.subscription_times_overall}x</p>
                    {issue.subscription_updated_at && <FreshnessBadge timestamp={issue.subscription_updated_at} staleAfterMinutes={1440} />}
                </section>
            )}

            <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Issue Details</h2>
                {issue.objects_of_issue && <p className="text-sm text-gray-700 mb-3">{issue.objects_of_issue}</p>}
                {issue.lead_managers.length > 0 && (
                    <p className="text-sm"><span className="text-gray-400">Lead managers: </span><span className="font-semibold text-gray-900">{issue.lead_managers.join(', ')}</span></p>
                )}
                {issue.prospectus_url && (
                    <a href={issue.prospectus_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:underline">
                        Prospectus →
                    </a>
                )}
            </section>
        </div>
    );
}
