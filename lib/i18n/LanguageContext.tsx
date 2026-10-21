'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Language, translations } from './translations';
import { isHindiPath } from '@/lib/articleLocale';

interface LanguageContextType {
    language: Language;
    t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// The UI language follows the URL: /hi/* renders Hindi chrome (server-rendered, so
// crawlers see it too), everything else English. Switching language means navigating
// to the other language's URL — see components/LanguageSwitcher.tsx.
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '/';
    const language: Language = isHindiPath(pathname) ? 'hi' : 'en';

    // The root layout renders <html lang="en">; correct it for Hindi pages in the browser.
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const t = useCallback((section: string, key: string): string => {
        const sectionObj = (translations as Record<string, Record<string, Record<string, string>>>)[section];
        if (!sectionObj) return key;
        const entry = sectionObj[key];
        if (!entry) return key;
        return entry[language] || entry['en'] || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
