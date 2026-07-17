import { Metadata } from 'next';
import CAGRCalculatorClient from '@/components/CAGRCalculatorClient';

export const metadata: Metadata = {
    title: 'CAGR Calculator - Compound Annual Growth Rate Calculator Online | Gpaisa',
    description: 'Free CAGR calculator to calculate Compound Annual Growth Rate for investments. Measure mean annual growth rate of stocks, mutual funds, and portfolios. Get instant CAGR calculation with detailed analysis.',
    authors: [{ name: 'Satyapal Khakhal' }],
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
        '@graph': [
            {
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
            },
            {
                '@type': 'HowTo',
                name: 'How to Use CAGR Calculator',
                description: 'Step-by-step guide to calculate Compound Annual Growth Rate',
                step: [
                    { '@type': 'HowToStep', position: 1, name: 'Enter Initial Investment', text: 'Enter the starting value of your investment.' },
                    { '@type': 'HowToStep', position: 2, name: 'Enter Final Value', text: 'Enter the current or ending value of the investment.' },
                    { '@type': 'HowToStep', position: 3, name: 'Set Duration', text: 'Enter the number of years between the initial and final value.' },
                    { '@type': 'HowToStep', position: 4, name: 'View CAGR', text: 'The calculator instantly shows your Compound Annual Growth Rate as a percentage.' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/cagr#faq',
                mainEntity: [
                    { '@type': 'Question', name: 'What is a good CAGR?', acceptedAnswer: { '@type': 'Answer', text: 'A good CAGR depends on the asset class. For equity, 12-15% is considered good. For debt, 7-9% is acceptable. Always compare CAGR against the relevant benchmark.' } },
                    { '@type': 'Question', name: 'Is CAGR same as returns?', acceptedAnswer: { '@type': 'Answer', text: 'No. CAGR is the average compounded growth rate. Actual yearly returns may vary wildly. CAGR smooths them into a single number for easy comparison.' } },
                    { '@type': 'Question', name: 'Can CAGR be negative?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, if your investment value decreased over time. A negative CAGR means your investment lost value on average each year.' } },
                    { '@type': 'Question', name: 'What is the Rule of 72?', acceptedAnswer: { '@type': 'Answer', text: 'Divide 72 by the CAGR to estimate how many years it takes to double your money. Example: At 12% CAGR, money doubles in ~6 years.' } },
                    { '@type': 'Question', name: "CAGR vs XIRR — what's the difference?", acceptedAnswer: { '@type': 'Answer', text: 'CAGR assumes a lump sum investment. XIRR handles multiple cash flows (like SIPs) at irregular intervals. Use XIRR for SIP returns.' } },
                    { '@type': 'Question', name: 'Does CAGR account for inflation?', acceptedAnswer: { '@type': 'Answer', text: 'No. CAGR shows nominal returns. To get real returns, subtract the inflation rate from CAGR. Example: 12% CAGR - 6% inflation = 6% real return.' } },
                    { '@type': 'Question', name: 'How to calculate CAGR for mutual funds?', acceptedAnswer: { '@type': 'Answer', text: 'Use NAV at start date as Initial Value and NAV at end date as Final Value. Apply the CAGR formula: (End/Start)^(1/years) - 1.' } },
                    { '@type': 'Question', name: 'Is higher CAGR always better?', acceptedAnswer: { '@type': 'Answer', text: 'Not necessarily. Higher CAGR often comes with higher risk. A 15% CAGR in small-caps has much higher risk than 8% CAGR in FDs. Consider risk-adjusted returns.' } },
                ],
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <CAGRCalculatorClient />
        </>
    );
}
