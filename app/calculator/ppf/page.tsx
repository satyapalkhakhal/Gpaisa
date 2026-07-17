import { Metadata } from 'next';
import PPFCalculatorClient from '@/components/PPFCalculatorClient';

// Comprehensive SEO metadata targeting high-volume keywords
export const metadata: Metadata = {
    title: 'PPF Calculator Online - Calculate Public Provident Fund Returns & Maturity | Gpaisa',
    description: 'Free PPF Calculator to calculate Public Provident Fund returns, maturity amount, and interest. Plan your PPF investment with our online PPF calculator. Get accurate projections for your wealth creation journey.',

    authors: [{ name: 'Satyapal Khakhal' }],

    openGraph: {
        title: 'PPF Calculator - Calculate Public Provident Fund Returns | Gpaisa',
        description: 'Plan your PPF investments with our advanced calculator. Calculate maturity amount, interest, and visualize your wealth growth over 15 years.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/ppf',
        siteName: 'Gpaisa',
        images: [
            {
                url: '/og-ppf-calculator.jpg',
                width: 1200,
                height: 630,
                alt: 'PPF Calculator - Public Provident Fund Calculator',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'PPF Calculator - Calculate PPF Returns',
        description: 'Free online PPF calculator to plan your Public Provident Fund investments and achieve your financial goals.',
        images: ['/og-ppf-calculator.jpg'],
    },

    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/ppf',
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    other: {
        'google-site-verification': 'cRKwonTlcFkZBwtGfSsusoyyXUmpgvCSoE7ar6zbUnc',
    },
};

export default function PPFCalculatorPage() {
    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage Schema
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/ppf#webpage',
                url: 'https://www.gpaisa.in/calculator/ppf',
                name: 'PPF Calculator - Calculate Public Provident Fund Returns Online',
                description: 'Free online PPF calculator to calculate Public Provident Fund returns, maturity amount, and interest. Plan your PPF investments with accurate projections.',
                isPartOf: {
                    '@id': 'https://www.gpaisa.in/#website',
                },
                breadcrumb: {
                    '@id': 'https://www.gpaisa.in/calculator/ppf#breadcrumb',
                },
                inLanguage: 'en-IN',
                potentialAction: {
                    '@type': 'UseAction',
                    target: 'https://www.gpaisa.in/calculator/ppf',
                },
            },

            // BreadcrumbList Schema
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.gpaisa.in/calculator/ppf#breadcrumb',
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
                        name: 'PPF Calculator',
                        item: 'https://www.gpaisa.in/calculator/ppf',
                    },
                ],
            },

            // SoftwareApplication Schema
            {
                '@type': 'SoftwareApplication',
                name: 'PPF Calculator',
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
                description: 'Free online PPF calculator to calculate Public Provident Fund returns and maturity amount.',
            },

            // FAQPage Schema
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/ppf#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a PPF Calculator?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'A PPF Calculator is a financial tool that helps you calculate the maturity amount and returns on your Public Provident Fund (PPF) investment. It shows you how much wealth you can accumulate over 15 years by investing regularly in PPF.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the current PPF interest rate?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The current PPF interest rate is 7.1% per annum (as of 2024), compounded annually. The interest rate is set by the Government of India and is reviewed quarterly.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the minimum and maximum investment in PPF?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The minimum investment in PPF is ₹500 per year, and the maximum is ₹1.5 lakh per year. You can make deposits in lump sum or in installments (maximum 12 per year).',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is PPF tax-free?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes, PPF offers EEE (Exempt-Exempt-Exempt) tax benefits. The investment qualifies for deduction under Section 80C (up to ₹1.5 lakh), the interest earned is tax-free, and the maturity amount is also tax-free.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I withdraw from PPF before maturity?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Partial withdrawals are allowed from the 7th year onwards. You can withdraw up to 50% of the balance at the end of the 4th year. Premature closure is allowed after 5 years in specific cases like medical emergencies or higher education.',
                        },
                    },
                ],
            },

            // HowTo Schema
            {
                '@type': 'HowTo',
                name: 'How to Use PPF Calculator',
                description: 'Step-by-step guide to calculate your PPF returns',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Enter Yearly Investment',
                        text: 'Enter the amount you want to invest in PPF every year (minimum ₹500, maximum ₹1.5 lakh).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Select Investment Period',
                        text: 'Choose the investment period (minimum 15 years, can be extended in blocks of 5 years).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Check Interest Rate',
                        text: 'The calculator uses the current PPF interest rate (7.1% as of 2024).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'View Results',
                        text: 'The calculator will show your total investment, interest earned, and maturity amount with a year-by-year breakdown.',
                    },
                ],
            },
        ],
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Main Content */}
            <PPFCalculatorClient />
        </>
    );
}
