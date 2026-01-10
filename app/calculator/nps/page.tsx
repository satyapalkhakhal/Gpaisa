import { Metadata } from 'next';
import NPSCalculatorClient from '@/components/NPSCalculatorClient';

export const metadata: Metadata = {
    title: 'NPS Calculator - National Pension System Calculator Online | Gpaisa',
    description: 'Free NPS calculator to calculate National Pension System returns and retirement corpus. Plan your retirement with NPS investment calculator. Calculate tax benefits under 80CCD.',
    keywords: 'nps calculator, national pension system calculator, nps return calculator, nps maturity calculator, nps investment calculator, nps tax benefit calculator, pension calculator india, retirement calculator, nps corpus calculator',
    openGraph: {
        title: 'NPS Calculator - Calculate National Pension System Returns | Gpaisa',
        description: 'Calculate your NPS retirement corpus and tax benefits. Free National Pension System calculator.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/nps',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/nps',
    },
};

export default function NPSCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'NPS Calculator',
        description: 'Calculate National Pension System returns and retirement corpus with tax benefits.',
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
            <NPSCalculatorClient />
        </>
    );
}
