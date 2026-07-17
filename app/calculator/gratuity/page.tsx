import { Metadata } from 'next';
import GratuityCalculatorClient from '@/components/GratuityCalculatorClient';

export const metadata: Metadata = {
    title: 'Gratuity Calculator - Calculate Gratuity Amount Online | Gpaisa',
    description: 'Free gratuity calculator to calculate gratuity amount as per Payment of Gratuity Act, 1972. Find out your gratuity on retirement or resignation. Tax-free up to ₹20 lakhs.',
    authors: [{ name: 'Satyapal Khakhal' }],
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
        '@graph': [
            {
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
            },
            {
                '@type': 'HowTo',
                name: 'How to Use Gratuity Calculator',
                description: 'Step-by-step guide to calculate your gratuity amount',
                step: [
                    { '@type': 'HowToStep', position: 1, name: 'Enter Last Drawn Salary', text: 'Enter your last drawn Basic Salary + Dearness Allowance (DA).' },
                    { '@type': 'HowToStep', position: 2, name: 'Enter Years of Service', text: 'Enter the total number of years you have worked continuously at the organisation.' },
                    { '@type': 'HowToStep', position: 3, name: 'Adjust for Extra Months', text: 'Add any extra months served beyond full years — rounded up if over 6 months.' },
                    { '@type': 'HowToStep', position: 4, name: 'View Gratuity Amount', text: 'The calculator instantly shows your gratuity amount as per the Payment of Gratuity Act, 1972.' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/gratuity#faq',
                mainEntity: [
                    { '@type': 'Question', name: 'What is the gratuity formula?', acceptedAnswer: { '@type': 'Answer', text: 'Gratuity = (Last Salary × 15 × Years of Service) / 26 for employees covered under the Payment of Gratuity Act. For non-covered employees, the divisor is 30.' } },
                    { '@type': 'Question', name: 'Is gratuity taxable in India?', acceptedAnswer: { '@type': 'Answer', text: "Gratuity up to ₹20 lakh is completely tax-free. Any amount exceeding ₹20 lakh is taxable as per the individual's income tax slab." } },
                    { '@type': 'Question', name: 'Can I get gratuity before 5 years?', acceptedAnswer: { '@type': 'Answer', text: 'No, minimum 5 years of continuous service is required. Exception: Death or disability of the employee — the 5-year rule does not apply.' } },
                    { '@type': 'Question', name: 'What salary is used for gratuity?', acceptedAnswer: { '@type': 'Answer', text: 'Only Basic Salary + Dearness Allowance (DA) is considered. Other components like HRA, bonus, overtime, etc., are excluded.' } },
                    { '@type': 'Question', name: 'Is gratuity applicable on resignation?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, gratuity is payable on resignation provided you have completed 5 years of continuous service.' } },
                    { '@type': 'Question', name: 'What is the ₹20 lakh gratuity cap?', acceptedAnswer: { '@type': 'Answer', text: 'Under the Payment of Gratuity Act, the maximum gratuity payable is capped at ₹20 lakh. Employers can pay more voluntarily.' } },
                    { '@type': 'Question', name: 'How is service period rounded?', acceptedAnswer: { '@type': 'Answer', text: "If you have worked more than 6 months in the last year, it's rounded up to the next full year. If ≤6 months, the fraction is ignored." } },
                    { '@type': 'Question', name: 'Can employer deny gratuity?', acceptedAnswer: { '@type': 'Answer', text: 'Gratuity can be partially or fully forfeited only if the employee is terminated for criminal offence or moral turpitude. Otherwise, it is a legal right.' } },
                ],
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <GratuityCalculatorClient />
        </>
    );
}
