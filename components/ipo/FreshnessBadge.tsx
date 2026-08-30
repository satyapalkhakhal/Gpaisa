'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

function formatAgo(minutes: number): string {
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${Math.floor(minutes)} min ago`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)} hr${Math.floor(hours) === 1 ? '' : 's'} ago`;
    const days = hours / 24;
    return `${Math.floor(days)} day${Math.floor(days) === 1 ? '' : 's'} ago`;
}

interface FreshnessBadgeProps {
    /** ISO timestamp of when this data point was recorded. */
    timestamp: string;
    /** Data older than this (minutes) is flagged stale. Defaults suit fast-moving GMP/subscription data. */
    staleAfterMinutes?: number;
    className?: string;
}

/**
 * "Updated X ago" indicator with a stale flag — never lets a time-sensitive
 * IPO metric (GMP, subscription, allotment) sit on screen looking current
 * when it isn't.
 */
export default function FreshnessBadge({ timestamp, staleAfterMinutes = 180, className = '' }: FreshnessBadgeProps) {
    const [, tick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => tick(n => n + 1), 30_000);
        return () => clearInterval(id);
    }, []);

    const minutesAgo = (Date.now() - new Date(timestamp).getTime()) / 60000;
    const isStale = minutesAgo > staleAfterMinutes;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs ${isStale ? 'text-amber-700' : 'text-gray-500'} ${className}`}
            title={new Date(timestamp).toLocaleString('en-IN')}
        >
            {isStale ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {isStale ? `Stale — updated ${formatAgo(minutesAgo)}` : `Updated ${formatAgo(minutesAgo)}`}
        </span>
    );
}
