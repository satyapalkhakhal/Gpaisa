'use client';

import { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';
import {
    MAX_COMPARE,
    getCompareSelection,
    isCompareSelected,
    subscribeToCompareChanges,
    toggleCompareSelection,
} from '@/lib/ipoCompareStore';

export default function CompareCheckbox({ slug, name, className = '' }: { slug: string; name: string; className?: string }) {
    const [selected, setSelected] = useState(false);
    const [trayFull, setTrayFull] = useState(false);

    useEffect(() => {
        const sync = () => {
            setSelected(isCompareSelected(slug));
            setTrayFull(getCompareSelection().length >= MAX_COMPARE);
        };
        sync();
        return subscribeToCompareChanges(sync);
    }, [slug]);

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        toggleCompareSelection({ slug, name });
    }

    const disabled = !selected && trayFull;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            title={disabled ? `You can compare up to ${MAX_COMPARE} IPOs at a time` : selected ? 'Remove from comparison' : 'Add to comparison'}
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                selected ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600'
            } ${className}`}
        >
            <Scale className="w-3 h-3" />
            {selected ? 'Comparing' : 'Compare'}
        </button>
    );
}
