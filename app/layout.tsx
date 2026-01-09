import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import Script from "next/script";

export const metadata: Metadata = {
    metadataBase: new URL('https://gpaisa.in'),
    title: "Gpaisa - Live Market Updates, Gold Rates & Financial News",
    description: "Track live stock markets (Sensex, Nifty), today's gold & silver rates, breaking financial news, commodity prices, and smart investment calculators (SIP, PPF, EPF, SWP). Your trusted Indian finance companion!",
    keywords: "stock market, gold rates today, silver price, sensex live, nifty live, sip calculator, ppf calculator, epf calculator, swp calculator, commodity prices, financial news india, investment calculators, gold rate today, market news",
    authors: [{ name: "gpaisa.in" }],
    manifest: "/manifest.json",
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
        url: "https://gpaisa.in",
        siteName: "gpaisa.in",
        images: [
            {
                url: 'https://gpaisa.in/android-chrome-512x512.png',
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
        images: ['https://gpaisa.in/android-chrome-512x512.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Favicon for Google Search */}
                <link rel="icon" href="/favicon.ico" sizes="48x48" />
                <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
                <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

                {/* Google Analytics */}
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
                <Header />
                <MarketTicker />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
