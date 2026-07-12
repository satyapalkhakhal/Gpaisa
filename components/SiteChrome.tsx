'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MarketTicker from './MarketTicker';
import CookieConsent from './CookieConsent';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) {
        return <main className="flex-grow">{children}</main>;
    }

    return (
        <>
            <Header />
            <MarketTicker />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CookieConsent />
        </>
    );
}
