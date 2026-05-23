import { Metadata } from 'next';
import GratuityCalculatorClient from '@/components/GratuityCalculatorClient';

export const metadata: Metadata = {
    title: 'Gratuity Calculator - Calculate Gratuity Amount Online | Gpaisa',
    description: 'Free gratuity calculator to calculate gratuity amount as per Payment of Gratuity Act, 1972. Find out your gratuity on retirement or resignation. Tax-free up to ₹20 lakhs.',
    openGraph: {
        title: 'Gratuity Calculator - Calculate Your Gratuity Amount | Gpaisa',
        description: 'Calculate your gratuity amount instantly. Free gratuity calculator as per Indian law.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/gratuity',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/gratuity',
    },
};

export default function GratuityCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Gratuity Calculator',
        description: 'Calculate gratuity amount as per Payment of Gratuity Act, 1972.',
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
            <GratuityCalculatorClient />
        </>
    );
}
