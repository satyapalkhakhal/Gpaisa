import { Metadata } from 'next';
import EPFCalculatorClient from '@/components/EPFCalculatorClient';
import EPFContent from '@/components/epf/EPFContent';
import type { EPFYearRow } from '@/components/EPFCalculatorClient';

// ─── Server-side pre-computation of EPF defaults ───
// Default: ₹50K basic, age 30→58, 5% increment, 8.25% interest, ₹0 current balance
function computeEPFDefaults() {
    const basicSalary = 50000;
    const currentAge = 30;
    const retirementAge = 58;
    const salaryIncrement = 5; // %
    const epfRate = 8.25; // % p.a.
    const employeeContribPct = 12;
    const employerEPFPct = 3.67; // employer share that goes to EPF (not EPS)
    const currentEPFBalance = 0;

    const yearsToRetirement = retirementAge - currentAge; // 28
    let balance = currentEPFBalance;
    let salary = basicSalary;
    let totalContrib = 0;
    const yearlyData: EPFYearRow[] = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
        const openingBalance = balance;
        const employeeMonthly = (salary * employeeContribPct) / 100;
        const employerMonthly = (salary * employerEPFPct) / 100;
        const annualEmpContrib = employeeMonthly * 12;
        const annualErContrib = employerMonthly * 12;
        const annualContrib = annualEmpContrib + annualErContrib;
        totalContrib += annualContrib;
        balance += annualContrib;
        const interest = (balance * epfRate) / 100;
        balance += interest;

        yearlyData.push({
            year,
            age: currentAge + year,
            basicSalary: Math.round(salary),
            employeeContrib: Math.round(annualEmpContrib),
            employerContrib: Math.round(annualErContrib),
            interest: Math.round(interest),
            closingBalance: Math.round(balance),
        });

        salary = salary * (1 + salaryIncrement / 100);
    }

    const pensionableSalary = Math.min(basicSalary, 15000);
    const pension = Math.round((pensionableSalary * yearsToRetirement) / 70);

    return {
        maturity: Math.round(balance),
        totalContrib: Math.round(totalContrib + currentEPFBalance),
        totalInterest: Math.round(balance - totalContrib - currentEPFBalance),
        pension,
        yearlyData,
    };
}

export const metadata: Metadata = {
    title: 'EPF Calculator India 2026 — EPF Maturity, EPS Pension & Year-wise Growth | gpaisa.in',
    description: 'Free EPF Calculator India 2026 — Calculate your EPF maturity amount, EPS pension, interest earned and year-wise growth. Updated for 8.25% interest rate.',

    authors: [{ name: 'Satyapal Khakhal' }],

    openGraph: {
        title: 'EPF Calculator India 2026 — EPF Maturity, EPS Pension & Year-wise Growth | gpaisa.in',
        description: 'Free EPF Calculator India 2026 — Calculate your EPF maturity amount, EPS pension, interest earned and year-wise growth. Updated for 8.25% interest rate.',
        type: 'website',
        url: 'https://www.gpaisa.in/calculator/epf',
        siteName: 'Gpaisa',
        images: [
            {
                url: 'https://www.gpaisa.in/og-epf-calculator.jpg',
                width: 1200,
                height: 630,
                alt: 'EPF Calculator India 2026',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'EPF Calculator India (2026) — EPF Maturity & Pension Calculator | gpaisa.in',
        description: 'Calculate EPF maturity amount, EPS pension and year-wise growth. Updated for 8.25% p.a. interest rate.',
        creator: '@gpaisa_in',
        images: ['https://www.gpaisa.in/og-epf-calculator.jpg'],
    },

    alternates: {
        canonical: 'https://www.gpaisa.in/calculator/epf',
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

export default function EPFCalculatorPage() {
    const defaults = computeEPFDefaults();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': 'https://www.gpaisa.in/calculator/epf#webpage',
                url: 'https://www.gpaisa.in/calculator/epf',
                name: 'EPF Calculator India 2026 — EPF Maturity, EPS Pension & Year-wise Growth',
                description: 'Free EPF Calculator India 2026. Updated for 8.25% interest rate.',
                author: {
                    '@type': 'Person',
                    name: 'Satyapal Khakhal',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://www.gpaisa.in/calculator/epf#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gpaisa.in' },
                    { '@type': 'ListItem', position: 2, name: 'Calculator', item: 'https://www.gpaisa.in/calculator' },
                    { '@type': 'ListItem', position: 3, name: 'EPF Calculator', item: 'https://www.gpaisa.in/calculator/epf' },
                ],
            },
            {
                '@type': 'HowTo',
                name: 'How to Use EPF Calculator',
                description: 'Step-by-step guide to calculate your EPF maturity amount',
                step: [
                    { '@type': 'HowToStep', position: 1, name: 'Enter Basic Salary', text: 'Enter your current monthly Basic Salary.' },
                    { '@type': 'HowToStep', position: 2, name: 'Set Current & Retirement Age', text: 'Enter your current age and expected retirement age.' },
                    { '@type': 'HowToStep', position: 3, name: 'Set Annual Salary Increment', text: 'Enter your expected annual salary increment percentage.' },
                    { '@type': 'HowToStep', position: 4, name: 'View EPF Maturity', text: 'The calculator shows your EPF maturity amount, EPS pension, and year-wise growth.' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://www.gpaisa.in/calculator/epf#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is the EPF interest rate for 2025–26?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'EPFO declared 8.25% p.a. for FY 2024–25. The rate is announced annually by the EPFO Central Board of Trustees and approved by the Finance Ministry.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How do I check my EPF balance?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Check EPF balance via: EPFO member portal (epfindia.gov.in), UMANG app, SMS "EPFOHO UAN ENG" to 7738299899, or missed call to 011-22901406 from your registered mobile.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I withdraw EPF before retirement?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Partial withdrawal is allowed for medical emergency, home purchase, or marriage. Full withdrawal is allowed after retirement or 2 months of unemployment. Withdrawal before 5 years of continuous service attracts TDS.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What happens to EPF when I change jobs?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Always transfer — never withdraw — EPF when changing jobs. Use the UAN portal for online transfer to preserve 5-year continuity for tax-free treatment and your EPS pension service record.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What is the EPF wage ceiling?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The EPF wage ceiling is ₹15,000/month basic salary. Employer EPS contribution is always capped at 8.33% of ₹15,000 = ₹1,250/month regardless of actual salary.',
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

            {/* Main Calculator — pre-initialised with server-computed defaults */}
            <EPFCalculatorClient
                initialMaturity={defaults.maturity}
                initialTotalContrib={defaults.totalContrib}
                initialTotalInterest={defaults.totalInterest}
                initialPension={defaults.pension}
            />

            {/* Static educational content — server-rendered, visible without JS */}
            <div className="max-w-6xl mx-auto px-4 pb-10">
                <EPFContent first5Years={defaults.yearlyData.slice(0, 5)} />
            </div>
        </>
    );
}
