'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Scale } from 'lucide-react';
import { CompareItem, clearCompareSelection, getCompareSelection, subscribeToCompareChanges, toggleCompareSelection } from '@/lib/ipoCompareStore';

export default function CompareBar() {
    const router = useRouter();
    const [items, setItems] = useState<CompareItem[]>([]);

    useEffect(() => {
        const sync = () => setItems(getCompareSelection());
        sync();
        return subscribeToCompareChanges(sync);
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white shadow-2xl">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-semibold shrink-0">
                    <Scale className="w-4 h-4" />
                    Compare ({items.length}/3)
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                    {items.map(item => (
                        <span key={item.slug} className="inline-flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1 text-xs">
                            {item.name}
                            <button onClick={() => toggleCompareSelection(item)} aria-label={`Remove ${item.name}`} className="hover:text-red-400">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => clearCompareSelection()} className="text-xs text-gray-400 hover:text-white px-2 py-1.5">
                        Clear
                    </button>
                    <button
                        onClick={() => router.push(`/ipo/compare?ipos=${items.map(i => i.slug).join(',')}`)}
                        disabled={items.length < 2}
                        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-4 py-1.5 transition-colors"
                    >
                        Compare
                    </button>
                </div>
            </div>
        </div>
    );
}
