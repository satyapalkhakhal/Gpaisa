import { Metadata } from 'next';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';
import HomeLoanAmortizationSSR from '@/components/home-loan/HomeLoanAmortizationSSR';
import HomeLoanChartSSR from '@/components/home-loan/HomeLoanChartSSR';
import HomeLoanSEOContent from '@/components/home-loan/HomeLoanSEOContent';
import HomeLoanEducational from '@/components/home-loan/HomeLoanEducational';
import { computeDefaults } from '@/lib/homeLoanCalculations';

export const metadata: Metadata = {
    title: 'Home Loan EMI Calculator 2026 — Amortization Schedule, Prepayment & Interest | GPaisa',
    description: 'Calculate your home loan EMI instantly with amortization schedule, interest breakdown, prepayment simulator, payoff timeline, and downloadable report on GPaisa. India\'s most complete home loan calculator.',
    authors: [{ name: 'Satyapal Khakhal' }],
    openGraph: {
        title: 'Home Loan EMI Calculator — Amortization, Prepayment & Report | GPaisa',
        description: 'Calculate your home loan EMI with detailed amortization schedule, prepayment analysis, interest breakdown, and downloadable report.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/home-loan',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Home Loan EMI Calculator 2026 — Amortization & Prepayment | gpaisa.in',
        description: 'Calculate your home loan EMI with amortization schedule, prepayment analysis, interest breakdown, and downloadable report. Compare rates across SBI, HDFC, ICICI & more.',
        creator: '@gpaisa_in',
    },
    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/home-loan',
    },
};

export default function HomeLoanCalculatorPage() {
    // Pre-compute default amortization data server-side
    const defaults = computeDefaults();

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
                name: 'What are the current home loan interest rates in India?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Home loan interest rates in India currently range from 7.20% to 9.80% across major banks (May 2026). SBI offers rates from 7.50%, HDFC Bank from 7.20%, ICICI Bank from 7.65%, and Bank of Baroda from 7.20%. Your actual rate depends on your CIBIL score, loan amount, employment type, and property location.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I prepay my home loan without penalty?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. As per RBI guidelines, banks cannot charge any prepayment or foreclosure penalty on floating rate home loans. This applies to all banks in India — SBI, HDFC, ICICI, Axis, and others. For fixed rate loans, a prepayment penalty of up to 2% may apply depending on the lender.',
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
                name: 'Is a home loan interest rate fixed or floating?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most home loans in India are floating rate loans, linked to an external benchmark like the RBI repo rate. This means your EMI can change when the repo rate changes. Some banks also offer fixed rate loans at a slightly higher rate. Floating rate loans are generally recommended as they allow penalty-free prepayment and tend to be lower in the long run.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is the home loan EMI for ₹30 lakh?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'At 8.5% interest rate for 20 years, the monthly EMI for a ₹30 lakh home loan is approximately ₹26,030. The total interest payable over the tenure would be around ₹32.47 lakh, making the total repayment ₹62.47 lakh. You can reduce this by choosing a shorter tenure or making prepayments.',
                },
            },
            {
                '@type': 'Question',
                name: 'What CIBIL score is needed for a home loan?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Most banks require a minimum CIBIL score of 650–700 to approve a home loan. However, a score of 750 or above qualifies you for the lowest interest rates — typically 0.25% to 0.50% lower than standard rates. For example, SBI offers preferential rates starting at 8.50% for applicants with a CIBIL score above 750.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I get a home loan on ₹25,000 monthly salary?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Banks typically allow an EMI-to-income ratio of 40–50%. On a ₹25,000 salary, your maximum EMI would be ₹10,000–₹12,500. At 8.5% interest for 20 years (EMI per lakh = ₹868), this qualifies you for a home loan of approximately ₹11.5–₹14.4 lakh. A co-applicant\'s income can increase your eligibility significantly.',
                },
            },
        ],
    };

    const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Use Home Loan EMI Calculator',
        description: 'Step-by-step guide to calculate your home loan EMI',
        step: [
            { '@type': 'HowToStep', position: 1, name: 'Enter Loan Amount', text: 'Enter the total home loan amount you wish to borrow.' },
            { '@type': 'HowToStep', position: 2, name: 'Enter Interest Rate', text: 'Enter the annual interest rate offered by your bank.' },
            { '@type': 'HowToStep', position: 3, name: 'Set Loan Tenure', text: 'Choose the loan repayment tenure in years, typically up to 30 years.' },
            { '@type': 'HowToStep', position: 4, name: 'View EMI & Amortization', text: 'The calculator shows your monthly EMI, total interest, and a month-wise amortization schedule with prepayment options.' },
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
        author: {
            '@type': 'Person',
            name: 'Satyapal Khakhal',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
            />

            {/*
              Interactive calculator widget — client component.
              Static content (SEO tables, FAQ, educational) is rendered BELOW as server components.
            */}
            <HomeLoanCalculatorClient
                ssrChartFallback={
                    <HomeLoanChartSSR
                        loanAmount={defaults.loanAmount}
                        totalInterest={defaults.totalInterest}
                        principalPercent={defaults.principalPercent}
                        interestPercent={defaults.interestPercent}
                    />
                }
                ssrAmortizationFallback={
                    <HomeLoanAmortizationSSR
                        schedule={defaults.first12Months}
                        loanTenure={defaults.loanTenure}
                        totalMonths={defaults.loanTenure * 12}
                    />
                }
            />

            {/* Static content — server-rendered, visible in View Source / with JS disabled */}
            <div className="max-w-6xl mx-auto px-4 pb-10 space-y-6">
                <HomeLoanSEOContent />
                <HomeLoanEducational />
            </div>
        </>
    );
}

