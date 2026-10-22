'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Light/dark switch. The initial theme is applied before paint by the script in
// app/layout.tsx (saved choice, else the system setting); this button flips and saves it.
export default function ThemeToggle({ className = '' }: { className?: string }) {
    const [dark, setDark] = useState<boolean | null>(null);

    useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);

    function toggle() {
        const next = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', next);
        document.documentElement.style.colorScheme = next ? 'dark' : 'light';
        try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* private mode */ }
        setDark(next);
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={dark ? 'Light theme' : 'Dark theme'}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gw-border text-gw-text hover:text-gw-green hover:border-gw-green transition-colors ${className}`}
        >
            {/* Both icons render on the server; CSS shows the right one before hydration. */}
            <Sun className="h-[18px] w-[18px] hidden dark:block" aria-hidden="true" />
            <Moon className="h-[18px] w-[18px] block dark:hidden" aria-hidden="true" />
        </button>
    );
}
