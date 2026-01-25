import { Metadata } from 'next';
import HRACalculatorClient from '@/components/HRACalculatorClient';

export const metadata: Metadata = {
    title: 'HRA Calculator - House Rent Allowance Tax Exemption Calculator | Gpaisa',
    description: 'Free HRA calculator to calculate House Rent Allowance tax exemption. Find out how much HRA is exempt from income tax for metro and non-metro cities in India.',
    keywords: 'hra calculator, house rent allowance calculator, hra exemption calculator, hra tax benefit calculator, hra calculation, metro hra calculator, hra calculator india, rent exemption calculator',
    openGraph: {
        title: 'HRA Calculator - Calculate House Rent Allowance Tax Exemption | Gpaisa',
        description: 'Calculate your HRA tax exemption instantly. Free House Rent Allowance calculator for India.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/hra',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/hra',
    },
};

export default function HRACalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'HRA Calculator',
        description: 'Calculate House Rent Allowance tax exemption for salaried individuals in India.',
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
            <HRACalculatorClient />
        </>
    );
}
