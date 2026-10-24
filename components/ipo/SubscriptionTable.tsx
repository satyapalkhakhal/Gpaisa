import type { IpoSubscriptionUpdate, SubscriptionCategory } from '@/lib/ipoTypes';
import FreshnessBadge from './FreshnessBadge';

// Server-rendered subscription figures: the latest overall figure as a headline, then
// times-subscribed by category and bidding day. Rendered as HTML (not only the client
// chart) so the numbers are visible to readers without JavaScript and to crawlers.
// The automatic Groww sync records only the 'overall' category; category rows come
// from editors in the admin.

const ORDER: SubscriptionCategory[] = ['qib', 'nii', 'retail', 'employee', 'shareholder', 'overall'];
const LABELS: Record<SubscriptionCategory, string> = {
    qib: 'QIB',
    nii: 'NII (HNI)',
    retail: 'Retail',
    employee: 'Employee',
    shareholder: 'Shareholder',
    overall: 'Overall',
};

const times = (n: number) => `${Number(n.toFixed(2))}x`;
const asOfIst = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default function SubscriptionTable({ history, isOpen }: { history: IpoSubscriptionUpdate[]; isOpen: boolean }) {
    if (history.length === 0) {
        return <p className="text-sm text-gray-400 py-6 text-center">No subscription data yet.</p>;
    }

    const days = Array.from(new Set(history.map(u => u.day_number))).sort((a, b) => a - b);
    const categories = ORDER.filter(c => history.some(u => u.category === c));
    const cell = (cat: SubscriptionCategory, day: number) => history.find(u => u.category === cat && u.day_number === day);

    const overallRows = history.filter(u => u.category === 'overall');
    const latest = overallRows.length
        ? overallRows.reduce((a, b) => (b.day_number > a.day_number || (b.day_number === a.day_number && b.as_of > a.as_of) ? b : a))
        : null;
    const live = !!latest && isOpen && latest.data_granularity === 'intraday';

    return (
        <div>
            {latest && (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                    <span className="text-3xl font-bold text-gray-900">{times(latest.subscription_times)}</span>
                    <span className="text-sm text-gray-600">
                        overall, {live ? `live on day ${latest.day_number}` : isOpen ? `end of day ${latest.day_number}` : 'final'}
                        {' · '}as of {asOfIst(latest.as_of)} IST
                    </span>
                    {isOpen && <FreshnessBadge timestamp={latest.as_of} staleAfterMinutes={90} />}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-500 border-b border-gray-100">
                            <th className="py-2 pr-4 font-medium">Category</th>
                            {days.map(d => (
                                <th key={d} className="py-2 pl-4 text-right font-medium">Day {d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(cat => (
                            <tr key={cat} className={cat === 'overall' ? 'font-semibold' : ''}>
                                <td className="py-2 pr-4 text-gray-700">{LABELS[cat]}</td>
                                {days.map(d => {
                                    const u = cell(cat, d);
                                    return (
                                        <td key={d} className="py-2 pl-4 text-right text-gray-900 tabular-nums">
                                            {u ? times(u.subscription_times) : '—'}
                                            {isOpen && u?.data_granularity === 'intraday' && <span className="ml-1 text-xs font-normal text-gray-400">live</span>}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
