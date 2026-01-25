import { Metadata } from 'next';
import MutualFundCalculatorClient from '@/components/MutualFundCalculatorClient';

export const metadata: Metadata = {
    title: 'Mutual Fund Calculator - Calculate MF Returns for SIP & Lumpsum | Gpaisa',
    description: 'Free mutual fund calculator to calculate returns for SIP and lumpsum investments. Estimate mutual fund returns, plan investments in equity, debt, and hybrid funds.',
    keywords: 'mutual fund calculator, mf calculator, mutual fund returns calculator, sip mutual fund calculator, lumpsum calculator, equity fund calculator, mutual fund investment calculator india',
    openGraph: {
        title: 'Mutual Fund Calculator - Calculate SIP & Lumpsum Returns | Gpaisa',
        description: 'Calculate mutual fund returns for SIP and lumpsum investments. Free MF calculator.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/mutual-fund',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/mutual-fund',
    },
};

export default function MutualFundCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Mutual Fund Calculator',
        description: 'Calculate mutual fund returns for SIP and lumpsum investments in equity, debt, and hybrid funds.',
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
            <MutualFundCalculatorClient />
        </>
    );
}
