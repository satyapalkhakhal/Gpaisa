import Link from 'next/link';
import type { NcdIssue } from '@/lib/otherInvestmentsTypes';
import { NCD_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';

function formatDateRange(issue: NcdIssue): string {
    if (!issue.open_date) return 'Dates TBA';
    const open = new Date(issue.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    if (!issue.close_date) return `Opens ${open}`;
    const close = new Date(issue.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${open} – ${close}`;
}

export default function NcdCard({ issue }: { issue: NcdIssue }) {
    const companyName = issue.company?.name || issue.slug;
    const topCoupon = issue.series.length > 0 ? Math.max(...issue.series.map(s => s.coupon_rate)) : null;
    return (
        <Link href={`/ncd/${issue.slug}`} className="block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 leading-snug">{companyName} <span className="font-normal text-gray-500">NCD</span></h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">{NCD_LIFECYCLE_LABELS[issue.status]}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{formatDateRange(issue)}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400 text-xs">Credit rating</p>
                    <p className="font-semibold text-gray-900">{issue.credit_rating || 'TBA'}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Coupon up to</p>
                    <p className="font-semibold text-gray-900">{topCoupon != null ? `${topCoupon}% p.a.` : 'TBA'}</p>
                </div>
            </div>
        </Link>
    );
}
