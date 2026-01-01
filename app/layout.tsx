import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";

export const metadata: Metadata = {
    title: "gpaisa.in - Live Market Updates, Gold Rates & Financial News",
    description: "Get real-time stock market updates, gold & silver rates, commodity prices, agriculture market data, and personal finance tips. Your trusted Indian financial portal.",
    keywords: "stock market, gold rates, silver price, sensex, nifty, commodity prices, agriculture prices, personal finance, investment tips",
    authors: [{ name: "gpaisa.in" }],
    openGraph: {
        title: "gpaisa.in - Your Trusted Financial Portal",
        description: "Real-time market updates, gold rates, and financial news for India",
        type: "website",
        locale: "en_IN",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
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
