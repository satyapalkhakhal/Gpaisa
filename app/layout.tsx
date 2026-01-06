import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import Script from "next/script";

export const metadata: Metadata = {
    metadataBase: new URL('https://gpaisa.in'),
    title: "gpaisa.in - Live Market Updates, Gold Rates & Financial News",
    description: "Get real-time stock market updates, gold & silver rates, commodity prices, agriculture market data, and personal finance tips. Your trusted Indian financial portal.",
    keywords: "stock market, gold rates, silver price, sensex, nifty, commodity prices, agriculture prices, personal finance, investment tips",
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
        title: "gpaisa.in - Your Trusted Financial Portal",
        description: "Real-time market updates, gold rates, and financial news for India",
        type: "website",
        locale: "en_IN",
        siteName: "gpaisa.in",
        images: [
            {
                url: '/android-chrome-512x512.png',
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
        images: ['/android-chrome-512x512.png'],
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
