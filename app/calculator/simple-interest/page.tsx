import { Metadata } from 'next';
import SimpleInterestCalculatorClient from '@/components/SimpleInterestCalculatorClient';

export const metadata: Metadata = {
    title: 'Simple Interest Calculator - Calculate SI Online | Gpaisa',
    description: 'Free simple interest calculator to calculate SI on loans and deposits. Find interest amount and total payable using SI formula. Easy and accurate simple interest calculation.',
    keywords: 'simple interest calculator, si calculator, simple interest formula calculator, loan interest calculator, simple interest calculator india, calculate simple interest online',
    openGraph: {
        title: 'Simple Interest Calculator - Calculate SI Online | Gpaisa',
        description: 'Calculate simple interest on loans and deposits instantly. Free SI calculator.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/simple-interest',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/simple-interest',
    },
};

export default function SimpleInterestCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Simple Interest Calculator',
        description: 'Calculate simple interest on loans and deposits using SI formula.',
        applicationCategory: 'FinanceApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <SimpleInterestCalculatorClient />
        </>
    );
}
