import { Metadata } from 'next';
import EMICalculatorClient from '@/components/EMICalculatorClient';

export const metadata: Metadata = {
    title: 'EMI Calculator - Calculate Loan EMI, Home Loan, Car Loan, Personal Loan | Gpaisa',
    description: 'Free EMI Calculator to calculate monthly loan payments for home loan, car loan, personal loan, and education loan. Get instant EMI calculation with amortization schedule and total interest payable.',
    authors: [{ name: 'Satyapal Khakhal' }],
    openGraph: {
        title: 'EMI Calculator - Calculate Loan EMI Online',
        description: 'Calculate your loan EMI instantly with our free EMI calculator. Get detailed amortization schedule for home loan, car loan, and personal loan.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/emi',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/emi',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function EMICalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/emi#webpage',
                url: 'https://www.gpaisa.in/calculator/emi',
                name: 'EMI Calculator - Calculate Loan EMI Online',
                description: 'Free EMI Calculator to calculate monthly loan payments for home loan, car loan, personal loan. Get instant EMI calculation with amortization schedule.',
                isPartOf: {
                    '@id': 'https://www.gpaisa.in/#website',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.gpaisa.in/calculator/emi#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://www.gpaisa.in',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Calculator',
                        item: 'https://www.gpaisa.in/calculator',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'EMI Calculator',
                        item: 'https://www.gpaisa.in/calculator/emi',
                    },
                ],
            },
            {
                '@type': 'SoftwareApplication',
                name: 'EMI Calculator',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Web',
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
                description: 'Calculate EMI for home loan, car loan, personal loan with amortization schedule',
            },
            {
                '@type': 'HowTo',
                name: 'How to Use EMI Calculator',
                description: 'Step-by-step guide to calculate your loan EMI',
                step: [
                    { '@type': 'HowToStep', position: 1, name: 'Enter Loan Amount', text: 'Enter the total loan amount you wish to borrow.' },
                    { '@type': 'HowToStep', position: 2, name: 'Enter Interest Rate', text: 'Enter the annual interest rate offered by your lender.' },
                    { '@type': 'HowToStep', position: 3, name: 'Set Loan Tenure', text: 'Choose the loan repayment tenure in years or months.' },
                    { '@type': 'HowToStep', position: 4, name: 'View EMI & Amortization', text: 'The calculator shows your monthly EMI, total interest payable, and a full amortization schedule.' },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is EMI?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How is EMI calculated?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'EMI is calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is the loan amount, R is the monthly interest rate, and N is the loan tenure in months.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What factors affect EMI?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Three main factors affect EMI: 1) Loan Amount (Principal), 2) Interest Rate, and 3) Loan Tenure. Higher loan amount or interest rate increases EMI, while longer tenure reduces monthly EMI but increases total interest.',
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EMICalculatorClient />
        </>
    );
}
