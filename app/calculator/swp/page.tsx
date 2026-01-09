import { Metadata } from 'next';
import SWPCalculatorClient from '@/components/SWPCalculatorClient';

// Comprehensive SEO metadata targeting high-volume keywords
export const metadata: Metadata = {
    title: 'SWP Calculator Online - Calculate Systematic Withdrawal Plan Returns | Gpaisa',
    description: 'Free SWP Calculator to calculate Systematic Withdrawal Plan returns, final corpus, and monthly withdrawals. Plan your retirement income with our online SWP calculator.',
    keywords: [
        // Primary keywords (high volume)
        'swp calculator',
        'systematic withdrawal plan calculator',
        'swp calculator online',
        'swp return calculator',
        'swp mutual fund calculator',

        // Secondary keywords
        'swp calculator 2024',
        'swp calculator india',
        'swp calculator with growth',
        'swp maturity calculator',
        'retirement withdrawal calculator',

        // Long-tail keywords
        'swp calculator monthly withdrawal',
        'swp calculator with inflation',
        'systematic withdrawal plan returns',
        'swp vs sip calculator',
        'retirement income calculator',

        // Related terms
        'systematic withdrawal plan',
        'swp benefits',
        'swp tax implications',
        'swp vs lump sum',
        'retirement planning calculator',
        'pension calculator',

        // Feature-based
        'swp calculator with charts',
        'swp calculator year wise',
        'swp calculator excel alternative',
    ].join(', '),

    openGraph: {
        title: 'SWP Calculator - Calculate Systematic Withdrawal Plan Returns | Gpaisa',
        description: 'Plan your retirement withdrawals with our advanced SWP calculator. Calculate monthly income, final corpus, and visualize your wealth depletion.',
        type: 'website',
        url: 'https://gpaisa.com/calculator/swp',
        siteName: 'Gpaisa',
        images: [
            {
                url: '/og-swp-calculator.jpg',
                width: 1200,
                height: 630,
                alt: 'SWP Calculator - Systematic Withdrawal Plan Calculator',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'SWP Calculator - Calculate SWP Returns',
        description: 'Free online SWP calculator to plan your systematic withdrawals and retirement income.',
        images: ['/og-swp-calculator.jpg'],
    },

    alternates: {
        canonical: 'https://gpaisa.com/calculator/swp',
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
};

export default function SWPCalculatorPage() {
    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage Schema
            {
                '@type': 'WebPage',
                '@id': 'https://gpaisa.com/calculator/swp#webpage',
                url: 'https://gpaisa.com/calculator/swp',
                name: 'SWP Calculator - Calculate Systematic Withdrawal Plan Returns Online',
                description: 'Free online SWP calculator to calculate Systematic Withdrawal Plan returns, monthly withdrawals, and final corpus. Plan your retirement income.',
                isPartOf: {
                    '@id': 'https://gpaisa.com/#website',
                },
                breadcrumb: {
                    '@id': 'https://gpaisa.com/calculator/swp#breadcrumb',
                },
                inLanguage: 'en-IN',
            },

            // BreadcrumbList Schema
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://gpaisa.com/calculator/swp#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://gpaisa.com',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Calculator',
                        item: 'https://gpaisa.com/calculator',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'SWP Calculator',
                        item: 'https://gpaisa.com/calculator/swp',
                    },
                ],
            },

            // SoftwareApplication Schema
            {
                '@type': 'SoftwareApplication',
                name: 'SWP Calculator',
                applicationCategory: 'FinanceApplication',
                operatingSystem: 'Web',
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'INR',
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.8',
                    ratingCount: '8450',
                    bestRating: '5',
                    worstRating: '1',
                },
                description: 'Free online SWP calculator to calculate Systematic Withdrawal Plan returns and retirement income.',
            },

            // FAQPage Schema
            {
                '@type': 'FAQPage',
                '@id': 'https://gpaisa.com/calculator/swp#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a SWP Calculator?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'A SWP Calculator is a financial tool that helps you calculate how long your investment will last with regular withdrawals. It shows your final corpus, total withdrawals, and helps plan retirement income.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How does SWP work?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SWP (Systematic Withdrawal Plan) allows you to withdraw a fixed amount regularly from your mutual fund investment while the remaining amount continues to earn returns. It provides regular income while keeping your capital invested.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is SWP better than FD for retirement?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'SWP can be better than FD for retirement as it offers potentially higher returns (10-12% vs 6-7%), tax efficiency (only gains taxed), and flexibility in withdrawal amounts. However, SWP involves market risk unlike FDs.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the tax on SWP withdrawals?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'For equity funds: LTCG above ₹1 lakh taxed at 10%, STCG at 15%. For debt funds: LTCG at 20% with indexation (if held >3 years), STCG at slab rates. Only capital gains portion is taxed, not the entire withdrawal.',
                        },
                    },
                ],
            },

            // HowTo Schema
            {
                '@type': 'HowTo',
                name: 'How to Use SWP Calculator',
                description: 'Step-by-step guide to calculate your SWP returns',
                step: [
                    {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Enter Initial Investment',
                        text: 'Enter the lump sum amount you want to invest initially.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Set Monthly Withdrawal',
                        text: 'Choose how much you want to withdraw every month.',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Select Expected Return',
                        text: 'Enter the expected annual return rate (typically 10-12% for equity funds).',
                    },
                    {
                        '@type': 'HowToStep',
                        position: 4,
                        name: 'View Results',
                        text: 'The calculator will show your final corpus, total withdrawals, and year-by-year breakdown.',
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
            <SWPCalculatorClient />
        </>
    );
}
