import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SIPCalculatorClient from '@/components/SIPCalculatorClient';
import HomeLoanCalculatorClient from '@/components/HomeLoanCalculatorClient';
import BankSpecificContent from '@/components/home-loan/BankSpecificContent';
import { getBankBySlug, getAllBankSlugs } from '@/lib/bankData';
import { getHomeLoanBankBySlug, getAllHomeLoanBankSlugs } from '@/lib/homeLoanBankData';
import { getBankHomeLoanDataBySlug } from '@/lib/bankHomeLoanData';

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
                    url: `https://www.gpaisa.in/calculator/${slug[0]}`,
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
        const bankData = getBankHomeLoanDataBySlug(slug[0]);

        if (bank) {
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
                        ssrBankContent={bankData ? <BankSpecificContent data={bankData} /> : undefined}
                    />
                </>
            );
        }
    }

    // If no match, return 404
    notFound();
}
