'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MarketTicker from './MarketTicker';
import CookieConsent from './CookieConsent';
import { isHindiPath } from '@/lib/articleLocale';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return <main className="flex-grow">{children}</main>;
    }

    const chrome = (
        <>
            <Header />
            <MarketTicker />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CookieConsent />
        </>
    );

    // Server-rendered lang="hi" on everything inside <body> for Hindi pages (the root
    // <html> is lang="en"). `contents` keeps the wrapper out of the flex layout.
    return isHindiPath(pathname || '') ? <div lang="hi" className="contents">{chrome}</div> : chrome;
}
