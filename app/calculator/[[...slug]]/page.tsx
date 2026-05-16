import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SIPCalculatorClient from '@/components/SIPCalculatorClient';
import SipAmcContent from '@/components/sip/SipAmcContent';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';
import BankSpecificContent from '@/components/home-loan/BankSpecificContent';
import HomeLoanAmortizationSSR from '@/components/home-loan/HomeLoanAmortizationSSR';
import HomeLoanChartSSR from '@/components/home-loan/HomeLoanChartSSR';
import { getBankBySlug, getAllBankSlugs } from '@/lib/bankData';
import { getSipAmcDataBySlug } from '@/lib/sipAmcData';
import { getHomeLoanBankBySlug, getAllHomeLoanBankSlugs } from '@/lib/homeLoanBankData';
import { getBankHomeLoanDataBySlug } from '@/lib/bankHomeLoanData';
import {
    calculateEMI,
    generateSchedule,
    DEFAULT_START_MONTH,
    DEFAULT_START_YEAR,
    DEFAULT_LOAN_AMOUNT,
    DEFAULT_LOAN_TENURE,
} from '@/lib/homeLoanCalculations';

type Props = {
    params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
    const sipSlugs = getAllBankSlugs();
    const homeLoanSlugs = getAllHomeLoanBankSlugs();

    return [
        ...sipSlugs.map((slug) => ({ slug: [`${slug}-sip-calculator`] })),
        ...homeLoanSlugs.map((slug) => ({ slug: [`${slug}-home-loan-calculator`] })),
    ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Handle SIP calculator URLs — use enriched AMC data for meta tags
    if (slug && slug.length === 1 && slug[0].endsWith('-sip-calculator')) {
        const amcData = getSipAmcDataBySlug(slug[0]);
        const bank = getBankBySlug(slug[0].replace('-sip-calculator', ''));

        if (amcData) {
            return {
                title: amcData.metaTitle,
                description: amcData.metaDescription,
                keywords: `${amcData.shortName.toLowerCase()} sip calculator, ${amcData.amcName.toLowerCase()} sip, ${amcData.shortName.toLowerCase()} mutual fund calculator, sip calculator india`,
                authors: [{ name: 'Satyapal Khakhal' }],
                openGraph: {
                    title: amcData.metaTitle,
                    description: amcData.metaDescription,
                    type: 'website',
                    url: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: `${amcData.shortName} SIP Calculator 2026 — Top Funds, Returns & Investment Guide | gpaisa.in`,
                    description: amcData.metaDescription,
                    creator: '@gpaisa_in',
                },
                alternates: {
                    canonical: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
            };
        }

        // Fallback for banks not in sipAmcData
        if (bank) {
            return {
                title: `${bank.name} SIP Calculator 2026 — Top Funds, Returns & Investment Guide | gpaisa.in`,
                description: bank.description,
                keywords: `${bank.name.toLowerCase()} sip calculator, ${bank.name.toLowerCase()} mutual fund calculator, sip calculator online`,
                authors: [{ name: 'Satyapal Khakhal' }],
                openGraph: {
                    title: `${bank.name} SIP Calculator`,
                    description: bank.description,
                    type: 'website',
                    url: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: `${bank.name} SIP Calculator 2026 — Top Funds, Returns & Investment Guide | gpaisa.in`,
                    description: bank.description,
                    creator: '@gpaisa_in',
                },
                alternates: {
                    canonical: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
            };
        }
    }

    // Handle Home Loan calculator URLs — use enriched bank data for meta tags
    if (slug && slug.length === 1 && slug[0].endsWith('-home-loan-calculator')) {
        const bankSlug = slug[0].replace('-home-loan-calculator', '');
        const bank = getHomeLoanBankBySlug(bankSlug);
        const bankData = getBankHomeLoanDataBySlug(slug[0]);

        if (bank) {
            const metaTitle = bankData?.metaTitle || `${bank.name} Home Loan Calculator - Calculate ${bank.name} Home Loan EMI | Gpaisa`;
            const metaDescription = bankData?.metaDescription || bank.description;

            return {
                title: metaTitle,
                description: metaDescription,
                keywords: `${bank.name.toLowerCase()} home loan calculator, ${bank.name.toLowerCase()} home loan emi, home loan calculator online`,
                authors: [{ name: 'Satyapal Khakhal' }],
                openGraph: {
                    title: metaTitle,
                    description: metaDescription,
                    type: 'website',
                    url: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: metaTitle,
                    description: metaDescription,
                },
                alternates: {
                    canonical: `https://www.gpaisa.in/calculator/${slug[0]}`,
                },
            };
        }
    }

    return {};
}

export default async function CalculatorCatchAll({ params }: Props) {
    const { slug } = await params;

    // Handle SIP calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-sip-calculator')) {
        const bankSlug = slug[0].replace('-sip-calculator', '');
        const bank = getBankBySlug(bankSlug);
        const amcData = getSipAmcDataBySlug(slug[0]);

        if (bank) {
            const jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: amcData ? `${amcData.amcName} SIP Calculator` : `${bank.name} SIP Calculator`,
                description: amcData?.metaDescription ?? bank.description,
                author: {
                    '@type': 'Person',
                    name: 'Satyapal Khakhal',
                },
            };

            return (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                    <SIPCalculatorClient
                        bankName={amcData?.amcName ?? bank.name}
                        ssrAmcContent={amcData ? <SipAmcContent data={amcData} /> : undefined}
                    />
                </>
            );
        }
    }

    // Handle Home Loan calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-home-loan-calculator')) {
        const bankSlug = slug[0].replace('-home-loan-calculator', '');
        const bank = getHomeLoanBankBySlug(bankSlug);
        const bankData = getBankHomeLoanDataBySlug(slug[0]);

        if (bank) {
            // Pre-compute SSR defaults using the bank's actual default rate
            const bankRate = bankData?.defaultRate ?? bank.interestRate ?? 8.5;
            const monthlyRate = bankRate / 12 / 100;
            const tenureMonths = DEFAULT_LOAN_TENURE * 12;
            const emi = calculateEMI(DEFAULT_LOAN_AMOUNT, monthlyRate, tenureMonths);
            const scheduleResult = generateSchedule(
                DEFAULT_LOAN_AMOUNT,
                monthlyRate,
                emi,
                tenureMonths,
                DEFAULT_START_MONTH,
                DEFAULT_START_YEAR,
                null,
            );
            const totalInterest = scheduleResult.totalInterest;
            const totalAmount = DEFAULT_LOAN_AMOUNT + totalInterest;
            const principalPercent = Math.round((DEFAULT_LOAN_AMOUNT / totalAmount) * 100);
            const interestPercent = 100 - principalPercent;
            const first12Months = scheduleResult.schedule.slice(0, 12);

            const jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: bankData ? `${bankData.bankName} Home Loan Calculator` : `${bank.name} Home Loan Calculator`,
                description: bankData?.metaDescription || bank.description,
                author: {
                    '@type': 'Person',
                    name: 'Satyapal Khakhal',
                },
            };

            return (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                    <HomeLoanCalculatorClient
                        bankName={bank.name}
                        defaultInterestRate={bankData?.defaultRate || bank.interestRate}
                        ssrChartFallback={
                            <HomeLoanChartSSR
                                loanAmount={DEFAULT_LOAN_AMOUNT}
                                totalInterest={totalInterest}
                                principalPercent={principalPercent}
                                interestPercent={interestPercent}
                            />
                        }
                        ssrAmortizationFallback={
                            <HomeLoanAmortizationSSR
                                schedule={first12Months}
                                loanTenure={DEFAULT_LOAN_TENURE}
                                totalMonths={tenureMonths}
                            />
                        }
                        ssrBankContent={bankData ? <BankSpecificContent data={bankData} /> : undefined}
                    />
                </>
            );
        }
    }

    // If no match, return 404
    notFound();
}
