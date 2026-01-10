import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SIPCalculatorClient from '@/components/SIPCalculatorClient';
import { getBankBySlug, getAllBankSlugs } from '@/lib/bankData';

type Props = {
    params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
    const slugs = getAllBankSlugs();
    return slugs.map((slug) => ({
        slug: [`${slug}-sip-calculator`],
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Handle bank-specific SIP calculator URLs
    if (slug && slug.length === 1 && slug[0].endsWith('-sip-calculator')) {
        const bankSlug = slug[0].replace('-sip-calculator', '');
        const bank = getBankBySlug(bankSlug);

        if (bank) {
            return {
                title: `${bank.name} SIP Calculator - Calculate ${bank.name} Mutual Fund Returns | Gpaisa`,
                description: bank.description,
                keywords: [
                    `${bank.name.toLowerCase()} sip calculator`,
                    `${bank.name.toLowerCase()} mutual fund calculator`,
                    `${bank.name.toLowerCase()} sip returns`,
                    'sip calculator online',
                ].join(', '),
                openGraph: {
                    title: `${bank.name} SIP Calculator`,
                    description: bank.description,
                    type: 'website',
                    url: `https://gpaisa.com/calculator/${slug[0]}`,
                },
                alternates: {
                    canonical: `https://gpaisa.com/calculator/${slug[0]}`,
                },
            };
        }
    }

    return {};
}

export default async function CalculatorCatchAll({ params }: Props) {
    const { slug } = await params;

    // Handle bank-specific SIP calculator URLs
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

    // If no match, return 404
    notFound();
}
