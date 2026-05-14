import { Metadata } from 'next';
import CAGRCalculatorClient from '@/components/CAGRCalculatorClient';

export const metadata: Metadata = {
    title: 'CAGR Calculator - Compound Annual Growth Rate Calculator Online | Gpaisa',
    description: 'Free CAGR calculator to calculate Compound Annual Growth Rate for investments. Measure mean annual growth rate of stocks, mutual funds, and portfolios. Get instant CAGR calculation with detailed analysis.',
    keywords: 'cagr calculator, compound annual growth rate calculator, cagr calculator india, investment growth calculator, mutual fund cagr, stock cagr calculator, portfolio cagr, annual growth rate calculator, cagr formula, calculate cagr online, investment returns calculator',
    openGraph: {
        title: 'CAGR Calculator - Calculate Compound Annual Growth Rate | Gpaisa',
        description: 'Calculate CAGR for your investments instantly. Free online Compound Annual Growth Rate calculator for stocks, mutual funds, and portfolios.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/cagr',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/cagr',
    },
};

export default function CAGRCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'CAGR Calculator',
        description: 'Calculate Compound Annual Growth Rate (CAGR) for investments. Measure mean annual growth rate of stocks, mutual funds, and portfolios.',
        applicationCategory: 'FinanceApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'IN',
                returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            },
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <CAGRCalculatorClient />
        </>
    );
}
