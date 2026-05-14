import { Metadata } from 'next';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';

export const metadata: Metadata = {
    title: 'Home Loan EMI Calculator 2026 — Amortization Schedule, Prepayment & Interest | GPaisa',
    description: 'Calculate your home loan EMI instantly with amortization schedule, interest breakdown, prepayment simulator, payoff timeline, and downloadable report on GPaisa. India\'s most complete home loan calculator.',
    keywords: 'home loan calculator, home loan EMI calculator, housing loan calculator, EMI calculator, home loan interest calculator, mortgage calculator india, home loan amortization schedule, home loan prepayment calculator, HDFC home loan EMI, SBI home loan calculator, home loan tax benefits',
    openGraph: {
        title: 'Home Loan EMI Calculator — Amortization, Prepayment & Report | GPaisa',
        description: 'Calculate your home loan EMI with detailed amortization schedule, prepayment analysis, interest breakdown, and downloadable report.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/home-loan',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/home-loan',
    },
};

export default function HomeLoanCalculatorPage() {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How much EMI do I need to pay for ₹50 lakh home loan?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'For a ₹50 lakh home loan at 8.5% interest for 20 years, your monthly EMI would be approximately ₹43,391. The exact EMI depends on the interest rate and tenure you choose.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is the current HDFC home loan interest rate?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'HDFC Bank home loan interest rates start from around 8.50% to 9.40% p.a. for salaried individuals (as of 2026). The rate depends on your credit score, loan amount, employment type, and property location.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I prepay my HDFC home loan?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, HDFC Bank allows prepayment of home loans. For floating rate loans, there are no prepayment or foreclosure charges. For fixed rate loans, a prepayment penalty of up to 2% may apply.',
                },
            },
            {
                '@type': 'Question',
                name: 'Does increasing tenure reduce EMI?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, increasing the loan tenure reduces your monthly EMI. However, it increases the total interest you pay over the life of the loan.',
                },
            },
            {
                '@type': 'Question',
                name: 'How is EMI different from total interest?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'EMI (Equated Monthly Installment) is the fixed amount you pay every month — it includes both principal repayment and interest. Total interest is the cumulative interest paid over the entire loan tenure.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is HDFC home loan interest fixed or floating?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'HDFC Bank offers both fixed and floating rate home loans. Floating rate loans are linked to an external benchmark (RBI repo rate) and can change periodically.',
                },
            },
        ],
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
            { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
            { '@type': 'ListItem', position: 3, name: 'Home Loan Calculator', item: 'https://www.gpaisa.in/calculator/home-loan' },
        ],
    };

    const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Home Loan EMI Calculator',
        description: 'Calculate your home loan EMI with amortization schedule, prepayment analysis, interest breakdown, and downloadable report. India\'s most complete home loan calculator.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
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
        featureList: [
            'Calculate monthly EMI',
            'View total interest payable',
            'Month-wise amortization schedule',
            'Custom EMI start date',
            'Prepayment simulator (EMI cut / tenure cut)',
            'Download CSV report',
            'Print PDF report',
            'Principal vs interest breakdown chart',
            'Multiple bank comparisons',
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
            />
            <HomeLoanCalculatorClient />
        </>
    );
}
