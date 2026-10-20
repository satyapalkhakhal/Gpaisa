import type { Ipo } from '@/lib/ipoTypes';

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
}

export default function AnchorInvestorSection({ ipo }: { ipo: Ipo }) {
    if (!ipo.anchor_bidding_date) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-xs text-gray-400">Bidding date</p><p className="font-semibold text-gray-900">{formatDate(ipo.anchor_bidding_date)}</p></div>
            {ipo.anchor_shares != null && <div><p className="text-xs text-gray-400">Shares offered</p><p className="font-semibold text-gray-900">{ipo.anchor_shares.toLocaleString('en-IN')}</p></div>}
            {ipo.anchor_allocation_amount != null && <div><p className="text-xs text-gray-400">Allocation size</p><p className="font-semibold text-gray-900">₹{ipo.anchor_allocation_amount} Cr</p></div>}
            {ipo.anchor_lock_in_50pct_date && <div><p className="text-xs text-gray-400">50% lock-in ends</p><p className="font-semibold text-gray-900">{formatDate(ipo.anchor_lock_in_50pct_date)}</p></div>}
            {ipo.anchor_lock_in_remaining_date && <div><p className="text-xs text-gray-400">Remaining lock-in ends</p><p className="font-semibold text-gray-900">{formatDate(ipo.anchor_lock_in_remaining_date)}</p></div>}
            {ipo.anchor_list_url && (
                <div className="col-span-2 sm:col-span-4">
                    <a href={ipo.anchor_list_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:underline">
                        Anchor Investor List (PDF) →
                    </a>
                </div>
            )}
        </div>
    );
}
