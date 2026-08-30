'use client';

import { useState } from 'react';
import DataSourceBadge from './DataSourceBadge';

export default function AllotmentProbabilityCalculatorClient() {
    const [lotsApplied, setLotsApplied] = useState('1');
    const [subscriptionTimes, setSubscriptionTimes] = useState('5');

    const lots = Math.max(1, Number(lotsApplied) || 1);
    const oversubscription = Math.max(0, Number(subscriptionTimes) || 0);

    // Simplified heuristic used industry-wide for small-lot retail applications: when a
    // category is oversubscribed by X times, allotment is by lottery and the chance of
    // getting at least one lot approximates 1/X. Not oversubscribed (X <= 1) → full allotment.
    const probabilityPercent = oversubscription <= 1 ? 100 : Math.min(100, (1 / oversubscription) * 100);

    const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <DataSourceBadge kind="estimated" />
                <p className="text-sm text-gray-500">This is a simplified statistical estimate, not a guarantee of allotment.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lots applied for</label>
                    <input type="number" min={1} value={lotsApplied} onChange={e => setLotsApplied(e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category subscription (times)</label>
                    <input type="number" min={0} step="0.1" value={subscriptionTimes} onChange={e => setSubscriptionTimes(e.target.value)} className={inputClass} />
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-400 mb-1">Estimated probability of at least one lot</p>
                <p className="text-4xl font-bold text-primary-600">{probabilityPercent.toFixed(1)}%</p>
                {lots > 1 && (
                    <p className="text-xs text-gray-400 mt-2">
                        Applying for {lots} lots does not multiply this probability — SEBI's lottery-based allotment for retail applicants
                        typically caps the benefit at one lot per applicant regardless of lots applied for.
                    </p>
                )}
            </div>

            <p className="text-xs text-gray-400 mt-4">
                Actual allotment is determined by SEBI-mandated lottery rules run by the registrar and can differ from this estimate.
                Use the registrar's official allotment status check once allotment is finalized — never rely on this estimate alone.
            </p>
        </div>
    );
}
