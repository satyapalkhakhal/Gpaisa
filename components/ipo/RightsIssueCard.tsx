import Link from 'next/link';
import type { RightsIssue } from '@/lib/otherInvestmentsTypes';
import { RIGHTS_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA';
}

export default function RightsIssueCard({ issue }: { issue: RightsIssue }) {
    const companyName = issue.company?.name || issue.slug;
    return (
        <Link href={`/rights-issue/${issue.slug}`} className="block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 leading-snug">{companyName} <span className="font-normal text-gray-500">Rights Issue</span></h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">{RIGHTS_LIFECYCLE_LABELS[issue.status]}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Record date: {formatDate(issue.record_date)}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400 text-xs">Rights ratio</p>
                    <p className="font-semibold text-gray-900">{issue.rights_ratio || 'TBA'}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Issue price</p>
                    <p className="font-semibold text-gray-900">{issue.issue_price ? `₹${issue.issue_price}` : 'TBA'}</p>
                </div>
            </div>
        </Link>
    );
}
