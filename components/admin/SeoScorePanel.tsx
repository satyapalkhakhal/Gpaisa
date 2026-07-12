'use client';

import { computeSeoScore, SeoScoreInput } from '@/lib/seoScore';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SeoScorePanel({ input }: { input: SeoScoreInput }) {
    const { score, checks } = computeSeoScore(input);
    const color = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
    const barColor = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">SEO Score</h3>
                <span className={`text-2xl font-black ${color}`}>{score}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className={`h-full ${barColor} transition-all`} style={{ width: `${score}%` }} />
            </div>
            <ul className="space-y-2.5">
                {checks.map((check) => (
                    <li key={check.label} className="flex items-start gap-2 text-sm">
                        {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                        )}
                        <div>
                            <div className="font-medium text-gray-700">{check.label}</div>
                            <div className="text-xs text-gray-400">{check.message}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
