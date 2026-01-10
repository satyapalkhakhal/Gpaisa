import { Metadata } from 'next';
import GratuityCalculatorClient from '@/components/GratuityCalculatorClient';

export const metadata: Metadata = {
    title: 'Gratuity Calculator - Calculate Gratuity Amount Online | Gpaisa',
    description: 'Free gratuity calculator to calculate gratuity amount as per Payment of Gratuity Act, 1972. Find out your gratuity on retirement or resignation. Tax-free up to ₹20 lakhs.',
    keywords: 'gratuity calculator, gratuity calculation, gratuity calculator india, payment of gratuity act calculator, retirement gratuity calculator, gratuity amount calculator, gratuity formula calculator',
    openGraph: {
        title: 'Gratuity Calculator - Calculate Your Gratuity Amount | Gpaisa',
        description: 'Calculate your gratuity amount instantly. Free gratuity calculator as per Indian law.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/gratuity',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/gratuity',
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
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <GratuityCalculatorClient />
        </>
    );
}
