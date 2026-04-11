'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const languages = [
    { code: 'en' as const, label: 'English', flag: '🇮🇳' },
    { code: 'hi' as const, label: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
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

    const current = languages.find(l => l.code === language) || languages[0];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-primary-300"
                aria-label="Select Language"
                id="language-switcher"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{current.flag} {current.label}</span>
                <span className="sm:hidden">{current.flag}</span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setOpen(false);
                            }}
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
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
