'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { HREFLANG } from '@/lib/articleLocale';

const languages = [
    { code: 'en' as const, label: 'English', flag: '🇮🇳', home: '/' },
    { code: 'hi' as const, label: 'हिन्दी', flag: '🇮🇳', home: '/hi' },
];

type Code = (typeof languages)[number]['code'];

// Each option is a real link. It goes to this page's translation when the page
// declares one (<link rel="alternate" hreflang>), otherwise to that language's home.
// The menu stays in the DOM when closed so crawlers can follow the links.
function translatedPath(code: Code): string | null {
    const el = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${HREFLANG[code]}"]`);
    if (!el?.href) return null;
    const url = new URL(el.href);
    return url.pathname + url.search;
}

export default function LanguageSwitcher() {
    const { language } = useLanguage();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [hrefs, setHrefs] = useState<Record<Code, string>>({ en: '/', hi: '/hi' });
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close on navigation.
    useEffect(() => setOpen(false), [pathname]);

    function toggle() {
        if (!open) {
            // Read the alternates when opening, after the current page's <head> is in place.
            setHrefs({
                en: language === 'en' ? pathname || '/' : translatedPath('en') || '/',
                hi: language === 'hi' ? pathname || '/hi' : translatedPath('hi') || '/hi',
            });
        }
        setOpen(!open);
    }

    const current = languages.find(l => l.code === language) || languages[0];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={toggle}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-primary-300"
                aria-label="Select Language"
                aria-expanded={open}
                id="language-switcher"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{current.flag} {current.label}</span>
                <span className="sm:hidden">{current.flag}</span>
            </button>

            <div className={`${open ? '' : 'hidden '}absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
                {languages.map((lang) => (
                    <Link
                        key={lang.code}
                        href={hrefs[lang.code] || lang.home}
                        hrefLang={HREFLANG[lang.code]}
                        lang={lang.code}
                        onClick={() => setOpen(false)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${language === lang.code
                            ? 'bg-primary-50 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            {lang.label}
                        </span>
                        {language === lang.code && (
                            <Check className="w-4 h-4 text-primary-600" />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
