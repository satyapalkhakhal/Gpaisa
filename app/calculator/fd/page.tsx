import { Metadata } from 'next';
import FDCalculatorClient from '@/components/FDCalculatorClient';

export const metadata: Metadata = {
    title: 'FD Calculator - Fixed Deposit Calculator Online | Calculate FD Maturity | Gpaisa',
    description: 'Free FD calculator to calculate Fixed Deposit maturity amount and interest. Compare FD rates from SBI, HDFC, ICICI. Calculate FD returns with monthly, quarterly, and yearly compounding.',
    keywords: 'fd calculator, fixed deposit calculator, fd maturity calculator, fd interest calculator, sbi fd calculator, hdfc fd calculator, icici fd calculator, fd calculator india, fixed deposit interest calculator, fd returns calculator, bank fd calculator',
    openGraph: {
        title: 'FD Calculator - Calculate Fixed Deposit Returns | Gpaisa',
        description: 'Calculate your Fixed Deposit maturity amount instantly. Free FD calculator with all compounding options.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/fd',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/fd',
    },
};

export default function FDCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'FD Calculator',
        description: 'Calculate Fixed Deposit maturity amount and interest earned. Compare FD rates and plan your investments.',
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
            <FDCalculatorClient />
        </>
    );
}
