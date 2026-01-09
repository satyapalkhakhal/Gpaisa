import { Metadata } from 'next';
import EPFCalculatorClient from '@/components/EPFCalculatorClient';

export const metadata: Metadata = {
    title: 'EPF Calculator Online - Calculate Employees Provident Fund Returns | Gpaisa',
    description: 'Free EPF Calculator to calculate Employees Provident Fund maturity amount, pension, and returns. Plan your retirement with our online EPF calculator.',
    keywords: [
        'epf calculator',
        'employees provident fund calculator',
        'epf calculator online',
        'epf maturity calculator',
        'pf calculator',
        'provident fund calculator',
        'epf calculator 2024',
        'epf calculator india',
        'epf pension calculator',
        'eps calculator',
        'vpf calculator',
        'epf interest calculator',
        'epf withdrawal calculator',
        'retirement calculator india',
    ].join(', '),

    openGraph: {
        title: 'EPF Calculator - Calculate Employees Provident Fund Returns | Gpaisa',
        description: 'Plan your retirement with our EPF calculator. Calculate maturity amount, pension, and visualize your EPF growth.',
        type: 'website',
        url: 'https://gpaisa.com/calculator/epf',
        siteName: 'Gpaisa',
    },

    alternates: {
        canonical: 'https://gpaisa.com/calculator/epf',
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function EPFCalculatorPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': 'https://gpaisa.com/calculator/epf#webpage',
                url: 'https://gpaisa.com/calculator/epf',
                name: 'EPF Calculator - Calculate Employees Provident Fund Returns Online',
                description: 'Free online EPF calculator to calculate Employees Provident Fund maturity amount and pension.',
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://gpaisa.com/calculator/epf#breadcrumb',
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
                        name: 'EPF Calculator',
                        item: 'https://gpaisa.com/calculator/epf',
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
            <EPFCalculatorClient />
        </>
    );
}
