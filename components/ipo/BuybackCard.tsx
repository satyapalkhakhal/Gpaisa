import Link from 'next/link';
import type { Buyback } from '@/lib/otherInvestmentsTypes';
import { BUYBACK_LIFECYCLE_LABELS } from '@/lib/otherInvestmentsTypes';

function formatDate(d: string | null): string {
    return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA';
}

export default function BuybackCard({ buyback }: { buyback: Buyback }) {
    const companyName = buyback.company?.name || buyback.slug;
    return (
        <Link href={`/buyback/${buyback.slug}`} className="block bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900 leading-snug">{companyName} <span className="font-normal text-gray-500">Buyback</span></h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{BUYBACK_LIFECYCLE_LABELS[buyback.status]}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3 capitalize">{buyback.method.replace('_', ' ')} · Record date: {formatDate(buyback.record_date)}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-gray-400 text-xs">Buyback price</p>
                    <p className="font-semibold text-gray-900">{buyback.buyback_price ? `₹${buyback.buyback_price}${buyback.buyback_price_max ? ` – ₹${buyback.buyback_price_max}` : ''}` : 'TBA'}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Buyback size</p>
                    <p className="font-semibold text-gray-900">{buyback.buyback_size ? `₹${buyback.buyback_size} Cr` : 'TBA'}</p>
                </div>
            </div>
        </Link>
    );
}
