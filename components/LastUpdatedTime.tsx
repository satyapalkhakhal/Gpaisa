'use client';

import { useEffect, useState } from 'react';

export default function LastUpdatedTime() {
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        setMounted(true);
        const now = new Date();
        setCurrentTime(now.toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }));
    }, []);

    // Return a placeholder during SSR to avoid hydration mismatch
    if (!mounted) {
        return <span className="text-sm text-gray-500">Loading...</span>;
    }

    return (
        <p className="text-sm text-gray-500">
            Last updated: <time dateTime={new Date().toISOString()}>{currentTime} IST</time>
        </p>
    );
}
