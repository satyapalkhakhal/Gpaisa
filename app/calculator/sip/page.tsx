import { Metadata } from 'next';
import SIPCalculatorClient from '@/components/SIPCalculatorClient';
import SIPEducationalContent from '@/components/sip/SIPEducationalContent';

// Comprehensive SEO metadata targeting high-volume keywords
export const metadata: Metadata = {
    title: 'SIP Calculator Online - Calculate SIP Returns & Investment Growth | Gpaisa',
    description: 'Free SIP Calculator to calculate mutual fund SIP returns. Plan your systematic investment with our step-up SIP calculator, lump sum calculator, and SIP return calculator. Get accurate projections for your wealth creation journey.',

    authors: [{ name: 'Satyapal Khakhal' }],

    openGraph: {
        title: 'SIP Calculator - Calculate Your Mutual Fund Returns | Gpaisa',
        description: 'Plan your investments with our advanced SIP Calculator. Calculate returns, set financial goals, and visualize your wealth growth with step-up SIP options.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/sip',
        siteName: 'Gpaisa',
        images: [
            {
                url: '/og-sip-calculator.jpg',
                width: 1200,
                height: 630,
                alt: 'SIP Calculator - Systematic Investment Plan Calculator',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'SIP Calculator - Calculate Mutual Fund Returns',
        description: 'Free online SIP calculator to plan your systematic investments and achieve your financial goals.',
        images: ['/og-sip-calculator.jpg'],
    },

    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/sip',
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

export default function SIPCalculatorPage() {
    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage Schema
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/sip#webpage',
                url: 'https://www.gpaisa.in/calculator/sip',
                name: 'SIP Calculator - Calculate Mutual Fund SIP Returns Online',
                description: 'Free online SIP calculator to calculate systematic investment plan returns. Plan your mutual fund investments with step-up SIP, lump sum, and goal-based calculators.',
                isPartOf: {
                    '@id': 'https://www.gpaisa.in/#website',
                },
                breadcrumb: {
                    '@id': 'https://www.gpaisa.in/calculator/sip#breadcrumb',
                },
                inLanguage: 'en-IN',
                potentialAction: {
                    '@type': 'UseAction',
                    target: 'https://www.gpaisa.in/calculator/sip',
                },
            },

            // BreadcrumbList Schema
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.gpaisa.in/calculator/sip#breadcrumb',
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
                        name: 'SIP Calculator',
                        item: 'https://www.gpaisa.in/calculator/sip',
                    },
                ],
            },

            // SoftwareApplication Schema
            {
                '@type': 'SoftwareApplication',
                name: 'SIP Calculator',
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
                description: 'Free online SIP calculator to calculate systematic investment plan returns for mutual funds.',
            },

            // FAQPage Schema
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/sip#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a SIP Calculator?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'A SIP Calculator is a financial tool that helps you calculate the returns on your Systematic Investment Plan (SIP) investments in mutual funds. It shows you how much wealth you can accumulate over time by investing a fixed amount regularly.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How does SIP Calculator work?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The SIP calculator uses the compound interest formula to calculate returns. You input your monthly investment amount, expected rate of return, and investment duration. The calculator then shows your total investment, estimated returns, and final corpus.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the expected return rate for SIP?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The expected return rate for SIP varies based on the type of mutual fund. Equity funds typically offer 12-15% returns, balanced funds offer 10-12%, and debt funds offer 7-9% returns over the long term. However, past performance does not guarantee future returns.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is Step-Up SIP?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Step-Up SIP allows you to increase your SIP amount periodically (annually or semi-annually). This helps you align your investments with your growing income and accelerate wealth creation.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is SIP better than lump sum investment?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SIP is ideal for regular investors who want to invest small amounts periodically and benefit from rupee cost averaging. Lump sum is suitable when you have a large amount to invest and market conditions are favorable. Both have their advantages depending on your financial situation.',
                        },
                    },
                ],
            },

            // HowTo Schema
            {
                '@type': 'HowTo',
                name: 'How to Use SIP Calculator',
                description: 'Step-by-step guide to calculate your SIP returns',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Enter Monthly Investment',
                        text: 'Enter the amount you want to invest every month in your SIP.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Set Expected Return Rate',
                        text: 'Choose the expected annual return rate based on your mutual fund type (typically 10-15% for equity funds).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Choose Investment Duration',
                        text: 'Select the time period for which you want to continue your SIP (in years).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'View Results',
                        text: 'The calculator will show your total investment, estimated returns, and final maturity amount with a visual chart.',
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

            {/* Main Calculator — client component (sliders + chart) */}
            <SIPCalculatorClient />

            {/* Static educational content — server-rendered, visible without JS */}
            <div className="max-w-6xl mx-auto px-4 pb-10">
                <SIPEducationalContent />
            </div>
        </>
    );
}
