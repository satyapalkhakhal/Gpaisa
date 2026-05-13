import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SIPCalculatorClient from '@/components/SIPCalculatorClient';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';
import { getBankBySlug, getAllBankSlugs } from '@/lib/bankData';
import { getHomeLoanBankBySlug, getAllHomeLoanBankSlugs } from '@/lib/homeLoanBankData';

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

    // Handle SIP calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-sip-calculator')) {
        const bankSlug = slug[0].replace('-sip-calculator', '');
        const bank = getBankBySlug(bankSlug);

        if (bank) {
            return {
                title: `${bank.name} SIP Calculator - Calculate ${bank.name} Mutual Fund Returns | Gpaisa`,
                description: bank.description,
                keywords: `${bank.name.toLowerCase()} sip calculator, ${bank.name.toLowerCase()} mutual fund calculator, sip calculator online`,
                openGraph: {
                    title: `${bank.name} SIP Calculator`,
                    description: bank.description,
                    type: 'website',
                    url: `https://gpaisa.in/calculator/${slug[0]}`,
                },
                alternates: {
                    canonical: `https://gpaisa.in/calculator/${slug[0]}`,
                },
            };
        }
    }

    // Handle Home Loan calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-home-loan-calculator')) {
        const bankSlug = slug[0].replace('-home-loan-calculator', '');
        const bank = getHomeLoanBankBySlug(bankSlug);

        if (bank) {
            return {
                title: `${bank.name} Home Loan Calculator - Calculate ${bank.name} Home Loan EMI | Gpaisa`,
                description: bank.description,
                keywords: `${bank.name.toLowerCase()} home loan calculator, ${bank.name.toLowerCase()} home loan emi, home loan calculator online`,
                openGraph: {
                    title: `${bank.name} Home Loan Calculator`,
                    description: bank.description,
                    type: 'website',
                    url: `https://gpaisa.in/calculator/${slug[0]}`,
                },
                alternates: {
                    canonical: `https://gpaisa.in/calculator/${slug[0]}`,
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

        if (bank) {
            const jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: `${bank.name} SIP Calculator`,
                description: bank.description,
            };

            return (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                    <SIPCalculatorClient bankName={bank.name} />
                </>
            );
        }
    }

    // Handle Home Loan calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-home-loan-calculator')) {
        const bankSlug = slug[0].replace('-home-loan-calculator', '');
        const bank = getHomeLoanBankBySlug(bankSlug);

        if (bank) {
            const jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: `${bank.name} Home Loan Calculator`,
                description: bank.description,
            };

            return (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                    <HomeLoanCalculatorClient
                        bankName={bank.name}
                        defaultInterestRate={bank.interestRate}
                    />
                </>
            );
        }
    }

    // If no match, return 404
    notFound();
}
