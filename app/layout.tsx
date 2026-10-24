import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { LanguageProvider } from "@/lib/i18n";
import Script from "next/script";
import { INDEXABLE_ROBOTS } from "@/lib/seo";

// Self-hosted at build time; exposed as CSS variables used by tailwind.config.ts fontFamily.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-devanagari" });

export const metadata: Metadata = {
    metadataBase: new URL('https://www.gpaisa.in'),
    title: "Gpaisa - Live Market Updates, Gold Rates & Financial News",
    description: "Track live stock markets (Sensex, Nifty), today's gold & silver rates, breaking financial news, commodity prices, and smart investment calculators (SIP, PPF, EPF, SWP). Your trusted Indian finance companion!",
    authors: [{ name: "Satyapal Khakhal" }],
    manifest: "/manifest.json",
    // Default for routes that do not set their own robots metadata.
    robots: INDEXABLE_ROBOTS,
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            {
                rel: 'icon',
                url: '/favicon.ico',
            },
        ],
    },
    openGraph: {
        title: "Gpaisa - Your Trusted Financial Portal",
        description: "Real-time market updates, gold rates, and financial news for India",
        type: "website",
        locale: "en_IN",
        url: "https://www.gpaisa.in",
        siteName: "gpaisa.in",
        images: [
            {
                url: 'https://www.gpaisa.in/android-chrome-512x512.png',
                width: 512,
                height: 512,
                alt: 'gpaisa.in logo',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: 'gpaisa.in - Live Market Updates',
        description: 'Real-time stock market updates, gold rates, and financial news for India',
        images: ['https://www.gpaisa.in/android-chrome-512x512.png'],
        creator: '@gpaisa_in',
        site: '@gpaisa_in',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // suppressHydrationWarning: the theme script below sets class/style on <html> before React loads.
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${notoDevanagari.variable}`}>
            <head>
                {/* Theme before first paint (no flash): saved choice, else the system setting. See components/ThemeToggle.tsx. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;if(d)e.classList.add('dark');e.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
                    }}
                />
                <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
                <meta name="theme-color" content="#0B0612" media="(prefers-color-scheme: dark)" />

                {/* Favicon for Google Search */}
                <link rel="icon" href="/favicon.ico" sizes="48x48" />
                <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
                <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

                {/* RSS feed — used by Google Discover "Follow" and feed readers */}
                <link rel="alternate" type="application/rss+xml" title="gpaisa.in — latest articles" href="https://www.gpaisa.in/feed.xml" />

                {/* Google AdSense verification */}
                <meta name="google-adsense-account" content="ca-pub-2757390342181644" />

                {/* Google Consent Mode v2 — deny by default until user accepts */}
                <Script id="consent-mode-default" strategy="beforeInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('consent', 'default', {
                            ad_storage: 'denied',
                            ad_user_data: 'denied',
                            ad_personalization: 'denied',
                            analytics_storage: 'denied',
                            wait_for_update: 500
                        });
                    `}
                </Script>

                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-TV8X50LJB1"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-TV8X50LJB1');
                    `}
                </Script>
            </head>
            <body className="flex flex-col min-h-screen">
                <LanguageProvider>
                    <SiteChrome>{children}</SiteChrome>
                </LanguageProvider>
            </body>
        </html>
    );
}
