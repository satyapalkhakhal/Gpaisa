import { Metadata } from 'next';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';

export const metadata: Metadata = {
    title: 'Home Loan Calculator - Calculate EMI, Interest & Total Payment | Gpaisa',
    description: 'Free online home loan calculator to calculate your monthly EMI, total interest payable, and loan repayment schedule. Get instant results with our easy-to-use home loan EMI calculator.',
    keywords: 'home loan calculator, home loan emi calculator, housing loan calculator, emi calculator, home loan interest calculator, mortgage calculator india, loan calculator online, home loan emi, housing loan emi calculator',
    openGraph: {
        title: 'Home Loan Calculator - Calculate Your Home Loan EMI | Gpaisa',
        description: 'Calculate your home loan EMI instantly with our free online calculator. Get detailed amortization schedule and payment breakdown.',
        type: 'website',
        url: 'https://gpaisa.in/calculator/home-loan',
    },
    alternates: {
        canonical: 'https://gpaisa.in/calculator/home-loan',
    },
};

export default function HomeLoanCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Home Loan Calculator',
        description: 'Calculate your home loan EMI, total interest, and repayment schedule with our free online calculator.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
        },
        featureList: [
            'Calculate monthly EMI',
            'View total interest payable',
            'Year-wise payment breakdown',
            'Amortization schedule',
            'Multiple bank comparisons',
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeLoanCalculatorClient />
        </>
    );
}
