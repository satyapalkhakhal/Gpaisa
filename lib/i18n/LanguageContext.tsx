'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (section: string, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Read saved language from localStorage
        const saved = localStorage.getItem('gpaisa-lang') as Language;
        if (saved && (saved === 'en' || saved === 'hi')) {
            setLanguageState(saved);
        }
        setMounted(true);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('gpaisa-lang', lang);
        // Update the html lang attribute
        document.documentElement.lang = lang;
    }, []);

    const t = useCallback((section: string, key: string): string => {
        const sectionObj = (translations as Record<string, Record<string, Record<string, string>>>)[section];
        if (!sectionObj) return key;
        const entry = sectionObj[key];
        if (!entry) return key;
        return entry[language] || entry['en'] || key;
    }, [language]);

    // Prevent hydration mismatch by rendering children only after mount
    // But we still render immediately with 'en' default to avoid layout shift
    return (
        <LanguageContext.Provider value={{ language: mounted ? language : 'en', setLanguage, t }}>
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
