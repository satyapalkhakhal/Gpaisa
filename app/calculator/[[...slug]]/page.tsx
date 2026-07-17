import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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
import { CALCULATORS } from '@/lib/calculatorsList';
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

// ─── Calculator Hub Data ─────────────────────────────────────────────

// ─── Static Params ───────────────────────────────────────────────────

export async function generateStaticParams() {
    const sipSlugs = getAllBankSlugs();
    const homeLoanSlugs = getAllHomeLoanBankSlugs();

    return [
        ...sipSlugs.map((slug) => ({ slug: [`${slug}-sip-calculator`] })),
        ...homeLoanSlugs.map((slug) => ({ slug: [`${slug}-home-loan-calculator`] })),
    ];
}

// ─── Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Calculator Hub page (no slug)
    if (!slug || slug.length === 0) {
        return {
            title: 'Financial Calculators India — SIP, FD, EMI, Home Loan, GST & More | gpaisa.in',
            description: 'Free online financial calculators for India. SIP calculator, FD calculator, EMI calculator, home loan calculator, GST calculator, PPF, NPS, CAGR and more. Plan your investments with gpaisa.in.',
            authors: [{ name: 'Satyapal Khakhal' }],
            openGraph: {
                title: 'Financial Calculators India — SIP, FD, EMI, Home Loan, GST & More',
                description: '19 free financial calculators for Indian investors. SIP, FD, EMI, home loan, GST, PPF, NPS, CAGR and more.',
                type: 'website',
                url: 'https://www.gpaisa.in/calculator',
            },
            twitter: {
                card: 'summary_large_image',
                title: 'Financial Calculators India | gpaisa.in',
                description: '19 free financial calculators — SIP, FD, EMI, Home Loan, GST & more.',
                creator: '@gpaisa_in',
            },
            alternates: {
                canonical: 'https://www.gpaisa.in/calculator',
            },
        };
    }

    // Handle SIP calculator URLs — use enriched AMC data for meta tags
    if (slug && slug.length === 1 && slug[0].endsWith('-sip-calculator')) {
        const amcData = getSipAmcDataBySlug(slug[0]);
        const bank = getBankBySlug(slug[0].replace('-sip-calculator', ''));

        if (amcData) {
            return {
                title: amcData.metaTitle,
                description: amcData.metaDescription,
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

// ─── Calculator Hub Component ────────────────────────────────────────

function CalculatorHub() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': 'https://www.gpaisa.in/calculator/#webpage',
        'url': 'https://www.gpaisa.in/calculator',
        'name': 'Financial Calculators India — SIP, FD, EMI, Home Loan, GST & More | gpaisa.in',
        'description': 'Free online financial calculators for India. Plan your investments with SIP, FD, EMI, home loan, GST, PPF, NPS, CAGR calculators and more.',
        'isPartOf': { '@id': 'https://www.gpaisa.in/#website' },
        'author': {
            '@type': 'Person',
            'name': 'Satyapal Khakhal',
        },
        'inLanguage': 'en-IN',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium">Calculators</li>
                        </ol>
                    </nav>

                    {/* Hero */}
                    <div className="mb-10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                            Financial Calculators for India
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-3xl">
                            Free, accurate financial calculators to help you plan investments, calculate loan EMIs, estimate tax savings, and make smarter financial decisions. All tools are updated for 2026 rates.
                        </p>
                    </div>

                    {/* Calculator Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {CALCULATORS.map((calc) => (
                            <Link
                                key={calc.href}
                                href={calc.href}
                                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">{calc.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {calc.name}
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                                            {calc.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                                        Open Calculator →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Trust Section */}
                    <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-3">Why Use gpaisa.in Calculators?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <span className="text-green-500 font-bold mt-0.5">✓</span>
                                <p><strong className="text-gray-800">Accurate & Updated</strong> — All rates and formulas are updated for 2026. Calculations verified against official sources.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500 font-bold mt-0.5">✓</span>
                                <p><strong className="text-gray-800">100% Free</strong> — No sign-up required. No hidden fees. Use any calculator unlimited times.</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-green-500 font-bold mt-0.5">✓</span>
                                <p><strong className="text-gray-800">India-Specific</strong> — Built for Indian investors with INR amounts, Indian tax rules, and local bank rates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Main Page Component ─────────────────────────────────────────────

export default async function CalculatorCatchAll({ params }: Props) {
    const { slug } = await params;

    // Calculator Hub (no slug = /calculator)
    if (!slug || slug.length === 0) {
        return <CalculatorHub />;
    }

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
